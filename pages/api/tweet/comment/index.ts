import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
import prisma from '../../../../lib/prisma';

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  const session = await getSession({ req });
  const sessionUsername = session && session.user.name.toLowerCase();

  const { tweetId, content } = req.body;

  if (!sessionUsername || !tweetId || !content) {
    res.status(400).end();
    return;
  }

  const newComment = await prisma.comment.create({
    data: {
      content,
      tweet: { connect: { id: tweetId } },
      profile: { connect: { username: sessionUsername } },
    },
    include: {
      profile: true,
    },
  });

  const formattedComment = {
    id: newComment.id,
    userImage: newComment.profile.profileImage,
    userName: newComment.profile.name,
    userUsername: newComment.profile.username,
    createdAt: newComment.createdAt,
    updatedAt: newComment.updatedAt,
    content: newComment.content,
    likesQty: 0,
    isLiked: false,
  };

  res.status(200).json({ comment: formattedComment });
};
