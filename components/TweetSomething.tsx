import { FC } from 'react';

const TweetSomething: FC = () => {
  return (
    <div className="px-5 pt-4 pb-3 bg-white rounded-lg space-y-2">
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
          <div className="flex absolute bottom-0 w-full justify-between">
            <div className="flex items-center space-x-2 font-bold">
              <span className="material-icons-outlined text-md text-blue-500">
                insert_photo
              </span>

              <span className="material-icons-outlined text-md text-blue-500">
                public
              </span>

              <div className="text-blue-500 text-sm ">Everyone can reply</div>
            </div>

            <button
              className="h-8 w-20 bg-blue-500 text-white rounded-md font-bold"
              type="submit"
            >
              Tweet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TweetSomething;
