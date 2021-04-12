import axios from 'axios';
import { FC, useState } from 'react';
import ReactionButton from './ReactionButton';

interface CommentProps {
  id: number;
  userImg: string;
  userName: string;
  date: string;
  content: string;
  liked: boolean;
  likesQty: number;
}

const Comment: FC<CommentProps> = ({
  id,
  userImg,
  userName,
  date,
  content,
  liked,
  likesQty,
}) => {
  const [isLiked, setLike] = useState(liked);

  async function handleLike(): Promise<void> {
    axios
      .patch(`/api/tweet/comment/${id}/like`)
      .then(response => {
        setLike(response.data);
      })
      .catch(err => console.log(err));
  }

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
            onClick={handleLike}
          />
          <h1 className="text-gray-400 font-medium text-sm">{`${likesQty} Likes`}</h1>
        </div>
      </div>
    </div>
  );
};

export default Comment;
