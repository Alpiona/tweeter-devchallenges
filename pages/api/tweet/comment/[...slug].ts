import _ from 'lodash';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
import { Profile } from '.prisma/client';
import prisma from '../../../../lib/prisma';

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  const id = parseInt(req.query.slug[0], 10);
  const type = req.query.slug[1];

  if (!_.isNumber(id)) {
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
    case 'PATCH':
      switch (type) {
        case 'like': {
          const { status, content } = await updateLikeStatus(
            id,
            profileSession,
          );
          res.status(status).json(content);
          break;
        }

        default:
          res.status(404);
      }
      break;

    default:
      res.status(404);
  }
};

async function updateLikeStatus(
  commentId: number,
  profileSession: Profile,
): Promise<{ status: number; content: unknown }> {
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    include: {
      commentLikes: true,
      tweet: true,
      profile: { include: { followers: true } },
    },
  });

  if (
    !comment.tweet.isPublic &&
    !comment.profile.followers.some(
      follower => follower.followerId === profileSession.id,
    )
  ) {
    return { status: 404, content: {} };
  }

  const isLiked = comment.commentLikes.some(
    like => like.profileId === profileSession.id,
  );

  if (isLiked) {
    await prisma.commentLike.delete({
      where: {
        commentId_profileId: {
          commentId: comment.id,
          profileId: profileSession.id,
        },
      },
    });

    return { status: 200, content: false };
  }

  await prisma.commentLike.create({
    data: {
      commentId: comment.id,
      profileId: profileSession.id,
    },
  });

  return { status: 200, content: true };
}
