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
import WallpaperIcon from "@material-ui/icons/Wallpaper";
import { handleImageUpload } from "../../services/upload-files-service";
import { useUploadImage } from "../../services/Imagecustomhook";
import Axios from "axios";
import Spinner from "./Spinner";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import Swal from "sweetalert2";
import { ImageUploadUrl } from "../../statics/constants";
// import "./AddEditAzan.css";

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
    backgroundColor: "#0e3f37 !important",
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

const AddPetCategory = (props) => {
  const classes = useStyles();
  const { isSuccess, uploadForm, progress } = useUploadImage(`${ImageUploadUrl}/fileUpload`);
  //  data from previous page

  const {
    location: { state },
  } = props;
  console.log(state);
  const [spinnerDisplay, setSpinnerDisplay] = useState(false);
  //Validation Schema
  const fileRef = useRef(null);
  const [profileImagepath, setProfileImagepath] = useState("");
  const [imageDelete, setImageDelete] = useState(false);
  const validationSchema = yup.object({
    name: yup
      .string()
      .matches(/^[a-zA-Z ]+$/, "Name is invalid")
      .min(1, "Minimum 1 character")
      .max(12, "Maximum 12 characters")
      .required("Name is Required!"),
    // desc: yup
    //   .string()
    //   .min(5, "too small!")
    //   .max(500, "Too Long String!")
    //   .required("Required!"),
    // file1: yup.string().required("Image is Required!"),
    // desc: yup
    //   .string()
    //   .min(5, "too small!")
    //   .max(500, "Too Long String!")
    //   .required("Required!"),
  });

  // ADDING NEW CATEGORY

  const addNewPetCategory = async (values) => {
    try {
      console.log(values);

      const { data } = await axios.post("/private/petCategory", {
        title: values.name,
        icon: values.file1,
        // description: values.description,
      });
      props.history.push({
        pathname: "/adminPanel/PetCategoryManagement",
      });
      toast.success(data.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  // Edit Category . update api

  const EditPetCategory = async (values) => {
    try {
      console.log(values);

      const { data } = await axios.put(`/private/petCategory/${state._id}`, {
        icon: values.file1 || state.icon,
        title: values.name || state.title,
        // description: values.description || state.description,
        // is_active: state.is_active,
      });
      props.history.push({
        pathname: "/adminPanel/PetCategoryManagement",
      });
      toast.success(data.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  const DeleteImage = async () => {
    let imageID = !state ? "" : state.image.split("/")[3];
    console.log(imageID);
    try {
      const { data } = await Axios.get(`http://18.221.140.83:3000/fileDelete/${imageID}`);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    imageDelete && DeleteImage();
  }, [imageDelete]);

  const handleBackButton = () => {
    Swal.fire({
      showClass: {
        popup: "animate__animated animate__fadeInDown",
      },
      hideClass: {
        popup: "animate__animated animate__fadeOutUp",
      },
      title: "Do you want to save the changes?",
      showConfirmButton: false,
      showDenyButton: true,
      showCloseButton: true,
      showCancelButton: false,
      // confirmButtonText: "Save",
      denyButtonText: `Don't save`,
    }).then((result) => {
      console.log(result);
      /* Read more about isConfirmed, isDenied below */
      if (result.isDenied) {
        props.history.push({
          pathname: "/adminPanel/PetCategoryManagement",
        });
      } else if (result.isCancelled) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
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
                      // variant="outlined"
                      // aria-label="add"
                      // className={classes.iconMargin}
                      onClick={() => {
                        handleBackButton();
                        //   if (window.confirm("Leave without saving changes?")) {
                        //     props.history.push({
                        //       pathname: "/adminPanel/PetCategoryManagement",
                        //     });
                        //   }
                      }}
                    >
                      <ArrowBackIosIcon />
                      BACK
                    </Button>
                  </div>
                  <div className={classNames(classes.addNewCategoryHeading)}>
                    {" "}
                    <h3 className={classNames(classes.MarginControl)} style={{ marginBottom: "-0.5rem", marginLeft: "-135px" }}>
                      {console.log(state)}
                      {!state ? `Add Pet Category` : `Edit Pet Category`}
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
                    // justifyContent: "space-between",
                  }}
                >
                  <div style={{ margin: "2rem 0 2rem 0" }}>
                    <Formik
                      validationSchema={validationSchema}
                      initialValues={{
                        name: get(state, "title", ""),
                        file1: get(state, "icon", ""),
                        // description: get(state, "description", ""),
                      }}
                      onSubmit={(values) => {
                        console.log(values);
                        if (state && state !== "") {
                          EditPetCategory(values);
                        } else {
                          addNewPetCategory(values);
                        }
                      }}
                    >
                      {({ values, setFieldValue }) => (
                        <Form>
                          <div className="row my-5 align-items-center">
                            <div
                              className="col-4"
                              // style={{ marginRight: "-50px" }}
                            >
                              <label className="" style={{ fontSize: "18px" }}>
                                Pet Image :
                              </label>
                            </div>
                            <div className="col-4">
                              <input
                                ref={fileRef}
                                name="file1"
                                hidden
                                type="file"
                                accept="image/png, image/jpeg , image/jpg"
                                onChange={async (e) => {
                                  // let data = await handleImageUpload(
                                  //   e.target.files[0]
                                  let data = await uploadForm(e.target.files[0]);
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
                                  setImageDelete(true);
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
                            </div>

                            <div className="col-4">
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
                              {}
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
                          <div className="row my-5 align-items-center">
                            <div className="col-4">
                              <label className="labelAddCategory" style={{ fontSize: "18px", padding: "5px" }}>
                                {!state ? `Pet Name` : `Pet Name`} :
                              </label>
                            </div>
                            <div className="col-8 d-flex flex-column">
                              <Field
                                className=""
                                name="name"
                                type="text"
                                style={{
                                  width: "85%",
                                  height: "40px",
                                  borderRadius: "5px",
                                  border: "1px solid #c4c4c4",
                                  padding: "5px",
                                }}
                              />
                              <KErrorMessage name="name" />
                            </div>
                          </div>
                          <br /> <br />
                          {/* <label
                            className="labelAddCategory"
                            style={{ fontSize: "20px" }}
                          >
                            Description of Category:
                          </label>
                          <Field
                            className="fieldAddCategory custom_height"
                            name="desc"
                            as="textarea"
                          />
                          <KErrorMessage name="desc" />
                          <br /> <br /> */}
                          {/* <label
                            className="labelAddCategory"
                            style={{ fontSize: "20px" }}
                          >
                            {!state ? `Add Description` : `Edit Description`} :
                          </label>
                          <Field
                            className="fieldAddCategory"
                            name="description"
                            type="text"
                          />
                          <KErrorMessage name="description" />
                          <br /> <br /> */}
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

export default AddPetCategory;
