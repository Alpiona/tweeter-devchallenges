import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
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

  let profileSession: any = { id: 0 };

  if (session) {
    profileSession = await prisma.profile.findUnique({
      where: { username: session.user.name.toLowerCase() },
      include: { followers: true, following: true },
    });
  }

  switch (req.method) {
    case 'POST':
      if (profileSession.id === 0) {
        res.status(404).end();
        return;
      }

      const { isPublic, content } = req.body;
      const newTweet = await prisma.tweet.create({
        data: {
          content,
          isPublic,
          profileId: profileSession.id,
        },
      });

      const newTweetFormatted: TweetData = {
        id: newTweet.id,
        commentsQty: 0,
        content: newTweet.content,
        createdAt: newTweet.createdAt,
        profileImage: profileSession.profileImage,
        profileName: profileSession.name,
        profileUsername: profileSession.username,
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
      // eslint-disable-next-line
      let tweets = [];
      if (profileSession.id !== 0) {
        tweets = await getProfileTweets(profileSession);
      } else {
        tweets = await getPublicTweets();
      }
      res.status(200).json({ tweets });
  }
};

async function getProfileTweets(sessionProfile: Profile): Promise<TweetData[]> {
  const followers = await prisma.follower.findMany({
    where: { followerId: sessionProfile.id },
  });

  const followersId = followers.map(follower => {
    return follower.followingId;
  });

  const tweets = await prisma.tweet.findMany({
    where: { profileId: { in: followersId } },
    orderBy: { createdAt: 'desc' },
    take: 10,
    include: {
      profile: true,
      comments: true,
      retweeters: true,
      saves: true,
      likes: true,
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
      commentsQty: tweet.comments.length,
      retweetsQty: tweet.retweeters.length,
      savesQty: tweet.saves.length,
      isLiked: tweet.likes.some(like => like.profileId === sessionProfile.id),
      isRetweeted: tweet.retweeters.some(
        retweetProfile => retweetProfile.id === sessionProfile.id,
      ),
      isSaved: tweet.saves.some(save => save.profileId === sessionProfile.id),
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
      comments: true,
      retweeters: true,
      saves: true,
      likes: true,
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
      commentsQty: tweet.comments.length,
      retweetsQty: tweet.retweeters.length,
      savesQty: tweet.saves.length,
      isLiked: null,
      isRetweeted: null,
      isSaved: null,
      retweetedBy: null,
    };
  });
}
