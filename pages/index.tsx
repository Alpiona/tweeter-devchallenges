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
          <div className="w-2/3 space-y-6">
            <TweetSomething />
            <div className="space-y-2">
              <div className="flex py-1 space-x-1 bg-gray-100 text-gray-500 text-xs font-bold">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <h1>Daniel Something retweeted</h1>
              </div>
              <div className="px-5 py-5 bg-white rounded-xl space-y-3">
                <div className="flex items-center space-x-3">
                  <img
                    src="/profile2.jpg"
                    alt=""
                    className="h-9 w-9 object-cover rounded-lg"
                  />
                  <div className="space-y-1">
                    <h1 className="font-bold text-sm">Peter Jackson</h1>
                    <h1 className="font-semibold text-gray-400 text-xs">
                      24 August at 20:43
                    </h1>
                  </div>
                </div>
                <h1 className="text-gray-700">
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
                  <button
                    type="button"
                    className="flex items-center justify-center font-semibold space-x-2 flex-1 text-gray-600"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="h-4 w-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                      />
                    </svg>
                    <h1>Comment</h1>
                  </button>
                  <button
                    type="button"
                    className="flex items-center justify-center font-semibold space-x-2 flex-1 text-green-500"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="h-4 w-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    <h1>Retweeted</h1>
                  </button>
                  <button
                    type="button"
                    className="flex items-center justify-center font-semibold space-x-2 flex-1 text-red-500"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="h-4 w-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    <h1>Liked</h1>
                  </button>
                  <button
                    type="button"
                    className="flex items-center justify-center font-semibold space-x-2 flex-1 text-blue-500"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="h-4 w-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                      />
                    </svg>
                    <h1>Saved</h1>
                  </button>
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-4 w-4"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-1/3">
            <Trends />
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Home;
