import axios from 'axios';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { FC, useEffect, useState } from 'react';

const TrendsList: FC = () => {
  const [hashtags, setHashtags] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/hashtag/trending`)
      .then(response => {
        setHashtags(response.data.hashtags);
      })
      .catch(err => {
        console.log(err.toJSON());
      });
  });

  return (
    <div className="px-5 py-4 bg-white rounded-lg">
      <h1 className="font-semibold text-xs">Trends for you</h1>
      <hr className="pb-2 mt-2" />

      <div className="space-y-7">
        {hashtags.map(hashtag => (
          <div className="space-y-2">
            <h1 className="font-semibold text-ml">{hashtag.content}</h1>
            <h1 className="font-medium text-xs text-gray-500">{`${hashtag.quantity} Tweets`}</h1>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendsList;
