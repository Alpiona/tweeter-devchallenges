import { FC } from 'react';

interface FollowButtonProps {
  isFollowing: boolean;
}

const FollowButton: FC<FollowButtonProps> = ({ isFollowing }) => {
  if (isFollowing) {
    return (
      <button
        className="flex items-center py-2 px-4 space-x-1 transform scale-90 bg-gray-300 text-gray-600 rounded-md text-sm font-medium"
        type="button"
      >
        <span className="material-icons">person_remove</span>
        <h1>Unfollow</h1>
      </button>
    );
  }
  return (
    <button
      className="flex items-center py-2 px-4 space-x-1 transform scale-90 bg-blue-500 text-white rounded-md text-sm font-medium"
      type="button"
    >
      <span className="material-icons">person_add</span>
      <h1>Follow</h1>
    </button>
  );
};

export default FollowButton;
