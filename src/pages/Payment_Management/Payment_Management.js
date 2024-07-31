import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import axios from "../../axios";
import { toast } from "react-toastify";
import moment from "moment";
// import Switch from '@mui/material/Switch';
// import { styled } from '@mui/material/styles';
// import Skeleton from 'react-loading-skeleton'
// import 'react-loading-skeleton/dist/skeleton.css'
import { Close, Search } from "@material-ui/icons";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ReactPaginate from "react-paginate";
import { getDateFormat } from "../../helpers/helperFunction";

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

export default function Payment_Management(props) {
  const classes = useStyles();

  // const history=useHistory();

  const [tableData, setTableData] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [PaginationData, setPaginationData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
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
    getCategoriesContent(0, event.target.value, Incomplete, search);
    console.log("checkrows");
    setRowsPerPage(parseInt(event.target.value, 10));
    console.log({ event });
    setPage(0);
  };

  // useEffect(() => {
  //   getCategoriesContent();
  // }, []);

  //get content
  const [pagenumber, setPageNumber] = useState(1);
  const [totalUserListCount, settotalUserListCount] = useState(90);
  const [limit, setLimit] = useState(10);
  const [Incomplete, setIncomplete] = useState(true);
  const [search, setSearch] = useState("");
  const getCategoriesContent = async (page = 1, limit = 10, Incomplete = true, search = "") => {
    try {
      const { data } = await axios
        .get
        // `/private/userList?page=${page}&limit=${limit}&incomplete=${Incomplete}&search=${search}`
        ();
      console.log(data);
      setTableData([...data.data.docs]);
      setSearchedData(data.data.docs);
      settotalUserListCount(data.data.totalDocs);
      setIncomplete(Incomplete);
      setSearch(search);
      // setPaginationData(data.data);
      // setIsLoading(false);
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

  const requestSearch = (searchedVal) => {
    console.log(searchedVal);

    const filteredRows = searchedData.filter((row) => {
      let name = row.username;
      let email = row.email;
      console.log(row);
      return name.toLowerCase().includes(searchedVal.toLowerCase()) || email.toLowerCase().includes(searchedVal.toLowerCase());
    });
    setTableData(filteredRows);
  };

  const cancelSearch = () => {
    getCategoriesContent(page, limit, Incomplete, "");
    console.log("checkCancel");
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

  const BlockUser = async (id) => {
    if (window.confirm("Are you sure you want to block this user?")) {
      try {
        // console.log(category);
        const { data } = await axios.get(`/private/userDeleteAndBlock?id=${id}&status=block`);
        console.log(data);
        getCategoriesContent(page, limit, Incomplete, search);
        toast.success("User Blocked", {
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

    //       const { data } =  axios.post(`/admin/blockUser`, {
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

  const UnblockUser = async (id) => {
    if (window.confirm("Are you sure you want to unblock this user?")) {
      try {
        // console.log(category);
        const { data } = await axios.get(`/private/userDeleteAndBlock?id=${id}&status=unblock`);
        console.log(data);
        getCategoriesContent(page, limit, Incomplete, search);
        toast.success("User Unblocked", {
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
    //        .post(`/admin/blockUser`, {
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
  console.log(tableData.docs?.length);
  const DeleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        // console.log(category);
        const { data } = await axios.get(`/private/userDeleteAndBlock?id=${id}&status=delete`);
        console.log(data);
        getCategoriesContent(page, limit, Incomplete, search);
        toast.success("User Deleted", {
          position: toast.POSITION.TOP_RIGHT,
        });
      } catch (error) {
        toast.error(error.response.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
        console.log(error);
      }
    } else {
      toast.error("You have cancelled the operation", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  // const [inspectionFormData, setInspectionformData] = useState([]);
  // const getInspectionFormData = async (id) => {
  //   try {
  //     const response = await axios.get(`/admin/inspection/${id}`);
  //     console.log(response);
  //     // setInspectionformData(response.data.data);

  //     props.history.push({
  //       pathname: "/adminPanel/ViewInspectionForm",
  //       state: [response.data.data, id],
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  useEffect(() => {
    if (startDate === null && endDate === null) {
      console.log("check1");
      getCategoriesContent(page, limit, Incomplete, search);
    } else if (startDate === null || endDate === null) {
      toast.info("Please Select Both Dates To Get Filtered Data", {
        position: toast.POSITION.TOP_RIGHT,
      });
      getCategoriesContent(page, limit, Incomplete, search);
      console.log("check2");
    } else if (startDate !== null && endDate !== null) {
      getFilteredData();
      console.log("check3");
    }
  }, [startDate, endDate]);

  const getFilteredData = async () => {
    const FormatedDate = getDateFormat(startDate, endDate);

    try {
      const { data } = await axios.get(
        `/private/userList?page=${page}&limit=${limit}&start_date=${FormatedDate.sDate}&end_date=${FormatedDate.eDate}`
      );

      if (data.data.docs !== null && data.data.docs.length > 0) {
        setTableData([...data.data.docs]);
        setSearchedData(data.data.docs);
        settotalUserListCount(data.data.totalDocs);
        setIncomplete(Incomplete);
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

  const getUserIncompleteData = async () => {
    try {
      const { data } = await axios.get("/private/userList?page=1&limit=10");
      console.log(data);
      setTableData(data.data.docs.filter((e) => e.userProfileUpdate === "false"));
      setSearchedData(data.data.docs.filter((e) => e.userProfileUpdate === "false"));
      // setPaginationData(data.data);
      // setIsLoading(false);
      if (data.data.docs.length === 0) {
        toast.error("No Data Found", {
          position: toast.POSITION.TOP_RIGHT,
        });
      } else {
      }
    } catch (error) {
      console.log(error);
    }
  };
  // useEffect(() => {
  //   getCategoriesContent(page, rowsPerPage, Incomplete, search);
  //   console.log("check0");
  // }, []);
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
    getCategoriesContent(page, rowsPerPage, Incomplete, search.toLowerCase());
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
  let ButtonData = ["USER", "DRIVER", "Commission"];
  return (
    <React.Fragment>
      <div className="page-content">
        <div className={classes.root}>
          <Paper>
            <div className={classes.paperPaddingRightLeft}>
              <div className="">
                <Paper elevation={0} className={classNames(classes.paperHeading, classes.headingAlignment)}>
                  <h3 style={{}}>Manage Payment</h3>
                  <SearchBar
                    // value={searched}
                    style={{ width: "30%", marginTop: 70 }}
                    className="heightfix"
                    onChange={(searchVal) => SearchUser(searchVal)}
                    onCancelSearch={() => cancelSearch()}
                    placeholder="Search by User Name,Mobile Number"
                  />
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
                      }}
                    >
                      {" "}
                      RESET
                    </Button>
                  </div>
                  {/* <style>
                    {`
                        .react-date-picker__calendar{
                          z-index: 3 !important;
                        }
                      `}
                  </style>
                  <div className="d-flex justify-content-center text-center align-items-baseline my-3">
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
                      }}
                    >
                      {" "}
                      RESET
                    </Button>
                  </div> */}
                </Paper>
                <Paper elevation={0} className="my-3 text-center">
                  {ButtonData.map((ele, i) => (
                    <Button
                      key={i}
                      variant="contained"
                      className="buttoncss mx-3"
                      style={{ backgroundColor: "#c4c4c4", color: "#fff" }}
                      onClick={() => {}}
                    >
                      {ele}
                    </Button>
                  ))}
                </Paper>

                {/* //new design */}

                {/* <br /> */}

                {/* status end */}

                <Paper>
                  <TableContainer className={classes.container}>
                    <Table className={classes.table} stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Sr. No.</TableCell>
                          <TableCell style={{ textAlign: "center", fontWeight: "bold" }}> User Id</TableCell>
                          <TableCell style={{ textAlign: "center", fontWeight: "bold" }}> User Name</TableCell>
                          <TableCell style={{ textAlign: "center", fontWeight: "bold" }}> User Type</TableCell>
                          <TableCell style={{ textAlign: "center", fontWeight: "bold" }}> Average Rating</TableCell>
                          {/* <TableCell
                            style={{ textAlign: "center", fontWeight: "bold" }}
                          >
                            Profile Image
                          </TableCell> */}
                          <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Email Id</TableCell>
                          <TableCell style={{ textAlign: "center", fontWeight: "bold" }}> Mobile Number</TableCell>

                          <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Joining Date</TableCell>
                          {/* <TableCell style={{textAlign:"center",fontWeight:"bold"}} >Doc</TableCell> */}
                          <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Actions</TableCell>
                          {/* <TableCell>User Type</TableCell>
                              <TableCell>Status</TableCell> */}
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
                                {get(category, "user_id", "N/A")}
                              </TableCell>
                              <TableCell className={classes.textMiddle} style={{ textAlign: "center" }}>
                                {category.username
                                  ? category.username.charAt(0).toUpperCase() + category.username.slice(1)
                                  : "N/A"}
                              </TableCell>
                              <TableCell className={classes.textMiddle} style={{ textAlign: "center" }}>
                                {Incomplete === true ? (
                                  category.userCategory === "Business" ? (
                                    <div
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                      }}
                                    >
                                      {category.userCategory}&nbsp;
                                      <VisibilityIcon
                                        onClick={() => {
                                          setOpen(true);
                                          setUserCategoryData(category);
                                        }}
                                        style={{ cursor: "pointer" }}
                                      />
                                    </div>
                                  ) : (
                                    category.userCategory
                                  )
                                ) : (
                                  ""
                                )}
                                {/* {category.userCategory === "Business" ? (
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                  >
                                    {category.userCategory}&nbsp;
                                    <VisibilityIcon
                                      onClick={() => {
                                        setOpen(true);
                                        setUserCategoryData(category);
                                      }}
                                      style={{ cursor: "pointer" }}
                                    />
                                  </div>
                                ) : (
                                  category.userCategory
                                )} */}
                              </TableCell>
                              <TableCell className={classes.textMiddle} style={{ textAlign: "center" }}>
                                {/* {category.country_code + category.phone_number}
                                 */}

                                {/* {get(category, "rating", "N/A")} */}
                                {category.rating ? sanitizeRating(category.rating) : "N/A"}
                              </TableCell>
                              <TableCell className={classes.textMiddle} style={{ textAlign: "center" }}>
                                {/* {category.profile_picture ? (
                                  <img
                                    src={category.profile_picture}
                                    alt="profile"
                                    style={{ width: "35px", height: "35px" }}
                                  />
                                ) : (
                                  <img
                                    src={require("../../assets/images/logo/ambulance.png")}
                                    alt="profile"
                                    style={{ width: "35px", height: "35px" }}
                                  />
                                )} */}
                                {get(category, "email", "N/A")}
                              </TableCell>
                              <TableCell className={classes.textMiddle} style={{ textAlign: "center" }}>
                                {/* {category.country_code + category.phone_number}
                                 */}
                                {get(category, "countryCode", "N/A")}&nbsp;
                                {get(category, "phone", "N/A")}
                              </TableCell>

                              <TableCell style={{ textAlign: "center" }}>
                                {category.createdAt
                                  ? new Date(category.createdAt)
                                      // .toUTCString()
                                      .getUTCDate() +
                                    "/" +
                                    (new Date(category.createdAt)
                                      // .toUTCString()
                                      .getUTCMonth() +
                                      1) +
                                    "/" +
                                    new Date(category.createdAt)
                                      // .toUTCString()
                                      .getUTCFullYear()
                                  : // moment.utc(category.createdAt).format("L")
                                    "N/A"}
                              </TableCell>

                              {/* <TableCell style={{textAlign:"center"}}>{category.doc?<img src={category.doc} alt="doc" style={{width:"50px",height:"50px"}}/>:"No Doc"}</TableCell> */}
                              <TableCell className={classes.textMiddle} style={{ textAlign: "center" }}>
                                {/* <Button
                                  onClick={() => EditUser(category)}
                                  className=""
                                  style={{
                                    border: "1.5px solid #c4c4c4",
                                    margin: "0.5rem",
                                    color: "#2765B3",
                                  }}
                                >
                                  <Tooltip title="Edit User" arrow>
                                    <EditIcon />
                                  </Tooltip>
                                </Button> */}
                                {/* <Button onClick={()=>BlockCategory} style={{backgroundColor:"#696969"}} >Manage</Button> */}

                                {/* <Button onClick={()=>BlockCategory} style={{backgroundColor:"#696969"}} >Manage</Button> */}

                                <Button
                                  className=""
                                  onClick={() =>
                                    category.isBlock === "block" ? UnblockUser(category._id) : BlockUser(category._id)
                                  }
                                  style={{
                                    border: "1.5px solid #c4c4c4",
                                    margin: "0.5rem",
                                    color: category.isBlock === "block" ? "red" : "#696969",
                                  }}
                                >
                                  <Tooltip title="Block/Unblock User" arrow>
                                    <BlockIcon />
                                  </Tooltip>{" "}
                                </Button>
                                {/* <Button onClick={()=>BlockCategory} style={{backgroundColor:"#696969"}} >Manage</Button> */}
                                <Button
                                  className=""
                                  onClick={() => DeleteUser(category._id)}
                                  style={{
                                    border: "1.5px solid #c4c4c4",
                                    margin: "0.5rem",
                                    color: "#696969",
                                  }}
                                >
                                  <Tooltip title="Delete User" arrow>
                                    <DeleteOutline />
                                  </Tooltip>
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
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

                  {/* <ReactPaginate
                    breakLabel="..."
                    nextLabel="next >"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={5}
                    pageCount={1}
                    previousLabel="< previous"
                    renderOnZeroPageCount={null}
                  /> */}
                  {/* <div className="d-flex">
                    <Button
                      variant="contained"
                      className="buttoncss mx-3"
                      style={{ backgroundColor: "#006FFF", color: "#fff" }}
                      onClick={() => {
                        setPageNumber((pagenum) => pagenum - 1);
                      }}
                    >
                      Previous Page
                    </Button>
                    <Button
                      variant="contained"
                      className="buttoncss mx-3"
                      style={{ backgroundColor: "#006FFF", color: "#fff" }}
                      onClick={() => {
                        setPageNumber((pagenum) => pagenum + 1);
                      }}
                    >
                      Next Page
                    </Button>
                  </div> */}
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
                // onSubmit={(values) => {
                //   if (editData.length > 1) {
                //     valuesEditedCalender(values);
                //   } else {
                //     valuesSubmit(values);
                //   }
                // }}
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
                      <div className="text-center">
                        {/* <Button
                          type="submit"
                          variant="contained"
                          className="buttoncss"
                          style={{ backgroundColor: "#0e3f37", color: "#fff" }}
                        >
                          Add Calendar
                        </Button> */}
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
