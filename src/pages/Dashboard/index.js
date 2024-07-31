import React, { Component, useEffect, useState } from "react";
import { Container, Row, Col } from "reactstrap";
import { makeStyles } from "@material-ui/core/styles";

import axios from "../../axios";
import classNames from "classnames";
// import "chart.js/auto";
// import { Chart as ChartJS, defaults } from "chart.js";
// import Chart from "chart.js/auto";
// import { Chart } from "react-chartjs-2";
import { Doughnut, Pie, Line, Bar } from "react-chartjs-2";
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
//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
// import SalesAnalytics from "./SalesAnalytics";
import MiniWidgets from "./MiniWidgets";
import { capitalize, set } from "lodash";
import "./dashboard.css";
import RSelect from "react-select";
import { getUpdatedActiveIndex } from "react-bootstrap-typeahead/types/utils";

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
    color: "#fff",
    backgroundColor: "#696969",
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
const StarterPage = (props) => {
  const classes = useStyles();
  const [monthForGraph1,setMonthForGraph1]=useState("All")
  const [month, setMonth] = useState("January");
  const [year, setYear] = useState("2023");
  const [dropdowntracking, setDropdownTracking] = useState({
    MonthStatus: false,
    YearStatus: false,
  });
  const [monthName, setMonthName] = useState("January");
  const [yearData, setYearData] = useState([]);
  const [newEarningData, setNewEarningData] = useState([]);
  const [bookingData, setBookingData] = useState([]);
  const [onlineUser, setOnlineUser] = useState([]);
  const [userData, setUserData] = useState([]);
  const [newBookingData, setNewBookingData] = useState([]);
  const [newOnlineUser, setNewOnlineUser] = useState([]);
  const [newUserData, setNewUserData] = useState([]);
  const [DataCheck, setDataCheck] = useState({
    bookingDataCheck: true,
    onlineDataCheck: false,
    userDataCheck: false,
  });

  const {
    location: { state },
    history,
  } = props;
  console.log(props);
  const getactivemenuitem = () => {
    const result = [...document.getElementsByTagName("a")];
    const newres = result.filter((ele) => {
      if (ele.innerText === "Dashboard") {
        return ele;
      }
    });
    newres[0].classList.add("activate");
    console.log(newres);
    console.log(result);
  };
  const [tableData, setTableData] = useState([]);
  const [newTableData, setNewTableData] = useState([]);
  const [topCardData, setTopCardData] = useState([]);
  useEffect(() => {
    getDashboardAll();
    getDashboardBooking();
  }, []);

  useEffect(() => {
    window.history.pushState(null, document.title, window.location.href);
    window.addEventListener("popstate", function (event) {
      window.history.pushState(null, document.title, window.location.href);
      // Cookies.remove("admin_access_token");
    });
  }, []);
  const getDashboardAll = async () => {
    try {
      const { data } = await axios.get("/private/dashboardAPI");
      setTableData(data.data);
      setBookingData(data.data.booking_data);
      setOnlineUser(data.data.online_user);
      setUserData(data.data.user_data);

      console.log(data.data);
    } catch (error) {
      console.log(error);
    }
  };
  const getDashboardBooking = async (year = "2023") => {
    try {
      const { data } = await axios.get(`/private/dashboard/bookingData?year=${year}`);
      setNewTableData(data.data);
      setNewBookingData(data.data.booking_data);
      setNewEarningData(data.data.booking_data);
      setYearData(data.data.booking_data_year);

      setMonth(data.data.booking_data[0].monthName);
      console.log(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const breadcrumbItems = [
    { title: "Happy Taxi", link: "/adminPanel/dashboard" },
    { title: "Dashboard", link: "#" },
  ];

  const reports = [
    // { icon : "ri-user-fill", title : "Total Number of Users", value : "75" },
    // { icon : "ri-user-fill", title : "Total Number of Subscription plan", value : "50" },
    {
      icon: "ri-user-fill",
      title: "Total Number of User",
      value: tableData.drivers,
    },
    {
      icon: "ri-user-fill",
      title: "Total Number of Driver",
      value: tableData.on_duty_drivers,
    },
    // {
    //   icon: "ri-user-fill",
    //   title: "Total Number of Amount Received",
    //   value: tableData.off_duty_drivers,
    // },
    // {
    //   icon: "ri-user-fill",
    //   title: "Total Number of Added Subscription",
    //   value: tableData.complete_job,
    // },
  ];

  const options1 = {
    responsive: true,
    // maintainAspectRatio: false,
    title: {
      fontSize: 20,
      display: true,
      text: `Booking Data (${year})`,
      position: "top",
    },

    legend: {
      // position: "bottom",
      labels: {
        boxWidth: 10,
        fontSize: 16,
        fontFamily: "'DM Sans', sans-serif",
      },
    },
  };
  const options2 = {
    responsive: true,
    title: {
      display: true,
      text: "Online Data",
    },
    plugins: {
      legend: {
        position: "top",
      },
    },
  };
  const options3 = {
    responsive: true,
    // maintainAspectRatio: false,
    title: {
      fontSize: 20,
      display: true,
      text: `Earnings Data of ${month}(${year}) `,
      position: "top",
    },

    legend: {
      // position: "bottom",
      labels: {
        boxWidth: 10,
        fontSize: 16,
        fontFamily: "'DM Sans', sans-serif",
      },
    },
    scales: {
      xAxes: [
        {
          ticks: {
            display: false,
          },
        },
      ],
    },
    // scales: {
    //   xAxes: [
    //     {
    //       gridLines: {
    //         display: false,
    //       },
    //     },
    //   ],
    //   yAxes: [
    //     {
    //       gridLines: {
    //         display: false,
    //       },
    //     },
    //   ],
    // },
  };
  const tabs = ["Live Data", "Booking Data", "User Data"];

  const optionsMonth = [
    { label: "January", value: "January" },
    { label: "Feburary", value: "Feburary" },
    { label: "March", value: "March" },
    { label: "April", value: "April" },
    { label: "May", value: "May" },
    { label: "June", value: "June" },
    { label: "July", value: "July" },
    { label: "August", value: "August" },
    { label: "September", value: "September" },
    { label: "October", value: "October" },
    { label: "November", value: "November" },
    { label: "December", value: "December" },
  ];
  const optionsMonth1 = [
    { label: "All", value: "All" },
    { label: "January", value: "January" },
    { label: "Feburary", value: "Feburary" },
    { label: "March", value: "March" },
    { label: "April", value: "April" },
    { label: "May", value: "May" },
    { label: "June", value: "June" },
    { label: "July", value: "July" },
    { label: "August", value: "August" },
    { label: "September", value: "September" },
    { label: "October", value: "October" },
    { label: "November", value: "November" },
    { label: "December", value: "December" },
  ];
  
  const optionsYear = yearData?.map((ele) => ({ label: ele.year, value: ele.year }));
  const MonthChange = (month = "January") => {
    setMonth(month);
    let Data = newBookingData.filter((ele) => ele.monthName.trim() == month);
    // let monthFiltered = optionsMonth.filter((ele) => ele.label == Data[0].monthName.trim());
    // setMonthName(monthFiltered[0].label);
    console.log(Data);
    console.log("ggggggggggggggg", Data.monthName);
    setNewEarningData(Data);
  };

  console.log(newBookingData.filter((ele)=>ele.monthName.trim() == monthForGraph1),monthForGraph1)
  return (
    <React.Fragment>
      <div className="page-content">
        <div className={classes.root}>
          <Paper elevation={0} style={{ backgroundColor: "transparent" }}>
            <div className={classes.paperPaddingRightLeft}>
              <div className="">
                {/* <Paper
                  elevation={0}
                  className={classNames(classes.paperHeading, classes.headingAlignment)}
                  style={{ backgroundColor: "transparent" }}
                >
                  <h3 style={{}}>Dashboard</h3>
                </Paper> */}
                {/* <Paper
                  elevation={0}
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "center",
                    gap: "20px",
                    padding: "10px 0px 10px 0px",
                    backgroundColor: "transparent",
                    flexWrap: "wrap",
                  }}
                > */}
                <div className="row" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-around", gap: "1rem" }}>
                  {/* <div
                  className="row"
                  style={{
                    padding: 0,

                    display: "grid",
                    gridAutoColumns: "1fr",
                    gridAutoRows: "1fr",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: "0.5rem",
                  }}
                > */}
                  {/* <Button
                    variant="contained"
                    className="buttoncss "
                    style={{
                      backgroundColor: DataCheck.bookingDataCheck === true ? "#0059cd" : "#c4c4c4", //"#0059cd",
                      color: "#fff",
                      margin: "5px",
                    }}
                    onClick={() => {
                      setDataCheck({
                        ...DataCheck,
                        bookingDataCheck: true,
                        onlineDataCheck: false,
                        userDataCheck: false,
                      });
                    }}
                  >
                    Booking Data
                  </Button>
                  <Button
                    variant="contained"
                    className="buttoncss "
                    style={{
                      backgroundColor: DataCheck.onlineDataCheck === true ? "#0059cd" : "#c4c4c4", //"#0059cd",
                      color: "#fff",
                      margin: "5px",
                    }}
                    onClick={() => {
                      setDataCheck({
                        ...DataCheck,
                        bookingDataCheck: false,
                        onlineDataCheck: true,
                        userDataCheck: false,
                      });
                    }}
                  >
                    Online Data
                  </Button>
                  <Button
                    variant="contained"
                    className="buttoncss "
                    style={{
                      backgroundColor: DataCheck.userDataCheck === true ? "#0059cd" : "#c4c4c4", //"#0059cd",
                      color: "#fff",
                      margin: "5px",
                    }}
                    onClick={() => {
                      setDataCheck({
                        ...DataCheck,
                        bookingDataCheck: false,
                        onlineDataCheck: false,
                        userDataCheck: true,
                      });
                    }}
                  >
                    User Data
                  </Button> */}

                  <div className=" " style={{ flex: "1" }}>
                    <div className="totalUsers">
                      <div className="SpacingAndAlignment">
                        <div style={{ fontWeight: "bolder", fontSize: "2em" }}>
                          {userData[0]?.user}
                           </div>
                        <div style={{ fontSize: "1em" }}>
                          <i class="ri-user-3-fill"></i>
                        </div>
                      </div>
                      <div className="text-center">Total Number of Users</div>
                    </div>
                  </div>
                  <div className="" style={{ flex: "1" }}>
                    <div className="totalDrivers">
                      <div className="SpacingAndAlignment">
                        <div style={{ fontWeight: "bolder", fontSize: "2em" }}>{userData[0]?.driver} </div>
                        <div style={{ fontSize: "1em" }}>
                          <i class="ri-user-location-fill"></i>
                        </div>
                      </div>
                      <div className="text-center">Total Number of Drivers</div>
                    </div>
                  </div>
                  <div className="" style={{ flex: "1" }}>
                    <div className="totalSubAdmin">
                      <div className="SpacingAndAlignment">
                        <div style={{ fontWeight: "bolder", fontSize: "2em" }}>{userData[0]?.subAdmin} </div>
                        <div style={{ fontSize: "1em" }}>
                          <i class="ri-user-settings-fill"></i>
                        </div>
                      </div>
                      <div className="text-center">Total Number of SubAdmin</div>
                    </div>
                  </div>
                  <div className="" style={{ flex: "1" }}>
                    <div className="totalCount">
                      <div className="SpacingAndAlignment">
                        <div style={{ fontWeight: "bolder", fontSize: "2em" }}>{userData[0]?.total} </div>
                        <div style={{ fontSize: "1em" }}>
                          <i class="ri-user-settings-fill"></i>
                        </div>
                      </div>
                      <div className="text-center">Total Count</div>
                    </div>
                  </div>
                </div>
                {/* </Paper> */}
                <Paper elevation={0} className="my-3 text-center" style={{ backgroundColor: "transparent" }}>
                  {/* <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
                    {tabs.map((ele) => (
                      // <div
                      //   style={{
                      //     // fontSize: "18px",
                      //     // fontWeight: "bold",
                      //     // textTransform: "capitalize",
                      //     // color: "#fff",
                      //     // background: "linear-gradient(90deg, rgba(0,89,205,1) 78%, rgba(2,0,36,1) 100%)",
                      //     // padding: "20px",
                      //     // borderRadius: "15px",

                      //     alignItems: "center",
                      //     appearance: "none",
                      //     backgroundImage: "radial-gradient(100% 100% at 100% 0, #5adaff 0, #5468ff 100%)",
                      //     border: 0,
                      //     borderRadius: "6px",
                      //     boxShadow:
                      //       "rgba(45, 35, 66, .4) 0 2px 4px,rgba(45, 35, 66, .3) 0 7px 13px -3px,rgba(58, 65, 111, .5) 0 -3px 0 inset",
                      //     boxSizing: "border-box",
                      //     color: "#fff",
                      //     cursor: "pointer",
                      //     display: "inline-flex",

                      //     height: "48px",
                      //     justifyContent: "center",
                      //     lineHeight: 1,
                      //     listStyle: "none",
                      //     overflow: "hidden",
                      //     paddingLeft: "16px",
                      //     paddingRight: "16px",
                      //     position: "relative",
                      //     textAlign: "left",
                      //     textDecoration: "none",
                      //     transition: "box-shadow .15s,transform .15s",
                      //     userSelect: "none",
                      //     webkitUserSelect: "none",
                      //     touchAction: "manipulation",
                      //     whiteSpace: "nowrap",
                      //     willChange: "box-shadow,transform",
                      //     fontSize: "18px",
                      //   }}
                      // >
                      <Button
                        variant="contained"
                        className="buttoncss "
                        style={{
                          backgroundColor: "#0059cd", //"#0059cd",
                          color: "#fff",
                          margin: "5px",
                        }}
                      >
                        {ele}
                      </Button>
                      // </div>
                    ))}
                  </div> */}
                </Paper>
                <Paper elevation={0} style={{ backgroundColor: "transparent" }} className="my-5 ">
                  <div className="row" style={{ padding: "50px" }}>
                    <div
                      className="col-12"
                      style={{ boxShadow: " rgba(0, 0, 0, 0.35) 0px 5px 15px", borderRadius: "10px", backgroundColor: "#fff" }}
                    >
                      {DataCheck.bookingDataCheck === true ? (
                        <Paper elevation={0} style={{}}>
                          <div className="d-flex justify-content-end align-items-center py-3">
                            {" "}
                            <div style={{ fontSize: "16px", fontWeight: "bold" }}>Month :</div>
                            <div className="mx-2" style={{ width: "150px" }}>
                              <RSelect
                                key={dropdowntracking}
                                defaultValue={{ label: "All", value: "All" }}
                                options={optionsMonth1}
                                onChange={(e) => {
                                  // getDashboardBooking(year);
                                  // setYear(e.value);
                                  setMonthForGraph1(e.value)
                                }}
                              />
                            </div>
                            <div style={{ fontSize: "16px", fontWeight: "bold" }}>Year :</div>
                            <div className="mx-2" style={{ width: "150px" }}>
                              <RSelect
                                key={dropdowntracking}
                                defaultValue={{ label: "2023", value: "2023" }}
                                options={optionsYear}
                                onChange={(e) => {
                                  getDashboardBooking(year);
                                  setYear(e.value);
                                }}
                              />
                            </div>
                          </div>
{monthForGraph1=="All"?
                          < Line
                            data={{
                              labels:newBookingData.map((ele) => ele.monthName),
                              // labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Sep", "Oct", "Nov", "Dec"],
                              datasets: [
                                {
                                  axis: "y",
                                  fill: false,
                                  id: 1,
                                  label: "Total Android Ride",
                                  data: newBookingData.map((ele) => ele.android_ride_booking),
                                  borderColor: "rgb(0, 204, 0)",
                                  backgroundColor: "rgb(0, 204, 0,0.5)",
                                  borderWidth: 2,
                                },
                                {
                                  axis: "y",
                                  fill: false,
                                  id: 2,
                                  label: "Android Confirm Ride",
                                  data: newBookingData.map((ele) => ele.android_confirm_ride),
                                  borderColor: "rgb(5, 117, 5)",
                                  backgroundColor: "rgb(5, 117, 5,0.5)",
                                  borderWidth: 2,
                                },
                                {
                                  axis: "y",
                                  fill: false,
                                  id: 3,
                                  label: "Android Cancel Ride",
                                  data: newBookingData.map((ele) => ele.android_cancel_ride),
                                  borderColor: "rgb(4, 54, 4)",
                                  backgroundColor: "rgb(4, 54, 4,0.5)",
                                  borderWidth: 2,
                                },

                                {
                                  axis: "y",
                                  fill: false,
                                  id: 4,
                                  label: "Total iOS Ride",
                                  data: bookingData.map((ele) => ele.ios_ride_booking),
                                  borderColor: "rgb(53, 162, 235)",
                                  backgroundColor: "rgba(53, 162, 235, 0.5)",
                                  borderWidth: 2,
                                },
                                {
                                  axis: "y",
                                  fill: false,
                                  id: 5,
                                  label: "iOS Confirm Ride",
                                  data: newBookingData.map((ele) => ele.ios_confirm_ride),
                                  borderColor: "rgb(13, 101, 161)",
                                  backgroundColor: "rgba(13, 101, 161, 0.5)",
                                  borderWidth: 2,
                                },
                                {
                                  axis: "y",
                                  fill: false,
                                  id: 6,
                                  label: "iOS Cancel Ride",
                                  data: newBookingData.map((ele) => ele.ios_cancel_ride),
                                  borderColor: "rgb(6, 37, 59)",
                                  backgroundColor: "rgba(6, 37, 59, 0.5)",
                                  borderWidth: 2,
                                },
                                {
                                  axis: "y",
                                  fill: false,
                                  id: 7,
                                  label: "Total Ride",
                                  data: newBookingData.map((ele) => ele.total_ride),
                                  borderColor: "rgb(204, 102, 255)",
                                  backgroundColor: "rgb(204, 102, 255,0.5)",
                                  borderWidth: 2,
                                },
                                {
                                  axis: "y",
                                  fill: false,
                                  id: 8,
                                  label: "Total Confirm",
                                  data: newBookingData.map((ele) => ele.confirm_ride),
                                  borderColor: "rgb(12, 240, 202)",
                                  backgroundColor: "rgb(12, 240, 202,0.5)",
                                  borderWidth: 2,
                                },
                                {
                                  axis: "y",
                                  fill: false,
                                  id: 9,
                                  label: "Total Cancel",
                                  data: newBookingData.map((ele) => ele.cancel_ride),
                                  borderColor: "rgb(255, 51, 0)",
                                  backgroundColor: "rgb(255, 51, 0,0.5)",
                                  borderWidth: 2,
                                },
                              ],
                            }}
                            options={options1}
                          />
                        :
                        < Bar
                            data={{
                              labels:  [monthForGraph1],
                              // labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Sep", "Oct", "Nov", "Dec"],
                              datasets: [
                                {
                                  axis: "y",
                                  fill: false,
                                  id: 1,
                                  label: "Total Android Ride",
                                  data: newBookingData.filter((ele)=>ele.monthName==monthForGraph1).map((ele) => ele.android_ride_booking),
                                  borderColor: "rgb(0, 204, 0)",
                                  backgroundColor: "rgb(0, 204, 0,0.5)",
                                  borderWidth: 2,
                                },
                                {
                                  axis: "y",
                                  fill: false,
                                  id: 2,
                                  label: "Android Confirm Ride",
                                  data: newBookingData.filter((ele)=>ele.monthName==monthForGraph1).map((ele) => ele.android_confirm_ride),
                                  borderColor: "rgb(5, 117, 5)",
                                  backgroundColor: "rgb(5, 117, 5,0.5)",
                                  borderWidth: 2,
                                },
                                {
                                  axis: "y",
                                  fill: false,
                                  id: 3,
                                  label: "Android Cancel Ride",
                                  data: newBookingData.filter((ele)=>ele.monthName==monthForGraph1).map((ele) => ele.android_cancel_ride),
                                  borderColor: "rgb(4, 54, 4)",
                                  backgroundColor: "rgb(4, 54, 4,0.5)",
                                  borderWidth: 2,
                                },

                                {
                                  axis: "y",
                                  fill: false,
                                  id: 4,
                                  label: "Total iOS Ride",
                                  data: bookingData.filter((ele)=>ele.monthName==monthForGraph1).map((ele) => ele.ios_ride_booking),
                                  borderColor: "rgb(53, 162, 235)",
                                  backgroundColor: "rgba(53, 162, 235, 0.5)",
                                  borderWidth: 2,
                                },
                                {
                                  axis: "y",
                                  fill: false,
                                  id: 5,
                                  label: "iOS Confirm Ride",
                                  data: newBookingData.filter((ele)=>ele.monthName==monthForGraph1).map((ele) => ele.ios_confirm_ride),
                                  borderColor: "rgb(13, 101, 161)",
                                  backgroundColor: "rgba(13, 101, 161, 0.5)",
                                  borderWidth: 2,
                                },
                                {
                                  axis: "y",
                                  fill: false,
                                  id: 6,
                                  label: "iOS Cancel Ride",
                                  data: newBookingData.filter((ele)=>ele.monthName==monthForGraph1).map((ele) => ele.ios_cancel_ride),
                                  borderColor: "rgb(6, 37, 59)",
                                  backgroundColor: "rgba(6, 37, 59, 0.5)",
                                  borderWidth: 2,
                                },
                                {
                                  axis: "y",
                                  fill: false,
                                  id: 7,
                                  label: "Total Ride",
                                  data: newBookingData.filter((ele)=>ele.monthName==monthForGraph1).map((ele) => ele.total_ride),
                                  borderColor: "rgb(204, 102, 255)",
                                  backgroundColor: "rgb(204, 102, 255,0.5)",
                                  borderWidth: 2,
                                },
                                {
                                  axis: "y",
                                  fill: false,
                                  id: 8,
                                  label: "Total Confirm",
                                  data: newBookingData.filter((ele)=>ele.monthName==monthForGraph1).map((ele) => ele.confirm_ride),
                                  borderColor: "rgb(12, 240, 202)",
                                  backgroundColor: "rgb(12, 240, 202,0.5)",
                                  borderWidth: 2,
                                },
                                {
                                  axis: "y",
                                  fill: false,
                                  id: 9,
                                  label: "Total Cancel",
                                  data: newBookingData.filter((ele)=>ele.monthName==monthForGraph1).map((ele) => ele.cancel_ride),
                                  borderColor: "rgb(255, 51, 0)",
                                  backgroundColor: "rgb(255, 51, 0,0.5)",
                                  borderWidth: 2,
                                },
                              ],
                            }}
                            options={options1}
                          />
                        }
                        </Paper>
                      ) : (
                        false
                      )}
                    </div>
                    {/* <div className="col-6">
                      {" "}
                      {DataCheck.onlineDataCheck === true ? (
                        <Paper elevation={0}>
                          <Pie
                            data={{
                              labels: onlineUser.map((ele) => (ele._id == null ? "Deleted by Admin" : ele._id)),
                              datasets: [
                                {
                                  id: 1,
                                  label: "Total",
                                  data: onlineUser.map((ele) => ele.total),
                                  borderColor: ["rgb(243,188,0)", "rgb(0,117,164)", "rgb(0,175,130)"],
                                  backgroundColor: ["rgb(243,188,0)", "rgb(0,117,164)", "rgb(0,175,130)"],
                                  borderWidth: 2,
                                },
                              ],
                            }}
                            options={options2}
                          />
                        </Paper>
                      ) : (
                        false
                      )}
                     
                    </div> */}
                    {/* <div className="col-6"> */}
                    {/*  */}
                    {/* </div> */}
                  </div>
                  <div className="row" style={{ padding: "50px" }}>
                    <div
                      className="col-12"
                      style={{ boxShadow: " rgba(0, 0, 0, 0.35) 0px 5px 15px", borderRadius: "10px", backgroundColor: "#fff" }}
                    >
                      {true ? (
                        <Paper elevation={0} style={{}}>
                          <div className="d-flex align-items-center justify-content-end py-3">
                            <div style={{ fontSize: "16px", fontWeight: "bold" }}>Month :</div>
                            <div className="mx-2" style={{ width: "150px" }}>
                              <RSelect
                                key={dropdowntracking}
                                defaultValue={{ label: "January", value: "January" }}
                                options={optionsMonth}
                                onChange={(e) => {
                                  MonthChange(e.value);
                                }}
                              />
                            </div>{" "}
                          </div>
                          <Bar
                            data={{
                              labels: [month],
                              barThickness: 6,
                              maxBarThickness: 8,
                              // labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Sep", "Oct", "Nov", "Dec"],
                              datasets: [
                                {
                                  axis: "y",
                                  fill: false,
                                  id: 1,
                                  label: "Total Earning",
                                  data: newEarningData.map((ele) => ele.total_earning),
                                  borderColor: "rgb(0, 204, 0)",
                                  backgroundColor: "rgb(0, 204, 0,0.5)",
                                  borderWidth: 2,
                                },
                                {
                                  axis: "y",
                                  fill: false,
                                  id: 2,
                                  label: "Total Android Earning",
                                  data: newEarningData.map((ele) => ele.android_ride_booking_earning),
                                  borderColor: "rgb(5, 117, 5)",
                                  backgroundColor: "rgb(5, 117, 5,0.5)",
                                  borderWidth: 2,
                                },
                                {
                                  axis: "y",
                                  fill: false,
                                  id: 3,
                                  label: "Total Android Driver Earning",
                                  data: newEarningData.map((ele) => ele.android_ride_booking_driver_earning),
                                  borderColor: "rgb(4, 54, 4)",
                                  backgroundColor: "rgb(4, 54, 4,0.5)",
                                  borderWidth: 2,
                                },

                                {
                                  axis: "y",
                                  fill: false,
                                  id: 4,
                                  label: "Total Android Admin Earning",
                                  data: newEarningData.map((ele) => ele.android_ride_booking_admin_earning),
                                  borderColor: "rgb(53, 162, 235)",
                                  backgroundColor: "rgba(53, 162, 235, 0.5)",
                                  borderWidth: 2,
                                },
                                {
                                  axis: "y",
                                  fill: false,
                                  id: 5,
                                  label: "Total iOS Earning",
                                  data: newEarningData.map((ele) => ele.ios_ride_booking_earning),
                                  borderColor: "rgb(13, 101, 161)",
                                  backgroundColor: "rgba(13, 101, 161, 0.5)",
                                  borderWidth: 2,
                                },
                                {
                                  axis: "y",
                                  fill: false,
                                  id: 6,
                                  label: "Total iOS Driver Earning",
                                  data: newEarningData.map((ele) => ele.ios_ride_booking_driver_earning),
                                  borderColor: "rgb(6, 37, 59)",
                                  backgroundColor: "rgba(6, 37, 59, 0.5)",
                                  borderWidth: 2,
                                },
                                {
                                  axis: "y",
                                  fill: false,
                                  id: 7,
                                  label: "Total iOS Admin Earning",
                                  data: newEarningData.map((ele) => ele.ios_ride_booking_admin_earning),
                                  borderColor: "rgb(204, 102, 255)",
                                  backgroundColor: "rgb(204, 102, 255,0.5)",
                                  borderWidth: 2,
                                },
                              ],
                            }}
                            options={options3}
                          />
                        </Paper>
                      ) : (
                        false
                      )}
                    </div>
                  </div>
                  {/* <div className="row">
                    <div className="col-6">
                      <Line
                        data={{
                          labels: ["Jun", "Jul", "Aug"],
                          datasets: [
                            {
                              axis: "y",
                              fill: false,
                              id: 1,
                              label: "User Data",
                              data: [5, 6, 7],
                              backgroundColor: "rgba(255, 99, 132, 0.5)",
                              borderColor: [
                                "rgba(255, 99, 132, 1)",
                                "rgba(54, 162, 235, 1)",
                                "rgba(255, 206, 86, 1)",
                                // "rgba(75, 192, 192, 1)",
                                // "rgba(153, 102, 255, 1)",
                                // "rgba(255, 159, 64, 1)",
                              ],
                              borderWidth: 1,
                            },
                            // {
                            //   id: 2,
                            //   label: "",
                            //   data: [3, 2, 1],
                            // },
                          ],
                        }}
                      />
                    </div>
                    <div className="col-6">
                      <Line
                        data={{
                          labels: ["Jun", "Jul", "Aug"],
                          datasets: [
                            {
                              axis: "y",
                              fill: false,
                              id: 1,
                              label: "User Data",
                              data: [5, 6, 7],
                              backgroundColor: [
                                "rgba(255, 99, 132, 0.2)",
                                "rgba(54, 162, 235, 0.2)",
                                "rgba(255, 206, 86, 0.2)",
                                // "rgba(75, 192, 192, 0.2)",
                                // "rgba(153, 102, 255, 0.2)",
                                // "rgba(255, 159, 64, 0.2)",
                              ],
                              borderColor: [
                                "rgba(255, 99, 132, 1)",
                                "rgba(54, 162, 235, 1)",
                                "rgba(255, 206, 86, 1)",
                                // "rgba(75, 192, 192, 1)",
                                // "rgba(153, 102, 255, 1)",
                                // "rgba(255, 159, 64, 1)",
                              ],
                              borderWidth: 1,
                            },
                            // {
                            //   id: 2,
                            //   label: "",
                            //   data: [3, 2, 1],
                            // },
                          ],
                        }}
                      />
                    </div>
                  </div> */}
                </Paper>

                {/* //new design */}

                {/* <br /> */}

                {/* status end */}
              </div>
            </div>
          </Paper>
        </div>
      </div>
    </React.Fragment>
  );
};

export default StarterPage;
