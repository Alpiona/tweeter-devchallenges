import { NextApiRequest, NextApiResponse } from 'next';
import _ from 'lodash';
import { getSession } from 'next-auth/client';
import prisma from '../../../lib/prisma';
import { Profile } from '.prisma/client';

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  const tweetId = parseInt(req.query.id as string, 10);

  if (!_.isNumber(tweetId)) {
    res.status(404);
    return;
  }

  const session = await getSession({ req });

  let profileSession: Profile;

  if (session) {
    profileSession = await prisma.profile.findUnique({
      where: { username: session.user.name.toLowerCase() },
    });
  }

  const tweet = await prisma.tweet.findUnique({
    where: { id: Number(tweetId) },
    include: {
      comments: { include: { profile: true, likes: true } },
      profile: { include: { followers: true } },
    },
  });

  if (
    !tweet.isPublic &&
    !tweet.profile.followers.some(follower => follower.id === profileSession.id)
  ) {
    res.status(404).end();
    return;
  }

  const comments = tweet.comments.map(comment => {
    return {
      id: comment.id,
      userImage: comment.profile.profileImage,
      userName: comment.profile.name,
      userUsername: comment.profile.username,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      content: comment.content,
      likesQty: comment.likes.length,
      isLiked:
        profileSession &&
        comment.likes.some(profile => profile.id === profileSession.id),
    };
  });

  res.status(200).json({ comments });
};
