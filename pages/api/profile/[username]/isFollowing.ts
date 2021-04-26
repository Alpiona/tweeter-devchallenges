// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import _ from 'lodash';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
import prisma from '../../../../lib/prisma';

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  const username = req.query.username as string;

  const session = await getSession({ req });

  const sessionUsername = session?.user?.name?.toLowerCase();
  if (_.isEmpty(sessionUsername)) {
    res.status(200).json({ isFollowing: null });
    return;
  }

  const isFollowing = await prisma.profile.count({
    where: { username, following: { some: { username: sessionUsername } } },
  });

  res.status(200).json({ isFollowing: isFollowing > 0 });
};
