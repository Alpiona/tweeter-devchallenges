import { FC } from 'react';

interface TweetSomethingProps {
  userImg: string;
}

const TweetSomething: FC<TweetSomethingProps> = ({ userImg }) => {
  return (
    <div className="px-5 pt-4 pb-3 bg-white rounded-lg space-y-2">
      <h1 className="font-semibold text-xs">Tweet something</h1>
      <hr className="pb-2 mt-2" />
      <div className="flex items-start space-x-3">
        <img src={userImg} alt="" className="h-9 w-9 object-cover rounded-lg" />
        <div className="h-24 w-full relative font-medium">
          <h1 className="text-gray-400">Whats happening?</h1>
          <div className="flex absolute bottom-0 w-full justify-between">
            <div className="flex items-center space-x-2 text-blue-500">
              <span className="material-icons-outlined">insert_photo</span>

              <span className="material-icons-outlined">public</span>

              <div className="text-sm">Everyone can reply</div>
            </div>

            <button
              className="h-8 w-20 bg-blue-500 text-white rounded-md text-sm font-medium"
              type="button"
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
