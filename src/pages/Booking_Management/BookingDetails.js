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
import ReceiptIcon from "@material-ui/icons/Receipt";
// import { GoogleMap, Marker } from "react-google-maps";
import { compose, withProps, lifecycle } from "recompose";
import { withScriptjs, withGoogleMap, GoogleMap, Marker, DirectionsRenderer } from "react-google-maps";
import RoomIcon from "@material-ui/icons/Room";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
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
import DatePicker from "react-date-picker";
import Swal from "sweetalert2";
import { confirm } from "react-confirm-box";

// import { Delete } from '@material-ui/icons';
import VisibilityIcon from "@material-ui/icons/Visibility";
import BlockIcon from "@material-ui/icons/Block";

// For Table
import SearchBar from "material-ui-search-bar";
import { get, identity, sortBy } from "lodash";

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
import "./Booking_Management.css";
import BookingDetails from "./BookingDetails";
import ModalImage from "react-modal-image";
import { useSelector } from "react-redux";

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
    maxHeight: `58vh`,
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
const MapWithADirectionsRenderer = compose(
  withProps({
    googleMapURL:
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyCekQnZzCVRe1vn3hq18OGpBPgZf2c0cWU&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
    // data: data,
  }),
  withScriptjs,
  withGoogleMap,
  lifecycle({
    componentDidMount({ data }) {
      console.log(data);
      const DirectionsService = new window.google.maps.DirectionsService();
      DirectionsService.route(
        {
          origin: "Chicago, IL",
          // new window.google.maps.LatLng(41.85073, -87.65126),
          destination: "Los Angeles, CA",
          // new window.google.maps.LatLng(41.85258, -87.65141),
          waypoints: [
            {
              location: "Joplin, MO",
              stopover: true,
            },
            {
              location: "Oklahoma City, OK",
              stopover: true,
            },
          ],
          travelMode: window.google.maps.TravelMode.DRIVING,
        },

        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            this.setState({
              directions: result,
            });
          } else {
            console.error(`error fetching directions ${result}`);
          }
        }
      );
    },
  })
)((props) => (
  <GoogleMap defaultZoom={7} defaultCenter={new window.google.maps.LatLng(41.85073, -87.65126)}>
    {props.directions && <DirectionsRenderer directions={props.directions} />}
  </GoogleMap>
));

