// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
import prisma from '../../../lib/prisma';

type TweetData = {
  profileName: string;
  profileImage: string;
  updatedAt: Date;
  createdAt: Date;
  content: string;
  commentsQty: number;
  retweetsQty: number;
  savesQty: number;
  isLiked: boolean;
  isRetweeted: boolean;
  isSaved: boolean;
};

type ProfileData = {
  name: string;
  username: string;
  profileImage: string;
  description?: string;
  backgroundImage?: string;
  followingQty: number;
  followerQty: number;
  isFollowing: boolean;
  tweets: TweetData[];
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  const username = req.query.username as string;

  const profile = await prisma.profile.findUnique({
    where: {
      username,
    },
    include: {
      retweets: {
        include: {
          profile: true,
          comments: true,
          likes: true,
          retweets: true,
          saves: true,
        },
      },
      tweets: {
        include: {
          comments: true,
          likes: true,
          retweets: true,
          saves: true,
        },
      },
      followers: true,
      following: true,
    },
  });

  const session = await getSession({ req });
  const profileSession = await prisma.profile.findUnique({
    where: { username: session.user.name.toLowerCase() },
  });

  let isFollowing: boolean;

  if (
    !session ||
    !profile.followers.includes({
      followerId: profileSession.id,
      followingId: profile.id,
    })
  ) {
    isFollowing = false;
  } else {
    isFollowing = true;
  }

  const tweets = profile.tweets.filter(tweet => {
    return isFollowing || tweet.isPublic;
  });

  const tweetsFormated = tweets.map(tweet => {
    return {
      profileName: profile.name,
      profileImage: profile.profileImage,
      updatedAt: tweet.updatedAt,
      createdAt: tweet.createdAt,
      content: tweet.content,
      commentsQty: tweet.comments.length,
      retweetsQty: tweet.retweets.length,
      savesQty: tweet.saves.length,
      isLiked: tweet.likes.includes({
        profileId: profileSession.id,
        tweetId: tweet.id,
      }),
      isRetweeted: false,
      isSaved: tweet.saves.includes({
        profileId: profileSession.id,
        tweetId: tweet.id,
      }),
    };
  });

  tweetsFormated.push(
    ...profile.retweets.map(tweet => {
      return {
        profileName: tweet.profile.name,
        profileImage: tweet.profile.profileImage,
        updatedAt: tweet.updatedAt,
        createdAt: tweet.createdAt,
        content: tweet.content,
        commentsQty: tweet.comments.length,
        retweetsQty: tweet.retweets.length,
        savesQty: tweet.saves.length,
        isLiked: tweet.likes.includes({
          profileId: profileSession.id,
          tweetId: tweet.id,
        }),
        isRetweeted: true,
        isSaved: tweet.saves.includes({
          profileId: profileSession.id,
          tweetId: tweet.id,
        }),
      };
    }),
  );

  tweetsFormated.sort((a, b) => {
    return a.createdAt.valueOf() - b.createdAt.valueOf();
  });

  const ret: ProfileData = {
    name: profile.name,
    username: profile.username,
    profileImage: profile.profileImage,
    description: profile.description,
    followerQty: profile.followers.length,
    followingQty: profile.following.length,
    isFollowing: true,
    backgroundImage: profile.backgroundImage,
    tweets: tweetsFormated,
  };

  res.status(200).json(ret);
};
