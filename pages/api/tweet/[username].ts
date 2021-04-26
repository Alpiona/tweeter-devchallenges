// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
import { Profile, Tweet } from '.prisma/client';
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
  const username = req.query.username as string;
  const filter = parseInt(req.query.filter as string, 10);

  const profile = await prisma.profile.findUnique({
    where: { username },
    include: { followers: true },
  });

  if (!profile) {
    res.status(404).end();
    return;
  }

  const session = await getSession({ req });
  const sessionUsername = session && session.user.name.toLowerCase();

  let tweets: any[];

  switch (filter) {
    case TweetsProfileFilterEnum.TWEETS:
    default:
      tweets = await getTweets(profile, sessionUsername);
      break;

    case TweetsProfileFilterEnum.TWEETS_REPLIES:
      tweets = await getTweetsAndReplies(profile, sessionUsername);
      break;

    case TweetsProfileFilterEnum.MEDIA:
      tweets = await getTweetsWithMedia(profile, sessionUsername);
      break;

    case TweetsProfileFilterEnum.LIKES:
      tweets = await getTweetsWithLike(profile, sessionUsername);
      break;
  }

  const tweetsFormated: TweetData[] = tweets.map(tweet => {
    let retweetedByName: string;
    let retweetedByUsername: string;

    if (
      tweet.profile.id !== profile.id &&
      tweet.retweeters.some(retweeter => retweeter.id === profile.id)
    ) {
      retweetedByName = profile.name;
      retweetedByUsername = profile.username;
    }

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
      retweetedByName,
      retweetedByUsername,
    };
  });

  res.status(200).json({ tweets: tweetsFormated });
};

async function getTweets(
  profile: Profile,
  sessionUsername: string,
): Promise<Tweet[]> {
  const tweets = await prisma.tweet.findMany({
    where: {
      AND: [
        {
          OR: [
            { isPublic: true },
            {
              profile:
                sessionUsername != null
                  ? { followers: { some: { username: sessionUsername } } }
                  : undefined,
            },
          ],
        },
        {
          OR: [
            { profile: { id: profile.id } },
            { retweeters: { some: { id: profile.id } } },
          ],
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

async function getTweetsAndReplies(
  profile: Profile,
  sessionUsername: string,
): Promise<Tweet[]> {
  const tweets = await prisma.tweet.findMany({
    where: {
      AND: [
        {
          OR: [
            { isPublic: true },
            {
              profile:
                sessionUsername != null
                  ? { followers: { some: { username: sessionUsername } } }
                  : undefined,
            },
          ],
        },
        {
          OR: [
            { profile: { id: profile.id } },
            { retweeters: { some: { id: profile.id } } },
            { comments: { some: { profile: { id: profile.id } } } },
          ],
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

async function getTweetsWithMedia(
  profile: Profile,
  sessionUsername: string,
): Promise<Tweet[]> {
  const tweets = await prisma.tweet.findMany({
    where: {
      AND: [
        {
          OR: [
            { isPublic: true },
            {
              profile:
                sessionUsername != null
                  ? { followers: { some: { username: sessionUsername } } }
                  : undefined,
            },
          ],
        },
        {
          OR: [
            { profile: { id: profile.id } },
            { retweeters: { some: { id: profile.id } } },
          ],
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

async function getTweetsWithLike(
  profile: Profile,
  sessionUsername: string,
): Promise<Tweet[]> {
  const tweets = await prisma.tweet.findMany({
    where: {
      AND: [
        {
          OR: [
            { isPublic: true },
            {
              profile:
                sessionUsername != null
                  ? { followers: { some: { username: sessionUsername } } }
                  : undefined,
            },
          ],
        },
        { likes: { some: { id: profile.id } } },
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
