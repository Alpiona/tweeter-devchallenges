import { FC } from 'react';

const Trends: FC = () => {
  return (
    <div className="h-1/2 w-1/3 px-5 py-3 bg-white rounded-lg">
      <h1 className="font-bold text-xs">Trends for you</h1>
      <hr className="pb-2 mt-2" />

      <h1 className="font-bold text-ml pt-4">#programming</h1>
      <h1 className="font-bold text-xs pt-3 text-gray-500">213k Tweets</h1>

      <h1 className="font-bold text-ml pt-4">#devchallenges</h1>
      <h1 className="font-bold text-xs pt-3 text-gray-500">123k Tweets</h1>

      <h1 className="font-bold text-ml pt-4">#frontend</h1>
      <h1 className="font-bold text-xs pt-3 text-gray-500">34k Tweets</h1>

      <h1 className="font-bold text-ml pt-4">#helsinki</h1>
      <h1 className="font-bold text-xs pt-3 text-gray-500">11k Tweets</h1>

      <h1 className="font-bold text-ml pt-4">#1000DaysOfCode</h1>
      <h1 className="font-bold text-xs pt-3 text-gray-500">5k Tweets</h1>

      <h1 className="font-bold text-ml pt-4">#learntocode</h1>
      <h1 className="font-bold text-xs pt-3 text-gray-500">1k Tweets</h1>
    </div>
  );
};

export default Trends;
