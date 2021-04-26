// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
import prisma from '../../../../lib/prisma';

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  const username = req.query.username as string;
  const action = req.query.action as string;

  const session = await getSession({ req });

  if (!session) {
    res.status(404).end();
    return;
  }

  if (action === 'follow') {
    await prisma.profile.update({
      where: { username },
      data: {
        followers: { connect: { username: session.user.name.toLowerCase() } },
      },
    });
  } else if (action === 'unfollow') {
    await prisma.profile.update({
      where: { username },
      data: {
        followers: {
          disconnect: { username: session.user.name.toLowerCase() },
        },
      },
    });
  }

  res.status(200).end();
};
