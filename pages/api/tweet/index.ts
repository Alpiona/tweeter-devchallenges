import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
import _ from 'lodash';
import { Profile } from '.prisma/client';
import prisma from '../../../lib/prisma';

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
  retweetedBy: string;
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

      const newTweet = await prisma.tweet.create({
        data: {
          content,
          isPublic,
          profile: { connect: { username: sessionUsername } },
        },
        include: {
          profile: true,
        },
      });

      const newTweetFormatted: TweetData = {
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
  const followers = await prisma.profile.findMany({
    where: { followers: { some: { username: sessionUsername } } },
  });

  const followersId = followers.map(follower => {
    return follower.id;
  });

  const tweets = await prisma.tweet.findMany({
    where: { profileId: { in: followersId } },
    orderBy: { createdAt: 'desc' },
    take: 10,
    include: {
      profile: true,
      retweeters: true,
      saves: true,
      likes: true,
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
      retweetedBy: null,
    };
  });
}

async function getPublicTweets(): Promise<TweetData[]> {
  const tweets = await prisma.tweet.findMany({
    where: { isPublic: true },
    orderBy: { createdAt: 'desc' },
    take: 10,
    include: {
      profile: true,
      _count: {
        select: {
          comments: true,
          retweeters: true,
          saves: true,
          likes: true,
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
      retweetedBy: null,
    };
  });
}
