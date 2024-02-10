import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  EditProfile,
  FriendsCard,
  Loading,
  PostCard,
  ProfileCard,
  TopBar,
} from "../components";
import {
  GET_ALL_USER_POSTS,
  GET_USER_URL,
  DELETE_POST,
  POST_LIKES,
} from "../apiListing";
import { GetApiCall } from "../apiCalling/GetApiCall";
import { DeleteApiCall } from "../apiCalling/DeleteApiCall";
import { PostApiCall } from "../apiCalling/PostApiCall";
import toast from "react-hot-toast";

const Profile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { user, edit } = useSelector((state) => state.user);
  // const { posts } = useSelector((state) => state.posts);
  const [userInfo, setUserInfo] = useState([]);
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getAllUserPost(GET_ALL_USER_POSTS + id);
    getUserData(GET_USER_URL + id);
  }, [id]);

  // getAllPostData
  const getAllUserPost = async (url) => {
    const response = await GetApiCall(url);
    if (response?.success === true) {
      setPosts(response?.post);
    }
  };

  // getUserData
  const getUserData = async (url) => {
    const response = await GetApiCall(url);
    if (response?.success === true) {
      setUserInfo(response?.user);
    }
  };

  const handleDelete = async (postId) => {
    const responce = await DeleteApiCall(DELETE_POST + postId);

    if (responce.success === true) {
      toast.success(responce.message, {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
        duration: 3000,
      });
      getAllUserPost(GET_ALL_USER_POSTS + id);
    } else {
      toast.error("Somthing went wrong", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
        duration: 3000,
      });
    }
  };
  const handleLikePost = async (postId) => {
    const userId = user?.userId;
    const responce = await PostApiCall(POST_LIKES + postId, { userId });
    if (responce.success === true) {
      getAllUserPost(GET_ALL_USER_POSTS + id);
    }
  };

  return (
    <>
      <div className="home w-full px-0 lg:px-10 pb-20 2xl:px-40 bg-bgColor lg:rounded-lg h-screen overflow-hidden">
        <TopBar />
        <div className="w-full flex gap-2 lg:gap-4 pt-5 pb-10 h-full">
          {/* LEFT */}
          <div className="hidden w-1/3 lg:w-1/4 px-4 md:px-0 md:flex flex-col gap-6 overflow-y-auto">
            <ProfileCard />

            <div className="block lg:hidden">
              <FriendsCard friends={userInfo?.friends} />
            </div>
          </div>

          {/* CENTER */}
          <div className=" flex-1 h-full bg-orimary px-4 flex flex-col gap-6 overflow-y-auto">
            {loading ? (
              <Loading />
            ) : posts?.length > 0 ? (
              posts?.map((post) => (
                <PostCard
                  post={post}
                  key={post?._id}
                  user={user}
                  deletePost={(postId) => handleDelete(postId)}
                  likePost={(postId) => handleLikePost(postId)}
                />
              ))
            ) : (
              <div className="flex w-full h-full items-center justify-center">
                <p className="text-lg text-ascent-2">No Post Available</p>
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div className="hidden w-1/4 h-full lg:flex flex-col gap-8 overflow-y-auto">
            <FriendsCard friends={userInfo?.friends} />
          </div>
        </div>
      </div>

      {edit && <EditProfile />}
    </>
  );
};

export default Profile;
