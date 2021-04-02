import { NextApiRequest, NextApiResponse } from 'next';
import _ from 'lodash';
import { getSession } from 'next-auth/client';
import prisma from '../../../lib/prisma';

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  const id = parseInt(req.query.slug[0], 10);

  if (!_.isNumber(id) && req.query.slug[1] !== 'comments') {
    res.status(404);
    return;
  }

  const session = await getSession({ req });

  let profileSession;

  if (session) {
    const profileSession = await prisma.profile.findUnique({
      where: { username: session.user.name.toLowerCase() },
    });
  }

  const tweet = await prisma.tweet.findUnique({
    where: { id: Number(id) },
    include: {
      comments: {
        include: {
          profile: true,
          commentLikes: true,
        },
      },
      profile: {
        include: {
          followers: true,
        },
      },
    },
  });

  if (
    !tweet.isPublic &&
    !tweet.profile.followers.includes({
      followerId: profileSession.id,
      followingId: tweet.profile.id,
    })
  ) {
    res.status(404);
  } else {
    const ret = tweet.comments.map(comment => {
      return {
        id: comment.id,
        userImage: comment.profile.profileImage,
        userName: comment.profile.name,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
        content: comment.content,
        likesQty: comment.commentLikes.length,
        isLiked:
          session &&
          comment.commentLikes.includes({
            commentId: comment.id,
            profileId: profileSession.id,
          }),
      };
    });

    res.status(200).json(ret);
  }
};
