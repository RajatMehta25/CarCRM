import Axios from "axios";
import { useState } from "react";

export async function handleImageUpload(file) {
  // const [progress, setProgress] = useState(0);
  const formData = new FormData();
  formData.append("file", file);
  console.log(file);
  const config = {
    // baseURL: "http://18.221.140.83:3000",
    baseURL: "https://happytaxiadmin.us",
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (progressEvent) => {
      const progress = (progressEvent.loaded / progressEvent.total) * 50;
      // setProgress(progress);
      console.log(progressEvent.loaded);
      console.log(progress);
    },
    onDownloadProgress: (progressEvent) => {
      const progress = 50 + (progressEvent.loaded / progressEvent.total) * 50;
      console.log(progress);
      // setProgress(progress);
    },
  };
  // const [progress, setProgress] = useState(0);
  // const instance = axios.create({
  //   baseURL: "http://18.221.140.83:3000",
  //   headers: {
  //     "Content-type": "application/json",
  //   },
  // });
  try {
    const { data } = await Axios.post("/fileUpload", formData, config);
    console.log(data);

    return data.data.image_url;
    //{ location: data.result.file, };
  } catch (err) {
    return err;
  }
}
// import { useState } from "react";
// import axios from "axios";

// export const useUploadForm = (url) => {
//   const [isSuccess, setIsSuccess] = useState(false);
//   const [progress, setProgress] = useState(0);

//   const uploadForm = async (formData) => {
//     setIsLoading(true);
//     await axios.post(url, formData, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//       onUploadProgress: (progressEvent) => {
//         const progress = (progressEvent.loaded / progressEvent.total) * 50;
//         setProgress(progress);
//       },
//       onDownloadProgress: (progressEvent) => {
//         const progress = 50 + (progressEvent.loaded / progressEvent.total) * 50;
//         console.log(progress);
//         setProgress(progress);
//       },
//     });
//     setIsSuccess(true);
//   };

//   return { uploadForm, isSuccess, progress };
// };
