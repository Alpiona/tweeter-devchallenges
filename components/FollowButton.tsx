import axios from 'axios';
import { useSession } from 'next-auth/client';
import { FC, useEffect, useState } from 'react';

interface FollowButtonProps {
  username: string;
  scale?: string;
}

const FollowButton: FC<FollowButtonProps> = ({ username, scale = '90' }) => {
  const [isFollowing, setIsFollowing] = useState<boolean>(null);
  const [session, loading] = useSession();

  function handleFollowUpdate(): void {
    axios
      .patch(
        `/api/profile/${username}/follow?action=${
          isFollowing ? 'unfollow' : 'follow'
        }`,
      )
      .then(() => {
        setIsFollowing(!isFollowing);
      })
      .catch(err => console.log(err.toJSON()));
  }

  useEffect(() => {
    if (session?.user?.name?.toLowerCase() === username) {
      setIsFollowing(null);
    } else {
      axios
        .get(`/api/profile/${username}/isFollowing`)
        .then(response => {
          setIsFollowing(response.data.isFollowing);
        })
        .catch(err => console.log(err.toJSON()));
    }
  }, []);

  if (isFollowing === null)
    return (
      <button
        className={`flex items-center py-2 px-4 space-x-1 transform scale-${scale} bg-gray-200 text-gray-400 rounded-md text-sm font-medium`}
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
        className={`flex items-center py-2 px-4 space-x-1 transform scale-${scale} bg-gray-300 text-gray-600 rounded-md text-sm font-medium`}
        type="button"
        onClick={handleFollowUpdate}
      >
        <span className="material-icons">person_remove</span>
        <h1>Unfollow</h1>
      </button>
    );

  return (
    <button
      className={`flex items-center py-2 px-4 space-x-1 transform scale-${scale} bg-blue-500 text-white rounded-md text-sm font-medium`}
      type="button"
      onClick={handleFollowUpdate}
    >
      <span className="material-icons">person_add</span>
      <h1>Follow</h1>
    </button>
  );
};

export default FollowButton;
