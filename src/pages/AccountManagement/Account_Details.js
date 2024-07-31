import React, { useState } from "react";
import { Row, Col } from "reactstrap";
import classNames from "classnames";
import axios from "../../axios";
import { toast } from "react-toastify";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { get, isEmpty } from "lodash";

import { Formik, Field, Form } from "formik";
import Input from "../../components/Input";
import TextArea from "../../components/TextArea";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const useStyles = makeStyles((theme) => ({
  root: {
    flexWrap: "wrap",
    marginTop: "3rem",
  },
  margin: {
    margin: theme.spacing(1),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
  paperHeading: {
    padding: "1rem 0.5rem",
  },
  textMiddle: {
    verticalAlign: "middle !important",
  },
  iconMargin: {
    marginRight: "0.5rem",
  },
  headingButton: {
    display: "flex",
    flexDirection: "row",
  },
  container: {
    maxHeight: "62vh",
  },
  rowPadding: {
    padding: "2rem 2rem",
  },
  headingCenter: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisplay: {
    display: "flex",
  },
  anchorColor: {
    color: "#ffffff",
  },
  headingSeller: {
    backgroundColor: "#0294B3",
    color: "#ffffff",
    padding: "0.4rem",
    borderRadius: "0.2rem",
    width: "100%",
  },
  paperMargin: {
    marginBottom: "2rem",
  },
  buttonColorApprove: {
    backgroundColor: "#0288d1",
  },
  paperWidth: {
    width: "100%",
  },
  accordianMargin: {
    marginBottom: "1rem",
  },
  paddingStoreImage: {
    paddingTop: "1rem",
    paddingBottom: "2rem",
  },
  resistrationDisplay: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
  },
  searchPending: {
    display: "flex",
    justifyContent: "flex-end",
  },
  searchHeight: {
    height: "2.3rem",
    marginRight: "0.7rem",
    width: "39%",
  },
  searchHeightPending: {
    height: "2.3rem",
    marginRight: "0.7rem",
    // width: "39%"
  },
  headingSellerDetails: {
    display: "flex",
  },
  headingAlign: {
    display: "flex",
    alignItems: "center",
    marginBottom: "0rem",
  },
  marginZero: {
    margin: "0",
  },
  paddingButton: {
    marginRight: "0.5rem",
  },
  accordianHeading: {
    display: "flex",
    justifyContent: "center",
  },
  imageUpperMargin: {
    marginTop: "1.5rem",
  },
  marginHeading: {
    marginBottom: "1.5rem",
  },
  checkedCenter : {
    textAlign : "center",
  }
}));

