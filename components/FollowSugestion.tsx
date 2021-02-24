import { FC } from 'react';

interface FollowSugestionProps {
  userImg: string;
  userName: string;
  followersQty: string;
  description: string;
  image: string;
}

const FollowSugestion: FC<FollowSugestionProps> = ({
  userImg,
  userName,
  followersQty,
  description,
  image,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between space-x-3">
        <div className="flex items-end space-x-5">
          <img
            src={userImg}
            alt=""
            className="h-9 w-9 object-cover rounded-lg flex-shrink-0"
          />
          <div className="">
            <h1 className="font-medium">{userName}</h1>
            <h1 className="font-medium text-xs text-gray-500">
              {followersQty}
            </h1>
          </div>
        </div>
        <button
          className="flex items-center h-8 px-3 space-x-1 transform scale-90 bg-blue-500 text-white rounded-md text-sm font-medium"
          type="button"
        >
          <span className="material-icons">person_add</span>
          <h1>Follow</h1>
        </button>
      </div>
      <h1 className="font-medium text-gray-500">{description}</h1>
      <img src={image} alt="" className="w-full h-24 rounded-lg object-cover" />
    </div>
  );
};

export default FollowSugestion;
