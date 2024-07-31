import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import axios from "../../axios";
import { toast } from "react-toastify";
// import Switch from '@mui/material/Switch';
// import { styled } from '@mui/material/styles';
// import Skeleton from 'react-loading-skeleton'
// import 'react-loading-skeleton/dist/skeleton.css'
import AddIcon from "@material-ui/icons/Add";
import SearchIcon from "@material-ui/icons/Search";
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
import VpnKeyIcon from "@material-ui/icons/VpnKey";
// import { Delete } from '@material-ui/icons';
import VisibilityIcon from "@material-ui/icons/Visibility";
import BlockIcon from "@material-ui/icons/Block";
// import ArrowBackIcon from "@material-ui/icons/ArrowBack";
// import Modal from '@material-ui/core/Modal';
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Formik, Field, Form } from "formik";
import KErrorMessage from "./KErrorMessage";
import * as yup from "yup";

// For Table
import SearchBar from "material-ui-search-bar";
import { orderBy } from "lodash";

//history
// import {useHistory} from 'react-router-dom'
// import AddEditCategory from "../AccountManagement/Account_Details";

// import './Category_Management.css' ;
import EditIcon from "@material-ui/icons/Edit";
import { Close, DeleteOutline, Description, Notifications, Send, WidgetsOutlined } from "@material-ui/icons";
import Block from "@material-ui/icons/Block";
import { get } from "lodash";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import Visibility from "@material-ui/icons/Visibility";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
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

