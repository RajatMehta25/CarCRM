import React, { useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import axios from "../../axios";
import { toast } from "react-toastify";
import moment from "moment";
// import Switch from '@mui/material/Switch';
// import { styled } from '@mui/material/styles';
// import Skeleton from 'react-loading-skeleton'
// import 'react-loading-skeleton/dist/skeleton.css'
import { Close, Receipt, Search } from "@material-ui/icons";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ReactPaginate from "react-paginate";
import { getDateFormat } from "../../helpers/helperFunction";
// import { RiFileDownloadFill } from "react-icons/ri";
import "remixicon/fonts/remixicon.css";
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
  Select,
} from "@material-ui/core";
import DatePicker from "react-date-picker";
import Swal from "sweetalert2";
import { confirm } from "react-confirm-box";

// import { Delete } from '@material-ui/icons';
import VisibilityIcon from "@material-ui/icons/Visibility";
import BlockIcon from "@material-ui/icons/Block";

// For Table
import SearchBar from "material-ui-search-bar";
import { get, identity, sortBy } from "lodash";

//history
import { useHistory } from "react-router-dom";
// import AddEditCategory from "../AccountManagement/Account_Details";

// import './Category_Management.css' ;
import EditIcon from "@material-ui/icons/Edit";
import { DeleteOutline, WidgetsOutlined } from "@material-ui/icons";
import ModalVideo from "react-modal-video";
// import 'node_modules/react-modal-video/scss/modal-video.scss';
import VideocamIcon from "@material-ui/icons/Videocam";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Formik, Field, Form } from "formik";
import RSelect from "react-select";
// import "./Booking_Management.css";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import DateTimePicker from "react-datetime-picker";
import Cards from "react-credit-cards";
import "react-credit-cards/es/styles-compiled.css";

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
    backgroundColor: "#0294b3 !important",
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

const Android12Switch = styled(Switch)(({ theme }) => ({
  padding: 8,
  "& .MuiSwitch-track": {
    borderRadius: 22 / 2,
    "&:before, &:after": {
      content: '""',
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      width: 16,
      height: 16,
    },
    "&:before": {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main)
      )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
      left: 12,
    },
    "&:after": {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main)
      )}" d="M19,13H5V11H19V13Z" /></svg>')`,
      right: 12,
    },
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "none",
    width: 16,
    height: 16,
    margin: 2,
  },
}));

