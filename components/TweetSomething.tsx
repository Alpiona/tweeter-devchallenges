import axios from 'axios';
import { FC, FormEvent, useState } from 'react';

interface TweetSomethingProps {
  userImg: string;
}

const TweetSomething: FC<TweetSomethingProps> = ({ userImg }) => {
  const [isPublic, setIsPublic] = useState<boolean>(true);

  function handlePublicOption(): void {
    setIsPublic(!isPublic);
  }

  const handleSubmitTweet = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    axios
      .post(
        `/api/tweet`,
        { isPublic, content: event.target[0].value },
        { headers: { 'Content-Type': 'application/json' } },
      )
      .catch(err => console.log(err.toJSON()));

    window.location.reload();
  };

  return (
    <div className="px-5 pt-4 pb-3 bg-white rounded-lg space-y-2">
      <h1 className="font-semibold text-xs">Tweet something</h1>
      <hr className="pb-2 mt-2" />
      <div className="flex space-x-3">
        <img src={userImg} alt="" className="h-9 w-9 object-cover rounded-lg" />
        <form className="flex-grow font-medium" onSubmit={handleSubmitTweet}>
          <textarea
            name="content"
            rows={3}
            placeholder="Whats happening?"
            className="w-full text-gray-600"
            required
          />
          <div className="flex justify-between">
            <div className="flex space-x-2 text-blue-500">
              <button type="button" className="flex items-center">
                {/* <input type="file" name="file" onClick={} hidden /> */}
                <span className="material-icons-outlined">insert_photo</span>
              </button>

              <button
                type="button"
                className="flex items-center text-sm font-semibold"
                onClick={handlePublicOption}
              >
                {isPublic ? (
                  <>
                    <span className="material-icons-outlined pr-1">public</span>
                    Everyone can see
                  </>
                ) : (
                  <>
                    <span className="material-icons pr-1">people</span>
                    Only who follows
                  </>
                )}
              </button>
            </div>

            <button
              type="submit"
              className="h-8 w-20 bg-blue-500 text-white rounded-md text-sm font-medium"
            >
              Tweet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TweetSomething;
