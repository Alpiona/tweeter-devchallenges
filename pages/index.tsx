import axios from 'axios';
import { format, parseISO } from 'date-fns';
import { GetServerSideProps, NextPage } from 'next';
import { getSession, useSession } from 'next-auth/client';
import { useEffect, useState } from 'react';
import FollowSuggestion from '../components/FollowSuggestion';
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

type FollowSuggestionData = {
  profileImage: string;
  profileName: string;
  profileUsername: string;
  followersQty: number;
  description: string;
  image: string;
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
  retweetedByName: string;
  retweetedByUsername: string;
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
  const [followSuggestions, setFollowSuggestions] = useState<
    FollowSuggestionData[]
  >([]);
  const [session] = useSession();

  useEffect(() => {
    axios
      .get(`/api/tweet`)
      .then(response => {
        setTweets(response.data.tweets);
      })
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    axios
      .get(`/api/profile/suggestions`)
      .then(response => {
        setFollowSuggestions(response.data.profiles);
      })
      .catch(err => console.log(err));
  }, []);

  return (
    <Layout>
      <div className="flex items-start justify-center space-x-6 px-24 py-6 bg-gray-100 ">
        <div className="w-1/2 space-y-6">
          {profile && <TweetSomething userImg={profile.profileImage} />}
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
        <div className="w-1/5 space-y-6">
          <TrendsList />
          <div className="px-5 py-4 bg-white rounded-xl divide-y">
            <h1 className="pb-3 font-semibold text-xs">Who to follow</h1>
            {followSuggestions.map(followSuggestion => (
              <FollowSuggestion
                key={followSuggestion.profileUsername}
                profileImage={followSuggestion.profileImage}
                profileName={followSuggestion.profileName}
                profileUsername={followSuggestion.profileUsername}
                followersQty={followSuggestion.followersQty}
                description={followSuggestion.description}
                image={followSuggestion.image}
              />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
