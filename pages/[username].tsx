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
import SideFilterMenu from '../components/SideFilterMenu';
import ProfileHeader from '../components/ProfileHeader';

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {
  const session = await getSession({ req });

  const profile = await prisma.profile.findUnique({
    where: { username: String(params?.username) },
    include: {
      followers: true,
      following: true,
      tweets: {
        include: {
          profile: true,
          comments: true,
          images: true,
          likes: true,
          retweets: true,
          saves: true,
        },
      },
      tweetLikes: true,
      tweetSaves: true,
      retweets: {
        include: {
          profile: true,
          comments: true,
          images: true,
          likes: true,
          retweets: true,
          saves: true,
        },
      },
    },
  });

  profile.tweets.push(...profile.retweets);
  profile.tweets.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

  let isFollowing = false;

  if (session) {
    const sessionProfile = await prisma.profile.findUnique({
      where: { email: session.user.email },
    });

    isFollowing = profile.followers.some(
      follower => follower.followerId === sessionProfile.id,
    );

    (profile.tweets as Array<any>).forEach(tweet => {
      tweet.isLiked = tweet.likes.some(like => like.profileId === profile.id);

      tweet.isSaved = tweet.saves.some(save => save.profileId === profile.id);

      tweet.isRetweeted = tweet.retweets.some(
        retweet => retweet.profileId === profile.id,
      );

      return tweet;
    });
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
          <ProfileHeader
            image={profile.profileImage}
            name={profile.name}
            followingQty={profile.following.length.toString()}
            followersQty={profile.followers.length.toString()}
            description={profile.description}
            isFollowing={isFollowing}
          />
          <div className="flex space-x-6">
            <div className="w-1/5">
              <SideFilterMenu option="1" />
            </div>
            <div className="w-4/5 space-y-6">
              {profile.tweets.map(tweet => (
                <Tweet
                  key={tweet.id}
                  retweetedBy={profile.name}
                  userImg={tweet.profile.profileImage}
                  userName={tweet.profile.name}
                  date={format(tweet.createdAt, "d LLLL 'at' hh:mm")}
                  content={tweet.content}
                  img={tweet.image}
                  commentsQty={tweet.comments.length.toString()}
                  retweetsQty={tweet.retweets.length.toString()}
                  savedQty={tweet.saves.length.toString()}
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
