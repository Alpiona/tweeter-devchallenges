// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
import { Tweet } from '.prisma/client';
import prisma from '../../../lib/prisma';
import { TweetsProfileFilterEnum } from '../../../constants/TweetsProfileFilterEnum';

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

  if (!session) {
    res.status(404).end();
    return;
  }

  const sessionUsername = session && session.user.name.toLowerCase();

  let tweets: any[];

  switch (filter) {
    case TweetsProfileFilterEnum.TWEETS:
    case TweetsProfileFilterEnum.TWEETS_REPLIES:
    default:
      tweets = await getTweets(sessionUsername);
      break;

    case TweetsProfileFilterEnum.MEDIA:
      tweets = await getTweetsWithMedia(sessionUsername);
      break;

    case TweetsProfileFilterEnum.LIKES:
      tweets = await getTweetsWithLike(sessionUsername);
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

async function getTweets(sessionUsername: string): Promise<Tweet[]> {
  const tweets = await prisma.tweet.findMany({
    where: {
      saves: { some: { username: sessionUsername } },
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

async function getTweetsWithMedia(sessionUsername: string): Promise<Tweet[]> {
  const tweets = await prisma.tweet.findMany({
    where: {
      AND: [
        { saves: { some: { username: sessionUsername } } },
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

async function getTweetsWithLike(sessionUsername: string): Promise<Tweet[]> {
  const tweets = await prisma.tweet.findMany({
    where: {
      AND: [
        { saves: { some: { username: sessionUsername } } },
        { likes: { some: { username: sessionUsername } } },
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
