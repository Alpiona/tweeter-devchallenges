import { FC } from 'react';

interface ReactionButtonProps {
  id: number;
  onClick: () => void;
  action: 'comment' | 'retweet' | 'like' | 'save';
  used?: boolean;
  scale?: string;
}

const ReactionButton: FC<ReactionButtonProps> = ({
  id,
  onClick: handleClick,
  action,
  used = false,
  scale,
}) => {
  const className = `flex items-center font-medium justify-center space-x-2 ${
    scale && `transform scale-${scale}`
  }`;

  switch (action) {
    default:
    case 'comment':
      return (
        <button
          type="button"
          className={`${className} text-gray-600`}
          onClick={handleClick}
        >
          <span className="material-icons-outlined">comment</span>
          <h1>Comment</h1>
        </button>
      );

    case 'retweet':
      return (
        <button
          type="button"
          className={`${className} ${used && 'text-green-500'}`}
          onClick={handleClick}
        >
          <span className="material-icons-outlined">loop</span>
          <h1>{used ? 'Retweeted' : 'Retweet'}</h1>
        </button>
      );

    case 'like':
      return (
        <button
          type="button"
          className={`${className} ${used && 'text-red-500'}`}
          onClick={handleClick}
        >
          <span className="material-icons-outlined">favorite_border</span>
          <h1>{used ? 'Liked' : 'Like'}</h1>
        </button>
      );

    case 'save':
      return (
        <button
          type="button"
          className={`${className} ${used && 'text-blue-500'}`}
          onClick={handleClick}
        >
          <span className="material-icons-outlined">bookmark_border</span>
          <h1>{used ? 'Saved' : 'Save'}</h1>
        </button>
      );
  }
};

export default ReactionButton;
