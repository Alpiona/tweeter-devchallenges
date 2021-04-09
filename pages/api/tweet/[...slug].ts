import { NextApiRequest, NextApiResponse } from 'next';
import _ from 'lodash';
import { getSession } from 'next-auth/client';
import prisma from '../../../lib/prisma';
import { Profile } from '.prisma/client';

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  const tweetId = parseInt(req.query.slug[0], 10);
  const type = req.query.slug[1];

  if (!_.isNumber(tweetId)) {
    res.status(404);
    return;
  }

  const session = await getSession({ req });

  let profileSession: Profile;

  if (session) {
    profileSession = await prisma.profile.findUnique({
      where: { username: session.user.name.toLowerCase() },
    });
  }

  switch (req.method) {
    case 'GET':
      switch (type) {
        case 'comments': {
          const { status, content } = await getComments(
            tweetId,
            profileSession,
          );
          res.status(status).json(content);
          break;
        }

        default:
          res.status(404);
      }
      break;

    case 'PATCH': {
      switch (type) {
        case 'like': {
          const { status, content } = await updateLikeStatus(
            tweetId,
            profileSession,
          );
          res.status(status).json(content);
          break;
        }

        case 'retweet': {
          const { status, content } = await updateRetweetStatus(
            tweetId,
            profileSession,
          );
          res.status(status).json(content);
          break;
        }

        case 'save': {
          const { status, content } = await updateSaveStatus(
            tweetId,
            profileSession,
          );
          res.status(status).json(content);
          break;
        }

        default:
          res.status(404);
      }
      break;
    }

    default:
      res.status(404);
      break;
  }
};

async function getComments(
  tweetId: number,
  profileSession: Profile,
): Promise<{ status: number; content: unknown }> {
  const tweet = await prisma.tweet.findUnique({
    where: { id: Number(tweetId) },
    include: {
      comments: {
        include: {
          profile: true,
          commentLikes: true,
        },
      },
      profile: {
        include: {
          followers: true,
        },
      },
    },
  });

  if (
    !tweet.isPublic &&
    !tweet.profile.followers.some(
      follower => follower.followerId === profileSession.id,
    )
  ) {
    return { status: 404, content: null };
  }

  const comments = tweet.comments.map(comment => {
    return {
      id: comment.id,
      userImage: comment.profile.profileImage,
      userName: comment.profile.name,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      content: comment.content,
      likesQty: comment.commentLikes.length,
      isLiked:
        profileSession &&
        comment.commentLikes.some(like => like.profileId === profileSession.id),
    };
  });
  return { status: 200, content: { comments } };
}

async function updateLikeStatus(
  tweetId: number,
  profileSession: Profile,
): Promise<{ status: number; content: unknown }> {
  const tweet = await prisma.tweet.findUnique({
    where: { id: Number(tweetId) },
    include: {
      comments: {
        include: {
          profile: true,
          commentLikes: true,
        },
      },
      profile: {
        include: {
          followers: true,
        },
      },
      likes: true,
    },
  });

  if (
    !tweet.isPublic &&
    !tweet.profile.followers.some(
      follower => follower.followerId === profileSession.id,
    )
  ) {
    return { status: 404, content: null };
  }

  const isLiked = tweet.likes.some(
    like => like.profileId === profileSession.id,
  );

  if (isLiked) {
    await prisma.tweetLike.delete({
      where: {
        tweetId_profileId: { tweetId: tweet.id, profileId: profileSession.id },
      },
    });
    return { status: 200, content: false };
  }

  await prisma.tweetLike.create({
    data: {
      tweetId: tweet.id,
      profileId: profileSession.id,
    },
  });

  return { status: 200, content: true };
}

async function updateRetweetStatus(
  tweetId: number,
  profileSession: Profile,
): Promise<{ status: number; content: unknown }> {
  const tweet = await prisma.tweet.findUnique({
    where: { id: Number(tweetId) },
    include: {
      comments: {
        include: {
          profile: true,
          commentLikes: true,
        },
      },
      profile: {
        include: {
          followers: true,
        },
      },
      retweeters: true,
    },
  });

  if (
    !tweet.isPublic &&
    !tweet.profile.followers.some(
      follower => follower.followerId === profileSession.id,
    )
  ) {
    return { status: 404, content: null };
  }

  const isRetweeted = tweet.retweeters.some(
    profile => profile.id === profileSession.id,
  );

  if (isRetweeted) {
    await prisma.tweet.update({
      where: {
        id: tweet.id,
      },
      data: {
        retweeters: {
          disconnect: {
            id: profileSession.id,
          },
        },
      },
    });
    return { status: 200, content: false };
  }

  await prisma.tweet.update({
    where: {
      id: tweet.id,
    },
    data: {
      retweeters: {
        connect: {
          id: profileSession.id,
        },
      },
    },
  });

  return { status: 200, content: true };
}

async function updateSaveStatus(
  tweetId: number,
  profileSession: Profile,
): Promise<{ status: number; content: unknown }> {
  const tweet = await prisma.tweet.findUnique({
    where: { id: Number(tweetId) },
    include: {
      comments: {
        include: {
          profile: true,
          commentLikes: true,
        },
      },
      profile: {
        include: {
          followers: true,
        },
      },
      saves: true,
    },
  });

  if (
    !tweet.isPublic &&
    !tweet.profile.followers.some(
      follower => follower.followerId === profileSession.id,
    )
  ) {
    return { status: 404, content: null };
  }

  const isSaved = tweet.saves.some(
    save => save.profileId === profileSession.id,
  );

  if (isSaved) {
    await prisma.tweetSave.delete({
      where: {
        tweetId_profileId: { tweetId: tweet.id, profileId: profileSession.id },
      },
    });
    return { status: 200, content: false };
  }

  await prisma.tweetSave.create({
    data: {
      tweetId: tweet.id,
      profileId: profileSession.id,
    },
  });

  return { status: 200, content: true };
}
