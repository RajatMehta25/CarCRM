import React, { useRef, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
// import { Checkbox, Tooltip } from "@material-ui/core";
import classNames from "classnames";
import { Paper } from "@material-ui/core";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";
import KErrorMessage from "./KErrorMessage";
import Button from "@material-ui/core/Button";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import axios from "../../axios";
import { toast } from "react-toastify";
import { get } from "lodash";

import Cookies from "js-cookie";
import { handleImageUpload } from "../../services/upload-files-service";
// import PhoneInput from "react-phone-input-2";
// import "react-phone-input-2/lib/style.css";
import { Description } from "@material-ui/icons";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import startsWith from "lodash.startswith";
import TextField from "@material-ui/core/TextField";
import Visibility from "@material-ui/icons/Visibility";

const useStyles = makeStyles((theme) => ({
  root: {
    flexWrap: "wrap",
    // marginTop: '5rem',
  },
  margin: {
    margin: theme.spacing(1),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
  paperHeading: {
    padding: "1rem 0rem",
  },
  table: {
    minWidth: 650,
  },
  textMiddle: {
    verticalAlign: "middle !important",
  },
  iconMargin: {
    margin: "0.5rem",
    color: "#696969",
    backgroundColor: "#fff",
  },
  iconcolor: {
    margin: "0.5rem",
    color: "#fff",
    backgroundColor: "#0294b3 !important",
  },
  headingButton: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    padding: "10px",
  },
  headingAlignment: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    // padding: "0 2rem 0 2rem"
    alignItems: "center",
    flexWrap: "wrap",
    ["@media (max-width:780px)"]: {
      // eslint-disable-line no-useless-computed-key
      flexDirection: "column",
      width: "100%",
      gap: "1rem",
      justifyContent: "center",
      textAlign: "center",
    },
  },
  addNewCategory: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    ["@media (max-width:780px)"]: {
      // eslint-disable-line no-useless-computed-key
      flexDirection: "column",
      width: "100%",
      gap: "1rem",
      justifyContent: "center",
      textAlign: "center",
    },
  },
  addNewCategoryHeading: {
    textAlign: "center",
    flex: 1,
    paddingBottom: "0 !important",
    ["@media (max-width:780px)"]: {
      // eslint-disable-line no-useless-computed-key
      flexDirection: "column",
      width: "100%",
      gap: "1rem",
      justifyContent: "center",
      textAlign: "center",
    },
  },
  MarginControl: {
    ["@media (max-width:780px)"]: {
      // eslint-disable-line no-useless-computed-key
      margin: "0 !important",
    },
  },
  Marginbutton: {
    margin: "0.5rem",
  },
  container: {
    maxHeight: "58vh",
  },
  paperPaddingRightLeft: {
    padding: "0rem 1rem",
  },
}));

