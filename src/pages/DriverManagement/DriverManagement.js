import React, { useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import axios from "../../axios";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import moment from "moment";
// import Switch from '@mui/material/Switch';
// import { styled } from '@mui/material/styles';
// import Skeleton from 'react-loading-skeleton'
// import 'react-loading-skeleton/dist/skeleton.css'
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
  Checkbox,
} from "@material-ui/core";
import DatePicker from "react-date-picker";
import Swal from "sweetalert2";
import { confirm } from "react-confirm-box";

// import { Delete } from '@material-ui/icons';
import VisibilityIcon from "@material-ui/icons/Visibility";
import BlockIcon from "@material-ui/icons/Block";
// import ArrowBackIcon from "@material-ui/icons/ArrowBack";

// For Table
import SearchBar from "material-ui-search-bar";
import { get, identity, orderBy, sortBy } from "lodash";

//history
import { useHistory } from "react-router-dom";
// import AddEditCategory from "../AccountManagement/Account_Details";

// import './Category_Management.css' ;
import EditIcon from "@material-ui/icons/Edit";
import { DeleteOutline, WidgetsOutlined } from "@material-ui/icons";
import ModalVideo from "react-modal-video";
// import 'node_modules/react-modal-video/scss/modal-video.scss';
import VideocamIcon from "@material-ui/icons/Videocam";
import DRIVER from "axios";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Formik, Field, Form } from "formik";
import { Close, Search } from "@material-ui/icons";
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
    // maxHeight: "58vh",
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
          backgroundColor: theme.palette.mode === "dark" ? "#006FFF" : "#006FFF",
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

