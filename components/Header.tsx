import Link from 'next/link';
import { NextComponentType } from 'next';
import { signIn, useSession } from 'next-auth/client';
import { ActiveLink } from './ActiveLink';

const Header: NextComponentType = () => {
  const [session, loading] = useSession();

  return (
    <div className="flex items-center justify-between h-20 pl-16 bg-white">
      <a href="/">
        <img src="/tweeter.svg" alt="" className="object-left h-7" />
      </a>
      <nav className="flex items-center justify-around w-96 font-semibold text-base text-gray-500">
        <ActiveLink
          activeClassName="py-5 px-3 mt-1 border-b-3 border-current text-blue-500 leading-8"
          href="/"
        >
          <a>Home</a>
        </ActiveLink>
        <ActiveLink
          activeClassName="py-5 px-3 mt-1 border-b-3 border-current text-blue-500 leading-8"
          href="/explore"
        >
          <a>Explore</a>
        </ActiveLink>
        <ActiveLink
          activeClassName="py-5 px-3 mt-1 border-b-3 border-current text-blue-500 leading-8"
          href="/bookmarks"
        >
          <a>Bookmarks</a>
        </ActiveLink>
      </nav>
      {!session && (
        <button
          type="button"
          className="mr-16"
          onClick={() => signIn('github')}
        >
          Sign in
        </button>
      )}
      {session && (
        <Link href="/profile">
          <div className="flex mr-16 items-center justify-between">
            <img
              src={session.user.image}
              alt=""
              className="h-8 w-8 object-cover rounded-lg"
            />
            <h1 className="pl-3 font-bold font-noto text-sm">
              {session.user.name}
            </h1>
          </div>
        </Link>
      )}
    </div>
  );
};

export default Header;
