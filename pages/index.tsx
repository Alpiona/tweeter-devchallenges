import { NextPage } from 'next';
import Head from 'next/head';
import Layout from '../components/Layout';
import Trends from '../components/Trends';
import TweetSomething from '../components/TweetSomething';

const Home: NextPage = () => {
  const title = 'Tweeter';
  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/tweeter-small.svg" />
      </Head>
      <Layout>
        <div className="flex items-start space-x-6 pl-44 pr-6 py-6 h- bg-gray-100 ">
          <TweetSomething />
          <Trends />
        </div>
      </Layout>
    </>
  );
};

export default Home;
