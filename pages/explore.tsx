import axios from 'axios';
import { parseISO, format } from 'date-fns';
import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import SideFilterMenu from '../components/SideFilterMenu';
import Tweet from '../components/Tweet';
import { TweetsExploreFilterEnum } from '../constants/TweetsExploreFilterEnum';

type TweetData = {
  id: number;
  profileName: string;
  profileUsername: string;
  profileImage: string;
  updatedAt: string;
  createdAt: string;
  content: string;
  commentsQty: number;
  retweetsQty: number;
  savesQty: number;
  isLiked: boolean;
  isRetweeted: boolean;
  isSaved: boolean;
  retweetedByName: string;
  retweetedByUsername: string;
};

const Explore: NextPage = () => {
  const [tweets, setTweets] = useState<TweetData[]>([]);
  const [tweetsFilter, setTweetsFilter] = useState<TweetsExploreFilterEnum>(
    TweetsExploreFilterEnum.TOP,
  );

  function handleTweetsFilter(filter: TweetsExploreFilterEnum): void {
    setTweetsFilter(filter);
  }

  useEffect(() => {
    setTweets([]);
    axios
      .get(`/api/tweet`, { params: { filter: tweetsFilter } })
      .then(response => {
        setTweets(response.data.tweets);
      })
      .catch(err => console.log(err.toJSON()));
  }, [tweetsFilter]);

  return (
    <Layout>
      <div className="flex items-start justify-center space-x-6 px-24 py-6 bg-gray-100 ">
        <div className="w-1/5">
          <SideFilterMenu
            option={tweetsFilter}
            filterType="explore"
            onFilterClick={handleTweetsFilter}
          />
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
          {tweets.map(tweet => (
            <Tweet
              key={tweet.id}
              id={tweet.id}
              retweetedByName={tweet.retweetedByName}
              retweetedByUsername={tweet.retweetedByUsername}
              profileName={tweet.profileName}
              profileImage={tweet.profileImage}
              profileUsername={tweet.profileUsername}
              date={format(parseISO(tweet.createdAt), "dd LLLL 'at' hh:mm")}
              content={tweet.content}
              img=""
              commentsQty={tweet.commentsQty}
              retweetsQty={tweet.retweetsQty}
              savedQty={tweet.savesQty}
              liked={tweet.isLiked}
              retweeted={tweet.isRetweeted}
              saved={tweet.isSaved}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Explore;
