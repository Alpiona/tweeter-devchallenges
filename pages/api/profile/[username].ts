// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
import prisma from '../../../lib/prisma';

type ProfileData = {
  name: string;
  profile_image: string;
  description?: string;
  background_image?: string;
  following_qty: string;
  follower_qty: string;
  is_following: boolean;
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse<ProfileData>,
): Promise<void> => {
  const result = await prisma.profile.findUnique({
    where: {
      id: 1,
    },
    include: {
      follower: true,
      following: true,
    },
  });

  const session = await getSession({ req });

  const sessionProfile = await prisma.profile.findUnique({
    where: { username: session.user.name },
  });

  const isFollowing = result.follower.includes({
    follower_id: sessionProfile.id,
    following_id: result.id,
  });

  const ret: ProfileData = {
    name: result.name,
    profile_image: result.profileImage,
    description: result.description,
    follower_qty: result.follower.length.toString(),
    following_qty: result.following.length.toString(),
    is_following: isFollowing,
    background_image: result.backgroundImage,
  };

  res.status(200).json(ret);
};
