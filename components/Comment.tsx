import { FC } from 'react';
import ReactionButton from './ReactionButton';

interface CommentProps {
  userImg: string;
  userName: string;
  date: string;
  content: string;
  liked: boolean;
  likesQty: string;
}

const Comment: FC<CommentProps> = ({
  userImg,
  userName,
  date,
  content,
  liked,
  likesQty,
}) => {
  return (
    <div className="flex items-start space-x-2 w-full">
      <img
        src={userImg}
        alt=""
        className="flex-shrink-0 h-9 w-9 object-cover rounded-lg"
      />
      <div>
        <div className="bg-gray-100 rounded-xl p-2 overflow-y-hidden">
          <div className="flex space-x-3 font-medium items-baseline">
            <h1>{userName}</h1>
            <h1 className="text-xs text-gray-400">{date}</h1>
          </div>
          <h1 className="font-noto text-gray-700">{content}</h1>
        </div>
        <div className="flex items-center space-x-5">
          <ReactionButton action="like" scale="90" used={liked} />
          <h1 className="text-gray-400 font-medium text-sm">{`${likesQty} Likes`}</h1>
        </div>
      </div>
    </div>
  );
};

export default Comment;
