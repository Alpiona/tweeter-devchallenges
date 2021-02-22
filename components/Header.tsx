import { NextComponentType } from 'next';

const Header: NextComponentType = () => {
  return (
    <nav className="flex items-center justify-between h-20 pl-16">
      <div>
        <img src="/tweeter.svg" alt="" className="object-left h-7" />
      </div>
      <div className="flex items-center justify-around w-96">
        <h1>Home</h1>
        <h1>Explore</h1>
        <h1>Bookmarks</h1>
      </div>
      <div className="pr-16">Perfil</div>
    </nav>
  );
};

export default Header;
