import { Link } from "react-router-dom";
import { BASE_URL } from "../apiListing";
import { NoProfile } from "../assets";

export const NotificationCard = ({ notification, theme }) => {
  return (
    <>
      {notification?.map((notification, index) => (
        <Link to={`/singlepost/${notification?.postId}`} key={index}>
          <div className="flex items-center px-2 cursor-pointer">
            <img
              className="w-8 h-8 object-cover"
              src={
                notification?.senderProfile
                  ? BASE_URL + "user/" + notification?.senderProfile
                  : NoProfile
              }
              alt="Sender Profile"
            />

            <div className="px-6 py-1">
              <div
                className="font-bold text-stone-950 text-xl"
                style={{ color: theme === "dark" ? "black" : "white" }}
              >
                {notification?.senderName}
              </div>
              <p
                className="text-stone-950 text-base"
                style={{ color: theme === "dark" ? "black" : "white" }}
              >
                {notification?.senderName} {notification?.message}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </>
  );
};
