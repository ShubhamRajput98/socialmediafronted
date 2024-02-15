import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts: {},
  notification: [],
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    getPosts(state, action) {
      state.posts = action.payload;
    },
    getNotification(state, action) {
      state.notification = action.payload;
    },
  },
});

export default postSlice.reducer;

export function SetPosts(post) {
  return (dispatch, getState) => {
    dispatch(postSlice.actions.getPosts(post));
  };
}

export function SetNotification(notification) {
  return (dispatch, getState) => {
    dispatch(postSlice.actions.getNotification(notification));
  };
}
