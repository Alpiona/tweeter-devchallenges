import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
import { Profile } from '.prisma/client';
import prisma from '../../../lib/prisma';

type ProfileData = {
  name: string;
  username: string;
  profileImage: string;
  description?: string;
  backgroundImage?: string;
  followingQty: number;
  followerQty: number;
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  const session = await getSession({ req });

  let profileSession: Profile;

  if (session) {
    profileSession = await prisma.profile.findUnique({
      where: { username: session.user.name.toLowerCase() },
      include: { followers: true, following: true },
    });
  }

  let tweets = [];

  if (profileSession != null) {
    const followers = await prisma.follower.findMany({
      where: { followerId: profileSession.id },
    });

    const followersId = followers.map(follower => {
      return follower.followingId;
    });

    tweets = await prisma.tweet.findMany({
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
  } else {
    tweets = await prisma.tweet.findMany({
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
  }

  const tweetsFormated = tweets.map(tweet => {
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
        profileSession &&
        tweet.likes.some(like => like.profileId === profileSession.id),
      isRetweeted:
        profileSession &&
        tweet.retweets.some(
          retweetProfile => retweetProfile.id === profileSession.id,
        ),
      isSaved:
        profileSession &&
        tweet.saves.some(save => save.profileId === profileSession.id),
      retweetedBy: null,
    };
  });

  res.status(200).json({ tweets: tweetsFormated });
};
