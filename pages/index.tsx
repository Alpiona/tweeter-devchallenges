import { NextPage } from 'next';
import Head from 'next/head';
import Layout from '../components/Layout';
import ReactionButton from '../components/ReactionButton';
import TrendsList from '../components/TrendsList';
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
        <div className="flex items-start space-x-6 pl-44 pr-6 py-6 h- bg-gray-100 ">
          <div className="w-2/3 space-y-6">
            <TweetSomething />
            <div className="space-y-1">
              <div className="flex py-1 space-x-1 items-center bg-gray-100 text-gray-500 text-xs">
                <span className="material-icons text-md">loop</span>
                <h1 className="font-noto">Daniel Something retweeted</h1>
              </div>
              <div className="px-5 py-5 bg-white rounded-xl space-y-3">
                <div className="flex items-center space-x-3">
                  <img
                    src="/profile2.jpg"
                    alt=""
                    className="h-9 w-9 object-cover rounded-lg"
                  />
                  <div className="space-y-1">
                    <h1 className="font-medium text-sm">Peter Jackson</h1>
                    <h1 className="font-medium text-gray-400 text-xs">
                      24 August at 20:43
                    </h1>
                  </div>
                </div>
                <h1 className="text-gray-700 font-noto">
                  "We travel, some of us forever, to seek other places, other
                  lives, other souls." - Anais Nin
                </h1>
                <img src="background.jpeg" alt="" className="rounded-xl" />
                <div>
                  <div className="flex pb-1 justify-end space-x-4 text-gray-400 text-xs">
                    <h1>449 Comments</h1>
                    <h1>59k Retweets</h1>
                    <h1>234 Saved</h1>
                  </div>
                  <hr />
                </div>
                <div className="flex text-sm">
                  <ReactionButton action="comment" />
                  <ReactionButton action="like" used />
                  <ReactionButton action="retweet" used />
                  <ReactionButton action="save" used />
                </div>
                <hr />
                <div className="flex items-center space-x-2 h-9">
                  <img
                    src="/profile.jpg"
                    alt=""
                    className="h-9 w-9 object-cover rounded-lg"
                  />
                  <div className="flex items-center justify-between p-2 h-9 w-full border rounded-lg bg-gray-100 text-gray-400 ">
                    <div className="text-sm">Tweet your reply</div>
                    <span className="material-icons-outlined">
                      insert_photo
                    </span>
                  </div>
                </div>
              </div>
            </div>
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
