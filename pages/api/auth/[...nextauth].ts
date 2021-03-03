import { NextApiRequest, NextApiResponse } from 'next';
import NextAuth from 'next-auth';
import Adapters from 'next-auth/adapters';
import Providers from 'next-auth/providers';
import prisma from '../../../lib/prisma';

const options = {
  // Configure one or more authentication providers
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    // ...add more providers here
  ],
  adapter: Adapters.Prisma.Adapter({ prisma }),
  callbacks: {
    signIn: async (profile: any, account: any, metadata: any) => {
      console.log(profile, 'is the profile');
      console.log(account, 'is the account');
      console.log(metadata, 'is the metadata');
      const res = await fetch('https://api.github.com/user/emails', {
        headers: {
          Authorization: `token ${account.accessToken}`,
        },
      });
      const emails = await res.json();
      if (!emails || emails.length === 0) {
        return;
      }
      const sortedEmails = emails.sort((a, b) => b.primary - a.primary);
      // eslint-disable-next-line
      profile.email = sortedEmails[0].email;

      await prisma.profile.create({
        data: {
          username: profile.name,
          name: profile.name,
          email: profile.email,
          profileImage: profile.image,
          description: metadata.bio,
        },
      });
    },
  },
};

export default (req: NextApiRequest, res: NextApiResponse): Promise<void> =>
  NextAuth(req, res, options);
