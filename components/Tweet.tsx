import axios from 'axios';
import { format, parseISO } from 'date-fns';
import { FC, useState } from 'react';
import Comment from './Comment';
import ReactionButton from './ReactionButton';

interface CommentProps {
  id: number;
  userImage: string;
  userName: string;
  userUsername: string;
  createdAt: string;
  updatedAt: string;
  content: string;
  likesQty: number;
  isLiked: boolean;
}
interface TweetProps {
  id: number;
  retweetedByName?: string;
  retweetedByUsername?: string;
  profileImage: string;
  profileName: string;
  profileUsername: string;
  date: string;
  content: string;
  img?: string;
  commentsQty: number;
  retweetsQty: number;
  savedQty: number;
  liked: boolean;
  retweeted: boolean;
  saved: boolean;
}

const Tweet: FC<TweetProps> = ({
  id,
  retweetedByName,
  retweetedByUsername,
  profileImage,
  profileName,
  profileUsername,
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
  const [comments, setComments] = useState<CommentProps[]>([]);
  const [isLiked, setLikeStatus] = useState<boolean>(liked);
  const [isRetweeded, setRetweetStatus] = useState<boolean>(retweeted);
  const [isSaved, setSaveStatus] = useState<boolean>(saved);

  async function handleLikeUpdate(): Promise<void> {
    axios
      .patch(`/api/tweet/${id}/like?status=${!isLiked}`)
      .then(response => {
        setLikeStatus(response.data);
      })
      .catch(err => console.log(err));
  }

  async function handleRetweetUpdate(): Promise<void> {
    axios
      .patch(`/api/tweet/${id}/retweet?status=${!isRetweeded}`)
      .then(response => {
        setRetweetStatus(response.data);
      })
      .catch(err => console.log(err));
  }

  async function handleSaveUpdate(): Promise<void> {
    axios
      .patch(`/api/tweet/${id}/save?status=${!isSaved}`)
      .then(response => {
        setSaveStatus(response.data);
      })
      .catch(err => console.log(err));
  }

  async function handleCommentsList(): Promise<void> {
    axios
      .get(`/api/tweet/${id}/comments`)
      .then(response => {
        setComments(response.data.comments);
      })
      .catch(err => console.log(err));
  }

  return (
    <div>
      {retweetedByName && (
        <a
          href={`/${retweetedByUsername}`}
          className="flex pb-1 space-x-1 items-center bg-gray-100 text-gray-500 text-xs"
        >
          <span className="material-icons text-md">loop</span>
          <h1 className="font-noto">{`${retweetedByName} retweeted`}</h1>
        </a>
      )}

      <div className="px-5 py-5 bg-white rounded-xl space-y-3">
        <div className="flex items-center space-x-3">
          <img
            src={profileImage}
            alt=""
            className="h-9 w-9 object-cover rounded-lg"
          />
          <div className="space-y-1">
            <a href={`/${profileUsername}`} className="font-medium text-sm">
              {profileName}
            </a>
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
          <ReactionButton
            action="comment"
            id={id}
            onClick={handleCommentsList}
          />
          <ReactionButton
            action="like"
            id={id}
            used={isLiked}
            onClick={handleLikeUpdate}
          />
          <ReactionButton
            action="retweet"
            id={id}
            used={isRetweeded}
            onClick={handleRetweetUpdate}
          />
          <ReactionButton
            action="save"
            id={id}
            used={isSaved}
            onClick={handleSaveUpdate}
          />
        </div>
        <hr />
        <div className="flex items-center space-x-2 h-9">
          <img
            src="/profile.jpg"
            alt=""
            className="h-9 w-9 object-cover rounded-lg"
          />
          <div className="flex flex-grow items-center justify-between p-2 h-9 w-full border rounded-lg bg-gray-100 text-gray-400 ">
            <div className="text-sm">Tweet your reply</div>
            <span className="material-icons-outlined">insert_photo</span>
          </div>
        </div>
        {comments.length !== 0 && (
          <>
            <hr />
            <div className="pt-3 space-y-4">
              {comments.map(comment => (
                <Comment
                  key={comment.id}
                  id={comment.id}
                  userImg={comment.userImage}
                  userName={comment.userName}
                  userUsername={comment.userUsername}
                  date={format(
                    parseISO(comment.createdAt),
                    "dd LLLL 'at' hh:mm",
                  )}
                  content={comment.content}
                  liked={comment.isLiked}
                  likesQty={comment.likesQty}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Tweet;
