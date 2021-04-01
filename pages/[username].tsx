import {
  GetServerSideProps,
  GetStaticPaths,
  GetStaticProps,
  InferGetServerSidePropsType,
  NextPage,
} from 'next';
import { useSession } from 'next-auth/client';
import { format, parseISO } from 'date-fns';
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Tweet from '../components/Tweet';
import SideFilterMenu from '../components/SideFilterMenu';
import ProfileHeader from '../components/ProfileHeader';
import { api } from '../services/api';

type TweetData = {
  id: number;
  profileName: string;
  profileUsername: string;
  profileImage: string;
  updatedAt: string;
  createdAt: string;
  content: string;
  commentsQty: number;
  retweetsQty: number;
  savesQty: number;
  isLiked: boolean;
  isRetweeted: boolean;
  isSaved: boolean;
};

type ProfileData = {
  name: string;
  username: string;
  profileImage: string;
  description: string;
  backgroundImage: string;
  followingQty: number;
  followerQty: number;
};

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: 'blocking' };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { username } = params;
  console.log(`profile/${(username as string).toLowerCase()}`);
  let props = {};
  try {
    const response = await api.get(
      `profile/${(username as string).toLowerCase()}`,
    );
    if (response.status === 404) {
      return {
        redirect: { destination: '/' },
      };
    }
    props = response.data;
  } catch (err) {
    console.log(err);
  }

  return { props };
};

const ProfilePage: NextPage = ({
  backgroundImage,
  description,
  followerQty,
  followingQty,
  name,
  profileImage,
  username,
}: ProfileData) => {
  const [session] = useSession();
  const [tweets, setTweets] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    api
      .get(`tweet/${(username as string).toLowerCase()}`)
      .then(response => {
        console.log(response.data);
        setTweets(response.data.tweets);
        setIsFollowing(response.data.isFollowing);
      })
      .catch(err => console.log(err));
  }, []);

  return (
    <Layout>
      <div
        className="w-full h-72 bg-center absolute z-0"
        style={{ backgroundImage: `url('${backgroundImage}')` }}
      />
      <div className="bg-gray-100 h-auto">
        <div className="w-2/3 mx-auto space-y-6">
          <ProfileHeader
            image={profileImage}
            name={name}
            followingQty={followingQty}
            followersQty={followerQty}
            description={description}
            isFollowing={isFollowing}
          />
          <div className="flex space-x-6">
            <div className="w-1/5">
              <SideFilterMenu option="1" />
            </div>
            <div className="w-4/5 space-y-6">
              {tweets.map(tweet => (
                <Tweet
                  key={tweet.id}
                  retweetedBy={tweet.profileName}
                  profileName={tweet.profileName}
                  profileImage={tweet.profileImage}
                  profileUsername={tweet.profileUsername}
                  date={format(parseISO(tweet.createdAt), "d LLLL 'at' hh:mm")}
                  content={tweet.content}
                  img=""
                  commentsQty={tweet.commentsQty}
                  retweetsQty={tweet.retweetsQty}
                  savedQty={tweet.savesQty}
                  liked={tweet.isLiked}
                  retweeted={tweet.isRetweeted}
                  saved={tweet.isSaved}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
