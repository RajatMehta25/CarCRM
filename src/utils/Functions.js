import axios from "../axios";

export const uploadImage =  async  (file) => {
    var formData = new FormData();
  formData.append("media", file);
    await axios
      .post("/auth/uploadImage",formData)
      .then((res) => {
        return res
      })
  
      .catch((err) => {
        
      });
  };
