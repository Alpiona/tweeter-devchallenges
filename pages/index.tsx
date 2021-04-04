import { NextPage } from 'next';
import FollowSugestion from '../components/FollowSugestion';
import Layout from '../components/Layout';
import TrendsList from '../components/TrendsList';
import Tweet from '../components/Tweet';
import TweetSomething from '../components/TweetSomething';

const Home: NextPage = () => {
  return (
    <Layout>
      <div className="flex items-start justify-center space-x-6 px-24 py-6 bg-gray-100 ">
        <div className="w-1/2 space-y-6">
          <TweetSomething userImg="/profile.jpg" />
          <Tweet
            key={1}
            id={1}
            retweetedBy="Daniel Something"
            profileImage="/profile2.jpg"
            profileName="Peter Jackson"
            profileUsername="peter.jackson"
            date="23 August at 08:11"
            content='"We travel, some of us forever, to seek other places, other lives, other souls." - Anais Nin'
            img="/background.jpeg"
            commentsQty={449}
            retweetsQty={59}
            savedQty={234}
            liked
            retweeted
            saved
          />
          <Tweet
            key={2}
            id={2}
            retweetedBy=""
            profileImage="/profile6.jpg"
            profileName="Waqar Bloom"
            profileUsername="wagar.bloom"
            date="15 August at 23:33"
            content="“The gladdest moment in human life, methinks, is a departure into unknown lands.” – Sir Richard Burton"
            img="/background4.jpg"
            commentsQty={449}
            retweetsQty={59}
            savedQty={234}
            liked={false}
            retweeted={false}
            saved={false}
          />
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
