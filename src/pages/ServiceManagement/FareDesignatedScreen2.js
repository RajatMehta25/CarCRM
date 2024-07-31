import React, { useState, useRef } from "react";
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
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import Spinner from "./Spinner";
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

const AddEditPackage = (props) => {
  const classes = useStyles();

  //  data from previous page

  const {
    location: { state },
  } = props;
  console.log(state);
  const { isSuccess, uploadForm, progress } = useUploadImage(`${ImageUploadUrl}/fileUpload`);
  const [spinnerDisplay, setSpinnerDisplay] = useState(false);
  //Validation Schema
  const fileRef = useRef(null);
  const [profileImagepath, setProfileImagepath] = useState("");

  const validationSchema = yup.object({
    driver_1_Fare: yup.number().min(1, "Min value is 1").required("Fare is Required!"),
    driver_2_Fare: yup.number().min(1, "Min value is 1").required("Fare is Required!"),
    driverRadiusSearching: yup.number().min(1, "Min value is 1").required("Radius is Required!"),
  });

  // ADDING NEW CATEGORY

  // Edit Category . update api

  const EditDesignatedDriver = async (values) => {
    try {
      console.log(values);

      const { data } = await axios.put(`/private/designatedDriverFare/${state._id}`, {
        driver_1_Fare: values.driver_1_Fare || state.driver_1_Fare,
        driver_2_Fare: values.driver_2_Fare || state.driver_2_Fare,
        driverRadiusSearching: values.driverRadiusSearching || state.driverRadiusSearching,
      });

      toast.success(data.message, {
        position: toast.POSITION.TOP_RIGHT,
      });

      props.history.push({
        pathname: "/adminPanel/ManageDesignatedDriver",
      });
      console.log(data);
    } catch (error) {
      // const errors = error.response.data.errors;
      console.log(error);
    }
  };
  const addNewDesignatedDriver = async (values) => {
    try {
      console.log(values);

      const { data } = await axios.post(`/private/designatedDriverFare`, {
        driver_1_Fare: values.driver_1_Fare,
        driver_2_Fare: values.driver_2_Fare,
        driverRadiusSearching: values.driverRadiusSearching,
      });

      toast.success(data.message, {
        position: toast.POSITION.TOP_RIGHT,
      });

      props.history.push({
        pathname: "/adminPanel/ManageDesignatedDriver",
      });
      console.log(data);
    } catch (error) {
      // const errors = error.response.data.errors;
      console.log(error);
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
                      // variant="outlined"
                      // aria-label="add"
                      // className={classes.iconMargin}
                      onClick={() => {
                        if (window.confirm("Leave without saving changes?")) {
                          props.history.push({
                            pathname: "/adminPanel/ManageDesignatedDriver",
                          });
                        }
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
                      {!state ? `Manage Designated Driver Fare` : `Manage Designated Driver Fare`}
                    </h3>
                  </div>
                </Paper>

                {/* //new design */}

                {/* status end */}

                <Paper
                  elevation={0}
                  style={{
                    display: "flex",
                    // alignItems: "center",
                    flexDirection: "column",
                  }}
                >
                  <div style={{ margin: "3rem 0 3rem 0" }}>
                    <Formik
                      validationSchema={validationSchema}
                      initialValues={{
                        driver_1_Fare: get(state, "driver_1_Fare", ""),
                        driver_2_Fare: get(state, "driver_2_Fare", ""),
                        driverRadiusSearching: get(state, "driverRadiusSearching", ""),
                        // description: get(state, "description", ""),
                      }}
                      onSubmit={(values) => {
                        console.log(values);
                        if (state && state !== "") {
                          EditDesignatedDriver(values);
                        } else {
                          addNewDesignatedDriver(values);
                        }
                      }}
                    >
                      {({ values, setFieldValue }) => (
                        <Form>
                          <div className="row my-3">
                            <div className="col-6 d-flex flex-column ">
                              <label className="" style={{ fontSize: "20px" }}>
                                Driver 1 Fare :
                              </label>
                              <Field
                                className=""
                                name="driver_1_Fare"
                                style={{
                                  width: "",
                                  height: "40px",
                                  borderRadius: "5px",
                                  border: "1px solid #c4c4c4",
                                  padding: "5px",
                                }}
                              />
                              <KErrorMessage name="driver_1_Fare" />
                            </div>
                            <div className="col-6 d-flex flex-column">
                              <label className="" style={{ fontSize: "20px" }}>
                                Driver 2 Fare :
                              </label>
                              <Field
                                className=""
                                name="driver_2_Fare"
                                style={{
                                  width: "",
                                  height: "40px",
                                  borderRadius: "5px",
                                  border: "1px solid #c4c4c4",
                                  padding: "5px",
                                }}
                              />
                              <KErrorMessage name="driver_2_Fare" />
                            </div>
                          </div>
                          <div className="row my-3">
                            <div className="col-6 d-flex flex-column">
                              {/* <div className="d-flex flex-row"> */}
                              <label className="" style={{ fontSize: "20px" }}>
                                Set Driver Radius for Searching :
                              </label>
                              <Field
                                className=""
                                name="driverRadiusSearching"
                                style={{
                                  width: "",
                                  height: "40px",
                                  borderRadius: "5px",
                                  border: "1px solid #c4c4c4",
                                  padding: "5px",
                                }}
                              />
                              {/* </div> */}
                              <KErrorMessage name="driverRadiusSearching" />
                            </div>
                            <div className="col-6 d-flex flex-column"></div>
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

export default AddEditPackage;
