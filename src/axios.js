import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

import { API_URL } from "./statics/constants";

const instance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-type": "application/json",
  },
});

instance.interceptors.request.use(
  async (config) => {
    console.log(instance.interceptors.request);
    const token = Cookies.get("admin_access_token");
    if (token) {
      console.log(token);
      console.log(config);
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// instance.interceptors.response.use(function (response) {

// return response;
// }, function (error) {
//  console.log(error.response.status)
//   if (error.response.status === 403) {
//     alert("Session timed out ,Please login again.");
// Swal.fire({
//   icon: 'error',
//   title: 'Oops...',
//   text: 'Something went wrong!'})
// Cookies.remove("admin_access_token");
// window.location.href = "/adminPanel/login";
// }else {
// Cookies.remove("admin_access_token");
// window.location.href = "/adminPanel/login";
// }
// return Promise.reject(error);
// });

instance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    // const superAccess = Cookies.get("access");
    // console.log(superAccess);
    console.log(error.response?.status);
    if (error.response?.status === 403 && error.response.data.message === "Your id has been blocked by administrator") {
      alert("Your Account has been blocked, Please Contact Admin");
      Cookies.remove("admin_access_token");
      Cookies.remove("userType");
      Cookies.remove("username");
      Cookies.remove("profileImage");
      this.props.history.push("/adminPanel/login");

      // window.location.href = "/adminPanel/login";
    } else if (error.response?.status === 401) {
      Cookies.remove("admin_access_token");
      Cookies.remove("userType");
      Cookies.remove("username");
      Cookies.remove("profileImage");
      this.props.history.push("/adminPanel/login");
    } else {
      console.log(error.response);
      // alert(`Error:${error.response.data.message}`);
      // Cookies.remove("admin_access_token");
      // window.location.href = "/adminPanel/login";
    }
    return Promise.reject(error);
  }
);

export default instance;
