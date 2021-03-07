// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { Profile } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async (
  req: NextApiRequest,
  res: NextApiResponse<Profile[]>,
): Promise<void> => {
  const result = await prisma.profile.findMany();

  const ret = result;
  res.status(200).json(ret);
};
