import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
import { Follower, Profile } from '.prisma/client';
import prisma from '../../../lib/prisma';

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  const followingUsername = req.query.slug[0];
  const type = req.query.slug[1];

  const session = await getSession({ req });

  let profileSession: Profile & { following: Follower[] };
  if (session) {
    profileSession = await prisma.profile.findUnique({
      where: { username: session.user.name.toLowerCase() },
      include: { following: true },
    });
  }

  switch (req.method) {
    case 'GET': {
      switch (type) {
        case 'follow': {
          if (!session) {
            res.status(404);
          } else {
            const profileFollowing = await prisma.profile.findUnique({
              where: { username: followingUsername },
            });

            const isFollowing = profileSession.following.some(
              following => following.followingId === profileFollowing.id,
            );

            res.status(200).json({ isFollowing });
          }
          break;
        }

        default:
          res.status(400);
      }
      break;
    }

    case 'PATCH': {
      switch (type) {
        case 'follow': {
          if (!session) {
            res.status(404);
          } else {
            const profileFollowing = await prisma.profile.findUnique({
              where: { username: followingUsername },
            });

            const isFollowing = profileSession.following.some(
              following => following.followingId === profileFollowing.id,
            );

            const { status, content } = await updateFollowing(
              isFollowing,
              profileSession.id,
              profileFollowing.id,
            );

            res.status(status).json(content);
          }
          break;
        }

        default:
          res.status(404);
      }
      break;
    }

    default:
      res.status(404);
  }
};

async function updateFollowing(
  isFollowing: boolean,
  followerId: number,
  followingId: number,
): Promise<{ status: number; content: unknown }> {
  try {
    if (isFollowing) {
      await prisma.follower.delete({
        where: {
          followerId_followingId: {
            followerId,
            followingId,
          },
        },
      });
    } else {
      await prisma.follower.create({
        data: {
          followerId,
          followingId,
        },
      });
    }
    return { status: 200, content: { isFollowing: !isFollowing } };
  } catch (err) {
    return { status: 500, content: err };
  }
}
