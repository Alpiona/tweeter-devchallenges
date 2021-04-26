// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';

type ProfileData = {
  name: string;
  username: string;
  profileImage: string;
  description?: string;
  backgroundImage?: string;
  followingQty: number;
  followerQty: number;
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  const username = req.query.username as string;

  const profile = await prisma.profile.findUnique({
    where: { username },
    include: { followers: true, following: true },
  });

  if (!profile) {
    res.status(404).end();
    return;
  }

  const ret: ProfileData = {
    name: profile.name,
    username: profile.username,
    profileImage: profile.profileImage,
    description: profile.description,
    followerQty: profile.followers.length,
    followingQty: profile.following.length,
    backgroundImage: profile.backgroundImage,
  };

  res.status(200).json(ret);
};
