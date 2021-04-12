import axios from 'axios';
import { format, parseISO } from 'date-fns';
import { GetServerSideProps, NextPage } from 'next';
import { getSession, useSession } from 'next-auth/client';
import { useEffect, useState } from 'react';
import FollowSugestion from '../components/FollowSugestion';
import Layout from '../components/Layout';
import TrendsList from '../components/TrendsList';
import Tweet from '../components/Tweet';
import TweetSomething from '../components/TweetSomething';

type PropsData = {
  profile: {
    name: string;
    username: string;
    profileImage: string;
    description?: string;
    backgroundImage?: string;
    followingQty: number;
    followerQty: number;
  };
};

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
  retweetedBy: string;
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });

  let profile: PropsData;

  if (session) {
    const apiResponse = await axios.get(
      `${
        process.env.NEXT_PUBLIC_BASE_URL
      }/api/profile/${session.user.name.toLowerCase()}`,
    );

    profile = apiResponse.data;
  }

  return { props: { profile } };
};

const Home: NextPage<PropsData> = ({ profile }: PropsData) => {
  const [tweets, setTweets] = useState<TweetData[]>([]);
  const [session] = useSession();

  useEffect(() => {
    axios
      .get(`/api/tweet`)
      .then(response => {
        setTweets(response.data.tweets);
      })
      .catch(err => console.log(err));
  }, [session]);

  return (
    <Layout>
      <div className="flex items-start justify-center space-x-6 px-24 py-6 bg-gray-100 ">
        <div className="w-1/2 space-y-6">
          {profile && <TweetSomething userImg={profile.profileImage} />}
          {tweets.map(tweet => (
            <Tweet
              key={tweet.id}
              id={tweet.id}
              retweetedBy={tweet.retweetedBy}
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
        <div className="w-1/5 space-y-6">
          <TrendsList />
          <div className="px-5 py-4 bg-white rounded-xl space-y-2">
            <div className="space-y-5">
              <div className="space-y-2">
                <h1 className="font-semibold text-xs">Who to follow</h1>
                <hr />
              </div>
              <FollowSugestion
                userImg="/profile5.jpg"
                userName="Mikael Stanley"
                followersQty="230k followers"
                description="Photographer & Filmmaker based in Copenhagen, Denmark ✵ 🇩🇰"
                image="/background2.jpg"
              />
              <hr />
              <FollowSugestion
                userImg="/profile4.jpg"
                userName="Susanna Harvey"
                followersQty="55k followers"
                description="Follow me on IG: @susharv"
                image="/background3.jpg"
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
