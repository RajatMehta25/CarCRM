import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Formik, Form, Field } from "formik";
import classNames from "classnames";
import axios from "../../axios";
import { toast } from "react-toastify";
import * as Yup from "yup";
import KErrorMessage from "./KErrorMessage";

// import Switch from '@mui/material/Switch';
// import { styled } from '@mui/material/styles';
// import Skeleton from "react-loading-skeleton";
// import "react-loading-skeleton/dist/skeleton.css";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Switch,
  styled,
  Tooltip,
} from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { Close } from "@material-ui/icons";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

// import { Delete } from '@material-ui/icons';
import VisibilityIcon from "@material-ui/icons/Visibility";
import BlockIcon from "@material-ui/icons/Block";
// import ArrowBackIcon from "@material-ui/icons/ArrowBack";

// For Table
import SearchBar from "material-ui-search-bar";
import { orderBy } from "lodash";

//history
import { useHistory } from "react-router-dom";
// import AddEditCategory from "../AccountManagement/Account_Details";

// import "./Sects_Management.css";
import EditIcon from "@material-ui/icons/Edit";
import { DeleteOutline, WidgetsOutlined } from "@material-ui/icons";
import { get } from "lodash";

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

const IOSSwitch = styled((props) => <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />)(
  ({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
    "& .MuiSwitch-switchBase": {
      padding: 0,
      margin: 2,
      transitionDuration: "300ms",
      "&.Mui-checked": {
        transform: "translateX(16px)",
        color: "#fff",
        "& + .MuiSwitch-track": {
          backgroundColor: theme.palette.mode === "dark" ? "#2ECA45" : "#65C466",
          opacity: 1,
          border: 0,
        },
        "&.Mui-disabled + .MuiSwitch-track": {
          opacity: 0.5,
        },
      },
      "&.Mui-focusVisible .MuiSwitch-thumb": {
        color: "#33cf4d",
        border: "6px solid #fff",
      },
      "&.Mui-disabled .MuiSwitch-thumb": {
        color: theme.palette.mode === "light" ? theme.palette.grey[100] : theme.palette.grey[600],
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
      },
    },
    "& .MuiSwitch-thumb": {
      boxSizing: "border-box",
      width: 22,
      height: 22,
    },
    "& .MuiSwitch-track": {
      borderRadius: 26 / 2,
      backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
      opacity: 1,
      transition: theme.transitions.create(["background-color"], {
        duration: 500,
      }),
    },
  })
);

