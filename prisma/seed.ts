import { Follower, Profile, Tweet } from '.prisma/client';
import prisma from '../lib/prisma';

async function createProfile(
  name: string,
  username: string,
  email: string,
  profileImage?: string,
  backgroundImage?: string,
  description?: string,
): Promise<Profile> {
  return prisma.profile.create({
    data: {
      name,
      username,
      email,
      profileImage,
      backgroundImage,
      description,
    },
  });
}

async function createFollower(
  followerId: number,
  followingId: number,
): Promise<Follower> {
  return prisma.follower.create({
    data: { followerId, followingId },
  });
}

async function createTweet(
  profileId: number,
  content: string,
  images: string[],
  isPublic = true,
): Promise<Tweet> {
  const tweet = await prisma.tweet.create({
    data: { profileId, content, isPublic },
  });

  images.map(async image => {
    await prisma.tweet.update({
      where: { id: tweet.id },
      data: { images: { create: { content: image } } },
    });
  });

  return tweet;
}

async function createComment(
  tweetId: number,
  profileId: number,
  content: string,
  image: string = null,
): Promise<void> {
  await prisma.tweetComment.create({
    data: {
      tweetId,
      profileId,
      content,
      image,
    },
  });
}

async function addProfiles(): Promise<Array<Profile>> {
  const ret = new Array<Profile>();

  ret.push(
    await createProfile(
      'First User',
      'first.user',
      'first@user.com',
      '/profile.jpg',
      'background.jpeg',
      'Description test',
    ),
  );

  ret.push(
    await createProfile(
      'Second User',
      'second.user',
      'second@user.com',
      '/profile2.jpg',
      '/background2.jpg',
      'just to test size of description|| just to test size of description||just to test size of description||just to test size of description||just to test size of description||just to test size of description||just to test size of description||',
    ),
  );

  ret.push(
    await createProfile(
      'Third User',
      'third.user',
      'third@user.com',
      '/profile3.jpg',
      '/background3.jpg',
      'another description',
    ),
  );

  ret.push(
    await createProfile(
      'Fourth User',
      'fourth.user',
      'fourth@user.com',
      '/profile4.jpg',
      '/background4.jpg',
    ),
  );

  ret.push(
    await createProfile(
      'Fifth User',
      'fifth.user',
      'fifth@user.com',
      '/profile5.jpg',
      null,
      'last one of test. this user does not have background image',
    ),
  );

  return ret;
}

async function addFollowers(profiles: Array<Profile>): Promise<void> {
  await createFollower(profiles[0].id, profiles[1].id);
  await createFollower(profiles[0].id, profiles[2].id);
  await createFollower(profiles[1].id, profiles[3].id);
  await createFollower(profiles[1].id, profiles[2].id);
  await createFollower(profiles[1].id, profiles[4].id);
  await createFollower(profiles[2].id, profiles[3].id);
  await createFollower(profiles[3].id, profiles[4].id);
}

async function addTweets(profiles: Array<Profile>): Promise<Array<Tweet>> {
  const ret = [];
  ret.push(await createTweet(profiles[0].id, 'First tweet of first user', []));
  ret.push(
    await createTweet(
      profiles[0].id,
      'Second tweet of first user with some images',
      ['/image2.jpg', '/image3.jpg'],
    ),
  );

  ret.push(
    await createTweet(
      profiles[0].id,
      'Third tweet of first user. Not public!',
      [],
      false,
    ),
  );

  ret.push(
    await createTweet(
      profiles[1].id,
      'First tweet of second user. Will have image',
      ['/image.jpg'],
    ),
  );
  ret.push(
    await createTweet(
      profiles[2].id,
      'First tweet of third user. Testing space. First tweet of third user. Testing space. First tweet of third user. Testing space. First tweet of third user. Testing space. First tweet of third user. Testing space. First tweet of third user. Testing space. First tweet of third user. Testing space. First tweet of third user. Testing space. First tweet of third user. Testing space. First tweet of third user. Testing space. First tweet of third user. Testing space. First tweet of third user. Testing space. First tweet of third user. Testing space. First tweet of third user. Testing space. First tweet of third user. Testing space. First tweet of third user. Testing space. First tweet of third user. Testing space. First tweet of third user. Testing space. First tweet of third user. Testing space. First tweet of third user. Testing space. First tweet of third user. Testing space. First tweet of third user. Testing space. First tweet of third user. Testing space. First tweet of third user. Testing space. First tweet of third user. Testing space. First tweet of third user. Testing space. First tweet of third user. Testing space. First tweet of third user. Testing space. First tweet of third user. Testing space. First tweet of third user. Testing space. First tweet of third user. Testing space. First tweet of third user. Testing space.',
      [],
    ),
  );
  return ret;
}

async function addRetweets(
  profiles: Array<Profile>,
  tweets: Array<Tweet>,
): Promise<void> {
  await prisma.profile.update({
    where: { id: profiles[0].id },
    data: { retweets: { set: { id: tweets[2].id } } },
  });
}

async function addComments(
  profiles: Array<Profile>,
  tweets: Array<Tweet>,
): Promise<void> {
  await createComment(
    tweets[0].id,
    profiles[1].id,
    'First comment of second user in the first user first tweet.',
  );

  await createComment(
    tweets[0].id,
    profiles[1].id,
    'Second comment of third user in the first user first tweet with image.',
    '/image4.jpg',
  );
}

async function main(): Promise<void> {
  const profiles = await addProfiles();
  await addFollowers(profiles);
  const tweets = await addTweets(profiles);
  await addRetweets(profiles, tweets);
  await addComments(profiles, tweets);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
