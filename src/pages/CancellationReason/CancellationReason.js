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
import { useUploadImage } from "../../services/Imagecustomhook";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";
import Axios from "axios";
import { handleValidateAddEditCancellationData, handleValidateCancellationReason } from "../../utils/validators";
import NoDataFound from "../../components/NoDataFound";
import PuffLoader from "react-spinners/PuffLoader";
import { ImageUploadUrl } from "../../statics/constants";
import RSelect from "react-select";

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
          backgroundColor: theme.palette.mode === "dark" ? "#0059cd" : "#0059cd",
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

export default function CancellationReason(props) {
  const classes = useStyles();
  const { isSuccess, uploadForm, progress } = useUploadImage(`${ImageUploadUrl}/fileUpload`);
  const [selectedCancellationReasonData, setSelectedCancellationReasonData] = useState(null);
  const [modalState, setModalState] = useState({
    isAddEditCancellationReason: "",
  });
  const [userType, setUserType] = useState("user");
  // const history=useHistory();
  const [userTypeValue, setUserTypeValue] = useState();
  const [tableData, setTableData] = useState([]);

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
  }, [userType]);

  //get content
  const getCategoriesContent = async (page = 1, limit = 10, search = "") => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(
        // `/private/courierCategory?page=${page}&limit=${limit}&search=${search}`
        `/private/cancelReason?userType=${userType}`
      );
      console.log(data);
      setTableData([...data.data]);
      //   setSearchedData(data.data.docs);
      setSearch(search);
      setIsLoading(false);
      //   settotalUserListCount(data.data.totalDocs);
      if (data.data.length === 0 || data.status === 500) {
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

  //edit  categories attribute

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

  // For Search
  const [searched, setSearched] = useState("");
  const [searchedData, setSearchedData] = useState([]);

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

  const addNewCancellationReason = async (values) => {
    try {
      console.log(values);

      const { data } = await axios.post("/private/cancelReason", {
        userType: userType,
        messages: [
          {
            message: values.English,
            language: "en",
          },
          {
            message: values.Korean,
            language: "ko",
          },
          {
            message: values.Chinese,
            language: "zh",
          },
          {
            message: values.Spanish,
            language: "es",
          },
        ],
        // description: values.description,
      });
      // props.history.push({
      //   pathname: "/adminPanel/Tip_Management",
      // });
      setSelectedCancellationReasonData(null);
      setModalState({ isAddEditCancellationReason: false });
      getCategoriesContent();
      toast.success(data.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  // Edit Category . update api

  const EditCancellationReasons = async (values) => {
    try {
      console.log(values);

      const { data } = await axios.put(`/private/cancelReason/${selectedCancellationReasonData._id}`, {
        // message: values.,
        // language: state.language,
        userType: userType,
        data: [
          {
            message: values.English,
            language: "en",
          },
          {
            message: values.Korean,
            language: "ko",
          },
          {
            message: values.Chinese,
            language: "zh",
          },
          {
            message: values.Spanish,
            language: "es",
          },
        ],
      });
      // props.history.push({
      //   pathname: "/adminPanel/CancellationReason",
      // });
      setSelectedCancellationReasonData(null);
      setModalState({ isAddEditCancellationReason: false });
      getCategoriesContent();
      toast.success(data.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  const typeofUser = [
    { label: "User", value: "user" },
    { label: "Driver", value: "driver" },
  ];
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
                  <h3 style={{}}> </h3>

                  {/* <SearchBar
                    style={{ width: "30%", marginTop: 70 }}
                    // value={searched}
                    className="heightfix"
                    onChange={(searchVal) => SearchPackage(searchVal)}
                    onCancelSearch={() => cancelSearch()}
                    placeholder="Search by Tip"
                  /> */}
                  {/* <Button
                    variant="contained"
                    className="buttoncss"
                    style={{ backgroundColor: "#0059cd", color: "#fff" }}
                    onClick={() => {
                      getPackageFare();
                    }}
                  >
                    {" "}
                    <WidgetsOutlined />
                    &nbsp; Manage fare
                  </Button> */}
                  {/* <Button
                    variant="contained"
                    className="buttoncss"
                    style={{ backgroundColor: "#0059cd", color: "#fff", display: totalUserListCount >= 5 ? "none" : "block" }}
                    onClick={() => {
                      props.history.push({
                        pathname: "/adminPanel/AddEdit_Tip",
                      });
                    }}
                  >
                    {" "}
                    Add Tip
                  </Button> */}
                  <div style={{ width: "200px", zIndex: 3 }}>
                    <RSelect
                      defaultValue={typeofUser[0]}
                      options={typeofUser}
                      value={userTypeValue}
                      onChange={(e) => {
                        setUserType(e.value);
                        setUserTypeValue(e);
                      }}
                    />
                  </div>
                  <Tooltip title={<span style={{ color: "white", fontSize: "16px" }}>Add Cancellation Reason</span>} arrow>
                    <IconButton
                      className="buttoncss"
                      style={{ backgroundColor: "#0059cd", color: "#fff" }}
                      onClick={() => {
                        // props.history.push({
                        //   pathname: "/adminPanel/AddEditCancellation",
                        // });
                        setSelectedCancellationReasonData(null);
                        setModalState({ isAddEditCancellationReason: true });
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
                          <TableCell style={{ fontWeight: "bold" }}>Sr. No.</TableCell>
                          {/* <TableCell style={{ fontWeight: "bold" }}>
                            {" "}
                            Tip Name
                          </TableCell> */}
                          <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>English</TableCell>
                          <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Korean</TableCell>
                          <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Chinese</TableCell>
                          <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Spanish</TableCell>

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
                                {category.messages.filter((ele) => ele.language === "en").map((ele) => ele.message)}
                              </TableCell>
                              <TableCell className={classes.textMiddle} style={{ textAlign: "center" }}>
                                {category.messages.filter((ele) => ele.language === "ko").map((ele) => ele.message)}
                              </TableCell>
                              <TableCell className={classes.textMiddle} style={{ textAlign: "center" }}>
                                {category.messages.filter((ele) => ele.language === "zh").map((ele) => ele.message)}
                              </TableCell>
                              <TableCell className={classes.textMiddle} style={{ textAlign: "center" }}>
                                {category.messages.filter((ele) => ele.language === "es").map((ele) => ele.message)}
                              </TableCell>
                              {/* <TableCell className={classes.textMiddle} style={{ textAlign: "center" }}>
                                <Tooltip title="Active/Inactive" arrow>
                                  <Button>
                                    <IOSSwitch
                                      onChange={(e) => {
                                        statusSwitch(e, category);
                                      }}
                                      checked={category.isActive == 1 ? true : false}
                                    />
                                  </Button>
                                </Tooltip>
                              </TableCell> */}

                              <TableCell className={classes.textMiddle} style={{ textAlign: "center" }}>
                                <Button
                                  onClick={() => {
                                    setSelectedCancellationReasonData(category);
                                    setModalState({ isAddEditCancellationReason: true });
                                  }}
                                  className="EditButton"
                                >
                                  <Tooltip title={<span className="TooltipCustomSize">Edit</span>} arrow>
                                    <EditIcon />
                                  </Tooltip>
                                </Button>
                                {/* <Button
                                  onClick={() =>
                                    category.isBlock === "block"
                                      ? UnBlockPackageCategory(category._id)
                                      : BlockPackageCategory(category._id)
                                  }
                                  className=""
                                  style={{
                                    border: "1.5px solid #F6F6F6",
                                    margin: "0.5rem",
                                    color:
                                      category.isBlock === "block"
                                        ? "red"
                                        : "#696969",
                                  }}
                                >
                                  <Tooltip title="Block/Unblock" arrow>
                                    <BlockIcon />
                                  </Tooltip>
                                </Button> */}

                                {/* <Button onClick={()=>BlockCategory} style={{backgroundColor:"#696969"}} >Manage</Button> */}
                                {/* <Button
                                  onClick={() => {
                                    props.history.push({
                                      pathname: "/EditCategoryAttributes",
                                      state: category._id,
                                    });
                                  }}
                                  className=""
                                  style={{
                                    border: "1.5px solid #F6F6F6",
                                    margin: "0.5rem",
                                    color: "#0e3f37",
                                  }}
                                >
                                  {" "}
                                  <Tooltip title="Manage Category" arrow>
                                    <WidgetsOutlined />
                                  </Tooltip>
                                </Button> */}
                                {/* <Button onClick={()=>BlockCategory} style={{backgroundColor:"#696969"}} >Manage</Button>
                                <Button
                                  className=""
                                  onClick={() => DeleteTip(category)}
                                  style={{
                                    // border: "1.5px solid #c4c4c4",
                                    // margin: "0.5rem",
                                    color: "#696969",
                                  }}
                                >
                                  <Tooltip title="Delete" arrow>
                                    <DeleteOutline />
                                  </Tooltip>
                                </Button> */}
                                {/* <Button onClick={()=>BlockCategory} style={{backgroundColor:"#696969"}} >Manage</Button> */}
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

      {/* AddEdit Taxi Single */}
      <Modal
        maxWidth="lg"
        width="840px"
        isOpen={modalState.isAddEditCancellationReason}
        onClose={(event, reason) => {
          if (reason && (reason === "backdropClick" || "escapeKeyDown")) {
            console.log(reason);
            setModalState({
              isAddEditCancellationReason: true,
            });
          } else {
            setModalState({
              isAddEditCancellationReason: false,
            });
            setSelectedCancellationReasonData(null);
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
              {selectedCancellationReasonData === null ? "Add Cancellation Reason" : "Edit Cancellation Type"}
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
                    isAddEditCancellationReason: false,
                  });
                  setSelectedCancellationReasonData(null);
                }}
              />
            </div>
          </div>
        }
        content={
          <>
            <Formik
              initialValues={{
                English: get(selectedCancellationReasonData, "messages[0].message", ""),
                Korean: get(selectedCancellationReasonData, "messages[1].message", ""),
                Chinese: get(selectedCancellationReasonData, "messages[2].message", ""),
                Spanish: get(selectedCancellationReasonData, "messages[3].message", ""),
              }}
              validate={(values) => handleValidateAddEditCancellationData(values, selectedCancellationReasonData)}
              onSubmit={(values) => {
                console.log(values);
                if (selectedCancellationReasonData !== null) {
                  EditCancellationReasons(values);
                  // EditTaxiSingle(values);
                } else {
                  addNewCancellationReason(values);
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
                        <label>English :</label>
                        <Field name="English">
                          {({ field }) => (
                            <Input
                              {...field}
                              type="text"
                              onChange={(e) => {
                                formikBag.setFieldValue("English", e.target.value);
                              }}
                              error={formikBag.touched.English && formikBag.errors.English ? formikBag.errors.English : null}
                              className="form-control"
                              placeholder={"Enter Reason in English"}
                            />
                          )}
                        </Field>
                      </div>
                      <div className="col-md-6">
                        <label>Korean :</label>
                        <Field name="Korean">
                          {({ field }) => (
                            <Input
                              {...field}
                              type="text"
                              onChange={(e) => {
                                formikBag.setFieldValue("Korean", e.target.value);
                              }}
                              error={formikBag.touched.Korean && formikBag.errors.Korean ? formikBag.errors.Korean : null}
                              className="form-control"
                              placeholder={"Enter Reason in Korean"}
                            />
                          )}
                        </Field>
                      </div>
                    </div>
                    <div className="row my-3">
                      <div className="col-md-6">
                        <label>Chinese :</label>
                        <Field name="Chinese">
                          {({ field }) => (
                            <Input
                              {...field}
                              type="text"
                              onChange={(e) => {
                                formikBag.setFieldValue("Chinese", e.target.value);
                              }}
                              error={formikBag.touched.Chinese && formikBag.errors.Chinese ? formikBag.errors.Chinese : null}
                              className="form-control"
                              placeholder={"Enter Reason in Chinese"}
                            />
                          )}
                        </Field>
                      </div>
                      <div className="col-md-6">
                        <label>Spanish :</label>
                        <Field name="Spanish">
                          {({ field }) => (
                            <Input
                              {...field}
                              type="text"
                              onChange={(e) => {
                                formikBag.setFieldValue("Spanish", e.target.value);
                              }}
                              error={formikBag.touched.Spanish && formikBag.errors.Spanish ? formikBag.errors.Spanish : null}
                              className="form-control"
                              placeholder={"Enter Reason in Spanish"}
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
                        cursor: "pointer",
                      }}
                      //  disabled={formikBag.values.ImageLink && !formikBag.errors ? false : true}
                    >
                      SAVE
                    </button>
                    {console.log(formikBag.errors)}
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