export default function BookingDetails(props) {
  const classes = useStyles();

  // const history=useHistory();
  const {
    location: { state },
    history,
  } = props;
  console.log(state);
  const [tableData, setTableData] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [PaginationData, setPaginationData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [statusString, setStatusString] = useState("");
  const [changeID, setChangeID] = useState("");
  const [rselKey, setRselKey] = useState(0);
  const [initialDate, setInitialDate] = useState(null);
  const [timeLine, setTimeLine] = useState("");
  const [timeLineReset, setTimeLineReset] = useState("");
  const downloadRef = useRef(null);
  // status switch
  // const [checked, setChecked] = useState(true);

  // For Pagination
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  // useEffect(() => {
  //   getCategoriesContent();
  // }, []);

  //get content
  const [pagenumber, setPageNumber] = useState(1);
  const [totalUserListCount, settotalUserListCount] = useState(90);
  const [limit, setLimit] = useState(10);
  const [Incomplete, setIncomplete] = useState(true);
  const [search, setSearch] = useState("");
  const [displayData, setDisplayData] = useState([]);
  // const getCategoriesContent = async (
  //   page = 1,
  //   limit = 10,
  //   Incomplete = true,
  //   search = "",
  //   status = "ongoing",
  //   serviceType = "",
  //   start_date = "",
  //   end_date = ""
  // ) => {
  //   try {
  //     const { data } = await axios.get(``);
  //     console.log(data);
  //     setDisplayData(data.data);
  //     setTableData([...data.docs]);
  //     setSearchedData(data.docs);
  //     settotalUserListCount(data.totalDocs);
  //     setIncomplete(Incomplete);
  //     setSearch(search);
  //     // setPaginationData(data.data);
  //     // setIsLoading(false);
  //     if (data.docs.length === 0 || data.status === 500) {
  //       toast.error("No Data Found", {
  //         position: toast.POSITION.TOP_RIGHT,
  //       });
  //     } else {
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  console.log(tableData);
  // edit user

  const EditUser = (category) => {
    props.history.push({
      pathname: "/adminPanel/AddEditUser",
      state: category,
    });
  };

  // useEffect(() => {
  //    window.localStorage.setItem('query',JSON.stringify([]))

  // }, [])

  // For Search
  const [searched, setSearched] = useState("");
  const [searchedData, setSearchedData] = useState([]);
  const [UserCategoryData, setUserCategoryData] = useState();
  const [ColoredButton, setColoredButton] = useState({
    taxiSingle: true,
    designatedDriver: false,
    petService: false,
    packageService: false,
  });
  const [ColoredSubButton, setColoredSubButton] = useState({
    Ongoing: true,
    Completed: false,
    Cancelled: false,
  });

  const cancelSearch = () => {
    // getCategoriesContent(page, limit, Incomplete, "", statusString, changeID, start, end);
    // setSearched("");
    //  console.log(searchedData);
    //  requestSearch()
  };

  useEffect(() => {
    // getCategoriesContent(page, rowsPerPage, Incomplete, search, "ongoing", "");
  }, []);

  const SearchUser = async (search) => {
    // getCategoriesContent(page, rowsPerPage, Incomplete, search, statusString, changeID, start, end);
  };

  const AllModules = ["Single Taxi", "Designated Driver", "Pet Service", "Package Service"];
  const SubModules = ["Ongoing", "Completed", "Cancelled"];

  return (
    <React.Fragment>
      <div className="page-content">
        <div className={classes.root}>
          <Paper>
            <div className={classes.paperPaddingRightLeft}>
              <div className="py-3">
                <Paper elevation={0} className={classNames(classes.paperHeading, classes.headingAlignment)}>
                  <div className="d-flex align-items-center">
                    <Button
                      variant="outlined"
                      aria-label="add"
                      className={classes.iconMargin}
                      onClick={() => {
                        // props.history.goBack();
                        props.history.push({
                          pathname: "/adminPanel/Booking_Management",
                          state: state[1],
                        });
                      }}
                    >
                      <ArrowBackIcon />
                    </Button>
                    <h3 style={{}}>View Details</h3>
                  </div>
                  <a
                    ref={downloadRef}
                    download="Receipt"
                    target="blank"
                    href={state[0]?.payment_receipt_url}
                    style={{ visibility: "hidden" }}
                  ></a>
                  <Tooltip title="Download Receipt" arrow>
                    <Button
                      onClick={() => {
                        console.log(downloadRef.current.click());
                      }}
                    >
                      <i class="ri-file-download-fill" style={{ fontSize: "35px" }}></i>
                    </Button>
                  </Tooltip>
                </Paper>

                {/* //new design */}

                {/* <br /> */}

                {/* status end */}

                <Paper elevation={0}>
                  {
                    // sortBy(displayData, "Date_of_inspection")
                    state[0]
                      // .reverse()
                      .map((forms, index) => (
                        // <Accordion key={index}>
                        //   <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                        //     <Typography className={classes.heading}>{`Inspection Form ${index + 1} , Dated:${new Date(
                        //       get(forms, "Date_of_inspection", "")
                        //     ).toLocaleDateString()}`}</Typography>
                        //     &emsp;
                        //   </AccordionSummary>
                        //   <AccordionDetails style={{ justifyContent: "center" }}>

                        // <Paper
                        //   style={{
                        //     display: "flex",
                        //     alignItems: "center",
                        //     flexDirection: "column",
                        //   }}
                        // >
                        <div>
                          <Formik
                            // validationSchema={validationSchema}
                            initialValues={{
                              make_model_inspected: get(forms, "make_model_inspected", ""),
                              bookingId: get(forms, "bookingId", ""),
                              pickUpTime: get(forms, "pickUpTime", ""),
                              dropTime: new Date(get(forms, "dropTime", "")),
                              pickUpPlace: get(forms, "pickUpPlace", ""),
                              dropPlace: String(get(forms, "dropPlace", "")),
                              // forms.userMultipleWayPoint.map((dropLocations, i) => {
                              //   dropLocations.wayPlace
                              // }):,
                              distance: get(forms, "distance", ""),
                              amount: get(forms, "price", ""),
                              driverId: get(forms, "driver._id", ""),
                              driverName:
                                forms?.driver?.firstName.charAt(0).toUpperCase() +
                                forms?.driver?.firstName.slice(1) +
                                " " +
                                forms?.driver?.lastName,
                              userId: get(forms, "user._id", ""),
                              userName:
                                forms?.user?.firstName.charAt(0).toUpperCase() +
                                forms?.user?.firstName.slice(1) +
                                " " +
                                forms?.user?.lastName,
                              vehicleName: get(forms, "driver.vehicle_details.vehicleName", ""),
                              vehicleVIN: get(forms, "driver.vehicle_details.vehicleVIN", ""),
                              color: get(forms, "driver.vehicle_details.color", ""),

                              model: get(forms, "driver.vehicle_details.model", ""),
                              seatAvailability: get(forms, "driver.vehicle_details.seatAvailability", ""),
                              AccountHolderName: get(forms, "", ""),
                              cardNumber: get(
                                forms,
                                "balance_transactions[0].charges.data[0].payment_method_details.card.last4",
                                ""
                              ),
                              expiryDate:
                                get(
                                  forms,
                                  "balance_transactions[0].charges.data[0].payment_method_details.card.exp_month",
                                  ""
                                ) +
                                "," +
                                get(forms, "balance_transactions[0].charges.data[0].payment_method_details.card.exp_year", ""),
                              CVV: get(forms, "first_aid_kit_comment", ""),
                              promocodeDiscount: get(forms, "discount", ""),
                              lookable_cupboards_comment: get(forms, "lookable_cupboards_comment", ""),
                              real_view_mirror: String(get(forms, "real_view_mirror", "")),
                              real_view_mirror_comment: get(forms, "real_view_mirror_comment", ""),
                              seat_adjustment: String(get(forms, "seat_adjustment", "")),
                              seat_adjustment_comment: get(forms, "seat_adjustment_comment", ""),
                              seat_bealt: String(get(forms, "seat_bealt", "")),
                              seat_bealt_comment: get(forms, "seat_bealt_comment", ""),
                              stretcher: String(get(forms, "stretcher", "")),
                              stretcher_comment: get(forms, "stretcher_comment", ""),
                              wheelchair: String(get(forms, "wheelchair", "")),
                              wheelchair_comment: get(forms, "wheelchair_comment", ""),

                              brake_fluid: String(get(forms, "brake_fluid", "")),
                              brake_fluid_comment: get(forms, "brake_fluid_comment", ""),
                              clutch_fluid: String(get(forms, "clutch_fluid", "")),
                              clutch_fluid_comment: get(forms, "clutch_fluid_comment", ""),
                              coolant_level: String(get(forms, "coolant_level", "")),
                              coolant_level_comment: get(forms, "coolant_level_comment", ""),
                              oil_level: String(get(forms, "oil_level", "")),
                              oil_level_comment: get(forms, "oil_level_comment", ""),
                              power_steering_fluid: String(get(forms, "power_steering_fluid", "")),
                              power_steering_fluid_comment: get(forms, "power_steering_fluid_comment", ""),
                              washer_fluid_level: String(get(forms, "washer_fluid_level", "")),
                              washer_fluid_level_comment: get(forms, "washer_fluid_level_comment", ""),

                              all_light: String(get(forms, "all_light", "")),
                              all_light_comment: get(forms, "all_light_comment", ""),
                              broke: String(get(forms, "broke", "")),
                              broke_comment: get(forms, "broke_comment", ""),
                              condition_vehicle: String(get(forms, "condition_vehicle", "")),
                              description: get(forms, "description", ""),
                              fuel_level: String(get(forms, "fuel_level", "")),
                              fuel_level_comment: get(forms, "fuel_level_comment", ""),
                              horn: String(get(forms, "horn", "")),
                              horn_comment: get(forms, "horn_comment", ""),
                              ramp_toll_kit: String(get(forms, "ramp_toll_kit", "")),
                              ramp_toll_kit_comment: get(forms, "ramp_toll_kit_comment", ""),
                              steering: String(get(forms, "steering", "")),
                              steering_comment: get(forms, "steering_comment", ""),
                              whipper_washer: String(get(forms, "whipper_washer", "")),
                              whipper_washer_comment: get(forms, "whipper_washer_comment", ""),

                              name: get(forms.sign_off, "name", ""),
                              signature: get(forms.sign_off, "signature", ""),
                              date: get(forms, "date", ""),
                            }}
                            onSubmit={(values) => {
                              console.log(values);
                            }}
                          >
                            {({ values, setFieldValue }) => (
                              <Form style={{}}>
                                {/* Bootstrap */}
                                <div className="container-fluid ">
                                  {/* section 1 */}
                                  {/* row 1 */}
                                  <div className="row my-3">
                                    <div className="col-12 ">
                                      <div
                                        style={{
                                          backgroundColor: "#2765B3",
                                          borderRadius: "2px",
                                        }}
                                      >
                                        {" "}
                                        <h4 className="text-white p-1">Booking Details:</h4>
                                      </div>
                                    </div>
                                  </div>
                                  {/* row 2 */}
                                  <div className="row my-3">
                                    <div className="col-4">
                                      <h6>User Name :</h6>
                                    </div>
                                    <div className="col-8">
                                      <Field
                                        type="text"
                                        readOnly
                                        name="userName"
                                        style={{
                                          width: "100%",
                                          height: "35px",
                                          borderRadius: "5px",
                                          border: "1px solid #c4c4c4",
                                          paddingInlineStart: 10,
                                        }}
                                      />
                                    </div>
                                  </div>
                                  <div className="row my-3">
                                    <div className="col-4">
                                      {" "}
                                      <h6>Date & Time :</h6>
                                    </div>
                                    <div className="col-8">
                                      <DateTimePicker
                                        onChange={(e) => {
                                          setFieldValue("Date_of_inspection", e);
                                        }}
                                        disabled={true}
                                        name="Date_of_inspection"
                                        value={forms.createdAt}
                                        className="w-100"
                                      />{" "}
                                    </div>
                                  </div>
                                  <div className="row my-3">
                                    <div className="col-4">
                                      {" "}
                                      <h6>Booking Id :</h6>
                                    </div>
                                    <div className="col-8">
                                      <Field
                                        type="text"
                                        readOnly
                                        name="bookingId"
                                        style={{
                                          width: "100%",
                                          height: "35px",
                                          borderRadius: "5px",
                                          border: "1px solid #c4c4c4",
                                          paddingInlineStart: 10,
                                        }}
                                      />
                                    </div>
                                  </div>
                                  <div className="row my-3">
                                    <div className="col-4">
                                      {" "}
                                      <h6>Ride Start Time :</h6>
                                    </div>
                                    <div className="col-8">
                                      <DateTimePicker
                                        onChange={(e) => {
                                          setFieldValue("Date_of_inspection", e);
                                        }}
                                        disabled={true}
                                        name="pickUpTime"
                                        value={forms.pickUpTime}
                                        className="w-100"
                                      />{" "}
                                    </div>
                                  </div>

                                  <div className="row my-3">
                                    <div className="col-4">
                                      {" "}
                                      <h6>Ride End Time :</h6>
                                    </div>
                                    <div className="col-8">
                                      <DateTimePicker
                                        onChange={(e) => {
                                          setFieldValue("Date_of_inspection", e);
                                        }}
                                        disabled={true}
                                        name="dropTime"
                                        value={forms.dropTime}
                                        className="w-100"
                                      />{" "}
                                    </div>
                                  </div>
                                  <div className="row my-3">
                                    <div className="col-4">
                                      <h6>Pickup Location :</h6>
                                    </div>
                                    <div className="col-8">
                                      <Field
                                        type="text"
                                        readOnly
                                        name="pickUpPlace"
                                        style={{
                                          width: "100%",
                                          height: "35px",
                                          borderRadius: "5px",
                                          border: "1px solid #c4c4c4",
                                          paddingInlineStart: 10,
                                        }}
                                      />
                                    </div>
                                  </div>
                                  <div className="row my-3">
                                    <div className="col-4">
                                      <h6>Drop Location :</h6>
                                    </div>
                                    <div className="col-8">
                                      <Field
                                        type="text"
                                        readOnly
                                        name="dropPlace"
                                        style={{
                                          width: "100%",
                                          height: "35px",
                                          borderRadius: "5px",
                                          border: "1px solid #c4c4c4",
                                          paddingInlineStart: 10,
                                        }}
                                      />
                                    </div>
                                  </div>
                                  <div className="row my-3">
                                    <div className="col-4">
                                      <h6>Multiple Drop Location :</h6>
                                    </div>
                                    <div className="d-flex flex-column col-8">
                                      {forms?.userMultipleWayPoint.length > 0 ? (
                                        forms.userMultipleWayPoint.map((dropLocations, i) => (
                                          <Field
                                            key={i}
                                            type="text"
                                            readOnly
                                            name={`${dropLocations?.wayPlace}`}
                                            value={`${dropLocations?.wayPlace}`}
                                            style={{
                                              width: "100%",
                                              height: "35px",
                                              borderRadius: "5px",
                                              border: "1px solid #c4c4c4",
                                              paddingInlineStart: 10,
                                              margin: "5px 0px 5px 0px",
                                            }}
                                          />
                                        ))
                                      ) : (
                                        <Field
                                          type="text"
                                          readOnly
                                          name={`noData`}
                                          // value={`${dropLocations?.wayPlace}`}
                                          style={{
                                            width: "100%",
                                            height: "35px",
                                            borderRadius: "5px",
                                            border: "1px solid #c4c4c4",
                                            paddingInlineStart: 10,
                                            margin: "5px 0px 5px 0px",
                                          }}
                                        />
                                      )}
                                    </div>
                                  </div>
                                  <div className="row my-3">
                                    <div className="col-4">
                                      <h6>Ride Distance :</h6>
                                    </div>
                                    <div className="col-8">
                                      <Field
                                        type="text"
                                        readOnly
                                        name="distance"
                                        style={{
                                          width: "100%",
                                          height: "35px",
                                          borderRadius: "5px",
                                          border: "1px solid #c4c4c4",
                                          paddingInlineStart: 10,
                                        }}
                                      />
                                    </div>
                                  </div>
                                  <div className="row my-3">
                                    <div className="col-4">
                                      <h6>Ride Fare :</h6>
                                    </div>
                                    <div className="col-8">
                                      <Field
                                        type="text"
                                        readOnly
                                        name="amount"
                                        style={{
                                          width: "100%",
                                          height: "35px",
                                          borderRadius: "5px",
                                          border: "1px solid #c4c4c4",
                                          paddingInlineStart: 10,
                                        }}
                                      />
                                    </div>
                                  </div>
                                  <div className="row my-3">
                                    <div className="col-4">
                                      <h6>Promocode Discount :</h6>
                                    </div>
                                    <div className="col-8">
                                      <Field
                                        type="text"
                                        readOnly
                                        name="promocodeDiscount"
                                        style={{
                                          width: "100%",
                                          height: "35px",
                                          borderRadius: "5px",
                                          border: "1px solid #c4c4c4",
                                          paddingInlineStart: 10,
                                        }}
                                      />
                                    </div>
                                  </div>
                                  <div className="row my-3">
                                    <div className="col-4">
                                      <h6>User Device Type :</h6>
                                    </div>
                                    <div className="col-8">
                                      <Field
                                        type="text"
                                        readOnly
                                        name="pickUpPlace"
                                        style={{
                                          width: "100%",
                                          height: "35px",
                                          borderRadius: "5px",
                                          border: "1px solid #c4c4c4",
                                          paddingInlineStart: 10,
                                        }}
                                      />
                                    </div>
                                  </div>
                                  {/* <div className="row my-3">
                                    <div className="col-4">
                                      <h6>Promocode Type:</h6>
                                    </div>
                                    <div className="col-8">
                                      <Field
                                        type="text"
                                        readOnly
                                        name="make_model_inspected"
                                        style={{
                                          width: "100%",
                                          height: "35px",
                                          borderRadius: "5px",
                                          border: "1px solid #c4c4c4",
                                          paddingInlineStart: 10,
                                        }}
                                      />
                                    </div>
                                  </div> */}
                                  {/* <div className="row my-3">
                                    <div className="col-4">
                                      <h6>Transaction Details :</h6>
                                    </div>
                                    <div className="col-8">
                                      <Field
                                        type="text"
                                        readOnly
                                        name="make_model_inspected"
                                        style={{
                                          width: "100%",
                                          height: "35px",
                                          borderRadius: "5px",
                                          border: "1px solid #c4c4c4",
                                          paddingInlineStart: 10,
                                        }}
                                      />
                                    </div>
                                  </div> */}

                                  {/* section 2 */}
                                  {/* row 4 */}
                                  {/* <div className="row my-3">
                                    <div className="col-12 ">
                                      <div
                                        style={{
                                          backgroundColor: "#2765B3",
                                          borderRadius: "2px",
                                        }}
                                      >
                                        {" "}
                                        <h4 className="text-white p-1">Driver Details:</h4>
                                      </div>
                                    </div>
                                  </div> */}
                                  {/* row 5*/}
                                  {/* internal structure 1 */}
                                  {/* <div className="row my-3">
                                    <div className="col-4">
                                      <h6>Driver Id :</h6>
                                    </div>
                                    <div className="col-8">
                                      <Field
                                        type="text"
                                        readOnly
                                        name="driverId"
                                        style={{
                                          width: "100%",
                                          height: "35px",
                                          borderRadius: "5px",
                                          border: "1px solid #c4c4c4",
                                          paddingInlineStart: 10,
                                        }}
                                      />
                                    </div>
                                  </div> */}

                                  {/* internal structure 2 */}

                                  {/* internal structure 5 */}

                                  {/* internal structure 6 */}

                                  {/* section 3 */}
                                  {/* row 5 */}
                                  {/* <div className="row my-1">
                                    <div className="col-12 ">
                                      <div
                                        style={{
                                          backgroundColor: "#2765B3",
                                          borderRadius: "2px",
                                        }}
                                      >
                                        {" "}
                                        <h4 className="text-white p-1">User Details:</h4>
                                      </div>
                                    </div>
                                  </div> */}
                                  {/* row 6*/}
                                  {/* internal structure 7 */}
                                  {/* <div className="row my-3">
                                    <div className="col-4">
                                      <h6>User ID :</h6>
                                    </div>
                                    <div className="col-8">
                                      <Field
                                        type="text"
                                        readOnly
                                        name="userId"
                                        style={{
                                          width: "100%",
                                          height: "35px",
                                          borderRadius: "5px",
                                          border: "1px solid #c4c4c4",
                                          paddingInlineStart: 10,
                                        }}
                                      />
                                    </div>
                                  </div> */}

                                  {/* internal structure 8 */}

                                  {/* internal structure 9 */}

                                  {/* internal structure 10 */}

                                  {/* internal structure 11 */}

                                  {/* internal structure 12 */}

                                  {/* internal structure 12.1 */}

                                  {/* internal structure 12.2 */}

                                  {/* internal structure 12.3 */}

                                  {/* section 4 */}
                                  {/* row 7 */}
                                  <div className="row my-1">
                                    <div className="col-12 ">
                                      <div
                                        style={{
                                          backgroundColor: "#2765B3",
                                          borderRadius: "2px",
                                        }}
                                      >
                                        {" "}
                                        <h4 className="text-white p-1">User Card Details:</h4>
                                      </div>
                                    </div>
                                  </div>
                                  {/* row 8*/}
                                  {/* <div className="row">
                                    <div className="col-6"> */}
                                  <div className="row my-3">
                                    <div className="col-4">
                                      <h6>Account Holder Name :</h6>
                                    </div>
                                    <div className="col-8">
                                      <Field
                                        type="text"
                                        readOnly
                                        name="AccountHolderName"
                                        style={{
                                          width: "100%",
                                          height: "35px",
                                          borderRadius: "5px",
                                          border: "1px solid #c4c4c4",
                                          paddingInlineStart: 10,
                                        }}
                                      />
                                    </div>
                                  </div>
                                  <div className="row my-3">
                                    <div className="col-4">
                                      <h6>Card Number (last 4) :</h6>
                                    </div>
                                    <div className="col-8">
                                      <Field
                                        type="text"
                                        readOnly
                                        name="cardNumber"
                                        style={{
                                          width: "100%",
                                          height: "35px",
                                          borderRadius: "5px",
                                          border: "1px solid #c4c4c4",
                                          paddingInlineStart: 10,
                                        }}
                                      />
                                    </div>
                                  </div>
                                  <div className="row my-3">
                                    <div className="col-4">
                                      <h6>Expiry Date :</h6>
                                    </div>
                                    <div className="col-8">
                                      <Field
                                        type="text"
                                        readOnly
                                        name="expiryDate"
                                        style={{
                                          width: "100%",
                                          height: "35px",
                                          borderRadius: "5px",
                                          border: "1px solid #c4c4c4",
                                          paddingInlineStart: 10,
                                        }}
                                      />
                                    </div>
                                  </div>
                                  {/* </div> */}
                                  {/* <div className="col-6">
                                      <Cards
                                        cvc={"455"}
                                        expiry={
                                          get(
                                            forms,
                                            "balance_transactions[0].charges.data[0].payment_method_details.card.exp_month",
                                            ""
                                          ) +
                                          "/" +
                                          get(
                                            forms,
                                            "balance_transactions[0].charges.data[0].payment_method_details.card.exp_year",
                                            ""
                                          )
                                        }
                                        focused={""}
                                        name={"abc"}
                                        number={
                                          `000000000000` +
                                          get(
                                            forms,
                                            "balance_transactions[0].charges.data[0].payment_method_details.card.last4",
                                            ""
                                          )
                                        }
                                      />
                                    </div>
                                  </div> */}
                                  {/* <div className="row my-3">
                                    <div className="col-4">
                                      <h6>CVV :</h6>
                                    </div>
                                    <div className="col-8">
                                      <Field
                                        type="text"
                                        readOnly
                                        name="CVV"
                                        style={{
                                          width: "100%",
                                          height: "35px",
                                          borderRadius: "5px",
                                          border: "1px solid #c4c4c4",
                                          paddingInlineStart: 10,
                                        }}
                                      />
                                    </div>
                                  </div> */}
                                  {/* internal structure 14 */}

                                  {/* internal structure 15 */}

                                  {/* internal structure 16 */}

                                  {/* internal structure 17 */}

                                  {/* internal structure 18 */}

                                  {/* section 5 */}
                                  {/* row 8 */}
                                  <div className="row my-1">
                                    <div className="col-12 ">
                                      <div
                                        style={{
                                          backgroundColor: "#2765B3",
                                          borderRadius: "2px",
                                        }}
                                      >
                                        {" "}
                                        <h4 className="text-white p-1">Vehicle Details:</h4>
                                      </div>
                                    </div>
                                  </div>
                                  {/* row 9*/}
                                  {/* internal structure 19 */}
                                  <div className="row my-3">
                                    <div className="col-4">
                                      <h6>Driver Name :</h6>
                                    </div>
                                    <div className="col-8">
                                      <Field
                                        type="text"
                                        readOnly
                                        name="driverName"
                                        style={{
                                          width: "100%",
                                          height: "35px",
                                          borderRadius: "5px",
                                          border: "1px solid #c4c4c4",
                                          paddingInlineStart: 10,
                                        }}
                                      />
                                    </div>
                                  </div>
                                  <div className="row my-3">
                                    <div className="col-4">
                                      <h6>Vehicle Name :</h6>
                                    </div>
                                    <div className="col-8">
                                      <Field
                                        type="text"
                                        readOnly
                                        name="vehicleName"
                                        style={{
                                          width: "100%",
                                          height: "35px",
                                          borderRadius: "5px",
                                          border: "1px solid #c4c4c4",
                                          paddingInlineStart: 10,
                                        }}
                                      />
                                    </div>
                                  </div>
                                  <div className="row my-3">
                                    <div className="col-4">
                                      <h6>Vehicle VIN :</h6>
                                    </div>
                                    <div className="col-8">
                                      <Field
                                        type="text"
                                        readOnly
                                        name="vehicleVIN"
                                        style={{
                                          width: "100%",
                                          height: "35px",
                                          borderRadius: "5px",
                                          border: "1px solid #c4c4c4",
                                          paddingInlineStart: 10,
                                        }}
                                      />
                                    </div>
                                  </div>
                                  <div className="row my-3">
                                    <div className="col-4">
                                      <h6>Model:</h6>
                                    </div>
                                    <div className="col-8">
                                      <Field
                                        type="text"
                                        readOnly
                                        name="model"
                                        style={{
                                          width: "100%",
                                          height: "35px",
                                          borderRadius: "5px",
                                          border: "1px solid #c4c4c4",
                                          paddingInlineStart: 10,
                                        }}
                                      />
                                    </div>
                                  </div>
                                  <div className="row my-3">
                                    <div className="col-4">
                                      <h6>Year :</h6>
                                    </div>
                                    <div className="col-8">
                                      <Field
                                        type="text"
                                        readOnly
                                        name=""
                                        style={{
                                          width: "100%",
                                          height: "35px",
                                          borderRadius: "5px",
                                          border: "1px solid #c4c4c4",
                                          paddingInlineStart: 10,
                                        }}
                                      />
                                    </div>
                                  </div>
                                  <div className="row my-3">
                                    <div className="col-4">
                                      <h6>Color :</h6>
                                    </div>
                                    <div className="col-8">
                                      <Field
                                        type="text"
                                        readOnly
                                        name="color"
                                        style={{
                                          width: "100%",
                                          height: "35px",
                                          borderRadius: "5px",
                                          border: "1px solid #c4c4c4",
                                          paddingInlineStart: 10,
                                        }}
                                      />
                                    </div>
                                  </div>
                                  <div className="row my-3">
                                    <div className="col-4">
                                      <h6>License Plate :</h6>
                                    </div>
                                    <div className="col-8">
                                      <Field
                                        type="text"
                                        readOnly
                                        name=""
                                        style={{
                                          width: "100%",
                                          height: "35px",
                                          borderRadius: "5px",
                                          border: "1px solid #c4c4c4",
                                          paddingInlineStart: 10,
                                        }}
                                      />
                                    </div>
                                  </div>
                                  <div className="row my-3">
                                    <div className="col-4">
                                      <h6>Seat Availability :</h6>
                                    </div>
                                    <div className="col-8">
                                      <Field
                                        type="text"
                                        readOnly
                                        name="seatAvailability"
                                        style={{
                                          width: "100%",
                                          height: "35px",
                                          borderRadius: "5px",
                                          border: "1px solid #c4c4c4",
                                          paddingInlineStart: 10,
                                        }}
                                      />
                                    </div>
                                  </div>
                                  {/* internal structure 20 */}

                                  {/* internal structure 21 */}

                                  {/* internal structure 22 */}

                                  {/* internal structure 23 */}

                                  {/* internal structure 24 */}

                                  {/* internal structure 24.1 */}

                                  {/* internal structure 24.2 */}

                                  {/* internal structure 25 */}
                                </div>
                                <br />
                                <br />
                                {/* <div style={{display:"flex",justifyContent:"center"}}><button type="submit" className="buttoncss" style={{borderRadius:"1.5rem",border:"none",fontSize:"1rem",width:"15vw",height:"5vh",backgroundColor:"#2765B3",color:"#fff"}}>SAVE</button></div> */}
                              </Form>
                            )}
                          </Formik>
                        </div>
                        // </Paper>
                        // </AccordionDetails>
                        // </Accordion>
                      ))
                  }
                </Paper>
              </div>
            </div>
          </Paper>
        </div>
      </div>
    </React.Fragment>
  );
}
