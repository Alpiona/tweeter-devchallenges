import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
import { Follower, Profile } from '.prisma/client';
import prisma from '../../../lib/prisma';

type ModalProfileData = {
  image: string;
  name: string;
  username: string;
  description: string;
  followersQty: number;
  isFollowing?: boolean;
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  const username = req.query.slug[0];
  const type = req.query.slug[1];

  const profile = await prisma.profile.findUnique({ where: { username } });

  switch (req.method) {
    case 'GET': {
      switch (type) {
        case 'follow': {
          const sessionProfile = await getSessionProfile(req);
          if (!sessionProfile) {
            res.status(404).end();
          } else {
            const isFollowing = sessionProfile.following.some(
              following => following.followingId === profile.id,
            );

            res.status(200).json({ isFollowing });
          }
          break;
        }

        case 'following': {
          const following = await prisma.profile.findMany({
            where: { followers: { some: { followerId: profile.id } } },
            include: {
              following: { include: { following: true } },
              followers: true,
            },
          });
          const sessionProfile = await getSessionProfile(req);

          const profilesFomarted: ModalProfileData[] = following.map(
            followingProfile => {
              return {
                image: followingProfile.profileImage,
                name: followingProfile.name,
                username: followingProfile.username,
                description: followingProfile.description,
                followersQty: followingProfile.followers.length,
                isFollowing: sessionProfile
                  ? followingProfile.followers.some(
                      follower => follower.followerId === sessionProfile.id,
                    )
                  : null,
              };
            },
          );

          res.status(200).json(profilesFomarted);
          break;
        }

        case 'followers': {
          const followers = await prisma.profile.findMany({
            where: { following: { some: { followingId: profile.id } } },
            include: {
              following: { include: { following: true } },
              followers: true,
            },
          });

          const sessionProfile = await getSessionProfile(req);

          const profilesFomarted: ModalProfileData[] = followers.map(
            followerProfile => {
              return {
                image: followerProfile.profileImage,
                name: followerProfile.name,
                username: followerProfile.username,
                description: followerProfile.description,
                followersQty: followerProfile.followers.length,
                isFollowing: sessionProfile
                  ? followerProfile.followers.some(
                      follower => follower.followerId === sessionProfile.id,
                    )
                  : null,
              };
            },
          );
          res.status(200).json(profilesFomarted);
          break;
        }

        default:
          res.status(400).end();
      }
      break;
    }

    case 'PATCH': {
      switch (type) {
        case 'follow': {
          const sessionProfile = await getSessionProfile(req);
          if (!sessionProfile) {
            res.status(404).end();
          } else {
            const isFollowing = sessionProfile.following.some(
              following => following.followingId === profile.id,
            );

            const { status, content } = await updateFollowing(
              isFollowing,
              sessionProfile.id,
              profile.id,
            );

            res.status(status).json(content);
          }
          break;
        }

        default:
          res.status(404).end();
      }
      break;
    }

    default:
      res.status(404).end();
  }
};

async function getSessionProfile(
  req: NextApiRequest,
): Promise<Profile & { following: Follower[] }> {
  const session = await getSession({ req });

  let profileSession: Profile & { following: Follower[] };
  if (session) {
    profileSession = await prisma.profile.findUnique({
      where: { username: session.user.name.toLowerCase() },
      include: { following: true },
    });
  }

  return profileSession;
}

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