export default function SubAdmin_Management(props) {
  const classes = useStyles();

  // const history=useHistory();

  const [tableData, setTableData] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [showpassword, setShowPassword] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  //validation pop up
  const validationSchema = yup.object({
    // email: yup.string().required("Email is Required!"),

    password: yup
      .string()
      // .matches(
      //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      //   "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
      // )
      .required("Password is Required!"),
  });

  // For Pagination
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [totalUserListCount, settotalUserListCount] = useState(0);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");

  const handleChangePage = (event, newPage) => {
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
      const { data } = await axios.get(`/private/subadmin?page=${page}&limit=${limit}&search=${search}`);
      console.log(data);
      setTableData([...data.data.docs]);
      setSearchedData(data.data.docs);
      setIsLoading(false);
      settotalUserListCount(data.data.totalDocs);
      setSearch(search);
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

  const EditSubAdmin = (category) => {
    props.history.push({
      pathname: "/adminPanel/AddEdit_SubAdmin",
      state: category,
    });
  };

  const DeleteCategory = async (id) => {
    try {
      if (window.confirm("Are you sure you want to delete this SubAdmin?")) {
        const { data } = await axios.delete(`/private/subadmin/${id}`);
        console.log(data);
        getCategoriesContent(page, limit, search);
        toast.success(data.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      } else {
        toast.error("You have cancelled the operation", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (error) {
      console.log(error);
      toast.error(error, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  // For Search
  const [searched, setSearched] = useState("");
  const [searchedData, setSearchedData] = useState([]);

  const requestSearch = (searchedVal) => {
    console.log(searchedVal);

    const filteredRows = searchedData.filter((row) => {
      let name = row.username;
      let email = row.email;
      return email.toLowerCase().includes(searchedVal.toLowerCase()) || name.toLowerCase().includes(searchedVal.toLowerCase());
    });
    setTableData(filteredRows);
  };

  const cancelSearch = () => {
    getCategoriesContent(page, limit, "");
  };

  //for blocking

  const BlockSubAdmin = async (e) => {
    console.log(e);
    if (e.is_blocked === "block") {
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
          await axios.put(`/private/subadmin-block-unblock/${e._id}`, {
            isBlock: "unblock",
          });
          getCategoriesContent(page, limit, search);
          toast.success("SubAdmin unblocked successfully", {
            position: toast.POSITION.TOP_RIGHT,
          });
          // Swal.fire("Deleted!", "Your file has been deleted.", "success");
        } else {
          toast.error("You have cancelled the operation", {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      });
      // if (window.confirm("Are you sure you want to unblock this SubAdmin?")) {
      //   try {
      //     await axios.put(`/private/subadmin-block-unblock/${e._id}`, {
      //       isBlock: "unblock",
      //     });
      //     getCategoriesContent(page, limit, search);
      //     toast.success("SubAdmin unblocked successfully", {
      //       position: toast.POSITION.TOP_RIGHT,
      //     });
      //   } catch (error) {
      //     console.log(error);
      //   }
      // }
      // else {
      // getCategoriesContent();
      // }
    } else if (e.is_blocked === "unblock") {
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
          await axios.put(`/private/subadmin-block-unblock/${e._id}`, {
            // _id: e._id,
            isBlock: "block",
          });
          getCategoriesContent(page, limit, search);
          toast.success("SubAdmin blocked successfully", {
            position: toast.POSITION.TOP_RIGHT,
          });
          // Swal.fire("Deleted!", "Your file has been deleted.", "success");
        } else {
          toast.error("You have cancelled the operation", {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      });
      // if (window.confirm("Are you sure you want to block this SubAdmin?")) {
      //   try {
      //     await axios.put(`/private/subadmin-block-unblock/${e._id}`, {
      //       // _id: e._id,
      //       isBlock: "block",
      //     });
      //     getCategoriesContent(page, limit, search);
      //     toast.success("SubAdmin blocked successfully", {
      //       position: toast.POSITION.TOP_RIGHT,
      //     });
      //   } catch (error) {
      //     console.log(error);
      //   }
      // }
      // else {
      // getCategory();
      // }
    } else {
      return "error";
    }
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

  const SearchSubAdmin = myDeb((search) => {
    getCategoriesContent(page, limit, search.toLowerCase());
  });
  const sortData = () => {
    let data = tableData.sort((objA, objB) => new Date(objB.createdAt) - new Date(objA.createdAt));
    return data;
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
                  style={{ backgroundColor: "transparent" }}
                  className={classNames(classes.paperHeading, classes.headingAlignment)}
                >
                

                
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem" }}>
                    {" "}
                    <SearchBar
                      // value={searched}
                      style={{ borderRadius: "25px" }}
                      className={"heightfix   "}
                      onChange={(searchVal) => SearchSubAdmin(searchVal)}
                      onCancelSearch={() => cancelSearch()}
                      placeholder="Search by Name,Email"
                    />
                 
                  </div>
                  <Tooltip title={<span style={{ color: "white", fontSize: "16px" }}>Add SubAdmin</span>} arrow>
                      <IconButton
                        className="buttoncss"
                        style={{ backgroundColor: "#0059cd", color: "#fff" }}
                        onClick={() => {
                          props.history.push({
                            pathname: "/adminPanel/AddEdit_SubAdmin",
                          });
                        }}
                      >
                        <AddIcon />
                      </IconButton>
                    </Tooltip>
                </Paper>

                {/* //new design */}

                {/* <br /> */}

                {/* status end */}

                <Paper>
                  <TableContainer className={classes.container} style={{ minHeight: tableData.length > 0 ? "50vh" : "" }}>
                    <Table className={classes.table} stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>Sr. No.</TableCell>
                          <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>SubAdmin Name</TableCell>
                          <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>SubAdmin Image </TableCell>
                          <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>Email ID</TableCell>
                          <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>Mobile Number</TableCell>
                          <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>SubAdmin Id</TableCell>
                          {/* <TableCell
                            style={{ fontWeight: "bold", textAlign: "center" }}
                          >
                            Document
                          </TableCell> */}
                          {/* <TableCell style={{textAlign:"center",fontWeight:"bold"}} >Status</TableCell> */}
                          <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {/* {isLoading?<TableRow ><Skeleton style={{width:"70vw",borderRadius:"20px"}} highlightColor="#fff" height="1rem" count={2} baseColor="#ebebeb"/></TableRow>:false} */}
                        {tableData.map((category, index) => (
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
                              {get(category, "username", "")}
                            </TableCell>
                            <TableCell className={classes.textMiddle} style={{ textAlign: "center" }}>
                              <img src={get(category, "profileImage", "")} alt="..." width="50px" height="50px" />
                            </TableCell>
                            <TableCell className={classes.textMiddle} style={{ textAlign: "center" }}>
                              {get(category, "email", "")}
                            </TableCell>
                            <TableCell className={classes.textMiddle} style={{ textAlign: "center" }}>
                              {get(category, "countryCode", "") + get(category, "phone", "")}
                            </TableCell>
                            <TableCell className={classes.textMiddle} style={{ textAlign: "center" }}>
                              {get(category, "user_id", "")}
                            </TableCell>
                            {/* <TableCell
                                className={classes.textMiddle}
                                style={{ textAlign: "center" }}
                              >
                                <a
                                  href={get(category, "sub_admin_document", "")}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <Tooltip title="Click to View" arrow>
                                    <Description />
                                  </Tooltip>
                                </a>
                              </TableCell> */}

                            {/* 
                                  <TableCell style={{textAlign:"center"}}>      

</TableCell> */}

                            <TableCell
                              className={classes.textMiddle}
                              style={{
                                textAlign: "center",
                                whiteSpace: "nowrap",
                                // display: "flex",
                                // justifyContent: "space-evenly",
                              }}
                            >
                              <Button
                                className="EditButton"
                                //  onClick={()=>EditSubAdmin(category)}
                                onClick={() => {
                                  // setOpen(true);
                                  // setImageurl(category.profile_image);
                                  // setExtractedAdminName(category.name);
                                  // setAllData(category);
                                  EditSubAdmin(category);
                                }}
                                style={
                                  {
                                    // border: "1.5px solid #c4c4c4",
                                    // margin: "0.3rem",
                                    // color: "#0e3f37",
                                  }
                                }
                              >
                                <Tooltip title={<span className="TooltipCustomSize">Edit</span>} arrow>
                                  <EditIcon />
                                </Tooltip>
                              </Button>
                              {/* </TableCell> */}
                              {/* <Button onClick={()=>BlockCategory} style={{backgroundColor:"#696969"}} >Manage</Button> */}
                              {/* <TableCell className={classes.textMiddle} style={{textAlign:"center",border:"none"}}> */}
                              <Button
                                className={category.isBlock === "block" ? "BlockedButton mx-2" : "BlockButton mx-2"}
                                onClick={() => {
                                  BlockSubAdmin({
                                    _id: category._id,
                                    is_blocked: category.isBlock,
                                  });
                                }}
                                style={
                                  {
                                    // border: "1.5px solid #c4c4c4",
                                    // margin: "0.3rem",
                                  }
                                }
                              >
                                {" "}
                                <Tooltip title={<span className="TooltipCustomSize">Block/Unblock Access</span>} arrow>
                                  <Block

                                  // style={{
                                  //   color: category.isBlock === "block" ? "red" : "#696969",
                                  // }}
                                  />
                                </Tooltip>
                              </Button>
                              {/* <Button onClick={()=>BlockCategory} style={{backgroundColor:"#696969"}} >Manage</Button> */}
                              {/* </TableCell> */}
                              {/* <TableCell className={classes.textMiddle} style={{textAlign:"center",border:"none"}}> */}
                              {/* <Button
                                onClick={() => DeleteCategory(category._id)}
                                size="small"
                                className=""
                                style={{
                                  border: "1.5px solid #c4c4c4",
                                  margin: "0.3rem",
                                }}
                              >
                                <Tooltip title="Delete" arrow>
                                  <DeleteOutline />
                                </Tooltip>{" "}
                              </Button> */}
                              {/* <Button onClick={()=>BlockCategory} style={{backgroundColor:"#696969"}} >Manage</Button> */}
                              {/* </TableCell> */}
                            </TableCell>
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
      </div>
    </React.Fragment>
  );
}
