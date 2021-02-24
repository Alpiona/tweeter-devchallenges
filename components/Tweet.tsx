import { FC } from 'react';
import Comment from './Comment';
import ReactionButton from './ReactionButton';

interface TweetProps {
  retweetedBy?: string;
  userImg: string;
  userName: string;
  date: string;
  content: string;
  img?: string;
  commentsQty: string;
  retweetsQty: string;
  savedQty: string;
  liked: boolean;
  retweeted: boolean;
  saved: boolean;
}

const Tweet: FC<TweetProps> = ({
  retweetedBy,
  userImg,
  userName,
  date,
  content,
  img,
  commentsQty,
  retweetsQty,
  savedQty,
  liked,
  retweeted,
  saved,
}) => {
  return (
    <div>
      {retweetedBy && (
        <div className="flex pb-1 space-x-1 items-center bg-gray-100 text-gray-500 text-xs">
          <span className="material-icons text-md">loop</span>
          <h1 className="font-noto">{`${retweetedBy} retweeted`}</h1>
        </div>
      )}

      <div className="px-5 py-5 bg-white rounded-xl space-y-3">
        <div className="flex items-center space-x-3">
          <img
            src={userImg}
            alt=""
            className="h-9 w-9 object-cover rounded-lg"
          />
          <div className="space-y-1">
            <h1 className="font-medium text-sm">{userName}</h1>
            <h1 className="font-medium text-gray-400 text-xs">{date}</h1>
          </div>
        </div>
        <h1 className="text-gray-700 font-noto">{content}</h1>
        {img && <img src={img} alt="" className="rounded-xl" />}

        <div>
          <div className="flex pb-1 justify-end space-x-4 text-gray-400 text-xs">
            <h1>{`${commentsQty} Comments`}</h1>
            <h1>{`${retweetsQty} Retweets`}</h1>
            <h1>{`${savedQty} Saved`}</h1>
          </div>
          <hr />
        </div>
        <div className="flex text-sm justify-evenly">
          <ReactionButton action="comment" />
          <ReactionButton action="like" used={liked} />
          <ReactionButton action="retweet" used={retweeted} />
          <ReactionButton action="save" used={saved} />
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
            <span className="material-icons-outlined">insert_photo</span>
          </div>
        </div>
        <hr />
        <div className="pt-3 space-y-4">
          <Comment
            userImg="/profile6.jpg"
            userName="Waqar Bloom"
            date="24 August at 20:43"
            content="I’ve seen awe-inspiring things that I thought I’d never be able to explain to another person."
            liked
            likesQty="12k"
          />
          <Comment
            userImg="/profile3.jpg"
            userName="Bianca Sosa"
            date="23 August at 14:54"
            content="I’ve felt this pull many times, like while road tripping through Morocco. Seeking out the vastness of the desert, and looking inward at the same time. More message just to test the 'read more'."
            liked={false}
            likesQty="8k"
          />
        </div>
      </div>
    </div>
  );
};

export default Tweet;
