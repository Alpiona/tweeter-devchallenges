// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
import { Profile, Tweet } from '.prisma/client';
import { TweetsFilterEnum } from '../../../constants/TweetsFilterEnum';
import prisma from '../../../lib/prisma';

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
  retweetedBy: string;
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  const username = req.query.username as string;
  const filter = parseInt(req.query.filter as string, 10);

  const profile = await prisma.profile.findUnique({
    where: {
      username,
    },
    include: {
      followers: true,
    },
  });

  if (!profile) {
    res.status(404).end();
    return;
  }

  const session = await getSession({ req });

  let profileSession: any = { id: 0 };
  if (session) {
    profileSession = await prisma.profile.findUnique({
      where: { username: session.user.name.toLowerCase() },
    });
  }

  let tweets: any[];

  switch (filter) {
    case TweetsFilterEnum.TWEETS:
    default:
      tweets = await getTweets(profile, profileSession);
      break;

    case TweetsFilterEnum.TWEETS_REPLIES:
      tweets = await getTweetsAndReplies(profile, profileSession);
      break;

    case TweetsFilterEnum.MEDIA:
      tweets = await getTweetsWithMedia(profile, profileSession);
      break;

    case TweetsFilterEnum.LIKES:
      tweets = await getTweetsWithLike(profile, profileSession);
      break;
  }

  const tweetsFormated: TweetData[] = tweets.map(tweet => {
    let retweetedBy: string;
    if (
      tweet.profile.id !== profile.id &&
      tweet.retweeters.some(retweeter => retweeter.id === profile.id)
    ) {
      retweetedBy = profile.name;
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
        profileSession &&
        tweet.likes.some(like => like.profileId === profileSession.id),
      isRetweeted:
        session &&
        tweet.retweeters.some(retweeter => retweeter.id === profileSession.id),
      isSaved:
        profileSession &&
        tweet.saves.some(save => save.profileId === profileSession.id),
      retweetedBy,
    };
  });

  res.status(200).json({ tweets: tweetsFormated });
};

async function getTweets(
  profile: Profile,
  profileSession: Profile,
): Promise<Tweet[]> {
  const tweets = await prisma.tweet.findMany({
    where: {
      AND: [
        {
          OR: [
            { isPublic: true },
            {
              profile: {
                followers: { some: { followerId: profileSession.id } },
              },
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
  profileSession: Profile,
): Promise<Tweet[]> {
  const tweets = await prisma.tweet.findMany({
    where: {
      AND: [
        {
          OR: [
            { isPublic: true },
            {
              profile: {
                followers: { some: { followerId: profileSession.id } },
              },
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
  profileSession: Profile,
): Promise<Tweet[]> {
  const tweets = await prisma.tweet.findMany({
    where: {
      AND: [
        {
          OR: [
            { isPublic: true },
            {
              profile: {
                followers: { some: { followerId: profileSession.id } },
              },
            },
          ],
        },
        {
          OR: [
            { profile: { id: profile.id } },
            { retweeters: { some: { id: profile.id } } },
          ],
        },
        {
          images: { some: { content: { not: { in: [] } } } },
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

async function getTweetsWithLike(
  profile: Profile,
  profileSession: Profile,
): Promise<Tweet[]> {
  const tweets = await prisma.tweet.findMany({
    where: {
      AND: [
        {
          OR: [
            { isPublic: true },
            {
              profile: {
                followers: { some: { followerId: profileSession.id } },
              },
            },
          ],
        },
        {
          likes: { some: { profileId: profile.id } },
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
