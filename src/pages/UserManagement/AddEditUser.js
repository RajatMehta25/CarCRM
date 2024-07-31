import React, { useState, useRef, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
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
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { handleImageUpload } from "../../services/upload-files-service";
import { logDOM } from "@testing-library/dom";
import Visibility from "@material-ui/icons/Visibility";
import { VisibilityOff } from "@material-ui/icons";
import WallpaperIcon from "@material-ui/icons/Wallpaper";
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

const AddEditUser = (props) => {
  const classes = useStyles();

  //  data from previous page
  useEffect(() => {
    // getactivemenuitem();
  }, []);
  const {
    location: { state },
  } = props;
  console.log(props);
  const getactivemenuitem = () => {
    const result = [...document.getElementsByTagName("a")];
    const newres = result.filter((ele) => {
      if (ele.innerText === "Manage User") {
        return ele;
      }
    });
    newres[0].classList.add("activate");
    console.log(newres);
    console.log(result);
  };

  const fileRef = useRef(null);

  const [phone, setPhone] = useState("");
  console.log(phone);
  const [DialCode, setDialCode] = useState("");
  const [profileImagepath, setProfileImagepath] = useState("");
  //Validation Schema

  const validationSchema = yup.object({
    name: yup.string().required("Name is Required!"),
    email: yup.string().email("Invalid Email").required("Email is Required!"),
    password: yup.string().required("Password is Required!"),
    // gender: yup.string().required("Gender is Required!"),
    // file1:yup.string().required("Video is Required!"),
    Rnumber: yup.string().min(10, "Minimum 10 digits required!").required("Registration Number is Required!"),
    file1: yup.string().required("Profile Image is Required!"),
    //    desc: yup
    //    .string()
    //    .min(5, "too small!")
    //    .max(500, "Too Long String!")
    //    .required("Required!"),
  });
  const validationSchema2 = yup.object({
    name: yup.string().required("Name is Required!"),
    email: yup.string().email("Invalid Email").required("Email is Required!"),
    //  password: yup.string().required("Password is Required!"),
    // gender: yup.string().required("Gender is Required!"),
    // file1:yup.string().required("Video is Required!"),
    Rnumber: yup.string().min(10, "Minimum 10 digits required!").required("Registration Number is Required!"),
    file1: yup.string().required("Profile Image is Required!"),
    //    desc: yup
    //    .string()
    //    .min(5, "too small!")
    //    .max(500, "Too Long String!")
    //    .required("Required!"),
  });

  // ADDING NEW CATEGORY

  const addNewCategory = async (values) => {
    try {
      console.log(values);
      console.log(DialCode);
      console.log(values.Rnumber.slice(DialCode.length));
      const { data } = await axios.post("/admin/users", {
        first_name: values.name,
        country_code: `+${DialCode}`,
        phone_number: values.Rnumber.slice(DialCode.length),
        // "gender":"Male",
        email: values.email,
        password: values.password,
        device_type: "Web",
        device_token: "useless",
        profile_picture: values.file1,
      });
      props.history.push({
        pathname: "/adminPanel/user-management",
      });
      toast.success(data.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      console.log(data);
    } catch (error) {
      console.log(error.response.status);
      if (error.response.status === 403) {
        toast.error("Email Already Exists", {
          position: toast.POSITION.TOP_RIGHT,
        });
      } else {
      }
    }
  };

  // Edit Category . update api

  const EditCategory = async (values) => {
    try {
      console.log(values);

      const { data } = await axios.put(`/admin/users/${state.id}`, {
        first_name: values.name,
        country_code: `${DialCode}`,
        phone_number: values.Rnumber.slice(DialCode.length),
        // "gender":"Male",
        email: values.email,
        profile_picture: values.file1,
      });
      props.history.push({
        pathname: "/adminPanel/user-management",
      });
      toast.success(data.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  console.log(DialCode.length);

  const [showpassword, setShowPassword] = useState(false);
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
                            pathname: "/adminPanel/user-management",
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
                      {!state ? `ADD NEW USER` : `EDIT USER`}
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
                      validationSchema={!state ? validationSchema : validationSchema2}
                      initialValues={{
                        name: get(state, "first_name", ""),
                        Rnumber: get(state, "country_code", "") + get(state, "phone_number", ""),
                        email: get(state, "email", ""),
                        password: get(state, "password", ""),
                        // gender:get(state,"gender",""),
                        file1: get(state, "profile_picture", ""),

                        //   desc: get(state, "desc", ""),
                      }}
                      onSubmit={(values) => {
                        console.log(values);
                        if (state && state !== "undefined") {
                          EditCategory(values);
                        } else {
                          addNewCategory(values);
                        }
                      }}
                    >
                      {({ values, setFieldValue }) => (
                        <Form className="vw-50">
                          {/* <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>  <label  className="labelAddCategory" style={{fontSize:"18px",width:"50%"}}>UserName :</label>
            <Field style={{width:"50%",height:"35px",borderRadius:"5px",border:"1px solid #c4c4c4"}} className="fieldAddCategory" name="name" type="text"   />
            </div><KErrorMessage name="name"  />
            <br /> <br />
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>  <label  className="labelAddCategory" style={{fontSize:"18px",width:"50%"}}>Registration Number :</label>
          
          
           
            <PhoneInput
  country={'us'}
 
  style={{display:"flex",width:"50%"}}
  inputProps={{
     name: 'Rnumber',
    required: true,
   
  }}
  value={values.Rnumber}
  onChange={(phonenumber,data,event,formattedValue )=> {setPhone(phonenumber); setDialCode(data.dialCode);setFieldValue("Rnumber",phonenumber)}}
/></div><KErrorMessage name="Rnumber" />
<br /> <br />

           <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}> <label  className="labelAddCategory" style={{fontSize:"18px",width:"50%"}}>Email ID :</label>
            <Field style={{width:"50%",height:"35px",borderRadius:"5px",border:"1px solid #c4c4c4"}} className="fieldAddCategory" name="email" type="email"   />
            </div><KErrorMessage name="email" />
            <br /> <br />
        { !state? <><div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>  <label  className="labelAddCategory" style={{fontSize:"18px",width:"50%"}}>Password :</label>
           <Field style={{width:"50%",height:"35px",borderRadius:"5px",border:"1px solid #c4c4c4"}} className="fieldAddCategory" name="password" type={showpassword?"text":"password"}   />
            {showpassword? <Visibility   onClick={()=>setShowPassword(false)}/> :<VisibilityOff  onClick={()=>setShowPassword(true)}/>}
</div><KErrorMessage name="password" />
            <br /> <br /></>:null} */}
                          {/* <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}> <label  className="labelAddCategory" style={{fontSize:"18px",width:"50%"}}>Gender :</label>
          <div style={{display:"flex",alignItems:"center",width:"150px"}}>  <Field style={{width:"30px",height:"20px",borderRadius:"5px",border:"1px solid #c4c4c4"}} className="fieldAddCategory" name="gender" type="radio" value="male"   />
            <label  className="labelAddCategory" style={{fontSize:"18px",width:"30px",padding:"8px 0 0 0"}}>Male</label></div> */}
                          {/* <div style={{display:"flex",alignItems:"center",width:"150px"}}>  <Field style={{width:"30px",height:"20px",borderRadius:"5px",border:"1px solid #c4c4c4"}} className="fieldAddCategory" name="gender" type="radio" value="female"  />
            <label  className="labelAddCategory" style={{fontSize:"18px",width:"30px",padding:"8px 0 0 0"}}>Female</label></div>

            </div><KErrorMessage name="gender" />
            <br /> <br /> */}
                          {/* <label className="labelAddCategory" style={{fontSize:"20px"}}>Description of Category:</label>
            <Field className="fieldAddCategory custom_height" name="desc" as="textarea"  /> */}
                          {/* <KErrorMessage name="desc" /> */}
                          {/* <br /> <br /> */}
                          {/* <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
               <label  className="labelAddCategory" style={{fontSize:"18px",width:"50%"}}>Video :</label>
               <input
                              ref={fileRef}
                              name="file1"
                              hidden
                              type="file"
                              accept="video/*"
                              onChange={async(e) => {
                                let data = await handleImageUpload(e.target.files[0]);
                                setFieldValue("file1", data);
                                // setProfileImagepath(data);
                              }}
                            />
                            <button
                            type="button"
                              onClick={() => {
                                fileRef.current.click();
                              }}
                              style={{
                                borderRadius: "5px",
                                backgroundColor: "#2765B3",
                                color: "white",
                                border:"none",
                                padding: "5px",
                                width: "150px"
                                
                              }}
                            >
                              Upload
                            </button>
                           
                            {
                            // values.file && typeof values.file === "object" ? (
                            //   <PreviewImage file={values.file} />
                            // ) : (


                            // profileImagepath!=="" &&  (
                            // <img
                            //     src={profileImagepath}
                            //     alt="..."
                            //     style={{ width: "50px", height: "50px" }}
                            //   />
                            // )
                            }
                            {state&&values.file1!=="" && (
                              <img
                              src={values.file1}
                              alt="..."
                              style={{ width: "50px", height: "50px" }}
                            />
                          )  
                            }</div>
                             <KErrorMessage name="file1" />
            <br /> <br /> */}
                          {/* Bootstrap */}
                          <div className="container-fluid">
                            {/* row 1 */}
                            <div className="row my-5">
                              <div className="col-lg-4">
                                <label className="" style={{ fontSize: "18px" }}>
                                  User Name :
                                </label>
                              </div>
                              <div className="col-lg-8">
                                <Field
                                  style={{
                                    width: "100%",
                                    height: "35px",
                                    borderRadius: "5px",
                                    border: "1px solid #c4c4c4",
                                    paddingInlineStart: 10,
                                  }}
                                  className="fieldAddCategory"
                                  name="name"
                                  type="name"
                                />
                                <KErrorMessage name="name" />
                              </div>
                            </div>
                            {/* row 2 */}
                            <div className="row my-5">
                              <div className="col-lg-4">
                                <label className="" style={{ fontSize: "18px" }}>
                                  Phone Number :
                                </label>
                              </div>
                              <div className="col-lg-8">
                                <PhoneInput
                                  country={"us"}
                                  // name="Rnumber"
                                  style={{ display: "flex" }}
                                  inputProps={{
                                    name: "Rnumber",
                                    required: true,
                                    // width:"50%"
                                    // autoFocus: true
                                  }}
                                  value={values.Rnumber}
                                  onChange={(phonenumber, data, event, formattedValue) => {
                                    setPhone(phonenumber);
                                    setDialCode(data.dialCode);
                                    setFieldValue("Rnumber", phonenumber);
                                  }}
                                />
                                <KErrorMessage name="Rnumber" />
                              </div>
                            </div>
                            {/* row 3 */}
                            {!state ? (
                              <div className="row my-5">
                                <div className="col-lg-4">
                                  <label className="" style={{ fontSize: "18px" }}>
                                    Email ID :
                                  </label>
                                </div>
                                <div className="col-lg-8">
                                  <Field
                                    style={{
                                      width: "100%",
                                      height: "35px",
                                      borderRadius: "5px",
                                      border: "1px solid #c4c4c4",
                                      paddingInlineStart: 10,
                                    }}
                                    className="fieldAddCategory"
                                    name="email"
                                    type="email"
                                  />
                                  <KErrorMessage name="email" />
                                </div>
                              </div>
                            ) : (
                              <div className="row my-5">
                                <div className="col-lg-4">
                                  <label className="" style={{ fontSize: "18px" }}>
                                    Email ID :
                                  </label>
                                </div>
                                <div className="col-lg-8">
                                  <Field
                                    disabled
                                    style={{
                                      width: "100%",
                                      height: "35px",
                                      borderRadius: "5px",
                                      border: "1px solid #c4c4c4",
                                      paddingInlineStart: 10,
                                    }}
                                    className="fieldAddCategory"
                                    name="email"
                                    type="email"
                                  />
                                  <KErrorMessage name="email" />
                                </div>
                              </div>
                            )}
                            {/* row 4 */}
                            {!state ? (
                              <div className="row my-5">
                                <div className="col-lg-4">
                                  <label className="" style={{ fontSize: "18px" }}>
                                    Password :
                                  </label>
                                </div>
                                <div className="col-lg-8 d-flex align-items-center">
                                  <Field
                                    style={{
                                      width: "100%",
                                      height: "35px",
                                      borderRadius: "5px",
                                      border: "1px solid #c4c4c4",
                                      paddingInlineStart: 10,
                                    }}
                                    className="fieldAddCategory"
                                    name="password"
                                    type={showpassword ? "text" : "password"}
                                  />
                                  {showpassword ? (
                                    <Visibility onClick={() => setShowPassword(false)} />
                                  ) : (
                                    <VisibilityOff onClick={() => setShowPassword(true)} />
                                  )}
                                  <KErrorMessage name="password" />
                                </div>
                              </div>
                            ) : (
                              ""
                            )}
                            {/* row 5 */}
                            <div className="row my-5 align-items-center">
                              <div className="col-lg-4">
                                <label className="" style={{ fontSize: "18px" }}>
                                  Upload Image :
                                </label>
                              </div>
                              <div className="col-lg-4">
                                <input
                                  ref={fileRef}
                                  name="file1"
                                  hidden
                                  type="file"
                                  accept="image/png, image/jpeg , image/jpg"
                                  onChange={async (e) => {
                                    let data = await handleImageUpload(e.target.files[0]);
                                    // console.log(data);
                                    // console.log(e.target.files[0]);
                                    console.log(data);
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
                                    backgroundColor: "#2765B3",
                                    color: "white",
                                    border: "none",
                                    padding: "5px",
                                  }}
                                >
                                  Upload
                                </button>
                              </div>

                              <div className="col-lg-4">
                                {!state && profileImagepath === "" && (
                                  <WallpaperIcon style={{ width: "100px", height: "100px" }} />
                                )}
                                {
                                  //  !state&&profileImagepath==="" &&( <WallpaperIcon/>)

                                  !state && profileImagepath !== "" && (
                                    <img
                                      src={profileImagepath}
                                      alt="..."
                                      style={{
                                        width: "100px",
                                        height: "100px",
                                      }}
                                    />
                                  )
                                }
                                {state && values.file1 !== "" && (
                                  <img src={values.file1} alt="..." style={{ width: "100px", height: "100px" }} />
                                )}
                                <KErrorMessage name="file1" />
                              </div>
                            </div>
                          </div>

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
                                backgroundColor: "#2765B3",
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
      </div>
    </React.Fragment>
  );
};

export default AddEditUser;
