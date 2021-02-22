// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  name: string;
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse<Data>,
): Promise<void> => {
  res.status(200).json({ name: 'John Doe' });
};
