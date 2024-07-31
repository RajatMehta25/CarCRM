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
import DatePicker from "react-date-picker";
import DRIVER from "axios";
import "./datestyle.scss";
import Swal from "sweetalert2";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import { ServiceType_Url } from "../../statics/constants";
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

  //  data from previous page

  useEffect(() => {
    // getactivemenuitem();
  }, []);
  const {
    location: { state },
    history,
  } = props;
  console.log(props);
  const getactivemenuitem = () => {
    const result = [...document.getElementsByTagName("a")];
    const newres = result.filter((ele) => {
      if (ele.innerText === "Manage Promocode") {
        return ele;
      }
    });
    newres[0].classList.add("activate");
    console.log(newres);
    console.log(result);
  };
  console.log(state);
  //Validation Schema
  const fileRef = useRef(null);
  const [profileImagepath, setProfileImagepath] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [serviceType, setServiceType] = useState([]);

  const validationSchema = yup.object({
    serviceType: yup.string().required("Service Type is required"),
    offerType: yup.string().required("Offer Type is required"),
    offerName: yup
      .string()
      .min(5, "Mininum 5 characters required")
      .max(20, "Maximum 20 characters required")
      .required("Offer Name is required"),
    offerCode: yup.string().required("Offer Code is required"),

    discountType: yup.string().required("Discount Type is required"),
    discountAmount: yup.number().when("discountType", {
      is: (discountType) => discountType == "0",
      then: yup
        .number()
        .integer("Integer values only")
        .min(1, "Minimum value is 1")
        .typeError("Numeric values only")
        .required("Discount Amount is required"),
      otherwise: yup
        .number()
        .integer("Integer values only")
        .min(1, "Minimum value is 1")
        .max(99, "Maximum value is 99")
        .typeError("Numeric values only")
        .required("Discount Percentage is required"),
      // .integer("Integer values only")
      // .min(1, "Minimum value is 1")
      // .typeError("Numeric values only")
      // .required("Discount Amount is required"),
      // startDate: !state ? "" : new Date(state.startDate),
      // endDate: !state ? "" : new Date(state.endDate),
    }),

    userLimit: yup.number().typeError("Numeric values only").required("User Limit is required"),
    minimumOrderLimit: yup.number().when("discountType", {
      is: (discountType) => discountType == "0",
      then: yup
        .number()
        .integer("Integer values only")
        .moreThan(yup.ref("discountAmount"), "Minimum value should be greater than discount amount")
        .typeError("Numeric values only")
        .required("Discount Amount is required"),
      otherwise: yup
        .number()
        .integer("Integer values only")
        .min(1, "Minimum value is 1")
        // .max(99, "Maximum value is 99")
        .typeError("Numeric values only")
        .required("Discount Percentage is required"),
      // .typeError("Numeric values only")
      // .min(1, "Minimum value is 1")
      // .required("Minimum Order Limit is required"),
    }),
    description: yup
      .string()
      .min(5, "Mininum 5 characters required")
      .max(30, "Maximum 50 characters required")
      .required("Description is required"),
  });
  const validationSchema2 = yup.object({
    serviceType: yup.string().required("Service Type is required"),
    // offerType: yup.string().required("Offer Type is required"),
    offerName: yup
      .string()
      .min(5, "Mininum 5 characters required")
      .max(20, "Maximum 20 characters required")
      .required("Offer Name is required"),
    offerCode: yup.string().required("Offer Code is required"),
    discountType: yup.string().required("Discount Type is required"),
    discountAmount: yup
      .number()
      // .integer("Integer values only")
      // .min(1, "Minimum value is 1")
      // .typeError("Numeric values only")
      // .required("Discount Amount is required"),
      // .when("discountType", (discountType) => {
      //   if (discountType == "1") {
      //     return yup
      //       .number()
      //       .typeError("Numeric values only")
      //       .required("Discount Percentage is required");
      //   } else {
      //     return yup
      //       .number()
      //       .typeError("Numeric values only")
      //       .required("Discount Amount is required");
      //   }
      .when("discountType", {
        is: (discountType) => discountType == "0",
        then: yup
          .number()
          .integer("Integer values only")
          .min(1, "Minimum value is 1")
          .typeError("Numeric values only")
          .required("Discount Amount is required"),
        otherwise: yup
          .number()
          .integer("Integer values only")
          .min(1, "Minimum value is 1")
          .max(99, "Maximum value is 99")
          .typeError("Numeric values only")
          .required("Discount Percentage is required"),
        // if (discountType == "1") {
        //   return yup
        //     .number()
        //     .integer("Integer values only")
        //     .min(1, "Minimum value is 1")
        //     .max(99, "Maximum value is 99")
        //     .typeError("Numeric values only")
        //     .required("Discount Percentage is required");
        // } else {
        //   return yup
        //     .number()
        //     .integer("Integer values only")
        //     .min(1, "Minimum value is 1")
        //     .typeError("Numeric values only")
        //     .required("Discount Amount is required");
        // }
        // }),

        // startDate: yup.date().required("Start Date is required"),
        // endDate: yup.date().required("End Date is required"),
        // userLimit: yup.number().required("User Limit is required"),
      }),
    minimumOrderLimit: yup.number().when("discountType", {
      is: (discountType) => discountType == "0",
      then: yup
        .number()
        .integer("Integer values only")
        .moreThan(yup.ref("discountAmount"), "Minimum value should be greater than discount amount")
        .typeError("Numeric values only")
        .required("Discount Amount is required"),
      otherwise: yup
        .number()
        .integer("Integer values only")
        .min(1, "Minimum value is 1")
        // .max(99, "Maximum value is 99")
        .typeError("Numeric values only")
        .required("Discount Percentage is required"),
      // .typeError("Numeric values only")
      // .min(1, "Minimum value is 1")
      // .required("Minimum Order Limit is required"),
    }),
    description: yup
      .string()
      .min(5, "Mininum 5 characters required")
      .max(50, "Maximum 50 characters required")
      .required("Description is required"),
    // .typeError("Numeric values only")

    // .min(1, "Minimum value is 1")
    // .required("Minimum Order Limit is required"),
  });
  useEffect(() => {
    getServiceType();
  }, []);

  // get service type
  const getServiceType = async () => {
    try {
      const { data } = await DRIVER.get(`${ServiceType_Url }`);
      setServiceType(data.data);
      console.log(data.data);
      // return res.data;
    } catch (error) {
      console.log(error);
    }
  };
  // ADDING NEW CATEGORY

  const addNewPromocode = async (values) => {
    try {
      console.log(values);

      const { data } = await axios.post("/private/promocode", {
        serviceTypeId: values.serviceType,
        OfferType: values.offerType,
        offerName: values.offerName,
        offerCode: values.offerCode,
        discountAmount: values.discountAmount,
        discountType: values.discountType,
        startDate: values.startDate,
        endDate: values.endDate,
        userLimit: values.userLimit,
        minimumOrderLimit: values.minimumOrderLimit,
        description: values.description,
      });
      props.history.push({
        pathname: "/adminPanel/PromoCode_Management",
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

  const EditPromocode = async (values) => {
    try {
      console.log(values);

      const { data } = await axios.put(`/private/promocode/${state._id}`, {
        serviceTypeId: values.serviceType || state.serviceTypeId,
        OfferType: values.offerType || state.OfferType,
        offerName: values.offerName || state.offerName,
        offerCode: values.offerCode || state.offerCode,
        discountAmount: values.discountAmount || state.discountAmount,
        discountType: values.discountType || state.discountType,
        startDate: values.startDate || state.startDate,
        endDate: values.endDate || state.endDate,
        userLimit: values.userLimit || state.userLimit,
        minimumOrderLimit: values.minimumOrderLimit || state.minimumOrderLimit,
        description: values.description || state.description,
      });
      props.history.push({
        pathname: "/adminPanel/PromoCode_Management",
      });
      toast.success(data.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  const [offer, setOfferCode] = useState("");
  const generateOfferCode = async (values) => {
    let dataToReturn;
    if (values.offerName.length >= 5 && values.offerName.length <= 20) {
      try {
        const { data } = await axios.post(`/private/createOfferCode`, {
          serviceTypeId: values.serviceType || state.serviceTypeId,
          offerName: values.offerName || state.offerName,
          OfferType: values.offerType || state.OfferType,
        });
        console.log(data);

        toast.success("Succesfully generated offer code", {
          position: toast.POSITION.TOP_RIGHT,
        });
        dataToReturn = data.data.offerCode;
      } catch (error) {
        console.log(error);
      }
      return dataToReturn;
    } else {
      toast.error("Check Form Values");
    }
  };

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
          pathname: "/adminPanel/PromoCode_Management",
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
                        // if (window.confirm("Leave without saving changes?")) {
                        //   props.history.push({
                        //     pathname: "/adminPanel/PromoCode_Management",
                        //   });
                        // }
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
                      {!state ? `Add Promocode` : `Edit Promocode`}
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
                  elevation={0}
                >
                  <div style={{ margin: "2rem 0 2rem 0" }}>
                    <Formik
                      validationSchema={!state ? validationSchema : validationSchema2}
                      initialValues={{
                        // name: get(state, "title", ""),
                        // file1: get(state, "icon", ""),
                        serviceType: get(state, "serviceTypeId", ""),
                        offerType: get(state, "OfferType", ""),
                        offerName: get(state, "offerName", ""),
                        offerCode: get(state, "offerCode", ""),
                        discountAmount: get(state, "discountAmount", ""),
                        discountType: get(state, "discountType", ""),
                        startDate: !state ? "" : new Date(state.startDate),
                        endDate: !state ? "" : new Date(state.endDate),
                        userLimit: get(state, "userLimit", ""),
                        minimumOrderLimit: get(state, "minimumOrderLimit", ""),
                        description: get(state, "description", ""),
                        // description: get(state, "description", ""),
                      }}
                      onSubmit={(values) => {
                        console.log(values);
                        if (state && state !== "") {
                          EditPromocode(values);
                        } else {
                          addNewPromocode(values);
                        }
                      }}
                    >
                      {({ values, setFieldValue }) => (
                        <Form>
                          <div className="container ">
                            <div className="row my-4 justify-center">
                              <div className={"col-6 d-flex flex-column "}>
                                <div className="h5 ">Service Type</div>

                                <Field
                                  name="serviceType"
                                  as="select"
                                  className="form-control"
                                  style={{
                                    // width: "90%",
                                    height: "40px",
                                    borderRadius: "5px",
                                    border: "1px solid #ced4da",
                                    padding: "0.5rem",
                                    fontWeight: "bold",
                                  }}
                                >
                                  <option value="">Select Service Type</option>
                                  {serviceType.map((ele, i) => (
                                    <option key={i} value={ele._id}>
                                      {ele.title === "Taxi Single" ? "Single Taxi" : ele.title}
                                    </option>
                                  ))}
                                </Field>
                                <KErrorMessage name="serviceType" />
                              </div>
                              <div className="col-6 d-flex flex-column " style={{}}>
                                <div className=" h5  ">Offer Type</div>

                                <Field
                                  name="offerType"
                                  as="select"
                                  className="form-control"
                                  style={{
                                    // width: "90%",
                                    height: "40px",
                                    borderRadius: "5px",
                                    border: "1px solid #ced4da",
                                    padding: "0.5rem",
                                    fontWeight: "bold",
                                    cursor: !state ? "" : "not-allowed",
                                  }}
                                  disabled={!state ? false : true}
                                >
                                  <option value="">Select Offer Type</option>
                                  <option value="0">New User</option>
                                  <option value="1">Existing User</option>
                                </Field>
                                <KErrorMessage name="offerType" />
                              </div>
                            </div>
                            {/* 1 */}
                            <div className="row my-4 justify-center ">
                              <div className="col-6 d-flex flex-column ">
                                <div className="h5 ">Offer Name</div>

                                <Field
                                  name="offerName"
                                  type="text"
                                  className="form-control"
                                  style={{
                                    // width: "70%",
                                    height: "40px",
                                    borderRadius: "5px",
                                    border: "1px solid #ced4da",
                                    padding: "0.5rem",
                                    fontWeight: "bold",
                                  }}
                                />
                                <KErrorMessage name="offerName" />
                              </div>
                              <div className="col-6 d-flex flex-column ">
                                <div className="h5 ">Offer Code</div>

                                <div className="d-flex flex-row align-items-center">
                                  {" "}
                                  <Field
                                    name="offerCode"
                                    type="text"
                                    className="form-control"
                                    style={{
                                      // width: "70%",
                                      flex: 1,
                                      height: "40px",
                                      borderRadius: "5px",
                                      border: "1px solid #ced4da",
                                      padding: "0.5rem",
                                      fontWeight: "bold",
                                    }}
                                    readOnly
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      generateOfferCode(values).then((res) => setFieldValue("offerCode", res));
                                    }}
                                    style={{
                                      // width: "50%",
                                      // height: "40px",
                                      flex: 1,
                                      borderRadius: "5px",
                                      border: "1px solid #ced4da",
                                      padding: "0.3rem",
                                      // paddingRight: "0.5rem",
                                      fontWeight: "bold",
                                      fontSize: "16px",
                                      backgroundColor:
                                        values.serviceType && values.offerType && values.offerName ? "#0059cd" : "#c4c4c4",
                                      color: "#fff",
                                    }}
                                    disabled={values.serviceType && values.offerType && values.offerName ? false : true}
                                  >
                                    Generate Code
                                  </button>
                                </div>

                                <KErrorMessage name="offerCode" />
                              </div>
                            </div>
                            {/* 2 */}
                            <div className="row my-4 justify-center ">
                              <div className="col-6 d-flex flex-column ">
                                <div className="h5 ">Discount Type</div>

                                <Field
                                  name="discountType"
                                  as="select"
                                  className="form-control"
                                  style={{
                                    // width: "70%",
                                    height: "40px",
                                    borderRadius: "5px",
                                    border: "1px solid #ced4da",
                                    padding: "0.5rem",
                                    fontWeight: "bold",
                                  }}
                                >
                                  <option value="">Select Discount Type</option>
                                  <option value="0">Flat</option>
                                  <option value="1">Percentage</option>
                                </Field>
                                <KErrorMessage name="discountType" />
                              </div>
                              <div className="col-6 d-flex flex-column ">
                                <div className="h5 ">Discount Amount{values.discountType == "1" ? "(%)" : ""}</div>

                                <Field
                                  name="discountAmount"
                                  type="text"
                                  className="form-control"
                                  style={{
                                    // width: "70%",
                                    height: "40px",
                                    borderRadius: "5px",
                                    border: "1px solid #ced4da",
                                    padding: "0.5rem",
                                    fontWeight: "bold",
                                  }}
                                  // min={1}
                                  // max={values.discountType == "1" ? 99 : 999999}
                                />
                                {console.log(values.discountType == "1")}
                                <KErrorMessage name="discountAmount" />
                              </div>
                            </div>
                            {/* 3 */}
                            <div className="row my-4 justify-center ">
                              <div className="col-6 d-flex flex-column  childDate">
                                <div className="h5 ">Start Date</div>

                                <DatePicker
                                  minDate={new Date()}
                                  value={values.startDate}
                                  // value={startDate}
                                  dateFormat="DD/MM/YYYY"
                                  onChange={(date) => {
                                    setStartDate(date);
                                    setFieldValue("startDate", date);
                                  }}
                                  required
                                />
                                {/* <Field
                                  type="date"
                                  name="startDate"
                                  className="form-control"
                                  style={{
                                    width: "70%",
                                    height: "40px",
                                    borderRadius: "5px",
                                    border: "1px solid #ced4da",
                                    padding: "0.5rem",
                                  }}
                                /> */}
                              </div>
                              <div className="col-6 d-flex flex-column  childDate">
                                <div className="h5 ">End Date</div>

                                <DatePicker
                                  minDate={values.startDate}
                                  value={values.endDate}
                                  dateFormat="DD/MM/YYYY"
                                  onChange={(date) => {
                                    setEndDate(date);
                                    setFieldValue("endDate", date);
                                  }}
                                  required
                                />
                                {/* <Field
                                  type="date"
                                  name="endDate"
                                  className="form-control"
                                  style={{
                                    width: "70%",
                                    height: "40px",
                                    borderRadius: "5px",
                                    border: "1px solid #ced4da",
                                    padding: "0.5rem",
                                  }}
                                  min={values.startDate}
                                />
                                {console.log(new Date(values.endDate))} */}
                              </div>
                            </div>
                            {/* 4 */}
                            <div className="row my-4 justify-center ">
                              <div className="col-6 d-flex flex-column ">
                                <div className="h5 ">No. of User Limit</div>

                                <Field
                                  name="userLimit"
                                  type="text"
                                  className="form-control"
                                  style={{
                                    // width: "70%",
                                    height: "40px",
                                    borderRadius: "5px",
                                    border: "1px solid #ced4da",
                                    padding: "0.5rem",
                                    fontWeight: "bold",
                                    cursor: !state ? "" : "not-allowed",
                                  }}
                                  disabled={!state ? false : true}
                                />
                                <KErrorMessage name="userLimit" />
                              </div>
                              <div className="col-6 d-flex flex-column ">
                                <div className="h5 ">Minimum Ride Value </div>

                                <Field
                                  name="minimumOrderLimit"
                                  type="text"
                                  className="form-control"
                                  style={{
                                    // width: "70%",
                                    height: "40px",
                                    borderRadius: "5px",
                                    border: "1px solid #ced4da",
                                    padding: "0.5rem",
                                    fontWeight: "bold",
                                  }}
                                />
                                <KErrorMessage name="minimumOrderLimit" />
                              </div>
                            </div>
                            <div className="row my-4 justify center">
                              <div className="col-12 d-flex flex-column">
                                <div className="h5">Description</div>
                                <Field
                                  name="description"
                                  // type="text"
                                  as="textarea"
                                  className="form-control"
                                  style={{
                                    // width: "70%",
                                    height: "100px",
                                    borderRadius: "5px",
                                    border: "1px solid #ced4da",
                                    padding: "0.5rem",
                                    fontWeight: "bold",
                                  }}
                                />
                                <div>
                                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontVariant: "small-caps" }}>
                                    {values.description.length}/30
                                  </span>
                                </div>
                                <KErrorMessage name="description" />
                              </div>
                            </div>
                            <br /> <br />
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

export default AddPetCategory;
