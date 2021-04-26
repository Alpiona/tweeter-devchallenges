import { FC } from 'react';
import { TweetsExploreFilterEnum } from '../constants/TweetsExploreFilterEnum';
import { TweetsProfileFilterEnum } from '../constants/TweetsProfileFilterEnum';

interface SideFilterMenuProps {
  option: TweetsProfileFilterEnum | TweetsExploreFilterEnum;
  filterType: 'profile' | 'explore';
  onFilterClick: (tweetsFilter: number) => void;
}

const SideFilterMenu: FC<SideFilterMenuProps> = ({
  option,
  filterType,
  onFilterClick: handleFilterClick,
}) => {
  switch (option) {
    case TweetsProfileFilterEnum.TWEETS:
    case TweetsExploreFilterEnum.TOP:
      return (
        <div className="flex flex-col place-items-start bg-white  text-gray-400 rounded-xl py-6 space-y-3">
          <h1 className="h-8 pl-4 border-l-3 border-current text-blue-500 leading-8 font-semibold">
            {filterType === 'profile' ? 'Tweets' : 'Top'}
          </h1>
          <button
            type="button"
            className="h-8 pl-5 leading-8 font-semibold"
            onClick={() =>
              handleFilterClick(TweetsProfileFilterEnum.TWEETS_REPLIES)
            }
          >
            {filterType === 'profile' ? 'Tweets & replies' : 'Lastest'}
          </button>
          <button
            type="button"
            className="h-8 pl-5 leading-8 font-semibold"
            onClick={() => handleFilterClick(TweetsProfileFilterEnum.MEDIA)}
          >
            {filterType === 'profile' ? 'Media' : 'People'}
          </button>
          <button
            type="button"
            className="h-8 pl-5 leading-8 font-semibold"
            onClick={() => handleFilterClick(TweetsProfileFilterEnum.LIKES)}
          >
            {filterType === 'profile' ? 'Likes' : 'Media'}
          </button>
        </div>
      );

    case TweetsProfileFilterEnum.TWEETS_REPLIES:
    case TweetsExploreFilterEnum.LASTEST:
      return (
        <div className="flex flex-col place-items-start bg-white font-semibold text-gray-400 rounded-xl py-6 space-y-3">
          <button
            type="button"
            className="h-8 pl-5 leading-8 font-semibold"
            onClick={() => handleFilterClick(TweetsProfileFilterEnum.TWEETS)}
          >
            {filterType === 'profile' ? 'Tweets' : 'Top'}
          </button>
          <h1 className="h-8 pl-4 border-l-3 border-current text-blue-500 leading-8">
            {filterType === 'profile' ? 'Tweets & replies' : 'Lastest'}
          </h1>
          <button
            type="button"
            className="h-8 pl-5 leading-8 font-semibold"
            onClick={() => handleFilterClick(TweetsProfileFilterEnum.MEDIA)}
          >
            {filterType === 'profile' ? 'Media' : 'People'}
          </button>
          <button
            type="button"
            className="h-8 pl-5 leading-8 font-semibold"
            onClick={() => handleFilterClick(TweetsProfileFilterEnum.LIKES)}
          >
            {filterType === 'profile' ? 'Likes' : 'Media'}
          </button>
        </div>
      );

    case TweetsProfileFilterEnum.MEDIA:
    case TweetsExploreFilterEnum.PEOPLE:
      return (
        <div className="flex flex-col place-items-start bg-white font-semibold text-gray-400 rounded-xl py-6 space-y-3">
          <button
            type="button"
            className="h-8 pl-5 leading-8 font-semibold"
            onClick={() => handleFilterClick(TweetsProfileFilterEnum.TWEETS)}
          >
            {filterType === 'profile' ? 'Tweets' : 'Top'}
          </button>
          <button
            type="button"
            className="h-8 pl-5 leading-8 font-semibold"
            onClick={() =>
              handleFilterClick(TweetsProfileFilterEnum.TWEETS_REPLIES)}
          >
            {filterType === 'profile' ? 'Tweets & replies' : 'Lastest'}
          </button>
          <h1 className="h-8 pl-4 border-l-3 border-current text-blue-500 leading-8">
            {filterType === 'profile' ? 'Media' : 'People'}
          </h1>
          <button
            type="button"
            className="h-8 pl-5 leading-8 font-semibold"
            onClick={() => handleFilterClick(TweetsProfileFilterEnum.LIKES)}
          >
            {filterType === 'profile' ? 'Likes' : 'Media'}
          </button>
        </div>
      );

    case TweetsProfileFilterEnum.LIKES:
    case TweetsExploreFilterEnum.MEDIA:
      return (
        <div className="flex flex-col place-items-start bg-white font-semibold text-gray-400 rounded-xl py-6 space-y-3">
          <button
            type="button"
            className="h-8 pl-5 leading-8 font-semibold"
            onClick={() => handleFilterClick(TweetsProfileFilterEnum.TWEETS)}
          >
            {filterType === 'profile' ? 'Tweets' : 'Top'}
          </button>
          <button
            type="button"
            className="h-8 pl-5 leading-8 font-semibold"
            onClick={() =>
              handleFilterClick(TweetsProfileFilterEnum.TWEETS_REPLIES)}
          >
            {filterType === 'profile' ? 'Tweets & replies' : 'Lastest'}
          </button>
          <button
            type="button"
            className="h-8 pl-5 leading-8 font-semibold"
            onClick={() => handleFilterClick(TweetsProfileFilterEnum.MEDIA)}
          >
            {filterType === 'profile' ? 'Media' : 'People'}
          </button>
          <h1 className="h-8 pl-4 border-l-3 border-current text-blue-500 leading-8">
            {filterType === 'profile' ? 'Likes' : 'Media'}
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
