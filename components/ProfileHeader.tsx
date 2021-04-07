import { FC, useEffect, useState } from 'react';
import { api } from '../services/api';
import FollowButton from './FollowButton';

interface ProfileHeaderProps {
  image: string;
  name: string;
  username: string;
  followingQty: number;
  followersQty: number;
  description: string;
}

const ProfileHeader: FC<ProfileHeaderProps> = ({
  image,
  name,
  username,
  followingQty,
  followersQty,
  description,
}) => {
  const [isFollowing, setIsFollowing] = useState<boolean>();

  async function handleFollowUpdate(): Promise<void> {
    api
      .patch(`profile/${username}/follow`)
      .then(response => {
        setIsFollowing(response.data.isFollowing);
      })
      .catch(err => console.log(err));
  }

  useEffect(() => {
    api
      .get(`profile/${username}/follow`)
      .then(response => {
        setIsFollowing(response.data.isFollowing);
      })
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="flex bg-white mt-56 rounded-xl z-10 relative">
      <div className="w-auto">
        <img
          src={image}
          alt=""
          className="left-5 bottom-12 rounded-xl border-white border-2 relative w-36 h-36 object-cover"
        />
      </div>
      <div className="w-full px-10 py-4 space-y-4">
        <div className="flex justify-between flex-grow relative">
          <div className="flex items-center space-x-6">
            <div className="font-semibold text-2xl">{name}</div>
            <div className="flex space-x-1 text-sm">
              <div className="font-semibold">{followingQty}</div>
              <div className="font-medium text-gray-500">Following</div>
            </div>
            <div className="flex space-x-1 text-sm">
              <div className="font-semibold">{followersQty}</div>
              <div className="font-medium text-gray-500">Followers</div>
            </div>
          </div>
          {isFollowing != null && (
            <FollowButton
              isFollowing={isFollowing}
              onFollow={handleFollowUpdate}
            />
          )}
        </div>
        <div className="text-semibold text-lg h-24 w-4/5 text-gray-500">
          {description}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
