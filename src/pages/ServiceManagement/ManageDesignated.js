import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import axios from "../../axios";
import { toast } from "react-toastify";
import SearchIcon from "@material-ui/icons/Search";
import { handleValidateManageDesignatedFare, handleValidateManageDesignatedFare2 } from "../../utils/validators";

// import Switch from '@mui/material/Switch';
// import { styled } from '@mui/material/styles';
// import Skeleton from "react-loading-skeleton";
// import "react-loading-skeleton/dist/skeleton.css";
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

import EditIcon from "@material-ui/icons/Edit";
import { DeleteOutline, WidgetsOutlined } from "@material-ui/icons";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Close, Search } from "@material-ui/icons";
import { Formik, Field, Form } from "formik";
import { get, identity, sortBy, stubTrue } from "lodash";
import Swal from "sweetalert2";
import { Input, Modal } from "../../components/index";
import { AiOutlineClose } from "react-icons/ai";
// import BounceLoader from "react-spinners/BounceLoader ";
// import ClipLoader from "react-spinners/ClipLoader";
import PuffLoader from "react-spinners/PuffLoader";
import NoDataFound from "../../components/NoDataFound";

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
    // maxHeight: "58vh",
  },
  paperPaddingRightLeft: {
    padding: "0rem 1rem",
  },
}));

