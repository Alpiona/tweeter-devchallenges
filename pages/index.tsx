import { NextPage } from 'next';
import Head from 'next/head';
import FollowSugestion from '../components/FollowSugestion';
import Layout from '../components/Layout';
import TrendsList from '../components/TrendsList';
import Tweet from '../components/Tweet';
import TweetSomething from '../components/TweetSomething';

const Home: NextPage = () => {
  const title = 'Tweeter';
  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/tweeter-small.svg" />
        <link
          href="https://fonts.googleapis.com/css?family=Material+Icons|Material+Icons+Outlined|Material+Icons+Two+Tone|Material+Icons+Round|Material+Icons+Sharp"
          rel="stylesheet"
        />

        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;700&family=Poppins:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Layout>
        <div className="flex items-start justify-center space-x-6 pl-44 pr-6 py-6 bg-gray-100 ">
          <div className="w-1/2 space-y-6">
            <TweetSomething userImg="/profile.jpg" />
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
    </>
  );
};

export default Home;
