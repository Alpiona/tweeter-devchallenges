import axios from 'axios';
import { FC, useEffect, useState } from 'react';

interface FollowButtonProps {
  followingStatus?: boolean;
  username: string;
}

const FollowButton: FC<FollowButtonProps> = ({ followingStatus, username }) => {
  const [isFollowing, setIsFollowing] = useState<boolean>(null);

  function handleFollowUpdate(): void {
    axios
      .patch(`/api/profile/${username}/follow`)
      .then(response => {
        setIsFollowing(response.data.isFollowing);
      })
      .catch(err => console.log(err.toJSON()));
  }

  useEffect(() => {
    axios
      .get(`/api/profile/${username}/follow`)
      .then(response => {
        setIsFollowing(response.data.isFollowing);
      })
      .catch(err => console.log(err.toJSON()));
  }, []);

  if (isFollowing === null)
    return (
      <button
        className="flex items-center py-2 px-4 space-x-1 transform scale-90 bg-gray-200 text-gray-400 rounded-md text-sm font-medium"
        type="button"
        onClick={handleFollowUpdate}
        disabled
      >
        <span className="material-icons">person_add</span>
        <h1>Follow</h1>
      </button>
    );

  if (isFollowing)
    return (
      <button
        className="flex items-center py-2 px-4 space-x-1 transform scale-90 bg-gray-300 text-gray-600 rounded-md text-sm font-medium"
        type="button"
        onClick={handleFollowUpdate}
      >
        <span className="material-icons">person_remove</span>
        <h1>Unfollow</h1>
      </button>
    );

  return (
    <button
      className="flex items-center py-2 px-4 space-x-1 transform scale-90 bg-blue-500 text-white rounded-md text-sm font-medium"
      type="button"
      onClick={handleFollowUpdate}
    >
      <span className="material-icons">person_add</span>
      <h1>Follow</h1>
    </button>
  );
};

export default FollowButton;
