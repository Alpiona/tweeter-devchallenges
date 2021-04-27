import axios from 'axios';
import { format, parseISO } from 'date-fns';
import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import SideFilterMenu from '../components/SideFilterMenu';
import Tweet from '../components/Tweet';
import { TweetsProfileFilterEnum } from '../constants/TweetsProfileFilterEnum';

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

const Bookmarks: NextPage = () => {
  const [tweets, setTweets] = useState<TweetData[]>([]);
  const [tweetsFilter, setTweetsFilter] = useState<TweetsProfileFilterEnum>(
    TweetsProfileFilterEnum.TWEETS,
  );

  function handleTweetsFilter(filter: TweetsProfileFilterEnum): void {
    setTweetsFilter(filter);
  }

  useEffect(() => {
    setTweets([]);
    axios
      .get(`/api/tweet/bookmarks`, { params: { filter: tweetsFilter } })
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
            filterType="profile"
            onFilterClick={handleTweetsFilter}
          />
        </div>
        <div className="w-1/2 space-y-6">
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

export default Bookmarks;
