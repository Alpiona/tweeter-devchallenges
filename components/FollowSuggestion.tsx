import { FC } from 'react';
import FollowButton from './FollowButton';

interface FollowSuggestionProps {
  profileImage: string;
  profileName: string;
  profileUsername: string;
  followersQty: number;
  description: string;
  image: string;
}

const FollowSuggestion: FC<FollowSuggestionProps> = ({
  profileImage,
  profileName,
  profileUsername,
  followersQty,
  description,
  image,
}) => {
  return (
    <div className="py-6 space-y-3">
      <div className="flex items-center justify-between space-x-3">
        <div className="flex items-end space-x-5">
          <img
            src={profileImage}
            alt=""
            className="h-9 w-9 object-cover rounded-lg flex-shrink-0"
          />
          <div className="">
            <a href={`/${profileUsername}`} className="font-medium">
              {profileName}
            </a>
            <h1 className="font-medium text-xs text-gray-500">
              {`${followersQty} Followers`}
            </h1>
          </div>
        </div>
        <FollowButton username={profileUsername} scale="75" />
      </div>
      <h1 className="font-medium text-gray-500">{description}</h1>
      {image && (
        <img
          src={image}
          alt=""
          className="w-full h-24 rounded-lg object-cover"
        />
      )}
    </div>
  );
};

export default FollowSuggestion;
