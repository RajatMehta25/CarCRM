import React, { useRef, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Checkbox, Tooltip } from "@material-ui/core";
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
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import startsWith from "lodash.startswith";
import { Description } from "@material-ui/icons";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
// import startsWith from "lodash.startswith";
import TextField from "@material-ui/core/TextField";
import Visibility from "@material-ui/icons/Visibility";
import { useUploadImage } from "../../services/Imagecustomhook";
import Spinner from "../ServiceManagement/Spinner";
import WallpaperIcon from "@material-ui/icons/Wallpaper";
import { ImageUploadUrl } from "../../statics/constants";
// import ReverseMd5 from "reverse-md5";
// import useNewHook from "../../services/NewHook";

// import './AddEditCategory.css'

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

const AddEdit_SubAdmin = (props) => {
  const classes = useStyles();

  //  data from previous page

  const {
    location: { state },
  } = props;
  const { isSuccess, uploadForm, progress } = useUploadImage(`${ImageUploadUrl}/fileUpload`);
  const [spinnerDisplay, setSpinnerDisplay] = useState(false);

  const [showpassword, setShowPassword] = useState(false);
  const [dialCode, setdialCode] = useState("");

  const fileRef = useRef(null);
  const fileRef1 = useRef(null);
  const SUPPORTED_FORMATS = ["image/jpeg", "image/png", "image/jpg"];
  const Panes = [
    { panelName: "Manage User" },

    { panelName: "Manage Driver" },

    { panelName: "Manage Service" },
    { panelName: "Manage Booking" },
    { panelName: "Manage Promocode" },
    { panelName: "Manage Notification" },
    // { panelName: "Manage FAQ" },
    // { panelName: "Manage Settings" },
    // { panelName: "Manage Notification" },
  ];
  const [panesData, setPanesData] = useState(Panes);
  const [PanesDataFinal, setPanesDataFinal] = useState(null);
  var FinalData;
  const [profileImagepath, setProfileImagepath] = useState("");
  const [documentPath1, setDocumentpath1] = useState("");
  const token = Cookies.get("admin_access_token");
  //Validation Schema

  const validationSchema = yup.object({
    name: yup.string().required("Name is Required!"),
    email: yup.string().email("Invalid Email").required("Email is Required!"),
    phone: yup.string().min(10, "Minimum 10 digits required!").required("Phone is Required!"),
    //  yup
    //  .number()
    //  .min(1000000000, "Not Valid Phone Number!")
    //  .max(9999999999, "Not Valid Phone Number!")
    //  .required("Phone is Required!"),
    password: yup
      .string()
      .matches(/^(?=.{8,}$)(?=.*[a-z])(?=.*[A-Z]).*$/, "Must Contain 8 Characters, One Uppercase, One Lowercase")
      // .matches(
      //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      //   "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
      // )
      .required("Password is Required!"),

    file1: yup
      .string()
      // .nullable()
      .required("Required!"),
    // .test(
    //   "FILE_SIZE",
    //   "File is too Big!",
    //   (value) => !value || (value && value.size <= 1024 * 1024 * 5)
    // )
    // .test(
    //   "FILE_FORMAT",
    //   "File is not in the correct format!",
    //   (value) => !value || (value && SUPPORTED_FORMATS.includes(value?.type))
    // )
    // file2: yup
    //   .string()
    //   // .nullable()
    //   .required("Required!"),
    // .test(
    //   "FILE_SIZE",
    //   "File is too Big!",
    //   (value) => !value || (value && value.size <= 1024 * 1024 * 5)
    // )
    // .test(
    //   "FILE_FORMAT",
    //   "File is not in the correct format!",
    //   (value) => !value || (value && SUPPORTED_FORMATS.includes(value?.type))
    // )
    sub_admin_id: yup.string().required("SubAdmin Id is Required!"),
    // mincheck:yup.array().min(1,"Atleast one checkbox is required!"),
  });

  // Edit Category . update api

  // handle checkbox click
  const handleCheckboxClick = (e) => {
    console.log(e.target);
    const { name, checked } = e.target;
    // console.log(id);

    console.log(name);

    if (name === "ALL") {
      let tempuser = panesData.map((user) => {
        return { ...user, isChecked: checked };
      });
      console.log(tempuser);
      setPanesData(tempuser);
      let SubAdminPanesData = tempuser.filter((user) => user?.isChecked === true);
      FinalData = SubAdminPanesData.map((user) => user?.panelName);
      let filteredvalues = [];
      FinalData.map((user) => {
        if (user === "Manage User") {
          filteredvalues.push("user");
        }
        if (user === "Manage Driver") {
          filteredvalues.push("driver");
        }
        if (user === "Manage Booking") {
          filteredvalues.push("booking");
        }
        if (user === "Manage Service") {
          filteredvalues.push("service");
        }
        if (user === "Manage Promocode") {
          filteredvalues.push("promocode");
        }
        if (user === "Manage Notification") {
          filteredvalues.push("notification");
        }
      });
      // console.log("12554", filteredvalues);
      setPanesDataFinal(filteredvalues);
      //   var SubAdminPanesDataID=SubAdminPanesData.map(user=>user._id);
    } else {
      let tempuser = panesData.map((user) => (user.panelName === name ? { ...user, isChecked: checked } : user));

      setPanesData(tempuser);
      let SubAdminPanesData = tempuser.filter((user) => user?.isChecked === true);
      FinalData = SubAdminPanesData.map((user) => user?.panelName);
      let filteredvalues = [];
      FinalData.map((user) => {
        if (user === "Manage User") {
          filteredvalues.push("user");
        }
        if (user === "Manage Driver") {
          filteredvalues.push("driver");
        }
        if (user === "Manage Booking") {
          filteredvalues.push("booking");
        }
        if (user === "Manage Service") {
          filteredvalues.push("service");
        }
        if (user === "Manage Promocode") {
          filteredvalues.push("promocode");
        }
        if (user === "Manage Notification") {
          filteredvalues.push("notification");
        }
      });
      setPanesDataFinal(filteredvalues);

      console.log(FinalData);
      console.log(SubAdminPanesData);
    }
  };
  let stateAccessModule = [];
  //handle state checkbox click
  // handle checkbox click
  useEffect(() => {
    state && getcheckboxdata();

    state &&
      state.accessModule.map((user) => {
        if (user === "user") {
          stateAccessModule.push({ panelName: "Manage User" });
        }
        if (user === "driver") {
          stateAccessModule.push({ panelName: "Manage Driver" });
        }
        if (user === "booking") {
          stateAccessModule.push({ panelName: "Manage Booking" });
        }
        if (user === "service") {
          stateAccessModule.push({ panelName: "Manage Service" });
        }
        if (user === "promocode") {
          stateAccessModule.push({ panelName: "Manage Promocode" });
        }
        if (user === "notification") {
          stateAccessModule.push({ panelName: "Manage Notification" });
        }
      });
  }, []);

  const getcheckboxdata = () => {
    let checkbox0 = [];
    state.accessModule.map((user) => {
      if (user === "user") {
        checkbox0.push({ panelName: "Manage User", isChecked: true });
      }
      if (user === "driver") {
        checkbox0.push({ panelName: "Manage Driver", isChecked: true });
      }
      if (user === "booking") {
        checkbox0.push({ panelName: "Manage Booking", isChecked: true });
      }
      if (user === "service") {
        checkbox0.push({ panelName: "Manage Service", isChecked: true });
      }
      if (user === "promocode") {
        checkbox0.push({ panelName: "Manage Promocode", isChecked: true });
      }
      if (user === "notification") {
        checkbox0.push({ panelName: "Manage Notification", isChecked: true });
      }

      return checkbox0;
    });

    let merged = [...checkbox0, ...Panes.filter((user) => !stateAccessModule.includes(user.panelName))];
    setPanesDataFinal(stateAccessModule);

    // let checkbox1=checkbox0.concat(Panes)
    // console.log(checkbox1);

    console.log(merged);
    setPanesData(merged);
  };
  //  var data1;
  const handleSateCheckboxClick = (e) => {
    console.log(e.target);
    const { name, checked, value } = e.target;
    // console.log(id);
    console.log(value);
    console.log(checked);
    console.log(name);

    if (name === "ALL") {
      let tempuser = panesData.map((user) => {
        return { ...user, isChecked: checked };
      });
      console.log(tempuser);
      setPanesData(tempuser);
      let SubAdminPanesData = tempuser.filter((user) => user?.isChecked === true);
      FinalData = SubAdminPanesData.map((user) => user?.panelName);
      let filteredvalues = [];
      FinalData.map((user) => {
        if (user === "Manage User") {
          filteredvalues.push("user");
        }
        if (user === "Manage Driver") {
          filteredvalues.push("driver");
        }
        if (user === "Manage Booking") {
          filteredvalues.push("booking");
        }
        if (user === "Manage Service") {
          filteredvalues.push("service");
        }
        if (user === "Manage Promocode") {
          filteredvalues.push("promocode");
        }
        if (user === "Manage Notification") {
          filteredvalues.push("notification");
        }
      });
      setPanesDataFinal(filteredvalues);
    } else {
      let tempuser = panesData.map((user) => (user.panelName === name ? { ...user, isChecked: checked } : user));

      setPanesData(tempuser);
      let SubAdminPanesData = tempuser.filter((user) => user?.isChecked === true);
      console.log(SubAdminPanesData);
      FinalData = SubAdminPanesData.map((user) => user?.panelName);
      let filteredvalues = [];
      FinalData.map((user) => {
        if (user === "Manage User") {
          filteredvalues.push("user");
        }
        if (user === "Manage Driver") {
          filteredvalues.push("driver");
        }
        if (user === "Manage Booking") {
          filteredvalues.push("booking");
        }
        if (user === "Manage Service") {
          filteredvalues.push("service");
        }
        if (user === "Manage Promocode") {
          filteredvalues.push("promocode");
        }
        if (user === "Manage Notification") {
          filteredvalues.push("notification");
        }
      });
      console.log(FinalData);
      setPanesDataFinal(filteredvalues);

      console.log();
      console.log(SubAdminPanesData);
    }
  };

  // ADDING NEW SUB-ADMIN

  const addNewSubAdmin = async (values) => {
    try {
      let profileimageurl = profileImagepath;
      let documentimageurl = documentPath1;
      console.log(profileimageurl);
      console.log(documentimageurl);

      console.log(values);

      console.log(PanesDataFinal);
      const { data } = await axios.post("/private/subadmin", {
        username: values.name,
        email: values.email,
        phone: values.phone,
        password: values.password,
        // subAdmin_id: values.sub_admin_id,
        profileImage: profileimageurl,
        // country_code: `+${dialCode}`,

        accessModule: PanesDataFinal,
      });
      props.history.push({
        pathname: "/adminPanel/SubAdmin_Management",
      });
      toast.success(data.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      console.log(data);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  //Edit SubAdmin
  console.log(PanesDataFinal);
  const EditSubAdmin = async (values) => {
    try {
      let profileimageurl = values.file1;
      let documentimageurl = values.file2;
      console.log(profileimageurl);
      console.log(documentimageurl);

      console.log(values);

      console.log(PanesDataFinal);
      const { data } = await axios.post(`/private/subadmin/${state._id}`, {
        // _id: state._id,
        username: values.name || state.username,
        email: values.email || state.email,
        phone: values.phone || state.mobile_number,
        // subAdmin_id: values.sub_admin_id || state.subAdmin_id,
        password: values.password || state.password,
        profileImage: profileimageurl || state.img,
        // country_code: state.country_code || `+${dialCode}`,
        // sub_admin_document: documentimageurl,
        accessModule: PanesDataFinal,
      });
      props.history.push({
        pathname: "/adminPanel/SubAdmin_Management",
      });
      toast.success(data.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  const decodepass = async (pass) => {};
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
                        if (window.confirm("Leave without saving changes?")) {
                          props.history.push({
                            pathname: "/adminPanel/SubAdmin_Management",
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
                      {!state ? `ADD NEW SUB-ADMIN` : `EDIT SUB-ADMIN`}
                    </h3>
                  </div>
                </Paper>

                {/* //new design */}

                {/* status end */}

                <Paper
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                  }}
                >
                  <div style={{ margin: "2rem 0 2rem 0" }}>
                    <Formik
                      validationSchema={validationSchema}
                      initialValues={{
                        name: get(state, "username", ""),
                        email: get(state, "email", ""),
                        password: get(state, "password", ""),
                        phone: get(state, "phone", ""),
                        // sub_admin_id: get(state, "subAdmin_id", ""),
                        file1: get(state, "profileImage", ""),
                        // file2: get(state, "sub_admin_document", ""),
                        //  all: get(state, "access", ""),
                      }}
                      onSubmit={(values) => {
                        console.log(values);
                        if (state && state !== "") {
                          if (PanesDataFinal.length < 1) {
                            alert("Please Select atleast one Panel");
                          } else {
                            EditSubAdmin(values);
                          }
                        } else if (PanesDataFinal.length < 1) {
                          alert("Please Select atleast one Panel");
                        } else {
                          addNewSubAdmin(values);
                        }
                      }}
                    >
                      {({ values, setFieldValue }) => (
                        <Form>
                          <Paper elevation={1}>
                            <br />
                            <br />
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-evenly",
                                gap: "1.5%",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  justifyContent: "space-evenly",
                                  gap: "0.5%",
                                  alignItems: "baseline",
                                }}
                              >
                                <label className="" style={{}}>
                                  Name:
                                </label>
                                <Field
                                  className=""
                                  name="name"
                                  // variant="outlined"
                                  type="text"
                                  // inputProps={{name: "name"}}

                                  style={{
                                    width: 300,
                                    height: 35,
                                    borderRadius: 5,
                                    borderColor: "#d3d3d3",
                                    borderStyle: "solid",
                                    borderWidth: 1,
                                    paddingInlineStart: 10,
                                  }}
                                />

                                <KErrorMessage name="name" />
                                <br />
                                {/* <br /> */}
                                <label className="" style={{}}>
                                  Email:
                                </label>

                                <Field
                                  className=""
                                  name="email"
                                  type="email"
                                  autoComplete="off"
                                  style={{
                                    width: 300,
                                    height: 35,
                                    borderRadius: 5,
                                    borderColor: "#d3d3d3",
                                    borderStyle: "solid",
                                    borderWidth: 1,
                                    paddingInlineStart: 10,
                                  }}
                                  disabled={!state ? false : true}
                                />

                                <KErrorMessage name="email" />
                                <br />
                                {/* <br /> */}
                                {!state ? (
                                  <>
                                    {/* <label style={{ display: "block" }}>
                                      SubAdmin Id :
                                    </label>
                                    <Field
                                      name="sub_admin_id"
                                      type="text"
                                      style={{
                                        width: 300,
                                        height: 35,
                                        borderRadius: 5,
                                        borderColor: "#d3d3d3",
                                        borderStyle: "solid",
                                        borderWidth: 1,
                                        paddingInlineStart: 10,
                                      }}
                                    />
                                    <KErrorMessage name="sub_admin_id" /> */}
                                  </>
                                ) : (
                                  ""
                                )}
                                <br />
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  // justifyContent: "space-evenly",
                                  // gap: "0.5%",
                                  alignItems: "baseline",
                                }}
                              >
                                {!state ? (
                                  <>
                                    <label style={{}}>Password:</label>
                                    <div className="d-flex flex-row align-items-center">
                                      <Field
                                        name="password"
                                        type={showpassword ? "text" : "password"}
                                        autoComplete="off"
                                        style={{
                                          width: 300,
                                          height: 35,
                                          borderRadius: 5,
                                          borderColor: "#d3d3d3",
                                          borderStyle: "solid",
                                          borderWidth: 1,
                                          paddingInlineStart: 10,
                                        }}
                                      />
                                      {showpassword ? (
                                        <Visibility onClick={() => setShowPassword(false)} style={{ cursor: "pointer" }} />
                                      ) : (
                                        <VisibilityOffIcon
                                          onClick={() => setShowPassword(true)}
                                          style={{ cursor: "pointer" }}
                                        />
                                      )}
                                    </div>
                                    <KErrorMessage name="password" />
                                  </>
                                ) : (
                                  <>
                                    {/* <label style={{ display: "block" }}>
                                      SubAdmin Id :
                                    </label>
                                    <Field
                                      name="sub_admin_id"
                                      type="text"
                                      style={{
                                        width: 300,
                                        height: 35,
                                        borderRadius: 5,
                                        borderColor: "#d3d3d3",
                                        borderStyle: "solid",
                                        borderWidth: 1,
                                        paddingInlineStart: 10,
                                      }}
                                    />
                                    <KErrorMessage name="sub_admin_id" /> */}
                                  </>
                                )}
                                <br />
                                {/* <br /> */}
                                <label
                                // style={!state ? {} : { marginTop: "-1.4rem" }}
                                >
                                  Phone:
                                </label>
                                <PhoneInput
                                  country={"us"}
                                  containerStyle={{}}
                                  inputProps={{
                                    //  name: 'phone',
                                    required: true,

                                    // autoFocus: true
                                  }}
                                  // value={values.phone}
                                  // isValid={(
                                  //   inputNumber,
                                  //   country,
                                  //   countries
                                  // ) => {
                                  //   return countries.some((country) => {
                                  //     return (
                                  //       startsWith(
                                  //         inputNumber,
                                  //         country.dialCode
                                  //       ) ||
                                  //       startsWith(
                                  //         country.dialCode,
                                  //         inputNumber
                                  //       )
                                  //     );
                                  //   });
                                  // }}
                                  // isValid={(value, country) => {
                                  //   let regex =
                                  //     "^\\+?" +
                                  //     country.dialCode +
                                  //     "[0-9]{10,12}$";
                                  //   let regex2 =
                                  //     "^(+d{1,2}s)?(?d{3})?[s.-]d{3}[s.-]d{4}$";
                                  //   if (!value.match(regex)) {
                                  //     return (
                                  //       "Invalid value: " +
                                  //       value +
                                  //       ", " +
                                  //       country.name
                                  //     );
                                  //   } else if (value.match(/\d/g).length < 10) {
                                  //     return false;
                                  //   } else {
                                  //     return true;
                                  //   }
                                  // }}
                                  value={values.phone}
                                  onChange={(e, c) => {
                                    setFieldValue("phone", e);
                                    setdialCode(c.dialCode);
                                  }}
                                  name="phone"
                                  required
                                />
                                {/* <Field name="phone" type="number" /> */}
                                <KErrorMessage name="phone" />
                                <br /> <br />
                              </div>
                            </div>
                            {/* <div style={{textAlign:"center"}}>
                            <label style={{ fontSize: "20px",display:"block"}}>
                              Sub-Admin Id :
                            </label>
                            <Field name="sub_admin_id" type="text" style={{width: 300, height: 35,borderRadius:5,borderColor:"#d3d3d3",borderStyle:"solid",borderWidth:1}} />
                            <KErrorMessage name="sub_admin_id" />
                            <br/>
                          </div> */}
                            <br />
                            <br />
                            <br />
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "center",
                                gap: "1.5%",
                                alignItems: "center",
                                // borderBottom: "1px solid #d3d3d3",
                                // paddingBottom: "15%",
                              }}
                            >
                              <label style={{}}>Upload Profile Image :</label>
                              <input
                                ref={fileRef}
                                name="file1"
                                hidden
                                type="file"
                                accept="image/png, image/jpeg , image/jpg"
                                onChange={async (e) => {
                                  let data = await uploadForm(e.target.files[0]);
                                  // let data2 = await useNewHook(
                                  //   e.target.files[0]
                                  // );
                                  // console.log(data2);
                                  // setDataFile(e.target.files[0]);
                                  setFieldValue("file1", data);
                                  setProfileImagepath(data);
                                }}
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  fileRef.current.click();
                                }}
                                style={{
                                  borderRadius: "5px",
                                  backgroundColor: "#0059cd",
                                  color: "white",
                                  border: "none",
                                  padding: "5px",
                                }}
                              >
                                Upload
                              </button>
                              <KErrorMessage name="file1" />
                              {isSuccess
                                ? progress === 100
                                  ? setSpinnerDisplay(false)
                                  : setSpinnerDisplay(true)
                                : !state &&
                                  profileImagepath === "" && (
                                    <WallpaperIcon
                                      style={{
                                        width: "100px",
                                        height: "100px",
                                      }}
                                    />
                                  )}
                              {
                                // values.file && typeof values.file === "object" ? (
                                //   <PreviewImage file={values.file} />
                                // ) : (
                                !state && profileImagepath !== "" && (
                                  <img
                                    src={profileImagepath}
                                    alt="..."
                                    style={{
                                      width: "50px",
                                      height: "50px",
                                    }}
                                  />
                                )
                              }
                              {state && values.file1 !== "" && (
                                <img src={values.file1} alt="..." style={{ width: "50px", height: "50px" }} />
                              )}

                              {/* <label style={{}}>Upload Document :</label>
                              <input
                                ref={fileRef1}
                                name="file2"
                                hidden
                                type="file"
                                onChange={async (e) => {
                                  let data1 = await handleImageUpload(
                                    e.target.files[0]
                                  );
                                  setFieldValue("file2", data1);
                                  setDocumentpath1(data1);
                                }}
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  fileRef1.current.click();
                                }}
                                style={{
                                  borderRadius: "5px",
                                  backgroundColor: "#0e3f37",
                                  color: "white",
                                  border: "none",
                                  padding: "5px",
                                }}
                              >
                                Upload
                              </button>
                              <KErrorMessage name="file2" /> */}
                              {/* {  values.file1&&<PreviewImage file={values.file1}/>} */}
                              {
                                // values.file1 &&
                                // typeof values.file1 === "object" ? (
                                //   <PreviewImage file={values.file1} />
                                // ) : (
                                // documentPath1 !== "" && (
                                //   <a
                                //     href={documentPath1}
                                //     target="_blank"
                                //     rel="noopener noreferrer"
                                //   >
                                //     <Tooltip title="Click to View" arrow>
                                //       <Description
                                //         style={{
                                //           width: "50px",
                                //           height: "50px",
                                //         }}
                                //       />
                                //     </Tooltip>
                                //   </a>
                                // )
                              }
                              {/* {state && values.file2 !== "" && (
                                <a
                                  href={values.file2}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <Tooltip title="Click to View" arrow>
                                    <Description
                                      style={{ width: "50px", height: "50px" }}
                                    />
                                  </Tooltip>
                                </a>
                              )} */}
                              {/* {console.log(typeof values.file1)} */}
                              {/* <br />
                            <br /> */}

                              <br />
                              <br />
                            </div>
                            <br />
                            {/* <div
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              justifyContent: "center",
                              gap: "1.5%",
                              alignItems: "baseline",
                            }}
                          >
                            <label style={{ fontSize: "20px" }}>
                              Upload Document :
                            </label>
                            <input
                              ref={fileRef1}
                              name="file2"
                              hidden
                              type="file"
                              onChange={async(e) => {
                                let data1 = await handleImageUpload(e.target.files[0]);
                                setFieldValue("file2", data1);
                                setDocumentpath1(data1);
                              }}
                            />
                            <button
                            type="button"
                              onClick={() => {
                                fileRef1.current.click();
                              }}
                              style={{
                                borderRadius: "5px",
                                backgroundColor: "navy",
                                color: "white",
                                border:"none",
                                padding: "5px",
                              }}
                            >
                              Upload
                            </button>
                            <KErrorMessage name="file2" />
                            {
                            documentPath1!=="" &&  (
                             <a href={documentPath1} target="_blank" rel="noopener noreferrer" > <Tooltip title="Click to View" arrow><Description  style={{ width: "50px", height: "50px" }}/></Tooltip></a>
                            )}
                             { state&&values.file2!=="" &&  (
                             <a href={values.file2} target="_blank" rel="noopener noreferrer" ><Tooltip title="Click to View" arrow><Description  style={{ width: "50px", height: "50px" }}/></Tooltip></a>
                            )}
                           
                            <br />
                            <br />
                          </div> */}
                            <br />
                            <br />
                            <br />
                          </Paper>
                          <br />
                          <br />
                          <Paper elevation={1}>
                            <br />
                            <br />
                            <label
                              style={{
                                fontSize: "20px",
                                display: "block",
                                textAlign: "center",
                              }}
                            >
                              Access for Panels :
                            </label>
                            <br />
                            <div
                              style={{
                                // display:"flex",flexWrap:"wrap",justifyContent:"space-between",gap:"10%",margin:"5px 20px 5px 20px"
                                display: "grid",
                                gridTemplateColumns: "auto auto auto",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  marginRight: 20,
                                  marginLeft: 20,
                                  alignItems: "center",
                                }}
                              >
                                <Checkbox
                                  // className="checkedcolor"

                                  color="primary"
                                  name="ALL"
                                  checked={panesData.filter((user) => user?.isChecked !== true).length < 1}
                                  onChange={handleCheckboxClick}
                                />

                                <label style={{}}>Select All</label>
                              </div>
                              {!state
                                ? panesData.map((pane, index) => (
                                    <>
                                      <div
                                        style={{
                                          display: "flex",
                                          marginRight: 20,
                                          marginLeft: 20,
                                          alignItems: "center",
                                        }}
                                      >
                                        <Checkbox
                                          key={index}
                                          // className="checkedcolor"
                                          color="primary"
                                          name={pane.panelName}
                                          checked={pane?.isChecked || false}
                                          onChange={handleCheckboxClick}
                                        />
                                        <label style={{ display: "block" }} key={index + 1}>
                                          {pane.panelName}
                                        </label>
                                      </div>
                                    </>
                                  ))
                                : panesData.map((pane, index) => (
                                    <>
                                      <div
                                        style={{
                                          display: "flex",
                                          marginRight: 20,
                                          marginLeft: 20,
                                          alignItems: "center",
                                        }}
                                      >
                                        <Checkbox
                                          key={index}
                                          color="primary"
                                          name={pane.panelName}
                                          checked={pane?.isChecked || false}
                                          onChange={handleSateCheckboxClick}
                                          value={pane.panelName}
                                        />
                                        <label style={{ display: "block" }} key={index + 1}>
                                          {pane.panelName}
                                        </label>
                                      </div>
                                    </>
                                  ))}
                            </div>
                            <br />
                            <br />
                          </Paper>
                          {/* <KErrorMessage  /> */}
                          <br />
                          <br />
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
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
                        </Form>
                      )}
                    </Formik>
                  </div>
                </Paper>
              </div>
            </div>
          </Paper>
        </div>
        {spinnerDisplay ? (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,

              background: "rgba(0,0,0,0.7)",
              height: "100vh",
              width: "100vw",
            }}
          >
            <div style={{ marginTop: "20%", marginLeft: "20%" }}>
              {" "}
              <Spinner />
            </div>
            //{" "}
            <div
              style={{
                color: "#fff",
                fontSize: "20px",
                fontWeight: "bolder",
                textAlign: "center",
                marginTop: "10%",
                marginLeft: "15%",
              }}
            >
              {Math.ceil(progress)}%
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </React.Fragment>
  );
};

export default AddEdit_SubAdmin;
