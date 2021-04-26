import _ from 'lodash';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
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
  const sessionUsername = session.user.name.toLowerCase();

  switch (req.method) {
    case 'PATCH':
      switch (type) {
        case 'like': {
          const newStatus = req.query.status === 'true';

          const { status, content } = await updateLikeStatus(
            id,
            sessionUsername,
            newStatus,
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
  sessionUsername: string,
  newStatus: boolean,
): Promise<{ status: number; content: unknown }> {
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    include: {
      likes: true,
      tweet: true,
      profile: { include: { followers: true } },
    },
  });

  if (
    !comment.tweet.isPublic &&
    !comment.profile.followers.some(
      follower => follower.username === sessionUsername,
    )
  ) {
    return { status: 404, content: {} };
  }

  if (newStatus) {
    await prisma.comment.update({
      where: { id: commentId },
      data: { likes: { connect: { username: sessionUsername } } },
    });
  } else {
    await prisma.comment.update({
      where: { id: commentId },
      data: { likes: { disconnect: { username: sessionUsername } } },
    });
  }

  return { status: 200, content: {} };
}
