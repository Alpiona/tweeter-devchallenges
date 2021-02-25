import { NextPage } from 'next';
import Tweet from '../components/Tweet';

const Explore: NextPage = () => {
  return (
    <div className="flex items-start justify-center space-x-6 px-24 py-6 bg-gray-100 ">
      <div className="w-1/5">
        <div className="bg-white font-semibold text-gray-400 rounded-xl py-6 space-y-3">
          <h1 className="h-8 pl-4 border-l-3 border-current text-blue-500 leading-8">
            Top
          </h1>
          <h1 className="h-8 pl-5 leading-8">Lastest</h1>
          <h1 className="h-8 pl-5 leading-8">People</h1>
          <h1 className="h-8 pl-5 leading-8">Media</h1>
        </div>
      </div>
      <div className="w-1/2 space-y-6">
        <div className="flex justify-between bg-white rounded-xl p-3 px-4">
          <div className="flex items-center space-x-2 text-gray-400">
            <span className="material-icons-outlined">search</span>
            <h1>Search</h1>
          </div>
          <button
            className="h-8 w-20 bg-blue-500 text-white rounded-md text-sm font-medium"
            type="button"
          >
            Search
          </button>
        </div>
        <Tweet
          retweetedBy=""
          userImg="/profile6.jpg"
          userName="Waqar Bloom"
          date="15 August at 23:33"
          content="“The gladdest moment in human life, methinks, is a departure into unknown lands.” – Sir Richard Burton"
          img="/background4.jpg"
          commentsQty="449"
          retweetsQty="59k"
          savedQty="234"
          liked={false}
          retweeted={false}
          saved={false}
        />
        <Tweet
          retweetedBy="Daniel Something"
          userImg="/profile2.jpg"
          userName="Peter Jackson"
          date="23 August at 08:11"
          content='"We travel, some of us forever, to seek other places, other lives, other souls." - Anais Nin'
          img="/background.jpeg"
          commentsQty="449"
          retweetsQty="59k"
          savedQty="234"
          liked
          retweeted
          saved
        />
      </div>
    </div>
  );
};

export default Explore;
