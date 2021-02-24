import { NextPage } from 'next';
import Head from 'next/head';
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
        <div className="flex items-start space-x-6 pl-44 pr-6 py-6 bg-gray-100 ">
          <div className="w-2/3 space-y-6">
            <TweetSomething />
            <Tweet
              retweetedBy="Daniel Something"
              userImg="/profile2.jpg"
              userName="Peter Jackson"
              date="24 August at 20:43"
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
          <div className="w-1/3">
            <TrendsList />
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Home;
