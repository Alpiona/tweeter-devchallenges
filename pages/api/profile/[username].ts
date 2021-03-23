// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

type ProfileData = {
  name: string;
  username: string;
  profile_image: string;
  description?: string;
  background_image?: string;
  following_qty: string;
  follower_qty: string;
  is_following: boolean;
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  const username = req.query.username as string;

  const profile = await prisma.profile.findUnique({
    where: {
      username,
    },
    include: {
      follower: true,
      following: true,
    },
  });

  const ret: ProfileData = {
    name: profile.name,
    username: profile.username,
    profile_image: profile.profileImage,
    description: profile.description,
    follower_qty: profile.follower.length.toString(),
    following_qty: profile.following.length.toString(),
    is_following: true,
    background_image: profile.backgroundImage,
  };

  res.status(200).json(ret);
};
