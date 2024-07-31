import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import axios from "../../axios";
import { toast } from "react-toastify";
// import Switch from '@mui/material/Switch';
// import { styled } from '@mui/material/styles';
// import Skeleton from "react-loading-skeleton";
// import "react-loading-skeleton/dist/skeleton.css";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import StarRatings from "react-star-ratings";
import ModalImage from "react-modal-image";
import DRIVER from "axios";
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
import Pagination from "react-js-pagination";
// require("bootstrap/less/bootstrap.less");
import RSelect from "react-select";
import noData from "../../../src/assets/images/noData.jpg";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import Swal from "sweetalert2";
import { ServiceType_Url } from "../../statics/constants";
// import "./ViewDriver.css";
import "./ApprovedDriver.css";

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

export default function RatingAndReview(props) {
  const classes = useStyles();

  // const history=useHistory();
  const {
    location: { state },
    history,
  } = props;
  const [tableData, setTableData] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  // status switch
  // const [checked, setChecked] = useState(true);

  // For Pagination
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [totalUserListCount, settotalUserListCount] = useState(90);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [userType, setUserType] = useState("user");
  const [serviceTypeData, setServiceTypeData] = useState([]);
  const [serviceID, setServiceID] = useState("");
  const [month, setMonth] = useState("");
  const [DisplayNoDataImage, setDisplayNoDataImage] = useState(false);
  const handleChangePage = (e) => {
    console.log(e);
    // console.log(newPage);
    setPage(e);
    // console.log(newPage);
    // console.log({ event, newPage });
  };

  const handleChangeRowsPerPage = (event) => {
    getCategoriesContent(page, event.target.value, search);
    setRowsPerPage(parseInt(event.target.value, 10));
    console.log({ event });
    setPage(0);
  };

  useEffect(() => {
    getCategoriesContent();
    getServiceTypes();
  }, [page, state, month, serviceID]);

  //get content
  const getCategoriesContent = async () => {
    try {
      const { data } = await axios.get(
        `/private/ratingReviewsList?id=${state[0]}&page=${page}&limit=${limit}&userType=${state[2]}`
      );
      console.log(data);
      setTableData([...data.data.docs]);
      //   setSearchedData(data.data.docs);
      setSearch(search);
      settotalUserListCount(data.data.totalDocs);
      setDisplayNoDataImage(false);
      if (data.data.docs.length === 0 || data.status === 500) {
        setDisplayNoDataImage(true);
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
      let newArray = data.data.map((ele) => ({ label: ele.title, value: ele._id }));
      setServiceTypeData(newArray);
    } catch (error) {
      console.log(error);
    }
  };
  // edit category itself

  //edit  categories attribute

  // status switch

  // For Search
  const [searched, setSearched] = useState("");
  const [searchedData, setSearchedData] = useState([]);

  //

  const sortData = () => {
    let data = tableData.sort((objA, objB) => new Date(objB.createdAt) - new Date(objA.createdAt));
    return data;
  };

  const selectMonth = [
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

  const handleBackButton = () => {
    Swal.fire({
      showClass: {
        popup: "animate__animated animate__fadeInDown",
      },
      hideClass: {
        popup: "animate__animated animate__fadeOutUp",
      },
      title: "Do you want to save the changes?",
      showConfirmButton: false,
      showDenyButton: true,
      showCloseButton: true,
      showCancelButton: false,
      // confirmButtonText: "Save",
      denyButtonText: `Don't save`,
    }).then((result) => {
      console.log(result);
      /* Read more about isConfirmed, isDenied below */
      if (result.isDenied) {
        props.history.push({
          pathname: state[2] == "driver" ? "/adminPanel/driver-view" : "/adminPanel/ViewUser",
          state: state[2] == "driver" ? [state[3], state[1], state[4], state[5]] : [state[0], state[1], state[3], state[4]],
        });
      } else if (result.isCancelled) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <div className={classes.root}>
          <Paper>
            <div className={classes.paperPaddingRightLeft}>
              <div className="py-3">
                <Paper elevation={0} className={classNames(classes.paperHeading, classes.headingAlignment)}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    {" "}
                    <Button
                      // variant="outlined"
                      // aria-label="add"
                      className={classes.iconMargin}
                      onClick={() => {
                        // handleBackButton();
                        //   props.history.push({
                        //     pathname: state[1].pathname,
                        //     state: state[1],
                        //   });
                        props.history.push({
                          pathname: state[2] == "driver" ? "/adminPanel/driver-view" : "/adminPanel/ViewUser",
                          state:
                            state[2] == "driver"
                              ? [state[3], state[1], state[4], state[5]]
                              : [state[0], state[1], state[3], state[4]],
                        });
                      }}
                    >
                      <ArrowBackIosIcon style={{ fontSize: "2.5rem" }} />
                    </Button>{" "}
                    <h3 style={{}}>Rating & Reviews </h3>
                  </div>

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
                    style={{ backgroundColor: "#0059cd", color: "#fff" }}
                    onClick={() => {
                      props.history.push({
                        pathname: "/adminPanel/AddEdit_Tip",
                      });
                    }}
                  >
                    {" "}
                    Add Tip
                  </Button> */}
                </Paper>

                {/* //new design */}

                {/* <br /> */}

                {/* status end */}

                <Paper elevation={0}>
                  <div>
                    {tableData.map((ele) => (
                      <div style={{ display: "flex", flexDirection: "row", padding: "10px 20px 10px 20px" }}>
                        <div style={{ display: "flex", flex: 1, gap: "10px" }}>
                          <div className="imgFix">
                            <ModalImage
                              small={state[2] === "driver" ? ele?.user?.profileImage : ele?.driver?.profileImage}
                              large={state[2] === "driver" ? ele?.user?.profileImage : ele?.driver?.profileImage}
                              alt="Profile Image"
                            />
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", padding: "15px 0px 0px 0px" }}>
                            <div style={{ textTransform: "capitalize", fontWeight: "bolder", fontSize: "20x" }}>
                              {state[2] === "driver"
                                ? ele?.user?.firstName + " " + ele?.user?.lastName + " " + `(${ele?.bookingId})`
                                : ele?.driver?.firstName + " " + ele?.driver?.lastName + " " + `(${ele?.bookingId})`}
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
                            starDimension="25px"
                            starSpacing="2px"
                          />
                        </div>
                      </div>
                    ))}
                    {DisplayNoDataImage && (
                      <div style={{ textAlign: "center" }}>
                        <img src={noData} alt="noData" style={{ maxHeight: "300px" }} />
                      </div>
                    )}
                    {tableData.length > 10 ? (
                      <div style={{ display: "flex", justifyContent: "center", paddingTop: "40px" }}>
                        <Pagination
                          activePage={page}
                          itemsCountPerPage={limit}
                          totalItemsCount={totalUserListCount}
                          pageRangeDisplayed={5}
                          onChange={handleChangePage}
                          itemClass="page-item"
                          linkClass="page-link"
                          prevPageText="Prev"
                          nextPageText="Next"
                          firstPageText="First"
                          lastPageText="Last"
                        />
                      </div>
                    ) : (
                      false
                    )}
                  </div>
                </Paper>
              </div>
            </div>
          </Paper>
        </div>
      </div>
    </React.Fragment>
  );
}
