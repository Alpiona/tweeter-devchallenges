import Link from 'next/link';
import { NextComponentType } from 'next';

const Header: NextComponentType = () => {
  return (
    <nav className="flex items-center justify-between h-20 pl-16">
      <Link href="/">
        <img src="/tweeter.svg" alt="" className="object-left h-7" />
      </Link>
      <div className="flex items-center justify-around w-96 font-semibold text-base text-gray-500">
        <Link href="/">Home</Link>
        <Link href="/explore">Explore</Link>
        <Link href="/bookmarks">Bookmarks</Link>
      </div>
      <div className="flex pr-16 items-center justify-between">
        <img
          src="/profile.jpg"
          alt=""
          className="h-8 w-8 object-cover rounded-lg"
        />
        <h1 className="pl-3 font-bold font-noto text-sm">André Piona</h1>
      </div>
    </nav>
  );
};

export default Header;
