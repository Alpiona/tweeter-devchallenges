// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
import prisma from '../../../lib/prisma';

type FollowSuggestionData = {
  profileImage: string;
  profileName: string;
  profileUsername: string;
  followersQty: number;
  description: string;
  image: string;
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  const session = await getSession({ req });
  const sessionUsername = session?.user?.name?.toLowerCase();

  const suggestionProfiles = await prisma.profile.findMany({
    where: {
      username: { not: sessionUsername != null ? sessionUsername : undefined },
      followers: {
        none: {
          username: sessionUsername != null ? sessionUsername : undefined,
        },
      },
    },
    include: { followers: true },
    take: 10,
  });

  const profilesSorted = suggestionProfiles
    .sort(() => {
      return 0.5 - Math.random();
    })
    .splice(0, 3);

  const formatedProfiles: FollowSuggestionData[] = profilesSorted.map(
    profile => {
      return {
        description: profile.description,
        followersQty: profile.followers.length,
        image: profile.backgroundImage,
        profileImage: profile.profileImage,
        profileName: profile.name,
        profileUsername: profile.username,
      };
    },
  );

  res.status(200).json({ profiles: formatedProfiles });
};
