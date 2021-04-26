// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import _ from 'lodash';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';

type ProfilesFollowingData = {
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
      following: { include: { followers: true } },
    },
  });

  const title = `${profile.name} is following`;

  const list: ProfilesFollowingData[] = profile.following.map(following => {
    return {
      image: following.profileImage,
      name: following.name,
      username: following.username,
      description: following.description,
      followersQty: following.followers.length,
    };
  });

  res.status(200).json({ title, list });
};
