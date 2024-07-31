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
import { get, stubFalse } from "lodash";
import WallpaperIcon from "@material-ui/icons/Wallpaper";
import { handleImageUpload } from "../../services/upload-files-service";
import { EditOutlined, SaveAltOutlined, SaveOutlined, StoreMallDirectorySharp } from "@material-ui/icons";
import EditIcon from "@material-ui/icons/Edit";
import InputRange from "react-input-range";
import "./rangeslider.scss";
import "react-input-range/lib/css/index.css";
import { getDateFormat } from "../../helpers/helperFunction";
import RSelect from "react-select";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import "./ServiceManagement.css";
import Swal from "sweetalert2";
// import { useHistory } from "react-router-dom"; // version 5.2.0

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

const FarePet = (props) => {
  const classes = useStyles();
  // let history = useHistory();
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
  console.log(state, "state here");

  const [VehicleData, setVehilceData] = useState([]);
  const [VehicleMutliValue, setVehicleMultiValue] = useState([]);

  const [val, setVal] = React.useState({
    min: state.result[0].rangeStart,
    max: state.result[0].rangeEnd,
  });
  const [val1, setVal1] = React.useState({
    min: state.result[1].rangeStart,
    max: state.result[1].rangeEnd,
  });
  const [val2, setVal2] = React.useState({
    min: state.result[2].rangeStart,
    max: state.result[2].rangeEnd,
  });
  //Validation Schema
  const fileRef = useRef(null);
  const [profileImagepath, setProfileImagepath] = useState("");

  const [editValue, setEdit] = useState({
    0: false,
    1: false,
    2: false,
    3: false,
  });

  const validationSchema = yup.object({
    bookingFee: yup.number().typeError("Only Number Accepted").required("Booking Fee is required"),
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
    petPrize1: yup.number().typeError("Only Number Accepted").required("Pet Prize is required"),
    petPrize2: yup.number().typeError("Only Number Accepted").required("Pet Prize is required"),
    petPrize3: yup.number().typeError("Only Number Accepted").required("Pet Prize is required"),
    cargePrize1: yup
      .number()
      .lessThan(yup.ref("petPrize1"), "Cage price should be less than pet price")
      .typeError("Only Number Accepted")
      .required("Cage Prize is required"),
    cargePrize2: yup
      .number()
      .lessThan(yup.ref("petPrize2"), "Cage price should be less than pet price")
      .typeError("Only Number Accepted")
      .required("Cage Prize is required"),
    cargePrize3: yup
      .number()
      .lessThan(yup.ref("petPrize3"), "Cage price should be less than pet price")
      .typeError("Only Number Accepted")
      .required("Cage Prize is required"),

    adminCancellationFee: yup
      .number()
      .typeError("Only Number Accepted")
      .min(0, "Min value 0.")
      .max(99, "Max value 99.")
      .required("Admin Cancellation Fee is required"),
    driverCancellationFee: yup
      .number()
      .typeError("Only Number Accepted")
      .min(0, "Min value 0.")
      .max(99, "Max value 99.")
      .required("Driver Cancellation Fee is required"),
    // vehicleId: yup.array().required("Select Vehicle"),
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
    console.log(state.vehicleId);

    // getSelectData();
    // console.log(state);
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
  // useEffect(() => {
  //   state === undefined ? getData() : "";
  // }, []);
  const getData = async () => {
    const apiGetData = await axios.get(`/private/petManageAdminFare`);
    console.log(apiGetData.data.data);
    getVehicleList();
    // if (apiGetData.data.data.vehicleId !== undefined || apiGetData.data.data.vehicleId !== []) {
    //   setVehicleMultiValue(VehicleData.filter((ele) => apiGetData.data.data.vehicleId.some((ele2) => ele.value === ele2._id)));
    // } else {
    //   setVehicleMultiValue([]);
    // }
    history.replace({
      pathname: "/adminPanel/FarePet",
      state: apiGetData.data.data,
    });
  };

  // Edit Category . update api

  const EditFarePet = async (values) => {
    try {
      console.log(values);

      const { data } = await axios.put(`/private/petCategoryAdminManageFare/${state.adminFare._id}`, {
        bookingFee: values.bookingFee || state.adminFare.bookingFee,
        distanceRate: values.distanceRate || state.adminFare.distanceRate,
        adminCommission: values.adminCommission || state.adminFare.adminCommission,
        cancellationFee: values.cancellationFee || state.adminFare.cancellationFee,
        timeRate: values.timeRate || state.adminFare.timeRate,
        adminCancellationFee: values.adminCancellationFee || state.adminCancellationFee,
        driverCancellationFee: values.driverCancellationFee || state.driverCancellationFee,
        // vehicleId: values.vehicleId || state.vehicleId,
        // "ajk",
        // values.timeRate || state.timeRate,
        // is_active: state.is_active,
      });

      props.history.push({
        pathname: "/adminPanel/PetCategoryManagement",
      });
      toast.success("Updated Successfully", {
        position: toast.POSITION.TOP_RIGHT,
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
          const { data } = await axios.put(`/private/petCategoryManageFare/${state.result[0]._id}`, {
            petSize: values.petSize1 || state.result[0].petSize,
            rangeStart: val.min || state.result[0].rangeStart,
            rangeEnd: val.max || state.result[0].rangeEnd,
            petPrize: values.petPrize1 || state.result[0].petPrize,
            cargePrize: values.cargePrize1 || state.result[0].cargePrize,
            adminFareSet: state.adminFare._id,
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
          const { data } = await axios.put(`/private/petCategoryManageFare/${state.result[1]._id}`, {
            petSize: values.petSize2 || state.result[1].petSize,
            rangeStart: val1.min || state.result[1].rangeStart,
            rangeEnd: val1.max || state.result[1].rangeEnd,
            petPrize: values.petPrize2 || state.result[1].petPrize,
            cargePrize: values.cargePrize2 || state.result[1].cargePrize,
            adminFareSet: state.adminFare._id,
            // "ajk",
            // values.timeRate || state.timeRate,
            // is_active: state.is_active,
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
          const { data } = await axios.put(`/private/petCategoryManageFare/${state.result[2]._id}`, {
            petSize: values.petSize3 || state.result[2].petSize,
            rangeStart: val2.min || state.result[2].rangeStart,
            rangeEnd: val2.max || state.result[2].rangeEnd,
            petPrize: values.petPrize3 || state.result[2].petPrize,
            cargePrize: values.cargePrize3 || state.result[2].cargePrize,
            adminFareSet: state.adminFare._id,
            // "ajk",
            // values.timeRate || state.timeRate,
            // is_active: state.is_active,
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
          const { data } = await axios.put(`/private/rideVehicleUpdate/62d53ad1bf652aa3778946d0`, {
            // vehicleId: values.vehicleId,
            vehicleId: [...VehicleMutliValue.map((val) => val.value)],
            // "ajk",
            // values.timeRate || state.timeRate,
            // is_active: state.is_active,
          });
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
          pathname: "/adminPanel/PetCategoryManagement",
        });
      } else if (result.isCancelled) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  };
  console.log(state);
  console.log(VehicleData.filter((ele) => state.vehicleId.some((ele2) => ele.value === ele2._id)));
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
                        //     pathname: "/adminPanel/PetCategoryManagement",
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
                        cargePrize1: state.result[0].cargePrize,
                        petPrize1: state.result[0].petPrize,
                        petSize1: state.result[0].petSize,

                        cargePrize2: state.result[1].cargePrize,
                        petPrize2: state.result[1].petPrize,
                        petSize2: state.result[1].petSize,

                        cargePrize3: state.result[2].cargePrize,
                        petPrize3: state.result[2].petPrize,
                        petSize3: state.result[2].petSize,

                        //adminfare
                        distanceRate: state?.adminFare?.distanceRate,

                        adminCommission: get(state?.adminFare, "adminCommission", ""),
                        cancellationFee: get(state?.adminFare, "cancellationFee", ""),
                        timeRate: get(state?.adminFare, "timeRate", ""),
                        bookingFee: get(state?.adminFare, "bookingFee", ""),
                        adminCancellationFee: get(state?.adminFare, "adminCancellationFee", ""),
                        driverCancellationFee: get(state?.adminFare, "driverCancellationFee", ""),
                        // vehicleId: [],
                      }}
                      onSubmit={(values) => {
                        console.log(values, "OOOO");
                        if (state && state !== "") {
                          EditFarePet(values);
                        } else {
                          //   addNewTaxiSingle(values);
                          console.log("gadbad");
                        }
                      }}
                    >
                      {({ values, setFieldValue, errors }) => (
                        <Form>
                          <div className="container">
                            {/* start here */}
                            {/* <div className="row my-4 mx-1">
                              <h4> Manage Vehicle:</h4>
                            </div>
                            <div className="row my-4 d-flex align-items-end ">
                              <div className="col-9 d-flex flex-column">
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
                                    value={VehicleMutliValue}
                                    //  VehicleData.filter((ele) => state.vehicleId.some((ele2) => ele.value === ele2._id))

                                    isMulti={true}
                                    options={VehicleData}
                                    styles={customStyles}
                                    onChange={(e) => {
                                      setVehicleMultiValue(e);
                                      // setFieldValue(
                                      //   "vehicleId",
                                      //   e?.map((ele, index) => ele.value)
                                      // );
                                      console.log(e);
                                    }}
                                    isDisabled={editValue[3] ? false : true}
                                  />
                                </div>
                                <KErrorMessage name="vehicleId" />
                              </div>
                              <div className="col-3 d-flex align-items-center">
                                <button
                                  type="button"
                                  className="FarePackageEditButton"
                                  onClick={() => {
                                    setEdit({ ...editValue, 3: true });
                                  }}
                                >
                                  Edit
                                </button>
                                {editValue[3] ? (
                                  <button
                                    type="button"
                                    className="FarePackageSaveButton"
                                    onClick={() => {
                                      VehicleMutliValue === null || VehicleMutliValue === undefined
                                        ? toast.error("Select Value", {
                                            position: "top-right",
                                          })
                                        : submitEach(values, 3);
                                      setEdit({ ...editValue, 3: false });
                                    }}
                                  >
                                    Save
                                  </button>
                                ) : (
                                  ""
                                )}
                              </div>
                            </div> */}
                            {/* end here */}
                            <div className="row my-4 mx-1">
                              <h4> Edit Size (in USD) :</h4>
                            </div>
                            <div className="row">
                              <div className="col-3">
                                <span
                                  style={{
                                    fontSize: "16px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  Pet Size
                                </span>
                              </div>
                              <div className="col-3">
                                <span
                                  style={{
                                    fontSize: "16px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  Range
                                </span>
                              </div>
                              <div className="col-3">
                                <span
                                  style={{
                                    fontSize: "16px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  Pet Price
                                </span>
                              </div>
                              <div className="col-3">
                                <span
                                  style={{
                                    fontSize: "16px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  Cage Price
                                </span>
                              </div>
                            </div>
                            <div className="row align-items-center">
                              <div className="col-2 d-flex flex-column">
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
                                    textTransform: "capitalize",
                                    cursor: "not-allowed",
                                  }}
                                  className=""
                                  name="petSize1"
                                  type="text"
                                  readOnly
                                />
                                <KErrorMessage name="petSize1" />
                              </div>
                              <div className="col-3">
                                <InputRange
                                  step={1}
                                  formatLabel={(value) => value + "lbs"}
                                  draggableTrack={false}
                                  allowSameValues={false}
                                  maxValue={100}
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
                                  name="petPrize1"
                                  type="text"
                                  readOnly={editValue[0] ? false : true}
                                />
                                <KErrorMessage name="petPrize1" />
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
                                  name="cargePrize1"
                                  type="text"
                                  readOnly={editValue[0] ? false : true}
                                />
                                <KErrorMessage name="cargePrize1" />
                              </div>
                              <div className="col-1 d-flex">
                                <button
                                  type="button"
                                  className="FarePackageSmallEditButton"
                                  onClick={() => {
                                    setEdit({ ...editValue, 0: true });
                                  }}
                                >
                                  <EditIcon />
                                </button>
                                {editValue[0] ? (
                                  <button
                                    type="button"
                                    className="FarePackageSmallSaveButton"
                                    onClick={() => {
                                      errors.cargePrize1
                                        ? toast.error("Incorrect Value", {
                                            position: "top-right",
                                          })
                                        : submitEach(values, 0);
                                      setEdit({ ...editValue, 0: false });
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
                              <div className="col-2 d-flex flex-column">
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
                                    textTransform: "capitalize",
                                    cursor: "not-allowed",
                                  }}
                                  className=""
                                  name="petSize2"
                                  type="text"
                                  readOnly
                                />
                                <KErrorMessage name="petSize2" />
                              </div>
                              <div className="col-3">
                                <InputRange
                                  step={1}
                                  formatLabel={(value) => value + "lbs"}
                                  draggableTrack={false}
                                  allowSameValues={false}
                                  maxValue={100}
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
                                  name="petPrize2"
                                  type="text"
                                  readOnly={editValue[1] ? false : true}
                                />
                                <KErrorMessage name="petPrize2" />
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
                                  name="cargePrize2"
                                  type="text"
                                  readOnly={editValue[1] ? false : true}
                                />
                                <KErrorMessage name="cargePrize2" />
                              </div>
                              <div className="col-1 d-flex">
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
                                      errors.cargePrize2
                                        ? toast.error("Incorrect Value", {
                                            position: "top-right",
                                          })
                                        : submitEach(values, 1);
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
                              <div className="col-2 d-flex flex-column">
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
                                    textTransform: "capitalize",
                                    cursor: "not-allowed",
                                  }}
                                  className=""
                                  name="petSize3"
                                  type="text"
                                  readOnly
                                />
                                <KErrorMessage name="petSize3" />
                              </div>
                              <div className="col-3">
                                <InputRange
                                  step={1}
                                  formatLabel={(value) => value + "lbs"}
                                  draggableTrack={false}
                                  allowSameValues={false}
                                  maxValue={100}
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
                                  name="petPrize3"
                                  type="text"
                                  readOnly={editValue[2] ? false : true}
                                />
                                <KErrorMessage name="petPrize3" />
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
                                  name="cargePrize3"
                                  type="text"
                                  readOnly={editValue[2] ? false : true}
                                />
                                <KErrorMessage name="cargePrize3" />
                              </div>

                              <div className="col-1 d-flex ">
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
                                      errors.cargePrize3
                                        ? toast.error("Incorrect Value", {
                                            position: "top-right",
                                          })
                                        : submitEach(values, 2);
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
                            <div className="row my-4 mx-1">
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
                                  Booking Fee(per mile):
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
                                  name="bookingFee"
                                  type="text"
                                />
                                <KErrorMessage name="bookingFee" />
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

                            <div className="row my-2">
                              <div className="col-6 d-flex flex-column">
                                <span
                                  style={{
                                    fontSize: "16px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  Driver Cancellation Fee:
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

export default FarePet;
