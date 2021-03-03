import { User } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import NextAuth, { InitOptions } from 'next-auth';
import Adapters from 'next-auth/adapters';
import Providers from 'next-auth/providers';
import prisma from '../../../lib/prisma';

const options: InitOptions = {
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
    signIn: async (
      user: User,
      account: any,
      metadata: any,
    ): Promise<boolean> => {
      console.log(user, 'is the profile');
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
      user.email = sortedEmails[0].email;

      const exist = await prisma.profile.findUnique({
        where: { email: user.email },
      });

      if (exist == null) {
        await prisma.profile.create({
          data: {
            username: user.name,
            name: user.name,
            email: user.email,
            profileImage: user.image,
            description: metadata.bio,
          },
        });
      }

      return true;
    },
  },
};

export default (req: NextApiRequest, res: NextApiResponse): Promise<void> =>
  NextAuth(req, res, options);
