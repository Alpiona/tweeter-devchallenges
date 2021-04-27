// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
import { subDays } from 'date-fns';
import { Tweet } from '.prisma/client';
import prisma from '../../../lib/prisma';
import { TweetsExploreFilterEnum } from '../../../constants/TweetsExploreFilterEnum';

type TweetData = {
  id: number;
  profileName: string;
  profileImage: string;
  profileUsername: string;
  updatedAt: Date;
  createdAt: Date;
  content: string;
  commentsQty: number;
  retweetsQty: number;
  savesQty: number;
  isLiked: boolean;
  isRetweeted: boolean;
  isSaved: boolean;
  retweetedByName: string;
  retweetedByUsername: string;
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  const filter = parseInt(req.query.filter as string, 10);

  const session = await getSession({ req });
  const sessionUsername = session && session.user.name.toLowerCase();

  let tweets: any[];

  switch (filter) {
    case TweetsExploreFilterEnum.TOP:
    default:
      tweets = await getTopTweets(sessionUsername);
      break;

    case TweetsExploreFilterEnum.LASTEST:
      tweets = await getLastestTweets(sessionUsername);
      break;

    case TweetsExploreFilterEnum.MEDIA:
      tweets = await getMediaTweets(sessionUsername);
      break;
  }

  const tweetsFormated: TweetData[] = tweets.map(tweet => {
    return {
      id: tweet.id,
      profileName: tweet.profile.name,
      profileUsername: tweet.profile.username,
      profileImage: tweet.profile.profileImage,
      updatedAt: tweet.updatedAt,
      createdAt: tweet.createdAt,
      content: tweet.content,
      commentsQty: tweet.comments.length,
      retweetsQty: tweet.retweeters.length,
      savesQty: tweet.saves.length,
      isLiked:
        session && tweet.likes.some(lp => lp.username === sessionUsername),
      isRetweeted:
        session && tweet.retweeters.some(rp => rp.username === sessionUsername),
      isSaved:
        session && tweet.saves.some(sp => sp.username === sessionUsername),
      retweetedByName: null,
      retweetedByUsername: null,
    };
  });

  res.status(200).json({ tweets: tweetsFormated });
};

async function getTopTweets(sessionUsername: string): Promise<Tweet[]> {
  const tweets = await prisma.tweet.findMany({
    where: {
      AND: [
        { isPublic: true },
        {
          profile:
            sessionUsername != null
              ? { followers: { none: { username: sessionUsername } } }
              : undefined,
        },
        { createdAt: { gte: subDays(new Date(), 7) } },
      ],
    },
    orderBy: { likes: { count: 'asc' } },
    include: {
      likes: true,
      retweeters: true,
      saves: true,
      comments: true,
      profile: true,
    },
  });

  return tweets;
}

async function getLastestTweets(sessionUsername: string): Promise<Tweet[]> {
  const tweets = await prisma.tweet.findMany({
    where: {
      AND: [
        { isPublic: true },
        {
          profile:
            sessionUsername != null
              ? { followers: { none: { username: sessionUsername } } }
              : undefined,
        },
      ],
    },
    orderBy: { createdAt: 'desc' },
    include: {
      likes: true,
      retweeters: true,
      saves: true,
      comments: true,
      profile: true,
    },
  });

  return tweets;
}

async function getMediaTweets(sessionUsername: string): Promise<Tweet[]> {
  const tweets = await prisma.tweet.findMany({
    where: {
      AND: [
        { isPublic: true },
        {
          profile:
            sessionUsername != null
              ? { followers: { none: { username: sessionUsername } } }
              : undefined,
        },
        { images: { some: { content: { not: { in: [] } } } } },
      ],
    },
    orderBy: { createdAt: 'desc' },
    include: {
      likes: true,
      retweeters: true,
      saves: true,
      comments: true,
      profile: true,
    },
  });

  return tweets;
}
