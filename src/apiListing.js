export const BASE_URL = "http://localhost:5500/socialmedia/";

// user
export const LOGIN_URL = BASE_URL + "user/Login";
export const REGISTER_URL = BASE_URL + "user/Signup";
export const GET_USER_URL = BASE_URL + "user/get-user/";
export const SUGGEST_FRIENDS_URL = BASE_URL + "user/suggest-friend";
export const FRIEND_REQUEST = BASE_URL + "user/friend-request";
export const GET_FRIEND_REQUEST = BASE_URL + "user/get-friend-request";
export const ACCEPT_FRIEND_REQUEST = BASE_URL + "user/accept-friend-request";
export const UPDATE_USER = BASE_URL + "user/update-user/";

// posts
export const CREATE_POST_URL = BASE_URL + "post/create-post";
export const GET_ALL_POSTS = BASE_URL + "post/get-all-posts";
export const GET_ALL_USER_POSTS = BASE_URL + "post/get-user-post/";
export const POST_LIKES = BASE_URL + "post/likes/";
export const CREATE_COMMENT = BASE_URL + "post/create-comment/";
export const REPLY_COMMENT = BASE_URL + "post/reply-comment/";
export const GET_POST_COMMENTS = BASE_URL + "post/get-comments/";
export const LIKE_COMMENT = BASE_URL + "post/like-comment/";
export const DELETE_POST = BASE_URL + "post/";
