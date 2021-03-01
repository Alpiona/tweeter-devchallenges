// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { profile } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';

type Data = {
  name: string;
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse<profile>,
): Promise<void> => {
  const result = await prisma.profile.create({
    data: {
      username: 'Alpiona',
      email: 'alpiona@hotmail.com',
    },
  });

  res.status(200).json(result);
};
