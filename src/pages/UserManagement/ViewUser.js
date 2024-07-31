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
import { Close, DeleteOutlineOutlined, Search } from "@material-ui/icons";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ReactPaginate from "react-paginate";
import { getDateFormat } from "../../helpers/helperFunction";
import DRIVER from "axios";
import {
  Button,
  IconButton,
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
import DatePicker from "react-date-picker";
import Swal from "sweetalert2";
import { confirm } from "react-confirm-box";

// import { Delete } from '@material-ui/icons';
import VisibilityIcon from "@material-ui/icons/Visibility";
import BlockIcon from "@material-ui/icons/Block";

// For Table
import SearchBar from "material-ui-search-bar";
import { get, identity, sortBy, stubTrue } from "lodash";

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
import tick from "../../../src/assets/images/tick.svg";
import "./ViewUser.css";
import RSelect from "react-select";
import GetAppIcon from "@material-ui/icons/GetApp";
import StarRatings from "react-star-ratings";
import ModalImage from "react-modal-image";
import { CSVLink, CSVDownload } from "react-csv";
import noData from "../../../src/assets/images/noData.jpg";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import { ServiceType_Url } from "../../statics/constants";

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
    // justifyContent: "space-between",
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
    // maxHeight: "65vh",
  },
  paperPaddingRightLeft: {
    padding: "0rem 1rem",
  },
  customResponsive: {
    ["@media (max-width:600px)"]: {
      flexDirection: "column",
      // display: "flex",
      // flexWrap: "wrap",
    },
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

export default function ViewUser(props) {
  const classes = useStyles();

  // const history=useHistory();
  const {
    location: { state },
  } = props;
  console.log(state);
  const downloadExcel = useRef(null);
  const [tableData, setTableData] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [PaginationData, setPaginationData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [bookingStatus, setBookingStatus] = useState(!state ? "complete" : state[3] ? state[3] : "complete");
  // const [bookingStatus, setBookingStatus] = useState(
  //   !state ? "complete" : state[state.length - 1].bookingStatus ? state[state.length - 1].bookingStatus : "complete"
  // );
  const [serviceTypeData, setServiceTypeData] = useState([]);
  const [serviceType, setServiceType] = useState(!state ? "all" : state[2] ? state[2] : "all");
  // const [serviceType, setServiceType] = useState(
  //   !state ? "0" : state[state.length - 1].serviceType ? state[state.length - 1].serviceType : "0"
  // );
  const [userDetails, setUserDetails] = useState([]);
  const RatingData = [
    { label: "0", value: "0" },
    { label: "1", value: "1" },
    { label: "2", value: "2" },
    { label: "3", value: "3" },
    { label: "4", value: "4" },
    { label: "5", value: "5" },
  ];
  const [ratings, setRatings] = useState([]);
  const [ratingValue, setRatingValue] = useState("5");
  const [arrayToMAP, setArraytomap] = useState([{}, {}, {}, {}, {}]);
  // status switch
  // const [checked, setChecked] = useState(true);

  // For Pagination
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = async (event, newPage) => {
    console.log(newPage);
    console.log({ event, newPage });
    getCategoriesContent(newPage + 1, rowsPerPage, Incomplete, search);
    console.log("checkpage");
    setPage(newPage);
    // if (PaginationData.totalPages > newPage) {
    //   try {
    //     const { data } = await axios.get(`/userList?page=${newPage}&limit=10`);
    //     console.log(data);
    //     setTableData(data.data.docs);
    //     setSearchedData(data.data.docs);
    //     setPaginationData(data.data);
    //     setPage(newPage);
    //   } catch (err) {
    //     console.log(err);
    //   }
    // } else {
    //   toast.error("No More Data");
    // }
  };

  const handleChangeRowsPerPage = (event) => {
    console.log(+event.target.value);
    // setRowsPerPage(+event.target.value);
    // setPage(0);
    getCategoriesContent(page, event.target.value, Incomplete, search);
    console.log("checkrows");
    setRowsPerPage(parseInt(event.target.value, 10));
    console.log({ event });
    setPage(0);
  };

  useEffect(() => {
    getServiceTypes();
  }, []);

  useEffect(() => {
    getUserDetails();
    getCategoriesContent();
  }, [state, bookingStatus, serviceType]);
  useEffect(() => {
    getRatings();
  }, [ratingValue]);
  //get content
  const [pagenumber, setPageNumber] = useState(1);
  const [totalUserListCount, settotalUserListCount] = useState(0);
  const [limit, setLimit] = useState(10);
  const [Incomplete, setIncomplete] = useState(true);
  const [search, setSearch] = useState("");
  const [DisplayNoDataImage, setDisplayNoDataImage] = useState(false);
  const getUserDetails = async () => {
    try {
      const { data } = await axios.get(`/private/userDetails/${state[0]}`);
      // const { data } = await axios.get(`/private/userDetails/${state[state.length - 1].UserID}`);
      console.log(data);
      setUserDetails(data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getRatings = async () => {
    try {
      const { data } = await axios.get(`/private/ratingReviewsList?id=${state[0]}&page=1&limit=5&userType=user`);
      // const { data } = await axios.get(
      //   `/private/ratingReviewsList?id=${state[state.length - 1].UserID}&page=1&limit=5&userType=user`
      // );
      console.log(data);
      setRatings([...data.data.docs]);
    } catch (error) {
      console.log(error);
    }
  };

  const getCategoriesContent = async () => {
    try {
      const { data } = await axios.get(
        `/private/allRide?userType=user&page=${page === 0 ? 1 : page}&limit=${limit}&userId=${
          state[0]
        }&serviceType=${serviceType}&bookingStatus=${bookingStatus}`
        // `/private/allRide?userType=user&page=${page}&limit=${limit}&userId=${
        //   state[state.length - 1].UserID
        // }&serviceType=${serviceType}&bookingStatus=${bookingStatus}`
      );

      console.log(data);
      setDisplayNoDataImage(false);
      setTableData([...data.data.docs]);
      // setSearchedData(data.data.docs);
      settotalUserListCount(data.data.totalDocs);
      setIncomplete(Incomplete);
      setSearch(search);
      setPaginationData(data.data);
      setIsLoading(false);
      if (data.data.docs.length === 0 || data.status === 500) {
        setDisplayNoDataImage(true);
        // toast.error("No Data Found", {
        //   position: toast.POSITION.TOP_RIGHT,
        // });
      } else {
      }
    } catch (error) {
      console.log(error);
      setDisplayNoDataImage(true);
    }
  };

  console.log(tableData);

  // For Search
  const [searched, setSearched] = useState("");
  const [searchedData, setSearchedData] = useState([]);
  const [UserCategoryData, setUserCategoryData] = useState();

  const sorting = () => {
    //   if(sort){
    //  let tableSortedData= sortBy(tableData,
    //     [function(o) { console.log(o); return new Date(o.postId.createdAt).getTime(); }])
    //     console.log(tableSortedData);
    // setTableData(tableSortedData);
    //   }else {
    //  let tableSortedData= sortBy(tableData,
    //     [function(o) { console.log(o); return new Date(o.postId.createdAt).getTime(); }],
    //     { reverse: true })
    //     setTableData(tableSortedData);
    //   }
    let sortedData = sortBy(tableData, [
      function (o) {
        // console.log(o);
        return new Date(o.createdAt).getTime();
      },
    ]).reverse();
    return sortedData;
  };

  function myDeb(call, d = 1000) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        call(...args);
      }, d);
    };
  }

  const SearchUser = myDeb((search) => {
    getCategoriesContent(page, rowsPerPage, Incomplete, search);
  });
  const sanitizeRating = (rating) => {
    let regexNumber = /^[0-9]+$/;

    if (regexNumber.test(rating)) {
      return rating;
    } else if (typeof rating === "number") {
      // return rating.slice(0, 3);

      return +rating.toFixed(1);
    }
  };
  const ViewBookingDetails = (id) => {
    console.log("sjdksakdksadksakdksadsad",id,state[0])
    props.history.push({
      pathname: "/adminPanel/BookingDetails",
      state: [id, state[1], "user", state[0], serviceType, bookingStatus],
    });
  };
  // const ViewBookingDetails = (id) => {
  //   let UserDetailsPage = {
  //     pageName: "UserDetails",
  //     page: page + 1,
  //     limit: rowsPerPage,
  //     Incomplete: Incomplete,
  //     search: search,
  //     bookingStatus: bookingStatus,

  //     serviceType: serviceType,
  //     BookingID: id,
  //   };
  //   props.history.push({
  //     pathname: "/adminPanel/BookingDetails",
  //     state: [state].push(UserDetailsPage),
  //   });
  // };
  const getServiceTypes = async () => {
    try {
      const { data } = await DRIVER.get(`${ServiceType_Url}?userType=user`);
      console.log(data.data);
      let newArray = data.data.map((ele) => ({ label: ele.title, value: ele._id }));
      newArray.unshift({ label: "All", value: "all" });

      console.log(newArray);
      setServiceTypeData(newArray);
    } catch (error) {
      console.log(error);
    }
  };
  console.log(serviceTypeData[0]);
  const sanitizeDecimal = (rating) => {
    console.log("ratinggggggg", rating);
    // let regexNumber = /^[0-9]+$/;

    if (typeof rating === "number") {
      // return rating.slice(0, 3);

      return +rating.toFixed(2);
    } else if (typeof rating === "string") {
      return parseFloat(rating).toFixed(2);
    }
  };
  const csvData = tableData.map((item) => ({
    "Date & Time": moment(item.createdAt).format("Do MMMM YYYY, h:mm a"),

    "Booking Id": item?.bookingId,
    "Driver Name": item?.driver?.firstName + " " + item?.driver?.lastName,
    "User Name": item?.users?.firstName + " " + item?.users?.lastName,
    "Total Distance": item?.ride_distance ? sanitizeDecimal(item?.ride_distance) : 0,
    "Total Fare": (item?.price || 0).toFixed(2),
  }));
  const headers = [
    { label: "Date & Time", key: "Date & Time" },
    { label: "Booking Id", key: "Booking Id" },
    { label: "Driver Name", key: "Driver Name" },
    { label: "User Name", key: "User Name" },
    { label: "Total Distance", key: "Total Distance" },
    { label: "Total Fare", key: "Total Fare" },
  ];

  const csvLink = {
    filename: "User.csv",
    headers: headers,
    data: csvData,
  };

  function filterLanguageValue(language) {
    switch (language) {
      case "en":
        return "English";

      case "es":
        return "Spanish";
      case "zh":
        return "Chinese";
      case "ko":
        return "Korean";
      default:
        return "N/A";
    }
  }
  const DeleteUser = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "All data will be deleted permanently . Proceed to delete!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { data } = await axios.get(`/private/userDeleteAndBlock?id=${id}&status=delete`);
        console.log(data);
        // getCategoriesContent(page, limit, Incomplete, search);
        props.history.goBack();
        toast.success("User Deleted", {
          position: toast.POSITION.TOP_RIGHT,
        });
        // Swal.fire("Deleted!", "Your file has been deleted.", "success");
      } else {
        toast.error("You have cancelled the operation", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    });
    // if (window.confirm("Are you sure you want to delete this user?")) {
    //   try {
    //     // console.log(category);
    //     const { data } = await axios.get(`/private/userDeleteAndBlock?id=${id}&status=delete`);
    //     console.log(data);
    //     getCategoriesContent(page, limit, Incomplete, search);
    //     toast.success("User Deleted", {
    //       position: toast.POSITION.TOP_RIGHT,
    //     });
    //   } catch (error) {
    //     toast.error(error.response.message, {
    //       position: toast.POSITION.TOP_RIGHT,
    //     });
    //     console.log(error);
    //   }
    // } else {
    //   toast.error("You have cancelled the operation", {
    //     position: toast.POSITION.TOP_RIGHT,
    //   });
    // }
  };
  return (
    <React.Fragment>
      <div className="page-content">
        <div className={classes.root}>
          <Paper elevation={0} style={{ backgroundColor: "transparent" }}>
            <div className={classes.paperPaddingRightLeft}>
              <div className="">
                <Paper
                  elevation={0}
                  style={{ display: "flex", alignItems: "center", backgroundColor: "transparent" }}
                  className={classNames(classes.paperHeading, classes.headingAlignment)}
                >
                  <Button
                    onClick={() => {
                      props.history.push({
                        pathname: state[1].pathname,
                        state: state[1].pathname=="/adminPanel/BookingDetails"? [state[4], state[1], "user", state[0], serviceType, bookingStatus]:state[1],
                      });
                      // props.history.push({
                      //   pathname: "/adminPanel/user-management",
                      //   state: state.length >= 2 ? state.pop() : state,
                      // });
                    }}
                  >
                    <ArrowBackIosIcon style={{ fontSize: "2.5rem" }} />
                  </Button>
                  &emsp;
                  <h3 style={{}}>User Details</h3>
                </Paper>

                {/* //new design */}

                {/* <br /> */}

                {/* status end */}
                <Paper
                  style={{ display: "flex", gap: "2%", backgroundColor: "transparent" }}
                  elevation={0}
                  className={classNames(classes.customResponsive)}
                >
                  <Paper style={{ display: "flex", flexDirection: "column", backgroundColor: "transparent" }} elevation={0}>
                    {/* section 1 */}
                    <div
                      style={{
                        margin: "0px 0px 20px 0px",
                        padding: "10px 10px 10px 10px",
                        borderRadius: "10px",
                        boxShadow: " rgba(0, 0, 0, 0.35) 0px 5px 15px",
                        minWidth: "300px",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "center" }}>
                        {" "}
                        <div className="imgpic">
                          <ModalImage
                            small={userDetails[0]?.profileImage}
                            large={userDetails[0]?.profileImage}
                            alt="Profile Image"
                            hideDownload
                            hideZoom
                          />
                        </div>
                      </div>
                      <div className="row py-2">
                        <div className="col-12 text-center text-capitalize font-weight-bold ">
                          {userDetails[0]?.firstName ? userDetails[0]?.firstName + " " + userDetails[0]?.lastName : "N/A"}
                        </div>

                        {/* </div> */}
                      </div>
                      <div
                        // style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}
                        className="row py-2"
                      >
                        {/* <div className="col-6 text-center"> */}
                        <div className="col-12 text-center font-weight-bold">
                          {userDetails[0]?.countryCode + " " + userDetails[0]?.phone}
                          &nbsp;{" "}
                          {userDetails[0]?.phone_otp_verfied === true ? (
                            <img src={tick} style={{ width: "20px", height: "20px" }} alt="" />
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                      <div className="row py-2">
                        <div className="col-6 text-center  ">
                          <StarRatings
                            rating={userDetails[0]?.rating}
                            starRatedColor="blue"
                            //   changeRating={}
                            numberOfStars={5}
                            name="rating"
                            starDimension="15px"
                            starSpacing="2px"
                          />
                        </div>
                        <div
                          className="col-6 text-center"
                          style={{ textDecoration: "underline", cursor: "pointer" }}
                          onClick={() => {
                            props.history.push({
                              pathname: "/adminPanel/RatingAndReview",
                              state: [state[0], state[1], "user", serviceType, bookingStatus],
                            });
                          }}
                        >
                          View All
                        </div>
                      </div>
                      <div className="row py-2 d-flex justify-content-center" style={{ gap: "1rem" }}>
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                          // className="col-4 text-center"
                        >
                          <div style={{ textAlign: "center" }}>{userDetails[0]?.totalRide}</div>
                          <div style={{ fontWeight: "600", textAlign: "center" }}>Total</div>
                        </div>
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                          // className="col-4  text-center"
                        >
                          <div style={{ textAlign: "center" }}>{userDetails[0]?.confirm_ride}</div>
                          <div style={{ fontWeight: "600", textAlign: "center" }}>Completed</div>
                        </div>
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                          // className="col-4 text-center"
                        >
                          <div style={{ textAlign: "center" }}>{userDetails[0]?.cancel_ride}</div>
                          <div style={{ fontWeight: "600", textAlign: "center" }}>Cancelled</div>
                        </div>
                      </div>
                    </div>

                    {/* section 2 */}
                    <div
                      style={{
                        margin: "20px 0px 20px 0px",
                        padding: "10px 10px 10px 10px",
                        borderRadius: "10px",
                        boxShadow: " rgba(0, 0, 0, 0.35) 0px 5px 15px",
                      }}
                    >
                      {/* <div style={{ fontWeight: 700, fontSize: "16px" }}>About Me</div> */}
                      <div className="row py-2">
                        <div
                          // style={{ fontWeight: "bold", flex: 1 }}
                          className="col-6 font-weight-bold"
                        >
                          {" "}
                          User ID
                        </div>
                        <div
                          // style={{ flex: 1 }}
                          className="col-6"
                        >
                          {userDetails[0]?.user_id}
                        </div>
                      </div>
                      <div className="row py-2">
                        <div
                          // style={{ fontWeight: "bold", flex: 1 }}
                          className="col-6 font-weight-bold"
                        >
                          Joining Date
                        </div>
                        <div
                          // style={{ flex: 1 }}
                          className="col-6"
                        >
                          {moment(userDetails[0]?.createdAt).format("DD/MM/YY")}
                        </div>
                      </div>
                      <div className="row py-2">
                        <div
                          // style={{ fontWeight: "bold", flex: 1 }}
                          className="col-6 font-weight-bold"
                        >
                          User Type
                        </div>
                        <div
                          // style={{ flex: 1 }}
                          className="col-6"
                        >
                          {userDetails[0]?.userCategory}
                        </div>
                      </div>
                      <div className="row py-2">
                        <div
                          // style={{ fontWeight: "bold", flex: 1 }}
                          className="col-6 font-weight-bold"
                        >
                          User Language
                        </div>
                        <div
                          // style={{ flex: 1 }}
                          className="col-6"
                        >
                          {userDetails[0]?.userLanguage ? filterLanguageValue(userDetails[0]?.userLanguage) : "N/A"}
                        </div>
                      </div>
                      <div className="row py-2">
                        <div
                          // style={{ fontWeight: "bold", flex: 1 }}
                          className="col-6 font-weight-bold"
                        >
                          Email ID
                        </div>
                        <div
                          // style={{ flex: 1 }}
                          className="col-6"
                          style={{ overflowWrap: "break-word" }}
                        >
                          {userDetails[0]?.email}
                        </div>
                      </div>
                    </div>
                    {/* section 2.1 */}
                    {userDetails[0]?.userCategory == "Business" ? (
                      <div
                        style={{
                          margin: "20px 0px 20px 0px",
                          padding: "10px 10px 10px 10px",
                          borderRadius: "10px",
                          boxShadow: " rgba(0, 0, 0, 0.35) 0px 5px 15px",
                        }}
                      >
                        {/* <div style={{ fontWeight: 700, fontSize: "16px" }}>About Me</div> */}
                        <div className="row py-2">
                          <div
                            // style={{ fontWeight: "bold", flex: 1 }}
                            className="col-6 font-weight-bold"
                          >
                            {" "}
                            Business Name
                          </div>
                          <div
                            // style={{ flex: 1 }}
                            className="col-6"
                            style={{ overflowWrap: "break-word" }}
                          >
                            {userDetails[0]?.business?.name}
                          </div>
                        </div>
                        <div className="row py-2">
                          <div
                            // style={{ fontWeight: "bold", flex: 1 }}
                            className="col-6 font-weight-bold"
                          >
                            Phone Number
                          </div>
                          <div
                            // style={{ flex: 1 }}
                            className="col-6"
                            style={{ overflowWrap: "break-word" }}
                          >
                            {userDetails[0]?.business?.phoneNumber}
                          </div>
                        </div>
                        <div className="row py-2">
                          <div
                            // style={{ fontWeight: "bold", flex: 1 }}
                            className="col-6 font-weight-bold"
                          >
                            Email ID
                          </div>
                          <div
                            // style={{ flex: 1 }}
                            className="col-6"
                            style={{ overflowWrap: "break-word" }}
                          >
                            {userDetails[0]?.business?.email}
                          </div>
                        </div>
                        <div className="row py-2">
                          <div
                            // style={{ fontWeight: "bold", flex: 1 }}
                            className="col-6 font-weight-bold"
                          >
                            Address
                          </div>
                          <div
                            // style={{ flex: 1 }}
                            className="col-6"
                            style={{ overflowWrap: "break-word" }}
                          >
                            {userDetails[0]?.business?.address}
                          </div>
                        </div>
                      </div>
                    ) : (
                      false
                    )}
                    {/* section 3 */}
                    {/* <div
                      style={{
                        margin: "20px 0px 20px 0px",
                        padding: "10px 10px 10px 10px",
                        borderRadius: "10px",
                        boxShadow: " rgba(0, 0, 0, 0.35) 0px 5px 15px",
                      }}
                    > */}
                    {/* <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-around",
                          alignItems: "center",
                          padding: "10px 0px 10px 0px",
                        }}
                      >
                        <div style={{ fontWeight: 700, fontSize: "16px", fontStyle: "" }}>
                          Reviews&nbsp;({sanitizeRating(userDetails[0]?.rating)})
                        </div>
                        <div
                          style={{ textDecoration: "underline", cursor: "pointer" }}
                          onClick={() => {
                            props.history.push({
                              pathname: "/adminPanel/RatingAndReview",
                              state: [state[0], state[1], "user", serviceType, bookingStatus],
                            });
                          }}
                        >
                          View All
                        </div>
                      
                      </div> */}
                    {/* card to map */}
                    {/* {ratings.map((ele) => (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            padding: "10px 0px 10px 0px",
                            gap: "10px",
                            justifyContent: "space-between",
                          }}
                        >
                          <div style={{ display: "flex", flex: 1, gap: "10px" }}>
                            <div className="ratingImg">
                              <ModalImage
                                small={ele?.driver?.profileImage}
                                large={ele?.driver?.profileImage}
                                alt="Profile Image"
                                hideDownload
                                hideZoom
                              />
                            </div>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                              <div style={{ textTransform: "capitalize", fontWeight: "bolder" }}>
                                {ele?.driver?.firstName + " " + ele?.driver?.lastName + " " + `(${ele?.bookingId})`}
                              </div>
                              <div>{ele?.review}</div>
                            </div>
                          </div>
                          <div>
                            <StarRatings
                              rating={ele?.rating}
                              starRatedColor="blue"
                              //   changeRating={}
                              numberOfStars={5}
                              name="rating"
                              starDimension="15px"
                              starSpacing="2px"
                            />
                          </div>
                        </div>
                      ))} */}
                    {/* </div> */}
                  </Paper>
                  <Paper
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      flex: 1,
                      overflowY: "auto",
                      backgroundColor: "transparent",
                    }}
                    elevation={0}
                  >
                    <Paper
                      style={{
                        display: "flex",
                        alignItems: "center",
                        flexDirection: "row",
                        justifyContent: "space-around",
                        backgroundColor: "transparent",
                        flexWrap: "wrap",
                        paddingBottom: "0.5rem",
                        rowGap: "1rem",
                      }}
                      elevation={0}
                    >
                      <div style={{ display: "flex" }}>
                        <Button
                          variant="contained"
                          className="buttoncss mx-3"
                          style={{
                            backgroundColor: bookingStatus == "complete" ? "#0059cd" : "#c4c4c4", //"#0059cd",
                            color: "#fff",
                            margin: "5px",
                          }}
                          onClick={() => {
                            setBookingStatus("complete");
                          }}
                        >
                          completed ride
                        </Button>
                        <Button
                          variant="contained"
                          className="buttoncss mx-3"
                          style={{
                            backgroundColor: bookingStatus == "cancel" ? "#0059cd" : "#c4c4c4", //"#0059cd",
                            color: "#fff",
                            margin: "5px",
                          }}
                          onClick={() => {
                            setBookingStatus("cancel");
                          }}
                        >
                          cancelled ride
                        </Button>
                      </div>
                      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                        <CSVLink
                          ref={downloadExcel}
                          style={{
                            backgroundColor: "#0059cd",
                            color: "#fff",
                            padding: "8px",
                            textTransform: "uppercase",
                            borderRadius: "5px",
                            fontSize: "13px",
                          }}
                          {...csvLink}
                          className="buttoncss"
                          hidden
                        >
                          <GetAppIcon />
                          &nbsp; Download Excel
                        </CSVLink>

                        <div className="customReactSelect" style={{ width: "200px" }}>
                          <RSelect
                            options={serviceTypeData}
                            key={serviceTypeData}
                            isSearchable={false}
                            defaultValue={
                              !state[2]
                                ? { label: "All", value: "all" }
                                : // { label: "Single Taxi", value: "62d53aa9bf652aa3778946ca" }
                                  serviceTypeData.filter((item) => item.value === state[2])[0]
                            }
                            onChange={(e) => {
                              setServiceType(e.value);
                            }}
                          />
                        </div>
                        <Tooltip title={<span style={{ color: "white", fontSize: "16px" }}>Download Excel</span>} arrow>
                          <IconButton
                            className="buttoncss"
                            style={{ backgroundColor: "#006FFF", color: "#fff" }}
                            onClick={() => {
                              downloadExcel.current.link.click();
                            }}
                          >
                            <GetAppIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={<span style={{ color: "white", fontSize: "16px" }}>Delete User</span>} arrow>
                          <IconButton
                            className="buttoncss"
                            style={{ backgroundColor: "#dc143c", color: "#fff" }}
                            onClick={() => {
                              DeleteUser(userDetails[0]?._id);
                            }}
                          >
                            <DeleteOutlineOutlined />
                          </IconButton>
                        </Tooltip>
                        {/* <div
                          style={{
                            textTransform: "capitalize",
                            textDecoration: "underline",
                            padding: "0px 10px 0px 10px",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            console.log(serviceType);
                            let payload = {
                              page: 1,
                              limit: 10,
                              Incomplete: Incomplete,
                              search: "",
                              status: bookingStatus == "complete" ? "completed" : "cancel",
                              serviceType: serviceType,
                              start_date: "",
                              end_date: "",
                            };
                            props.history.push({
                              pathname: "/adminPanel/Booking_Management",
                              state: payload,
                            });
                          }}
                        >
                          View All
                        </div> */}
                      </div>
                    </Paper>
                    <Paper elevation={0}>
                      <TableContainer className={classes.container}>
                        <Table className={classes.table} stickyHeader size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Sr. No.</TableCell>
                              <TableCell style={{ textAlign: "center", fontWeight: "bold" }}> Booking Id</TableCell>
                              <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>
                                {bookingStatus === "complete" ? `Date & Time(Start)` : `Date & Time`}
                              </TableCell>
                              {bookingStatus === "complete" ? <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>
                                { `Date & Time(End)`}
                              </TableCell>:false}
                            
                              <TableCell style={{ textAlign: "center", fontWeight: "bold" }}> Driver Name</TableCell>
                              <TableCell style={{ textAlign: "center", fontWeight: "bold" }}> User Name</TableCell>
                              <TableCell style={{ textAlign: "center", fontWeight: "bold" }}> Total Distance</TableCell>
                              <TableCell style={{ textAlign: "center", fontWeight: "bold" }}> Total Fare</TableCell>

                              <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Actions</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {/* {isLoading?<TableRow ><Skeleton style={{width:"70vw",borderRadius:"20px"}} highlightColor="#fff" height="1rem" count={2} baseColor="#ebebeb"/></TableRow>:false} */}
                            {tableData
                              // .slice(
                              //   page * rowsPerPage,
                              //   page * rowsPerPage + rowsPerPage
                              // )
                              .map((category, index) => (
                                <TableRow hover key={index}>
                                  <TableCell
                                    component="th"
                                    scope="row"
                                    className={classes.textMiddle}
                                    style={{ textAlign: "center" }}
                                  >
                                    {index + 1 + page * rowsPerPage}
                                  </TableCell>
                                  <TableCell className={classes.textMiddle} style={{ textAlign: "center" }}>
                                    {get(category, "bookingId", "N/A")}
                                  </TableCell>
                                  <TableCell style={{ textAlign: "center" }}>
                                  
                                    {category.status === "complete"
                                      ? 
                                      moment(category.createdAt).format("Do MMM YY , hh:mm a")
                                      // `${moment(category.bookingAcceptTime).format("Do MMM YY , hh:mm a")}-${moment(
                                      //     category.dropTime
                                      //   ).format("Do MMM YY , hh:mm a")}`

                                      : moment(category.cretaedAt).format("Do MMM YY , hh:mm a")}
                                  </TableCell>
                                  {bookingStatus === "complete" ?    <TableCell style={{ textAlign: "center" }}>
                                  
                               {moment(
                                        category.dropTime
                                      ).format("Do MMM YY , hh:mm a")}
                                 
                                </TableCell>:false}
                              
                                  <TableCell
                                    className={classes.textMiddle}
                                    style={{ textAlign: "center", textTransform: "capitalize" }}
                                  >
                                    {category.driver ? category?.driver?.firstName + " " + category?.driver?.lastName : "N/A"}
                                  </TableCell>
                                  <TableCell
                                    className={classes.textMiddle}
                                    style={{ textAlign: "center", textTransform: "capitalize" }}
                                  >
                                    {category.users ? category?.users?.firstName + " " + category?.users?.lastName : "N/A"}
                                  </TableCell>
                                  <TableCell className={classes.textMiddle} style={{ textAlign: "center" }}>
                                    {sanitizeDecimal(get(category, "ride_distance", "0"))}
                                  </TableCell>
                                  <TableCell className={classes.textMiddle} style={{ textAlign: "center" }}>
                                    {sanitizeDecimal(get(category, "price", "0"))}
                                  </TableCell>

                                  {/* <TableCell style={{textAlign:"center"}}>{category.doc?<img src={category.doc} alt="doc" style={{width:"50px",height:"50px"}}/>:"No Doc"}</TableCell> */}
                                  <TableCell className={classes.textMiddle} style={{ textAlign: "center" }}>
                                    <Button
                                      className=""
                                      onClick={() => ViewBookingDetails(category.bookingId)}
                                      style={{
                                        // border: "1.5px solid #c4c4c4",
                                        // margin: "0.5rem",
                                        color: "#696969",
                                      }}
                                    >
                                      <Tooltip title="View" arrow>
                                        <VisibilityIcon />
                                      </Tooltip>
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                      {DisplayNoDataImage && (
                        <div style={{ textAlign: "center" }}>
                          <img src={noData} alt="noData" style={{ maxHeight: "300px" }} />
                        </div>
                      )}
                      <TablePagination
                        rowsPerPageOptions={
                          totalUserListCount >= 100 ? [10, 25, 100] : totalUserListCount > 10 ? [10, 25] : [10]
                        }
                        component="div"
                        count={totalUserListCount}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                      />
                    </Paper>
                  </Paper>
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
          <DialogTitle style={{ display: "flex", justifyContent: "center" }}>
            <h4 className=""></h4>
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
                // validationSchema={validationSchema}
                initialValues={{
                  // email:"",
                  // name: get(editData[0], "calendar_name", ""),
                  business_name: get(UserCategoryData, "business.name", "N/A"),
                  business_phone: get(UserCategoryData, "business.phoneNumber", "N/A"),
                  business_email: get(UserCategoryData, "business.email", "N/A"),
                  business_address: get(UserCategoryData, "business.address", "N/A"),
                }}
              >
                {({ values, setFieldValue }) => (
                  <Form>
                    <br />
                    <div className="container">
                      <div className="row">
                        {" "}
                        <div className="col-4">
                          <label className="" style={{}}>
                            Business Name : &nbsp;
                          </label>
                        </div>
                        <div className="col-4">
                          <Field
                            className=""
                            name="business_name"
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
                            readOnly
                          />
                          {/* <KErrorMessage name="name" /> */}
                        </div>
                      </div>
                      <br />
                      <div className="row">
                        <div className="col-4">
                          <label className="" style={{}}>
                            Business Phone Number : &nbsp;
                          </label>
                        </div>
                        <div className="col-4">
                          <Field
                            className=""
                            name="business_phone"
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
                            readOnly
                          />
                          {/* <KErrorMessage name="upload" /> */}
                        </div>
                      </div>
                      <br />
                      <div className="row">
                        <div className="col-4">
                          <label className="" style={{}}>
                            Business Email Id : &nbsp;
                          </label>
                        </div>
                        <div className="col-4">
                          <Field
                            className=""
                            name="business_email"
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
                            readOnly
                          />
                          {/* <KErrorMessage name="upload" /> */}
                        </div>
                      </div>
                      <br />
                      <div className="row">
                        <div className="col-4">
                          <label className="" style={{}}>
                            Business Address : &nbsp;
                          </label>
                        </div>
                        <div className="col-4">
                          <Field
                            className=""
                            name="business_address"
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
                            readOnly
                          />
                          {/* <KErrorMessage name="upload" /> */}
                        </div>
                      </div>
                      <br />
                      <br />
                      <div className="text-center"></div>
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
