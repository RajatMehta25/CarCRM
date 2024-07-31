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
import { Close, DeleteForeverOutlined, DeleteOutlineOutlined, Search } from "@material-ui/icons";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ReactPaginate from "react-paginate";
import { getDateFormat } from "../../helpers/helperFunction";
import PersonIcon from "@material-ui/icons/Person";
import SearchIcon from "@material-ui/icons/Search";
import FilterListIcon from "@material-ui/icons/FilterList";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
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
import RSelect from "react-select";
import "./ViewUser.css";
import PuffLoader from "react-spinners/PuffLoader";
import NoDataFound from "../../components/NoDataFound";
import { GrApple, GrAndroid } from "react-icons/gr";
// import Swal from "sweetalert2";
import Checkbox from "@material-ui/core/Checkbox";


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
    // maxHeight: "65vh",
    // height:"auto"
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

export default function UserManagement(props) {
  const classes = useStyles();

  // const history=useHistory();
  const {
    location: { state },
    history,
  } = props;
  const [searchedValue, setSearchedValue] = useState();
  const [rselKey, setRselKey] = useState(0);
  const [tableData, setTableData] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [PaginationData, setPaginationData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [applyFilter, setApplyFilter] = useState({
    all: false,
    select: false,
    date: false,
  });
  const [showView, setShowView] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState();
  const profileData = [
    { label: "All", value: "3" },
    { label: "Complete User Profiles", value: "1" },
    { label: "Incomplete User Profiles", value: "0" },
  ];
  const [applyButtonColor, setApplyButtonColor] = useState(false);
  // status switch
  // const [checked, setChecked] = useState(true);

  // For Pagination
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = async (event, newPage) => {
    const FormatedDate = getDateFormat(startDate, endDate);
    console.log(newPage);
    console.log({ event, newPage });
    getCategoriesContent(newPage + 1, rowsPerPage, Incomplete, search, FormatedDate.sDate, FormatedDate.eDate);
    console.log("checkpage");
    // setPage(newPage);
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
    const FormatedDate = getDateFormat(startDate, endDate);
    console.log(+event.target.value);
    // setRowsPerPage(+event.target.value);
    // setPage(0);
    console.log(page);
    getCategoriesContent(0, event.target.value, Incomplete, search, FormatedDate.sDate, FormatedDate.eDate);
    console.log("checkrows");
    setRowsPerPage(parseInt(event.target.value, 10));
    console.log({ event });
    setPage(0);
  };

  //get content
  const [pagenumber, setPageNumber] = useState(1);
  const [totalUserListCount, settotalUserListCount] = useState(0);
  const [limit, setLimit] = useState(10);
  const [Incomplete, setIncomplete] = useState("3");
  const [search, setSearch] = useState("");
  const getCategoriesContent = async (page = 1, limit = 10, Incomplete = "3", search = "", startDate = "", endDate = "") => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(
        `/private/userList?page=${page}&limit=${limit}&incomplete=${Incomplete}&search=${search}&start_date=${startDate}&end_date=${endDate}`
      );
      console.log(data);
      setTableData([...data.data.docs]);
      setSearchedData(data.data.docs);
      settotalUserListCount(data.data.totalDocs);
      setIncomplete(Incomplete);
      setSearch(search);
      setLimit(limit);
      setPage(data.data.page - 1);
      setIsLoading(false);

      // setPaginationData(data.data);
      // setIsLoading(false);
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

  console.log(tableData);
  // edit user

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
        const { data } = await axios.get(`/private/userDeleteAndBlock?id=${id}&status=block`);
        console.log(data);
        getCategoriesContent(page, limit, Incomplete, search);
        toast.success("User Blocked", {
          position: toast.POSITION.TOP_RIGHT,
        });
        // Swal.fire("Deleted!", "Your file has been deleted.", "success");
      } else {
        toast.error("You have cancelled the operation", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    });

    // if (window.confirm("Are you sure you want to block this user?")) {
    //   try {
    //     // console.log(category);
    //     const { data } = await axios.get(`/private/userDeleteAndBlock?id=${id}&status=block`);
    //     console.log(data);
    //     getCategoriesContent(page, limit, Incomplete, search);
    //     toast.success("User Blocked", {
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
  };

  const UnblockUser = async (id) => {
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
        const { data } = await axios.get(`/private/userDeleteAndBlock?id=${id}&status=unblock`);
        console.log(data);
        getCategoriesContent(page, limit, Incomplete, search);
        toast.success("User Unblocked", {
          position: toast.POSITION.TOP_RIGHT,
        });
        // Swal.fire("Deleted!", "Your file has been deleted.", "success");
      } else {
        toast.error("You have cancelled the operation", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    });
    // if (window.confirm("Are you sure you want to unblock this user?")) {
    //   try {
    //     // console.log(category);
    //     const { data } = await axios.get(`/private/userDeleteAndBlock?id=${id}&status=unblock`);
    //     console.log(data);
    //     getCategoriesContent(page, limit, Incomplete, search);
    //     toast.success("User Unblocked", {
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
  };
  console.log(tableData.docs?.length);
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
        getCategoriesContent(page, limit, Incomplete, search);
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

  useEffect(() => {
    if (state && state !== undefined) {
      setApplyButtonColor(state.applyButtonColor);
      setStartDate(state.startDate);
      setEndDate(state.endDate);
      setSearch(state.search);
      setLimit(state.limit);
      const FormatedDate = getDateFormat(state.startDate, state.endDate);
      getCategoriesContent(
        state.page,
        state.limit,
        state.Incomplete,

        state.search,
        FormatedDate.sDate,
        FormatedDate.eDate
      );
    } else {
      getCategoriesContent();
    }
  }, []);

  useEffect(() => {
    setRselKey((k) => k + 1);
  }, [tableData]);
  // useEffect(() => {
  //   if (startDate === null && endDate === null) {
  //     console.log("check1");
  //     if (state && state !== undefined) {
  //       getCategoriesContent(
  //         state.page,
  //         state.limit,
  //         state.Incomplete,

  //         state.search,
  //         state.startDate,
  //         state.endDate
  //       );
  //     } else {
  //       getCategoriesContent();
  //     }
  //     // getCategoriesContent(page, limit, Incomplete, search);
  //   } else if (startDate === null || endDate === null) {
  //     toast.info("Please Select Both Dates To Get Filtered Data", {
  //       position: toast.POSITION.TOP_RIGHT,
  //     });
  //     getCategoriesContent(page, limit, Incomplete, search);
  //     console.log("check2");
  //   } else if (startDate !== null && endDate !== null) {
  //     const FormatedDate = getDateFormat(startDate, endDate);
  //     getCategoriesContent(page, limit, Incomplete, search, FormatedDate.sDate, FormatedDate.eDate);
  //     toast.success("Filtered Data", {
  //       position: toast.POSITION.TOP_RIGHT,
  //     });
  //     console.log("check3");
  //   }
  // }, [startDate, endDate]);

  // const getFilteredData = async () => {
  //   const FormatedDate = getDateFormat(startDate, endDate);

  //   try {
  //     const { data } = await axios.get(
  //       `/private/userList?page=${page}&limit=${limit}&start_date=${FormatedDate.sDate}&end_date=${FormatedDate.eDate}`
  //     );

  //     if (data.data.docs !== null && data.data.docs.length > 0) {
  //       setTableData([...data.data.docs]);
  //       setSearchedData(data.data.docs);
  //       settotalUserListCount(data.data.totalDocs);
  //       setIncomplete(Incomplete);
  //       toast.success("Filtered Data", {
  //         position: toast.POSITION.TOP_RIGHT,
  //       });
  //     } else {
  //       setTableData([]);
  //       toast.error("No Data Found", {
  //         position: toast.POSITION.TOP_RIGHT,
  //       });
  //       setSearchedData([]);
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  // const getUserIncompleteData = async () => {
  //   try {
  //     const { data } = await axios.get("/private/userList?page=1&limit=10");
  //     console.log(data);
  //     setTableData(data.data.docs.filter((e) => e.userProfileUpdate === "false"));
  //     setSearchedData(data.data.docs.filter((e) => e.userProfileUpdate === "false"));
  //     // setPaginationData(data.data);
  //     // setIsLoading(false);
  //     if (data.data.docs.length === 0) {
  //       toast.error("No Data Found", {
  //         position: toast.POSITION.TOP_RIGHT,
  //       });
  //     } else {
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

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
    const FormatedDate = getDateFormat(startDate, endDate);
    getCategoriesContent(page, rowsPerPage, Incomplete, search.toLowerCase(), FormatedDate.sDate, FormatedDate.eDate);
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

  const ViewUserDetails = async (data) => {
    let apiHit = {
      page: page + 1,
      limit: rowsPerPage,
      Incomplete: Incomplete,
      search: search,
      startDate: startDate,
      endDate: endDate,
      applyButtonColor: applyButtonColor,
      pathname: "/adminPanel/user-management",
    };
    props.history.push({
      pathname: "/adminPanel/ViewUser",
      state: [data._id, apiHit, data.serviceType],
    });
  };
  // const ViewUserDetails = async (id) => {
  //   let UserPageData = {
  //     pageName: "User",
  //     page: page + 1,
  //     limit: rowsPerPage,
  //     Incomplete: Incomplete,
  //     search: search,
  //     startDate: startDate,
  //     endDate: endDate,
  //     applyButtonColor: applyButtonColor,
  //     UserID: id,
  //   };
  //   props.history.push({
  //     pathname: "/adminPanel/ViewUser",
  //     state: [UserPageData],
  //   });
  // };
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

  const deleteUsers = () => {
    Swal.fire({
      title: "Are you sure?",
      text: selected.length>0?"All selected data will be deleted permanently . Proceed to delete!":"All data will be deleted permanently . Proceed to delete!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { data } = await axios.post(`/private/userDelete`, {
          userIds: selected.length>0?selected:["allDelete"],
          all_delete: selected.length>0?false: true,
          userType: "user",
        });
        console.log(data);
        getCategoriesContent(page, limit, Incomplete, search);
        toast.success("All Users Deleted", {
          position: toast.POSITION.TOP_RIGHT,
        });
        // Swal.fire("Deleted!", "Your file has been deleted.", "success");
      } else {
        toast.error("You have cancelled the operation", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    });
  };

  const [selected, setSelected] = React.useState([]);
  const handleSelectAllClick = (event) => {
    if (selected?.length) {
      setSelected([]);
    } else {
      const newSelecteds = tableData.map((n) => n._id);
      setSelected(newSelecteds);
    }
  };
  const handleClick = (event, name) => {
    console.log(name)
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };
  const isSelected = (name) => selected.indexOf(name) !== -1;
  console.log(selected)
  return (
    <React.Fragment>
      <div className="page-content">
        <div className={classes.root}>
          <Paper elevation={0} style={{ backgroundColor: "transparent" }}>
            <div className={classes.paperPaddingRightLeft}>
              <div className="">
              
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "0.5rem",
                    alignItems: "center",
                    margin: "0.5rem 0",
                    justifyContent: "space-between",
                  }}
                >
                     <SearchBar
                      // value={searched}
                      style={{
                        borderRadius: "25px",
                        minWidth:"20vw"
                      }}
                      className={"heightfix  "}
                      onChange={(searchVal) => {
                        SearchUser(searchVal);
                        setSearchedValue(searchVal);
                      }}
                      onCancelSearch={() => {
                        cancelSearch();
                        setSearchedValue("");
                      }}
                      placeholder="Search by User Name,Mobile Number"
                      inputProps={{ maxLength: 30 }}
                    />
                  {/* <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
             
                    <div className="" style={{ width: "150px", zIndex: 3 }}>
                      <RSelect
                        key={rselKey}
                        options={profileData}
                        defaultValue={{ label: "All", value: "3" }}
                        placeholder="Select Profile"
                        value={selectedProfile}
                        isSearchable={false}
                        onChange={(e) => {
                          setSelectedProfile(e);
                          setApplyFilter({ ...applyFilter, select: true });
                          if (e.value === "0") {
                            // getCategoriesContent(1, limit, false, search);
                            // setRowsPerPage(10);

                            setIncomplete("0");
                          } else if (e.value === "1") {
                            // getCategoriesContent(1, limit, true, search);
                            setIncomplete("1");
                          } else if (e.value === "3") {
                            setIncomplete("3");
                          }
                        }}
                      />
                    
                    </div>
                    <style>
                      {`
                        .react-date-picker__calendar{
                          z-index: 3 !important;
                        }
                      `}
                    </style>
                    <div className="">
                      <div style={{ display: "flex", gap: "0.5rem", alignItems: "baseline" }}>
                        <h5>From:</h5>
                        <DatePicker
                          value={startDate}
                          dateFormat="DD/MM/YYYY"
                          maxDate={new Date()}
                          onChange={(date) => {
                            console.log(date);
                            if (date !== null) {
                              setApplyFilter({ ...applyFilter, date: true });
                            } else {
                              setApplyFilter({ ...applyFilter, date: false });
                            }
                            setStartDate(date);
                          }}
                        />
                        <h5>To:</h5>
                        <DatePicker
                          onChange={(date) => {
                            if (date !== null) {
                              setApplyFilter({ ...applyFilter, date: true });
                            } else {
                              setApplyFilter({ ...applyFilter, date: false });
                            }
                            setEndDate(date);
                          }}
                          minDate={startDate}
                          maxDate={new Date()}
                          value={endDate}
                          dateFormat="DD/MM/YYYY"
                        />
                        <Button
                          variant="contained"
                          className=""
                          style={{ backgroundColor: applyButtonColor ? "#675fe7" : "#0059cd", color: "#fff" }}
                          onClick={() => {
                            setApplyButtonColor(true);
                            if (applyFilter.select === true && applyFilter.date === false) {
                              if (Incomplete === "1") {
                                setShowView(true);
                              } else {
                                setShowView(false);
                              }
                              // if (Incomplete === false) {
                              const FormatedDate = getDateFormat(startDate, endDate);
                              getCategoriesContent(page, limit, Incomplete, search, FormatedDate.sDate, FormatedDate.eDate);

                              // setRowsPerPage(10);
                              // setIncomplete(false);
                              // } else {
                              // const FormatedDate = getDateFormat(startDate, endDate);
                              // getCategoriesContent(page, limit, Incomplete, search, FormatedDate.sDate, FormatedDate.eDate);
                              // setIncomplete(true);
                              // }

                              toast.success("Filtered Data", {
                                position: toast.POSITION.TOP_RIGHT,
                              });
                              console.log(applyFilter);
                            }
                            if (applyFilter.date === true && applyFilter.select === false) {
                              // if (!Incomplete) setShowView(false);
                              if (Incomplete === "1") {
                                setShowView(true);
                              } else {
                                setShowView(false);
                              }
                              if (startDate === null || endDate === null) {
                                toast.info("Please Select Both Dates To Get Filtered Data", {
                                  position: toast.POSITION.TOP_RIGHT,
                                });
                              } else if (startDate !== null && endDate !== null) {
                                const FormatedDate = getDateFormat(startDate, endDate);
                                getCategoriesContent(page, limit, Incomplete, search, FormatedDate.sDate, FormatedDate.eDate);
                                toast.success("Filtered Data", {
                                  position: toast.POSITION.TOP_RIGHT,
                                });
                              }
                              console.log(applyFilter);
                            }
                            if (applyFilter.date === true && applyFilter.select === true) {
                              if (Incomplete === "1") {
                                setShowView(true);
                              } else {
                                setShowView(false);
                              }
                              if (startDate === null || endDate === null) {
                                toast.info("Please Select Both Dates To Get Filtered Data", {
                                  position: toast.POSITION.TOP_RIGHT,
                                });
                              } else if (startDate !== null && endDate !== null) {
                                const FormatedDate = getDateFormat(startDate, endDate);
                                getCategoriesContent(page, limit, Incomplete, search, FormatedDate.sDate, FormatedDate.eDate);
                                toast.success("Filtered Data", {
                                  position: toast.POSITION.TOP_RIGHT,
                                });
                              }
                              console.log(applyFilter);
                            }
                          }}
                        >
                          Apply
                        </Button>
                        <Button
                          variant="contained"
                          className=" "
                          style={{ backgroundColor: "#0059cd", color: "#fff" }}
                          onClick={() => {
                            setSelectedProfile(null);
                            setApplyButtonColor(false);
                            setShowView(true);
                            setApplyFilter({ ...applyFilter, date: false, select: false });
                            setStartDate(null);
                            setEndDate(null);

                            getCategoriesContent();
                          }}
                        >
                          {" "}
                          RESET
                        </Button>
                      </div>
                    </div>
                  </div> */}
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
                    {/* <SearchBar
                      // value={searched}
                      style={{
                        borderRadius: "25px",
                      }}
                      className={"heightfix  "}
                      onChange={(searchVal) => {
                        SearchUser(searchVal);
                        setSearchedValue(searchVal);
                      }}
                      onCancelSearch={() => {
                        cancelSearch();
                        setSearchedValue("");
                      }}
                      placeholder="Search by User Name,Mobile Number"
                      inputProps={{ maxLength: 30 }}
                    /> */}
    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
             
             <div className="" style={{ width: "150px", zIndex: 3 }}>
               <RSelect
                 key={rselKey}
                 options={profileData}
                 defaultValue={{ label: "All", value: "3" }}
                 placeholder="Select Profile"
                 value={selectedProfile}
                 isSearchable={false}
                 onChange={(e) => {
                   setSelectedProfile(e);
                   setApplyFilter({ ...applyFilter, select: true });
                   if (e.value === "0") {
                     // getCategoriesContent(1, limit, false, search);
                     // setRowsPerPage(10);

                     setIncomplete("0");
                   } else if (e.value === "1") {
                     // getCategoriesContent(1, limit, true, search);
                     setIncomplete("1");
                   } else if (e.value === "3") {
                     setIncomplete("3");
                   }
                 }}
               />
             
             </div>
             <style>
               {`
                 .react-date-picker__calendar{
                   z-index: 3 !important;
                 }
               `}
             </style>
             <div className="">
               <div style={{ display: "flex", gap: "0.5rem", alignItems: "baseline" }}>
                 <h5>From:</h5>
                 <DatePicker
                   value={startDate}
                   dateFormat="DD/MM/YYYY"
                   maxDate={new Date()}
                   onChange={(date) => {
                     console.log(date);
                     if (date !== null) {
                       setApplyFilter({ ...applyFilter, date: true });
                     } else {
                       setApplyFilter({ ...applyFilter, date: false });
                     }
                     setStartDate(date);
                   }}
                 />
                 <h5>To:</h5>
                 <DatePicker
                   onChange={(date) => {
                     if (date !== null) {
                       setApplyFilter({ ...applyFilter, date: true });
                     } else {
                       setApplyFilter({ ...applyFilter, date: false });
                     }
                     setEndDate(date);
                   }}
                   minDate={startDate}
                   maxDate={new Date()}
                   value={endDate}
                   dateFormat="DD/MM/YYYY"
                 />
                 <Button
                   variant="contained"
                   className=""
                   style={{ backgroundColor: applyButtonColor ? "#675fe7" : "#0059cd", color: "#fff" }}
                   onClick={() => {
                     setApplyButtonColor(true);
                     if (applyFilter.select === true && applyFilter.date === false) {
                       if (Incomplete === "1") {
                         setShowView(true);
                       } else {
                         setShowView(false);
                       }
                       // if (Incomplete === false) {
                       const FormatedDate = getDateFormat(startDate, endDate);
                       getCategoriesContent(page, limit, Incomplete, search, FormatedDate.sDate, FormatedDate.eDate);

                       // setRowsPerPage(10);
                       // setIncomplete(false);
                       // } else {
                       // const FormatedDate = getDateFormat(startDate, endDate);
                       // getCategoriesContent(page, limit, Incomplete, search, FormatedDate.sDate, FormatedDate.eDate);
                       // setIncomplete(true);
                       // }

                       toast.success("Filtered Data", {
                         position: toast.POSITION.TOP_RIGHT,
                       });
                       console.log(applyFilter);
                     }
                     if (applyFilter.date === true && applyFilter.select === false) {
                       // if (!Incomplete) setShowView(false);
                       if (Incomplete === "1") {
                         setShowView(true);
                       } else {
                         setShowView(false);
                       }
                       if (startDate === null || endDate === null) {
                         toast.info("Please Select Both Dates To Get Filtered Data", {
                           position: toast.POSITION.TOP_RIGHT,
                         });
                       } else if (startDate !== null && endDate !== null) {
                         const FormatedDate = getDateFormat(startDate, endDate);
                         getCategoriesContent(page, limit, Incomplete, search, FormatedDate.sDate, FormatedDate.eDate);
                         toast.success("Filtered Data", {
                           position: toast.POSITION.TOP_RIGHT,
                         });
                       }
                       console.log(applyFilter);
                     }
                     if (applyFilter.date === true && applyFilter.select === true) {
                       if (Incomplete === "1") {
                         setShowView(true);
                       } else {
                         setShowView(false);
                       }
                       if (startDate === null || endDate === null) {
                         toast.info("Please Select Both Dates To Get Filtered Data", {
                           position: toast.POSITION.TOP_RIGHT,
                         });
                       } else if (startDate !== null && endDate !== null) {
                         const FormatedDate = getDateFormat(startDate, endDate);
                         getCategoriesContent(page, limit, Incomplete, search, FormatedDate.sDate, FormatedDate.eDate);
                         toast.success("Filtered Data", {
                           position: toast.POSITION.TOP_RIGHT,
                         });
                       }
                       console.log(applyFilter);
                     }
                   }}
                 >
                   Apply
                 </Button>
                 <Button
                   variant="contained"
                   className=" "
                   style={{ backgroundColor: "#0059cd", color: "#fff" }}
                   onClick={() => {
                     setSelectedProfile(null);
                     setApplyButtonColor(false);
                     setShowView(true);
                     setApplyFilter({ ...applyFilter, date: false, select: false });
                     setStartDate(null);
                     setEndDate(null);

                     getCategoriesContent();
                   }}
                 >
                   {" "}
                   RESET
                 </Button>
               </div>
             </div>
           </div>
                    <Tooltip title={<span style={{ color: "white", fontSize: "16px" }}>Delete All Users</span>} arrow>
                      <IconButton
                        className="buttoncss"
                        style={{ backgroundColor: "#0059cd", color: "#fff" }}
                        onClick={() => {
                          deleteUsers();
                        }}
                      >
                        <DeleteOutlineOutlined />
                      </IconButton>
                    </Tooltip>
                  </div>
                </div>
                {/* </Paper> */}

                {/* //new design */}

                {/* <br /> */}

                {/* status end */}

                <Paper>
                  <TableContainer className={classes.container} style={{ minHeight: tableData.length > 0 ? "50vh" : "" }}>
                    <Table className={classes.table} stickyHeader size="small">
                      <TableHead>
                        <TableRow>
                        <TableCell className={classes.textMiddle}>
                                <Checkbox
                                  color="primary"
                                  // indeterminate={numSelected > 0 && numSelected < data.length  }
                                  indeterminate={
                                    selected.length > 0 &&
                                    selected.length < tableData.length
                                  }
                                  checked={
                                    tableData.length > 0 &&
                                    selected.length === tableData.length
                                  }
                                  onClick={handleSelectAllClick}
                                />
                              </TableCell>
                          <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Sr. No.</TableCell>
                          <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Joining Date</TableCell>
                          <TableCell style={{ textAlign: "center", fontWeight: "bold" }}> User Id</TableCell>
                          <TableCell style={{ textAlign: "center", fontWeight: "bold" }}> Device Type</TableCell>

                          <TableCell style={{ textAlign: "center", fontWeight: "bold" }}> User Name</TableCell>
                          <TableCell style={{ textAlign: "center", fontWeight: "bold" }}> User Type</TableCell>
                          <TableCell style={{ textAlign: "center", fontWeight: "bold" }}> User Language</TableCell>

                          <TableCell style={{ textAlign: "center", fontWeight: "bold" }}> Average Rating</TableCell>
                          {/* <TableCell
                            style={{ textAlign: "center", fontWeight: "bold" }}
                          >
                            Profile Image
                          </TableCell> */}
                          <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Email Id</TableCell>
                          <TableCell style={{ textAlign: "center", fontWeight: "bold" }}> Mobile Number</TableCell>

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
                          .map((category, index) => {
                            const isItemSelected = isSelected(category._id);
                          return(
                            <TableRow 
                            key={category._id}
                            hover
                            onClick={(event) =>
                              handleClick(event, category._id)
                            }
                            role="checkbox"
                            tabIndex={-1}
                            selected={isItemSelected}
                            // hover key={index}
                            >
                               <TableCell className={classes.textMiddle}>
                                      <div className="checkboxColour"><Checkbox
                                        color="primary"
                                        // className={classes.checkSize}
                                        className="form-control"
                                        checked={isItemSelected}
                                      /></div>
                                    </TableCell>
                              <TableCell

                                component="th"
                                scope="row"
                                className={classes.textMiddle}
                                style={{ textAlign: "center" }}
                              >
                                {index + 1 + page * rowsPerPage}
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
                              <TableCell className={classes.textMiddle} style={{ textAlign: "center" }}>
                                {get(category, "user_id", "N/A")}
                              </TableCell>
                              <TableCell className={classes.textMiddle} style={{ textAlign: "center" }}>
                                {get(category, "deviceId", "N/A") === "0" ? (
                                  <GrApple style={{ fontSize: "20px", color: "#424245" }} />
                                ) : (
                                  <GrAndroid style={{ fontSize: "20px", color: "#79c257" }} />
                                )}
                              </TableCell>
                              <TableCell
                                className={classes.textMiddle}
                                style={{ textAlign: "center", textTransform: "capitalize" }}
                              >
                                {category?.username && category?.username !== " " ? category?.username : "N/A"}
                              </TableCell>
                              <TableCell className={classes.textMiddle} style={{ textAlign: "center" }}>
                                {
                                  // Incomplete === true ?
                                  category?.userCategory === "Business" ? (
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
                                  ) : category?.userCategory !== " " && category?.userCategory !== null ? (
                                    category?.userCategory
                                  ) : (
                                    "N/A"
                                  )
                                }
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
                                {get(category, "userLanguage", "N/A")
                                  ? filterLanguageValue(get(category, "userLanguage", "N/A"))
                                  : "N/A"}
                              </TableCell>
                              <TableCell className={classes.textMiddle} style={{ textAlign: "center" }}>
                                {/* {category.country_code + category.phone_number}
                                 */}

                                {/* {get(category, "rating", "N/A")} */}
                                {category.rating ? sanitizeRating(category.rating) : "0"}
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
                                {get(category, "email", "N/A") === null ? "N/A" : get(category, "email", "N/A")}
                              </TableCell>
                              <TableCell className={classes.textMiddle} style={{ textAlign: "center" }}>
                                {/* {category.country_code + category.phone_number}
                                 */}
                                {get(category, "countryCode", "N/A")}&nbsp;
                                {get(category, "phone", "N/A") === null ? "N/A" : get(category, "phone", "N/A")}
                              </TableCell>

                              {/* <TableCell style={{textAlign:"center"}}>{category.doc?<img src={category.doc} alt="doc" style={{width:"50px",height:"50px"}}/>:"No Doc"}</TableCell> */}
                              <TableCell className={classes.textMiddle} style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                                {/* <Button onClick={()=>BlockCategory} style={{backgroundColor:"#696969"}} >Manage</Button> */}
                                {category?.userProfileUpdate === "true" ? (
                                  <Button
                                    className="ViewButton"
                                    onClick={() => {
                                      ViewUserDetails(category);
                                      // ViewUserDetailsNew(category._id);
                                    }}
                                    style={
                                      {
                                        // border: "1.5px solid #c4c4c4",
                                        // margin: "0.5rem",
                                        // color: "#696969",
                                      }
                                    }
                                  >
                                    <Tooltip title={<span style={{ fontSize: "16px" }}>View User</span>} arrow>
                                      <VisibilityIcon />
                                    </Tooltip>
                                  </Button>
                                ) : (
                                  <Button disabled={true}></Button>
                                )}
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
                                  className={category.isBlock === "block" ? "BlockedButton mx-2" : "BlockButton mx-2"}
                                  onClick={() =>
                                    category.isBlock === "block" ? UnblockUser(category._id) : BlockUser(category._id)
                                  }
                                  style={
                                    {
                                      // border: "1.5px solid #c4c4c4",
                                      // margin: "0.5rem",
                                      // color: category.isBlock === "block" ? "red" : "#696969",
                                    }
                                  }
                                >
                                  <Tooltip title={<span style={{ fontSize: "16px" }}>Block/Unblock User</span>} arrow>
                                    <BlockIcon />
                                  </Tooltip>{" "}
                                </Button>
                                {/* <Button onClick={()=>BlockCategory} style={{backgroundColor:"#696969"}} >Manage</Button> */}
                                <Button
                                  className="DeleteButton"
                                  onClick={() => DeleteUser(category._id)}
                                  style={
                                    {
                                      // border: "1.5px solid #c4c4c4",
                                      // margin: "0.5rem",
                                      // color: "#696969",
                                    }
                                  }
                                >
                                  <Tooltip title={<span style={{ fontSize: "16px" }}>Delete User</span>} arrow>
                                    <DeleteOutline />
                                  </Tooltip>
                                </Button>
                              </TableCell>
                            </TableRow>
                          )})}
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
                    key={limit}
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
                      style={{ backgroundColor: "#0059cd", color: "#fff" }}
                      onClick={() => {
                        setPageNumber((pagenum) => pagenum - 1);
                      }}
                    >
                      Previous Page
                    </Button>
                    <Button
                      variant="contained"
                      className="buttoncss mx-3"
                      style={{ backgroundColor: "#0059cd", color: "#fff" }}
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
      {/* {isLoading && (
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
            loading={isLoading}
            size={100}
            // aria-label="Loading Spinner"
            // data-testid="loader"
          />
        </div>
      )} */}
    </React.Fragment>
  );
}
