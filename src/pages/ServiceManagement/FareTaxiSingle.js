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
import { Input, Modal } from "../../components/index";
import { handleValidateManageFare } from "../../utils/validators";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
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

const FareTaxiSingle = (props) => {
  const classes = useStyles();

  //  data from previous page

  const {
    location: { state },
  } = props;
  console.log(state);
  //Validation Schema
  const fileRef = useRef(null);
  const [profileImagepath, setProfileImagepath] = useState("");

  const validationSchema = yup.object({
    baseRate: yup.number().typeError("Only Number Accepted").required("Base Rate is required"),
    distanceRate: yup.number().typeError("Only Number Accepted").required("Distance Rate is required"),
    // timeRate: yup.number().required("Time Rate is required"),
    adminCommission: yup
      .number()
      .typeError("Only Number Accepted")
      .min(0, "Min value 0.")
      .max(99, "Max value 99.")
      .required("Admin Commission is required"),
    cancellationFee: yup.number().typeError("Only Number Accepted").required("Cancellation Fee is required"),
    timeRate: yup.number().typeError("Only Number Accepted").required("Time Rate is required"),
    adminCancellationFee: yup
      .number()
      .typeError("Only Number Accepted")
      .min(0, "Min value 0.")
      // .max(100 - yup.ref("driverCancellationFee"), "Max value Admin.")
      .required("Admin Cancellation Fee is required")
      .test(
        "max",
        `Value must be less than ${100} Fee`,
        (value, context) => value < 100 - context.parent.driverCancellationFee
      ),
    // driverCancellationFee: yup
    //   .number()
    //   .typeError("Only Number Accepted")
    //   .min(0, "Min value 0.")
    //   // .max(100 - yup.ref("adminCancellationFee"), "Max value 99.")
    //   .required("Driver Cancellation Fee is required")
    //   .test(
    //     "max",
    //     "Value must be less than 100-Admin Cancellation Fee",
    //     (value, context) => value < 100 - context.parent.adminCancellationFee
    //   ),
    // name: yup
    //   .string()
    //   .matches(/^[a-zA-Z ]+$/, "Name is invalid")
    //   .required("Name is Required!"),
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

  const addNewTaxiSingle = async (values) => {
    try {
      console.log(values);

      const { data } = await axios.post("/vehicleCategory", {
        title: values.name,
        icon: values.file1,
      });
      props.history.push({
        pathname: "/adminPanel/TaxiSingleManagement",
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

  const EditFareTaxiSingle = async (values) => {
    try {
      console.log(values);

      const { data } = await axios.put(`/private/vehicleCategory/fare/${state._id}`, {
        baseRate: values.baseRate || state.baseRate,
        distanceRate: values.distanceRate || state.distanceRate,
        adminCommission: values.adminCommission || state.adminCommission,
        cancellationFee: values.cancellationFee || state.cancellationFee,
        timeRate: values.timeRate || state.timeRate,
        adminCancellationFee: values.adminCancellationFee || state.adminCancellationFee,
        // driverCancellationFee: values.driverCancellationFee || state.driverCancellationFee,
        // "ajk",
        // values.timeRate || state.timeRate,
        // is_active: state.is_active,
      });
      props.history.push({
        pathname: "/adminPanel/TaxiSingleManagement",
      });
      toast.success(data.messages, {
        position: toast.POSITION.TOP_RIGHT,
      });
      console.log(data);
    } catch (error) {
      const errors = error.response.data.errors;
      console.log(errors);
      var err = {};
      errors.map((e) => {
        err[e.param] = e.msg;
      });
      //  toast.success(errors.messages, {
      //    position: toast.POSITION.TOP_RIGHT,
      //  });
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
                            pathname: "/adminPanel/TaxiSingleManagement",
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
                    {/* <h3 className={classNames(classes.MarginControl)} style={{ marginBottom: "-0.5rem", marginLeft: "-135px" }}>
                      {console.log(state)}
                      {!state ? `MANAGE FARE` : `MANAGE FARE`}
                    </h3> */}
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
                  <div style={{ margin: "2rem 0 2rem 0" }}>
                    <Formik
                      // validationSchema={validationSchema}
                      initialValues={{
                        baseRate: get(state, "baseRate", ""),
                        timeRate: get(state, "timeRate", ""),
                        distanceRate: get(state, "distanceRate", ""),
                        adminCommission: get(state, "adminCommission", ""),
                        cancellationFee: get(state, "cancellationFee", ""),
                        adminCancellationFee: get(state, "adminCancellationFee", ""),
                        // driverCancellationFee: get(state, "driverCancellationFee", ""),
                        // desc: get(state, "desc", ""),
                      }}
                      validate={(values) => handleValidateManageFare(values)}
                      onSubmit={(values) => {
                        console.log(values);
                        if (state && state !== "") {
                          EditFareTaxiSingle(values);
                        } else {
                          //   addNewTaxiSingle(values);
                          console.log("gadbad");
                        }
                      }}
                    >
                      {(formikBag) => (
                        <Form>
                          <div className="container">
                            <div className="row my-3 justify-content-center" style={{ fontSize: "22px", fontWeight: "bold" }}>
                              <div className="col-6 d-flex flex-column "> Manage Trip Fare</div>
                              <div className="col-6 d-flex flex-column "></div>
                            </div>
                            <div className="row">
                              <div className="col-md-6">
                                <span
                                  style={{
                                    fontSize: "16px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  Base Rate(in pounds):
                                </span>
                                <Field name="baseRate">
                                  {({ field }) => (
                                    <Input
                                      {...field}
                                      type="text"
                                      onChange={(e) => {
                                        formikBag.setFieldValue("baseRate", e.target.value);
                                      }}
                                      error={
                                        formikBag.touched.baseRate && formikBag.errors.baseRate
                                          ? formikBag.errors.baseRate
                                          : null
                                      }
                                      className="form-control"
                                      placeholder={"Enter Base Rate"}
                                    />
                                  )}
                                </Field>
                              </div>
                              <div className="col-md-6">
                                <span
                                  style={{
                                    fontSize: "16px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  Time Rate(per min):
                                </span>
                                <Field name="card_name">
                                  {({ field }) => (
                                    <Input
                                      {...field}
                                      type="text"
                                      onChange={(e) => {
                                        formikBag.setFieldValue("timeRate", e.target.value);
                                      }}
                                      error={
                                        formikBag.touched.timeRate && formikBag.errors.timeRate
                                          ? formikBag.errors.timeRate
                                          : null
                                      }
                                      className="form-control"
                                      placeholder={"Enter Time Rate"}
                                    />
                                  )}
                                </Field>
                              </div>
                            </div>

                            <div className="row my-2 justify-content-center">
                              <div className="col-6 d-flex flex-column">
                                <span
                                  style={{
                                    fontSize: "16px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  Distance Rate(per mile):
                                </span>
                                <Field
                                  style={{
                                    borderRadius: "5px",
                                    border: "1px solid #ccc",
                                    padding: "0.5rem",
                                    width: "100%",
                                    fontSize: "1.2rem",
                                    fontWeight: "500",
                                    color: "rgba(0, 0, 0, 0.87)",
                                    backgroundColor: "white",
                                    outline: "none",
                                    boxSizing: "border-box",
                                    marginBottom: "1rem",
                                  }}
                                  className=""
                                  name="distanceRate"
                                  type="text"
                                />
                                <KErrorMessage name="distanceRate" />
                              </div>
                              <div className="col-6 d-flex flex-column">
                                <span
                                  style={{
                                    fontSize: "16px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  Admin Commission(in %):
                                </span>
                                <Field
                                  style={{
                                    borderRadius: "5px",
                                    border: "1px solid #ccc",
                                    padding: "0.5rem",
                                    width: "100%",
                                    fontSize: "1.2rem",
                                    fontWeight: "500",
                                    color: "rgba(0, 0, 0, 0.87)",
                                    backgroundColor: "white",
                                    outline: "none",
                                    boxSizing: "border-box",
                                    marginBottom: "1rem",
                                  }}
                                  className=""
                                  name="adminCommission"
                                  type="text"
                                />
                                <KErrorMessage name="adminCommission" />
                              </div>
                            </div>
                            <div className="row my-3 justify-content-center" style={{ fontSize: "22px", fontWeight: "bold" }}>
                              <div className="col-6 d-flex flex-column "> Cancellation Charges</div>
                              <div className="col-6 d-flex flex-column "></div>
                            </div>
                            <div className="row my-2 justify-content-center">
                              <div className="col-6 d-flex flex-column">
                                <span
                                  style={{
                                    fontSize: "16px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  Cancellation Fee:
                                </span>
                                <Field
                                  style={{
                                    borderRadius: "5px",
                                    border: "1px solid #ccc",
                                    padding: "0.5rem",
                                    width: "100%",
                                    fontSize: "1.2rem",
                                    fontWeight: "500",
                                    color: "rgba(0, 0, 0, 0.87)",
                                    backgroundColor: "white",
                                    outline: "none",
                                    boxSizing: "border-box",
                                    marginBottom: "1rem",
                                  }}
                                  className=""
                                  name="cancellationFee"
                                  type="text"
                                />
                                <KErrorMessage name="cancellationFee" />
                              </div>
                              <div className="col-6">
                                <span
                                  style={{
                                    fontSize: "16px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  Admin Cancellation Fee(in %):
                                </span>
                                <Field
                                  style={{
                                    borderRadius: "5px",
                                    border: "1px solid #ccc",
                                    padding: "0.5rem",
                                    width: "100%",
                                    fontSize: "1.2rem",
                                    fontWeight: "500",
                                    color: "rgba(0, 0, 0, 0.87)",
                                    backgroundColor: "white",
                                    outline: "none",
                                    boxSizing: "border-box",
                                    marginBottom: "1rem",
                                  }}
                                  className=""
                                  name="adminCancellationFee"
                                  type="text"
                                />
                                <KErrorMessage name="adminCancellationFee" />
                              </div>
                            </div>

                            {/* <div className="row my-2 justify-content-center">
                              <div className="col-6 d-flex flex-column">
                                <span
                                  style={{
                                    fontSize: "16px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  Driver Cancellation Fee(in %):
                                </span>
                                <Field
                                  style={{
                                    borderRadius: "5px",
                                    border: "1px solid #ccc",
                                    padding: "0.5rem",
                                    width: "100%",
                                    fontSize: "1.2rem",
                                    fontWeight: "500",
                                    color: "rgba(0, 0, 0, 0.87)",
                                    backgroundColor: "white",
                                    outline: "none",
                                    boxSizing: "border-box",
                                    marginBottom: "1rem",
                                  }}
                                  className=""
                                  name="driverCancellationFee"
                                  type="text"
                                />
                                <KErrorMessage name="driverCancellationFee" />
                              </div>
                              <div className="col-6"></div>
                            </div> */}
                          </div>
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
                                backgroundColor: "#006FFF",
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

export default FareTaxiSingle;
