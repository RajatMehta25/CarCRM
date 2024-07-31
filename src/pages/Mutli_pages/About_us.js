import React, { useEffect, useState } from "react";
import axios from "../../axios";

const About_us = () => {
  useEffect(() => {
    getData();
  }, []);

  const [apiData, setApiData] = useState("");
  const getData = async () => {
    try {
      const { data } = await axios.get(`/private/listWebPage`);
      console.log(data);
      setApiData(data.data[0].html);
    } catch (error) {
      console.log(error);
    }
  };

  const style = {
    backgroundColor: "#C3F8FF",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
    margin: "auto",
  };

  return (
    <div
      style={style}
      // dangerouslySetInnerHTML={{ __html: apiData }}
    ></div>
  );
};

export default About_us;