export default function Booking_Management(props) {
  const classes = useStyles();

  // const history=useHistory();
  const {
    location: { state },
    history,
  } = props;
  const [tableData, setTableData] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [PaginationData, setPaginationData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [statusString, setStatusString] = useState("");
  const [changeID, setChangeID] = useState(state?.serviceType || "62d53aa9bf652aa3778946ca");
  const [rselKey, setRselKey] = useState(0);
  const [initialDate, setInitialDate] = useState(null);
  const [timeLine, setTimeLine] = useState("");
  const [timeLineReset, setTimeLineReset] = useState("");
  // status switch
  // const [checked, setChecked] = useState(true);

  // For Pagination
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const id = useSelector((store) => store.Data.id);
  console.log(id);

  // useEffect(() => {
  //   getCategoriesContent();
  // }, []);

  const handleChangePage = async (event, newPage) => {
    console.log(newPage);
    console.log({ event, newPage });
    !initialDate
      ? getCategoriesContent(newPage + 1, rowsPerPage, Incomplete, search, statusString, "")
      : getCategoriesContent(newPage + 1, rowsPerPage, Incomplete, search, statusString, changeID, start, end);
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
    console.log(+event.target.value);
    // setRowsPerPage(+event.target.value);
    // setPage(0);
    !initialDate
      ? getCategoriesContent(page, event.target.value, Incomplete, search, statusString, "")
      : getCategoriesContent(page, event.target.value, Incomplete, search, statusString, changeID, start, end);
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
  const getCategoriesContent = async () => {
    try {
      const { data } = await axios.get(`/private/bookingDetails/${state[0]}`);
      setTableData(data.data);
      console.log(state);
      console.log(data.data);
      if (data.docs.length === 0 || data.status === 500) {
        toast.error("No Data Found", {
          position: toast.POSITION.TOP_RIGHT,
        });
      } else {
      }
    } catch (err) {
      console.log(err);
    }
    // setPaginationData(data.data);
    // setIsLoading(false);
  };

  console.log(tableData);
  // edit user

  // For Search
  const [searched, setSearched] = useState("");
  const [searchedData, setSearchedData] = useState([]);
  const [UserCategoryData, setUserCategoryData] = useState();
  const [ColoredButton, setColoredButton] = useState({
    taxiSingle: true,
    designatedDriver: false,
    petService: false,
    packageService: false,
  });
  const [ColoredSubButton, setColoredSubButton] = useState({
    Ongoing: true,
    Completed: false,
    Cancelled: false,
  });
  // const [innerHeight,setInnerHeight]=useState("")

  const cancelSearch = () => {
    getCategoriesContent();
    // setSearched("");
    //  console.log(searchedData);
    //  requestSearch()
  };

  useEffect(() => {
    if (state && state !== undefined) {
      console.log(state.serviceType);
      getCategoriesContent();

      setIncomplete(state.Incomplete);
      setSearch(search);
    } else {
      getCategoriesContent();
    }
  }, []);
  const sanitizeDecimal = (rating) => {
    let regexNumber = /^[0-9]+$/;

    if (regexNumber.test(rating)) {
      return rating;
    } else if (typeof rating === "number") {
      // return rating.slice(0, 3);

      return +rating.toFixed(2);
    }
  };

  const viewDriver = (data) => {
    console.log(data);
    let apiHit = {
      page: page + 1,
      limit: rowsPerPage,
      Incomplete: Incomplete,
      search: search,
      status: statusString,
      serviceType: changeID,
      start_date: start,
      end_date: end,
      pathname: "/adminPanel/BookingDetails",
    };
    props.history.push({
      pathname: "/adminPanel/driver-view",
      // state: [data._id, apiHit, data.serviceType],
      state: [data.driver_profiles_info._id, apiHit, changeID, statusString == "cancel" ? "cancel" : "complete"],
    });
  };
  const viewUser = async (data) => {
    let apiHit = {
      page: page + 1,
      limit: rowsPerPage,
      Incomplete: Incomplete,
      search: search,
      status: statusString,
      serviceType: changeID,
      start_date: start,
      end_date: end,
      pathname: "/adminPanel/BookingDetails",
    };
    props.history.push({
      pathname: "/adminPanel/ViewUser",
      state: [data.user._id, apiHit, changeID, statusString == "cancel" ? "cancel" : "complete", state[0]],
    });
  };

  const packageArray = [{}, {}, {}, {}];
  const petArray = [{}, {}, {}, {}];
  return (
    <React.Fragment>
      <div className="page-content">
        <div className={classes.root}>
          <Paper>
            <div className={classes.paperPaddingRightLeft}>
              <div className="py-3">
                <Paper elevation={0} className={classNames(classes.paperHeading, classes.headingAlignment)}>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <Button
                      // variant="outlined"
                      // aria-label="add"
                      // className={classes.iconMargin}
                      onClick={() => {
                        //   props.history.goBack();
                        // }}
                        // props.history.push({
                        //   pathname: state[1].pathname,
                        //   state: state[1],
                        // });
                        props.history.push({
                          pathname:
                            state[2] == "driver"
                              ? "/adminPanel/driver-view"
                              : state[2] == "user"
                              ? "/adminPanel/ViewUser"
                              : "/adminPanel/Booking_Management",
                          state: state[2] == "booking" ? state[1] : [state[3], state[1], state[4], state[5], state[0]],
                        });
                      }}
                    >
                      <ArrowBackIosIcon style={{ fontSize: "2.5rem" }} />
                    </Button>{" "}
                    <h3 style={{}}>Booking Details</h3>
                  </div>
                  {/* <SearchBar
                    // value={searched}
                    style={{
                      width: "30%",
                      marginTop: "70px",
                      // marginLeft: "200px",
                    }}
                    className="heightfix"
                    onChange={(searchVal) => SearchUser(searchVal)}
                    onCancelSearch={() => cancelSearch()}
                    placeholder="Search by User,Driver Name"
                  /> */}
                </Paper>

                {/* //new design */}

                {/* <br /> */}

                {/* status end */}

                <Paper elevation={0}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <div className="mb-3" style={{ fontSize: "20px", fontWeight: "bolder" }}>
                        {tableData[0]?.status == "cancel"
                          ? `Booking ID: ${tableData[0]?.bookingId} , Service: ${
                              tableData[0]?.serviceType?.title
                            } , Ride Type: ${
                              tableData[0]?.scheduleRide === true ? "Scheduled Ride" : "Normal Ride"
                            } , Price: $${sanitizeDecimal(tableData[0]?.price)} , Status: ${tableData[0]?.status}` //ridePrice key changed to price
                          : `Booking ID: ${tableData[0]?.bookingId} , Service: ${
                              tableData[0]?.serviceType?.title
                            } , Price: $${sanitizeDecimal(tableData[0]?.price)} , Status: ${tableData[0]?.status}`}
                      </div>
                      <div>{moment(tableData[0]?.createdAt).format("DD/MM/YYYY")}</div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "", gap: "2%" }}>
                      {/* user div */}
                      <div
                        style={{
                          padding: "20px 20px 20px 20px",
                          borderRadius: "10px",
                          boxShadow: " rgba(0, 0, 0, 0.35) 0px 5px 15px",
                          flex: 1,
                        }}
                      >
                        <div
                          style={{
                            fontWeight: "bolder",
                            fontSize: "20px",
                            // textDecoration: "underline",
                            padding: "10px 0px 10px 0px",
                          }}
                        >
                          User Details:
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: "5%",
                            padding: "5px 0px 5px 0px",
                            borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
                          }}
                        >
                          <div style={{ fontWeight: "bolder", flex: 1 }}>User ID</div>
                          <div style={{ flex: 1 }}>{tableData[0]?.user?.user_id}</div>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: "5%",
                            padding: "5px 0px 5px 0px",
                            borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
                          }}
                        >
                          <div style={{ fontWeight: "bolder", flex: 1 }}>User Name</div>
                          <div style={{ textTransform: "capitalize", flex: 1 }}>
                            {tableData[0]?.user?.firstName + " " + tableData[0]?.user?.lastName}
                          </div>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: "5%",
                            padding: "5px 0px 5px 0px",
                            borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
                          }}
                        >
                          <div style={{ fontWeight: "bolder", flex: 1 }}>Gender</div>
                          <div style={{ flex: 1 }}>{tableData[0]?.user?.gender}</div>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: "5%",
                            padding: "5px 0px 5px 0px",
                            borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
                          }}
                        >
                          <div style={{ fontWeight: "bolder", flex: 1 }}>Pickup Location</div>
                          <div style={{ flex: 1 }}>{tableData[0]?.pickUpPlace}</div>
                        </div>
                        {tableData[0]?.userMultipleWayPoint.length === 0 ? (
                          false
                        ) : (
                          <>
                            {tableData[0]?.userMultipleWayPoint.map((ele, i) => (
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  gap: "5%",
                                  padding: "5px 0px 5px 0px",
                                  borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
                                }}
                              >
                                <div style={{ fontWeight: "bolder", flex: 1 }}>{`Stop ${i + 1}`}</div>
                                <div style={{ flex: 1 }}>
                                  <div style={{ flex: 1 }}>
                                    <RoomIcon />
                                    {ele.wayPlace}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </>
                        )}
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: "5%",
                            padding: "5px 0px 5px 0px",
                            borderBottom: "0.5px solid rgba(0, 0, 0, 0.1)",
                          }}
                        >
                          <div style={{ fontWeight: "bolder", flex: 1 }}>Drop Location</div>
                          <div style={{ flex: 1 }}> {tableData[0]?.dropPlace}</div>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: "5%",
                            padding: "5px 0px 5px 0px",
                            borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
                          }}
                        >
                          <div style={{ fontWeight: "bolder", flex: 1 }}>Ride Start Time </div>
                          <div style={{ flex: 1 }}>{moment(tableData[0]?.pickUpTime).format("LT")}</div>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: "5%",
                            padding: "5px 0px 5px 0px",
                            // borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
                          }}
                        >
                          <div style={{ fontWeight: "bolder", flex: 1 }}>Ride End Time </div>
                          <div style={{ flex: 1 }}>{moment(tableData[0]?.dropTime).format("LT")}</div>
                        </div>
                      </div>
                      {/* driver div */}
                      <div
                        style={{
                          padding: "20px 20px 20px 20px",
                          borderRadius: "10px",
                          boxShadow: " rgba(0, 0, 0, 0.35) 0px 5px 15px",
                          flex: 1,
                        }}
                      >
                        <div
                          style={{
                            fontWeight: "bolder",
                            fontSize: "20px",
                            // textDecoration: "underline",
                            padding: "10px 0px 10px 0px",
                          }}
                        >
                          Driver Details:
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: "5%",
                            padding: "5px 0px 5px 0px",
                            borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
                          }}
                        >
                          <div style={{ fontWeight: "bolder", flex: 1 }}>Driver ID</div>
                          <div style={{ flex: 1 }}>
                            {tableData[0]?.driver?.driverId ? tableData[0]?.driver?.driverId : "N/A"}
                          </div>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: "5%",
                            padding: "5px 0px 5px 0px",
                            borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
                          }}
                        >
                          <div style={{ fontWeight: "bolder", flex: 1 }}>Driver Name</div>
                          <div style={{ textTransform: "capitalize", flex: 1 }}>
                            {tableData[0]?.driver?.firstName + " " + tableData[0]?.driver?.lastName
                              ? tableData[0]?.driver?.firstName + " " + tableData[0]?.driver?.lastName
                              : "N/A"}
                          </div>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: "5%",
                            padding: "5px 0px 5px 0px",
                            borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
                          }}
                        >
                          <div style={{ fontWeight: "bolder", flex: 1 }}>Gender</div>
                          <div style={{ flex: 1 }}>{tableData[0]?.driver?.gender ? tableData[0]?.driver?.gender : "N/A"}</div>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: "5%",
                            padding: "5px 0px 5px 0px",
                            borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
                          }}
                        >
                          <div style={{ fontWeight: "bolder", flex: 1 }}>Vehicle Make</div>
                          <div style={{ flex: 1 }}>
                            {tableData[0]?.driver?.vehicle_details?.vehicleName
                              ? tableData[0]?.driver?.vehicle_details?.vehicleName
                              : "N/A"}
                          </div>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: "5%",
                            padding: "5px 0px 5px 0px",
                            borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
                          }}
                        >
                          <div style={{ fontWeight: "bolder", flex: 1 }}>Vehicle VIN</div>
                          <div style={{ flex: 1 }}>
                            {tableData[0]?.driver?.vehicle_details?.vehicleVIN
                              ? tableData[0]?.driver?.vehicle_details?.vehicleVIN
                              : "N/A"}
                          </div>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: "5%",
                            padding: "5px 0px 5px 0px",
                            borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
                          }}
                        >
                          <div style={{ fontWeight: "bolder", flex: 1 }}> Model</div>
                          <div style={{ flex: 1 }}>
                            {tableData[0]?.driver?.vehicle_details?.model
                              ? tableData[0]?.driver?.vehicle_details?.model
                              : "N/A"}
                          </div>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: "5%",
                            padding: "5px 0px 5px 0px",
                            borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
                          }}
                        >
                          <div style={{ fontWeight: "bolder", flex: 1 }}> Year </div>
                          <div style={{ flex: 1 }}>
                            {tableData[0]?.driver?.vehicle_details?.year ? tableData[0]?.driver?.vehicle_details?.year : "N/A"}
                          </div>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: "5%",
                            padding: "5px 0px 5px 0px",
                            borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
                          }}
                        >
                          <div style={{ fontWeight: "bolder", flex: 1 }}> Color </div>
                          <div style={{ flex: 1 }}>
                            {tableData[0]?.driver?.vehicle_details?.color
                              ? tableData[0]?.driver?.vehicle_details?.color
                              : "N/A"}{" "}
                          </div>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: "5%",
                            padding: "5px 0px 5px 0px",
                            borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
                          }}
                        >
                          <div style={{ fontWeight: "bolder", flex: 1 }}> License Plate </div>
                          <div style={{ flex: 1 }}>
                            {tableData[0]?.driver?.vehicle_details?.drivingLicense
                              ? tableData[0]?.driver?.vehicle_details?.drivingLicense
                              : "N/A"}{" "}
                          </div>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: "5%",
                            padding: "5px 0px 5px 0px",
                            // borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
                          }}
                        >
                          <div style={{ fontWeight: "bolder", flex: 1 }}> Seat Availability </div>
                          <div style={{ flex: 1 }}>
                            {tableData[0]?.driver?.vehicle_details?.seatAvailability
                              ? tableData[0]?.driver?.vehicle_details?.seatAvailability
                              : "N/A"}{" "}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* designatedDriver */}
                  {tableData[0]?.designatedRide === true ? (
                    <div>
                      <div style={{ fontSize: "20px", fontWeight: "bolder", padding: "20px 0px 0px 0px" }}>
                        Designated Driver
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          padding: "20px 20px 20px 20px",
                          borderRadius: "10px",
                          boxShadow: " rgba(0, 0, 0, 0.35) 0px 5px 15px",
                        }}
                      >
                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                          <div style={{ display: "flex", flexDirection: "column" }}>
                            <div style={{ fontWeight: "bolder" }}>Car Images</div>
                            <div style={{ display: "flex" }}>
                              {tableData[0]?.carImages.map((ele) => (
                                <div
                                  style={{ width: "80px", height: "80px", overflow: "hidden", padding: "10px 10px 10px 10px" }}
                                >
                                  <ModalImage small={ele.image} large={ele.image} alt="..." hideDownload hideZoom />
                                </div>
                              ))}
                            </div>
                          </div>
                          <div style={{ fontWeight: "bolder", textTransform: "capitalize" }}></div>
                          {/* <div style={{ fontWeight: "bolder", textTransform: "capitalize" }}>{tableData[0]?.status}</div> */}
                        </div>
                        <div
                          style={{
                            // display: "flex",
                            // flexDirection: "row",
                            padding: "20px 10px 10px 10px",
                            // alignItems: "center",
                          }}
                        >
                          <div style={{ fontWeight: "bolder" }}>User Signature</div>
                          <div style={{ width: "80px", height: "80px", overflow: "hidden" }}>
                            <ModalImage
                              small={tableData[0]?.userSignatureImage}
                              large={tableData[0]?.userSignatureImage}
                              alt="..."
                              hideDownload
                            />
                          </div>{" "}
                        </div>
                      </div>
                    </div>
                  ) : (
                    false
                  )}
                  {/* pet service */}
                  {tableData[0]?.pet_ride === true ? (
                    <div>
                      <div style={{ fontSize: "20px", fontWeight: "bolder", padding: "40px 0px 0px 0px" }}>Pet Service</div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: tableData[0]?.userPetIds.length > 2 ? "space-around" : "",
                          flexWrap: "wrap",
                          padding: "20px 20px 20px 20px",
                          borderRadius: "10px",
                          boxShadow: " rgba(0, 0, 0, 0.35) 0px 5px 15px",
                        }}
                      >
                        {tableData[0]?.userPetIds.map((ele) => (
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              padding: "10px 10px 10px 10px",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <div style={{ width: "80px", height: "80px", overflow: "hidden" }}>
                              {" "}
                              <ModalImage
                                small={ele?.petCategory?.icon}
                                large={ele?.petCategory?.icon}
                                alt="..."
                                hideDownload
                                hideZoom
                              />
                            </div>
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  justifyContent: "space-between",
                                  gap: 10,
                                  borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
                                }}
                              >
                                <div style={{ fontWeight: "bold", flex: 1 }}>Pet Name</div>
                                <div style={{ flex: 1, textTransform: "capitalize" }}>{ele?.petName}</div>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  justifyContent: "space-between",
                                  gap: 10,
                                  borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
                                }}
                              >
                                {" "}
                                <div style={{ fontWeight: "bold", flex: 1 }}>Pet Size</div>
                                <div style={{ flex: 1, textTransform: "capitalize" }}>{ele?.size?.petSize}</div>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  justifyContent: "space-between",
                                  gap: 10,
                                  borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
                                }}
                              >
                                {" "}
                                <div style={{ fontWeight: "bold", flex: 1 }}>Pet Category</div>
                                <div style={{ flex: 1, textTransform: "capitalize" }}> {ele?.petCategory?.title}</div>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  justifyContent: "space-between",
                                  gap: 10,
                                  borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
                                }}
                              >
                                {" "}
                                <div style={{ fontWeight: "bold", flex: 1 }}>Pet Breed</div>
                                <div style={{ flex: 1, textTransform: "capitalize" }}>{ele?.petBreed}</div>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  justifyContent: "space-between",
                                  gap: 10,
                                  borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
                                }}
                              >
                                {" "}
                                <div style={{ fontWeight: "bold", flex: 1 }}> Cage</div>
                                <div style={{ flex: 1 }}>{ele?.cage ? "Yes" : "No"}</div>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  justifyContent: "space-between",
                                  gap: 10,
                                  borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
                                }}
                              >
                                {" "}
                                <div style={{ fontWeight: "bold", flex: 1 }}>Price</div>
                                <div style={{ flex: 1 }}>{`$${ele?.price}`}</div>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  justifyContent: "space-between",
                                  gap: 10,
                                  // borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
                                }}
                              >
                                {" "}
                                <div style={{ fontWeight: "bold", flex: 1 }}>Cage Price </div>
                                <div style={{ flex: 1 }}>{`$${ele?.cagePrice}`}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    false
                  )}
                  {/* package service */}
                  {tableData[0]?.package_ride === true ? (
                    <div>
                      <div style={{ fontSize: "20px", fontWeight: "bolder", padding: "40px 0px 0px 0px" }}>Package Service</div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: tableData[0]?.userPackageId.length > 2 ? "space-around" : "",
                          flexWrap: "wrap",
                          padding: "20px 20px 20px 20px",
                          borderRadius: "10px",
                          boxShadow: " rgba(0, 0, 0, 0.35) 0px 5px 15px",
                        }}
                      >
                        {tableData[0]?.userPackageId.map((ele) => (
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              padding: "10px 10px 10px 10px",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <div style={{ width: "80px", height: "80px", overflow: "hidden" }}>
                              {" "}
                              <ModalImage
                                small={ele?.packageCategory?.icon}
                                large={ele?.packageCategory?.icon}
                                alt="..."
                                hideDownload
                                hideZoom
                              />
                            </div>
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  gap: 10,
                                  borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
                                }}
                              >
                                <div style={{ flex: 1, fontWeight: "bold" }}>Package Category</div>
                                <div style={{ flex: 1, textTransform: "capitalize" }}>{ele?.packageCategory?.title}</div>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  gap: 10,
                                  borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
                                }}
                              >
                                <div style={{ flex: 1, fontWeight: "bold" }}>Package Size</div>
                                <div style={{ flex: 1 }}>{ele?.size?.title}</div>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  gap: 10,
                                  borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
                                }}
                              >
                                <div style={{ flex: 1, fontWeight: "bold" }}>Package Weight</div>
                                <div style={{ flex: 1 }}>{ele?.weight}</div>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  gap: 10,
                                  borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
                                }}
                              >
                                <div style={{ flex: 1, fontWeight: "bold" }}>Package Length</div>
                                <div style={{ flex: 1 }}>{ele?.size?.length}</div>
                              </div>

                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  gap: 10,
                                  borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
                                }}
                              >
                                <div style={{ flex: 1, fontWeight: "bold" }}>Reciever Name</div>
                                <div style={{ flex: 1 }}>{ele?.receiverDetails?.fullName}</div>
                              </div>
                              <div style={{ display: "flex", flexDirection: "row", gap: 10 }}>
                                <div style={{ flex: 1, fontWeight: "bold" }}>Reciever Phone</div>
                                <div style={{ flex: 1 }}>
                                  {ele?.receiverDetails?.countryCode + " " + ele?.receiverDetails?.phone}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    false
                  )}
                  {/* map div */}
                  {tableData[0]?.static_map_image && tableData[0]?.static_map_image !== null ? (
                    <img
                      src={tableData[0].static_map_image}
                      alt="map"
                      style={{ borderRadius: "15px", marginTop: "20px", width: "100%", height: "600px" }}
                    />
                  ) : (
                    <div style={{ padding: "20px 0px 0px 0px" }}>
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d14014.901601500886!2d77.34392775!3d28.57800745!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1667805953416!5m2!1sen!2sin"
                        width="100%"
                        height="450"
                        style={{
                          border: 0,
                          padding: "20px 0px 20px 0px",
                          // borderRadius: "10px",
                          // boxShadow: " rgba(0, 0, 0, 0.35) 0px 5px 15px",
                        }}
                        allowfullscreen=""
                        loading="lazy"
                        referrerpolicy="no-referrer-when-downgrade"
                      ></iframe>
                      {/* <MapWithADirectionsRenderer data={tableData[0]} /> */}
                    </div>
                  )}
                  {/* ride details */}
                  <div style={{ padding: "20px 0px 0px 0px" }}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        padding: "20px 20px 20px 20px",
                        borderRadius: "10px",
                        boxShadow: " rgba(0, 0, 0, 0.35) 0px 5px 15px",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: "bolder",
                          fontSize: "20px",
                          // textDecoration: "underline",
                          padding: "10px 0px 10px 0px",
                        }}
                      >
                        Basic Details:
                      </div>
                      <div style={{ display: "flex", justifyContent: "", borderBottom: "1px solid rgba(0, 0, 0, 0.1)" }}>
                        <div style={{ fontWeight: "bolder", flex: 1 }}> Ride Discount Price</div>
                        <div style={{ flex: 1 }}> {`$${sanitizeDecimal(tableData[0]?.discountPrice)}`} </div>
                      </div>
                      <div style={{ display: "flex", justifyContent: "", borderBottom: "1px solid rgba(0, 0, 0, 0.1)" }}>
                        <div style={{ fontWeight: "bolder", flex: 1 }}> Total Distance</div>
                        <div style={{ flex: 1 }}>
                          {/* {tableData[0]?.distance ? tableData[0]?.distance : "N/A"}{" "} */}
                          {tableData[0]?.ride_distance
                            ? `${sanitizeDecimal(Number(tableData[0]?.ride_distance))} miles`
                            : "N/A"}
                        </div>
                      </div>
                      {/* <div style={{ display: "flex", justifyContent: "", borderBottom: "1px solid rgba(0, 0, 0, 0.1)" }}>
                        <div style={{ fontWeight: "bolder", flex: 1 }}>Total Time</div>
                        <div style={{ flex: 1 }}>Total Time</div>
                      </div> */}
                      <div style={{ display: "flex", justifyContent: "", borderBottom: "1px solid rgba(0, 0, 0, 0.1)" }}>
                        <div style={{ fontWeight: "bolder", flex: 1 }}> Ride Cancel Fee</div>
                        <div style={{ flex: 1 }}>{`$${tableData[0]?.cancellationFee}`} </div>
                      </div>
                      {tableData[0]?.status == "cancel" ? (
                        <>
                          <div style={{ display: "flex", justifyContent: "", borderBottom: "1px solid rgba(0, 0, 0, 0.1)" }}>
                            <div style={{ fontWeight: "bolder", flex: 1 }}> Cancelled By</div>
                            <div style={{ flex: 1 }}>{`${tableData[0]?.cancelBy ? tableData[0]?.cancelBy : "N/A"}`} </div>
                          </div>
                          <div style={{ display: "flex", justifyContent: "", borderBottom: "1px solid rgba(0, 0, 0, 0.1)" }}>
                            <div style={{ fontWeight: "bolder", flex: 1 }}>Cancellation Reason </div>
                            <div style={{ flex: 1 }}>
                              {`${tableData[0]?.cancellationReason ? tableData[0]?.cancellationReason : "N/A"}`}{" "}
                            </div>
                          </div>
                        </>
                      ) : (
                        false
                      )}
                      {/* display data when promocode object is there */}
                      {tableData[0]?.promoCode ? (
                        <>
                          <div style={{ display: "flex", justifyContent: "", borderBottom: "1px solid rgba(0, 0, 0, 0.1)" }}>
                            <div style={{ fontWeight: "bolder", flex: 1 }}> Promocode Discount</div>
                            <div style={{ flex: 1 }}> {`$${sanitizeDecimal(tableData[0]?.promoCode?.discountAmount)}`} </div>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "",
                              borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
                            }}
                          >
                            <div style={{ fontWeight: "bolder", flex: 1 }}> Promocode Type</div>
                            <div style={{ flex: 1 }}>
                              {tableData[0]?.promoCode?.discountType == "0" ? "Flat" : "Percentage"}
                            </div>
                          </div>
                        </>
                      ) : (
                        false
                      )}
                      <div style={{ display: "flex", justifyContent: "", borderBottom: "1px solid rgba(0, 0, 0, 0.1)" }}>
                        <div style={{ fontWeight: "bolder", flex: 1 }}> User Device Type </div>
                        <div style={{ flex: 1 }}> {tableData[0]?.deviceId == "0" ? "iOS" : "Android"}</div>
                      </div>
                      {/* <div style={{ display: "flex", justifyContent: "", borderBottom: "1px solid rgba(0, 0, 0, 0.1)" }}>
                        <div style={{ fontWeight: "bolder", flex: 1 }}> Account Holder Name </div>
                        <div style={{ flex: 1 }}> Account Holder Name </div>
                      </div> */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "",
                          // borderBottom: "1px solid rgba(0, 0, 0, 0.1)"
                        }}
                      >
                        <div style={{ fontWeight: "bolder", flex: 1 }}> Card Type </div>
                        <div style={{ flex: 1, textTransform: "capitalize" }}>
                          {" "}
                          {tableData[0]?.balance_transactions[0]?.charges?.data[0]?.payment_method_details?.card?.brand
                            ? tableData[0]?.balance_transactions[0]?.charges?.data[0]?.payment_method_details?.card?.brand
                            : "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* payment details */}
                  {tableData[0]?.balance_transactions.length > 0 || tableData[0]?.paymentType == "wallet" ? (
                    <div style={{ padding: "40px 0px 0px 0px" }}>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          padding: "20px 20px 20px 20px",
                          borderRadius: "10px",
                          boxShadow: " rgba(0, 0, 0, 0.35) 0px 5px 15px",
                        }}
                      >
                        <div
                          style={{
                            fontWeight: "bolder",
                            fontSize: "20px",
                            // textDecoration: "underline",
                            padding: "10px 0px 10px 0px",
                          }}
                        >
                          Payment Details:
                        </div>
                        <div style={{ display: "flex", justifyContent: "", borderBottom: "1px solid rgba(0, 0, 0, 0.1)" }}>
                          <div style={{ fontWeight: "bolder", flex: 1 }}> Reciept</div>
                          <div style={{ flex: 1 }}>
                            {" "}
                            <a href={tableData[0]?.payment_receipt_url} target="blank" style={{ textDecoration: "none" }}>
                              <ReceiptIcon style={{ cursor: "pointer" }} />
                            </a>{" "}
                          </div>
                        </div>
                        {/* <div style={{ display: "flex", justifyContent: "", borderBottom: "1px solid rgba(0, 0, 0, 0.1)" }}>
                          <div style={{ fontWeight: "bolder", flex: 1 }}> User Name</div>
                          <div style={{ flex: 1 }}> User Name</div>
                        </div> */}
                        <div style={{ display: "flex", justifyContent: "", borderBottom: "1px solid rgba(0, 0, 0, 0.1)" }}>
                          <div style={{ fontWeight: "bolder", flex: 1 }}> Card Type</div>
                          <div style={{ flex: 1 }}>
                            {tableData[0]?.paymentType == "wallet"
                              ? "Wallet"
                              : tableData[0]?.balance_transactions[0]?.charges?.data[0]?.payment_method_details?.card?.brand}
                          </div>
                        </div>
                        {tableData[0]?.paymentType == "wallet" ? (
                          false
                        ) : (
                          <div style={{ display: "flex", justifyContent: "", borderBottom: "1px solid rgba(0, 0, 0, 0.1)" }}>
                            <div style={{ fontWeight: "bolder", flex: 1 }}> Card last 4 digits</div>
                            <div style={{ flex: 1 }}>
                              {tableData[0]?.balance_transactions[0]?.charges?.data[0]?.payment_method_details?.card?.last4}
                            </div>
                          </div>
                        )}
                        <div style={{ display: "flex", justifyContent: "", borderBottom: "1px solid rgba(0, 0, 0, 0.1)" }}>
                          <div style={{ fontWeight: "bolder", flex: 1 }}> Currency</div>
                          <div style={{ flex: 1, textTransform: "uppercase" }}>
                            {" "}
                            {tableData[0]?.paymentType == "wallet" ? "USD" : tableData[0]?.balance_transactions[0]?.currency}
                          </div>
                        </div>
                        {tableData[0]?.paymentType == "wallet" ? (
                          false
                        ) : (
                          <div style={{ display: "flex", justifyContent: "", borderBottom: "1px solid rgba(0, 0, 0, 0.1)" }}>
                            <div style={{ fontWeight: "bolder", flex: 1 }}> Customer ID </div>
                            <div style={{ flex: 1 }}> {tableData[0]?.balance_transactions[0]?.customer}</div>
                          </div>
                        )}
                        <div style={{ display: "flex", justifyContent: "", borderBottom: "1px solid rgba(0, 0, 0, 0.1)" }}>
                          <div style={{ fontWeight: "bolder", flex: 1 }}> Amount </div>
                          {/* <div style={{ flex: 1 }}> {`$${tableData[0]?.balance_transactions[0]?.amount}`}</div> */}
                          <div style={{ flex: 1 }}> {`$${tableData[0]?.price}`}</div>
                        </div>
                        <div style={{ display: "flex", justifyContent: "", borderBottom: "1px solid rgba(0, 0, 0, 0.1)" }}>
                          <div style={{ fontWeight: "bolder", flex: 1 }}> Transaction ID </div>
                          <div style={{ flex: 1 }}>
                            {" "}
                            {tableData[0]?.paymentType == "wallet"
                              ? tableData[0]?.wallet_transactions[0]?.transactionId
                              : tableData[0]?.balance_transactions[0]?.charges?.data[0]?.balance_transaction}
                          </div>
                        </div>
                        {tableData[0]?.paymentType == "wallet" ? (
                          false
                        ) : (
                          <div style={{ display: "flex", justifyContent: "", borderBottom: "1px solid rgba(0, 0, 0, 0.1)" }}>
                            <div style={{ fontWeight: "bolder", flex: 1 }}>Card Expiry Month</div>
                            <div style={{ flex: 1 }}>
                              {tableData[0]?.balance_transactions[0]?.charges?.data[0]?.payment_method_details?.card?.exp_month}
                            </div>
                          </div>
                        )}
                        {tableData[0]?.paymentType == "wallet" ? (
                          false
                        ) : (
                          <div style={{ display: "flex", justifyContent: "", borderBottom: "1px solid rgba(0, 0, 0, 0.1)" }}>
                            <div style={{ fontWeight: "bolder", flex: 1 }}>Card Expiry Year</div>
                            <div style={{ flex: 1 }}>
                              {" "}
                              {
                                tableData[0]?.balance_transactions[0]?.charges?.data[0]?.payment_method_details?.card?.exp_year
                              }{" "}
                            </div>
                          </div>
                        )}
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "",
                            borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
                          }}
                        >
                          <div style={{ fontWeight: "bolder", flex: 1 }}>Country</div>
                          <div style={{ flex: 1 }}>
                            {tableData[0]?.paymentType == "wallet"
                              ? "US"
                              : tableData[0]?.balance_transactions[0]?.charges?.data[0]?.payment_method_details?.card?.country}
                          </div>
                        </div>
                        {/* <div
                          style={{
                            display: "flex",
                            justifyContent: "",
                            borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
                          }}
                        >
                          <div style={{ fontWeight: "bolder", flex: 1 }}>User Paid</div>
                          <div style={{ flex: 1 }}>{`$${sanitizeDecimal(tableData[0]?.ridePrice)}`}</div>
                        </div> */}
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "",
                            borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
                          }}
                        >
                          <div style={{ fontWeight: "bolder", flex: 1 }}>Driver Received</div>
                          <div style={{ flex: 1 }}>{`$${sanitizeDecimal(tableData[0]?.driverBookingPrice)}`}</div>
                        </div>
                        {tableData[0]?.driverTip && tableData[0]?.driverTip != 0 ? (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "",
                              borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
                            }}
                          >
                            <div style={{ fontWeight: "bolder", flex: 1 }}>Driver Tip</div>
                            <div style={{ flex: 1 }}>{`$${sanitizeDecimal(tableData[0]?.driverTip)}`}</div>
                          </div>
                        ) : (
                          false
                        )}
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "",
                            //  borderBottom: "1px solid rgba(0, 0, 0, 0.1)"
                          }}
                        >
                          <div style={{ fontWeight: "bolder", flex: 1 }}>Admin Commission</div>
                          <div style={{ flex: 1 }}>{`$${sanitizeDecimal(tableData[0]?.rideAdminCommission)}`}</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    false
                  )}
                </Paper>
              </div>
            </div>
          </Paper>
        </div>
      </div>
    </React.Fragment>
  );
}
