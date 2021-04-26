// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import _ from 'lodash';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';

type ProfilesFollowersData = {
  image: string;
  name: string;
  username: string;
  description: string;
  followersQty: number;
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  const username = req.query.username as string;

  if (_.isEmpty(username)) {
    res.status(404).end();
    return;
  }

  const profile = await prisma.profile.findUnique({
    where: { username },
    include: {
      followers: { include: { followers: true } },
    },
  });

  const title = `${profile.name} followers`;

  const list: ProfilesFollowersData[] = profile.followers.map(follower => {
    return {
      image: follower.profileImage,
      name: follower.name,
      username: follower.username,
      description: follower.description,
      followersQty: follower.followers.length,
    };
  });

  res.status(200).json({ title, list });
};
