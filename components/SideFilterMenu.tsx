import { FC } from 'react';
import { TweetsFilterEnum } from '../constants/TweetsFilterEnum';

interface SideFilterMenuProps {
  option: TweetsFilterEnum;
  onFilterClick: (tweetsFilter: number) => void;
}

const SideFilterMenu: FC<SideFilterMenuProps> = ({
  option,
  onFilterClick: handleFilterClick,
}) => {
  switch (option) {
    case TweetsFilterEnum.TWEETS:
      return (
        <div className="flex flex-col place-items-start bg-white  text-gray-400 rounded-xl py-6 space-y-3">
          <h1 className="h-8 pl-4 border-l-3 border-current text-blue-500 leading-8 font-semibold">
            Tweets
          </h1>
          <button
            type="button"
            className="h-8 pl-5 leading-8 font-semibold"
            onClick={() => handleFilterClick(TweetsFilterEnum.TWEETS_REPLIES)}
          >
            Tweets & replies
          </button>
          <button
            type="button"
            className="h-8 pl-5 leading-8 font-semibold"
            onClick={() => handleFilterClick(TweetsFilterEnum.MEDIA)}
          >
            Media
          </button>
          <button
            type="button"
            className="h-8 pl-5 leading-8 font-semibold"
            onClick={() => handleFilterClick(TweetsFilterEnum.LIKES)}
          >
            Likes
          </button>
        </div>
      );

    case TweetsFilterEnum.TWEETS_REPLIES:
      return (
        <div className="flex flex-col place-items-start bg-white font-semibold text-gray-400 rounded-xl py-6 space-y-3">
          <button
            type="button"
            className="h-8 pl-5 leading-8 font-semibold"
            onClick={() => handleFilterClick(TweetsFilterEnum.TWEETS)}
          >
            Tweets
          </button>
          <h1 className="h-8 pl-4 border-l-3 border-current text-blue-500 leading-8">
            Tweets & replies
          </h1>
          <button
            type="button"
            className="h-8 pl-5 leading-8 font-semibold"
            onClick={() => handleFilterClick(TweetsFilterEnum.MEDIA)}
          >
            Media
          </button>
          <button
            type="button"
            className="h-8 pl-5 leading-8 font-semibold"
            onClick={() => handleFilterClick(TweetsFilterEnum.LIKES)}
          >
            Likes
          </button>
        </div>
      );

    case TweetsFilterEnum.MEDIA:
      return (
        <div className="flex flex-col place-items-start bg-white font-semibold text-gray-400 rounded-xl py-6 space-y-3">
          <button
            type="button"
            className="h-8 pl-5 leading-8 font-semibold"
            onClick={() => handleFilterClick(TweetsFilterEnum.TWEETS)}
          >
            Tweets
          </button>
          <button
            type="button"
            className="h-8 pl-5 leading-8 font-semibold"
            onClick={() => handleFilterClick(TweetsFilterEnum.TWEETS_REPLIES)}
          >
            Tweets & replies
          </button>
          <h1 className="h-8 pl-4 border-l-3 border-current text-blue-500 leading-8">
            Media
          </h1>
          <button
            type="button"
            className="h-8 pl-5 leading-8 font-semibold"
            onClick={() => handleFilterClick(TweetsFilterEnum.LIKES)}
          >
            Likes
          </button>
        </div>
      );

    case TweetsFilterEnum.LIKES:
      return (
        <div className="flex flex-col place-items-start bg-white font-semibold text-gray-400 rounded-xl py-6 space-y-3">
          <button
            type="button"
            className="h-8 pl-5 leading-8 font-semibold"
            onClick={() => handleFilterClick(TweetsFilterEnum.TWEETS)}
          >
            Tweets
          </button>
          <button
            type="button"
            className="h-8 pl-5 leading-8 font-semibold"
            onClick={() => handleFilterClick(TweetsFilterEnum.TWEETS_REPLIES)}
          >
            Tweets & replies
          </button>
          <button
            type="button"
            className="h-8 pl-5 leading-8 font-semibold"
            onClick={() => handleFilterClick(TweetsFilterEnum.MEDIA)}
          >
            Media
          </button>
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
