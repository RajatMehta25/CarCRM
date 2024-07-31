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
import { CancelPresentationOutlined, Close, Search } from "@material-ui/icons";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ReactPaginate from "react-paginate";
import { getDateFormat } from "../../helpers/helperFunction";
import SearchIcon from "@material-ui/icons/Search";
import FilterListIcon from "@material-ui/icons/FilterList";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import RefreshIcon from "@material-ui/icons/Refresh";
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
// import "./ScheduledRidesManagement.css";
// import BookingDetails from "./BookingDetails";
import { useDispatch } from "react-redux";
import { getDetails } from "../../store/Data/action";
import NoDataFound from "../../components/NoDataFound";
import PuffLoader from "react-spinners/PuffLoader";
import { Input, Modal } from "../../components/index";
import { AiOutlineClose } from "react-icons/ai";
import "./Schedule.css";
// import RefreshIcon from "@material-ui/icons/Refresh";

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
    // maxHeight: `58vh`,
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

export default function ScheduledRidesManagement(props) {
  const classes = useStyles();

  // const history=useHistory();
  const {
    location: { state },
    history,
  } = props;
  const [locationText, setLocationText] = useState(null);

  const [searchedDriverData, setSearchedDriverData] = useState([]);
  const [puffLoader, setPuffLoader] = useState(false);
  const [bookinggId, setBookingId] = useState("");
  const [findindDriverData, setFindingDriverData] = useState(true);
  const [DriverData, setDriverData] = useState([]);
  const [modalState, setModalState] = useState({ ViewDrivers: "" });
  const [selectedViewDetail, setSelectedViewDetail] = useState("");
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
  const [showSearch, setShowSearch] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  // status switch
  // const [checked, setChecked] = useState(true);

  // For Pagination
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  useEffect(() => {
    setRselKey((k) => k + 1);
  }, [tableData]);

  const handleChangePage = async (event, newPage) => {
    console.log(newPage);
    console.log({ event, newPage });
    !initialDate
      ? getCategoriesContent(newPage + 1, rowsPerPage, Incomplete, search, statusString, changeID)
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
      ? getCategoriesContent(0, event.target.value, Incomplete, search, statusString, changeID)
      : getCategoriesContent(0, event.target.value, Incomplete, search, statusString, changeID, start, end);
    setRowsPerPage(parseInt(event.target.value, 10));
    console.log({ event });
    setPage(0);
  };

  // useEffect(() => {
  //   getCategoriesContent();
  // }, []);

  //get content
  const [pagenumber, setPageNumber] = useState(1);
  const [totalUserListCount, settotalUserListCount] = useState(0);
  const [limit, setLimit] = useState(10);
  const [Incomplete, setIncomplete] = useState(true);
  const [search, setSearch] = useState("");
  const getCategoriesContent = async (
    page = 1,
    limit = 10,
    Incomplete = true,
    search = "",
    status = "pending",
    serviceType = "",
    start_date = "",
    end_date = "",
    rideTypeStatus = 1
  ) => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(
        `/private/singleTaxiBookingList?page=${page}&limit=${limit}&Incomplete=${Incomplete}&search=${search}&status=${status}&serviceType=${serviceType}&start_date=${start_date}&end_date=${end_date}&rideTypeStatus=${rideTypeStatus}`
      );
      console.log(data);
      setTableData([...data.docs]);
      setSearchedData(data.docs);
      settotalUserListCount(data.totalDocs);
      setIncomplete(Incomplete);
      setSearch(search);
      setPage(data.page - 1);
      setLimit(data.limit);
      setStatusString(status);
      // setChangeID(serviceType); // change here
      // switch (status) {
      //   case "ongoing":
      //     setSubButtonColor("Ongoing");

      //     break;
      //   case "completed":
      //     setSubButtonColor("Completed");

      //     break;
      //   case "cancel":
      //     setSubButtonColor("Cancelled");

      //     break;

      //   default:
      //     break;
      // }
      // switch (serviceType) {
      //   case "62d53aa9bf652aa3778946ca":
      //     setButtonColor("Single Taxi");
      //     break;
      //   case "62d53abebf652aa3778946cd":
      //     setButtonColor("Designated Driver");
      //     break;
      //   case "62d53ad1bf652aa3778946d0":
      //     setButtonColor("Pet Service");
      //     break;
      //   case "62d53ae6bf652aa3778946d3":
      //     setButtonColor("Package Service");
      //     break;

      //     break;

      //   default:
      //     break;
      // }
      // setPaginationData(data.data);
      // setIsLoading(false);
      setIsLoading(false);
      if (data.docs.length === 0 || data.status === 500) {
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
  // const [ColoredButton, setColoredButton] = useState({
  //   taxiSingle: true,
  //   designatedDriver: false,
  //   petService: false,
  //   packageService: false,
  // });
  // const [ColoredSubButton, setColoredSubButton] = useState({
  //   Ongoing: true,
  //   Completed: false,
  //   Cancelled: false,
  // });
  // const [innerHeight,setInnerHeight]=useState("")

  const cancelSearch = () => {
    getCategoriesContent(page, limit, Incomplete, "", statusString, changeID, start, end);
    // setSearched("");
    //  console.log(searchedData);
    //  requestSearch()
  };

  useEffect(() => {
    if (state && state !== undefined) {
      console.log(state.serviceType);
      getCategoriesContent(
        state.page,
        state.limit,
        state.Incomplete,
        state.search,
        state.status,
        state.serviceType,
        state.start_date,
        state.end_date
      );

      setIncomplete(state.Incomplete);
      setSearch(search);
      switch (state.serviceType) {
        case "62d53aa9bf652aa3778946ca":
          setParentTabValue(0);
          break;
        // case "62d53abebf652aa3778946cd":
        //   setParentTabValue(1);
        //   break;
        case "62d53ad1bf652aa3778946d0":
          setParentTabValue(1);
          break;
        case "62d53ae6bf652aa3778946d3":
          setParentTabValue(2);
          break;

        default:
          setParentTabValue(0);
          break;
      }
      switch (state.status) {
        case "pending":
          setTabValue(0);
          break;
        case "confirm":
          setTabValue(1);
          break;

        default:
          setTabValue(0);
          break;
      }

      console.log(state.page);
      console.log(state.limit);
      console.log(state.Incomplete);
      console.log(state.search);
      console.log(state.status);
      console.log(state.serviceType);
      console.log(state.start_date);
      console.log(state.end_date);
    } else {
      getCategoriesContent(page, rowsPerPage, Incomplete, search, "pending", changeID);
      // console.log(state.page);
      // console.log(state.limit);
      // console.log(state.Incomplete);
      // console.log(state.search);
      // console.log(state.status);
      // console.log(state.serviceType);
      // console.log(state.start_date);
      // console.log(state.end_date);
    }
    // (window.innerHeight);
  }, []);

  const SearchUser = async (search) => {
    getCategoriesContent(page, rowsPerPage, Incomplete, search.toLowerCase(), statusString, changeID, start, end);
  };
  const SearchDriverData = async (search) => {
    // getCategoriesContent(page, rowsPerPage, Incomplete, search.toLowerCase(), statusString, changeID, start, end);

    const filteredRows = searchedDriverData.filter((row) => {
      let name = row.driverFirstName + row.driverLastName;
      let phone = row.countryCode + row.phone
      return name.toLowerCase().includes(search.toLowerCase())||
      phone.toLowerCase().includes(search.toLowerCase());
    });
    setDriverData(filteredRows);
  };

  const cancelSearchDriverData = async () => {
    setFindingDriverData(true);
    try {
      const { data } = await axios.post(`/private/scheduleRide-driver-find`, {
        bookingId: bookinggId,
      });
      console.log("driverData", data);
      setDriverData(data.user);
      setSearchedDriverData(data.user);
      setFindingDriverData(false);
    } catch (error) {
      console.log(error);
    }
    // setSearched("");
    //  console.log(searchedData);
    //  requestSearch()
  };

  const AllModules = ["Single Taxi", "Pet Service", "Package Service"];
  const SubModules = ["Pending", "Confirm"];

  // const setButtonColor = (e) => {
  //   switch (e) {
  //     case "Single Taxi":
  //       setColoredButton({
  //         ...ColoredButton,
  //         taxiSingle: true,
  //         designatedDriver: false,
  //         petService: false,
  //         packageService: false,
  //       });
  //       break;
  //     case "Designated Driver":
  //       setColoredButton({
  //         ...ColoredButton,
  //         taxiSingle: false,
  //         designatedDriver: true,
  //         petService: false,
  //         packageService: false,
  //       });
  //       break;
  //     case "Pet Service":
  //       setColoredButton({
  //         ...ColoredButton,
  //         taxiSingle: false,
  //         designatedDriver: false,
  //         petService: true,
  //         packageService: false,
  //       });
  //       break;
  //     case "Package Service":
  //       setColoredButton({
  //         ...ColoredButton,
  //         taxiSingle: false,
  //         designatedDriver: false,
  //         petService: false,
  //         packageService: true,
  //       });
  //       break;

  //     default:
  //       break;
  //   }
  // };

  const setSubButtonColor = (e) => {
    switch (e) {
      case "Ongoing":
        // setColoredSubButton({
        //   ...ColoredSubButton,
        //   Ongoing: true,
        //   Completed: false,
        //   Cancelled: false,
        // });
        setStatusString("ongoing");
        break;
      case "Completed":
        // setColoredSubButton({
        //   ...ColoredSubButton,
        //   Ongoing: false,
        //   Completed: true,
        //   Cancelled: false,
        // });
        setStatusString("completed");
        break;
      case "Cancelled":
        // setColoredSubButton({
        //   ...ColoredSubButton,
        //   Ongoing: false,
        //   Completed: false,
        //   Cancelled: true,
        // });
        setStatusString("cancel");
        break;

      default:
        break;
    }
  };
  useEffect(() => {
    // setColoredSubButton({
    //   ...ColoredSubButton,
    //   Ongoing: true,
    //   Completed: false,
    //   Cancelled: false,
    // });
    setStatusString("pending");
    // setTabValue(0);
  }, [changeID]);

  const __options = (category) => [
    ...(category?.userMultipleWayPoint || []).map(({ wayPlace, _id }) => ({
      label: wayPlace,
      value: _id,
    })),
    {
      label: get(category, "dropPlace", "N/A"),
      value: get(category, "dropPlace", "N/A"),
    },
  ];

  const filterTimeLength = [
    { label: "Weekly", value: "Weekly" },
    { label: "Monthly", value: "Monthly" },
    { label: "Yearly", value: "Yearly" },
  ];

  const calculateFilter = () => {
    if (timeLine === "" && initialDate === null) {
      toast.info("Select Both Values", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
    if ((timeLine === "" && initialDate) || (timeLine && initialDate === null) || (timeLine && initialDate === undefined)) {
      toast.info("Select Both Values ", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
    if (timeLine && initialDate) {
      if (timeLine === "Weekly") {
        console.log(initialDate);
        let sdate = new Date(initialDate);
        let startDate = sdate.getFullYear() + "-" + (sdate.getMonth() + 1) + "-" + sdate.getDate();
        let endDate = sdate.getFullYear() + "-" + (sdate.getMonth() + 1) + "-" + (sdate.getDate() + 6);
        console.log(endDate);
        setStart(startDate);
        setEnd(endDate);
        getCategoriesContent(1, 10, true, "", statusString, changeID, startDate, endDate);
        toast.success("Filter Applied", { position: "top-right" });
      } else if (timeLine === "Monthly") {
        let sdate = new Date(initialDate);
        let startDate = sdate.getFullYear() + "-" + (sdate.getMonth() + 1) + "-" + sdate.getDate();
        let endDate = sdate.getFullYear() + "-" + (sdate.getMonth() + 2) + "-" + sdate.getDate();
        console.log(endDate);
        setStart(startDate);
        setEnd(endDate);
        getCategoriesContent(
          1,
          10,
          true,
          "",
          statusString,
          changeID,

          startDate,
          endDate
        );
        toast.success("Filter Applied", { position: "top-right" });
      } else {
        let sdate = new Date(initialDate);
        let startDate = sdate.getFullYear() + "-" + (sdate.getMonth() + 1) + "-" + sdate.getDate();
        let endDate = sdate.getFullYear() + 1 + "-" + (sdate.getMonth() + 1) + "-" + sdate.getDate();
        console.log(endDate);
        setStart(startDate);
        setEnd(endDate);
        getCategoriesContent(1, 10, true, "", statusString, changeID, startDate, endDate);
        toast.success("Filter Applied", { position: "top-right" });
      }
    }
  };

  const dispatch = useDispatch();
  const BookingDetails = (bookingID) => {
    let payload = {
      page: page + 1,
      limit: rowsPerPage,
      Incomplete: Incomplete,
      search: search,
      status: statusString,
      serviceType: changeID,
      start_date: start,
      end_date: end,
    };
    // getCategoriesContent(page, rowsPerPage, Incomplete, search, statusString, changeID, start, end);
    dispatch(getDetails(bookingID));
    props.history.push({
      pathname: "/adminPanel/BookingDetails",
      state: [bookingID, payload, "booking"],
      //state:[{BookingID:bookingID,PreviousPageState:payload,fromScreen:"bookingManagement"}]
    });
  };
  const sanitizeDecimal = (rating) => {
    let regexNumber = /^[0-9]+$/;

    if (regexNumber.test(rating)) {
      return rating;
    } else if (typeof rating === "number") {
      // return rating.slice(0, 3);

      return +rating.toFixed(2);
    }
  };
  const sanitizeDistance = (rating) => {
    let regexNumber = /^[0-9]+$/;

    if (regexNumber.test(rating)) {
      return rating;
    } else if (typeof rating === "number") {
      // return rating.slice(0, 3);

      return +rating.toFixed(4);
    }
  };

  const [parentTabValue, setParentTabValue] = React.useState(0);

  const handleParentTabChange = (event, newValue) => {
    // setParentTabValue(newValue);
    switch (event.target.innerText) {
      case "SINGLE TAXI":
        getCategoriesContent(page, limit, false, search, "pending", "62d53aa9bf652aa3778946ca", start, end, 1);

        setChangeID("62d53aa9bf652aa3778946ca");
        // setButtonColor(event.target.innerText);
        setParentTabValue(0);
        setTabValue(0);
        break;
      //   case "DESIGNATED DRIVER":
      //     getCategoriesContent(page, limit, false, search, "ongoing", "62d53abebf652aa3778946cd", start, end);
      //     setChangeID("62d53abebf652aa3778946cd");
      //     // setButtonColor(event.target.innerText);
      //     setParentTabValue(1);
      //     setTabValue(0);
      //     break;
      case "PET SERVICE":
        getCategoriesContent(page, limit, false, search, "pending", "62d53ad1bf652aa3778946d0", start, end, 1);
        setChangeID("62d53ad1bf652aa3778946d0");
        // setButtonColor(event.target.innerText);
        setParentTabValue(1);
        setTabValue(0);
        break;
      case "PACKAGE SERVICE":
        getCategoriesContent(page, limit, false, search, "pending", "62d53ae6bf652aa3778946d3", start, end, 1);
        setChangeID("62d53ae6bf652aa3778946d3");
        // setButtonColor(event.target.innerText);
        setParentTabValue(2);
        setTabValue(0);
        break;

      default:
        break;
    }
  };

  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    console.log(event.target.innerText);
    console.log(newValue);
    // if(state){

    setTabValue(newValue);

    setPage(0);
    setRowsPerPage(10);

    let status = event.target.innerText.toLowerCase();
    if (status === "cancelled") {
      getCategoriesContent(0, 10, false, search, "cancel", changeID, start, end);
      // setSubButtonColor(event.target.innerText);
    } else {
      getCategoriesContent(0, 10, false, search, status, changeID, start, end);
      // setSubButtonColor(event.target.innerText);
    }
  };
  async function CancelRide(id) {
    try {
      const { data } = await axios.post(`/private/rideEnd`, {
        bookingId: id,
      });
      toast.success("Ride Ended", { position: "top-right" });
      getCategoriesContent(page, limit, Incomplete, search, statusString, changeID, start, end);
    } catch (err) {
      console.log(err);
    }
  }
  const assignDriver = async (values) => {
    try {
      const { data } = await axios.post(`/private/add-driver-scheduleRide`, {
        bookingId: bookinggId,
        driverId: +values.Driver,
      });
      console.log(values);
      setModalState({
        ViewDrivers: false,
      });
      setBookingId("");
      setDriverData([]);
      getCategoriesContent(page, limit, false, search, "pending", changeID, start, end, 1);
      toast.success("Ride assigned", { position: "top-right" });
    } catch (err) {
      console.log(err);
    }
  };
  const findDriver = async (bookingId) => {
    setBookingId(bookingId);
    setFindingDriverData(true);
    setPuffLoader(true);
    try {
      const { data } = await axios.post(`/private/scheduleRide-driver-find`, {
        bookingId: bookingId,
      });
      console.log("driverData", data);
      setDriverData(data.user);
      setSearchedDriverData(data.user);
      setFindingDriverData(false);
      setPuffLoader(false);
      setModalState({ ViewDrivers: true });
    } catch (error) {
      console.log(error);
    }
  };

  const deassignDriver = async (id) => {
    try {
      const { data } = await axios.post(`/private/scheduleRideDeAssign`, {
        bookingId: +id,
      });
      getCategoriesContent(page, limit, false, search, "confirm", changeID, start, end, 1);
      toast.success("Ride Deassigned", { position: "top-right" });
    } catch (error) {
      console.log(error);
    }
  };
  const getFilteredData = async () => {
    let newData = new Date(startDate);
    let newData1 = new Date(endDate);
    let sDate = newData.getFullYear() + "/" + (newData.getMonth() + 1) + "/" + newData.getDate();
    let eDate = newData1.getFullYear() + "/" + (newData1.getMonth() + 1) + "/" + newData1.getDate();
    getCategoriesContent(1, 10, true, "", statusString, changeID, sDate, eDate);

    toast.success("Filter Applied", { position: "top-right" });
  };

  const checkTimeBeforeAssigning = async (category) => {
    if (moment().format("Do MMM YY ,hh:mm a") < moment(category.scheduleRideStartTime).format("Do MMM YY ,hh:mm a")) {
      console.log("time", moment(category.scheduleRideStartTime).format("Do MMM YY ,hh:mm a"));
      // 2023-03-23T14:35:00.000Z
      findDriver(category.bookingId);
    } else {
      toast.error("Ride Time Expired", { position: "top-right" });
    }
  };
  const viewDriver = (data) => {
    console.log(data)
    let apiHit = {
      page: page + 1,
      limit: rowsPerPage,
      Incomplete: Incomplete,
      search: search,
      status: statusString,
      serviceType: changeID,
      start_date: start,
      end_date: end,
      pathname: "/adminPanel/ScheduledRidesManagement",
    };
    props.history.push({
      pathname: "/adminPanel/driver-view",
      // state: [data._id, apiHit, data.serviceType],
      state: [data.driver_profiles_info._id, apiHit, changeID,statusString=="cancel"?"cancel":"complete"],
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
      pathname: "/adminPanel/ScheduledRidesManagement",
    };
    props.history.push({
      pathname: "/adminPanel/ViewUser",
      state: [data.user._id, apiHit, changeID,statusString=="cancel"?"cancel":"complete"],
    });
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <div className={classes.root}>
          <Paper elevation={0} style={{ backgroundColor: "transparent" }}>
            <div className={classes.paperPaddingRightLeft}>
              <div className="">
                <div className="my-3 " style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between" }}>
                <div className="">
                    <SearchBar
                      className={"heightfix  "}
                      style={{ borderRadius: "25px" }}
                      onChange={(searchVal) => SearchUser(searchVal)}
                      onCancelSearch={() => cancelSearch()}
                      placeholder="Search by User,Driver Name"
                    />
                  </div>
               
                  <div className="">
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem" }}>
                      {" "}
                  
                    
                      <div
                        style={{
                          display: "flex",
                          // flexDirection: "column",
                          gap: "5px",
                          alignItems: "center",
                        }}
                      >
                        <div className="calenderZindex" style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                          <h5>From:</h5>
                          <DatePicker
                            value={startDate}
                            dateFormat="DD/MM/YYYY"
                            maxDate={new Date()}
                            onChange={(date) => {
                              setStartDate(date);
                            }}
                          />
                          <h5>To:</h5>
                          <DatePicker
                            onChange={(date) => {
                              setEndDate(date);
                            }}
                            minDate={startDate}
                            maxDate={new Date()}
                            value={endDate}
                            dateFormat="DD/MM/YYYY"
                          />
                      
                        </div>
                     
                        <div style={{ display: "flex" }}>
                          <Button
                            variant="contained"
                            className="buttoncss "
                            style={{
                              backgroundColor: "#0059cd", //"#0059cd",
                              color: "#fff",
                              margin: "5px",
                            }}
                            onClick={() => {
                              if (startDate === null && endDate === null) {
                                toast.info("Please Select Both Dates To Get Filtered Data", {
                                  position: toast.POSITION.TOP_RIGHT,
                                });
                              } else if (startDate === null || endDate === null) {
                                toast.info("Please Select Both Dates To Get Filtered Data", {
                                  position: toast.POSITION.TOP_RIGHT,
                                });
                              } else if (startDate !== null && endDate !== null) {
                                // setShowFilter(false);
                                getFilteredData();
                              }
                            }}
                          >
                            Apply
                          </Button>
                          <Button
                            variant="contained"
                            className="buttoncss "
                            style={{
                              backgroundColor: "#0059cd", //"#0059cd",
                              color: "#fff",
                              margin: "5px",
                            }}
                            onClick={() => {
                              setPage(0);
                              setRowsPerPage(10);
                              getCategoriesContent(0, 10, Incomplete, search, statusString, changeID, "", "");
                              // setInitialDate(null);
                              // setTimeLineReset("");
                              toast.success("Filter Reset", {
                                position: "top-right",
                              });
                              setStartDate(null);
                              setEndDate(null);
                              // setStart("");
                              // setEnd("");
                              //   setColoredButton({
                              //     ...ColoredButton,
                              //     taxiSingle: true,
                              //     designatedDriver: false,
                              //     petService: false,
                              //     packageService: false,
                              //   });
                              //   setColoredSubButton({
                              //     ...ColoredSubButton,
                              //     Ongoing: true,
                              //     Completed: false,
                              //     Cancelled: false,
                              //   });
                            }}
                          >
                            Reset
                          </Button>
                        </div>
                      </div>
                      <Tooltip title={<span style={{ color: "white", fontSize: "16px" }}>Refresh Current List</span>} arrow>
                        <IconButton
                          className="buttoncss"
                          style={{ backgroundColor: "#0059cd", color: "#fff" }}
                          onClick={() => {
                            getCategoriesContent(0, 10, false, search, statusString, changeID, start, end, 1);
                          }}
                        >
                          <RefreshIcon />
                        </IconButton>
                      
                      </Tooltip>
                    </div>

                 
                  </div>
                 
               
                </div>

                <Paper elevation={0}>
                  {/* <div className="d-flex justify-content-center text-center align-items-baseline my-3">
                    {AllModules.map((e, i) => (
                      <Button
                        variant="contained"
                        className="buttoncss mx-3"
                        style={{
                          backgroundColor: Object.values(ColoredButton)[i] ? "#0059cd" : "#c4c4c4", //"#0059cd",
                          color: "#fff",
                          margin: "5px",
                        }}
                        onClick={() => {
                          switch (i) {
                            case 0:
                              getCategoriesContent(
                                page,
                                limit,
                                false,
                                search,
                                "ongoing",
                                "62d53aa9bf652aa3778946ca",
                                start,
                                end
                              );

                              setChangeID("62d53aa9bf652aa3778946ca");
                              setButtonColor(e);
                              break;
                            case 1:
                              getCategoriesContent(
                                page,
                                limit,
                                false,
                                search,
                                "ongoing",
                                "62d53abebf652aa3778946cd",
                                start,
                                end
                              );
                              setChangeID("62d53abebf652aa3778946cd");
                              setButtonColor(e);
                              break;
                            case 2:
                              getCategoriesContent(
                                page,
                                limit,
                                false,
                                search,
                                "ongoing",
                                "62d53ad1bf652aa3778946d0",
                                start,
                                end
                              );
                              setChangeID("62d53ad1bf652aa3778946d0");
                              setButtonColor(e);
                              break;
                            case 3:
                              getCategoriesContent(
                                page,
                                limit,
                                false,
                                search,
                                "ongoing",
                                "62d53ae6bf652aa3778946d3",
                                start,
                                end
                              );
                              setChangeID("62d53ae6bf652aa3778946d3");
                              setButtonColor(e);
                              break;

                            default:
                              break;
                          }
                        }}
                      >
                        {e}
                      </Button>
                    ))}
                  </div> */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      flexWrap: "wrap",
                    }}
                  >
                    {/* <div style={{ visibility: "hidden" }}>
                      555555555555555555555555
                    </div> */}
                    <div style={{ flex: 1 }}></div>
                    {/* <div className="d-flex justify-content-center text-center align-items-baseline my-3" style={{ flex: 2 }}>
                      {SubModules.map((e, i) => (
                        <Button
                          variant="contained"
                          className="buttoncss mx-3"
                          style={{
                            backgroundColor: Object.values(ColoredSubButton)[i] ? "#0059cd" : "#c4c4c4", //"#0059cd",
                            color: "#fff",
                            margin: "5px",
                          }}
                          onClick={() => {
                            setPage(0);
                            setRowsPerPage(10);
                            // setStartDate(null);
                            // setEndDate(null);
                            let status = e.toLowerCase();
                            if (status === "cancelled") {
                              getCategoriesContent(0, 10, false, search, "cancel", changeID, start, end);
                              setSubButtonColor(e);
                            } else {
                              getCategoriesContent(0, 10, false, search, status, changeID, start, end);
                              setSubButtonColor(e);
                            }

                            // setColoredButton(true);
                            // setIncomplete(false);
                          }}
                        >
                          {e}
                        </Button>
                      ))}
                    </div> */}
                    {/* <div style={{ flex: 1, textAlign: "end" }}>
                      <Button
                        variant="contained"
                        className="buttoncss mx-3"
                        style={{
                          backgroundColor: "#0059cd",
                          //"#0059cd",
                          // position: "absolute",
                          color: "#fff",
                          alignSelf: "end",
                          // marginTop: "-40px",
                          // right: 0,
                        }}
                        onClick={() => {
                          getCategoriesContent(0, 10, false, search, statusString, changeID, start, end);
                        }}
                      >
                        Refresh
                      </Button>
                    </div> */}
                  </div>
                  <Paper elevation={0}>
                    <Tabs
                      value={parentTabValue}
                      onChange={handleParentTabChange}
                      indicatorColor="primary"
                      textColor="primary"
                      centered
                    >
                      {AllModules.map((e, i) => (
                        <Tab label={e} key={i} />
                      ))}
                    </Tabs>
                    <Tabs value={tabValue} onChange={handleTabChange} indicatorColor="primary" textColor="primary" centered>
                      {SubModules.map((e, i) => (
                        <Tab label={e} key={i} />
                      ))}
                    </Tabs>
                  </Paper>
                </Paper>
                {/* //new design */}

                {/* <br /> */}

                {/* status end */}

                <Paper>
                  <TableContainer className={classes.container} style={{ minHeight: tableData.length > 0 ? "50vh" : "" }}>
                    <Table className={classes.table} stickyHeader size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Sr. No.</TableCell>
                          <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>
                            {" "}
                            {statusString == "completed" ? `Date & Time(Start - End)` : ` Date & Time`}
                          </TableCell>
                          <TableCell style={{ textAlign: "center", fontWeight: "bold" }}> Booking ID</TableCell>
                          <TableCell style={{ textAlign: "center", fontWeight: "bold" }}> User Name & ID</TableCell>
                          {/* <TableCell style={{ textAlign: "center", fontWeight: "bold" }}> Driver Name & ID</TableCell> */}
                          {/* <TableCell
                            style={{ textAlign: "center", fontWeight: "bold" }}
                          >
                            Profile Image
                          </TableCell> */}
                          <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Total Fare</TableCell>
                          <TableCell style={{ textAlign: "center", fontWeight: "bold" }}> Pickup Location</TableCell>

                          <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Drop off Location</TableCell>
                          <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Action</TableCell>
                          {/* {statusString == "ongoing" && changeID !== "62d53abebf652aa3778946cd" ? (
                            <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Action</TableCell>
                          ) : (
                            false
                          )}
                          {statusString == "completed" ? (
                            <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Action</TableCell>
                          ) : (
                            false
                          )} */}
                          {/* <TableCell
                            style={{ textAlign: "center", fontWeight: "bold" }}
                          >
                            Actions
                          </TableCell> */}
                          {/* <TableCell>User Type</TableCell>
                              <TableCell>Status</TableCell> */}
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {/* {isLoading?<TableRow ><Skeleton style={{width:"70vw",borderRadius:"20px"}} highlightColor="#fff" height="1rem" count={2} baseColor="#ebebeb"/></TableRow>:false} */}
                        {tableData
                          // .reverse()
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
                                {category.status === "complete"
                                  ? category?.bookingAcceptTime
                                    ? `${moment(category.bookingAcceptTime).format("Do MMM YY ,hh:mm a")}-${moment(
                                        category.dropTime
                                      ).format("Do MMM YY ,hh:mm a")}`
                                    : "No schedule time yet"
                                  : category?.scheduleTime // for pending
                                  ? `${moment(category.scheduleTime).format("Do MMM YY ,hh:mm a")}`
                                  : "No schedule time yet"}
                              </TableCell>
                              <TableCell className={classes.textMiddle} style={{ textAlign: "center" }}>
                                {get(category, "bookingId", "N/A")}
                              </TableCell>
                              <TableCell className={classes.textMiddle} style={{ textAlign: "center" }}>
                                <span style={{cursor:"pointer"}} className="hyperLinkHoverColor" onClick={()=>viewUser(category)}>{get(category, "user.firstName", "N/A") + " " + get(category, "user.lastName", "N/A")}</span>
                                <br />
                                {get(category, "user.user_id", "N/A")}
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
                              {/* <TableCell className={classes.textMiddle} style={{ textAlign: "center" }}>
                                {get(category, "driver.firstName", "N/A") + " " + get(category, "driver.lastName", "N/A")}
                                <br />

                                {get(category, "driver.user_id", "N/A")}
                              </TableCell> */}
                              <TableCell className={classes.textMiddle} style={{ textAlign: "center", whiteSpace: "nowrap" }}>
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
                                {sanitizeDecimal(get(category, "price", "N/A"))}
                                {statusString == "completed" ? (
                                  <Button
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                      setSelectedViewDetail(category);
                                      setModalState({ isViewDetails: true });
                                    }}
                                  >
                                    <VisibilityIcon />
                                  </Button>
                                ) : (
                                  false
                                )}
                              </TableCell>
                              <TableCell
                                onClick={() => setLocationText(locationText === category._id ? null : category._id)}
                                style={{
                                   textAlign: "center",
                                  whiteSpace: locationText === category._id ? "" : "nowrap",
                                  maxWidth: "150px",
                                  overflow: locationText === category._id ? "" : "hidden",
                                  textOverflow: locationText === category._id ? "" : "ellipsis",
                                  cursor: "pointer",
                                }}
                              >
                                {/* {category.country_code + category.phone_number}
                                 */}
                                {/* <div
                                  style={{ width: "9rem", height: "0.5rem" }}
                                > */}
                                {get(category, "pickUpPlace", "N/A")}
                                {/* </div> */}
                              </TableCell>

                              <TableCell style={{ textAlign: "center" }}>
                                {/* {get(category, "dropPlace", "N/A")} */}

                                <RSelect
                                  defaultValue={
                                    // console.log(
                                    //   "--------------------------------",
                                    //   __options(category)[0]
                                    // ),
                                    __options(category)[0]
                                  }
                                  key={rselKey}
                                  options={__options(category)}
                                  isSearchable={false}
                                />
                              </TableCell>

                              {/* <TableCell style={{textAlign:"center"}}>{category.doc?<img src={category.doc} alt="doc" style={{width:"50px",height:"50px"}}/>:"No Doc"}</TableCell> */}

                              <TableCell className={classes.textMiddle} style={{ textAlign: "center" }}>
                                {statusString == "pending" ? (
                                  <Button
                                    onClick={() => {
                                      checkTimeBeforeAssigning(category);
                                      // findDriver(category.bookingId);

                                      // setModalState({ ViewDrivers: true });

                                      // CancelRide(category.bookingId);
                                    }}
                                    // size="small"
                                    variant="contained"
                                    className="buttoncss "
                                    style={{
                                      backgroundColor: "#0059cd", //"#0059cd",
                                      color: "#fff",
                                      margin: "5px",
                                    }}
                                    // disabled={
                                    //   moment(category.scheduleRideStartTime).format("Do MMM YY ,hh:mm a") <
                                    //   moment(category.scheduleRideStartTime).format("Do MMM YY ,hh:mm a")
                                    //  ?true:false
                                    // }
                                  >
                                    <Tooltip title={<span className="TooltipCustomSize">Assign</span>} arrow>
                                      <span> Assign</span>
                                    </Tooltip>
                                  </Button>
                                ) : (
                                  <Button
                                    variant="contained"
                                    className="buttoncss "
                                    style={{
                                      backgroundColor: "#0059cd", //"#0059cd",
                                      color: "#fff",
                                      margin: "5px",
                                    }}
                                    onClick={() => {
                                      deassignDriver(category.bookingId);
                                    }}
                                  >
                                    Deassign
                                  </Button>
                                )}
                                {/* <Button
                                  onClick={() => {
                                    // CancelRide(category.bookingId);
                                  }}
                                  // size="small"
                                  className=""
                                  style={
                                    {
                                      // border: "1.5px solid #c4c4c4",
                                      // margin: "0.3rem",
                                      // color: "#2765B3",
                                    }
                                  }
                                >
                                  <Tooltip title={<span className="TooltipCustomSize">Deassign</span>} arrow>
                                    <span>Deassign</span>
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
                    rowsPerPageOptions={totalUserListCount >= 50 ? [10, 25, 100] : totalUserListCount > 10 ? [10, 25] : [10]}
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
      {/* Details */}
      <Modal
        maxWidth="lg"
        width="540px"
        isOpen={modalState.ViewDrivers}
        // onClose={() => {
        //   setModalState({
        //     ViewDrivers: false,
        //   });
        // }}
        onClose={(event, reason) => {
          if (reason && (reason === "backdropClick" || "escapeKeyDown")) {
            console.log(reason);
            setModalState({
              ViewDrivers: true,
            });
          } else {
            setModalState({
              ViewDrivers: false,
            });
            setBookingId("");
            setDriverData([]);
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
              {/* Bill Details */}
            </div>
            <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "16px", fontFamily: "'DM Sans', sans-serif" }}>
              {" "}
              {/* Total Fare&nbsp;<span style={{ color: "#85BB65", fontWeight: "bold" }}>(in USD)</span>&nbsp;:&emsp;
              {selectedViewDetail.price} */}
            </div>
            <div className="closeicon">
              <AiOutlineClose
                style={{
                  fontSize: "1.5rem",
                  position: "absolute",
                  top: 16,
                  right: 18,
                  color: "#fff",
                  borderRadius: "50%",
                  backgroundColor: "red",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setModalState({
                    ViewDrivers: false,
                  });
                }}
              />
            </div>
          </div>
        }
        content={
          <>
            <Formik
              initialValues={{
                Driver: "",
              }}
              // validate={(values) => handleValidateTip(values)}
              onSubmit={(values) => {
                console.log(values);
                assignDriver(values);
              }}
            >
              {(formikBag) => (
                <Form style={{ width: "100%" }}>
                 {DriverData.length > 0?<> <div className="container">
                  
                    <div className="row my-3">
                      <div className="col-md-12">
                        <h3>Select Driver</h3>
                        <div className="">
                          <SearchBar
                            className={"heightfix  "}
                            style={{ borderRadius: "25px" }}
                            onChange={(searchVal) => SearchDriverData(searchVal)}
                            onCancelSearch={() => cancelSearchDriverData()}
                            placeholder="Search by Driver Name"
                          />
                        </div>
                      </div>
                      {/* <div className="col-md-6">View Driver Details</div> */}
                    </div>
                    <div
                      style={{ height: "300px", overflowY: "scroll", overflowX: "hidden" }}
                      // style={{ height: "200px", overflowY: "scroll", overflowX: "hidden" }}
                    >
                      {findindDriverData ? (
                        <h3>Finding Driver's</h3>
                      ) : DriverData.length > 0 ? (
                        DriverData.map((ele, i) => (
                          <div className="row m-3" key={i}>
                            <div className="col-md-12">
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  padding: "0.5rem",
                                  borderRadius: "5px",
                                  boxShadow: " rgba(0, 0, 0, 0.16) 0px 1px 4px",
                                }}
                              >
                                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                  <Field name="Driver">
                                    {({ field }) => (
                                      <Input
                                        {...field}
                                        type="radio"
                                        value={ele.user_id}
                                        // error={formikBag.touched.tip && formikBag.errors.tip ? formikBag.errors.tip : null}
                                        // className="form-control"
                                      />
                                    )}
                                  </Field>{" "}
                                  <span style={{cursor:"pointer"}} className="hyperLinkHoverColor" onClick={()=>viewDriver(ele)}>{ele?.driverFirstName + " " + ele?.driverLastName} </span>
                                </div>
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                  {" "}
                                  <div>
                                    {" "}
                                    {`${ele.countryCode}${ele.phone}  
                                `}
                                  </div>
                                  <div style={{ color: "#c4c4c4" }}>{`${sanitizeDistance(ele.distance)} miles`} </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <h3 style={{textAlign:"center"}}>No Driver Found.</h3>
                      )}
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
                      Assign
                    </button>
                  </div> </>: <h3>No Driver Found.</h3>}
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
