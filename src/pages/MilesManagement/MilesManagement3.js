import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import axios from "../../axios";
import { toast } from "react-toastify";
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
import { orderBy, get } from "lodash";

//history
import { useHistory } from "react-router-dom";
// import AddEditCategory from "../AccountManagement/Account_Details";

import EditIcon from "@material-ui/icons/Edit";
import { DeleteOutline, WidgetsOutlined } from "@material-ui/icons";
import AddIcon from "@material-ui/icons/Add";
import Swal from "sweetalert2";
import { Input, Modal } from "../../components/index";
import { AiOutlineClose } from "react-icons/ai";
import { handleValidateCashbackPoints } from "../../utils/validators";
import { Formik, Form, Field } from "formik";
import NoDataFound from "../../components/NoDataFound";
import PuffLoader from "react-spinners/PuffLoader";

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
          backgroundColor: theme.palette.mode === "dark" ? "#32cd32" : "#32cd32",
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
      backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#f70f07",
      opacity: 1,
      transition: theme.transitions.create(["background-color"], {
        duration: 500,
      }),
    },
  })
);

export default function Tip_Management(props) {
  const classes = useStyles();

  // const history=useHistory();
const [miles_data,setMilesData]=useState({range:"",point:"",_id:""})
  const [tableData, setTableData] = useState([]);
  const [selectedTip, setSelectedTip] = useState("");
  const [modalState, setModalState] = useState({
    isTip: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  // status switch
  // const [checked, setChecked] = useState(true);

  // For Pagination
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [totalUserListCount, settotalUserListCount] = useState(4);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
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
      const { data } = await axios.get(
        // `/private/courierCategory?page=${page}&limit=${limit}&search=${search}`
        `/private/get_miles`
      );
      console.log(data);
      setTableData([...data.data]);
      //   setSearchedData(data.data.docs);
      setSearch(search);
      settotalUserListCount(data.data.length);
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

 


  const DeleteTip = async (category) => {
    try {
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
          const { data } = await axios.delete(
            `/private/tihghghp/${category._id}`
            // , {
            // icon: category.icon,
            // title: category.title,
            // }
          );
          console.log(data);
          getCategoriesContent();
          toast.success("Deleted", {
            position: toast.POSITION.TOP_RIGHT,
          });
          // Swal.fire("Deleted!", "Your file has been deleted.", "success");
        } else {
          toast.error("You have cancelled the operation", {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      });
    } catch (err) {
      console.log(err);
      toast.error(err, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };
  // try {
  //   if (window.confirm("Are you sure you want to delete this Tip?")) {
  //     const { data } = await axios.delete(
  //       `/private/tip/${category._id}`
  //       // , {
  //       // icon: category.icon,
  //       // title: category.title,
  //       // }
  //     );
  //     console.log(data);
  //     getCategoriesContent();
  //     toast.success("Deleted", {
  //       position: toast.POSITION.TOP_RIGHT,
  //     });
  //   } else {
  //     toast.error("You have cancelled the operation", {
  //       position: toast.POSITION.TOP_RIGHT,
  //     });
  //   }
  // } catch (error) {
  //   console.log(error);
  //   toast.error(error, {
  //     position: toast.POSITION.TOP_RIGHT,
  //   });
  // }
  // };

  // status switch

  const statusSwitch = async (e, category) => {
    try {
      //   console.log(id);

      const { data } = await axios.put(`/private/tighghghp/${category._id}`, {
        percentage: category.percentage,
        isActive: e.target.checked ? "1" : "0",
      });
      // props.history.push({
      //     pathname: "/Category_Management",
      //   });

      getCategoriesContent();
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
  const EditPetCategory = (category) => {
    props.history.push({
      pathname: "/adminPanel/AddEditPetCategory",
      state: category,
    });
  };

  const BlockPackageCategory = async (id) => {
    if (window.confirm("Are you sure you want to block this package category?")) {
      try {
        // console.log(category);
        const { data } = await axios.delete(`/private/courierCategory/${id}?status=block`);
        console.log(data);
        getCategoriesContent(page, limit, search);
        toast.success("Package Blocked", {
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
  };

  const UnBlockPackageCategory = async (id) => {
    if (window.confirm("Are you sure you want to unblock this package category?")) {
      try {
        // console.log(category);
        const { data } = await axios.delete(`/private/courierCategory/${id}?status=unblock`);
        console.log(data);
        getCategoriesContent(page, limit, search);
        toast.success("Package Unblocked", {
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
  };
  const getPackageFare = async () => {
    try {
      const { data } = await axios.get(`/private/courier`);
      props.history.push({
        pathname: "/adminPanel/FarePackage",
        state: data.data,
      });
      console.log(data);
    } catch (err) {
      console.log(err);
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

  const SearchPackage = myDeb((search) => {
    getCategoriesContent(page, limit, search.toLowerCase());
  });

  const sortData = () => {
    let data = tableData.sort((objA, objB) => new Date(objB.createdAt) - new Date(objA.createdAt));
    return data;
  };
  const addNewCashbackMile = async (values) => {
    try {
      console.log(values);

      const { data } = await axios.post("/private/add_miles", {
        range:values.range,
    point:values.point,
   
        
      });
      setMilesData({range:"",point:"",_id:""})
      setModalState({ isTip: false });
      getCategoriesContent();
      toast.success(data.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  const EditCashbackMile = async (values) => {
    try {
      console.log(values);

      const { data } = await axios.post(`/private/add_miles`, {
        _id:values._id,
        range:values.range,
        point:values.point,
        // description: values.description || state.description,
        // is_active: state.is_active,
      });
      setModalState({ isTip: false });
      setMilesData({range:"",point:"",_id:""})
      getCategoriesContent();
      toast.success(data.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      console.log(data);
    } catch (error) {
      console.log(error);
    }
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
                  style={{ backgroundColor: "transparent",display:"flex" ,justifyContent:"flex-end"}}
                  className={classNames(classes.paperHeading, classes.headingAlignment)}
                >
                 {/* <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem" }}>
                    {" "}
                    <SearchBar
                      // value={searched}
                      style={{ borderRadius: "25px" }}
                      className={"heightfix   "}
                    //   onChange={(searchVal) => SearchSubAdmin(searchVal)}
                      onCancelSearch={() => cancelSearch()}
                      placeholder="Search by Name,Email"
                    />
                 
                  </div> */}
                
                  
                  <Tooltip title={<span style={{ color: "white", fontSize: "16px" }}>Add </span>} arrow>
                    <IconButton
                      className="buttoncss"
                      style={{ backgroundColor: "#0059cd", color: "#fff" }}
                      onClick={() => {
                        // props.history.push({
                        //   pathname: "/adminPanel/AddEdit_Tip",
                        // });
                        setModalState({ isTip: true });
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
                  <TableContainer className={classes.container} style={{ minHeight: tableData.length > 0 ? "50vh" : "" }} s>
                    <Table className={classes.table} stickyHeader size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell style={{ fontWeight: "bold" }}>Sr. No.</TableCell>
                          {/* <TableCell style={{ fontWeight: "bold" }}>
                            {" "}
                            Tip Name
                          </TableCell> */}
                          <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Miles</TableCell>
                          <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Points</TableCell>

                          <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Actions</TableCell>
                          {/* <TableCell>User Type</TableCell>
                              <TableCell>Status</TableCell> */}
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
                          // sortData()
                          //   .slice(
                          //     page * rowsPerPage,
                          //     page * rowsPerPage + rowsPerPage
                          //   )
                          //   .reverse()
                          .map((category, index) => (
                            <TableRow hover key={index}>
                              <TableCell component="th" scope="row" className={classes.textMiddle}>
                                {index + 1 + page * rowsPerPage}
                              </TableCell>
                              <TableCell className={classes.textMiddle} style={{ textAlign: "center" }}>
                                {/* {get(category, "startRange", "N/A")}-{get(category, "endRange", "N/A")} */}
                                {get(category,"range","N/A")}
                              </TableCell>
                              <TableCell className={classes.textMiddle} style={{ textAlign: "center" }}>
                              {get(category, "point", "N/A")}
                              </TableCell>

                              <TableCell className={classes.textMiddle} style={{ textAlign: "center" }}>
                                <Button
                                  className="EditButton mx-2"
                                  onClick={() => {
                                    // setSelectedTip(category);
                                    setMilesData({range:category.range,point:category.point,_id:category._id})
                                    setModalState({ isTip: true });
                                  }}
                                >
                                  <Tooltip title={<span style={{ fontSize: "16px" }}>Manage</span>} arrow>
                                    <EditIcon />
                                  </Tooltip>
                                </Button>
                             

                             
{/*                             
                                <Button className="DeleteButton" onClick={() => DeleteTip(category)}>
                                  <Tooltip title={<span style={{ fontSize: "16px" }}>Delete</span>} arrow>
                                    <DeleteOutline />
                                  </Tooltip>
                                </Button> */}
                            
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
      {/* FareTaxi Single */}
      <Modal
        maxWidth="lg"
        width="540px"
        isOpen={modalState.isTip}
        onClose={() => {
          setModalState({
            isTip: false,
          });
          setMilesData({range:"",point:"",_id:""})
        }}
        backgroundModal={false}
        backgroundModalContent={false}
        title={
          <div>
            <div
              className="my-3"
              style={{ textAlign: "center", fontWeight: "bold", fontSize: "22px", fontFamily: "'DM Sans', sans-serif" }}
            >
              Manage Miles
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
                    isTip: false,
                  });
                  setMilesData({range:"",point:"",_id:""})
                }}
              />
            </div>
          </div>
        }
        content={
          <>
            <Formik
              initialValues={miles_data}
              validate={(values) => handleValidateCashbackPoints(values)}
              onSubmit={(values) => {
                console.log(values);
                if (miles_data.range !== ""&&miles_data.point!=="") {
                    EditCashbackMile(values);
                } else {
                    addNewCashbackMile(values);
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
                      <div className="col-md-6 text-center">
                        <label>
                          Miles :
                        </label>
                      </div>
                      <div className="col-md-6">
                        <Field name="range">
                          {({ field }) => (
                            <Input
                              {...field}
                              type="number"
                              onChange={(e) => {
                                formikBag.setFieldValue("range", e.target.value);
                              }}
                              error={formikBag.touched.range && formikBag.errors.range ? formikBag.errors.range : null}
                              className="form-control"
                              placeholder={"Enter Range "}
                            />
                          )}
                        </Field>
                      </div>
                    </div>
                    {/* <div className="row my-3">
                      <div className="col-md-6 text-center">
                        <label>
                          Miles End :
                        </label>
                      </div>
                      <div className="col-md-6">
                        <Field name="mileEnd">
                          {({ field }) => (
                            <Input
                              {...field}
                              type="number"
                              onChange={(e) => {
                                formikBag.setFieldValue("mileEnd", e.target.value);
                              }}
                              error={formikBag.touched.mileEnd && formikBag.errors.mileEnd ? formikBag.errors.mileEnd : null}
                              className="form-control"
                              placeholder={"Enter Miles End"}
                            />
                          )}
                        </Field>
                      </div>
                    </div> */}
                    <div className="row my-3">
                      <div className="col-md-6 text-center">
                        <label>
                          Points:
                        </label>
                      </div>
                      <div className="col-md-6">
                        <Field name="point">
                          {({ field }) => (
                            <Input
                              {...field}
                              type="number"
                              onChange={(e) => {
                                formikBag.setFieldValue("point", e.target.value);
                              }}
                              error={formikBag.touched.point && formikBag.errors.point ? formikBag.errors.point : null}
                              className="form-control"
                              placeholder={"Enter Points"}
                            />
                          )}
                        </Field>
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
