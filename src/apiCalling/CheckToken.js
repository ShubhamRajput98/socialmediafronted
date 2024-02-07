import toast from "react-hot-toast";
import { BASE_URL } from "../apiListing";
import { store } from "../redux/store";
import { UserLogin } from "../redux/userSlice";

// export const checkToken = async () => {
//   try {
//     const requestOptions = {
//       method: "GET",
//       credentials: "include",
//     };

//     const response = await fetch(`${BASE_URL}user/authStatus`, requestOptions);
//     const result = await response.json();

//     if (result?.message === "ok") {
//       store.dispatch(UserLogin({ data: result }));
//       localStorage.setItem("user", JSON.stringify(result.user));
//     } else if (result.status === 401) {
//       toast.error(result.message);
//     }
//   } catch (error) {
//     console.error("Error fetching data:", error);
//   }
// };
