// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  const hashtags = await prisma.hashtag.findMany({
    include: { _count: { select: { tweets: true } } },
    orderBy: { tweets: { count: 'desc' } },
    take: 5,
  });

  const retHashtags = hashtags.map(hashtag => {
    return {
      content: hashtag.content,
      quantity: hashtag._count.tweets,
    };
  });
  res.status(200).json({ hashtags: retHashtags });
};