export default function DriverManagement(props) {
  const classes = useStyles();
  const location = useLocation();
  const fileRef = useRef(null);
  // const history=useHistory();

  const [tableData, setTableData] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startFilterValue, setStartFilterValue] = useState("");
  const [endFilterValue, setEndFilterValue] = useState("");
  const [status, setStatus] = useState("approved");
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [totalUserListCount, settotalUserListCount] = useState(90);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [ServiceTypeButtons, setServiceTypeButtons] = useState([]);
  const [DutyStatus, setDutyStatus] = useState("OFFDUTY");
  const [ActiveInactiveDuty, setActiveInactiveDuty] = useState(0);
  const [ServiceTypeId, setServiceTypeId] = useState("62d53aa9bf652aa3778946ca");
  const [ServiceTypeButtonColor, setServiceTypeButtonColor] = useState({
    SingleTaxi: true,
    DesignatedDriver: false,
    PetCategory: false,
    PackageCategory: false,
  });
  const [StatusButtonColor, setStatusButtonColor] = useState({
    approved: true,
    pending: false,
    disapproved: false,
  });
  let statusArray = ["Approved", "Pending", "Disapproved"];
  const [checkedValue, setCheckedValue] = useState({
    SingleTaxi: false,
    DesignatedDriver: false,
    PetCategory: false,
    PackageCategory: false,
  });
  const [SpecificDriverid, setSpecificDriverid] = useState("");
  // status switch
  // const [checked, setChecked] = useState(true);

  // For Pagination
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    console.log(newPage);
    console.log({ event, newPage });
    getCategoriesContent(newPage + 1, rowsPerPage, status, search);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    console.log(+event.target.value);
    // setRowsPerPage(+event.target.value);
    // setPage(0);
    getCategoriesContent(page, event.target.value, status, search);
    setRowsPerPage(parseInt(event.target.value, 10));
    console.log({ event });
    setPage(0);
  };

  useEffect(() => {
    // const sstatus = location.search;
    // if (sstatus) {
    //   const statusArray = sstatus.split("=");
    //   console.log(statusArray[1], ":::::::::");
    //   setStatus(statusArray[1]);
    //   getCategoriesContent(page, limit, ServiceTypeId, 0, "pending", search);
    // }
    getCategoriesContent();
    getServiceTypes();
  }, []);

  //get content
  const getCategoriesContent = async (
    page = 1,
    limit = 10,
    serviceType = "62d53aa9bf652aa3778946ca",
    JobStatus = 0,
    status = "approved",
    search = "",
    startFilterValue = "",
    endFilterValue = ""
  ) => {
    try {
      const { data } = await axios.get(
        `/private/driverList?page=${page}&limit=${limit}&serviceType=${serviceType}&JobStatus=${JobStatus}&status=${status}&search=${search}&start_date=${startFilterValue}&end_date=${endFilterValue}`
      );
      console.log(data);
      setTableData([...data.data.docs]);
      setSearchedData(data.data.docs);
      settotalUserListCount(data.data.totalDocs);
      setStatus(status);
      setSearch(search);
      if (data.data.docs.length === 0 || data.status === 500) {
        toast.error("No Data Found", {
          position: toast.POSITION.TOP_RIGHT,
        });
      } else {
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getServiceTypes = async () => {
    try {
      const { data } = await DRIVER.get(`${ServiceType_Url}`);
      console.log(data.data);
      setServiceTypeButtons(data.data);
    } catch (error) {
      console.log(error);
    }
  };
  console.log(tableData, "tableData");

  // For Search
  const [searched, setSearched] = useState("");
  const [searchedData, setSearchedData] = useState([]);

  const requestSearch = (searchedVal) => {
    const filteredRows = searchedData.filter((row) => {
      let name = row.first_name + " " + row.last_name;
      let email = row.email_id;
      return name.toLowerCase().includes(searchedVal.toLowerCase()) || email.toLowerCase().includes(searchedVal.toLowerCase());
    });
    setTableData(filteredRows);
  };

  const cancelSearch = () => {
    getCategoriesContent(page, limit, ServiceTypeId, ActiveInactiveDuty, status, "", startFilterValue, endFilterValue);
    // setSearched("");
    //  console.log(searchedData);
    //  requestSearch()
  };

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

  const BlockDriver = async (id) => {
    if (window.confirm("Are you sure you want to block this driver?")) {
      try {
        // console.log(category);
        const { data } = await axios.delete(`/private/driverDelete/${id}?status=block`);
        console.log(data);
        getCategoriesContent(page, limit, ServiceTypeId, ActiveInactiveDuty, status, search, startFilterValue, endFilterValue);
        toast.success("Driver Blocked", {
          position: toast.POSITION.TOP_RIGHT,
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      toast.error("Operation Cancelled", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }

    //      Swal.fire({
    //   title: "Are you sure?",
    //   // text: "You won't be able to revert this!",
    //   icon: "warning",
    //   showCancelButton: true,
    //   confirmButtonColor: "#0e7bff",
    //   cancelButtonColor: "#d33",
    //   confirmButtonText: "Yes, Block User!",
    //   })

    //         .then((result) => {
    //   if (result.isConfirmed) {

    //       const { data } =  axios.post(`/admin/BlockDriver`, {
    //         _id: id,
    //         is_blocked: true,
    //       }).then((res) => {
    //         console.log(res.data);
    //         getCategoriesContent();
    //         Swal.fire("Blocked!", "User has been blocked.", "success");
    //       });

    //   }
    //   else {
    //     Swal.fire("Cancelled", "Operation has been cancelled.", "error");
    //   }
    // });
  };

  const UnBlockDriver = async (id) => {
    if (window.confirm("Are you sure you want to unblock this driver?")) {
      try {
        // console.log(category);
        const { data } = await axios.delete(`/private/driverDelete/${id}?status=unblock`);
        console.log(data);
        getCategoriesContent(page, limit, ServiceTypeId, ActiveInactiveDuty, status, search, startFilterValue, endFilterValue);
        toast.success("Driver Unblocked", {
          position: toast.POSITION.TOP_RIGHT,
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      toast.error("Operation Cancelled", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
    // type2
    //  Swal.fire({
    //    title: "Are you sure?",
    //    // text: "You won't be able to revert this!",
    //    icon: "warning",
    //    showCancelButton: true,
    //    confirmButtonColor: "#0e7bff",
    //    cancelButtonColor: "#d33",
    //    confirmButtonText: "Yes, UnBlock User!",
    //  })
    //  .then((result) => {
    //    if (result.isConfirmed) {
    //      const { data } = axios
    //        .post(`/admin/BlockDriver`, {
    //          _id: id,
    //          is_blocked: false,
    //        })
    //        .then((res) => {
    //          console.log(res.data);
    //          getCategoriesContent();
    //                   Swal.fire(
    //                     "UnBlocked!",
    //                     "User has been unblocked.",
    //                     "success"
    //                   );

    //        });

    //    } else {
    //      Swal.fire("Cancelled", "Operation has been cancelled.", "error");
    //    }
    //  });
  };

  const DeleteDriver = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const { data } = await axios.delete(`/private/driverDelete/${id}?status=delete`);
        getCategoriesContent(page, limit, ServiceTypeId, ActiveInactiveDuty, status, search.startFilterValue, endFilterValue);
        toast.success("Driver Deleted", {
          position: toast.POSITION.TOP_RIGHT,
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      toast.error("You have cancelled the operation", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  useEffect(() => {
    if (startDate === null && endDate === null) {
      getCategoriesContent(page, limit, ServiceTypeId, ActiveInactiveDuty, status, search, startFilterValue, endFilterValue);
    } else if (startDate === null || endDate === null) {
      toast.info("Please Select Both Dates To Get Filtered Data", {
        position: toast.POSITION.TOP_RIGHT,
      });
      getCategoriesContent(page, limit, ServiceTypeId, ActiveInactiveDuty, status, search, startFilterValue, endFilterValue);
    } else if (startDate !== null && endDate !== null) {
      getFilteredData();
    }
  }, [startDate, endDate]);

  console.log(startDate);
  console.log(endDate);

  const getFilteredData = async () => {
    console.log(startDate);
    console.log(endDate);
    let newData = new Date(startDate);
    let newData1 = new Date(endDate);
    let startDateVariable = newData.getFullYear() + "-" + (newData.getMonth() + 1) + "-" + newData.getDate();
    let endDateVariable = newData1.getFullYear() + "-" + (newData1.getMonth() + 1) + "-" + newData1.getDate();
    setStartFilterValue(startDateVariable);
    setEndFilterValue(endDateVariable);

    try {
      const { data } = await axios.get(
        `/private/driverList?page=${page}&limit=${limit}&serviceType=${ServiceTypeId}&JobStatus=${ActiveInactiveDuty}&status=${status}&search=${search}&start_date=${startDateVariable}&end_date=${endDateVariable}`
      );
      console.log(data);

      console.log(newData.getFullYear() + "-" + (newData.getMonth() + 1) + "-" + newData.getDate());
      console.log(newData.getFullYear() + "-" + (newData1.getMonth() + 1) + "-" + newData1.getDate());
      console.log(newData1.toLocaleDateString());
      if (data.data.docs !== null && data.data.docs.length > 0) {
        setTableData([...data.data.docs]);

        settotalUserListCount(data.data.totalDocs);
        setStatus(status);
        setSearch(search);
        toast.success("Filtered Data", {
          position: toast.POSITION.TOP_RIGHT,
        });
      } else {
        setTableData([]);
        toast.error("No Data Found", {
          position: toast.POSITION.TOP_RIGHT,
        });
        setSearchedData([]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const ViewDriverData = (data) => {
    props.history.push({
      pathname: "/adminPanel/driver-view",
      state: data,
    });
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

  const SearchDriver = myDeb((search) => {
    getCategoriesContent(page, limit, ServiceTypeId, ActiveInactiveDuty, status, search, startFilterValue, endFilterValue);
  });

  const sortData = () => {
    let data = tableData.sort((objA, objB) => new Date(objB.driver.createdAt) - new Date(objA.driver.createdAt));
    return data;
  };

  console.log(sortData());

  const sanitizeRating = (rating) => {
    let regexNumber = /^[0-9]+$/;
    if (regexNumber.test(rating)) {
      return rating;
    } else if (typeof rating === "number") {
      // return rating.slice(0, 3);

      return +rating.toFixed(1);
    }
  };
  const blockServices = (values) => {
    let newData = [];
    console.log("checkedValues", checkedValue);
    if (checkedValue.SingleTaxi) {
      newData.push(values.SingleTaxi);
    }
    if (checkedValue.DesignatedDriver) {
      newData.push(values.DesignatedDriver);
    }
    if (checkedValue.PetCategory) {
      newData.push(values.PetCategory);
    }
    if (checkedValue.PackageCategory) {
      newData.push(values.PackageCategory);
    }

    let finalData = newData.filter((a) => a);
    console.log(finalData);
    try {
      const { data } = axios.post(`/private/driverBlockServices/${SpecificDriverid}`, {
        serviceIds: finalData,
      });
      console.log(data);
      setSpecificDriverid("");
      setOpen(false);
      setCheckedValue({
        ...checkedValue,
        SingleTaxi: false,
        DesignatedDriver: false,
        PetCategory: false,
        PackageCategory: false,
      });
      getCategoriesContent(page, limit, ServiceTypeId, ActiveInactiveDuty, status, search, startFilterValue, endFilterValue);
      toast.success("Success", { position: "top-right" });
    } catch (error) {
      console.log(error);
    }
  };

  console.log(checkedValue);

  return (
    <React.Fragment>
      <div className="page-content">
        <div className={classes.root}>
          <Paper>
            <div className={classes.paperPaddingRightLeft}>
              <div className="">
                <Paper elevation={0} className={classNames(classes.paperHeading, classes.headingAlignment)}>
                  <h3 style={{}}>Manage Driver</h3>
                  <SearchBar
                    // value={searched}
                    style={{ width: "30%", marginTop: 70 }}
                    className="heightfix"
                    onChange={(searchVal) => SearchDriver(searchVal)}
                    onCancelSearch={() => cancelSearch()}
                    placeholder="Search by User Name,Mobile Number"
                  />
                  <div>
                    <style>
                      {`
                        .react-date-picker__calendar{
                          z-index: 3 !important;
                        }
                      `}
                    </style>
                    <div className="d-flex text-center align-items-baseline ">
                      <h5>From:</h5> &nbsp;
                      <DatePicker
                        value={startDate}
                        dateFormat="DD/MM/YYYY"
                        onChange={(date) => {
                          setStartDate(date);
                        }}
                      />
                      &emsp;<h5>To:&nbsp;</h5>
                      <DatePicker
                        onChange={(date) => {
                          setEndDate(date);
                        }}
                        minDate={startDate}
                        value={endDate}
                        dateFormat="DD/MM/YYYY"
                      />
                      <Button
                        variant="contained"
                        className="buttoncss mx-3"
                        style={{ backgroundColor: "#006FFF", color: "#fff" }}
                        onClick={() => {
                          setStartDate(null);
                          setEndDate(null);
                          setStartFilterValue("");
                          setEndFilterValue("");
                        }}
                      >
                        {" "}
                        RESET
                      </Button>
                    </div>
                  </div>
                </Paper>

                <Paper elevation={0} className="my-3"></Paper>

                {/* //new design */}

                {/* <br /> */}

                {/* status end */}
                <Paper elevation={0}>
                  <div className="d-flex justify-content-center">
                    {ServiceTypeButtons.map((ele, i) => (
                      <Button
                        key={i}
                        variant="contained"
                        className="buttoncss mx-3"
                        style={{
                          backgroundColor: Object.values(ServiceTypeButtonColor)[i] ? "#006FFF" : "#c4c4c4",
                          color: "#fff",
                        }}
                        onClick={() => {
                          setServiceTypeId(ele._id);
                          setDutyStatus("ONDUTY");
                          switch (i) {
                            case 0:
                              setServiceTypeButtonColor({
                                ...ServiceTypeButtonColor,
                                SingleTaxi: true,
                                DesignatedDriver: false,
                                PetCategory: false,
                                PackageCategory: false,
                              });
                              setStatusButtonColor({
                                ...StatusButtonColor,
                                approved: true,
                                pending: false,
                                disapproved: false,
                              });
                              getCategoriesContent(
                                0,
                                10,
                                ele._id,
                                ActiveInactiveDuty,
                                "approved",
                                "",
                                startFilterValue,
                                endFilterValue
                              );

                              break;
                            case 1:
                              setServiceTypeButtonColor({
                                ...ServiceTypeButtonColor,
                                SingleTaxi: false,
                                DesignatedDriver: true,
                                PetCategory: false,
                                PackageCategory: false,
                              });
                              setStatusButtonColor({
                                ...StatusButtonColor,
                                approved: true,
                                pending: false,
                                disapproved: false,
                              });
                              getCategoriesContent(
                                0,
                                10,
                                ele._id,
                                ActiveInactiveDuty,
                                "approved",
                                "",
                                startFilterValue,
                                endFilterValue
                              );
                              break;
                            case 2:
                              setServiceTypeButtonColor({
                                ...ServiceTypeButtonColor,
                                SingleTaxi: false,
                                DesignatedDriver: false,
                                PetCategory: true,
                                PackageCategory: false,
                              });
                              setStatusButtonColor({
                                ...StatusButtonColor,
                                approved: true,
                                pending: false,
                                disapproved: false,
                              });
                              getCategoriesContent(
                                0,
                                10,
                                ele._id,
                                ActiveInactiveDuty,
                                "approved",
                                "",
                                startFilterValue,
                                endFilterValue
                              );
                              break;
                            case 3:
                              setServiceTypeButtonColor({
                                ...ServiceTypeButtonColor,
                                SingleTaxi: false,
                                DesignatedDriver: false,
                                PetCategory: false,
                                PackageCategory: true,
                              });
                              setStatusButtonColor({
                                ...StatusButtonColor,
                                approved: true,
                                pending: false,
                                disapproved: false,
                              });
                              getCategoriesContent(
                                0,
                                10,
                                ele._id,
                                ActiveInactiveDuty,
                                "approved",
                                "",
                                startFilterValue,
                                endFilterValue
                              );
                              break;

                            default:
                              break;
                          }
                        }}
                      >
                        {ele.title}
                      </Button>
                    ))}
                  </div>
                  <div className="d-flex  my-3">
                    <div style={{ flex: 1 }}></div>
                    <div style={{ flex: 2, justifyContent: "center", display: "flex" }}>
                      {statusArray.map((ele, i) => (
                        <Button
                          variant="contained"
                          // className={status === "approved" ? "buttoncss mx-1 highlight " : "buttoncss mx-1 removehover"}
                          className="buttoncss mx-3"
                          style={{
                            backgroundColor: Object.values(StatusButtonColor)[i] ? "#006FFF" : "#c4c4c4",
                            color: "#fff",
                          }}
                          onClick={() => {
                            switch (i) {
                              case 0:
                                setStatus("approved");
                                setStatusButtonColor({
                                  ...StatusButtonColor,
                                  approved: true,
                                  pending: false,
                                  disapproved: false,
                                });
                                getCategoriesContent(
                                  0,
                                  10,
                                  ServiceTypeId,
                                  ActiveInactiveDuty,
                                  "approved",
                                  search,
                                  startFilterValue,
                                  endFilterValue
                                );
                                break;
                              case 1:
                                setStatus("pending");
                                setStatusButtonColor({
                                  ...StatusButtonColor,
                                  approved: false,
                                  pending: true,
                                  disapproved: false,
                                });
                                getCategoriesContent(
                                  0,
                                  10,
                                  ServiceTypeId,
                                  ActiveInactiveDuty,
                                  "pending",
                                  search,
                                  startFilterValue,
                                  endFilterValue
                                );
                                break;
                              case 2:
                                setStatus("disapproved");
                                setStatusButtonColor({
                                  ...StatusButtonColor,
                                  approved: false,
                                  pending: false,
                                  disapproved: true,
                                });
                                getCategoriesContent(
                                  0,
                                  10,
                                  ServiceTypeId,
                                  ActiveInactiveDuty,
                                  "disapproved",
                                  search,
                                  startFilterValue,
                                  endFilterValue
                                );
                                break;

                              default:
                                break;
                            }
                          }}
                        >
                          {ele}
                        </Button>
                      ))}
                    </div>
                    <div style={{ flex: 1, justifyContent: "flex-end", display: "flex" }}>
                      {DutyStatus === "OFFDUTY" ? (
                        <Tooltip arrow title="Click to toggle duty">
                          <Button
                            variant="contained"
                            className=" mx-3"
                            style={{ backgroundColor: "#006FFF", color: "#fff" }}
                            onClick={() => {
                              setDutyStatus("ONDUTY");
                              setActiveInactiveDuty(1);
                              getCategoriesContent(page, limit, ServiceTypeId, 1, status, "", startFilterValue, endFilterValue);
                            }}
                          >
                            OFF DUTY
                          </Button>
                        </Tooltip>
                      ) : (
                        <Tooltip arrow title="Click to toggle duty">
                          <Button
                            variant="contained"
                            className=" mx-3"
                            style={{ backgroundColor: "#006FFF", color: "#fff" }}
                            onClick={() => {
                              setDutyStatus("OFFDUTY");
                              setActiveInactiveDuty(0);
                              getCategoriesContent(page, limit, ServiceTypeId, 0, status, "", startFilterValue, endFilterValue);
                            }}
                          >
                            ON DUTY
                          </Button>
                        </Tooltip>
                      )}
                    </div>
                  </div>
                </Paper>

                <Paper>
                  <TableContainer className={classes.container}>
                    <Table className={classes.table} stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Sr. No.</TableCell>
                          <TableCell style={{ textAlign: "center", fontWeight: "bold" }}> Driver Id</TableCell>
                          <TableCell style={{ textAlign: "center", fontWeight: "bold" }}> Driver Name</TableCell>

                          {/* <TableCell
                            style={{ textAlign: "center", fontWeight: "bold" }}
                          >
                            Profile Image
                          </TableCell> */}
                          <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Email Id</TableCell>
                          <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Average Rating</TableCell>
                          <TableCell style={{ textAlign: "center", fontWeight: "bold" }}> Mobile Number</TableCell>
                          {/* <TableCell style={{ textAlign: "center", fontWeight: "bold" }}> Service Name</TableCell> */}

                          {/* {status === "approved" && (
                            <TableCell
                              style={{
                                textAlign: "center",
                                fontWeight: "bold",
                              }}
                            >
                              {" "}
                              Job Status
                            </TableCell>
                          )} */}

                          <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Date of Joining</TableCell>
                          <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Block/Unblock Services</TableCell>

                          <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Actions</TableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {/* {isLoading?<TableRow ><Skeleton style={{width:"70vw",borderRadius:"20px"}} highlightColor="#fff" height="1rem" count={2} baseColor="#ebebeb"/></TableRow>:false} */}
                        {
                          // sortData()
                          tableData
                            // sorting()
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
                                  {get(category, "driver.user_id", "N/A")}
                                </TableCell>
                                <TableCell className={classes.textMiddle} style={{ textAlign: "center" }}>
                                  {category.driver.username === null
                                    ? "N/A"
                                    : category.driver.username.charAt(0).toUpperCase() + category.driver.username.slice(1)}
                                </TableCell>
                                <TableCell className={classes.textMiddle} style={{ textAlign: "center" }}>
                                  {get(category.driver, "email", "N/A")}
                                </TableCell>
                                <TableCell className={classes.textMiddle} style={{ textAlign: "center" }}>
                                  {/* {get(category, "rating", "N/A")} */}
                                  {category.rating ? sanitizeRating(category.rating) : "N/A"}
                                </TableCell>
                                <TableCell className={classes.textMiddle} style={{ textAlign: "center" }}>
                                  {get(category.driver, "countryCode", "N/A") + get(category.driver, "phone", "N/A")}
                                </TableCell>
                                {/* <TableCell className={classes.textMiddle} style={{ textAlign: "center" }}>
                                  {category.service_type
                                    ? category.service_type === "Taxi Single"
                                      ? "Single Taxi"
                                      : category.service_type
                                    : "N/A"}
                                </TableCell> */}
                                {/* {status === "approved" && (
                                  <TableCell className={classes.textMiddle} style={{ textAlign: "center" }}>
                                    {category?.startDuty === false ? "Off Duty" : "On Duty"}
                                  </TableCell>
                                )} */}

                                <TableCell style={{ textAlign: "center" }}>
                                  {category.driver.createdAt
                                    ? new Date(category.driver.createdAt)
                                        // .toUTCString()
                                        .getUTCDate() +
                                      "/" +
                                      (new Date(category.driver.createdAt)
                                        // .toUTCString()
                                        .getUTCMonth() +
                                        1) +
                                      "/" +
                                      new Date(category.driver.createdAt)
                                        // .toUTCString()
                                        .getUTCFullYear()
                                    : // moment.utc(category.createdAt).format("L")
                                      "N/A"}
                                </TableCell>
                                <TableCell className={classes.textMiddle} style={{ textAlign: "center" }}>
                                  <Button
                                    onClick={() => {
                                      setSpecificDriverid(category.driver._id);
                                      setOpen(true);
                                      let newObj = {};
                                      if (category.blockService) {
                                        if (category.blockService.includes("62d53aa9bf652aa3778946ca")) {
                                          // setCheckedValue({ ...checkedValue, SingleTaxi: true });
                                          Object.assign(newObj, { SingleTaxi: true });
                                        }
                                        if (category.blockService.includes("62d53abebf652aa3778946cd")) {
                                          // setCheckedValue({ ...checkedValue, DesignatedDriver: true });
                                          Object.assign(newObj, { DesignatedDriver: true });
                                        }
                                        if (category.blockService.includes("62d53ad1bf652aa3778946d0")) {
                                          // setCheckedValue({ ...checkedValue, PetCategory: true });
                                          Object.assign(newObj, { PetCategory: true });
                                        }
                                        if (category.blockService.includes("62d53ae6bf652aa3778946d3")) {
                                          // setCheckedValue({ ...checkedValue, PackageCategory: true });
                                          Object.assign(newObj, { PackageCategory: true });
                                        }
                                        setCheckedValue(newObj);
                                      }
                                    }}
                                    size="small"
                                    className=""
                                    style={{
                                      border: "1.5px solid #c4c4c4",
                                      margin: "0.3rem",
                                      // color: "#2765B3",
                                    }}
                                  >
                                    {" "}
                                    <BlockIcon />
                                  </Button>
                                </TableCell>

                                {/* <TableCell style={{textAlign:"center"}}>{category.doc?<img src={category.doc} alt="doc" style={{width:"50px",height:"50px"}}/>:"No Doc"}</TableCell> */}
                                <TableCell className={classes.textMiddle} style={{ textAlign: "center" }}>
                                  <Button
                                    onClick={() => ViewDriverData(category)}
                                    size="small"
                                    className=""
                                    style={{
                                      border: "1.5px solid #c4c4c4",
                                      margin: "0.3rem",
                                      // color: "#2765B3",
                                    }}
                                  >
                                    <Tooltip title="Tap to verify" arrow>
                                      <VisibilityIcon />
                                    </Tooltip>
                                  </Button>
                                  {/* <Button onClick={()=>BlockCategory} style={{backgroundColor:"#696969"}} >Manage</Button> */}

                                  {/* <Button onClick={()=>BlockCategory} style={{backgroundColor:"#696969"}} >Manage</Button> */}

                                  <Button
                                    size="small"
                                    className=""
                                    onClick={() =>
                                      category.driver.isBlock === "block"
                                        ? UnBlockDriver(category._id)
                                        : BlockDriver(category._id)
                                    }
                                    style={{
                                      border: "1.5px solid #c4c4c4",
                                      margin: "0.3rem",
                                      color: category.driver.isBlock === "block" ? "red" : "#696969",
                                    }}
                                  >
                                    <Tooltip title="Block/Unblock" arrow>
                                      <BlockIcon />
                                    </Tooltip>{" "}
                                  </Button>
                                  {/* <Button onClick={()=>BlockCategory} style={{backgroundColor:"#696969"}} >Manage</Button> */}

                                  <Button
                                    size="small"
                                    className=""
                                    onClick={() => DeleteDriver(category._id)}
                                    style={{
                                      border: "1.5px solid #c4c4c4",
                                      margin: "0.3rem",
                                      color: "#696969",
                                    }}
                                  >
                                    <Tooltip title="Delete" arrow>
                                      <DeleteOutline />
                                    </Tooltip>
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                        }
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TablePagination
                    rowsPerPageOptions={totalUserListCount >= 100 ? [10, 25, 100] : totalUserListCount > 10 ? [10, 25] : [10]}
                    component="div"
                    count={totalUserListCount}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
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
            onClick={() => {
              setSpecificDriverid("");
              setOpen(false);
              setCheckedValue({
                ...checkedValue,
                SingleTaxi: false,
                DesignatedDriver: false,
                PetCategory: false,
                PackageCategory: false,
              });
            }}
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
                  SingleTaxi: "62d53aa9bf652aa3778946ca",
                  DesignatedDriver: "62d53abebf652aa3778946cd",
                  PetCategory: "62d53ad1bf652aa3778946d0",
                  PackageCategory: "62d53ae6bf652aa3778946d3",
                }}
                onSubmit={(values) => {
                  blockServices(values);
                }}
              >
                {({ values, setFieldValue }) => (
                  <Form>
                    <br />
                    <div className="container">
                      <div className="row justify-content-center align-items-center text-center">
                        {" "}
                        <div className="col-6">
                          <label className="" style={{}}>
                            Single Taxi : &nbsp;
                          </label>
                        </div>
                        <div className="col-6">
                          <IOSSwitch
                            onChange={(e) => {
                              console.log(e.target.checked);
                              console.log(e.target.value);
                              setCheckedValue({ ...checkedValue, SingleTaxi: e.target.checked });
                              if (e.target.checked || checkedValue.SingleTaxi) {
                                setFieldValue("SingleTaxi", e.target.value);
                                setFieldValue("DesignatedDriver", values.DesignatedDriver);
                                setFieldValue("PetCategory", values.PetCategory);
                                setFieldValue("PackageCategory", values.PackageCategory);
                              }
                            }}
                            checked={checkedValue.SingleTaxi}
                            value="62d53aa9bf652aa3778946ca"
                          />
                          {/* <input
                            className=""
                            name="SingleTaxi"
                            // variant="outlined"
                            ref={fileRef}
                            type="checkbox"
                            // inputProps={{name: "name"}}
                            // autoComplete="off"
                            value="62d53aa9bf652aa3778946ca"
                            style={{
                              // width: 300,
                              height: 35,
                              borderRadius: 5,
                              borderColor: "#d3d3d3",
                              borderStyle: "solid",
                              borderWidth: 1,
                              // paddingInlineStart: 10,
                            }}
                            onChange={(e) => {
                              console.log(e.target.checked);
                              setCheckedValue({ ...checkedValue, SingleTaxi: e.target.checked });
                              if (e.target.checked || checkedValue.SingleTaxi) {
                                setFieldValue("SingleTaxi", e.target.value);
                                setFieldValue("DesignatedDriver", values.DesignatedDriver);
                                setFieldValue("PetCategory", values.PetCategory);
                                setFieldValue("PackageCategory", values.PackageCategory);
                              }
                            }}
                            checked={checkedValue.SingleTaxi}
                            // readOnly
                          /> */}

                          {/* <KErrorMessage name="name" /> */}
                        </div>
                      </div>
                      <br />
                      <div className="row justify-content-center align-items-center text-center">
                        <div className="col-6">
                          <label className="" style={{}}>
                            Designated Driver : &nbsp;
                          </label>
                        </div>
                        <div className="col-6">
                          <IOSSwitch
                            onChange={(e) => {
                              console.log(e.target.checked);
                              console.log(e.target.value);
                              setCheckedValue({ ...checkedValue, DesignatedDriver: e.target.checked });
                              if (e.target.checked || checkedValue.DesignatedDriver) {
                                setFieldValue("DesignatedDriver", e.target.value);
                                setFieldValue("SingleTaxi", values.SingleTaxi);
                                setFieldValue("PetCategory", values.PetCategory);
                                setFieldValue("PackageCategory", values.PackageCategory);
                              }
                            }}
                            checked={checkedValue.DesignatedDriver}
                            value="62d53abebf652aa3778946cd"
                          />
                          {/* <Field
                            className=""
                            name="DesignatedDriver"
                            // variant="outlined"
                            type="checkbox"
                            // inputProps={{name: "name"}}
                            // autoComplete="off"
                            style={{
                              // width: 300,
                              height: 35,
                              borderRadius: 5,
                              borderColor: "#d3d3d3",
                              borderStyle: "solid",
                              borderWidth: 1,
                              // paddingInlineStart: 10,
                            }}
                            onChange={(e) => {
                              console.log(e.target.checked);
                              setCheckedValue({ ...checkedValue, DesignatedDriver: e.target.checked });
                              if (e.target.checked || checkedValue.DesignatedDriver) {
                                setFieldValue("DesignatedDriver", e.target.value);
                                setFieldValue("SingleTaxi", values.SingleTaxi);
                                setFieldValue("PetCategory", values.PetCategory);
                                setFieldValue("PackageCategory", values.PackageCategory);
                              }
                            }}
                            checked={checkedValue.DesignatedDriver}
                            value="62d53abebf652aa3778946cd"
                            // readOnly
                          /> */}
                          {/* <KErrorMessage name="upload" /> */}
                        </div>
                      </div>
                      <br />
                      <div className="row justify-content-center align-items-center text-center">
                        <div className="col-6">
                          <label className="" style={{}}>
                            Pet Category : &nbsp;
                          </label>
                        </div>
                        <div className="col-6">
                          <IOSSwitch
                            onChange={(e) => {
                              console.log(e.target.checked);
                              console.log(e.target.value);
                              setCheckedValue({ ...checkedValue, PetCategory: e.target.checked });
                              if (e.target.checked || checkedValue.PetCategory) {
                                setFieldValue("SingleTaxi", values.SingleTaxi);
                                setFieldValue("DesignatedDriver", values.DesignatedDriver);
                                setFieldValue("PetCategory", e.target.value);
                                setFieldValue("PackageCategory", values.PackageCategory);
                              }
                            }}
                            checked={checkedValue.PetCategory}
                            value="62d53ad1bf652aa3778946d0"
                          />
                          {/* <Field
                            className=""
                            name="PetCategory"
                            // variant="outlined"
                            type="checkbox"
                            // inputProps={{name: "name"}}
                            // autoComplete="off"
                            style={{
                              // width: 300,
                              height: 35,
                              borderRadius: 5,
                              borderColor: "#d3d3d3",
                              borderStyle: "solid",
                              borderWidth: 1,
                              // paddingInlineStart: 10,
                            }}
                            onChange={(e) => {
                              console.log(e.target.checked);
                              setCheckedValue({ ...checkedValue, PetCategory: e.target.checked });
                              if (e.target.checked || checkedValue.PetCategory) {
                                setFieldValue("SingleTaxi", values.SingleTaxi);
                                setFieldValue("DesignatedDriver", values.DesignatedDriver);
                                setFieldValue("PetCategory", e.target.value);
                                setFieldValue("PackageCategory", values.PackageCategory);
                              }
                            }}
                            checked={checkedValue.PetCategory}
                            value="62d53ad1bf652aa3778946d0"
                            // readOnly
                          /> */}
                          {/* <KErrorMessage name="upload" /> */}
                        </div>
                      </div>
                      <br />
                      <div className="row justify-content-center align-items-center text-center">
                        <div className="col-6">
                          <label className="" style={{}}>
                            Package Category : &nbsp;
                          </label>
                        </div>
                        <div className="col-6">
                          <IOSSwitch
                            onChange={(e) => {
                              console.log(e.target.checked);
                              console.log(e.target.value);
                              setCheckedValue({ ...checkedValue, PackageCategory: e.target.checked });
                              if (e.target.checked || checkedValue.PackageCategory) {
                                setFieldValue("SingleTaxi", values.SingleTaxi);
                                setFieldValue("DesignatedDriver", values.DesignatedDriver);
                                setFieldValue("PetCategory", values.PetCategory);
                                setFieldValue("PackageCategory", e.target.value);
                              }
                            }}
                            checked={checkedValue.PackageCategory}
                            value="62d53ae6bf652aa3778946d3"
                          />
                          {/* <Field
                            className=""
                            name="PackageCategory"
                            // variant="outlined"
                            type="checkbox"
                            // inputProps={{name: "name"}}
                            // autoComplete="off"
                            style={{
                              // width: 300,
                              height: 35,
                              borderRadius: 5,
                              borderColor: "#d3d3d3",
                              borderStyle: "solid",
                              borderWidth: 1,
                              // paddingInlineStart: 10,
                            }}
                            // readOnly
                            onChange={(e) => {
                              console.log(e.target.checked);
                              setCheckedValue({ ...checkedValue, PackageCategory: e.target.checked });
                              if (e.target.checked || checkedValue.PackageCategory) {
                                setFieldValue("SingleTaxi", values.SingleTaxi);
                                setFieldValue("DesignatedDriver", values.DesignatedDriver);
                                setFieldValue("PetCategory", values.PetCategory);
                                setFieldValue("PackageCategory", e.target.value);
                              }
                            }}
                            checked={checkedValue.PackageCategory}
                            value="62d53ae6bf652aa3778946d3"
                          /> */}
                          {/* <KErrorMessage name="upload" /> */}
                        </div>
                      </div>
                      <br />
                      <br />
                      <div className="text-center">
                        <Button
                          type="submit"
                          variant="contained"
                          className="buttoncss"
                          style={{ backgroundColor: "#006FFF", color: "#fff" }}
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
              <br />
            </div>
            {/* </DialogContentText> */}
          </DialogContent>
        </Dialog>
      </div>
    </React.Fragment>
  );
}