const AddCategory = (props) => {
  const classes = useStyles();

  const {
    location: { state },
  } = props;


  const saveCategory = async (e) => {
    let approveStatus = e;
    let requestData = {
      _id: props.location.state._id,
      isapproved: approveStatus,
    };
    let url = "/admin/approve_dissapprove_user";

    try {
      const { data } = await axios.post(url, requestData);
        props.history.push({
          pathname: "/account-managment",
        });
      toast.success(data.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      console.log(error);
    }
  };



  return (
    <React.Fragment>
      <div className={classes.root}>
        <Paper>
          <div className="container">
            <div className={classNames("py-4", classes.paperHeight)}>
              <Paper
                elevation={0}
                className={classNames(
                  classes.paperHeading,
                  classes.headingButton
                )}
              >
                <div className={classes.resistrationDisplay}>
                  <div className={classes.headingSellerDetails}>
                    <Button
                      variant="outlined"
                      aria-label="add"
                      className={classes.iconMargin}
                      onClick={() => {
                        props.history.push({
                          pathname: "/account-managment",
                        });
                      }}
                    >
                      <ArrowBackIcon />
                    </Button>
                  </div>
                  <h2 className={classes.headingCenter}>User Details</h2>

                  {state.userType.type === "NEEDAPPROVEL" && (
                    <>
                      <div className={classes.searchPending}>
                        <div
                          className={classNames(
                            "form-group",
                            classes.headingCenter,
                            classes.marginZero
                          )}
                        >
                          <div className={classes.paddingButton}>
                            {state.isapproved === false ? (
                              <>
                                <button
                                  className={classNames(
                                    "btn btn-success",
                                    classes.buttonColorApprove
                                  )}
                                  onClick={() => {
                                    saveCategory(true);
                                  }}
                                  style={{
                                    backgroundColor: "green",
                                    border: "none",
                                  }}
                                >
                                  Approve
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  className={classNames(
                                    "btn btn-success",
                                    classes.buttonColorApprove
                                  )}
                                  style={{
                                    backgroundColor: "green",
                                    border: "none",
                                    cursor: "not-allowed",
                                  }}
                                  disabled
                                >
                                  Approve
                                </button>
                              </>
                            )}
                          </div>
                          <div>
                                <button
                                  className={classNames(
                                    "btn btn-success",
                                    classes.buttonColorApprove
                                  )}
                                  onClick={() => {
                                    saveCategory(false);
                                  }}
                                  style={{
                                    backgroundColor: "#0288d1",
                                    border: "none",
                                  }}
                                >
                                  Disapprove
                                </button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </Paper>
              <Paper>
                <Row className={classes.rowPadding}>
                  <Col xs={12}>
                    <div className="submit-form">
                      <div>
                        <Formik
                          enableReinitialize
                          initialValues={{

                            // Restaurant Details
                            name:
                              get(state, "firstName", "") +
                                " " +
                                get(state, "lastName", "") ,
                            imdbLink: get(state, "imdbLink", ""),
                            userType: get(state, "userType.title", ""),
                            email: get(state, "email", ""),
                            countryCode: get(state, "countryCode", ""),
                            mobileNumber: get(state, "mobileNumber", ""),              
                            is_free_subscribed: get(state, "is_free_subscribed", ""),             
                            is_paid_subscribed: get(state, "is_paid_subscribed", ""),             

                          }}
                          validate={(values) => console.log(values)}
                          validateOnChange
                          // onSubmit={saveCategory}
                        >
                          {(formikBag) => {
                            return (
                              <Form>
                                <Accordion
                                  className={classes.accordianMargin}
                                  defaultExpanded
                                >
                                  <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                  >
                                    <h5 className={classes.headingSeller}>
                                      User Details
                                    </h5>
                                  </AccordionSummary>
                                  <AccordionDetails>
                                    <Paper
                                      elevation={0}
                                      className={classes.paperWidth}
                                    >
                                      <div className="row with_label">
                                        <div className="col-md-6">
                                          <Field name="listing_title">
                                            {({ field }) => (
                                              <div className="py-2">
                                                <label>Name</label>
                                                <Input
                                                  {...field}
                                                  type="text"
                                                  value={formikBag.values.name}
                                                  className="form-control"
                                                  disabled
                                                />
                                              </div>
                                            )}
                                          </Field>
                                        </div>
                                        <div className="col-md-6">
                                          <Field name="listing_title">
                                            {({ field }) => (
                                              <div className="py-2">
                                                <label>Email</label>
                                                <Input
                                                  {...field}
                                                  type="text"
                                                  value={formikBag.values.email}
                                                  className="form-control"
                                                  disabled
                                                />
                                              </div>
                                            )}
                                          </Field>
                                        </div>
                                      </div>
                                      <div className="row with_label">
                                        <div className="col-md-6">
                                          <Field name="listing_title">
                                            {({ field }) => (
                                              <div className="py-2">
                                                <label>User Type</label>
                                                <Input
                                                  {...field}
                                                  type="text"
                                                  value={formikBag.values.userType}
                                                  className="form-control"
                                                  disabled
                                                />
                                              </div>
                                            )}
                                          </Field>
                                        </div>
                                        <div className="col-md-6">
                                          <Field name="listing_title">
                                            {({ field }) => (
                                              <div className="py-2">
                                                <label>
                                                Imdb Link
                                                </label>
                                                <Input
                                                  {...field}
                                                  type="text"
                                                  value={
                                                    formikBag.values.imdbLink
                                                  }
                                                  className="form-control"
                                                  disabled
                                                />
                                              </div>
                                            )}
                                          </Field>
                                        </div>
                                        <div className="col-md-6">
                                          <Field name="listing_title">
                                            {({ field }) => (
                                              <div className="py-2">
                                                <label>
                                                Phone No:
                                                </label>
                                                <Input
                                                  {...field}
                                                  type="text"
                                                  value={ formikBag.values.countryCode + " " + formikBag.values.mobileNumber} 
                                                  className="form-control"
                                                  disabled
                                                />
                                              </div>
                                            )}
                                          </Field>
                                        </div>
                                        <div className="col-md-6">
                                          <Field name="listing_title">
                                            {({ field }) => (
                                              <div className="py-2">
                                                <label>
                                                Free Subscribed
                                                </label>
                                                <Input
                                                  {...field}
                                                  type="text"
                                                  value={ formikBag.values.is_free_subscribed ? "Yes":"No" }
                                                  className="form-control"
                                                  disabled
                                                />
                                              </div>
                                            )}
                                          </Field>
                                        </div>
                                        <div className="col-md-6">
                                          <Field name="listing_title">
                                            {({ field }) => (
                                              <div className="py-2">
                                                <label>
                                                Paid Subscribed
                                                </label>
                                                <Input
                                                  {...field}
                                                  type="text"
                                                  value={ formikBag.values.is_paid_subscribed ? "Yes":"No" }
                                                  className="form-control"
                                                  disabled
                                                />
                                              </div>
                                            )}
                                          </Field>
                                        </div>
                                      </div>
                                    </Paper>
                                  </AccordionDetails>
                                </Accordion>
                              </Form>
                            );
                          }}
                        </Formik>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Paper>
            </div>
          </div>
        </Paper>
      </div>
    </React.Fragment>
  );
};

export default AddCategory;