const CustomChangePassword = (props) => {
  const classes = useStyles();

  //  data from previous page

  const {
    location: { state },
  } = props;

  const [showpassword, setShowPassword] = useState(false);

  const [showConfirmpassword, setShowConfirmPassword] = useState(false);
  const [showOldpassword, setShowOldPassword] = useState(false);

  const validationSchema = yup.object({
    // email: yup.string().email('Invalid email format').required('Email is Required'),

    oldPassword: yup.string().required("Old Password is required"),
    password: yup
      .string()
      // .matches(
      //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      //   "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
      // )
      .required("Password is Required!"),

    confirmPassword: yup
      .string()
      .required("Confirm Password is Required!")
      .oneOf([yup.ref("password")], "Confirm password should be same as new password"),
  });

  // Edit Category . update api

  // handle checkbox click

  //handle state checkbox click
  // handle checkbox click

  //  var data1;

  // ADDING NEW SUB-ADMIN

  //Edit SubAdmin

  const changePassword = async (values) => {
    const email_id = Cookies.get("email");
    const email = email_id.slice(1, -1);
    console.log("email", email);
    try {
      const { data } = await axios.put(`/private/passwordChange`, {
        // email: email,
        old_password: values.oldPassword,
        password: values.password,
        confirmPassword: values.confirmPassword,
      });
      console.log(data);
      toast.success("Password Changed Successfully", {
        position: "top-right",
      });
      alert("Password Changed Successfully,Login with new password");
      // props.history.push("/admin/login");
      Cookies.remove("admin_access_token");
      Cookies.remove("userType");
      Cookies.remove("username");
      Cookies.remove("profileImage");
      props.history.push("/admin/login");
    } catch (err) {
      {
        console.log(err);
        toast.error(err.response.data.message, { position: "top-right" });
      }
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <div className={classes.root}>
          <Paper>
            <div className={classes.paperPaddingRightLeft}>
              <div className="py-4">
                <Paper elevation={0} className={classNames(classes.paperHeading, classes.addNewCategory)}>
                  <div className={classes.headingSellerDetails}>
                    <Button
                      variant="outlined"
                      aria-label="add"
                      className={classes.iconMargin}
                      onClick={() => {
                        if (window.confirm("Leave this page?")) {
                          props.history.push({
                            pathname: "/adminPanel/dashboard",
                          });
                        }
                      }}
                    >
                      <ArrowBackIcon />
                    </Button>
                  </div>
                  <div className={classNames(classes.addNewCategoryHeading)}>
                    {" "}
                    <h3 className={classNames(classes.MarginControl)} style={{ marginBottom: "-0.5rem", marginLeft: "-135px" }}>
                      {console.log(state)}
                      {!state ? `CHANGE PASSWORD` : `CHANGE PASSWORD`}
                    </h3>
                  </div>
                </Paper>

                {/* //new design */}

                {/* status end */}

                <div style={{ margin: "2rem 0 2rem 0" }}>
                  <Formik
                    validationSchema={validationSchema}
                    initialValues={{
                      // email: "",
                      oldPassword: "",
                      password: "",
                      confirmPassword: "",
                      //  all: get(state, "access", ""),
                    }}
                    onSubmit={(values) => {
                      console.log(values);

                      changePassword(values);
                    }}
                  >
                    {({ values, setFieldValue }) => (
                      <Form>
                        <br />
                        <br />
                        {/* <div className="row text-center">
                          <div
                            className="col-6"
                            style={{ fontSize: 18, fontWeight: "bold" }}
                          >
                            Email
                          </div>
                          <div className="col-6 ml-n2">
                            <Field
                              name="email"
                              type="email"
                              // autoComplete="off"
                              style={{
                                // width: 300,
                                width: "80%",
                                height: 35,
                                borderRadius: 5,
                                borderColor: "#d3d3d3",
                                borderStyle: "solid",
                                borderWidth: 1,
                                paddingInlineStart: 10,
                              }}
                            />
                            <KErrorMessage name="email" />
                            <br />
                          </div>
                        </div> */}
                        <div className="row text-center">
                          <div className="col-6" style={{ fontSize: 18, fontWeight: "bold" }}>
                            Current Password
                          </div>
                          <div className="col-6">
                            <Field
                              name="oldPassword"
                              type={showOldpassword ? "text" : "password"}
                              autoComplete="off"
                              style={{
                                // width: 300,
                                width: "80%",
                                height: 35,
                                borderRadius: 5,
                                borderColor: "#d3d3d3",
                                borderStyle: "solid",
                                borderWidth: 1,
                                paddingInlineStart: 10,
                              }}
                            />
                            {showOldpassword ? (
                              <Visibility style={{ cursor: "pointer" }} onClick={() => setShowOldPassword(false)} />
                            ) : (
                              <VisibilityOffIcon style={{ cursor: "pointer" }} onClick={() => setShowOldPassword(true)} />
                            )}

                            <KErrorMessage name="oldPassword" />
                            <br />
                          </div>
                        </div>

                        <div className="row text-center">
                          <div className="col-6" style={{ fontSize: 18, fontWeight: "bold" }}>
                            New Password
                          </div>
                          <div className="col-6">
                            <Field
                              name="password"
                              type={showpassword ? "text" : "password"}
                              autoComplete="off"
                              style={{
                                // width: 300,
                                width: "80%",
                                height: 35,
                                borderRadius: 5,
                                borderColor: "#d3d3d3",
                                borderStyle: "solid",
                                borderWidth: 1,
                                paddingInlineStart: 10,
                              }}
                            />
                            {showpassword ? (
                              <Visibility style={{ cursor: "pointer" }} onClick={() => setShowPassword(false)} />
                            ) : (
                              <VisibilityOffIcon style={{ cursor: "pointer" }} onClick={() => setShowPassword(true)} />
                            )}

                            <KErrorMessage name="password" />
                            <br />
                          </div>
                        </div>

                        <div className="row text-center">
                          <div className="col-6" style={{ fontSize: 18, fontWeight: "bold" }}>
                            Confirm Password
                          </div>

                          <div className="col-6">
                            <Field
                              name="confirmPassword"
                              type={showConfirmpassword ? "text" : "password"}
                              autoComplete="off"
                              style={{
                                // width: 300,
                                width: "80%",
                                height: 35,
                                borderRadius: 5,
                                borderColor: "#d3d3d3",
                                borderStyle: "solid",
                                borderWidth: 1,
                                paddingInlineStart: 10,
                              }}
                            />
                            {showConfirmpassword ? (
                              <Visibility style={{ cursor: "pointer" }} onClick={() => setShowConfirmPassword(false)} />
                            ) : (
                              <VisibilityOffIcon style={{ cursor: "pointer" }} onClick={() => setShowConfirmPassword(true)} />
                            )}

                            <KErrorMessage name="confirmPassword" />
                            <br />
                          </div>
                        </div>
                        <br />
                        <br />
                        <div className="row text-center">
                          <div className="col-12">
                            <button
                              type="submit"
                              className="buttoncss"
                              style={{
                                borderRadius: "1.5rem",
                                border: "none",
                                fontSize: "1rem",
                                width: "15vw",
                                height: "5vh",
                                backgroundColor: "#0059cd",
                                color: "#fff",
                              }}
                            >
                              SAVE
                            </button>
                          </div>
                        </div>
                        <br />
                        <br />
                      </Form>
                    )}
                  </Formik>
                </div>
              </div>
            </div>
          </Paper>
        </div>
      </div>
    </React.Fragment>
  );
};

export default CustomChangePassword;
