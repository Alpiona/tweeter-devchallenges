import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from 'next';
import { getSession, useSession } from 'next-auth/client';
import { format } from 'date-fns';
import Layout from '../components/Layout';
import Tweet from '../components/Tweet';
import prisma from '../lib/prisma';

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {
  const session = await getSession({ req });

  const profile = await prisma.profile.findUnique({
    where: { username: String(params?.username) },
    include: { follower: true, following: true, tweet: true },
  });

  let isFollowing = false;

  if (!profile.follower) {
    profile.follower = [];
  }

  if (!profile.following) {
    profile.following = [];
  }

  if (session) {
    const sessionProfile = await prisma.profile.findUnique({
      where: { email: session.user.email },
    });

    isFollowing = profile.follower.some(
      follower => follower.followerId === sessionProfile.id,
    );
  }

  return { props: { profile, isFollowing } };
};

const ProfilePage: NextPage = ({
  profile,
  isFollowing,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [session, loading] = useSession();

  return (
    <Layout>
      <div
        className="w-full h-72 bg-center absolute z-0"
        style={{ backgroundImage: `url('${profile.backgroundImage}')` }}
      />
      <div className="bg-gray-100 h-auto">
        <div className="w-2/3 mx-auto space-y-6">
          <div className="flex bg-white mt-56 rounded-xl z-10 relative">
            <div className="w-auto">
              <img
                src={`${profile.profileImage}`}
                alt=""
                className="left-5 bottom-12 rounded-xl border-white border-2 relative w-36 h-36 object-cover"
              />
            </div>
            <div className="w-full px-10 py-4 space-y-4">
              <div className="flex justify-between flex-grow relative">
                <div className="flex items-center space-x-6">
                  <div className="font-semibold text-2xl">{profile.name}</div>
                  <div className="flex space-x-1 text-sm">
                    <div className="font-semibold">
                      {profile.following.length.toString()}
                    </div>
                    <div className="font-medium text-gray-500">Following</div>
                  </div>
                  <div className="flex space-x-1 text-sm">
                    <div className="font-semibold">
                      {profile.follower.length.toString()}
                    </div>
                    <div className="font-medium text-gray-500">Followers</div>
                  </div>
                </div>
                {!isFollowing && (
                  <button
                    className="flex items-center py-2 px-4 space-x-1 transform scale-90 bg-blue-500 text-white rounded-md text-sm font-medium"
                    type="button"
                  >
                    <span className="material-icons">person_add</span>
                    <h1>Follow</h1>
                  </button>
                )}
                {isFollowing && (
                  <button
                    className="flex items-center py-2 px-4 space-x-1 transform scale-90 bg-gray-300 text-gray-600 rounded-md text-sm font-medium"
                    type="button"
                  >
                    <span className="material-icons">person_remove</span>
                    <h1>Unfollow</h1>
                  </button>
                )}
              </div>
              <div className="text-semibold text-lg h-24 w-4/5 text-gray-500">
                {profile.description}
              </div>
            </div>
          </div>
          <div className="flex space-x-6">
            <div className="w-1/5">
              <div className="bg-white font-semibold text-gray-400 rounded-xl py-6 space-y-3">
                <h1 className="h-8 pl-4 border-l-3 border-current text-blue-500 leading-8">
                  Tweets
                </h1>
                <h1 className="h-8 pl-5 leading-8">Tweets & replies</h1>
                <h1 className="h-8 pl-5 leading-8">Media</h1>
                <h1 className="h-8 pl-5 leading-8">Likes</h1>
              </div>
            </div>
            <div className="w-4/5 space-y-6">
              {profile.tweet.map(tweet => (
                <Tweet
                  retweetedBy=""
                  userImg={profile.profileImage}
                  userName={profile.name}
                  date={format(tweet.createdAt, "d LLLL 'at' hh:mm")}
                  content={tweet.content}
                  img={tweet.image}
                  commentsQty=""
                  retweetsQty=""
                  savedQty=""
                  liked
                  retweeted
                  saved
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
