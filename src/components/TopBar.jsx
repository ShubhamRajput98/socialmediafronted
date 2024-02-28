import React, { useEffect, useState } from "react";
import { TbSocial } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CustomButton from "./CustomButton";
import { BsMoon, BsSunFill } from "react-icons/bs";
import { IoMdNotificationsOutline } from "react-icons/io";
import { SetTheme } from "../redux/theme";
import { Logout } from "../redux/userSlice";
import { NotificationCard } from "./Notification";
import { GET_NOTIFICATION, READ_ALL_NOTIFICATION } from "../apiListing";
import { GetApiCall } from "../apiCalling/GetApiCall";
import { PostApiCall } from "../apiCalling/PostApiCall";
import { SetNotification } from "../redux/postSlice";

const TopBar = () => {
  const [open, setOpen] = useState(false);
  const { theme } = useSelector((state) => state.theme);
  const { user } = useSelector((state) => state.user);
  const { notification } = useSelector((state) => state.posts);
  const dispatch = useDispatch();

  useEffect(() => {
    getAllNotification(GET_NOTIFICATION + user?.userId);
  }, []);

  const getAllNotification = async (url) => {
    const response = await GetApiCall(url);
    if (response?.success === true) {
      dispatch(SetNotification(response?.data));
    }
  };

  const handleTheme = () => {
    const themeValue = theme === "light" ? "dark" : "light";

    dispatch(SetTheme(themeValue));
  };

  const readeAllNotification = async () => {
    if (open === false) {
      await PostApiCall(READ_ALL_NOTIFICATION + user?.userId);
      getAllNotification(GET_NOTIFICATION + user?.userId);
    }
  };

  return (
    <>
      <div className="topbar w-full flex items-center justify-between py-3 md:py-6 px-4 bg-primary">
        <Link to="/" className="flex gap-2 items-center">
          <div className="p-1 md:p-2 bg-[#065ad8] rounded text-white">
            <TbSocial />
          </div>
          <span className="text-xl md:text-2xl text-[#065ad8] font-semibold">
            ShareFun
          </span>
        </Link>

        {/* ICONS */}
        <div className="flex gap-4 items-center text-ascent-1 text-md md:text-xl">
          <button onClick={() => handleTheme()}>
            {theme ? <BsMoon /> : <BsSunFill />}
          </button>

          <div className="relative cursor-pointer">
            <IoMdNotificationsOutline
              size={25}
              onClick={() => {
                setOpen(!open);
                readeAllNotification();
              }}
            />

            {notification.every((item) => item.read === false) > 0 && (
              <span
                className="absolute top-0 right-0 h-[8px] w-[8px] rounded-full"
                style={{ background: "red" }}
              ></span>
            )}
          </div>

          <div>
            <CustomButton
              onClick={() => dispatch(Logout())}
              title="Log Out"
              containerStyles="text-sm text-ascent-1 px-4 md:px-6 py-1 md:py-2 border border-[#666] rounded-full"
            />
          </div>
        </div>
      </div>

      {/* show notification data */}

      {open && (
        <div
          className="absolute top-14 md:top-20 z-[50] right-10 w-max h-max rounded overflow-auto shadow-lg"
          style={{ background: theme === "dark" ? "white" : "black" }}
        >
          <NotificationCard
            notification={notification}
            theme={theme}
            open={open}
            onClose={() => setOpen(false)}
          />
        </div>
      )}
    </>
  );
};

export default TopBar;