export default function ViewDriver(props) {
  const classes = useStyles();
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
      if (ele.innerText === "Manage Driver") {
        return ele;
      }
    });
    newres[0].classList.add("activate");
    console.log(newres);
    console.log(result);
  };
  console.log(state);
  // const history=useHistory();

  const [tableData, setTableData] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [UserCategoryData, setUserCategoryData] = useState();

  // status switch
  // const [checked, setChecked] = useState(true);

  // For Pagination
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    // console.log(event);
    // console.log(newPage);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    // getCategoriesContent();
  }, []);

  //get content
  // const getCategoriesContent = async () => {
  //   try {
  //     const { data } = await axios.get("/admin/getSects");
  //     console.log(data);
  //     setTableData(data.data);
  //     setSearchedData(data.data);
  //     setIsLoading(false);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  // edit category itself

  // status switch

  const statusSwitch = async (e, id) => {
    try {
      console.log(id);

      const { data } = await axios.post("/admin/updatesect", {
        _id: id,
        is_active: e.target.checked,
      });
      // props.history.push({
      //     pathname: "/Category_Management",
      //   });
      // getCategoriesContent();
      toast.success(data.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      console.log(data);
    } catch (error) {
      console.log(error);
    }

    // console.log(e.target.checked);
    // console.log(checked);
    // console.log(id);
  };
  // useEffect(() => {
  //    window.localStorage.setItem('query',JSON.stringify([]))

  // }, [])

  // For Search
  const [searched, setSearched] = useState("");
  const [searchedData, setSearchedData] = useState([]);
  const [licenseCheck, setLicenseCheck] = useState(true); // change here to false
  const [vehicleCheck, setVehicleCheck] = useState(true); //change here to false
  const requestSearch = (searchedVal) => {
    console.log(searchedVal);

    const filteredRows = searchedData.filter((row) => {
      let name = row.sect_name;
      return name.toLowerCase().includes(searchedVal.toLowerCase());
    });
    setTableData(filteredRows);
  };

  const cancelSearch = () => {
    // getCategoriesContent();
    // setSearched("");
    //  console.log(searchedData);
    //  requestSearch()
  };
  useEffect(() => {
    CheckIncompleteDetails();
  }, []);

  const CheckIncompleteDetails = () => {
    if (state[0].serviceType == "62d53abebf652aa3778946cd") {
      setLicenseCheck(true);
      setVehicleCheck(true);
    } else {
      state[0].driver.drivingLicense.back.value && state[0].driver.drivingLicense.fornt.value
        ? setLicenseCheck(true)
        : setLicenseCheck(false);
      state[0]?.vehicle[0]?.vehicleName?.value &&
      state[0]?.vehicle[0]?.vehicleVIN?.value &&
      state[0]?.vehicle[0]?.model?.value &&
      state[0]?.vehicle[0]?.year?.value &&
      state[0]?.vehicle[0]?.color?.value &&
      state[0]?.vehicle[0]?.licenseNumber?.value &&
      state[0]?.vehicle[0]?.seatAvailability?.value
        ? setVehicleCheck(true)
        : setVehicleCheck(false);
    }
  };
  const approveDriver = async () => {
    console.log(state);
    if (licenseCheck && vehicleCheck) {
      try {
        const { data } = await axios.put(`/private/driverProfileApproved/${state[0]._id}`, {
          status: "approved",
        });

        toast.success(data.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
        props.history.goBack();
      } catch (error) {
        console.log(error);
      }
    } else {
      toast.error("Cannot Approve, Incomplete Details ", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };
  const validationSchema = Yup.object().shape({
    // VehicleNameCheck: Yup.boolean().required("Vehicle Name is required"),
    // vehicleVINCheck: Yup.boolean().required("Vehicle VIN is required"),
    // ModelCheck: Yup.boolean().required("Model is required"),
    // YearCheck: Yup.boolean().required("Year is required"),
    // ColorCheck: Yup.boolean().required("Color is required"),
    // LicensePlateCheck: Yup.boolean().required("License Plate is required"),
    // seatAvailabilityCheck: Yup.boolean().required(
    //   "Seat Availability is required"
    // ),

    VehicleName: Yup.string()
      .when("VehicleNameCheck", {
        is: true,
        then: Yup.string().required("Reason is required"),
      })
      .max(25, "Vehicle Name should be less than 25 characters"),
    vehicleVIN: Yup.string()
      .when("vehicleVINCheck", {
        is: true,
        then: Yup.string().required("Reason is required"),
      })
      .max(25, "Vehicle VIN should be less than 25 characters"),
    Model: Yup.string()
      .when("ModelCheck", {
        is: true,
        then: Yup.string().required("Reason is required"),
      })
      .max(25, "Model should be less than 25 characters"),
    Year: Yup.string()
      .when("YearCheck", {
        is: true,
        then: Yup.string().required("Reason is required"),
      })
      .max(25, "Year should be less than 25 characters"),
    Color: Yup.string()
      .when("ColorCheck", {
        is: true,
        then: Yup.string().required("Reason is required"),
      })
      .max(25, "Color should be less than 25 characters"),
    LicensePlate: Yup.string()
      .when("LicensePlateCheck", {
        is: true,
        then: Yup.string().required("Reason is required"),
      })
      .max(25, "License plate should be less than 25 characters"),
    seatAvailability: Yup.string()
      .when("seatAvailabilityCheck", {
        is: true,
        then: Yup.string().required("Reason is required"),
      })
      .max(25, "Seat Availability should be less than 25 characters"),
    CarInsuranceFront: Yup.string()
      .when("CarInsuranceFrontCheck", {
        is: true,
        then: Yup.string().required("Reason is required"),
      })
      .max(25, "Car Insurance Front should be less than 25 characters"),
    CarInsuranceBack: Yup.string()
      .when("CarInsuranceBackCheck", {
        is: true,
        then: Yup.string().required("Reason is required"),
      })
      .max(25, "Car Insurance Back should be less than 25 characters"),
    DrivingLicenseFront: Yup.string()
      .when("DrivingLicenseFrontCheck", {
        is: true,
        then: Yup.string().required("Reason is required"),
      })
      .max(25, "Driving License Front should be less than 25 characters"),
    DrivingLicenseBack: Yup.string()
      .when("DrivingLicenseBackCheck", {
        is: true,
        then: Yup.string().required("Reason is required"),
      })
      .max(25, "Driving License Back should be less than 25 characters"),
  });

  const valuesSubmit = async (values) => {
    if (licenseCheck && vehicleCheck) {
      try {
        const { data } = await axios.put(`/private/driverDisapproved/${state[0]._id}`, {
          vehicleName: {
            error: values.VehicleNameCheck,
            errorMessage: values.VehicleName,
          },
          vehicleVIN: {
            error: values.vehicleVINCheck,
            errorMessage: values.vehicleVIN,
          },
          model: {
            error: values.ModelCheck,
            errorMessage: values.Model,
          },
          year: {
            error: values.YearCheck,
            errorMessage: values.Year,
          },
          color: {
            error: values.ColorCheck,
            errorMessage: values.Color,
          },
          licenseNumber: {
            error: values.LicensePlateCheck,
            errorMessage: values.LicensePlate,
          },
          seatAvailability: {
            error: values.seatAvailabilityCheck,
            errorMessage: values.seatAvailability,
          },
          InsuranceImage: {
            fornt: {
              error: values.CarInsuranceFrontCheck,
              errorMessage: values.CarInsuranceFront,
            },
            back: {
              error: values.CarInsuranceBackCheck,
              errorMessage: values.CarInsuranceBack,
            },
          },
          drivingLicense: {
            fornt: {
              error: values.DrivingLicenseFrontCheck,
              errorMessage: values.DrivingLicenseFront,
            },
            back: {
              error: values.DrivingLicenseBackCheck,
              errorMessage: values.DrivingLicenseBack,
            },
          },
        });
        toast.success("Disapproved", {
          position: toast.POSITION.TOP_RIGHT,
        });
        props.history.goBack();
      } catch (error) {
        // toast.error("Check Field Values", { position: "top-right" });
        console.log(error);
      }
    } else {
    }
  };
  return (
    <React.Fragment>
      <div className="page-content">
        <div className={classes.root}>
          <Paper>
            <div className={classes.paperPaddingRightLeft}>
              <div className="py-4">
                <Paper elevation={0} className={classNames(classes.paperHeading, classes.headingAlignment)}>
                  <Button
                    variant="outlined"
                    aria-label="add"
                    className={classes.iconMargin}
                    onClick={() => {
                      // if (window.confirm("Leave without saving changes?")) {
                      // props.history.push({
                      //   pathname: "/adminPanel/Driver-management",
                      // });
                      props.history.push({
                        pathname: state[1].pathname,
                        state: state[1],
                      });
                      // }
                    }}
                  >
                    <ArrowBackIcon />
                  </Button>
                  <h3 style={{}}>View Details</h3>
                  {/* <SearchBar
                    // value={searched}
                    className="heightfix"
                    onChange={(searchVal) => requestSearch(searchVal)}
                    onCancelSearch={() => cancelSearch()}
                    placeholder="Search by Sects Name"
                  /> */}
                  {/* <Button
                    variant="contained"
                    className="buttoncss"
                    style={{ backgroundColor: "#0e3f37", color: "#fff" }}
                    onClick={() => {
                      props.history.push({
                        pathname: "/adminPanel/AddEditSects",
                      });
                    }}
                  >
                    {" "}
                    Add Sect 
                  </Button> */}
                  {state[0].status === "approved" || state[0].status === "disapproved" ? (
                    <div style={{ marginRight: 150 }}></div>
                  ) : (
                    <div>
                      <Button
                        variant="contained"
                        className="buttoncss mx-3"
                        style={{ backgroundColor: "#006FFF", color: "#fff" }}
                        onClick={() => {
                          // getCategoriesContent("disapproved");
                          approveDriver();
                        }}
                      >
                        {" "}
                        Approve
                      </Button>
                      <Button
                        variant="contained"
                        className="buttoncss mx-3"
                        style={{ backgroundColor: "#006FFF", color: "#fff" }}
                        onClick={() => {
                          // getCategoriesContent("pending");
                          licenseCheck && vehicleCheck
                            ? setOpen(true)
                            : toast.error("Cannot Disapprove, Incomplete Details ", {
                                position: toast.POSITION.TOP_RIGHT,
                              });
                        }}
                      >
                        {" "}
                        Disapprove
                      </Button>
                    </div>
                  )}
                  {/* <div>
                    <Button
                      variant="contained"
                      className="buttoncss mx-3"
                      style={{ backgroundColor: "#006FFF", color: "#fff" }}
                      onClick={() => {
                        // getCategoriesContent("disapproved");
                        approveDriver();
                      }}
                    >
                      {" "}
                      Approve
                    </Button>
                    <Button
                      variant="contained"
                      className="buttoncss mx-3"
                      style={{ backgroundColor: "#006FFF", color: "#fff" }}
                      onClick={() => {
                        // getCategoriesContent("pending");
                        setOpen(true);
                      }}
                    >
                      {" "}
                      Disapprove
                    </Button>
                  </div> */}
                </Paper>

                {/* //new design */}

                {/* <br /> */}

                {/* status end */}

                <Paper>
                  <Formik
                    // validationSchema={
                    //   !state ? validationSchema : validationSchema2
                    // }
                    initialValues={{
                      vehicleName: get(state[0].vehicle[0], "vehicleName.value", ""),
                      vehicleVIN: get(state[0].vehicle[0], "vehicleVIN.value", ""),
                      model: get(state[0].vehicle[0], "model.value", ""),
                      year: get(state[0].vehicle[0], "year.value", ""),
                      color: get(state[0].vehicle[0], "color.value", ""),
                      licenseNumber: get(state[0].vehicle[0], "licenseNumber.value", ""),
                      seatAvailability: get(state[0].vehicle[0], "seatAvailability.value", ""),
                    }}
                    onSubmit={(values) => {
                      console.log(values);
                      // if (state && state !== "undefined") {
                      //   EditCategory(values);
                      // } else {
                      //   addNewCategory(values);
                      // }
                    }}
                  >
                    {({ values, setFieldValue }) => (
                      <Form className="vw-50">
                        <div className="container">
                          {/* heading */}
                          {/* <div
                            className="row "
                            style={{
                              backgroundColor: "#006FFF",
                            }}
                          >
                            <h3 className="text-white p-1">Vehicle Details</h3>
                          </div> */}

                          {state[0].service_type === "Designated Driver" ? (
                            ""
                          ) : (
                            <div
                              className="row "
                              style={{
                                backgroundColor: "#006FFF",
                              }}
                            >
                              <h3 className="text-white p-1">Vehicle Details</h3>
                            </div>
                          )}
                          {/* body */}
                          {state[0].service_type === "Designated Driver" ? (
                            ""
                          ) : (
                            <div className="row my-3">
                              <div className="col-4">Vehicle Name :</div>
                              <div className="col-8">
                                <Field
                                  style={{
                                    width: "100%",
                                    height: "35px",
                                    borderRadius: "5px",
                                    border: "1px solid #c4c4c4",
                                    paddingInlineStart: 10,
                                  }}
                                  className=""
                                  name="vehicleName"
                                  type="text"
                                  readOnly
                                />
                              </div>
                            </div>
                          )}
                          {/* body2 */}
                          {state[0].service_type === "Designated Driver" ? (
                            ""
                          ) : (
                            <div className="row my-3">
                              <div className="col-4">Vehicle VIN :</div>
                              <div className="col-8">
                                <Field
                                  style={{
                                    width: "100%",
                                    height: "35px",
                                    borderRadius: "5px",
                                    border: "1px solid #c4c4c4",
                                    paddingInlineStart: 10,
                                  }}
                                  className=""
                                  name="vehicleVIN"
                                  type="text"
                                  readOnly
                                />
                              </div>
                            </div>
                          )}

                          {/* body3 */}
                          {state[0].service_type === "Designated Driver" ? (
                            ""
                          ) : (
                            <div className="row my-3">
                              <div className="col-4">Model :</div>
                              <div className="col-8">
                                <Field
                                  style={{
                                    width: "100%",
                                    height: "35px",
                                    borderRadius: "5px",
                                    border: "1px solid #c4c4c4",
                                    paddingInlineStart: 10,
                                  }}
                                  className=""
                                  name="model"
                                  type="text"
                                  readOnly
                                />
                              </div>
                            </div>
                          )}
                          {/* body4 */}
                          {state[0].service_type === "Designated Driver" ? (
                            ""
                          ) : (
                            <div className="row my-3">
                              <div className="col-4">Year :</div>
                              <div className="col-8">
                                <Field
                                  style={{
                                    width: "100%",
                                    height: "35px",
                                    borderRadius: "5px",
                                    border: "1px solid #c4c4c4",
                                    paddingInlineStart: 10,
                                  }}
                                  className=""
                                  name="year"
                                  type="text"
                                  readOnly
                                />
                              </div>
                            </div>
                          )}

                          {/* body5 */}
                          {state[0].service_type === "Designated Driver" ? (
                            ""
                          ) : (
                            <div className="row my-3">
                              <div className="col-4">Color :</div>
                              <div className="col-8">
                                <Field
                                  style={{
                                    width: "100%",
                                    height: "35px",
                                    borderRadius: "5px",
                                    border: "1px solid #c4c4c4",
                                    paddingInlineStart: 10,
                                  }}
                                  className=""
                                  name="color"
                                  type="text"
                                  readOnly
                                />
                              </div>
                            </div>
                          )}

                          {/* body6 */}
                          {state[0].service_type === "Designated Driver" ? (
                            ""
                          ) : (
                            <div className="row my-3">
                              <div className="col-4">License Plate :</div>
                              <div className="col-8">
                                <Field
                                  style={{
                                    width: "100%",
                                    height: "35px",
                                    borderRadius: "5px",
                                    border: "1px solid #c4c4c4",
                                    paddingInlineStart: 10,
                                  }}
                                  className=""
                                  name="licenseNumber"
                                  type="text"
                                  readOnly
                                />
                              </div>
                            </div>
                          )}

                          {/* body7 */}
                          {state[0].service_type === "Designated Driver" ? (
                            ""
                          ) : (
                            <div className="row my-3">
                              <div className="col-4">Seat Availability :</div>
                              <div className="col-8">
                                <Field
                                  style={{
                                    width: "100%",
                                    height: "35px",
                                    borderRadius: "5px",
                                    border: "1px solid #c4c4c4",
                                    paddingInlineStart: 10,
                                  }}
                                  className=""
                                  name="seatAvailability"
                                  type="text"
                                  readOnly
                                />
                              </div>
                            </div>
                          )}

                          {/* structure2 */}
                          <div
                            className="row"
                            style={{
                              backgroundColor: "#006FFF",
                            }}
                          >
                            <h3 className="text-white p-1">Documents</h3>
                          </div>
                          {/* body */}
                          <div className="row my-3">
                            <div className="col-4">Driving License :</div>
                            <div className="col-8">
                              <img
                                src={state[0]?.driver?.drivingLicense?.fornt?.value}
                                alt="front"
                                style={{
                                  width: "55px",
                                  height: "55px",
                                  borderRadius: "5px",
                                  // border: "1px solid #c4c4c4",
                                  // paddingInlineStart: 10,
                                  margin: "10px",
                                }}
                              />
                              <img
                                src={state[0]?.driver?.drivingLicense?.back?.value}
                                alt="front"
                                style={{
                                  width: "55px",
                                  height: "55px",
                                  borderRadius: "5px",
                                  // border: "1px solid #c4c4c4",
                                  // paddingInlineStart: 10,
                                  margin: "10px",
                                }}
                              />
                            </div>
                          </div>
                          {/* body2 */}
                          {state[0].service_type === "Designated Driver" ? (
                            ""
                          ) : (
                            <div className="row my-3">
                              <div className="col-4">Car Insurance :</div>
                              <div className="col-8">
                                <img
                                  src={state[0]?.vehicle[0]?.InsuranceImage?.fornt?.value}
                                  alt="front"
                                  style={{
                                    width: "55px",
                                    height: "55px",
                                    borderRadius: "5px",
                                    // border: "1px solid #c4c4c4",
                                    // paddingInlineStart: 10,
                                    margin: "10px",
                                  }}
                                />
                                <img
                                  src={state[0]?.vehicle[0]?.InsuranceImage?.back?.value}
                                  alt="front"
                                  style={{
                                    width: "55px",
                                    height: "55px",
                                    borderRadius: "5px",
                                    // border: "1px solid #c4c4c4",
                                    // paddingInlineStart: 10,
                                    margin: "10px",
                                  }}
                                />
                              </div>
                            </div>
                          )}
                          {/*  */}
                          {/* structure3 */}
                          {/* <div
                            className="row"
                            style={{
                              backgroundColor: "#006FFF",
                            }}
                          >
                            <h3 className="text-white p-1">Card Details</h3>
                          </div>
                          {/* body */}
                          {/* <div className="row my-3">
                            <div className="col-4">Account Holder Name :</div>
                            <div className="col-8">
                              <Field
                                style={{
                                  width: "100%",
                                  height: "35px",
                                  borderRadius: "5px",
                                  border: "1px solid #c4c4c4",
                                  paddingInlineStart: 10,
                                }}
                                className=""
                                name="password"
                                type="text"
                                readOnly
                              />
                            </div>
                          </div>{" "} */}

                          {/* body2 */}
                          {/* <div className="row my-3">
                            <div className="col-4">Card Number :</div>
                            <div className="col-8">
                              <Field
                                style={{
                                  width: "100%",
                                  height: "35px",
                                  borderRadius: "5px",
                                  border: "1px solid #c4c4c4",
                                  paddingInlineStart: 10,
                                }}
                                className=""
                                name="password"
                                type="text"
                                readOnly
                              />
                            </div>
                          </div> */}
                          {/* body3 */}
                          {/* <div className="row my-3">
                            <div className="col-4">Expiry Date :</div>
                            <div className="col-8">
                              <Field
                                style={{
                                  width: "100%",
                                  height: "35px",
                                  borderRadius: "5px",
                                  border: "1px solid #c4c4c4",
                                  paddingInlineStart: 10,
                                }}
                                className=""
                                name="password"
                                type="text"
                                readOnly
                              />
                            </div>
                          </div> */}
                          {/* body4 */}
                          {/* <div className="row my-3">
                            <div className="col-4">CVV :</div>
                            <div className="col-8">
                              <Field
                                style={{
                                  width: "100%",
                                  height: "35px",
                                  borderRadius: "5px",
                                  border: "1px solid #c4c4c4",
                                  paddingInlineStart: 10,
                                }}
                                className=""
                                name="password"
                                type="text"
                                readOnly
                              />
                            </div>
                          </div> */}
                        </div>
                      </Form>
                    )}
                  </Formik>
                  <br />
                </Paper>
              </div>
            </div>
          </Paper>
        </div>
        <Dialog
          open={open}
          // onClose={handleClose}

          fullWidth={true}
        >
          <DialogTitle
          // style={{ display: "flex", justifyContent: "center" }}
          >
            <h4 className="">Disapprove List</h4>
          </DialogTitle>
          <div style={{ display: "flex", justifyContent: "center" }}>
            {/* <img
              src={imageUrl}
              alt="..."
              style={{ width: "50px", height: "50px" }}
            /> */}
          </div>
          <Close
            onClick={() => setOpen(false)}
            style={{
              position: "absolute",
              right: "5",
              top: "5",
              cursor: "pointer",
              color: "white",
              backgroundColor: "red",
              borderRadius: "50%",
            }}
          />
          <DialogContent>
            {/* <DialogContentText > */}

            <div>
              <Formik
                validationSchema={validationSchema}
                initialValues={{
                  // email:"",
                  // name: get(editData[0], "calendar_name", ""),
                  VehicleNameCheck: false,
                  vehicleVINCheck: false,
                  ModelCheck: false,
                  YearCheck: false,
                  ColorCheck: false,
                  LicensePlateCheck: false,
                  seatAvailabilityCheck: false,
                  DrivingLicenseFrontCheck: false,
                  DrivingLicenseBackCheck: false,
                  CarInsuranceFrontCheck: false,
                  CarInsuranceBackCheck: false,
                  AccountHolderNameCheck: false,
                  CardNumberCheck: false,
                  ExpiryDateCheck: false,
                  CVVCheck: false,

                  VehicleName: "",
                  vehicleVIN: "",
                  Model: "",
                  Year: "",
                  Color: "",
                  LicensePlate: "",
                  seatAvailability: "",
                  DrivingLicenseFront: "",
                  DrivingLicenseBack: "",
                  CarInsuranceFront: "",
                  CarInsuranceBack: "",
                  AccountHolderName: "",
                  CardNumber: "",
                  ExpiryDate: "",
                  CVV: "",
                }}
                onSubmit={(values) => {
                  valuesSubmit(values);

                  //   }
                }}
              >
                {({ values, setFieldValue }) => (
                  <Form>
                    <br />
                    <div className="container">
                      <div className="row">
                        <h5>Vehicle Details</h5>
                      </div>
                      <div className="row">
                        {" "}
                        <div className="col-4 d-flex align-items-center">
                          <Field
                            className=""
                            name="VehicleNameCheck"
                            // variant="outlined"
                            type="checkbox"
                            // inputProps={{name: "name"}}
                            autoComplete="off"
                            style={{
                              width: 34,
                              height: 15,
                              borderRadius: 5,
                              borderColor: "#d3d3d3",
                              borderStyle: "solid",
                              borderWidth: 1,
                              // backgroundColor: "#006FFF",
                              // paddingInlineStart: 10,
                            }}
                          />
                          &nbsp;
                          <div className="" style={{}}>
                            Vehicle Name : &nbsp;
                          </div>
                        </div>
                        <div className="col-4">
                          <Field
                            className=""
                            name="VehicleName"
                            // variant="outlined"
                            type="text"
                            // inputProps={{name: "name"}}
                            autoComplete="off"
                            style={{
                              width: 300,
                              height: 35,
                              borderRadius: 5,
                              borderColor: "#d3d3d3",
                              borderStyle: "solid",
                              borderWidth: 1,
                              paddingInlineStart: 10,
                            }}
                          />
                          <KErrorMessage name="VehicleName" />
                        </div>
                      </div>
                      <br />
                      <div className="row">
                        {" "}
                        <div className="col-4 d-flex align-items-center">
                          <Field
                            className=""
                            name="vehicleVINCheck"
                            // variant="outlined"
                            type="checkbox"
                            // inputProps={{name: "name"}}
                            autoComplete="off"
                            style={{
                              width: 34,
                              height: 15,
                              borderRadius: 5,
                              borderColor: "#d3d3d3",
                              borderStyle: "solid",
                              borderWidth: 1,
                              // backgroundColor: "#006FFF",
                              // paddingInlineStart: 10,
                            }}
                          />
                          &nbsp;
                          <div className="" style={{}}>
                            Vehicle VIN : &nbsp;
                          </div>
                        </div>
                        <div className="col-4">
                          <Field
                            className=""
                            name="vehicleVIN"
                            // variant="outlined"
                            type="text"
                            // inputProps={{name: "name"}}
                            autoComplete="off"
                            style={{
                              width: 300,
                              height: 35,
                              borderRadius: 5,
                              borderColor: "#d3d3d3",
                              borderStyle: "solid",
                              borderWidth: 1,
                              paddingInlineStart: 10,
                            }}
                          />

                          <KErrorMessage name="vehicleVIN" />
                        </div>
                      </div>
                      <br />
                      <div className="row">
                        {" "}
                        <div className="col-4 d-flex align-items-center">
                          <Field
                            className=""
                            name="ModelCheck"
                            // variant="outlined"
                            type="checkbox"
                            // inputProps={{name: "name"}}
                            autoComplete="off"
                            style={{
                              width: 34,
                              height: 15,
                              borderRadius: 5,
                              borderColor: "#d3d3d3",
                              borderStyle: "solid",
                              borderWidth: 1,
                              // backgroundColor: "#006FFF",
                              // paddingInlineStart: 10,
                            }}
                          />
                          &nbsp;
                          <div className="" style={{}}>
                            Model : &nbsp;
                          </div>
                        </div>
                        <div className="col-4">
                          <Field
                            className=""
                            name="Model"
                            // variant="outlined"
                            type="text"
                            // inputProps={{name: "name"}}
                            autoComplete="off"
                            style={{
                              width: 300,
                              height: 35,
                              borderRadius: 5,
                              borderColor: "#d3d3d3",
                              borderStyle: "solid",
                              borderWidth: 1,
                              paddingInlineStart: 10,
                            }}
                          />
                          <KErrorMessage name="Model" />
                        </div>
                      </div>
                      <br />
                      <div className="row">
                        {" "}
                        <div className="col-4 d-flex align-items-center">
                          <Field
                            className=""
                            name="YearCheck"
                            // variant="outlined"
                            type="checkbox"
                            // inputProps={{name: "name"}}
                            autoComplete="off"
                            style={{
                              width: 34,
                              height: 15,
                              borderRadius: 5,
                              borderColor: "#d3d3d3",
                              borderStyle: "solid",
                              borderWidth: 1,
                              // backgroundColor: "#006FFF",
                              // paddingInlineStart: 10,
                            }}
                          />
                          &nbsp;
                          <div className="" style={{}}>
                            Year : &nbsp;
                          </div>
                        </div>
                        <div className="col-4">
                          <Field
                            className=""
                            name="Year"
                            // variant="outlined"
                            type="text"
                            // inputProps={{name: "name"}}
                            autoComplete="off"
                            style={{
                              width: 300,
                              height: 35,
                              borderRadius: 5,
                              borderColor: "#d3d3d3",
                              borderStyle: "solid",
                              borderWidth: 1,
                              paddingInlineStart: 10,
                            }}
                          />
                          <KErrorMessage name="Year" />
                        </div>
                      </div>
                      <br />
                      <div className="row">
                        {" "}
                        <div className="col-4 d-flex align-items-center">
                          <Field
                            className=""
                            name="ColorCheck"
                            // variant="outlined"
                            type="checkbox"
                            // inputProps={{name: "name"}}
                            autoComplete="off"
                            style={{
                              width: 34,
                              height: 15,
                              borderRadius: 5,
                              borderColor: "#d3d3d3",
                              borderStyle: "solid",
                              borderWidth: 1,
                              // backgroundColor: "#006FFF",
                              // paddingInlineStart: 10,
                            }}
                          />
                          &nbsp;
                          <div className="" style={{}}>
                            Color : &nbsp;
                          </div>
                        </div>
                        <div className="col-4">
                          <Field
                            className=""
                            name="Color"
                            // variant="outlined"
                            type="text"
                            // inputProps={{name: "name"}}
                            autoComplete="off"
                            style={{
                              width: 300,
                              height: 35,
                              borderRadius: 5,
                              borderColor: "#d3d3d3",
                              borderStyle: "solid",
                              borderWidth: 1,
                              paddingInlineStart: 10,
                            }}
                          />
                          <KErrorMessage name="Color" />
                        </div>
                      </div>
                      <br />
                      <div className="row">
                        {" "}
                        <div className="col-4 d-flex align-items-center">
                          <Field
                            className=""
                            name="LicensePlateCheck"
                            // variant="outlined"
                            type="checkbox"
                            // inputProps={{name: "name"}}
                            autoComplete="off"
                            style={{
                              width: 34,
                              height: 15,
                              borderRadius: 5,
                              borderColor: "#d3d3d3",
                              borderStyle: "solid",
                              borderWidth: 1,
                              // backgroundColor: "#006FFF",
                              // paddingInlineStart: 10,
                            }}
                          />
                          &nbsp;
                          <div className="" style={{}}>
                            License Plate : &nbsp;
                          </div>
                        </div>
                        <div className="col-4">
                          <Field
                            className=""
                            name="LicensePlate"
                            // variant="outlined"
                            type="text"
                            // inputProps={{name: "name"}}
                            autoComplete="off"
                            style={{
                              width: 300,
                              height: 35,
                              borderRadius: 5,
                              borderColor: "#d3d3d3",
                              borderStyle: "solid",
                              borderWidth: 1,
                              paddingInlineStart: 10,
                            }}
                          />
                          <KErrorMessage name="LicensePlate" />
                        </div>
                      </div>
                      <br />
                      <div className="row">
                        {" "}
                        <div className="col-4 d-flex align-items-center">
                          <Field
                            className=""
                            name="seatAvailabilityCheck"
                            // variant="outlined"
                            type="checkbox"
                            // inputProps={{name: "name"}}
                            autoComplete="off"
                            style={{
                              width: 34,
                              height: 15,
                              borderRadius: 5,
                              borderColor: "#d3d3d3",
                              borderStyle: "solid",
                              borderWidth: 1,
                              // backgroundColor: "#006FFF",
                              // paddingInlineStart: 10,
                            }}
                          />
                          &nbsp;
                          <div className="" style={{}}>
                            Seat Availability : &nbsp;
                          </div>
                        </div>
                        <div className="col-4">
                          <Field
                            className=""
                            name="seatAvailability"
                            // variant="outlined"
                            type="text"
                            // inputProps={{name: "name"}}
                            autoComplete="off"
                            style={{
                              width: 300,
                              height: 35,
                              borderRadius: 5,
                              borderColor: "#d3d3d3",
                              borderStyle: "solid",
                              borderWidth: 1,
                              paddingInlineStart: 10,
                            }}
                          />
                          <KErrorMessage name="seatAvailability" />
                        </div>
                      </div>

                      <br />
                      <div className="row">
                        <h5>Documents</h5>
                      </div>
                      <div className="row">
                        {" "}
                        <div className="col-4 d-flex align-items-center">
                          <Field
                            className=""
                            name="DrivingLicenseFrontCheck"
                            // variant="outlined"
                            type="checkbox"
                            // inputProps={{name: "name"}}
                            autoComplete="off"
                            style={{
                              width: 34,
                              height: 15,
                              borderRadius: 5,
                              borderColor: "#d3d3d3",
                              borderStyle: "solid",
                              borderWidth: 1,
                              // backgroundColor: "#006FFF",
                              // paddingInlineStart: 10,
                            }}
                          />
                          &nbsp;
                          <div className="" style={{}}>
                            License Front: &nbsp;
                          </div>
                        </div>
                        <div className="col-4">
                          <Field
                            className=""
                            name="DrivingLicenseFront"
                            // variant="outlined"
                            type="text"
                            // inputProps={{name: "name"}}
                            autoComplete="off"
                            style={{
                              width: 300,
                              height: 35,
                              borderRadius: 5,
                              borderColor: "#d3d3d3",
                              borderStyle: "solid",
                              borderWidth: 1,
                              paddingInlineStart: 10,
                            }}
                          />
                          <KErrorMessage name="DrivingLicenseFront" />
                        </div>
                      </div>
                      <br />
                      <div className="row">
                        {" "}
                        <div className="col-4 d-flex align-items-center">
                          <Field
                            className=""
                            name="DrivingLicenseBackCheck"
                            // variant="outlined"
                            type="checkbox"
                            // inputProps={{name: "name"}}
                            autoComplete="off"
                            style={{
                              width: 34,
                              height: 15,
                              borderRadius: 5,
                              borderColor: "#d3d3d3",
                              borderStyle: "solid",
                              borderWidth: 1,
                              // backgroundColor: "#006FFF",
                              // paddingInlineStart: 10,
                            }}
                          />
                          &nbsp;
                          <div className="" style={{}}>
                            License Back: &nbsp;
                          </div>
                        </div>
                        <div className="col-4">
                          <Field
                            className=""
                            name="DrivingLicenseBack"
                            // variant="outlined"
                            type="text"
                            // inputProps={{name: "name"}}
                            autoComplete="off"
                            style={{
                              width: 300,
                              height: 35,
                              borderRadius: 5,
                              borderColor: "#d3d3d3",
                              borderStyle: "solid",
                              borderWidth: 1,
                              paddingInlineStart: 10,
                            }}
                          />
                          <KErrorMessage name="DrivingLicenseBack" />
                        </div>
                      </div>
                      <br />
                      <div className="row">
                        {" "}
                        <div className="col-4 d-flex align-items-center">
                          <Field
                            className=""
                            name="CarInsuranceFrontCheck"
                            // variant="outlined"
                            type="checkbox"
                            // inputProps={{name: "name"}}
                            autoComplete="off"
                            style={{
                              width: 34,
                              height: 15,
                              borderRadius: 5,
                              borderColor: "#d3d3d3",
                              borderStyle: "solid",
                              borderWidth: 1,
                              // backgroundColor: "#006FFF",
                              // paddingInlineStart: 10,
                            }}
                          />
                          &nbsp;
                          <div className="" style={{}}>
                            Insurance Front : &nbsp;
                          </div>
                        </div>
                        <div className="col-4">
                          <Field
                            className=""
                            name="CarInsuranceFront"
                            // variant="outlined"
                            type="text"
                            // inputProps={{name: "name"}}
                            autoComplete="off"
                            style={{
                              width: 300,
                              height: 35,
                              borderRadius: 5,
                              borderColor: "#d3d3d3",
                              borderStyle: "solid",
                              borderWidth: 1,
                              paddingInlineStart: 10,
                            }}
                          />
                          <KErrorMessage name="CarInsuranceFront" />
                        </div>
                      </div>
                      <br />
                      <div className="row">
                        {" "}
                        <div className="col-4 d-flex align-items-center">
                          <Field
                            className=""
                            name="CarInsuranceBackCheck"
                            // variant="outlined"
                            type="checkbox"
                            // inputProps={{name: "name"}}
                            autoComplete="off"
                            style={{
                              width: 34,
                              height: 15,
                              borderRadius: 5,
                              borderColor: "#d3d3d3",
                              borderStyle: "solid",
                              borderWidth: 1,
                              // backgroundColor: "#006FFF",
                              // paddingInlineStart: 10,
                            }}
                          />
                          &nbsp;
                          <div className="" style={{}}>
                            Insurance Back : &nbsp;
                          </div>
                        </div>
                        <div className="col-4">
                          <Field
                            className=""
                            name="CarInsuranceBack"
                            // variant="outlined"
                            type="text"
                            // inputProps={{name: "name"}}
                            autoComplete="off"
                            style={{
                              width: 300,
                              height: 35,
                              borderRadius: 5,
                              borderColor: "#d3d3d3",
                              borderStyle: "solid",
                              borderWidth: 1,
                              paddingInlineStart: 10,
                            }}
                          />
                          <KErrorMessage name="CarInsuranceBack" />
                        </div>
                      </div>
                      <br />
                      {/* <div className="row">
                        <h5>Card Details</h5>
                      </div> */}
                      {/* <div className="row">
                        {" "}
                        <div className="col-4 d-flex align-items-center">
                          <Field
                            className=""
                            name="AccountHolderNameCheck"
                            // variant="outlined"
                            type="checkbox"
                            // inputProps={{name: "name"}}
                            autoComplete="off"
                            style={{
                              width: 15,
                              height: 15,
                              borderRadius: 5,
                              borderColor: "#d3d3d3",
                              borderStyle: "solid",
                              borderWidth: 1,
                              // backgroundColor: "#006FFF",
                              // paddingInlineStart: 10,
                            }}
                          />
                          &nbsp;
                          <div className="" style={{}}>
                            A/c Holder Name : &nbsp;
                          </div>
                        </div>
                        <div className="col-4">
                          <Field
                            className=""
                            name="AccountHolderName"
                            // variant="outlined"
                            type="text"
                            // inputProps={{name: "name"}}
                            autoComplete="off"
                            style={{
                              width: 300,
                              height: 35,
                              borderRadius: 5,
                              borderColor: "#d3d3d3",
                              borderStyle: "solid",
                              borderWidth: 1,
                              paddingInlineStart: 10,
                            }}
                          />
                          <KErrorMessage name="AccountHolderName" />
                        </div>
                      </div>
                      <br />
                      <div className="row">
                        {" "}
                        <div className="col-4 d-flex align-items-center">
                          <Field
                            className=""
                            name="CardNumberCheck"
                            // variant="outlined"
                            type="checkbox"
                            // inputProps={{name: "name"}}
                            autoComplete="off"
                            style={{
                              width: 15,
                              height: 15,
                              borderRadius: 5,
                              borderColor: "#d3d3d3",
                              borderStyle: "solid",
                              borderWidth: 1,
                              // backgroundColor: "#006FFF",
                              // paddingInlineStart: 10,
                            }}
                          />
                          &nbsp;
                          <div className="" style={{}}>
                            Card Number : &nbsp;
                          </div>
                        </div>
                        <div className="col-4">
                          <Field
                            className=""
                            name="CardNumber"
                            // variant="outlined"
                            type="text"
                            // inputProps={{name: "name"}}
                            autoComplete="off"
                            style={{
                              width: 300,
                              height: 35,
                              borderRadius: 5,
                              borderColor: "#d3d3d3",
                              borderStyle: "solid",
                              borderWidth: 1,
                              paddingInlineStart: 10,
                            }}
                          />
                          <KErrorMessage name="CardNumber" />
                        </div>
                      </div>
                      <br />

                      <div className="row">
                        {" "}
                        <div className="col-4 d-flex align-items-center">
                          <Field
                            className=""
                            name="ExpiryDateCheck"
                            // variant="outlined"
                            type="checkbox"
                            // inputProps={{name: "name"}}
                            autoComplete="off"
                            style={{
                              width: 15,
                              height: 15,
                              borderRadius: 5,
                              borderColor: "#d3d3d3",
                              borderStyle: "solid",
                              borderWidth: 1,
                              // backgroundColor: "#006FFF",
                              // paddingInlineStart: 10,
                            }}
                          />
                          &nbsp;
                          <div className="" style={{}}>
                            Expiry Date : &nbsp;
                          </div>
                        </div>
                        <div className="col-4">
                          <Field
                            className=""
                            name="ExpiryDate"
                            // variant="outlined"
                            type="text"
                            // inputProps={{name: "name"}}
                            autoComplete="off"
                            style={{
                              width: 300,
                              height: 35,
                              borderRadius: 5,
                              borderColor: "#d3d3d3",
                              borderStyle: "solid",
                              borderWidth: 1,
                              paddingInlineStart: 10,
                            }}
                          />
                          <KErrorMessage name="ExpiryDate" />
                        </div>
                      </div>
                      <br />
                      <div className="row">
                        {" "}
                        <div className="col-4 d-flex align-items-center">
                          <Field
                            className=""
                            name="CVVCheck"
                            // variant="outlined"
                            type="checkbox"
                            // inputProps={{name: "name"}}
                            autoComplete="off"
                            style={{
                              width: 15,
                              height: 15,
                              borderRadius: 5,
                              borderColor: "#d3d3d3",
                              borderStyle: "solid",
                              borderWidth: 1,
                              // backgroundColor: "#006FFF",
                              // paddingInlineStart: 10,
                            }}
                          />
                          &nbsp;
                          <div className="" style={{}}>
                            CVV : &nbsp;
                          </div>
                        </div>
                        <div className="col-4">
                          <Field
                            className=""
                            name="CVV"
                            // variant="outlined"
                            type="text"
                            // inputProps={{name: "name"}}
                            autoComplete="off"
                            style={{
                              width: 300,
                              height: 35,
                              borderRadius: 5,
                              borderColor: "#d3d3d3",
                              borderStyle: "solid",
                              borderWidth: 1,
                              paddingInlineStart: 10,
                            }}
                          />
                          <KErrorMessage name="CVV" />
                        </div>
                      </div> */}
                      <br />
                      <br />
                      <div className="text-center">
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
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
            {/* </DialogContentText> */}
          </DialogContent>
        </Dialog>
      </div>
    </React.Fragment>
  );
}
