import { FC } from 'react';

const Trends: FC = () => {
  return (
    <div className="px-5 py-4 bg-white rounded-lg">
      <h1 className="font-semibold text-xs">Trends for you</h1>
      <hr className="pb-2 mt-2" />

      <div className="space-y-7">
        <div className="space-y-3">
          <h1 className="font-semibold text-ml pt-4">#programming</h1>
          <h1 className="font-medium text-xs text-gray-500">213k Tweets</h1>
        </div>

        <div className="space-y-2">
          <h1 className="font-semibold text-ml">#devchallenges</h1>
          <h1 className="font-medium text-xs text-gray-500">123k Tweets</h1>
        </div>

        <div className="space-y-2">
          <h1 className="font-semibold text-ml">#frontend</h1>
          <h1 className="font-medium text-xs text-gray-500">34k Tweets</h1>
        </div>

        <div className="space-y-2">
          <h1 className="font-semibold text-ml">#helsinki</h1>
          <h1 className="font-medium text-xs text-gray-500">11k Tweets</h1>
        </div>

        <div className="space-y-2">
          <h1 className="font-semibold text-ml">#1000DaysOfCode</h1>
          <h1 className="font-medium text-xs text-gray-500">5k Tweets</h1>
        </div>

        <div className="space-y-2">
          <h1 className="font-semibold text-ml">#learntocode</h1>
          <h1 className="font-medium text-xs text-gray-500">1k Tweets</h1>
        </div>
      </div>
    </div>
  );
};

export default Trends;
