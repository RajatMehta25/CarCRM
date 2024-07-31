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
import { SaveOutlined, StoreMallDirectorySharp } from "@material-ui/icons";
import InputRange from "react-input-range";
import "./rangeslider.scss";
import "react-input-range/lib/css/index.css";
import EditIcon from "@material-ui/icons/Edit";
import RSelect from "react-select";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import "./ServiceManagement.css";
import Swal from "sweetalert2";
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

const FarePackage = (props) => {
  const classes = useStyles();

  // useEffect(() => {
  //   getData();
  // }, []);

  //  data from previous page
  // const [allData, storeData] = useState();
  // const getData = async () => {
  //   try {
  //     const { data } = await axios.get(`/private/petManageAdminFare`);
  //     storeData(data);
  //     console.log(data);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  const {
    location: { state },
    history,
  } = props;
  console.log(state);
  const [VehicleData, setVehilceData] = useState([]);
  const [VehicleMutliValue, setVehicleMultiValue] = useState([]);
  const [val, setVal] = React.useState({
    min: state.result.docs[0].rangeStart,
    max: state.result.docs[0].rangeEnd,
  });
  const [val1, setVal1] = React.useState({
    min: state.result.docs[1].rangeStart,
    max: state.result.docs[1].rangeEnd,
  });
  const [val2, setVal2] = React.useState({
    min: state.result.docs[2].rangeStart,
    max: state.result.docs[2].rangeEnd,
  });

  const [val3, setVal3] = React.useState({
    min: state.result.docs[3].rangeStart,
    max: state.result.docs[3].rangeEnd,
  });
  const [val4, setVal4] = React.useState({
    min: state.result.docs[4].rangeStart,
    max: state.result.docs[4].rangeEnd,
  });
  const [val5, setVal5] = React.useState({
    min: state.result.docs[5].rangeStart,
    max: state.result.docs[5].rangeEnd,
  });
  //Validation Schema
  const fileRef = useRef(null);
  const [profileImagepath, setProfileImagepath] = useState("");
  const [editValue, setEdit] = useState({
    0: false,
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
  });
  const validationSchema = yup.object({
    // bookingFee: yup
    //   .number()
    //   .typeError("Only Number Accepted")
    //   .required("Booking Fee is required"),
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
    maxRadius: yup.number().max(100, "Max value is 100"),
    adminCancellationFee: yup.number().min(1, "Min value is 1").max(100, "Max value is 100"),
    driverCancellationFee: yup.number().min(1, "Min value is 1").max(100, "Max value is 100"),
    EnvelopePrice: yup.number().typeError("Only Number Accepted").required("Envelope Price is required"),
    PakPrice: yup.number().typeError("Only Number Accepted").required("Pak Prize is required"),

    packagePriceSmall: yup.number().typeError("Only Number Accepted").required("Small Box Price is required"),
    packagePriceMedium: yup.number().typeError("Only Number Accepted").required("Medium Box Price is required"),
    packagePriceLarge: yup.number().typeError("Only Number Accepted").required("Large Box is required"),
    packagePriceExtraLarge: yup.number().typeError("Only Number Accepted").required("EXtra Large Box is required"),
    vehicleId: yup.array().required("Select Vehicle"),
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
  useEffect(() => {
    getVehicleList();
  }, []);
  useEffect(() => {
    console.log(VehicleData);
    getSelectData();
  }, [VehicleData]);

  const getVehicleList = async () => {
    const { data } = await axios.get(`/private/vehicaleList`);
    console.log(data);
    let newArray = data.data.map((ele) => ({ label: ele.title, value: ele._id }));
    setVehilceData(newArray);
  };
  const getSelectData = async () => {
    if (state.vehicleId !== undefined || state.vehicleId !== []) {
      setVehicleMultiValue(VehicleData?.filter((ele) => state.vehicleId.some((ele2) => ele.value === ele2._id)));
    } else {
      setVehicleMultiValue([]);
    }
  };

  // ADDING NEW CATEGORY

  //   const addNewTaxiSingle = async (values) => {
  //     try {
  //       console.log(values);

  //       const { data } = await axios.post("/vehicleCategory", {
  //         title: values.name,
  //         icon: values.file1,
  //       });
  //       props.history.push({
  //         pathname: "/adminPanel/TaxiSingleManagement",
  //       });
  //       toast.success(data.message, {
  //         position: toast.POSITION.TOP_RIGHT,
  //       });
  //       console.log(data);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  const getData = async () => {
    const apiGetData = await axios.get(`/private/courier`);
    console.log(apiGetData.data.data);
    getVehicleList();
    history.replace({
      pathname: "/adminPanel/FarePackage",
      state: apiGetData.data.data,
    });
  };

  // Edit Category . update api

  const EditFarePackage = async (values) => {
    try {
      console.log(values);

      const { data } = await axios.put(`/private/courierAdminFee/${state.adminFee[0]._id}`, {
        distanceRate: values.distanceRate || state.adminFee[0].distanceRate,
        adminCommission: values.adminCommission || state.adminFee[0].adminCommission,
        cancellationFee: values.cancellationFee || state.adminFee[0].cancellationFee,
        timeRate: values.timeRate || state.adminFee[0].timeRate,
        maxRadius: values.maxRadius || state.adminFee[0].maxRadius,
        adminCancellationFee: values.adminCancellationFee || state.adminFee[0].adminCancellationFee,
        driverCancellationFee: values.driverCancellationFee || state.adminFee[0].driverCancellationFee,
        // vehicleId: values.vehicleId || state.vehicleId,
      });

      toast.success(data.message, {
        position: toast.POSITION.TOP_RIGHT,
      });

      props.history.push({
        pathname: "/adminPanel/PackageManagement",
      });
      console.log(data);
    } catch (error) {
      // const errors = error.response.data.errors;
      console.log(error);
      // var err = {};
      // errors.map((e) => {
      //   err[e.param] = e.msg;
      // });
      //  toast.success(errors.messages, {
      //    position: toast.POSITION.TOP_RIGHT,
      //  });
    }
  };

  const submitEach = async (values, key) => {
    switch (key) {
      case 0:
        try {
          console.log(values);
          const { data } = await axios.put(`/private/courier/${state.result.docs[3]._id}`, {
            packagePrice: values.EnvelopePrice || state.result.docs[3].EnvelopePrice,
            rangeStart: val3.min || state.result.docs[3].rangeStart,
            rangeEnd: val3.max || state.result.docs[3].rangeEnd,
          });
          toast.success(data.messages, {
            position: toast.POSITION.TOP_RIGHT,
          });
          getData();

          console.log(data);
        } catch (error) {
          console.log(error);
        }
        break;
      case 1:
        try {
          const { data } = await axios.put(`/private/courier/${state.result.docs[4]._id}`, {
            packagePrice: values.PakPrice || state.result.docs[4].PakPrice,
            rangeStart: val4.min || state.result.docs[4].rangeStart,
            rangeEnd: val4.max || state.result.docs[4].rangeEnd,
          });
          toast.success(data.messages, {
            position: toast.POSITION.TOP_RIGHT,
          });
          getData();
        } catch (error) {
          console.log(error);
        }
        break;
      case 2:
        try {
          const { data } = await axios.put(`/private/courier/${state.result.docs[2]._id}`, {
            packagePrice: values.packagePriceSmall || state.result.docs[2].packagePriceSmall,
            rangeStart: val2.min || state.result.docs[2].rangeStart,
            rangeEnd: val2.max || state.result.docs[2].rangeEnd,
          });
          toast.success(data.messages, {
            position: toast.POSITION.TOP_RIGHT,
          });
          getData();
        } catch (error) {
          console.log(error);
        }
        break;
      case 3:
        try {
          const { data } = await axios.put(`/private/courier/${state.result.docs[1]._id}`, {
            rangeStart: val1.min || state.result.docs[1].rangeStart,
            rangeEnd: val1.max || state.result.docs[1].rangeEnd,

            packagePrice: values.packagePriceMedium || state.result.docs[1].packagePriceMedium,
          });
          toast.success(data.messages, {
            position: toast.POSITION.TOP_RIGHT,
          });
          getData();
        } catch (error) {
          console.log(error);
        }
        break;
      case 4:
        try {
          const { data } = await axios.put(`/private/courier/${state.result.docs[0]._id}`, {
            packagePrice: values.packagePriceLarge || state.result.docs[0].packagePriceLarge,
            rangeStart: val.min || state.result.docs[0].rangeStart,
            rangeEnd: val.max || state.result.docs[0].rangeEnd,
          });
          toast.success(data.messages, {
            position: toast.POSITION.TOP_RIGHT,
          });
          getData();
        } catch (error) {
          console.log(error);
        }
        break;

      case 5:
        try {
          const { data } = await axios.put(`/private/courier/${state.result.docs[5]._id}`, {
            packagePrice: values.packagePriceExtraLarge || state.result.docs[5].packagePriceExtraLarge,
            rangeStart: val5.min || state.result.docs[5].rangeStart,
            rangeEnd: val5.max || state.result.docs[5].rangeEnd,
          });
          toast.success(data.messages, {
            position: toast.POSITION.TOP_RIGHT,
          });
          getData();
        } catch (error) {
          console.log(error);
        }
        break;
      case 6:
        try {
          const { data } = await axios.put(`/private/rideVehicleUpdate/62d53ae6bf652aa3778946d3`, {
            vehicleId: [...VehicleMutliValue.map((val) => val.value)],
            // "ajk",
            // values.timeRate || state.timeRate,
            // is_active: state.is_active,
          });
          console.log(data);
          toast.success("Success", {
            position: toast.POSITION.TOP_RIGHT,
          });
          getData();
        } catch (error) {
          console.log(error);
        }
        break;
      default:
        break;
    }
  };

  const customStyles = {
    control: (provided) => ({
      ...provided,
      height: 45,
    }),
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
          pathname: "/adminPanel/PackageManagement",
        });
      } else if (result.isCancelled) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  };
  console.log(state);
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
                        //     pathname: "/adminPanel/PackageManagement",
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
                      {!state ? `MANAGE FARE` : `MANAGE FARE`}
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
                  <div style={{ margin: "2rem 0 2rem 0" }}>
                    <Formik
                      validationSchema={validationSchema}
                      initialValues={{
                        EnvelopeSize: state.result.docs[3].packageSize,
                        EnvelopePrice: state.result.docs[3].packagePrice,
                        Pak: state.result.docs[4].packageSize,
                        PakPrice: state.result.docs[4].packagePrice,
                        packageSizeSmall: state.result.docs[2].packageSize,
                        packagePriceSmall: state.result.docs[2].packagePrice,

                        packageSizeMedium: state.result.docs[1].packageSize,
                        packagePriceMedium: state.result.docs[1].packagePrice,

                        packageSizeLarge: state.result.docs[0].packageSize,
                        packagePriceLarge: state.result.docs[0].packagePrice,

                        packageSizeExtraLarge: state.result.docs[5].packageSize,
                        packagePriceExtraLarge: state.result.docs[5].packagePrice,

                        //adminfare
                        distanceRate: state?.adminFee[0]?.distanceRate,

                        // distanceRate: get(state, "distanceRate", ""),
                        adminCommission: get(state?.adminFee[0], "adminCommission", ""),
                        cancellationFee: get(state?.adminFee[0], "cancellationFee", ""),
                        timeRate: get(state?.adminFee[0], "timeRate", ""),
                        maxRadius: get(state?.adminFee[0], "maxRadius", ""),
                        driverCancellationFee: get(state?.adminFee[0], "driverCancellationFee"),
                        adminCancellationFee: get(state?.adminFee[0], "adminCancellationFee"),
                        // vehicleId: get(state?.adminFee[0], "vehicleId", ""),
                        // desc: get(state, "desc", ""),
                      }}
                      onSubmit={(values) => {
                        console.log(values);
                        if (state && state !== "") {
                          EditFarePackage(values);
                        } else {
                          //   addNewTaxiSingle(values);
                          console.log("gadbad");
                        }
                      }}
                    >
                      {({ values, setFieldValue, errors }) => (
                        <Form>
                          <div className="container">
                            {/* <div className="row my-4 mx-1">
                              <h4> Manage Vehicle:</h4>
                            </div>
                            <div className="row my-4 d-flex align-items-end ">
                              <div className="col-8 d-flex flex-column">
                                <span
                                  style={{
                                    fontSize: "16px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  Select Vehicle:
                                </span>
                                <div>
                                  <RSelect
                                    isSearchable={false}
                                    isMulti={true}
                                    options={VehicleData}
                                    value={VehicleMutliValue}
                                    styles={customStyles}
                                    onChange={(e) => {
                                      setVehicleMultiValue(e);
                                      // setFieldValue(
                                      //   "vehicleId",
                                      //   e?.map((ele, index) => ele.value)
                                      // );
                                      console.log(e);
                                    }}
                                    isDisabled={editValue[6] ? false : true}
                                  />
                                </div>
                                <KErrorMessage name="vehicleId" />
                              </div>
                              <div className="col-3 d-flex align-items-center">
                                <button
                                  type="button"
                                  className="FarePackageEditButton"
                                  style={{}}
                                  onClick={() => {
                                    setEdit({ ...editValue, 6: true });
                                  }}
                                >
                                  Edit
                                 
                                </button>
                                {editValue[6] ? (
                                  <button
                                    className="FarePackageSaveButton"
                                    type="button"
                                    style={{}}
                                    onClick={() => {
                                      VehicleMutliValue === null || VehicleMutliValue === undefined
                                        ? toast.error("Select Value", {
                                            position: "top-right",
                                          })
                                        : submitEach(values, 6);
                                      setEdit({ ...editValue, 6: false });
                                    }}
                                  >
                                    Save
                                   
                                  </button>
                                ) : (
                                  ""
                                )}
                              </div>
                            </div> */}
                            <div className="row mx-1 my-4">
                              <h4>Edit Size (in USD):</h4>
                            </div>
                            <div className="row">
                              <div className="col-4">
                                <span
                                  style={{
                                    fontSize: "16px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  Package Size
                                </span>
                              </div>
                              <div className="col-4">
                                <span
                                  style={{
                                    fontSize: "16px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {" "}
                                  Range(in cubic inches)
                                </span>
                              </div>
                              <div className="col-4">
                                <span
                                  style={{
                                    fontSize: "16px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  Package Price
                                </span>
                              </div>
                            </div>

                            <div className="row align-items-center">
                              <div className="col-8 d-flex align-items-center">
                                {" "}
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
                                    marginRight: "1rem",
                                    cursor: "not-allowed",
                                  }}
                                  className=""
                                  name="EnvelopeSize"
                                  type="text"
                                  readOnly
                                />
                                {/* <KErrorMessage name="EnvelopeSize" /> */}
                                {/* </div> */}
                                {/* <div className="col-4"> */}
                                <InputRange
                                  step={1}
                                  formatLabel={(value) => value}
                                  draggableTrack={false}
                                  allowSameValues={false}
                                  maxValue={2500}
                                  minValue={0}
                                  value={val3}
                                  onChange={setVal3}
                                  onChangeComplete={(args) => console.log(args)}
                                />
                              </div>
                              {/* <Field
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
                                /> */}
                              {/* </div> */}
                              <div className="col-3 d-flex flex-column">
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
                                  name="EnvelopePrice"
                                  type="text"
                                  readOnly={editValue[0] ? false : true}
                                />
                                <KErrorMessage name="EnvelopePrice" />
                              </div>
                              <div className="col-1 d-flex">
                                <button
                                  type="button"
                                  className="FarePackageSmallEditButton"
                                  style={{}}
                                  onClick={() => {
                                    setEdit({
                                      ...editValue,
                                      0: true,
                                    });
                                  }}
                                >
                                  <EditIcon />
                                </button>
                                {editValue[0] ? (
                                  <button
                                    type="button"
                                    className="FarePackageSmallSaveButton"
                                    style={{}}
                                    onClick={() => {
                                      submitEach(values, 0);
                                      setEdit({
                                        ...editValue,
                                        0: false,
                                      });
                                    }}
                                  >
                                    <SaveOutlined />
                                  </button>
                                ) : (
                                  ""
                                )}
                              </div>
                            </div>

                            <div className="row align-items-center">
                              <div className="col-8 d-flex align-items-center ">
                                {" "}
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
                                    marginRight: "1rem",
                                    cursor: "not-allowed",
                                  }}
                                  className=""
                                  name="Pak"
                                  type="text"
                                  readOnly
                                />
                                {/* <KErrorMessage name="Pak" /> */}
                                {/* </div> */}
                                {/* <div className="col-4"> */}
                                <InputRange
                                  step={1}
                                  formatLabel={(value) => value}
                                  draggableTrack={false}
                                  allowSameValues={false}
                                  maxValue={2500}
                                  minValue={0}
                                  value={val4}
                                  onChange={setVal4}
                                  onChangeComplete={(args) => console.log(args)}
                                />
                                {/* <Field
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
                                /> */}
                              </div>
                              <div className="col-3 d-flex flex-column">
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
                                  name="PakPrice"
                                  type="text"
                                  readOnly={editValue[1] ? false : true}
                                />
                                <KErrorMessage name="PakPrice" />
                              </div>
                              <div className="col-1 d-flex ">
                                <button
                                  type="button"
                                  className="FarePackageSmallEditButton"
                                  onClick={() => {
                                    setEdit({ ...editValue, 1: true });
                                  }}
                                >
                                  <EditIcon />
                                </button>
                                {editValue[1] ? (
                                  <button
                                    type="button"
                                    className="FarePackageSmallSaveButton"
                                    onClick={() => {
                                      submitEach(values, 1);
                                      setEdit({ ...editValue, 1: false });
                                    }}
                                  >
                                    <SaveOutlined />
                                  </button>
                                ) : (
                                  ""
                                )}
                              </div>
                            </div>

                            <div className="row align-items-center">
                              <div className="col-8 d-flex align-items-center">
                                {" "}
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
                                    marginRight: "1rem",
                                    cursor: "not-allowed",
                                  }}
                                  className=""
                                  name="packageSizeSmall"
                                  type="text"
                                  readOnly
                                />
                                {/* <KErrorMessage name="packageSizeSmall" /> */}
                                {/* </div> */}
                                {/* <div className="col-4"> */}
                                <InputRange
                                  step={1}
                                  formatLabel={(value) => value}
                                  draggableTrack={false}
                                  allowSameValues={false}
                                  maxValue={2500}
                                  minValue={0}
                                  value={val2}
                                  onChange={setVal2}
                                  onChangeComplete={(args) => console.log(args)}
                                />
                                {/* <Field
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
                                /> */}
                              </div>
                              <div className="col-3 d-flex flex-column">
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
                                  name="packagePriceSmall"
                                  type="text"
                                  readOnly={editValue[2] ? false : true}
                                />
                                <KErrorMessage name="packagePriceSmall" />
                              </div>
                              <div className="col-1 d-flex">
                                <button
                                  type="button"
                                  className="FarePackageSmallEditButton"
                                  onClick={() => {
                                    setEdit({ ...editValue, 2: true });
                                  }}
                                >
                                  <EditIcon />
                                </button>
                                {editValue[2] ? (
                                  <button
                                    type="button"
                                    className="FarePackageSmallSaveButton"
                                    onClick={() => {
                                      submitEach(values, 2);
                                      setEdit({ ...editValue, 2: false });
                                    }}
                                  >
                                    <SaveOutlined />
                                  </button>
                                ) : (
                                  ""
                                )}
                              </div>
                            </div>

                            <div className="row align-items-center">
                              <div className="col-8 d-flex align-items-center">
                                {" "}
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
                                    marginRight: "1rem",
                                    cursor: "not-allowed",
                                  }}
                                  className=""
                                  name="packageSizeMedium"
                                  type="text"
                                  readOnly
                                />
                                {/* <KErrorMessage name="packageSizeMedium" /> */}
                                {/* </div> */}
                                {/* <div className="col-4"> */}
                                <InputRange
                                  step={1}
                                  formatLabel={(value) => value}
                                  draggableTrack={false}
                                  allowSameValues={false}
                                  maxValue={2500}
                                  minValue={0}
                                  value={val1}
                                  onChange={setVal1}
                                  onChangeComplete={(args) => console.log(args)}
                                />
                                {/* <Field
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
                                /> */}
                              </div>
                              <div className="col-3 d-flex flex-column">
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
                                  name="packagePriceMedium"
                                  type="text"
                                  readOnly={editValue[3] ? false : true}
                                />
                                <KErrorMessage name="packagePriceMedium" />
                              </div>
                              <div className="col-1 d-flex">
                                <button
                                  type="button"
                                  className="FarePackageSmallEditButton"
                                  onClick={() => {
                                    setEdit({ ...editValue, 3: true });
                                  }}
                                >
                                  <EditIcon />
                                </button>
                                {editValue[3] ? (
                                  <button
                                    type="button"
                                    className="FarePackageSmallSaveButton"
                                    onClick={() => {
                                      setEdit({ ...editValue, 3: false });
                                      submitEach(values, 3);
                                    }}
                                  >
                                    <SaveOutlined />
                                  </button>
                                ) : (
                                  ""
                                )}
                              </div>
                            </div>

                            <div className="row align-items-center">
                              <div className="col-8 d-flex align-items-center">
                                {" "}
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
                                    marginRight: "1rem",
                                    cursor: "not-allowed",
                                  }}
                                  className=""
                                  name="packageSizeLarge"
                                  type="text"
                                  readOnly
                                />
                                {/* <KErrorMessage name="packageSizeLarge" /> */}
                                {/* </div> */}
                                {/* <div className="col-4"> */}
                                <InputRange
                                  step={1}
                                  formatLabel={(value) => value}
                                  draggableTrack={false}
                                  allowSameValues={false}
                                  maxValue={2500}
                                  minValue={0}
                                  value={val}
                                  onChange={setVal}
                                  onChangeComplete={(args) => console.log(args)}
                                />
                                {/* <Field
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
                                /> */}
                              </div>
                              <div className="col-3 d-flex flex-column">
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
                                  name="packagePriceLarge"
                                  type="text"
                                  readOnly={editValue[4] ? false : true}
                                />
                                <KErrorMessage name="packagePriceLarge" />
                              </div>
                              <div className="col-1 d-flex">
                                <button
                                  type="button"
                                  className="FarePackageSmallEditButton"
                                  onClick={() => {
                                    setEdit({ ...editValue, 4: true });
                                  }}
                                >
                                  <EditIcon />
                                </button>
                                {editValue[4] ? (
                                  <button
                                    type="button"
                                    className="FarePackageSmallSaveButton"
                                    onClick={() => {
                                      submitEach(values, 4);
                                      setEdit({ ...editValue, 4: false });
                                    }}
                                  >
                                    <SaveOutlined />
                                  </button>
                                ) : (
                                  ""
                                )}
                              </div>
                            </div>
                            {/* xl */}

                            <div className="row align-items-center">
                              <div className="col-8 d-flex align-items-center">
                                {" "}
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
                                    marginRight: "1rem",
                                    cursor: "not-allowed",
                                  }}
                                  className=""
                                  name="packageSizeExtraLarge"
                                  type="text"
                                  readOnly
                                />
                                {/* <KErrorMessage name="packageSizeExtraLarge" /> */}
                                {/* </div> */}
                                {/* <div className="col-4"> */}
                                <InputRange
                                  step={1}
                                  formatLabel={(value) => value}
                                  draggableTrack={false}
                                  allowSameValues={false}
                                  maxValue={2500}
                                  minValue={0}
                                  value={val5}
                                  onChange={setVal5}
                                  onChangeComplete={(args) => console.log(args)}
                                />
                                {/* <Field
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
                                /> */}
                              </div>
                              <div className="col-3 d-flex flex-column">
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
                                  name="packagePriceExtraLarge"
                                  type="text"
                                  readOnly={editValue[5] ? false : true}
                                />
                                <KErrorMessage name="packagePriceExtraLarge" />
                              </div>
                              <div className="col-1 d-flex">
                                <button
                                  type="button"
                                  className="FarePackageSmallEditButton"
                                  onClick={() => {
                                    setEdit({ ...editValue, 5: true });
                                  }}
                                >
                                  <EditIcon />
                                </button>
                                {editValue[5] ? (
                                  <button
                                    type="button"
                                    className="FarePackageSmallSaveButton"
                                    onClick={() => {
                                      submitEach(values, 5);
                                      setEdit({ ...editValue, 5: false });
                                    }}
                                  >
                                    <SaveOutlined />
                                  </button>
                                ) : (
                                  ""
                                )}
                              </div>
                            </div>
                            <div className="row mx-1 my-4">
                              <h4>Edit Fare (in USD):</h4>
                            </div>
                            <div className="row my-2">
                              <div className="col-6 d-flex flex-column ">
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
                                  Time Rate(per min):
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
                                  name="timeRate"
                                  type="text"
                                />
                                <KErrorMessage name="timeRate" />
                              </div>
                            </div>
                            <div className="row my-2">
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

                            {/* maxradius */}
                            <div className="row my-2">
                              <div className="col-6 d-flex flex-column ">
                                <span
                                  style={{
                                    fontSize: "16px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  Maximum Radius(miles):
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
                                  name="maxRadius"
                                  type="text"
                                />
                                <KErrorMessage name="maxRadius" />
                              </div>
                              <div className="col-6 d-flex flex-column">
                                <span
                                  style={{
                                    fontSize: "16px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  Admin Cancellation Fee (in %):
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

                            <div className="row my-2">
                              <div className="col-6 d-flex flex-column ">
                                <span
                                  style={{
                                    fontSize: "16px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  Driver Cancellation Fee (in %):
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
                              <div className="col-6 d-flex flex-column"></div>
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

export default FarePackage;
