// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
import { Profile } from '.prisma/client';
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

  let profileSession = null;
  if (session) {
    profileSession = await prisma.profile.findUnique({
      where: { username: session.user.name.toLowerCase() },
    });
  }

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
      id: tweet.id,
      profileName: profile.name,
      profileUsername: profile.username,
      profileImage: profile.profileImage,
      updatedAt: tweet.updatedAt,
      createdAt: tweet.createdAt,
      content: tweet.content,
      commentsQty: tweet.comments.length,
      retweetsQty: tweet.retweets.length,
      savesQty: tweet.saves.length,
      isLiked:
        session &&
        tweet.likes.includes({
          profileId: profileSession.id,
          tweetId: tweet.id,
        }),
      isRetweeted: session && tweet.retweets.includes(profileSession),
      isSaved:
        session &&
        tweet.saves.includes({
          profileId: profileSession.id,
          tweetId: tweet.id,
        }),
    };
  });

  tweetsFormated.push(
    ...profile.retweets.map(tweet => {
      return {
        id: tweet.id,
        profileName: tweet.profile.name,
        profileUsername: tweet.profile.username,
        profileImage: tweet.profile.profileImage,
        updatedAt: tweet.updatedAt,
        createdAt: tweet.createdAt,
        content: tweet.content,
        commentsQty: tweet.comments.length,
        retweetsQty: tweet.retweets.length,
        savesQty: tweet.saves.length,
        isLiked:
          session &&
          tweet.likes.includes({
            profileId: profileSession.id,
            tweetId: tweet.id,
          }),
        isRetweeted: session && tweet.retweets.includes(profileSession),
        isSaved:
          session &&
          tweet.saves.includes({
            profileId: profileSession.id,
            tweetId: tweet.id,
          }),
      };
    }),
  );

  tweetsFormated.sort((a, b) => {
    return a.createdAt.valueOf() - b.createdAt.valueOf();
  });

  const ret = {
    isFollowing,
    tweets: tweetsFormated,
  };

  res.status(200).json(ret);
};
