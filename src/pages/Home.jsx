import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  CustomButton,
  EditProfile,
  FriendsCard,
  Loading,
  PostCard,
  ProfileCard,
  TextInput,
  TopBar,
} from "../components";
import { Link } from "react-router-dom";
import { NoProfile } from "../assets";
import { BsFiletypeGif, BsPersonFillAdd } from "react-icons/bs";
import { BiImages, BiSolidVideo } from "react-icons/bi";
import { useForm } from "react-hook-form";
import {
  ACCEPT_FRIEND_REQUEST,
  BASE_URL,
  CREATE_COMMENT,
  CREATE_POST_URL,
  CREATE_POST_VIDEO_URL,
  DELETE_POST,
  FRIEND_REQUEST,
  GET_ALL_POSTS,
  GET_FRIEND_REQUEST,
  GET_USER_URL,
  POST_LIKES,
  SEND_NOTIFICATION,
  SUGGEST_FRIENDS_URL,
  VIEW_PROFILE,
} from "../apiListing";
import { PostApiCall } from "../apiCalling/PostApiCall";
import toast from "react-hot-toast";
import { GetApiCall } from "../apiCalling/GetApiCall";
import { UserLogin } from "../redux/userSlice";
import { DeleteApiCall } from "../apiCalling/DeleteApiCall";
import { SetPosts } from "../redux/postSlice";

