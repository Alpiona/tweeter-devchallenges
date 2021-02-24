import { FC } from 'react';

interface ReactionButtonProps {
  action: 'comment' | 'retweet' | 'like' | 'save';
  used?: boolean;
}

const ReactionButton: FC<ReactionButtonProps> = ({ action, used = false }) => {
  const className = 'flex items-center justify-center space-x-2 flex-1';
  let color = 'text-gray-600';
  let icon = '';
  let word = '';

  switch (action) {
    case 'comment':
      icon = 'comment';
      word = 'Comment';
      break;

    case 'retweet':
      icon = 'loop';
      if (used) {
        word = 'Retweeted';
        color = 'text-green-500';
      } else {
        word = 'Retweet';
      }
      break;

    case 'like':
      icon = 'favorite_border';
      if (used) {
        word = 'Liked';
        color = 'text-red-500';
      } else {
        word = 'Like';
      }
      break;

    case 'save':
      icon = 'bookmark_border';
      if (used) {
        word = 'Saved';
        color = 'text-blue-500';
      } else {
        word = 'Save';
      }
      break;

    default:
      break;
  }

  return (
    <button type="button" className={`${className} ${color}`}>
      <span className="material-icons-outlined">{icon}</span>
      <h1>{word}</h1>
    </button>
  );
};

export default ReactionButton;
