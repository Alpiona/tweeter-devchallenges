import { FC } from 'react';

const TweetSomething: FC = () => {
  return (
    <div className="w-2/3 px-5 py-3 bg-white rounded-lg">
      <h1 className="font-bold text-xs">Tweet something</h1>
      <hr className="pb-2 mt-2" />
      <div className="flex items-start space-x-3">
        <img
          src="/profile.jpg"
          alt=""
          className="h-9 w-9 object-cover rounded-lg"
        />
        <div className="h-24 w-full relative">
          <h1 className="text-gray-400">Whats happening?</h1>
          <div className="flex absolute bottom-0 items-center space-x-2 font-bold">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="white"
              stroke="currentColor"
              className="h-4 w-4 text-blue-500 stroke-1.5"
            >
              <path
                fillRule="evenodd"
                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                clipRule="evenodd"
              />
            </svg>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              stroke="currentColor"
              fill="white"
              className="h-4 w-4 text-blue-500 stroke-1.5"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z"
                clipRule="evenodd"
              />
            </svg>

            <div className="text-blue-500 text-sm ">Everyone can reply</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TweetSomething;