const Home = () => {
  const { user, edit } = useSelector((state) => state.user);
  const { posts } = useSelector((state) => state.posts);
  const [friendRequest, setFriendRequest] = useState([]);
  const [suggestedFriends, setSuggestedFriends] = useState([]);
  const [errMsg, setErrMsg] = useState("");
  const [file, setFile] = useState(null);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    getSuggestFriends(SUGGEST_FRIENDS_URL, user.userId);
    getFriendRequest(GET_FRIEND_REQUEST, user.userId);
    getUserData(GET_USER_URL + user.userId);
  }, [user.userId]);

  // getUserData
  const getUserData = async (url) => {
    const response = await GetApiCall(url);
    if (response?.success === true) {
      localStorage.setItem("user", JSON.stringify(response.user));
      dispatch(UserLogin(response.user));
    }
  };

  // getAllPostData

  const getAllPostData = async (url, userId) => {
    const response = await PostApiCall(url, { userId });
    if (response?.success === true) {
      dispatch(SetPosts(response?.data));
    } else {
    }
  };

  // getSuggestFriends

  const getSuggestFriends = async (url, userId) => {
    const response = await PostApiCall(url, { userId });
    if (response.success === true) {
      setSuggestedFriends(response.data);
    }
  };

  // getFriendRequest

  const getFriendRequest = async (url, userId) => {
    const response = await PostApiCall(url, { userId });
    if (response.success === true) {
      setFriendRequest(response.data);
    }
  };

  // sendFriendRequest

  const sendFriendRequest = async (requestTo) => {
    const userId = user.userId;
    const response = await PostApiCall(FRIEND_REQUEST, { requestTo, userId });
    if (response.message) {
      toast.success(response.message, {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
        duration: 3000,
      });
    }
  };

  // accept friend request

  const acceptFriendRequest = async (rid, status) => {
    const userId = user.userId;
    const response = await PostApiCall(ACCEPT_FRIEND_REQUEST, {
      rid,
      userId,
      status,
    });

    if (response.success === true) {
      toast.success(response.message, {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
        duration: 3000,
      });

      getFriendRequest(GET_FRIEND_REQUEST, user.userId);
      getUserData(GET_USER_URL + user.userId);
    } else {
      toast.error(response.message, {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
        duration: 3000,
      });
    }
  };

  // likePost

  const likePost = async (postId) => {
    const userId = user?.userId;
    const responce = await PostApiCall(POST_LIKES + postId, { userId });
    if (responce.success === true) {
      getAllPostData(GET_ALL_POSTS, user.userId);
    }
  };

  // viewProfile

  const viewProfile = async (id) => {
    const userId = user.userId;
    await PostApiCall(VIEW_PROFILE, { id, userId });
  };

  // deletePost

  const deletePost = async (postId) => {
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
      getAllPostData(GET_ALL_POSTS, user.userId);
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

  // send post
  const handlePostSubmit = async (data) => {
    const imageValue = {
      userId: user?.userId,
      description: data.description,
      image: file,
    };
    const videoValue = {
      userId: user?.userId,
      description: data.description,
      video: file,
    };

    const response = await PostApiCall(
      file?.type?.startsWith("image") ? CREATE_POST_URL : CREATE_POST_VIDEO_URL,
      file?.type?.startsWith("image") ? imageValue : videoValue,
      "form"
    );
    if (response.success === true) {
      console.log(response);

      toast.success(response.message, {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
        duration: 3000,
      });
      setFile(null);
      reset();
      getAllPostData(GET_ALL_POSTS, user.userId);

      // send notification

      const userId = user?.userId;
      const message = "upload a post";
      const postId = response?.post?._id;

      await PostApiCall(SEND_NOTIFICATION, {
        userId,
        message,
        postId,
      });
    } else if (response.status === 400) {
      toast.error(response.error, {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
        duration: 3000,
      });
    }
  };

  return (
    <>
      <div className="w-full px-0 lg:px-10 pb-20 2xl:px-40 bg-bgColor lg:rounded-lg h-screen overflow-hidden">
        <TopBar />

        <div className="w-full flex gap-2 lg:gap-4 pt-5 pb-10 h-full">
          {/* LEFT */}
          <div className="hidden w-1/3 lg:w-1/4 h-full px-4 md:px-0 md:flex flex-col gap-6 overflow-y-auto">
            <ProfileCard user={user} />
            <FriendsCard friends={user?.friends} />
          </div>

          {/* CENTER */}
          <div className="flex-1 h-full px-4 flex flex-col gap-6 overflow-y-auto rounded-lg">
            <form
              onSubmit={handleSubmit(handlePostSubmit)}
              className="bg-primary px-4 rounded-lg"
            >
              <div className="w-full flex items-center gap-2 py-4 border-b border-[#66666645]">
                <img
                  src={
                    user?.profileUrl
                      ? BASE_URL + "user/" + user?.profileUrl
                      : NoProfile
                  }
                  alt="User Image"
                  className="w-14 h-14 rounded-full object-cover"
                />
                <TextInput
                  styles="w-full rounded-full py-5"
                  placeholder="What's on your mind...."
                  name="description"
                  register={register("description", {
                    required: "Write something about post",
                  })}
                  error={errors.description ? errors.description.message : ""}
                />
              </div>
              {errMsg?.message && (
                <span
                  role="alert"
                  className={`text-sm ${
                    errMsg?.status === "failed"
                      ? "text-[#f64949fe]"
                      : "text-[#2ba150fe]"
                  } mt-0.5`}
                >
                  {errMsg?.message}
                </span>
              )}

              <div className="flex items-center justify-between py-4">
                <label
                  htmlFor="imgUpload"
                  className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer"
                >
                  <input
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="hidden"
                    id="imgUpload"
                    data-max-size="5120"
                    accept=".jpg, .png, .jpeg"
                  />
                  <BiImages />
                  <span>Image</span>
                </label>

                <label
                  className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer"
                  htmlFor="videoUpload"
                >
                  <input
                    type="file"
                    data-max-size="5120"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="hidden"
                    id="videoUpload"
                    accept=".mp4, .wav"
                  />
                  <BiSolidVideo />
                  <span>Video</span>
                </label>

                <label
                  className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer"
                  htmlFor="vgifUpload"
                >
                  <input
                    type="file"
                    data-max-size="5120"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="hidden"
                    id="vgifUpload"
                    accept=".gif"
                  />
                  <BsFiletypeGif />
                  <span>Gif</span>
                </label>

                <div>
                  <CustomButton
                    type="submit"
                    title="Post"
                    containerStyles="bg-[#0444a4] text-white py-1 px-6 rounded-full font-semibold text-sm"
                  />
                </div>
              </div>
            </form>

            {posts?.length > 0 ? (
              posts?.map((post) => (
                <PostCard
                  key={post?._id}
                  post={post}
                  user={user}
                  deletePost={(postId) => deletePost(postId)}
                  likePost={(postId) => likePost(postId)}
                />
              ))
            ) : (
              <div className="flex w-full h-full items-center justify-center">
                <p className="text-lg text-ascent-2">No Post Available</p>
              </div>
            )}
          </div>

          {/* RIGJT */}
          <div className="hidden w-1/4 h-full lg:flex flex-col gap-8 overflow-y-auto">
            {/* FRIEND REQUEST */}
            <div className="w-full bg-primary shadow-sm rounded-lg px-6 py-5">
              <div className="flex items-center justify-between text-xl text-ascent-1 pb-2 border-b border-[#66666645]">
                <span> Friend Request</span>
                <span>{friendRequest?.length}</span>
              </div>

              <div className="w-full flex flex-col gap-4 pt-4">
                {friendRequest?.map(({ _id, requestFrom: from }) => (
                  <div key={_id} className="flex items-center justify-between">
                    <Link
                      to={"/profile/" + from._id}
                      className="w-full flex gap-4 items-center cursor-pointer"
                    >
                      <img
                        src={
                          from?.profileUrl
                            ? BASE_URL + "user/" + from?.profileUrl
                            : NoProfile
                        }
                        alt={from?.name}
                        className="w-10 h-10 object-cover rounded-full"
                      />
                      <div className="flex-1">
                        <p className="text-base font-medium text-ascent-1">
                          {from?.name}
                        </p>
                        <span className="text-sm text-ascent-2">
                          {from?.profession ?? "No Profession"}
                        </span>
                      </div>
                    </Link>

                    <div className="flex gap-1">
                      <CustomButton
                        title="Accept"
                        containerStyles="bg-[#0444a4] text-xs text-white px-1.5 py-1 rounded-full"
                        onClick={() => acceptFriendRequest(_id, "Accepted")}
                      />
                      <CustomButton
                        title="Deny"
                        containerStyles="border border-[#666] text-xs text-ascent-1 px-1.5 py-1 rounded-full"
                        onClick={() => acceptFriendRequest(_id, "Deny")}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SUGGESTED FRIENDS */}
            <div className="w-full bg-primary shadow-sm rounded-lg px-5 py-5">
              <div className="flex items-center justify-between text-lg text-ascent-1 border-b border-[#66666645]">
                <span>Friend Suggestion</span>
              </div>
              <div className="w-full flex flex-col gap-4 pt-4">
                {suggestedFriends?.map((friend) => (
                  <div
                    className="flex items-center justify-between"
                    key={friend._id}
                  >
                    <Link
                      to={"/profile/" + friend?._id}
                      key={friend?._id}
                      className="w-full flex gap-4 items-center cursor-pointer"
                      onClick={() => viewProfile(friend?._id)}
                    >
                      <img
                        src={
                          friend?.profileUrl
                            ? BASE_URL + "user/" + friend?.profileUrl
                            : NoProfile
                        }
                        alt={friend?.name}
                        className="w-10 h-10 object-cover rounded-full"
                      />
                      <div className="flex-1 ">
                        <p className="text-base font-medium text-ascent-1">
                          {friend?.name}
                        </p>
                        <span className="text-sm text-ascent-2">
                          {friend?.profession ?? "No Profession"}
                        </span>
                      </div>
                    </Link>

                    <div className="flex gap-1">
                      <button
                        className="bg-[#0444a430] text-sm text-white p-1 rounded"
                        onClick={() => sendFriendRequest(friend?._id)}
                      >
                        <BsPersonFillAdd size={20} className="text-[#0f52b6]" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {edit && <EditProfile />}
    </>
  );
};

export default Home;
