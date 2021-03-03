// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { Profile } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
import prisma from '../../lib/prisma';

type Data = {
  name: string;
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse<Profile>,
): Promise<void> => {
  const session = await getSession({ req });

  const result = await prisma.profile.create({
    data: {
      username: session.user.name,
      email: session.user.email,
    },
  });

  res.status(200).json(result);
};
