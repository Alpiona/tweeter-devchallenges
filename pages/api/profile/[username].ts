// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession, Session } from 'next-auth/client';
import { getToken } from 'next-auth/jwt';
import prisma from '../../../lib/prisma';
import api from '../../../utils/api';

type ProfileData = {
  name: string;
  username: string;
  profile_image: string;
  description?: string;
  background_image?: string;
  following_qty: string;
  follower_qty: string;
  is_following: boolean;
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse<Session>,
): Promise<void> => {
  const username = req.query.username as string;

  const result = await prisma.profile.findUnique({
    where: {
      username,
    },
    include: {
      follower: true,
      following: true,
    },
  });

  const apiRes = await axios.get<Session>(
    `http://localhost:3000/api/auth/session`,
  );

  const secret = process.env.BASE_URL;
  const session = await getSession({ req });
  const token = await getToken({ req, secret });

  console.log(apiRes.data);
  console.log(session);
  console.log(token);

  res.status(200).json(session);
  return;

  const sessionProfile = await prisma.profile.findUnique({
    where: { username: apiRes.data.user.name },
  });

  const isFollowing = result.follower.includes({
    follower_id: sessionProfile.id,
    following_id: result.id,
  });

  const ret: ProfileData = {
    name: result.name,
    username: result.username,
    profile_image: result.profileImage,
    description: result.description,
    follower_qty: result.follower.length.toString(),
    following_qty: result.following.length.toString(),
    is_following: isFollowing,
    background_image: result.backgroundImage,
  };

  res.status(200).json(ret);
};
