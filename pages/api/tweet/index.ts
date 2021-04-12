import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
import { Profile } from '.prisma/client';
import prisma from '../../../lib/prisma';

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  const session = await getSession({ req });

  let profileSession: Pick<Profile, 'id'> = { id: 0 };

  if (session) {
    profileSession = await prisma.profile.findUnique({
      where: { username: session.user.name.toLowerCase() },
      include: { followers: true, following: true },
    });
  }

  let tweets = [];

  if (profileSession.id !== 0) {
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
      retweetsQty: tweet.retweeters.length,
      savesQty: tweet.saves.length,
      isLiked:
        profileSession &&
        tweet.likes.some(like => like.profileId === profileSession.id),
      isRetweeted:
        profileSession &&
        tweet.retweeters.some(
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
