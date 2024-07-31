import React, { useState, useEffect } from "react";
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
import { add, get } from "lodash";

import "./AddEditSubscription.css";

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

const AddEditSubscription = (props) => {
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
      if (ele.innerText === "Manage Subscription") {
        return ele;
      }
    });
    newres[0].classList.add("activate");
    console.log(newres);
    console.log(result);
  };
  console.log(state);

  //Validation Schema

  const validationSchema = yup.object({
    name: yup.string().required("Name of Plan is Required!"),
    //  desc: yup
    //  .string()
    //  .min(5, "too small!")
    //  .max(500, "Too Long String!")
    //  .required("Required!"),
    TypeofPlan: yup.string().required("Type is Required!"),
    PriceofPlan: yup
      .string()
      .required("Price of Plan is Required!")
      .matches(/^[0-9]+$/, "Numeric values Only!"),
  });

  // ADDING NEW Subscription

  const addNewSubscription = async (values) => {
    try {
      console.log(values);

      const { data } = await axios.post("/admin/create_subscription_plan", {
        userType: state.userType._id,
        planType: values.TypeofPlan,
        planName: values.name,
        planPrice: values.PriceofPlan,
      });
      props.history.push({
        pathname: "/adminPanel/Subscription_Management",
        state: state.userType._id,
      });
      toast.success(data.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      console.log(data);
      console.log(values);
      console.log(state.userType._id);
    } catch (error) {
      toast.error(error.response.data.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      console.log(error);
    }
  };

  // Edit Subscription . update api

  const EditSubscription = async (values) => {
    try {
      console.log(values);

      const { data } = await axios.post("/admin/update_subscription_plan", {
        is_blocked: state.is_blocked,
        planId: state._id,
        userType: state.userType._id,
        planType: values.TypeofPlan,
        planName: values.name,
        planPrice: values.PriceofPlan,
      });
      props.history.push({
        pathname: "/Subscription_Management",
        state: state.userType._id,
      });
      toast.success(data.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      console.log(data);
    } catch (error) {
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
                      variant="outlined"
                      aria-label="add"
                      className={classes.iconMargin}
                      onClick={() => {
                        if (window.confirm("Are you sure , you want to leave this page?")) {
                          props.history.push({
                            pathname: "/adminPanel/Subscription_Management",
                            state: state.userType._id,
                          });
                        }
                      }}
                    >
                      <ArrowBackIcon />
                    </Button>
                  </div>
                  <div className={classNames(classes.addNewCategoryHeading)}>
                    {" "}
                    <h3 className={classes.MarginControl} style={{ marginBottom: "-0.5rem", marginLeft: "-135px" }}>
                      {console.log(state)}
                      {state?.Operation ? `ADD NEW PLAN` : `EDIT PLAN`}
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
                        // TypeofUser: get(state.userType, "title", ""),
                        name: get(state, "planName", ""),
                        PriceofPlan: get(state, "planPrice", ""),
                        TypeofPlan: get(state, "planType", ""),

                        // name:   get(state, "name", ""),
                        // desc: get(state, "desc", ""),
                      }}
                      onSubmit={(values) => {
                        console.log(values);
                        if (state?.Operation) {
                          addNewSubscription(values);
                          //   EditCategory(values)
                        } else {
                          EditSubscription(values);
                          //   addNewCategory(values)
                        }
                      }}
                    >
                      {({ values }) => (
                        <Form>
                          <div className="customContainer1">
                            <label className="labelAddSubscription" style={{ fontSize: "20px" }}>
                              Type of User:
                            </label>
                            <Field className="fieldAddSubscription disabledColor" name="TypeofUser" type="text" disabled />
                            {/* <Field  className="fieldAddSubscription" name="fieldType" as="select">
                <option value="">Select</option>
              <option value="Individual User">Individual User</option>
              <option value="Agent Representative">Agent Representative</option>
              <option value="Management Company Representative">Management Company Representative</option>
              <option value="Lawyer">Lawyer</option>
              <option value="Production">Production</option>
              <option value="Subscriber Staff Member">Subscriber Staff Member</option>
            </Field>  */}
                            {/* <KErrorMessage name="fieldType" /> */}
                            <label className="labelAddSubscription" style={{ fontSize: "20px" }}>
                              Name of Plan:
                            </label>
                            <Field className="fieldAddSubscription" name="name" type="text" />
                            <KErrorMessage name="name" />

                            <label className="labelAddSubscription" style={{ fontSize: "20px" }}>
                              Type of Plan:
                            </label>
                            <Field className="fieldAddSubscription" name="TypeofPlan" as="select">
                              <option value="">Select</option>
                              <option value="MONTHLY">MONTHLY</option>
                              <option value="HALF YEARLY">HALF YEARLY</option>
                              <option value="YEARLY">YEARLY</option>
                            </Field>
                            <KErrorMessage name="TypeofPlan" />
                            {/* <label className="" style={{fontSize:"20px"}}>Start Duration:</label>
            <Field className="" name="" type="date"  />
            {/* <KErrorMessage name="desc" /> */}

                            {/* <label className="" style={{fontSize:"20px"}}>End Duration:</label>
            <Field className="" name="" type="date"  />  */}
                            {/* <KErrorMessage name="desc" /> */}

                            <label className="labelAddSubscription" style={{ fontSize: "20px" }}>
                              Price of Plan:
                            </label>
                            <Field className="fieldAddSubscription" name="PriceofPlan" type="text" />
                            <KErrorMessage name="PriceofPlan" />
                            {/* <KErrorMessage name="name" /> */}
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
                                backgroundColor: "#0e3f37",
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

export default AddEditSubscription;
