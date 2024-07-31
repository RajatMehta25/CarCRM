import React, { useState } from "react";
import { Row, Col } from "reactstrap";
import classNames from "classnames";
// import { get } from "lodash";
// import { handleImageUpload } from "../../../services/upload-files.service";
import axios from "../../axios";
import { toast } from "react-toastify";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
// import { Multiselect } from "multiselect-react-dropdown";
import { get } from "lodash";
import { FeildManageValidatorPassword } from "../../utils/validators";

import { Formik, Field, Form } from "formik";
import Input from "../../components/Input";
// import Select from "../../components/Select";
import Cookies from "js-cookie";

const useStyles = makeStyles((theme) => ({
  root: {
    flexWrap: "wrap",
    marginTop: "5rem",
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
  textMiddle: {
    verticalAlign: "middle !important",
  },
  iconMargin: {
    marginRight: "0.5rem",
  },
  headingButton: {
    display: "flex",
    flexDirection: "row",
    // justifyContent: 'space-between',
  },
  container: {
    maxHeight: "58vh",
  },
  rowPadding: {
    padding: "2rem 0rem",
  },
  headingCenter: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paperPaddingRightLeft: {
    padding: "0rem 1rem",
  },
  paperHeight: {
    height: "90vh",
  },
  paperTableHeight: {
    height: "100%",
  },
}));

const AddCategory = (props) => {
  const classes = useStyles();

  const {
    location: { state },
  } = props;
  console.log(props);

  const [submitted, setSubmitted] = useState(false);

  const saveCategory = async (values) => {
    let requestData = {
      email: values.email,
      oldPassword: values.password,
      newPassword: values.newPassword,
    };
    console.log(requestData);
    let url = "/admin/changePassword";
    try {
      const { data } = await axios.post(url, requestData);
      Cookies.remove("admin_access_token");
      Cookies.remove("userType");
      Cookies.remove("username");
      Cookies.remove("profileImage");
      props.history.push({
        pathname: "/adminPanel/login",
      });
      toast.success(data.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      console.log(error);
    }
  };
  const newCategory = () => {
    setSubmitted(false);
  };

  const email = Cookies.get("email") ? JSON.parse(Cookies.get("email")) : [];
  console.log(email);

  return (
    <React.Fragment>
      <div className={classes.root}>
        <Paper>
          <div className={classes.paperPaddingRightLeft}>
            <div className={classNames("py-4", classes.paperHeight)}>
              <Paper elevation={0} className={classNames(classes.paperHeading, classes.headingButton)}>
                <div>
                  <Button
                    variant="outlined"
                    // color="primary"
                    aria-label="add"
                    className={classes.iconMargin}
                    onClick={() => {
                      props.history.push({
                        pathname: "/adminPanel/dashboard",
                      });
                    }}
                  >
                    <ArrowBackIcon />
                  </Button>
                </div>
                <h3 className={classes.headingCenter}>Change Password</h3>
              </Paper>
              <Paper className={classes.paperTableHeight}>
                <Row className={classes.rowPadding}>
                  <Col xs={3}></Col>
                  <Col xs={6}>
                    <div className="submit-form">
                      {submitted ? (
                        <div>
                          <h4>You submitted successfully!</h4>
                          <button className="btn btn-success" onClick={newCategory}>
                            Add
                          </button>
                        </div>
                      ) : (
                        <div>
                          <Formik
                            enableReinitialize
                            initialValues={{
                              email: email,
                              password: get(state, "password", ""),
                              newPassword: get(state, "newPassword", ""),
                            }}
                            validate={(values) => FeildManageValidatorPassword(values)}
                            validateOnChange
                            onSubmit={saveCategory}
                          >
                            {(formikBag) => {
                              return (
                                <Form>
                                  <Field name="email">
                                    {({ field }) => (
                                      <div className="form-group">
                                        <label htmlFor="email">Email</label>
                                        <Input
                                          {...field}
                                          type="text"
                                          className="form-control"
                                          value={formikBag.values.email}
                                          onChange={(e) => {
                                            formikBag.setFieldValue("email", e.target.value);
                                          }}
                                          disabled
                                          error={
                                            formikBag.touched.email && formikBag.errors.email ? formikBag.errors.email : null
                                          }
                                        />
                                      </div>
                                    )}
                                  </Field>
                                  <Field name="password">
                                    {({ field }) => (
                                      <div className="form-group">
                                        <label htmlFor="password">Enter Old Password</label>
                                        <Input
                                          {...field}
                                          type="text"
                                          className="form-control"
                                          value={formikBag.values.password}
                                          onChange={(e) => {
                                            formikBag.setFieldValue("password", e.target.value);
                                          }}
                                          error={
                                            formikBag.touched.password && formikBag.errors.password
                                              ? formikBag.errors.password
                                              : null
                                          }
                                        />
                                      </div>
                                    )}
                                  </Field>
                                  <Field name="newPassword">
                                    {({ field }) => (
                                      <div className="form-group">
                                        <label htmlFor="password">Enter New Password</label>
                                        <Input
                                          {...field}
                                          type="text"
                                          className="form-control"
                                          value={formikBag.values.newPassword}
                                          onChange={(e) => {
                                            formikBag.setFieldValue("newPassword", e.target.value);
                                          }}
                                          error={
                                            formikBag.touched.newPassword && formikBag.errors.newPassword
                                              ? formikBag.errors.newPassword
                                              : null
                                          }
                                        />
                                      </div>
                                    )}
                                  </Field>
                                  <div className={classNames("form-group", classes.headingCenter)}>
                                    <button type="submit" className="btn btn-success">
                                      Submit
                                    </button>
                                  </div>
                                </Form>
                              );
                            }}
                          </Formik>
                        </div>
                      )}
                    </div>
                  </Col>
                  <Col xs={3}></Col>
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
