import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
import _ from 'lodash';
import prisma from '../../../lib/prisma';
import { Tweet } from '.prisma/client';

type TweetData = {
  id: number;
  profileName: string;
  profileUsername: string;
  profileImage: string;
  updatedAt: Date;
  createdAt: Date;
  content: string;
  commentsQty: number;
  retweetsQty: number;
  savesQty: number;
  isLiked?: boolean;
  isRetweeted?: boolean;
  isSaved?: boolean;
  retweetedByName: string;
  retweetedByUsername: string;
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  const session = await getSession({ req });
  const sessionUsername = session && session.user.name.toLowerCase();

  switch (req.method) {
    case 'POST':
      const { isPublic, content } = req.body;

      const hashtags = String(content)
        .split(' ')
        .filter(word => word[0] === '#' && word.length > 0);

      const newTweet = await prisma.tweet.create({
        data: {
          content,
          isPublic,
          profile: { connect: { username: sessionUsername } },
          hashtags: {
            connectOrCreate: hashtags.map(hashtag => {
              return {
                where: { content: hashtag.toLowerCase() },
                create: { content: hashtag.toLowerCase() },
              };
            }),
          },
        },
        include: {
          profile: true,
        },
      });

      const newTweetFormatted = {
        id: newTweet.id,
        commentsQty: 0,
        content: newTweet.content,
        createdAt: newTweet.createdAt,
        profileImage: newTweet.profile.profileImage,
        profileName: newTweet.profile.name,
        profileUsername: newTweet.profile.username,
        retweetedBy: null,
        retweetsQty: 0,
        savesQty: 0,
        updatedAt: newTweet.updatedAt,
        isLiked: false,
        isRetweeted: false,
        isSaved: false,
      };

      res.status(200).json({ tweet: newTweetFormatted });
      break;

    case 'GET':
    default:
      let tweets: TweetData[] = [];
      if (!_.isNull(sessionUsername)) {
        tweets = await getProfileTweets(sessionUsername);
      } else {
        tweets = await getPublicTweets();
      }
      res.status(200).json({ tweets });
  }
};

async function getProfileTweets(sessionUsername: string): Promise<TweetData[]> {
  const tweets = await prisma.tweet.findMany({
    where: {
      OR: [
        { profile: { followers: { some: { username: sessionUsername } } } },
        {
          retweeters: {
            some: { followers: { some: { username: sessionUsername } } },
          },
        },
      ],
    },
    orderBy: { createdAt: 'desc' },
    include: {
      likes: true,
      retweeters: true,
      saves: true,
      profile: true,
      _count: {
        select: {
          comments: true,
        },
      },
    },
  });

  return tweets.map(tweet => {
    return {
      id: tweet.id,
      profileName: tweet.profile.name,
      profileUsername: tweet.profile.username,
      profileImage: tweet.profile.profileImage,
      updatedAt: tweet.updatedAt,
      createdAt: tweet.createdAt,
      content: tweet.content,
      commentsQty: tweet._count.comments,
      retweetsQty: tweet.retweeters.length,
      savesQty: tweet.saves.length,
      isLiked: tweet.likes.some(lp => lp.username === sessionUsername),
      isRetweeted: tweet.retweeters.some(rp => rp.username === sessionUsername),
      isSaved: tweet.saves.some(sp => sp.username === sessionUsername),
      retweetedByName: tweet.retweeters.find(
        rp => rp.username === sessionUsername,
      )?.name,
      retweetedByUsername: tweet.retweeters.find(
        rp => rp.username === sessionUsername,
      )?.username,
    };
  });
}

async function getPublicTweets(): Promise<TweetData[]> {
  const tweets = await prisma.tweet.findMany({
    where: { isPublic: true },
    orderBy: { createdAt: 'desc' },
    include: {
      profile: true,
      _count: {
        select: {
          retweeters: true,
          saves: true,
          comments: true,
        },
      },
    },
  });

  return tweets.map(tweet => {
    return {
      id: tweet.id,
      profileName: tweet.profile.name,
      profileUsername: tweet.profile.username,
      profileImage: tweet.profile.profileImage,
      updatedAt: tweet.updatedAt,
      createdAt: tweet.createdAt,
      content: tweet.content,
      commentsQty: tweet._count.comments,
      retweetsQty: tweet._count.retweeters,
      savesQty: tweet._count.saves,
      isLiked: null,
      isRetweeted: null,
      isSaved: null,
      retweetedByName: null,
      retweetedByUsername: null,
    };
  });
}
