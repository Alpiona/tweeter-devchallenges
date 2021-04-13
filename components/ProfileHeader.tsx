import axios from 'axios';
import { FC, useState } from 'react';
import FollowButton from './FollowButton';

type ModalProfileData = {
  image: string;
  name: string;
  username: string;
  description: string;
  followersQty: number;
  isFollowing?: boolean;
};

interface ProfileHeaderProps {
  image: string;
  name: string;
  username: string;
  followingQty: number;
  followersQty: number;
  description: string;
}

const ProfileHeader: FC<ProfileHeaderProps> = ({
  image,
  name,
  username,
  followingQty,
  followersQty,
  description,
}) => {
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>();
  const [modalList, setModalList] = useState<ModalProfileData[]>();

  function handleShowModal(
    toOpen: boolean,
    typeUsers?: 'following' | 'followers',
  ): void {
    setModalIsOpen(toOpen);
    if (toOpen) {
      const title =
        typeUsers === 'following'
          ? `${name} is following`
          : `${name} followers`;
      setModalTitle(title);
      axios
        .get(`/api/profile/${username}/${typeUsers}`)
        .then(response => {
          setModalList(response.data);
        })
        .catch(err => console.log(err.toJSON()));
    }
  }

  return (
    <div className="flex bg-white mt-56 rounded-xl z-10 relative">
      <div className="w-auto">
        <img
          src={image}
          alt=""
          className="left-5 bottom-12 rounded-xl border-white border-2 relative w-36 h-36 object-cover"
        />
      </div>
      <div className="w-full px-10 py-4 space-y-4">
        <div className="flex justify-between flex-grow relative">
          <div className="flex items-center space-x-6">
            <div className="font-semibold text-2xl">{name}</div>
            <button
              type="button"
              className="flex space-x-1 text-sm"
              onClick={() => handleShowModal(true, 'following')}
            >
              <div className="font-semibold">{followingQty}</div>
              <div className="font-medium text-gray-500">Following</div>
            </button>
            <button
              type="button"
              className="flex space-x-1 text-sm"
              onClick={() => handleShowModal(true, 'followers')}
            >
              <div className="font-semibold">{followersQty}</div>
              <div className="font-medium text-gray-500">Followers</div>
            </button>
            {modalIsOpen ? (
              <>
                <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                  <div className="relative w-1/2 m-6 mx-auto max-w-3xl">
                    {/* content */}
                    <div className="border-0 rounded-lg shadow-lg px-7 pt-7 relative flex flex-col w-full bg-white outline-none focus:outline-none">
                      {/* header */}
                      <div className="flex items-start justify-between pb-3 rounded-t">
                        <h3 className="text-xl font-semibold">{modalTitle}</h3>

                        <button
                          type="button"
                          className=""
                          onClick={() => handleShowModal(false)}
                        >
                          <span className="material-icons-outlined">close</span>
                        </button>
                      </div>
                      {/* body */}
                      <div className="flex flex-col">
                        {modalList &&
                          modalList.map(profile => (
                            <div
                              key={profile.username}
                              className="py-6 border-t border-solid border-blueGray-200"
                            >
                              <div className="flex items-center">
                                <img
                                  src={profile.image}
                                  alt=""
                                  className="rounded-xl w-10 h-10 object-cover"
                                />
                                <div className="pl-4 space-y-1">
                                  <h1 className="font-semibold">
                                    {profile.name}
                                  </h1>
                                  <h1 className="font-normal text-sm text-gray-500">{`${profile.followersQty} followers`}</h1>
                                </div>
                                <div className="ml-auto">
                                  <FollowButton username={profile.username} />
                                </div>
                              </div>
                              <div className="pt-4 text-semibold text-gray-500">
                                {profile.description}
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="opacity-25 fixed inset-0 z-40 bg-black" />
              </>
            ) : null}
          </div>
          <FollowButton username={username} />
        </div>
        <div className="text-semibold text-lg h-24 w-4/5 text-gray-500">
          {description}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
