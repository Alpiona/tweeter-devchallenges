import { NextComponentType } from 'next';
import Head from 'next/head';
import Header from './Header';

type Props = {
  title: string;
  children: React.ReactNode;
};

const Layout: NextComponentType = ({ title, children }: Props) => {
  return (
    <div>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/tweeter-small.svg" />
      </Head>
      <main>
        <Header />
        {children}
      </main>
    </div>
  );
};

export default Layout;
