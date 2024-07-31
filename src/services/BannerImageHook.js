import { useState } from "react";
import Axios from "axios";

export const useBannerImageHook = (url) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadForm = async (file) => {
    const formData = new FormData();
    let newData = formData.append("file", file);
    // setIsLoading(true);
    console.log(newData);
    // const { data } = await Axios.post(url, formData, {
    //   headers: {
    //     "Content-Type": "multipart/form-data",
    //   },
    //   onUploadProgress: (progressEvent) => {
    //     const progress = (progressEvent.loaded / progressEvent.total) * 50;
    //     setProgress(progress);
    //   },
    //   onDownloadProgress: (progressEvent) => {
    //     const progress = 50 + (progressEvent.loaded / progressEvent.total) * 50;
    //     console.log(progress);
    //     setProgress(progress);
    //   },
    // });
    setIsSuccess(true);
    // return data.data.image_url;
  };

  return { uploadForm, isSuccess, progress };
};
