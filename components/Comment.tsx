import { FC, useState } from 'react';
import ReactionButton from './ReactionButton';

interface CommentProps {
  id: number;
  userImg: string;
  userName: string;
  date: string;
  content: string;
  isLiked: boolean;
  likesQty: string;
}

const Comment: FC<CommentProps> = ({
  id,
  userImg,
  userName,
  date,
  content,
  isLiked,
  likesQty,
}) => {
  const [isLikedNew, setLike] = useState(isLiked);

  async function changeIsLiked(): Promise<void> {
    // TODO: Need to make API and complete
    setLike(!isLikedNew);
  }

  console.log(userImg);

  return (
    <div className="flex items-start space-x-2 flex-grow">
      <img
        src={userImg}
        alt=""
        className="flex-shrink-0 h-9 w-9 object-cover rounded-lg"
      />
      <div className="flex-grow">
        <div className="bg-gray-100 rounded-xl p-2">
          <div className="flex space-x-3 font-medium items-baseline">
            <h1>{userName}</h1>
            <h1 className="text-xs text-gray-400">{date}</h1>
          </div>
          <h1 className="font-noto text-gray-700">{content}</h1>
        </div>
        <div className="flex items-center space-x-5">
          <ReactionButton
            id={id}
            action="like"
            scale="90"
            used={isLiked}
            clickFunction={changeIsLiked}
          />
          <h1 className="text-gray-400 font-medium text-sm">{`${likesQty} Likes`}</h1>
        </div>
      </div>
    </div>
  );
};

export default Comment;
