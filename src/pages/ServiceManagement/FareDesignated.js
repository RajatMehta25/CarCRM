import React, { useState, useRef, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import { Paper } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";
import KErrorMessage from "./KErrorMessage";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import axios from "../../axios";
import { toast } from "react-toastify";
import { get } from "lodash";
import WallpaperIcon from "@material-ui/icons/Wallpaper";
import { handleImageUpload } from "../../services/upload-files-service";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import { handleValidateManageDesignatedFare } from "../../utils/validators";

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

const FareDesignated = (props) => {
  const classes = useStyles();
  const {
    location: { state },
    history,
  } = props;

  const validationSchema = yup.object({
    baseRate: yup.number().min(1, "Min value is 1").required(" Required!"),

    distanceRate: yup.number().min(1, "Min value is 1").required("Required!"),
    adminCommission: yup.number().min(1, "Min value is 1").required("Required!"),
    cancellationFee: yup.number().min(1, "Min value is 1").required("Required!"),
    timeRate: yup.number().min(1, "Min value is 1").required("Required!"),
    adminCancellationFee: yup.number().min(1, "Min value is 1").max(100, "Max value is 100").required("Required!"),
    driverCancellationFee: yup.number().min(1, "Min value is 1").max(100, "Max value is 100").required("Required!"),
  });

  const EditFareDesignated = async (values) => {
    try {
      console.log(values);

      const { data } = await axios.put(`/private/designatedDriverFare/${state._id}`, {
        baseRate: values.baseRate || state.baseRate,
        distanceRate: values.distanceRate || state.distanceRate,
        adminCommission: values.adminCommission || state.adminCommission,
        cancellationFee: values.cancellationFee || state.cancellationFee,
        timeRate: values.timeRate || state.timeRate,
        // maxRadius: values.maxRadius || state.maxRadius,
        adminCancellationFee: values.adminCancellationFee || state.adminCancellationFee,
        driverCancellationFee: values.driverCancellationFee || state.driverCancellationFee,
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

  const addNewFareDesignated = async (values) => {
    try {
      console.log(values);

      const { data } = await axios.post(`/private/designatedDriverFare`, {
        baseRate: values.baseRate,
        distanceRate: values.distanceRate,
        adminCommission: values.adminCommission,
        cancellationFee: values.cancellationFee,
        timeRate: values.timeRate,
        // maxRadius: values.maxRadius || state.maxRadius,
        adminCancellationFee: values.adminCancellationFee,
        driverCancellationFee: values.driverCancellationFee,
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
                  {/* <div className={classNames(classes.addNewCategoryHeading)}>
                    {" "}
                    <h3 className={classNames(classes.MarginControl)} style={{ marginBottom: "-0.5rem", marginLeft: "-135px" }}>
                     
                      MANAGE FARE
                    </h3>
                  </div> */}
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
                      validationSchema={validationSchema}
                      initialValues={{
                        baseRate: get(state, "baseRate", ""),
                        timeRate: get(state, "timeRate", ""),
                        distanceRate: get(state, "distanceRate", ""),
                        adminCommission: get(state, "adminCommission", ""),
                        cancellationFee: get(state, "cancellationFee", ""),
                        adminCancellationFee: get(state, "adminCancellationFee", ""),
                        driverCancellationFee: get(state, "driverCancellationFee", ""),
                      }}
                      onSubmit={(values) => {
                        console.log(values);
                        if (state && state !== "") {
                          EditFareDesignated(values);
                        } else {
                          addNewFareDesignated(values);
                          console.log("gadbad");
                        }
                      }}
                    >
                      {({ values, setFieldValue }) => (
                        <Form>
                          <div className="container">
                            <div className="row my-3" style={{ fontSize: "22px", fontWeight: "bold" }}>
                              Manage Trip Fare
                            </div>
                            <div className="row my-2">
                              <div className="col-6 d-flex flex-column ">
                                <label>Base Rate (in pounds):</label>
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
                                  name="baseRate"
                                  type="text"
                                />
                                <KErrorMessage name="baseRate" />
                              </div>
                              <div className="col-6 d-flex flex-column">
                                <label>Time Rate (per min):</label>
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
                                  name="timeRate"
                                  type="text"
                                />
                                <KErrorMessage name="timeRate" />
                              </div>
                            </div>
                            <div className="row my-2">
                              <div className="col-6 d-flex flex-column">
                                <label>Distance Rate (per mile):</label>
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
                                <label>Admin Commission (in %):</label>
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
                            <div className="row my-3" style={{ fontSize: "22px", fontWeight: "bold" }}>
                              Cancellation Charges
                            </div>
                            <div className="row my-2">
                              <div className="col-6 d-flex flex-column">
                                <label>Cancellation Fee:</label>
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
                              <div className="col-6 d-flex flex-column">
                                <label>Admin Cancellation Fee (in %)</label>
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
                              <div className="col-6 d-flex flex-column">
                                <label>Driver Cancellation Fee (in %)</label>
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
                            </div>
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
      </div>
    </React.Fragment>
  );
};

export default FareDesignated;
