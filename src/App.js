import { Outlet, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Suspense, lazy, useEffect } from "react";
import { checkToken } from "./apiCalling/CheckToken";
import { Loading } from "./components";
import { GET_ALL_POSTS } from "./apiListing";
import { SetPosts } from "./redux/postSlice";
import { PostApiCall } from "./apiCalling/PostApiCall";

const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Home = lazy(() => import("./pages/Home"));
const Profile = lazy(() => import("./pages/Profile"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const SinglePost = lazy(() => import("./pages/SinglePost"));

function Layout() {
  const { user } = useSelector((state) => state.user || null);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    checkToken();
    getAllPostData(GET_ALL_POSTS, user?.userId);
  });

  // getAllPostData

  const getAllPostData = async (url, userId) => {
    const response = await PostApiCall(url, { userId });
    if (response?.success === true) {
      dispatch(SetPosts(response?.data));
    }
  };

  return user ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}

function App() {
  const { theme } = useSelector((state) => state.theme);

  return (
    <div data-theme={theme} className="w-full min-h-[100vh]">
      <Routes>
        <Route element={<Layout />}>
          <Route
            path="/"
            element={
              <Suspense
                fallback={
                  <div className="fixed w-screen h-screen flex content-center items-center bg-gray-900">
                    <Loading />
                  </div>
                }
              >
                <Home />
              </Suspense>
            }
          />
          <Route
            path="/profile/:id?"
            element={
              <Suspense
                fallback={
                  <div className="fixed w-screen h-screen flex content-center items-center bg-gray-900">
                    <Loading />
                  </div>
                }
              >
                <Profile />
              </Suspense>
            }
          />
          <Route
            path="/singlepost/:id?"
            element={
              <Suspense
                fallback={
                  <div className="fixed w-screen h-screen flex content-center items-center bg-gray-900">
                    <Loading />
                  </div>
                }
              >
                <SinglePost />
              </Suspense>
            }
          />
        </Route>

        <Route
          path="/register"
          element={
            <Suspense
              fallback={
                <div className="fixed w-screen h-screen flex content-center items-center bg-gray-900">
                  <Loading />
                </div>
              }
            >
              <Register />
            </Suspense>
          }
        />
        <Route
          path="/login"
          element={
            <Suspense
              fallback={
                <div className="fixed w-screen h-screen flex content-center items-center bg-gray-900">
                  <Loading />
                </div>
              }
            >
              <Login />
            </Suspense>
          }
        />
        <Route
          path="/reset-password"
          element={
            <Suspense
              fallback={
                <div className="fixed w-screen h-screen flex content-center items-center bg-gray-900">
                  <Loading />
                </div>
              }
            >
              <ResetPassword />
            </Suspense>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
