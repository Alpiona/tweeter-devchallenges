import { FC } from 'react';
import { TweetsFilterEnum } from '../constants/TweetsFilterEnum';

interface SideFilterMenuProps {
  option: TweetsFilterEnum;
}

const SideFilterMenu: FC<SideFilterMenuProps> = ({ option }) => {
  switch (option) {
    case TweetsFilterEnum.TWEETS:
      return (
        <div className="bg-white font-semibold text-gray-400 rounded-xl py-6 space-y-3">
          <h1 className="h-8 pl-4 border-l-3 border-current text-blue-500 leading-8">
            Tweets
          </h1>
          <h1 className="h-8 pl-5 leading-8">Tweets & replies</h1>
          <h1 className="h-8 pl-5 leading-8">Media</h1>
          <h1 className="h-8 pl-5 leading-8">Likes</h1>
        </div>
      );

    case TweetsFilterEnum.TWEETS_REPLIES:
      return (
        <div className="bg-white font-semibold text-gray-400 rounded-xl py-6 space-y-3">
          <h1 className="h-8 pl-5 leading-8">Tweets</h1>
          <h1 className="h-8 pl-4 border-l-3 border-current text-blue-500 leading-8">
            Tweets & replies
          </h1>
          <h1 className="h-8 pl-5 leading-8">Media</h1>
          <h1 className="h-8 pl-5 leading-8">Likes</h1>
        </div>
      );

    case TweetsFilterEnum.MEDIA:
      return (
        <div className="bg-white font-semibold text-gray-400 rounded-xl py-6 space-y-3">
          <h1 className="h-8 pl-5 leading-8">Tweets</h1>
          <h1 className="h-8 pl-5 leading-8">Tweets & replies</h1>
          <h1 className="h-8 pl-4 border-l-3 border-current text-blue-500 leading-8">
            Media
          </h1>
          <h1 className="h-8 pl-5 leading-8">Likes</h1>
        </div>
      );

    case TweetsFilterEnum.LIKES:
      return (
        <div className="bg-white font-semibold text-gray-400 rounded-xl py-6 space-y-3">
          <h1 className="h-8 pl-5 leading-8">Tweets</h1>
          <h1 className="h-8 pl-5 leading-8">Tweets & replies</h1>
          <h1 className="h-8 pl-5 leading-8">Media</h1>
          <h1 className="h-8 pl-4 border-l-3 border-current text-blue-500 leading-8">
            Likes
          </h1>
        </div>
      );

    default:
      return (
        <div className="bg-white font-semibold text-gray-400 rounded-xl py-6 space-y-3">
          <h1 className="h-8 pl-5 leading-8">Tweets</h1>
          <h1 className="h-8 pl-5 leading-8">Tweets & replies</h1>
          <h1 className="h-8 pl-5 leading-8">Media</h1>
          <h1 className="h-8 pl-5 leading-8">Likes</h1>
        </div>
      );
  }
};

export default SideFilterMenu;
