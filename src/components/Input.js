import React from "react";

export default function Input(props) {
  const { error, type } = props;

  return (
    <>
      <input {...props} className={type == "radio" ? "" : "form-control"} />
      {error ? <p style={{ paddingTop: 5, fontSize: 13, color: "red" }}>{error}</p> : null}
    </>
  );
}