export default function ManageDesignated(props) {
  const classes = useStyles();
  const [puffLoader, setPuffLoader] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [selectedDesignatedData1, setSelectedDesignatedData1] = useState("");
  const [selectedDesignatedData2, setSelectedDesignatedData2] = useState("");
  const [modalState, setModalState] = useState({
    isFareDesignated1: "",
    isFareDesignated2: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [DriverPairingData, setDriverPairingData] = useState();
  // status switch
  // const [checked, setChecked] = useState(true);

  // For Pagination
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [totalUserListCount, settotalUserListCount] = useState(0);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const handleChangePage = (event, newPage) => {
    // console.log(event);
    // console.log(newPage);
    console.log(newPage);
    console.log({ event, newPage });
    getCategoriesContent(newPage + 1, rowsPerPage, search);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    getCategoriesContent(0, event.target.value, search);
    setRowsPerPage(parseInt(event.target.value, 10));
    console.log({ event });
    setPage(0);
  };

  useEffect(() => {
    getCategoriesContent(page, limit, search);
  }, []);

  //get content
  const getCategoriesContent = async (page = 1, limit = 10, search = "") => {
    setIsLoading(true);
    try {
      // const { data } = await axios.get(
      //   `/private/driverList?page=${page}&limit=${limit}&search=${search}&status=approved&JobStatus=3&serviceType=62d53abebf652aa3778946cd`
      // );
      const { data } = await axios.get(`/private/designatedDriverList?page=${page}&limit=${limit}&search=${search}`);
      console.log(data);
      setTableData([...data.data.docs]);
      //   setSearchedData(data.data.docs);
      setSearch(search);
      settotalUserListCount(data.data.totalDocs);
      setIsLoading(false);
      if (data.data.docs.length === 0 || data.status === 500) {
        // toast.error("No Data Found", {
        //   position: toast.POSITION.TOP_RIGHT,
        // });
      } else {
      }
    } catch (error) {
      console.log(error);
    }
  };
  // edit category itself

  const EditPackage = (category) => {
    props.history.push({
      pathname: "/adminPanel/AddEditPackage",
      state: category,
    });
  };

  //edit  categories attribute

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
      getCategoriesContent(page, limit);
      toast.success(data.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  // For Search
  const [searched, setSearched] = useState("");
  const [searchedData, setSearchedData] = useState([]);

  const requestSearch = (searchedVal) => {
    console.log(searchedVal);

    const filteredRows = searchedData.filter((row) => {
      let name = row.sect_name;
      return name.toLowerCase().includes(searchedVal.toLowerCase());
    });
    setTableData(filteredRows);
  };

  const cancelSearch = () => {
    getCategoriesContent(page, limit, "");
    // setSearched("");
    //  console.log(searchedData);
    //  requestSearch()
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

  const SearchDesignated = myDeb((search) => {
    getCategoriesContent(page, limit, search.toLowerCase());
  });

  const getDesignatedFare = async () => {
    setPuffLoader(true);
    try {
      const { data } = await axios.get(`/private/designatedDriverFare`);
      // props.history.push({
      //   pathname: "/adminPanel/FareDesignated",
      //   state: data.data[0],
      // });
      console.log(data);
      setSelectedDesignatedData1(data.data[0]);
      setPuffLoader(false);
      setModalState({
        isFareDesignated1: true,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const getDesignatedFareDriver = async () => {
    setPuffLoader(true);
    try {
      const { data } = await axios.get(`/private/designatedDriverFare`);

      // props.history.push({
      //   pathname: "/adminPanel/FareDesignatedDriver",
      //   state: data.data[0],
      // });
      console.log(data);
      setSelectedDesignatedData2(data.data[0]);
      setPuffLoader(false);
      setModalState({
        isFareDesignated2: true,
      });
    } catch (err) {
      console.log(err);
    }
  };
  const BlockDriver = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Proceed to block!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, block it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { data } = await axios.delete(`/private/driverDelete/${id}?status=block`);
        console.log(data);
        getCategoriesContent(page, limit, search);
        toast.success("Driver Blocked", {
          position: toast.POSITION.TOP_RIGHT,
        });
        // Swal.fire("Deleted!", "Your file has been deleted.", "success");
      } else {
        toast.error("You have cancelled the operation", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    });
    // if (window.confirm("Are you sure you want to block this driver?")) {
    //   try {
    //     // console.log(category);
    //     const { data } = await axios.delete(`/private/driverDelete/${id}?status=block`);
    //     console.log(data);
    //     getCategoriesContent(page, limit, search);
    //     toast.success("Driver Blocked", {
    //       position: toast.POSITION.TOP_RIGHT,
    //     });
    //   } catch (error) {
    //     console.log(error);
    //   }
    // } else {
    //   toast.error("Operation Cancelled", {
    //     position: toast.POSITION.TOP_RIGHT,
    //   });
    // }

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
    Swal.fire({
      title: "Are you sure?",
      text: "Proceed to unblock!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, unblock it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { data } = await axios.delete(`/private/driverDelete/${id}?status=unblock`);
        console.log(data);
        getCategoriesContent(page, limit, search);
        toast.success("Driver Unblocked", {
          position: toast.POSITION.TOP_RIGHT,
        });
        // Swal.fire("Deleted!", "Your file has been deleted.", "success");
      } else {
        toast.error("You have cancelled the operation", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    });
    // if (window.confirm("Are you sure you want to unblock this driver?")) {
    //   try {
    //     // console.log(category);
    //     const { data } = await axios.delete(`/private/driverDelete/${id}?status=unblock`);
    //     console.log(data);
    //     getCategoriesContent(page, limit, search);
    //     toast.success("Driver Unblocked", {
    //       position: toast.POSITION.TOP_RIGHT,
    //     });
    //   } catch (error) {
    //     console.log(error);
    //   }
    // } else {
    //   toast.error("Operation Cancelled", {
    //     position: toast.POSITION.TOP_RIGHT,
    //   });
    // }
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
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { data } = await axios.delete(`/private/driverDelete/${id}?status=delete`);
        getCategoriesContent(page, limit, search);
        toast.success("Driver Deleted", {
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
    //     const { data } = await axios.delete(`/private/driverDelete/${id}?status=delete`);
    //     getCategoriesContent(page, limit, search);
    //     toast.success("Driver Deleted", {
    //       position: toast.POSITION.TOP_RIGHT,
    //     });
    //   } catch (error) {
    //     console.log(error);
    //   }
    // } else {
    //   toast.error("You have cancelled the operation", {
    //     position: toast.POSITION.TOP_RIGHT,
    //   });
    // }
  };

  const addNewFareDesignated = async (values) => {
    try {
      console.log(values);

      const { data } = await axios.post(`/private/designatedDriverFare`, {
        baseRate: values.baseRate,
        distanceRate: values.distanceRate,
        adminCommission: values.adminCommission,
        cancellationFee: values.cancellationFee,
        timeRate: values.timeRate,
        // maxRadius: values.maxRadius || state.maxRadius,
        adminCancellationFee: values.adminCancellationFee,
        // driverCancellationFee: values.driverCancellationFee,
      });

      toast.success(data.message, {
        position: toast.POSITION.TOP_RIGHT,
      });

      setModalState({ isFareDesignated1: false });
      setSelectedDesignatedData1("");

      // props.history.push({
      //   pathname: "/adminPanel/ManageDesignatedDriver",
      // });
      console.log(data);
    } catch (error) {
      // const errors = error.response.data.errors;
      console.log(error);
    }
  };
  const EditFareDesignated = async (values) => {
    try {
      console.log(values);

      const { data } = await axios.put(`/private/designatedDriverFare/${selectedDesignatedData1._id}`, {
        baseRate: values.baseRate,
        distanceRate: values.distanceRate,
        adminCommission: values.adminCommission,
        cancellationFee: values.cancellationFee,
        timeRate: values.timeRate,
        // maxRadius: values.maxRadius || state.maxRadius,
        adminCancellationFee: values.adminCancellationFee,
        // driverCancellationFee: values.driverCancellationFee,
      });

      toast.success(data.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setModalState({ isFareDesignated1: false });
      setSelectedDesignatedData1("");
      // props.history.push({
      //   pathname: "/adminPanel/ManageDesignatedDriver",
      // });
      console.log(data);
    } catch (error) {
      // const errors = error.response.data.errors;
      console.log(error);
    }
  };

  const addNewDesignatedDriverFare2 = async (values) => {
    try {
      console.log(values);

      const { data } = await axios.post(`/private/designatedDriverFare`, {
        driver_1_Fare: values.driver_1_Fare,
        driver_2_Fare: values.driver_2_Fare,
        driverRadiusSearching: values.driverRadiusSearching,
      });

      toast.success(data.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setSelectedDesignatedData2("");
      setModalState({ isFareDesignated2: false });
      // props.history.push({
      //   pathname: "/adminPanel/ManageDesignatedDriver",
      // });
      console.log(data);
    } catch (error) {
      // const errors = error.response.data.errors;
      console.log(error);
    }
  };
  const EditDesignatedDriverFare2 = async (values) => {
    try {
      console.log(values);

      const { data } = await axios.put(`/private/designatedDriverFare/${selectedDesignatedData2._id}`, {
        driver_1_Fare: values.driver_1_Fare,
        driver_2_Fare: values.driver_2_Fare,
        driverRadiusSearching: values.driverRadiusSearching,
      });

      toast.success(data.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setSelectedDesignatedData2("");
      setModalState({ isFareDesignated2: false });

      // props.history.push({
      //   pathname: "/adminPanel/ManageDesignatedDriver",
      // });
      console.log(data);
    } catch (error) {
      // const errors = error.response.data.errors;
      console.log(error);
    }
  };

  const ViewDriverData = (data) => {
    let apiHit = {
      page: page,
      limit: limit,
      ServiceTypeId: "62d53abebf652aa3778946cd",
      ActiveInactiveDuty: 1,
      status: "approved",
      search: search,
      // startDateVariable: startFilterValue,
      // endDateVariable: endFilterValue,
      pathname: "/adminPanel/ManageDesignatedDriver",
    };
    props.history.push({
      pathname: "/adminPanel/driver-view",
      state: [data._id, apiHit, data.serviceType],
    });
  };
  const ViewPairedDriverData = (data) => {
    let apiHit = {
      page: page,
      limit: limit,
      ServiceTypeId: "62d53abebf652aa3778946cd",
      ActiveInactiveDuty: 1,
      status: "approved",
      search: search,
      // startDateVariable: startFilterValue,
      // endDateVariable: endFilterValue,
      pathname: "/adminPanel/ManageDesignatedDriver",
    };

    props.history.push({
      pathname: "/adminPanel/driver-view",
      state: [data.pairDetails.receiverDetails.driver_profiles_id, apiHit, "all"],
    });
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <div className={classes.root}>
          <Paper elevation={0} style={{ backgroundColor: "transparent" }}>
            <div className={classes.paperPaddingRightLeft}>
              <div className="">
              
                <div className="my-3" style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",}}>
                 
                <SearchBar
                    className={"heightfix   "}
                    style={{ borderRadius: "25px" }}
                    onChange={(searchVal) => SearchDesignated(searchVal)}
                    onCancelSearch={() => cancelSearch()}
                    placeholder="Search by Driver Name"
                  />
               
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem" }}>
                    <Tooltip title={<span style={{ color: "white", fontSize: "16px" }}>Manage Fare</span>} arrow>
                      <Button
                        className="buttoncss"
                        style={{ backgroundColor: "#0059cd", color: "#fff" }}
                        onClick={() => {
                          getDesignatedFare();
                        }}
                      >
                        <WidgetsOutlined />
                        &nbsp; Manage Fare
                      </Button>
                    </Tooltip>
                    <Tooltip
                      title={<span style={{ color: "white", fontSize: "16px" }}>Manage Driver Fare & Radius</span>}
                      arrow
                    >
                      <Button
                        className="buttoncss"
                        style={{ backgroundColor: "#0059cd", color: "#fff" }}
                        onClick={() => {
                          getDesignatedFareDriver();
                        }}
                      >
                        <WidgetsOutlined />
                        &nbsp; Manage Driver Fare & Radius
                      </Button>
                    </Tooltip>
                  </div>
                 
                </div>
              
                <Paper>
                  <TableContainer className={classes.container} style={{ minHeight: tableData.length > 0 ? "50vh" : "" }}>
                    <Table className={classes.table} stickyHeader size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Sr. No.</TableCell>
                          <TableCell style={{ textAlign: "center", fontWeight: "bold" }}> Driver Id</TableCell>
                          <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Driver Name</TableCell>
                          <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Mobile Number</TableCell>
                          <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Email Id</TableCell>
                          <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Pair Status</TableCell>
                          <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Paired With</TableCell>
                      
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {/* {isLoading ? (
                          <TableRow>
                            <Skeleton
                              style={{ width: "70vw", borderRadius: "20px" }}
                              highlightColor="#fff"
                              height="1rem"
                              count={2}
                              baseColor="#ebebeb"
                            />
                          </TableRow>
                        ) : (
                          false
                        )} */}
                        {tableData
                          //   .slice(
                          //     page * rowsPerPage,
                          //     page * rowsPerPage + rowsPerPage
                          //   )
                          //   .reverse()
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
                                {category?.driver?.user_id}
                              </TableCell>

                              <TableCell style={{ textAlign: "center" }}>
                                <span
                                  style={{
                                    color: "navy",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => {
                                    ViewDriverData(category);
                                  }}
                                >
                                  {category?.driver?.firstName.charAt(0).toUpperCase() +
                                    category?.driver?.firstName.slice(1) +
                                    " " +
                                    category?.driver?.lastName}
                                </span>
                              </TableCell>
                              <TableCell style={{ textAlign: "center" }}>
                                {category?.driver?.countryCode + " " + category?.driver?.phone}
                              </TableCell>
                              <TableCell style={{ textAlign: "center" }}>{category?.driver?.email}</TableCell>
                              <TableCell style={{ textAlign: "center" }}>
                                {category.pairDetails ? `Paired` : `Not Paired`}
                              </TableCell>
                              <TableCell style={{ textAlign: "center", textTransform: "capitalize", whiteSpace: "noWrap" }}>
                                {category?.pairDetails ? (
                                  <>
                                    <span
                                      style={{
                                        color: "navy",
                                        cursor: "pointer",
                                      }}
                                      onClick={() => {
                                        ViewPairedDriverData(category);
                                      }}
                                    >
                                      {" "}
                                      {get(category, "pairDetails.receiverDetails.firstName")}{" "}
                                      {get(category, "pairDetails.receiverDetails.lastName")}
                                    </span>
                                    &nbsp;
                                    <VisibilityIcon
                                      style={{ cursor: "pointer" }}
                                      onClick={() => {
                                        setDriverPairingData(category.pairDetails);
                                        setOpen(true);
                                      }}
                                    />
                                  </>
                                ) : (
                                  "N/A"
                                )}
                              </TableCell>

                              {/* <TableCell className={classes.textMiddle} style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                                <Button
                                  onClick={() => {
                                    category.driver.isBlock === "block"
                                      ? UnBlockDriver(category._id)
                                      : BlockDriver(category._id);
                                  }}
                                  className=""
                                  style={{
                                    color: category.driver.isBlock === "block" ? "red" : "#696969",
                                  }}
                                  disabled={category.pairDetails ? true : false}
                                >
                                  <Tooltip title="Block/Unblock" arrow>
                                    <BlockIcon />
                                  </Tooltip>
                                </Button>

                                <Button
                                  className=""
                                  onClick={() => {
                                    DeleteDriver(category._id);
                                  }}
                                  style={{
                                    color: "#696969",
                                  }}
                                  disabled={category.pairDetails ? true : false}
                                >
                                  <Tooltip title="Delete" arrow>
                                    <DeleteOutline />
                                  </Tooltip>
                                </Button>
                              </TableCell> */}
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  {tableData.length === 0 ? (
                    <NoDataFound TextToDisplay="No Data Found." fontSize="24px" Loading={isLoading} />
                  ) : (
                    false
                  )}
                  <TablePagination
                   style={{position:"fixed",bottom:4,backgroundColor:"white",right:27}}
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
              setOpen(false);
              setDriverPairingData("");
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
                  // email:"",
                  // name: get(editData[0], "calendar_name", ""),
                  driver_name:
                    DriverPairingData?.receiverDetails?.firstName.charAt(0).toUpperCase() +
                    DriverPairingData?.receiverDetails?.firstName.slice(1) +
                    " " +
                    DriverPairingData?.receiverDetails?.lastName,
                  driver_phone:
                    get(DriverPairingData, "receiverDetails.countryCode", "N/A") +
                    get(DriverPairingData, "receiverDetails.phone", "N/A"),
                  driver_email: get(DriverPairingData, "receiverDetails.email", "N/A"),
                  // driver_address: get(DriverPairingData, "business.address", "N/A"),
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
                            Driver 2 Name : &nbsp;
                          </label>
                        </div>
                        <div className="col-4">
                          <Field
                            className=""
                            name="driver_name"
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
                            Driver 2 Phone No. : &nbsp;
                          </label>
                        </div>
                        <div className="col-4">
                          <Field
                            className=""
                            name="driver_phone"
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
                            Driver 2 Email Id : &nbsp;
                          </label>
                        </div>
                        <div className="col-4">
                          <Field
                            className=""
                            name="driver_email"
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
                      {/* <div className="row">
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
                        
                        </div>
                      </div> */}
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
      {/* FareDesignated one */}
      <Modal
        maxWidth="lg"
        width="840px"
        isOpen={modalState.isFareDesignated1}
        // onClose={() => {
        //   setModalState({
        //     isFareDesignated1: false,
        //   });
        //   setSelectedDesignatedData1("");
        // }}
        onClose={(event, reason) => {
          if (reason && (reason === "backdropClick" || "escapeKeyDown")) {
            console.log(reason);
            setModalState({
              isFareDesignated1: true,
            });
          } else {
            setModalState({
              isFareDesignated1: false,
            });
            setSelectedDesignatedData1("");
          }
          // setModalState({
          //   isAddEditTaxiSingle: false,
          // });
          // setSelectedTaxiDataAddEdit(null);
        }}
        backgroundModal={false}
        backgroundModalContent={false}
        title={
          <div>
            <div
              className="my-3"
              style={{ textAlign: "center", fontWeight: "bold", fontSize: "22px", fontFamily: "'DM Sans', sans-serif" }}
            >
              Designated Driver Fare
            </div>
            <div className="closeicon">
              <AiOutlineClose
                style={{
                  fontSize: "1.5rem",
                  position: "absolute",
                  top:16,
                  right: 16,
                  color: "#fff",
                  borderRadius: "50%",
                  backgroundColor: "red",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setModalState({
                    isFareDesignated1: false,
                  });
                  setSelectedDesignatedData1("");
                }}
              />
            </div>
          </div>
        }
        content={
          <>
            <Formik
              initialValues={{
                baseRate: get(selectedDesignatedData1, "baseRate", ""),
                timeRate: get(selectedDesignatedData1, "timeRate", ""),
                distanceRate: get(selectedDesignatedData1, "distanceRate", ""),
                adminCommission: get(selectedDesignatedData1, "adminCommission", ""),
                cancellationFee: get(selectedDesignatedData1, "cancellationFee", ""),
                adminCancellationFee: get(selectedDesignatedData1, "adminCancellationFee", ""),
                // driverCancellationFee: get(selectedDesignatedData1, "driverCancellationFee", ""),
              }}
              validate={(values) => handleValidateManageDesignatedFare(values)}
              onSubmit={(values) => {
                console.log(values);
                if (setSelectedDesignatedData1 !== "") {
                  EditFareDesignated(values);
                } else {
                  addNewFareDesignated(values);
                  // addNewTaxiSingle(values);
                  console.log("gadbad");
                }
              }}
            >
              {(formikBag) => (
                <Form style={{ width: "100%" }}>
                  <div className="container">
                    {/* <div className="row my-3 justify-content-center" style={{ fontSize: "22px", fontWeight: "bold" }}>
                      <div className="col-6 d-flex flex-column "> Manage Trip Fare</div>
                      <div className="col-6 d-flex flex-column "></div>
                    </div> */}

                    <div className="row my-3">
                      <div className="col-md-6">
                        <label>
                          Base Rate<span style={{ color: "#85BB65", fontWeight: "bold" }}>(in USD)</span>:
                        </label>
                        <Field name="baseRate">
                          {({ field }) => (
                            <Input
                              {...field}
                              type="number"
                              onChange={(e) => {
                                formikBag.setFieldValue("baseRate", e.target.value);
                              }}
                              error={formikBag.touched.baseRate && formikBag.errors.baseRate ? formikBag.errors.baseRate : null}
                              className="form-control"
                              placeholder={"Enter Base Rate"}
                            />
                          )}
                        </Field>
                      </div>
                      <div className="col-md-6">
                        <label>
                          Time Rate<span style={{ color: "brown", fontWeight: "bold" }}>(per min)</span>
                          <span style={{ color: "#85BB65", fontWeight: "bold" }}>(in USD)</span>:
                        </label>
                        <Field name="timeRate">
                          {({ field }) => (
                            <Input
                              {...field}
                              type="number"
                              onChange={(e) => {
                                formikBag.setFieldValue("timeRate", e.target.value);
                              }}
                              error={formikBag.touched.timeRate && formikBag.errors.timeRate ? formikBag.errors.timeRate : null}
                              className="form-control"
                              placeholder={"Enter Time Rate"}
                            />
                          )}
                        </Field>
                      </div>
                    </div>

                    <div className="row my-3">
                      <div className="col-md-6">
                        <label>
                          Distance Rate<span style={{ color: "brown", fontWeight: "bold" }}>(per mile)</span>
                          <span style={{ color: "#85BB65", fontWeight: "bold" }}>(in USD)</span>:
                        </label>
                        <Field name="distanceRate">
                          {({ field }) => (
                            <Input
                              {...field}
                              type="number"
                              onChange={(e) => {
                                formikBag.setFieldValue("distanceRate", e.target.value);
                              }}
                              error={
                                formikBag.touched.distanceRate && formikBag.errors.distanceRate
                                  ? formikBag.errors.distanceRate
                                  : null
                              }
                              className="form-control"
                              placeholder={"Enter Distance Rate"}
                            />
                          )}
                        </Field>
                      </div>
                      <div className="col-md-6">
                        <label>
                          Admin Commission<span style={{ color: "#e3941e", fontWeight: "bold" }}>(in %)</span>:
                        </label>
                        <Field name="adminCommission">
                          {({ field }) => (
                            <Input
                              {...field}
                              type="text"
                              onChange={(e) => {
                                formikBag.setFieldValue("adminCommission", e.target.value);
                              }}
                              error={
                                formikBag.touched.adminCommission && formikBag.errors.adminCommission
                                  ? formikBag.errors.adminCommission
                                  : null
                              }
                              className="form-control"
                              placeholder={"Enter Admin Commission"}
                            />
                          )}
                        </Field>
                      </div>
                    </div>

                    <div className="row my-3">
                      <div className="col-md-6">
                        <label>
                          Cancellation Fee<span style={{ color: "#e3941e", fontWeight: "bold" }}>(in %)</span>:
                        </label>
                        <Field name="cancellationFee">
                          {({ field }) => (
                            <Input
                              {...field}
                              type="text"
                              onChange={(e) => {
                                formikBag.setFieldValue("cancellationFee", e.target.value);
                              }}
                              error={
                                formikBag.touched.cancellationFee && formikBag.errors.cancellationFee
                                  ? formikBag.errors.cancellationFee
                                  : null
                              }
                              className="form-control"
                              placeholder={"Enter Cancellation Fee"}
                            />
                          )}
                        </Field>
                      </div>
                      <Tooltip
                        title={
                          <span style={{ fontSize: "20px" }}>
                            eg. if total cancellation fee(in%)=20 then admin cancellation fee= X% of 20
                          </span>
                        }
                        arrow
                      >
                        <div className="col-md-6">
                          <label>
                            {" "}
                            Admin Cancellation Fee<span style={{ color: "#e3941e", fontWeight: "bold" }}>(in %)</span>:
                          </label>
                          <Field name="adminCancellationFee">
                            {({ field }) => (
                              <Input
                                {...field}
                                type="text"
                                onChange={(e) => {
                                  if (e.nativeEvent.data) {
                                    if (e.target.value > 100) {
                                    } else {
                                      let code = e.nativeEvent.data.charCodeAt(0);
                                      if (code >= 48 && code <= 57) {
                                        formikBag.setFieldValue("adminCancellationFee", e.target.value);
                                        // formikBag.setFieldValue("driverCancellationFee", 100 - e.target.value);
                                      }
                                    }
                                  } else {
                                    formikBag.setFieldValue("adminCancellationFee", e.target.value);
                                    // formikBag.setFieldValue("driverCancellationFee", 100 - e.target.value);
                                  }
                                }}
                                error={
                                  formikBag.touched.adminCancellationFee && formikBag.errors.adminCancellationFee
                                    ? formikBag.errors.adminCancellationFee
                                    : null
                                }
                                className="form-control"
                                placeholder={"Enter Admin Cancellation Fee"}
                              />
                            )}
                          </Field>
                        </div>
                      </Tooltip>
                    </div>

                    <div className="row my-3">
                      {/* <div className="col-md-6">
                        <label> Driver Cancellation Fee(in %):</label>
                        <Field name="driverCancellationFee">
                          {({ field }) => (
                            <Input
                              {...field}
                              type="text"
                              onChange={(e) => {
                                if (e.nativeEvent.data) {
                                  if (e.target.value > 100) {
                                  } else {
                                    let code = e.nativeEvent.data.charCodeAt(0);
                                    if (code >= 48 && code <= 57) {
                                      formikBag.setFieldValue("driverCancellationFee", e.target.value);
                                      formikBag.setFieldValue("adminCancellationFee", 100 - e.target.value);
                                    }
                                  }
                                } else {
                                  formikBag.setFieldValue("driverCancellationFee", e.target.value);
                                  formikBag.setFieldValue("adminCancellationFee", 100 - e.target.value);
                                }
                              }}
                              error={
                                formikBag.touched.driverCancellationFee && formikBag.errors.driverCancellationFee
                                  ? formikBag.errors.driverCancellationFee
                                  : null
                              }
                              className="form-control"
                              placeholder={"Enter Driver Cancellation Fee"}
                            />
                          )}
                        </Field>
                      </div> */}
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
                        width: "10vw",
                        height: "5vh",
                        backgroundColor: "#006FFF",
                        color: "#fff",
                        margin: "2rem 0rem",
                      }}
                    >
                      SAVE
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </>
        }
      />
      {/* FareDesignated two */}
      <Modal
        maxWidth="lg"
        width="840px"
        isOpen={modalState.isFareDesignated2}
        // onClose={() => {
        //   setModalState({
        //     isFareDesignated2: false,
        //   });
        //   setSelectedDesignatedData2("");
        // }}
        onClose={(event, reason) => {
          if (reason && (reason === "backdropClick" || "escapeKeyDown")) {
            console.log(reason);
            setModalState({
              isFareDesignated2: true,
            });
          } else {
            setModalState({
              isFareDesignated2: false,
            });
            setSelectedDesignatedData2("");
          }
          // setModalState({
          //   isAddEditTaxiSingle: false,
          // });
          // setSelectedTaxiDataAddEdit(null);
        }}
        backgroundModal={false}
        backgroundModalContent={false}
        title={
          <div>
            <div
              className="my-3"
              style={{ textAlign: "center", fontWeight: "bold", fontSize: "22px", fontFamily: "'DM Sans', sans-serif" }}
            >
              Designated Driver Fare & Radius
            </div>
            <div className="closeicon">
              <AiOutlineClose
                style={{
                  fontSize: "1.5rem",
                  position: "absolute",
                  top: 16,
                  right: 16,
                  color: "#fff",
                  borderRadius: "50%",
                  backgroundColor: "red",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setModalState({
                    isFareDesignated2: false,
                  });
                  setSelectedDesignatedData2("");
                }}
              />
            </div>
          </div>
        }
        content={
          <>
            <Formik
              initialValues={{
                driver_1_Fare: get(selectedDesignatedData2, "driver_1_Fare", ""),
                driver_2_Fare: get(selectedDesignatedData2, "driver_2_Fare", ""),
                driverRadiusSearching: get(selectedDesignatedData2, "driverRadiusSearching", ""),
              }}
              validate={(values) => handleValidateManageDesignatedFare2(values)}
              onSubmit={(values) => {
                console.log(values);
                if (setSelectedDesignatedData2 !== "") {
                  EditDesignatedDriverFare2(values);
                  // EditFareDesignated(values);
                } else {
                  addNewFareDesignated(values);
                  // addNewFareDesignated(values);
                  // addNewTaxiSingle(values);
                  console.log("gadbad");
                }
              }}
            >
              {(formikBag) => (
                <Form style={{ width: "100%" }}>
                  <div className="container">
                    {/* <div className="row my-3 justify-content-center" style={{ fontSize: "22px", fontWeight: "bold" }}>
                      <div className="col-6 d-flex flex-column "> Manage Trip Fare</div>
                      <div className="col-6 d-flex flex-column "></div>
                    </div> */}

                    <div className="row my-3">
                      <div className="col-md-6">
                        <label>
                          Driver 1 Fare<span style={{ color: "#e3941e", fontWeight: "bold" }}>(in %)</span>:
                        </label>
                        <Field name="driver_1_Fare">
                          {({ field }) => (
                            <Input
                              {...field}
                              type="number"
                              onChange={(e) => {
                                formikBag.setFieldValue("driver_1_Fare", e.target.value);
                              }}
                              error={
                                formikBag.touched.driver_1_Fare && formikBag.errors.driver_1_Fare
                                  ? formikBag.errors.driver_1_Fare
                                  : null
                              }
                              className="form-control"
                              placeholder={"Enter Driver 1 Fare"}
                            />
                          )}
                        </Field>
                      </div>
                      <div className="col-md-6">
                        <label>
                          Driver 2 Fare<span style={{ color: "#e3941e", fontWeight: "bold" }}>(in %)</span>:
                        </label>
                        <Field name="driver_2_Fare">
                          {({ field }) => (
                            <Input
                              {...field}
                              type="number"
                              onChange={(e) => {
                                formikBag.setFieldValue("driver_2_Fare", e.target.value);
                              }}
                              error={
                                formikBag.touched.driver_2_Fare && formikBag.errors.driver_2_Fare
                                  ? formikBag.errors.driver_2_Fare
                                  : null
                              }
                              className="form-control"
                              placeholder={"Enter Driver 2 Fare"}
                            />
                          )}
                        </Field>
                      </div>
                    </div>

                    <div className="row my-3">
                      <div className="col-md-6">
                        <label>
                          Set Driver Radius for Searching<span style={{ color: "brown", fontWeight: "bold" }}>(in miles)</span>:
                        </label>
                        <Field name="driverRadiusSearching">
                          {({ field }) => (
                            <Input
                              {...field}
                              type="number"
                              onChange={(e) => {
                                formikBag.setFieldValue("driverRadiusSearching", e.target.value);
                              }}
                              error={
                                formikBag.touched.driverRadiusSearching && formikBag.errors.driverRadiusSearching
                                  ? formikBag.errors.driverRadiusSearching
                                  : null
                              }
                              className="form-control"
                              placeholder={"Enter Driver Radius for Searching"}
                            />
                          )}
                        </Field>
                      </div>
                      <div className="col-md-6"></div>
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
                        width: "10vw",
                        height: "5vh",
                        backgroundColor: "#006FFF",
                        color: "#fff",
                        margin: "2rem 0rem",
                      }}
                    >
                      SAVE
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </>
        }
      />
      {puffLoader && (
        <div
          style={{
            position: "fixed",
            width: "100vw",
            height: "100vh",
            top: 0,
            left: 0,
            zIndex: 1400,
            background: "#0003",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <PuffLoader
            color="#0059cd"
            loading={puffLoader}
            size={100}
            // aria-label="Loading Spinner"
            // data-testid="loader"
          />
        </div>
      )}
    </React.Fragment>
  );
}
