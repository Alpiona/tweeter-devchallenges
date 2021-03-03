import { url } from 'inspector';
import { NextPage } from 'next';
import { useSession } from 'next-auth/client';
import Layout from '../components/Layout';
import Tweet from '../components/Tweet';

const Profile: NextPage = () => {
  const [session, loading] = useSession();

  return (
    <Layout>
      <div
        className="w-full h-screen bg-gray-200 bg-no-repeat"
        style={{ backgroundImage: "url('/background.jpeg')" }}
      />
    </Layout>
  );
};

export default Profile;
