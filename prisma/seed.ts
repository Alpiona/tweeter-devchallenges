import { Follower, Profile } from '.prisma/client';
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
    data: { follower_id: followerId, following_id: followingId },
  });
}

async function addProfiles(): Promise<Array<Profile>> {
  const ret = new Array<Profile>();

  ret.push(
    await createProfile(
      'First User',
      'first.user',
      'first@user.com',
      'profile.jpg',
      'background.jpeg',
      'Description test',
    ),
  );

  ret.push(
    await createProfile(
      'Second User',
      'second.user',
      'second@user.com',
      'profile2.jpg',
      'background2.jpg',
      'just to test size of description|| just to test size of description||just to test size of description||just to test size of description||just to test size of description||just to test size of description||just to test size of description||',
    ),
  );

  ret.push(
    await createProfile(
      'Third User',
      'third.user',
      'third@user.com',
      'profile3.jpg',
      'background3.jpg',
      'another description',
    ),
  );

  ret.push(
    await createProfile(
      'Fourth User',
      'fourth.user',
      'fourth@user.com',
      'profile4.jpg',
      'background4.jpg',
    ),
  );

  ret.push(
    await createProfile(
      'Fifth User',
      'fifth.user',
      'fifth@user.com',
      'profile5.jpg',
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

async function main(): Promise<void> {
  const profiles = await addProfiles();
  await addFollowers(profiles);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
