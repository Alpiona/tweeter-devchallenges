import { NextApiRequest, NextApiResponse } from 'next';
import _ from 'lodash';
import { getSession } from 'next-auth/client';
import prisma from '../../../lib/prisma';

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

  switch (req.method) {
    case 'GET':
      switch (type) {
        case 'comments': {
          const { status, content } = await getComments(
            tweetId,
            session.user.name.toLowerCase(),
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
          if (_.isEmpty(req.query.status)) {
            res.status(404).end();
            return;
          }

          const newStatus = req.query.status === 'true';

          const { status, content } = await updateLikeStatus(
            tweetId,
            session.user.name.toLowerCase(),
            newStatus,
          );
          res.status(status).json(content);
          break;
        }

        case 'retweet': {
          if (_.isEmpty(req.query.status)) {
            res.status(404).end();
            return;
          }

          const newStatus = req.query.status === 'true';

          const { status, content } = await updateRetweetStatus(
            tweetId,
            session.user.name.toLowerCase(),
            newStatus,
          );
          res.status(status).json(content);
          break;
        }

        case 'save': {
          if (_.isEmpty(req.query.status)) {
            res.status(404).end();
            return;
          }

          const newStatus = req.query.status === 'true';

          const { status, content } = await updateSaveStatus(
            tweetId,
            session.user.name.toLowerCase(),
            newStatus,
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
  sessionUsername: string,
): Promise<{ status: number; content: unknown }> {
  const tweet = await prisma.tweet.findUnique({
    where: { id: Number(tweetId) },
    include: {
      comments: { include: { profile: true, likes: true } },
      profile: { include: { followers: true } },
    },
  });

  const sessionProfile = await prisma.profile.findUnique({
    where: { username: sessionUsername },
  });

  if (
    !tweet.isPublic &&
    !tweet.profile.followers.some(
      follower => follower.username === sessionUsername,
    )
  ) {
    return { status: 404, content: null };
  }

  const comments = tweet.comments.map(comment => {
    return {
      id: comment.id,
      userImage: comment.profile.profileImage,
      userName: comment.profile.name,
      userUsername: comment.profile.username,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      content: comment.content,
      likesQty: comment.likes.length,
      isLiked:
        sessionProfile &&
        comment.likes.some(like => like.id === sessionProfile.id),
    };
  });
  return { status: 200, content: { comments } };
}

async function updateLikeStatus(
  tweetId: number,
  sessionUsername: string,
  newStatus: boolean,
): Promise<{ status: number; content: unknown }> {
  const tweet = await prisma.tweet.findUnique({
    where: { id: Number(tweetId) },
    include: { profile: { include: { followers: true } } },
  });

  if (
    !tweet.isPublic &&
    !tweet.profile.followers.some(
      follower => follower.username === sessionUsername,
    )
  ) {
    return { status: 404, content: null };
  }

  if (newStatus) {
    await prisma.tweet.update({
      where: { id: tweetId },
      data: { likes: { connect: { username: sessionUsername } } },
    });
  } else {
    await prisma.tweet.update({
      where: { id: tweetId },
      data: { likes: { disconnect: { username: sessionUsername } } },
    });
  }

  return { status: 200, content: newStatus };
}

async function updateRetweetStatus(
  tweetId: number,
  sessionUsername: string,
  newStatus: boolean,
): Promise<{ status: number; content: unknown }> {
  const tweet = await prisma.tweet.findUnique({
    where: { id: Number(tweetId) },
    include: { profile: { include: { followers: true } } },
  });

  if (
    !tweet.isPublic &&
    !tweet.profile.followers.some(
      follower => follower.username === sessionUsername,
    )
  ) {
    return { status: 404, content: null };
  }

  if (newStatus) {
    await prisma.tweet.update({
      where: { id: tweetId },
      data: { retweeters: { connect: { username: sessionUsername } } },
    });
  } else {
    await prisma.tweet.update({
      where: { id: tweetId },
      data: { retweeters: { disconnect: { username: sessionUsername } } },
    });
  }

  return { status: 200, content: newStatus };
}

async function updateSaveStatus(
  tweetId: number,
  sessionUsername: string,
  newStatus: boolean,
): Promise<{ status: number; content: unknown }> {
  const tweet = await prisma.tweet.findUnique({
    where: { id: Number(tweetId) },
    include: { profile: { include: { followers: true } } },
  });

  if (
    !tweet.isPublic &&
    !tweet.profile.followers.some(
      follower => follower.username === sessionUsername,
    )
  ) {
    return { status: 404, content: null };
  }

  if (newStatus) {
    await prisma.tweet.update({
      where: { id: tweetId },
      data: { saves: { connect: { username: sessionUsername } } },
    });
  } else {
    await prisma.tweet.update({
      where: { id: tweetId },
      data: { saves: { disconnect: { username: sessionUsername } } },
    });
  }

  return { status: 200, content: newStatus };
}
