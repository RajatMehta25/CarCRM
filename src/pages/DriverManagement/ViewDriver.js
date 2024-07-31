import React, { useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import axios from "../../axios";
import { toast } from "react-toastify";
import moment from "moment";
// import Switch from '@mui/material/Switch';
// import { styled } from '@mui/material/styles';
// import Skeleton from 'react-loading-skeleton'
// import 'react-loading-skeleton/dist/skeleton.css'
import { Close, DeleteOutlineOutlined, Search } from "@material-ui/icons";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ReactPaginate from "react-paginate";
import { getDateFormat } from "../../helpers/helperFunction";
// import moment from "moment";
import KErrorMessage from "./KErrorMessage";
import DRIVER from "axios";
import PersonIcon from "@material-ui/icons/Person";
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
import { get, identity, set, sortBy, stubTrue } from "lodash";

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
import tick from "../../../src/assets/images/tick.svg";
import "./ApprovedDriver.css";
import RSelect from "react-select";
import GetAppIcon from "@material-ui/icons/GetApp";
import StarRatings from "react-star-ratings";
import * as Yup from "yup";
import ModalImage from "react-modal-image";
import { CSVLink, CSVDownload } from "react-csv";
import noData from "../../../src/assets/images/noData.jpg";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import "./ViewDriver.css";
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
    // justifyContent: "space-between",
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
  },
  paperPaddingRightLeft: {
    padding: "0rem 1rem",
  },
  customResponsive: {
    ["@media (max-width:600px)"]: {
      flexDirection: "column",
      // display: "flex",
      // flexWrap: "wrap",
    },
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

export default function ViewDriver(props) {
  const classes = useStyles();

  // const history=useHistory();
  const {
    location: { state },
    history,
  } = props;
  console.log(state);
  const ServiceTypesCheck = [
    "62d53aa9bf652aa3778946ca",
    "62d53abebf652aa3778946cd",
    "62d53ad1bf652aa3778946d0",
    "62d53ae6bf652aa3778946d3",
  ];
  const [ImagesDisplay, setImageDisplay] = useState({
    licensefront: false,
    licenseback: false,
    insurancefront: false,
    insuranceback: false,
    driverprofile: false,
  });
  const [tableData, setTableData] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [PaginationData, setPaginationData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [licenseCheck, setLicenseCheck] = useState(true); // change here to false
  const [vehicleCheck, setVehicleCheck] = useState(true); //change here to false
  const [driverDetails, setDriverDetails] = useState([]);
  const [bookingStatus, setBookingStatus] = useState(!state ? "complete" : state[3] ? state[3] : "complete");
  const [serviceTypeData, setServiceTypeData] = useState([]);
  const [disapproveSaveButton, setDisapproveSaveButton] = useState(false);
  const [serviceType, setServiceType] = useState(
    !state ? "all" : state[2] ? (ServiceTypesCheck.some((ele) => ele === state[2]) ? state[2] : "all") : "all"
  );
  const [userDetails, setUserDetails] = useState([]);
  const [arrayToMAP, setArraytomap] = useState([{}, {}, {}, {}, {}]);
  const [disapproveDetails, setDisapproveDetails] = useState({
    driverDOBCheck: false,
    driverFirstNameCheck: false,
    driverLastNameCheck: false,
    driverGenderCheck: false,
    driverLanguageCheck: false,
    driverProfileCheck: false,
    VehicleNameCheck: false,
    VehicleMakeCheck: false,
    VehicleTypeCheck: false,
    vehicleVINCheck: false,
    ModelCheck: false,
    YearCheck: false,
    ColorCheck: false,
    LicensePlateCheck: false,
    seatAvailabilityCheck: false,
    DrivingLicenseFrontCheck: false,
    DrivingLicenseBackCheck: false,
    CarInsuranceFrontCheck: false,
    CarInsuranceBackCheck: false,
    AccountHolderNameCheck: false,
    CardNumberCheck: false,
    ExpiryDateCheck: false,
    CVVCheck: false,
    LicenseExpiryDateCheck: false,
    driverStreetCheck: false,

    driverDOB: "",
    driverFirstName: "",
    driverLastName: "",
    driverGender: "",
    driverLanguage: "",
    driverProfile: "",
    driverStreet: "",
    VehicleName: "",
    VehicleMake: "",
    vehicleVIN: "",
    VehicleType: "",
    Model: "",
    Year: "",
    Color: "",
    LicensePlate: "",
    seatAvailability: "",
    DrivingLicenseFront: "",
    DrivingLicenseBack: "",
    CarInsuranceFront: "",
    CarInsuranceBack: "",
    AccountHolderName: "",
    CardNumber: "",
    ExpiryDate: "",
    CVV: "",
    LicenseExpiryDate: "",
    InsuranceExpiryDate: "",

    driverDOBValue: "",
    driverFirstNameValue: "",
    driverLastNameValue: "",
    driverGenderValue: "",
    driverLanguageValue: "",
    driverProfileValue: "",
    driverStreetValue: "",
    driverCityValue: "",
    driverStateValue: "",
    driverZipCodeValue: "",
    VehicleNameValue: "",
    VehicleMakeValue: "",
    VehicleTypeValue: "",
    vehicleVINValue: "",
    ModelValue: "",
    YearValue: "",
    ColorValue: "",
    LicensePlateValue: "",
    seatAvailabilityValue: "",
    DrivingLicenseFrontValue: "",
    DrivingLicenseBackValue: "",
    CarInsuranceFrontValue: "",
    CarInsuranceBackValue: "",
    AccountHolderNameValue: "",
    CardNumberValue: "",
    ExpiryDateValue: "",
    CVVValue: "",
    LicenseExpiryDateValue: "",

    driverDOBUpdate: "",
    driverFirstNameUpdate: "",
    driverLastNameUpdate: "",
    driverGenderUpdate: "",
    driverLanguageUpdate: "",
    driverProfileUpdate: "",
    driverStreetUpdate: "",
    VehicleNameUpdate: "",
    VehicleMakeUpdate: "",
    vehicleVINUpdate: "",
    VehicleTypeUpdate: "",
    MakeUpdate: "",
    ModelUpdate: "",
    YearUpdate: "",
    ColorUpdate: "",
    LicensePlateUpdate: "",
    seatAvailabilityUpdate: "",
    DrivingLicenseFrontUpdate: "",
    DrivingLicenseBackUpdate: "",
    CarInsuranceFrontUpdate: "",
    CarInsuranceBackUpdate: "",
    AccountHolderNameUpdate: "",
    CardNumberUpdate: "",
    ExpiryDateUpdate: "",
    CVVUpdate: "",
    LicenseExpiryDateUpdate: "",
  });
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
    getCategoriesContent(page, event.target.value, Incomplete, search);
    console.log("checkrows");
    setRowsPerPage(parseInt(event.target.value, 10));
    console.log({ event });
    setPage(0);
  };

  // useEffect(() => {
  //   getCategoriesContent();
  // }, []);

  //get content
  const downloadExcel = useRef(null);
  const [pagenumber, setPageNumber] = useState(1);
  const [totalUserListCount, settotalUserListCount] = useState(0);
  const [limit, setLimit] = useState(10);
  const [Incomplete, setIncomplete] = useState(true);
  const [search, setSearch] = useState("");
  const [DisplayNoDataImage, setDisplayNoDataImage] = useState(false);
  const [driverID, setDriverID] = useState("");
  const PENDING = driverDetails[0]?.status == "pending" ? true : false;
  const getCategoriesContent = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(
        `/private/allRide?userType=driver&page=${
          page === 0 ? 1 : page
        }&limit=${limit}&userId=${driverID}&serviceType=${serviceType}&bookingStatus=${bookingStatus}`
      );
      console.log(data);
      setDisplayNoDataImage(false);
      setTableData([...data.data.docs]);

      setSearchedData(data.data.docs);
      settotalUserListCount(data.data.totalDocs);
      setIncomplete(Incomplete);
      setSearch(search);
      setPaginationData(data.data);
      // setIsLoading(false);
      setIsLoading(false);
      if (data.data.docs.length === 0 || data.status === 500) {
        setDisplayNoDataImage(true);
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
  useEffect(() => {
    getDriverDetails();
  }, [state]);
  useEffect(() => {
    getServiceTypes();
  }, []);

  useEffect(() => {
    // getDriverDetails();
    driverID && bookingStatus && serviceType && getCategoriesContent();

    // console.log("check0");
  }, [driverID, bookingStatus, serviceType]);
  //function to check driving license date
  function DrivingLicenseDateCheck() {
    let date = moment(driverDetails[0]?.licenceExpireDate?.value).format("LL");

    let now = moment().format("LL");
    console.log(date);
    console.log(now);
    if (date < now) {
      return true;
    } else {
      return false;
    }
  }
  console.log(DrivingLicenseDateCheck());
  const getDriverDisapproveDetails = async (id) => {
    try {
      const { data } = await axios.get(`/private/driverFormDetails/${id}`);
      setDisapproveDetails({
        driverDOBCheck: data?.data[0]?.driver_profiles[0]?.driverDOB?.error,
        driverFirstNameCheck: data?.data[0]?.driver_profiles[0]?.driverFirstName?.error,
        driverLastNameCheck: data?.data[0]?.driver_profiles[0]?.driverLastName?.error,
        driverGenderCheck: data?.data[0]?.driver_profiles[0]?.driverGender?.error,
        driverProfileCheck: data?.data[0]?.driver_profiles[0]?.driverProfile?.error,
        driverStreetCheck: data?.data[0]?.driver_profiles[0]?.streetName?.error,
        // driverLanguageCheck: data?.data[0]?.driver_profiles[0]?.driverDOB?.error,
        VehicleNameCheck: data?.data[0]?.vehicle_details[0]?.vehicleName?.error,
        VehicleMakeCheck: data?.data[0]?.vehicle_details[0]?.modelId?.error,
        VehicleTypeCheck: data?.data[0]?.driver_profiles[0]?.driverVehicleType?.error,
        vehicleVINCheck: data?.data[0]?.vehicle_details[0]?.vehicleVIN?.error,
        ModelCheck: data?.data[0]?.vehicle_details[0]?.model?.error,
        YearCheck: data?.data[0]?.vehicle_details[0]?.year?.error,
        ColorCheck: data?.data[0]?.vehicle_details[0]?.color?.error,
        LicensePlateCheck: data?.data[0]?.vehicle_details[0]?.licenseNumber?.error,
        seatAvailabilityCheck: data?.data[0]?.vehicle_details[0]?.seatAvailability?.error,
        DrivingLicenseFrontCheck: data?.data[0]?.driver_profiles[0]?.drivingLicense?.fornt?.error,
        DrivingLicenseBackCheck: data?.data[0]?.driver_profiles[0]?.drivingLicense?.back?.error,
        CarInsuranceFrontCheck: data?.data[0]?.vehicle_details[0]?.InsuranceImage?.fornt?.error,
        CarInsuranceBackCheck: data?.data[0]?.vehicle_details[0]?.InsuranceImage?.back?.error,
        AccountHolderNameCheck: false,
        CardNumberCheck: false,
        ExpiryDateCheck: false,
        CVVCheck: false,
        LicenseExpiryDateCheck: DrivingLicenseDateCheck() ? true : data?.data[0]?.driver_profiles[0]?.licenceExpireDate?.error,
        InsuranceExpiryDateCheck: data?.data[0]?.vehicle_details[0]?.insuranceExpireDate?.error,

        driverDOB: data?.data[0]?.driver_profiles[0]?.driverDOB?.errorMessage,
        driverFirstName: data?.data[0]?.driver_profiles[0]?.driverFirstName?.errorMessage,
        driverLastName: data?.data[0]?.driver_profiles[0]?.driverLastName?.errorMessage,
        driverGender: data?.data[0]?.driver_profiles[0]?.driverGender?.errorMessage,
        driverProfile: data?.data[0]?.driver_profiles[0]?.driverProfile?.errorMessage,
        driverStreet: data?.data[0]?.driver_profiles[0]?.streetName?.errorMessage,
        VehicleName: data?.data[0]?.vehicle_details[0]?.vehicleName?.errorMessage,
        VehicleMake: data?.data[0]?.vehicle_details[0]?.modelId?.errorMessage,
        VehicleType: data?.data[0]?.driver_profiles[0]?.driverVehicleType?.errorMessage,
        vehicleVIN: data?.data[0]?.vehicle_details[0]?.vehicleVIN?.errorMessage,
        Model: data?.data[0]?.vehicle_details[0]?.model?.errorMessage,
        Year: data?.data[0]?.vehicle_details[0]?.year?.errorMessage,
        Color: data?.data[0]?.vehicle_details[0]?.color?.errorMessage,
        LicensePlate: data?.data[0]?.vehicle_details[0]?.licenseNumber?.errorMessage,
        seatAvailability: data?.data[0]?.vehicle_details[0]?.seatAvailability?.errorMessage,
        DrivingLicenseFront: data?.data[0]?.driver_profiles[0]?.drivingLicense?.fornt?.errorMessage,
        DrivingLicenseBack: data?.data[0]?.driver_profiles[0]?.drivingLicense?.back?.errorMessage,
        CarInsuranceFront: data?.data[0]?.vehicle_details[0]?.InsuranceImage?.fornt?.errorMessage,
        CarInsuranceBack: data?.data[0]?.vehicle_details[0]?.InsuranceImage?.back?.errorMessage,
        AccountHolderName: "",
        CardNumber: "",
        ExpiryDate: "",
        CVV: "",
        LicenseExpiryDate: DrivingLicenseDateCheck()
          ? "License Date Expired"
          : data?.data[0]?.driver_profiles[0]?.licenceExpireDate?.errorMessage,
        InsuranceExpiryDate: data?.data[0]?.vehicle_details[0]?.insuranceExpireDate?.errorMessage,

        driverDOBValue: data?.data[0]?.driver_profiles[0]?.driverDOB?.value,
        driverFirstNameValue: data?.data[0]?.driver_profiles[0]?.driverFirstName?.value,
        driverLastNameValue: data?.data[0]?.driver_profiles[0]?.driverLastName?.value,
        driverGenderValue: data?.data[0]?.driver_profiles[0]?.driverGender?.value,
        driverProfileValue: data?.data[0]?.driver_profiles[0]?.driverProfile?.value,
        driverStreetValue: data?.data[0]?.driver_profiles[0]?.streetName?.value,
        driverCityValue: data?.data[0]?.driver_profiles[0]?.city?.value,
        driverStateValue: data?.data[0]?.driver_profiles[0]?.state?.value,
        driverZipCodeValue: data?.data[0]?.driver_profiles[0]?.zipCode?.value,
        VehicleNameValue: data?.data[0]?.vehicle_details[0]?.vehicleName?.value,
        VehicleMakeValue: data?.data[0]?.vehicle_details[0]?.modelId?.make,
        VehicleTypeValue: data?.data[0]?.driver_profiles[0]?.driverVehicleType?.value?.title,
        vehicleVINValue: data?.data[0]?.vehicle_details[0]?.vehicleVIN?.value,
        ModelValue: data?.data[0]?.vehicle_details[0]?.model?.value,
        YearValue: data?.data[0]?.vehicle_details[0]?.year?.value,
        ColorValue: data?.data[0]?.vehicle_details[0]?.color?.value,
        LicensePlateValue: data?.data[0]?.vehicle_details[0]?.licenseNumber?.value,
        seatAvailabilityValue: data?.data[0]?.vehicle_details[0]?.seatAvailability?.value,
        DrivingLicenseFrontValue: data?.data[0]?.driver_profiles[0]?.drivingLicense?.fornt?.value,
        DrivingLicenseBackValue: data?.data[0]?.driver_profiles[0]?.drivingLicense?.back?.value,
        CarInsuranceFrontValue: data?.data[0]?.vehicle_details[0]?.InsuranceImage?.fornt?.value,
        CarInsuranceBackValue: data?.data[0]?.vehicle_details[0]?.InsuranceImage?.back?.value,
        AccountHolderNameValue: "",
        CardNumberValue: "",
        ExpiryDateValue: "",
        CVVValue: "",
        LicenseExpiryDateValue: data?.data[0]?.driver_profiles[0]?.licenceExpireDate?.value,
        InsuranceExpiryDateValue: data?.data[0]?.vehicle_details[0]?.insuranceExpireDate?.value,

        driverDOBUpdate: data?.data[0]?.driver_profiles[0]?.driverDOB?.color,
        driverFirstNameUpdate: data?.data[0]?.driver_profiles[0]?.driverFirstName?.color,
        driverLastNameUpdate: data?.data[0]?.driver_profiles[0]?.driverLastName?.color,
        driverGenderUpdate: data?.data[0]?.driver_profiles[0]?.driverGender?.color,
        driverProfileUpdate: data?.data[0]?.driver_profiles[0]?.driverProfile?.color,
        driverStreetUpdate: data?.data[0]?.driver_profiles[0]?.streetName?.color,
        VehicleNameUpdate: data?.data[0]?.vehicle_details[0]?.vehicleName?.color,
        vehicleVINUpdate: data?.data[0]?.vehicle_details[0]?.vehicleVIN?.color,
        VehicleTypeUpdate: data?.data[0]?.driver_profiles[0]?.driverVehicleType?.color,
        MakeUpdate: data?.data[0]?.vehicle_details[0]?.modelId?.color,
        ModelUpdate: data?.data[0]?.vehicle_details[0]?.model?.color,
        YearUpdate: data?.data[0]?.vehicle_details[0]?.year?.color,
        ColorUpdate: data?.data[0]?.vehicle_details[0]?.color?.color,
        LicensePlateUpdate: data?.data[0]?.vehicle_details[0]?.licenseNumber?.color,
        seatAvailabilityUpdate: data?.data[0]?.vehicle_details[0]?.seatAvailability?.color,
        DrivingLicenseFrontUpdate: data?.data[0]?.driver_profiles[0]?.drivingLicense?.fornt?.color,
        DrivingLicenseBackUpdate: data?.data[0]?.driver_profiles[0]?.drivingLicense?.back?.color,
        CarInsuranceFrontUpdate: data?.data[0]?.vehicle_details[0]?.InsuranceImage?.fornt?.color,
        CarInsuranceBackUpdate: data?.data[0]?.vehicle_details[0]?.InsuranceImage?.back?.color,
        AccountHolderNameUpdate: "",
        CardNumberUpdate: "",
        ExpiryDateUpdate: "",
        CVVUpdate: "",
        LicenseExpiryDateUpdate: data?.data[0]?.driver_profiles[0]?.licenceExpireDate?.color,
        InsuranceExpiryDateUpdate: data?.data[0]?.vehicle_details[0]?.insuranceExpireDate?.color,

        VehicleNameID: data?.data[0]?.vehicle_details[0]?.vehicleName?.valueID,

        ModelID: data?.data[0]?.vehicle_details[0]?.model?.valueID,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const getDriverDetails = async () => {
    try {
      const { data } = await axios.get(`/private/driverDetails/${state[0]}`);
      console.log(data);
      setDriverDetails(data.data);
      setDriverID(data?.data[0]?.driver?._id);
      getDriverDisapproveDetails(data?.data[0]?.driver?._id);
      console.log(data?.data[0]?.driver?._id);
    } catch (error) {
      console.log(error);
    }
  };
  const getServiceTypes = async () => {
    try {
      const { data } = await DRIVER.get(`${ServiceType_Url}?userType=driver`);
      console.log(data.data);
      let newArray = data.data.map((ele) => ({ label: ele.title, value: ele._id }));
      newArray.unshift({ label: "All", value: "all" });

      setServiceTypeData(newArray);
    } catch (error) {
      console.log(error);
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

  const SearchUser = myDeb((search) => {
    getCategoriesContent(page, rowsPerPage, Incomplete, search);
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

  const ViewBookingDetails = (id) => {
    props.history.push({
      pathname: "/adminPanel/BookingDetails",
      state: [id, state[1], "driver", state[0], serviceType, bookingStatus],
    });
  };
  useEffect(() => {
    // CheckIncompleteDetails();
  }, []);
  const CheckIncompleteDetails = () => {
    if (driverDetails[0]?.serviceType == "62d53abebf652aa3778946cd") {
      setLicenseCheck(true);
      setVehicleCheck(true);
    } else {
      driverDetails[0]?.driver?.drivingLicense?.back?.value && driverDetails[0]?.driver?.drivingLicense?.fornt?.value
        ? setLicenseCheck(true)
        : setLicenseCheck(false);
      driverDetails[0]?.vehicle[0]?.vehicleName?.value &&
      driverDetails[0]?.vehicle[0]?.vehicleVIN?.value &&
      driverDetails[0]?.vehicle[0]?.model?.value &&
      driverDetails[0]?.vehicle[0]?.year?.value &&
      driverDetails[0]?.vehicle[0]?.color?.value &&
      driverDetails[0]?.vehicle[0]?.licenseNumber?.value &&
      driverDetails[0]?.vehicle[0]?.seatAvailability?.value
        ? setVehicleCheck(true)
        : setVehicleCheck(false);
    }
  };
  const approveDriver = async () => {
    console.log(state);
    if (licenseCheck && vehicleCheck) {
      try {
        const { data } = await axios.put(`/private/driverProfileApproved/${state[0]}`, {
          status: "approved",
        });

        toast.success(data.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
        props.history.push({
          pathname: state[1].pathname,
          state: state[1],
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      toast.error("Cannot Approve, Incomplete Details ", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const valuesSubmit = async (values) => {
    let ArrayfromValues = [
      values.driverDOB ?? "",
      values.driverFirstName ?? "",
      values.driverLastName ?? "",
      values.driverGender ?? "",
      values.driverProfile ?? "",
      values.driverStreet ?? "",
      values.VehicleType ?? "",
      // values.VehicleMake ?? "",
      values.VehicleName ?? "",
      values.vehicleVIN ?? "",
      values.Model ?? "",
      values.Year ?? "",
      values.Color ?? "",
      values.LicensePlate ?? "",
      values.seatAvailability ?? "",
      values.CarInsuranceFront ?? "",
      values.CarInsuranceBack ?? "",
      values.InsuranceExpiryDate ?? "",
      values.DrivingLicenseFront ?? "",
      values.DrivingLicenseBack ?? "",
      values.LicenseExpiryDate ?? "",
    ];
    let isBlank = ArrayfromValues.every(checkBlank);
    console.log("Arryafromvalues", ArrayfromValues);
    console.log(isBlank);
    function checkBlank(blank) {
      return blank == " " || blank == "";
    }
    if (!isBlank) {
      if (licenseCheck && vehicleCheck) {
        try {
          setDisapproveSaveButton(true);
          const { data } = await axios.put(`/private/driverDisapproved/${state[0]}`, {
            driverDOB: {
              error: values.driverDOBCheck,
              errorMessage: values.driverDOB,
              value: values.driverDOBValue,
              color: "1",
            },
            driverFirstName: {
              error: values.driverFirstNameCheck,
              errorMessage: values.driverFirstName,
              value: values.driverFirstNameValue,
              color: "1",
            },
            driverLastName: {
              error: values.driverLastNameCheck,
              errorMessage: values.driverLastName,
              value: values.driverLastNameValue,
              color: "1",
            },
            driverGender: {
              error: values.driverGenderCheck,
              errorMessage: values.driverGender,
              value: values.driverGenderValue,
              color: "1",
            },
            driverProfile: {
              error: values.driverProfileCheck,
              errorMessage: values.driverProfile,
              value: values.driverProfileValue,
              color: "1",
            },

            vehicleName: {
              error: values.VehicleNameCheck,
              errorMessage: values.VehicleName,
              value: values.VehicleNameID,
              color: "1",
            },
            driverVehicleType: {
              error: values.VehicleTypeCheck,
              errorMessage: values.VehicleType,
              value: values.VehicleTypeValue,
              color: "1",
            },
            // modelId: {
            //   error: values.VehicleMakeCheck,
            //   errorMessage: values.VehicleMake,
            // },
            vehicleVIN: {
              error: values.vehicleVINCheck,
              errorMessage: values.vehicleVIN,
              value: values.vehicleVINValue,
              color: "1",
            },
            model: {
              error: values.ModelCheck,
              errorMessage: values.Model,
              value: values.ModelID,
              color: "1",
            },
            year: {
              error: values.YearCheck,
              errorMessage: values.Year,
              value: values.YearValue,
              color: "1",
            },
            color: {
              error: values.ColorCheck,
              errorMessage: values.Color,
              value: values.ColorValue,
              color: "1",
            },
            licenseNumber: {
              error: values.LicensePlateCheck,
              errorMessage: values.LicensePlate,
              value: values.LicensePlateValue,
              color: "1",
            },
            seatAvailability: {
              error: values.seatAvailabilityCheck,
              errorMessage: values.seatAvailability,
              value: values.seatAvailabilityValue,
              color: "1",
            },
            InsuranceImage: {
              fornt: {
                error: values.CarInsuranceFrontCheck,
                errorMessage: values.CarInsuranceFront,
                value: values.CarInsuranceFrontValue,
                color: "1",
              },
              back: {
                error: values.CarInsuranceBackCheck,
                errorMessage: values.CarInsuranceBack,
                value: values.CarInsuranceBackValue,
                color: "1",
              },
            },
            drivingLicense: {
              fornt: {
                error: values.DrivingLicenseFrontCheck,
                errorMessage: values.DrivingLicenseFront,
                value: values.DrivingLicenseFrontValue,
                color: "1",
              },
              back: {
                error: values.DrivingLicenseBackCheck,
                errorMessage: values.DrivingLicenseBack,
                value: values.DrivingLicenseBackValue,
                color: "1",
              },
            },
            insuranceExpireDate: {
              error: values.InsuranceExpiryDateCheck,
              errorMessage: values.InsuranceExpiryDate,
              value: values.InsuranceExpiryDateValue,
              color: "1",
            },
            licenceExpireDate: {
              error: values.LicenseExpiryDateCheck,
              errorMessage: values.LicenseExpiryDate,
              value: values.LicenseExpiryDateValue,
              color: "1",
            },
            streetName: {
              error: values.driverStreetCheck,
              errorMessage: values.driverStreet,
              value: values.driverStreetValue,
              color: "1",
            },
          });
          setDisapproveSaveButton(false);
          toast.success("Disapproved", {
            position: toast.POSITION.TOP_RIGHT,
          });
          props.history.push({
            pathname: state[1].pathname,
            state: state[1],
          });
        } catch (error) {
          // toast.error("Check Field Values", { position: "top-right" });
          console.log(error);
        }
      } else {
      }
    } else {
      toast.error("Provide atleast 1 reason to disapprove", { position: "top-right" });
    }
  };
  const validationSchema = Yup.object().shape({
    driverDOB: Yup.string()
      .when("driverDOBCheck", {
        is: true,
        then: Yup.string().required("Reason is required"),
      })
      .max(25, "Reason should be less than 25 characters"),
    // VehicleNameCheck: Yup.boolean().required("Vehicle Name is required"),
    // vehicleVINCheck: Yup.boolean().required("Vehicle VIN is required"),
    // ModelCheck: Yup.boolean().required("Model is required"),
    // YearCheck: Yup.boolean().required("Year is required"),
    // ColorCheck: Yup.boolean().required("Color is required"),
    // LicensePlateCheck: Yup.boolean().required("License Plate is required"),
    // seatAvailabilityCheck: Yup.boolean().required(
    //   "Seat Availability is required"
    // ),

    driverFirstName: Yup.string()
      .when("driverFirstNameCheck", {
        is: true,
        then: Yup.string().required("Reason is required"),
      })
      .max(25, "Reason should be less than 25 characters"),
    driverLastName: Yup.string()
      .when("driverLastNameCheck", {
        is: true,
        then: Yup.string().required("Reason is required"),
      })
      .max(25, "Reason should be less than 25 characters"),
    driverGender: Yup.string()
      .when("driverGenderCheck", {
        is: true,
        then: Yup.string().required("Reason is required"),
      })
      .max(25, "Reason should be less than 25 characters"),
    driverProfile: Yup.string()
      .when("driverProfileCheck", {
        is: true,
        then: Yup.string().required("Reason is required"),
      })
      .max(25, "Reason should be less than 25 characters"),
    driverStreet: Yup.string()
      .when("driverStreetCheck", {
        is: true,
        then: Yup.string().required("Reason is required"),
      })
      .max(25, "Reason should be less than 25 characters"),
    // VehicleMake: Yup.string()
    //   .when("VehicleMakeCheck", {
    //     is: true,
    //     then: Yup.string().required("Reason is required"),
    //   })
    //   .max(25, "Vehicle Make should be less than 25 characters"),
    VehicleName: Yup.string()
      .when("VehicleNameCheck", {
        is: true,
        then: Yup.string().required("Reason is required"),
      })
      .max(25, "Vehicle Make should be less than 25 characters"),
    vehicleVIN: Yup.string()
      .when("vehicleVINCheck", {
        is: true,
        then: Yup.string().required("Reason is required"),
      })
      .max(25, "Vehicle VIN should be less than 25 characters"),
    Model: Yup.string()
      .when("ModelCheck", {
        is: true,
        then: Yup.string().required("Reason is required"),
      })
      .max(25, "Model should be less than 25 characters"),
    Year: Yup.string()
      .when("YearCheck", {
        is: true,
        then: Yup.string().required("Reason is required"),
      })
      .max(25, "Year should be less than 25 characters"),
    Color: Yup.string()
      .when("ColorCheck", {
        is: true,
        then: Yup.string().required("Reason is required"),
      })
      .max(25, "Color should be less than 25 characters"),
    LicensePlate: Yup.string()
      .when("LicensePlateCheck", {
        is: true,
        then: Yup.string().required("Reason is required"),
      })
      .max(25, "License plate should be less than 25 characters"),
    seatAvailability: Yup.string()
      .when("seatAvailabilityCheck", {
        is: true,
        then: Yup.string().required("Reason is required"),
      })
      .max(25, "Seat Availability should be less than 25 characters"),
    CarInsuranceFront: Yup.string()
      .when("CarInsuranceFrontCheck", {
        is: true,
        then: Yup.string().required("Reason is required"),
      })
      .max(25, "Car Insurance Front should be less than 25 characters"),
    CarInsuranceBack: Yup.string()
      .when("CarInsuranceBackCheck", {
        is: true,
        then: Yup.string().required("Reason is required"),
      })
      .max(25, "Car Insurance Back should be less than 25 characters"),
    DrivingLicenseFront: Yup.string()
      .when("DrivingLicenseFrontCheck", {
        is: true,
        then: Yup.string().required("Reason is required"),
      })
      .max(25, "Driving License Front should be less than 25 characters"),
    DrivingLicenseBack: Yup.string()
      .when("DrivingLicenseBackCheck", {
        is: true,
        then: Yup.string().required("Reason is required"),
      })
      .max(25, "Driving License Back should be less than 25 characters"),
    LicenseExpiryDate: Yup.string()
      .when("LicenseExpiryDateCheck", {
        is: true,
        then: Yup.string().required("Reason is required"),
      })
      .max(25, "License Expiry Date should be less than 25 characters"),
    InsuranceExpiryDate: Yup.string()
      .when("InsuranceExpiryDateCheck", {
        is: true,
        then: Yup.string().required("Reason is required"),
      })
      .max(25, "Insurance Expiry Date should be less than 25 characters"),
  });
  const sanitizeDecimal = (rating) => {
    console.log("ratinggggggg", rating);
    // let regexNumber = /^[0-9]+$/;

    if (typeof rating === "number") {
      // return rating.slice(0, 3);

      return +rating.toFixed(2);
    } else if (typeof rating === "string") {
      return parseFloat(rating).toFixed(2);
    }
  };
  const csvData = tableData.map((item) => ({
    "Date & Time": moment(item.createdAt).format("Do MMMM YYYY, h:mm a"),

    "Booking Id": item?.bookingId,
    "Driver Name": item?.driver?.firstName + " " + item?.driver?.lastName,
    "User Name": item?.users?.firstName + " " + item?.users?.lastName,
    "Total Distance": item?.ride_distance ? sanitizeDecimal(item?.ride_distance) : 0,
    "Total Fare": item.price ? (item?.price).toFixed(2) : "",
  }));
  const headers = [
    { label: "Date & Time", key: "Date & Time" },
    { label: "Booking Id", key: "Booking Id" },
    { label: "Driver Name", key: "Driver Name" },
    { label: "User Name", key: "User Name" },
    { label: "Total Distance", key: "Total Distance" },
    { label: "Total Fare", key: "Total Fare" },
  ];

  const csvLink = {
    filename: "Driver.csv",
    headers: headers,
    data: csvData,
  };
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
  const DeleteDriver = async (id) => {
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
        const { data } = await axios.delete(`/private/driverDelete/${id}?status=delete`);
        // getCategoriesContent(page, limit, ServiceTypeId, ActiveInactiveDuty, status, search, startFilterValue, endFilterValue);
        props.history.goBack();
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
    //     getCategoriesContent(page, limit, ServiceTypeId, ActiveInactiveDuty, status, search, startFilterValue, endFilterValue);
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
                  <Button
                    // variant="outlined"
                    // aria-label="add"
                    // className={classes.iconMargin}
                    onClick={() => {
                      props.history.push({
                        pathname: state[1].pathname,
                        state: state[1],
                      });
                    }}
                  >
                    <ArrowBackIosIcon style={{ fontSize: "2.5rem" }} />
                  </Button>
                  &emsp;
                  <h3 style={{}}>Driver Details</h3>
                </Paper>

                {/* //new design */}

                {/* <br /> */}

                {/* status end */}
                <Paper
                  elevation={0}
                  style={{ display: "flex", gap: "2%", backgroundColor: "transparent" }}
                  className={classNames(classes.customResponsive)}
                >
                  <Paper style={{ display: "flex", flexDirection: "column", backgroundColor: "transparent" }} elevation={0}>
                    {/* section 1 */}
                    <div
                      style={{
                        margin: "0px 0px 20px 0px",
                        padding: "10px 10px 10px 10px",
                        borderRadius: "10px",
                        boxShadow: " rgba(0, 0, 0, 0.35) 0px 5px 15px",
                        minWidth: "300px",
                      }}
                    >
                      <div style={{ padding: "10px 0px 10px 0px" }}>
                        <div
                          style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}
                        >
                          <div
                            className="imgpic d-flex flex-column"
                            style={{
                              border: disapproveDetails?.driverProfileUpdate === "0" && PENDING ? "1px dashed red" : "",
                              padding: disapproveDetails?.driverProfileUpdate === "0" && PENDING ? "2px 5px 2px 5px" : "",
                            }}
                          >
                            <ModalImage
                              small={driverDetails[0]?.driver?.profileImage}
                              large={driverDetails[0]?.driver?.profileImage}
                              alt="Profile Image"
                              hideDownload
                              hideZoom
                            />
                          </div>
                          {disapproveDetails?.driverProfileUpdate === "0" && PENDING ? (
                            <span style={{ color: "red", fontWeight: "bold" }} className="ml-2">
                              <sup>*</sup>Updated
                            </span>
                          ) : (
                            false
                          )}
                        </div>
                        <div
                          className="d-flex flex-column"
                          style={{
                            textAlign: "center",
                            textTransform: "capitalize",
                            fontWeight: "bolder",
                            padding: "5px 0px 5px 0px",
                          }}
                        >
                          <span
                            style={{
                              border:
                                (disapproveDetails?.driverFirstNameUpdate === "0" ||
                                  disapproveDetails?.driverLastNameUpdate === "0") &&
                                PENDING
                                  ? "1px dashed red"
                                  : "",
                              padding:
                                (disapproveDetails?.driverFirstNameUpdate === "0" ||
                                  disapproveDetails?.driverLastNameUpdate === "0") &&
                                PENDING
                                  ? "2px 5px 2px 5px"
                                  : "",
                            }}
                          >
                            {" "}
                            {driverDetails[0]?.driver?.firstName + " " + driverDetails[0]?.driver?.lastName}
                          </span>
                          {(disapproveDetails?.driverFirstNameUpdate === "0" ||
                            disapproveDetails?.driverLastNameUpdate === "0") &&
                          PENDING ? (
                            <span style={{ color: "red", fontWeight: "bold" }} className="ml-2">
                              <sup>*</sup>Updated
                            </span>
                          ) : (
                            false
                          )}
                        </div>
                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                          <div style={{ fontWeight: "bolder", padding: "5px 0px 5px 0px" }}>
                            {driverDetails[0]?.driver?.countryCode + " " + driverDetails[0]?.driver?.phone}
                          </div>
                          &nbsp; <img src={tick} style={{ width: "20px", height: "20px" }} alt="" />
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-around",
                            marginTop: "15px",
                            gap: "0.5rem",
                          }}
                        >
                          <div style={{ display: "flex", flexDirection: "column", padding: "0px 5px 0px 5px" }}>
                            <div style={{ textAlign: "center" }}>{driverDetails[0]?.totalRide}</div>
                            <div style={{ fontWeight: "bold" }}>Total</div>
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", padding: "0px 5px 0px 5px" }}>
                            <div style={{ textAlign: "center" }}>{driverDetails[0]?.confirm_ride}</div>
                            <div style={{ fontWeight: "bold" }}>Completed</div>
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", padding: "0px 5px 0px 5px" }}>
                            <div style={{ textAlign: "center" }}>{driverDetails[0]?.cancel_ride}</div>
                            <div style={{ fontWeight: "bold" }}>Cancelled</div>
                          </div>
                        </div>
                        {driverDetails[0]?.status == "pending" && driverDetails[0].userUpdateDrivingLicense === true ? (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              padding: "10px 0px 10px 0px",
                              gap: "3rem",
                            }}
                            className="mt-3"
                          >
                            {/* <Button
                              variant="contained"
                              className="buttoncss mx-3"
                              style={{
                                backgroundColor: "#0059cd",
                                color: "#fff",
                                margin: "5px",
                              }}
                              onClick={() => {
                                // getCategoriesContent("disapproved");
                                approveDriver();
                              }}
                            >
                              Approve
                            </Button> */}
                            <Tooltip title={<span style={{ color: "white", fontSize: "16px" }}>Approve Driver</span>} arrow>
                              <IconButton
                                className="buttoncss"
                                style={{ backgroundColor: "green", color: "#fff" }}
                                onClick={() => {
                                  approveDriver();
                                }}
                              >
                                <PersonIcon />
                                <CheckIcon />
                              </IconButton>
                            </Tooltip>
                            {/* <Button
                              variant="contained"
                              className="buttoncss mx-3"
                              style={{
                                backgroundColor: "#0059cd",
                                color: "#fff",
                                margin: "5px",
                              }}
                              onClick={() => {
                                // getCategoriesContent("pending");
                                licenseCheck && vehicleCheck
                                  ? setOpen(true)
                                  : toast.error("Cannot Disapprove, Incomplete Details ", {
                                      position: toast.POSITION.TOP_RIGHT,
                                    });
                              }}
                            >
                              Disapprove
                            </Button> */}
                            <Tooltip title={<span style={{ color: "white", fontSize: "16px" }}>Disapprove Driver</span>} arrow>
                              <IconButton
                                className="buttoncss"
                                style={{ backgroundColor: "red", color: "#fff" }}
                                onClick={() => {
                                  licenseCheck && vehicleCheck
                                    ? setOpen(true)
                                    : toast.error("Cannot Disapprove, Incomplete Details ", {
                                        position: toast.POSITION.TOP_RIGHT,
                                      });
                                }}
                              >
                                <PersonIcon />
                                <CloseIcon />
                              </IconButton>
                            </Tooltip>
                          </div>
                        ) : driverDetails[0]?.status == "pending" && driverDetails[0].userUpdateDrivingLicense === false ? (
                          <div className="my-2 d-flex justify-content-center" style={{ fontWeight: "bold", color: "#e3941e" }}>
                            ⚠ Incomplete Details
                          </div>
                        ) : (
                          false
                        )}
                      </div>
                    </div>
                    {/* section 2 */}
                    <div
                      style={{
                        margin: "20px 0px 20px 0px",
                        padding: "10px 10px 10px 10px",
                        borderRadius: "10px",
                        boxShadow: " rgba(0, 0, 0, 0.35) 0px 5px 15px",
                      }}
                      className="text-break"
                    >
                      <div style={{ padding: "10px 0px 0px 0px" }}>
                        {/* <div style={{ fontWeight: "bolder", fontSize: "16px" }}>About Me :</div> */}
                        <div
                          // style={{
                          //   display: "flex",
                          //   flexDirection: "row",
                          //   justifyContent: "space-between",
                          //   padding: "10px 0px 10px 0px",
                          // }}
                          className="row py-2"
                        >
                          <div className="col-6 font-weight-bold">Driver ID</div>
                          <div className="col-6"> {driverDetails[0]?.driver?.user_id}</div>
                        </div>
                        <div className="row py-2">
                          <div className="col-6 font-weight-bold">Joining Date</div>
                          <div className="col-6"> {moment(driverDetails[0]?.driver?.createdAt).format("MM/DD/YYYY")}</div>
                        </div>
                        <div className="row py-2">
                          <div className="col-6 font-weight-bold">Driver DOB</div>
                          <div className="col-6 text-capitalize">
                            <div
                              style={{
                                border: disapproveDetails?.driverDOBUpdate === "0" && PENDING ? "1px dashed red" : "",
                                padding: disapproveDetails?.driverDOBUpdate === "0" && PENDING ? "2px 5px 2px 5px" : "",
                              }}
                            >
                              {" "}
                              {moment(driverDetails[0]?.driver?.driverDOB?.value).format("MM/DD/YYYY")}
                            </div>
                            {disapproveDetails?.driverDOBUpdate === "0" && PENDING ? (
                              <span style={{ color: "red", fontWeight: "bold" }} className="ml-2">
                                <sup>*</sup>Updated
                              </span>
                            ) : (
                              false
                            )}
                          </div>
                        </div>
                        <div className="row py-2">
                          <div className="col-6 font-weight-bold">Gender</div>
                          <div className="col-6 text-capitalize">
                            <div
                              style={{
                                border: disapproveDetails?.driverGenderUpdate === "0" && PENDING ? "1px dashed red" : "",
                                padding: disapproveDetails?.driverGenderUpdate === "0" && PENDING ? "2px 5px 2px 5px" : "",
                              }}
                            >
                              {driverDetails[0]?.driver?.driverGender?.value}
                            </div>
                            {disapproveDetails?.driverGenderUpdate === "0" && PENDING ? (
                              <span style={{ color: "red", fontWeight: "bold" }} className="ml-2">
                                <sup>*</sup>Updated
                              </span>
                            ) : (
                              false
                            )}
                          </div>
                        </div>

                        <div className="row py-2">
                          <div className="col-6 font-weight-bold">Service Type</div>
                          <div className="col-6 text-capitalize">{driverDetails[0]?.serviceType?.title}</div>
                        </div>
                        <div className="row py-2">
                          <div className="col-6 font-weight-bold">Rating</div>
                          <div className="col-6">
                            <StarRatings
                              rating={driverDetails[0]?.driver?.rating}
                              starRatedColor="blue"
                              //   changeRating={}
                              numberOfStars={5}
                              name="rating"
                              starDimension="15px"
                              starSpacing="2px"
                            />
                          </div>
                        </div>
                        <div className="row py-2">
                          <div className="col-6 font-weight-bold">Email ID</div>
                          <div className="col-6" style={{ wordBreak: "break-word" }}>
                            {driverDetails[0]?.driver?.email}
                          </div>
                        </div>
                        <div className="row py-2">
                          <div className="col-6 font-weight-bold">Language</div>
                          <div className="col-6 text-capitalize">
                            {driverDetails[0]?.driver?.driverLanguage.map((ele, i) => (
                              <div key={i}>{filterLanguageValue(ele)}</div>
                            ))}
                          </div>
                        </div>
                        {/* data added */}
                        <div className="row py-2">
                          <div className="col-6 font-weight-bold">Street Name</div>
                          <div className="col-6 text-capitalize">
                            <div
                              style={{
                                border: disapproveDetails?.driverStreetUpdate === "0" && PENDING ? "1px dashed red" : "",
                                padding: disapproveDetails?.driverStreetUpdate === "0" && PENDING ? "2px 5px 2px 5px" : "",
                              }}
                            >
                              {driverDetails[0]?.driver?.streetName?.value}
                            </div>
                            {disapproveDetails?.driverStreetUpdate === "0" && PENDING ? (
                              <span style={{ color: "red", fontWeight: "bold" }} className="ml-2">
                                <sup>*</sup>Updated
                              </span>
                            ) : (
                              false
                            )}
                          </div>
                        </div>
                        <div className="row py-2">
                          <div className="col-6 font-weight-bold">City</div>
                          <div className="col-6 text-capitalize">
                            <div
                              style={{
                                border: disapproveDetails?.driverStreetUpdate === "0" && PENDING ? "1px dashed red" : "",
                                padding: disapproveDetails?.driverStreetUpdate === "0" && PENDING ? "2px 5px 2px 5px" : "",
                              }}
                            >
                              {driverDetails[0]?.driver?.city?.value}
                            </div>
                            {disapproveDetails?.driverStreetUpdate === "0" && PENDING ? (
                              <span style={{ color: "red", fontWeight: "bold" }} className="ml-2">
                                <sup>*</sup>Updated
                              </span>
                            ) : (
                              false
                            )}
                          </div>
                        </div>
                        <div className="row py-2">
                          <div className="col-6 font-weight-bold">State</div>
                          <div className="col-6 text-capitalize">
                            <div
                              style={{
                                border: disapproveDetails?.driverStreetUpdate === "0" && PENDING ? "1px dashed red" : "",
                                padding: disapproveDetails?.driverStreetUpdate === "0" && PENDING ? "2px 5px 2px 5px" : "",
                              }}
                            >
                              {driverDetails[0]?.driver?.state?.value}
                            </div>
                            {disapproveDetails?.driverStreetUpdate === "0" && PENDING ? (
                              <span style={{ color: "red", fontWeight: "bold" }} className="ml-2">
                                <sup>*</sup>Updated
                              </span>
                            ) : (
                              false
                            )}
                          </div>
                        </div>
                        <div className="row py-2">
                          <div className="col-6 font-weight-bold">Zip Code</div>
                          <div className="col-6 text-capitalize">
                            <div
                              style={{
                                border: disapproveDetails?.driverStreetUpdate === "0" && PENDING ? "1px dashed red" : "",
                                padding: disapproveDetails?.driverStreetUpdate === "0" && PENDING ? "2px 5px 2px 5px" : "",
                              }}
                            >
                              {driverDetails[0]?.driver?.zipCode?.value}
                            </div>
                            {disapproveDetails?.driverStreetUpdate === "0" && PENDING ? (
                              <span style={{ color: "red", fontWeight: "bold" }} className="ml-2">
                                <sup>*</sup>Updated
                              </span>
                            ) : (
                              false
                            )}
                          </div>
                        </div>
                        {/* data added end  */}
                        <div className="row py-2">
                          <div className="col-6 font-weight-bold">Approved By</div>
                          <div className="col-6 text-capitalize">{driverDetails[0]?.approvedBy}</div>
                        </div>
                      </div>
                    </div>
                    {/* section 3 */}
                    {driverDetails[0]?.driver?.vehicleUpload === true ? (
                      <div
                        style={{
                          margin: "20px 0px 20px 0px",
                          padding: "10px 10px 10px 10px",
                          borderRadius: "10px",
                          boxShadow: " rgba(0, 0, 0, 0.35) 0px 5px 15px",
                        }}
                        className="text-break"
                      >
                        <div style={{ display: "flex", justifyContent: "center", overflow: "hidden" }}>
                          <div
                            style={{
                              maxWidth: "200px",
                              maxHeight: "100px",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <ModalImage
                              small={driverDetails[0]?.vehicleType?.icon}
                              large={driverDetails[0]?.vehicleType?.icon}
                              alt="Vehicle Image"
                              hideDownload
                              hideZoom
                            />
                          </div>
                        </div>
                        <div className="row py-2">
                          <div className="col-6 font-weight-bold">Vehicle Category</div>
                          <div className="col-6 text-capitalize">
                            {" "}
                            <div className="d-flex flex-column ">
                              <span
                                style={{
                                  border: disapproveDetails?.VehicleTypeUpdate === "0" && PENDING ? "1px dashed red" : "",
                                  padding: disapproveDetails?.VehicleTypeUpdate === "0" && PENDING ? "2px 5px 2px 5px" : "",
                                }}
                              >
                                {driverDetails[0]?.vehicleType?.title}
                              </span>{" "}
                              {disapproveDetails?.VehicleTypeUpdate === "0" && PENDING ? (
                                <span style={{ color: "red", fontWeight: "bold" }} className="ml-2">
                                  <sup>*</sup>Updated
                                </span>
                              ) : (
                                false
                              )}
                            </div>
                          </div>
                        </div>
                        {/* <div className="row py-2">
                          <div className="col-6 font-weight-bold">Vehicle Name</div>
                          <div className="col-6 text-capitalize">
                            <div className="d-flex align-items-end ">
                              <span
                                style={{
                                  border: disapproveDetails?.VehicleNameUpdate === "0" && PENDING ? "1px dashed red" : "",
                                  padding: disapproveDetails?.VehicleNameUpdate === "0" && PENDING ? "2px 5px 2px 5px" : "",
                                }}
                              >
                                {driverDetails[0]?.vehicle[0]?.vehicleName?.value}
                              </span>{" "}
                              {disapproveDetails?.VehicleNameUpdate === "0" && PENDING ? (
                                <span style={{ color: "red", fontWeight: "bold" }} className="ml-2">
                                  <sup>*</sup>Updated
                                </span>
                              ) : (
                                false
                              )}
                            </div>
                          </div>
                        </div> */}
                        <div className="row py-2">
                          <div className="col-6 font-weight-bold">Vehicle Make</div>
                          <div className="col-6 text-capitalize">
                            <div className="d-flex flex-column ">
                              <span
                                // style={{
                                //   border: disapproveDetails?.MakeUpdate === "0" && PENDING ? "1px dashed red" : "",
                                //   padding: disapproveDetails?.MakeUpdate === "0" && PENDING ? "2px 5px 2px 5px" : "",
                                // }}
                                style={{
                                  border: disapproveDetails?.VehicleNameUpdate === "0" && PENDING ? "1px dashed red" : "",
                                  padding: disapproveDetails?.VehicleNameUpdate === "0" && PENDING ? "2px 5px 2px 5px" : "",
                                }}
                              >
                                {/* {driverDetails[0]?.vehicle[0]?.modelId?.make} */}
                                {driverDetails[0]?.vehicle[0]?.vehicleName?.value}
                              </span>{" "}
                              {disapproveDetails?.VehicleNameUpdate === "0" && PENDING ? (
                                <span style={{ color: "red", fontWeight: "bold" }} className="ml-2">
                                  <sup>*</sup>Updated
                                </span>
                              ) : (
                                false
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="row py-2">
                          <div className="col-6 font-weight-bold">Vehicle Model</div>
                          <div className="col-6 text-capitalize">
                            <div className="d-flex flex-column ">
                              <span
                                style={{
                                  border: disapproveDetails?.ModelUpdate === "0" && PENDING ? "1px dashed red" : "",
                                  padding: disapproveDetails?.ModelUpdate === "0" && PENDING ? "2px 5px 2px 5px" : "",
                                }}
                              >
                                {driverDetails[0]?.vehicle[0]?.model?.value}
                              </span>{" "}
                              {disapproveDetails?.ModelUpdate === "0" && PENDING ? (
                                <span style={{ color: "red", fontWeight: "bold" }} className="ml-2">
                                  <sup>*</sup>Updated
                                </span>
                              ) : (
                                false
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="row py-2">
                          <div className="col-6 font-weight-bold">Vehicle Color</div>
                          <div className="col-6 text-capitalize">
                            <div className="d-flex flex-column">
                              <span
                                style={{
                                  border: disapproveDetails?.ColorUpdate === "0" && PENDING ? "1px dashed red" : "",
                                  padding: disapproveDetails?.ColorUpdate === "0" && PENDING ? "2px 5px 2px 5px" : "",
                                }}
                              >
                                {driverDetails[0]?.vehicle[0]?.color?.value}
                              </span>{" "}
                              {disapproveDetails?.ColorUpdate === "0" && PENDING ? (
                                <span style={{ color: "red", fontWeight: "bold" }} className="ml-2">
                                  <sup>*</sup>Updated
                                </span>
                              ) : (
                                false
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="row py-2">
                          <div className="col-6 font-weight-bold">Vehicle VIN</div>
                          <div className="col-6 ">
                            <div className="d-flex flex-column">
                              <span
                                style={{
                                  border: disapproveDetails?.vehicleVINUpdate === "0" && PENDING ? "1px dashed red" : "",
                                  padding: disapproveDetails?.vehicleVINUpdate === "0" && PENDING ? "2px 5px 2px 5px" : "",
                                }}
                              >
                                {driverDetails[0]?.vehicle[0]?.vehicleVIN?.value}
                              </span>{" "}
                              {disapproveDetails?.vehicleVINUpdate === "0" && PENDING ? (
                                <span style={{ color: "red", fontWeight: "bold" }} className="ml-2">
                                  <sup>*</sup>Updated
                                </span>
                              ) : (
                                false
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="row py-2">
                          <div className="col-6 font-weight-bold">Year</div>
                          <div className="col-6 text-capitalize">
                            <div className="d-flex flex-column">
                              <span
                                style={{
                                  border: disapproveDetails?.YearUpdate === "0" && PENDING ? "1px dashed red" : "",
                                  padding: disapproveDetails?.YearUpdate === "0" && PENDING ? "2px 5px 2px 5px" : "",
                                }}
                              >
                                {driverDetails[0]?.vehicle[0]?.year?.value}
                              </span>{" "}
                              {disapproveDetails?.YearUpdate === "0" && PENDING ? (
                                <span style={{ color: "red", fontWeight: "bold" }} className="ml-2">
                                  <sup>*</sup>Updated
                                </span>
                              ) : (
                                false
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="row py-2">
                          <div className="col-6 font-weight-bold">License Plate</div>
                          <div className="col-6 ">
                            <div className="d-flex flex-column">
                              <span
                                style={{
                                  border: disapproveDetails?.LicensePlateUpdate === "0" && PENDING ? "1px dashed red" : "",
                                  padding: disapproveDetails?.LicensePlateUpdate === "0" && PENDING ? "2px 5px 2px 5px" : "",
                                }}
                              >
                                {driverDetails[0]?.vehicle[0]?.licenseNumber?.value}
                              </span>{" "}
                              {disapproveDetails?.LicensePlateUpdate === "0" && PENDING ? (
                                <span style={{ color: "red", fontWeight: "bold" }} className="ml-2">
                                  <sup>*</sup>Updated
                                </span>
                              ) : (
                                false
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="row py-2">
                          <div className="col-6 font-weight-bold">Seat Availability</div>
                          <div className="col-6">
                            <div className="d-flex flex-column">
                              <span
                                style={{
                                  border: disapproveDetails?.seatAvailabilityUpdate === "0" && PENDING ? "1px dashed red" : "",
                                  padding:
                                    disapproveDetails?.seatAvailabilityUpdate === "0" && PENDING ? "2px 5px 2px 5px" : "",
                                }}
                              >
                                {driverDetails[0]?.vehicle[0]?.seatAvailability?.value}
                              </span>{" "}
                              {disapproveDetails?.seatAvailabilityUpdate === "0" && PENDING ? (
                                <span style={{ color: "red", fontWeight: "bold" }} className="ml-2">
                                  <sup>*</sup>Updated
                                </span>
                              ) : (
                                false
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      false
                    )}
                    {/* section 4 */}
                    {
                      // driverDetails[0]?.driver?.vehicleUpload === true ? (
                      <div
                        style={{
                          margin: "20px 0px 20px 0px",
                          padding: "10px 10px 10px 10px",
                          borderRadius: "10px",
                          boxShadow: " rgba(0, 0, 0, 0.35) 0px 5px 15px",
                        }}
                        className="text-break"
                      >
                        <div className="row py-2 pr-4">
                          <div className="col-6 font-weight-bold">Driving License</div>
                          <div className="col-6 " style={{ display: "flex", flexDirection: "row", gap: "5px" }}>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  border:
                                    disapproveDetails?.DrivingLicenseFrontUpdate === "0" && PENDING ? "1px dashed red" : "",
                                  padding:
                                    disapproveDetails?.DrivingLicenseFrontUpdate === "0" && PENDING ? "2px 5px 2px 5px" : "",
                                }}
                              >
                                <div style={{ maxWidth: "30px", maxHeight: "30px", overflow: "hidden" }}>
                                  <ModalImage
                                    small={driverDetails[0]?.driver?.drivingLicense?.fornt?.value}
                                    large={driverDetails[0]?.driver?.drivingLicense?.fornt?.value}
                                    alt="DL"
                                    hideDownload
                                    hideZoom
                                  />
                                </div>
                                <div style={{ paddingTop: "10px" }}>Front</div>
                              </div>
                              {disapproveDetails?.DrivingLicenseFrontUpdate === "0" && PENDING ? (
                                <span style={{ color: "red", fontWeight: "bold" }} className="">
                                  <sup>*</sup>Updated
                                </span>
                              ) : (
                                false
                              )}
                            </div>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  border:
                                    disapproveDetails?.DrivingLicenseBackUpdate === "0" && PENDING ? "1px dashed red" : "",
                                  padding:
                                    disapproveDetails?.DrivingLicenseBackUpdate === "0" && PENDING ? "2px 5px 2px 5px" : "",
                                }}
                              >
                                <div style={{ maxWidth: "30px", maxHeight: "30px", overflow: "hidden" }}>
                                  <ModalImage
                                    small={driverDetails[0]?.driver?.drivingLicense?.back?.value}
                                    large={driverDetails[0]?.driver?.drivingLicense?.back?.value}
                                    alt="DL"
                                    hideDownload
                                    hideZoom
                                  />
                                </div>
                                <div style={{ paddingTop: "10px" }}>Back</div>
                              </div>
                              {disapproveDetails?.DrivingLicenseBackUpdate === "0" && PENDING ? (
                                <span style={{ color: "red", fontWeight: "bold" }} className="">
                                  <sup>*</sup>Updated
                                </span>
                              ) : (
                                false
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="row py-2 pr-4">
                          <div className="col-6 font-weight-bold">License Expiry Date</div>
                          <div className="col-6 ">
                            <div className="d-flex flex-column">
                              <span
                                style={{
                                  border: disapproveDetails?.LicenseExpiryDateUpdate === "0" && PENDING ? "1px dashed red" : "",
                                  padding:
                                    disapproveDetails?.LicenseExpiryDateUpdate === "0" && PENDING ? "2px 5px 2px 5px" : "",
                                }}
                              >
                                {driverDetails[0]?.licenceExpireDate?.value}
                              </span>{" "}
                              {disapproveDetails?.LicenseExpiryDateUpdate === "0" && PENDING ? (
                                <span style={{ color: "red", fontWeight: "bold" }} className="ml-2">
                                  <sup>*</sup>Updated
                                </span>
                              ) : (
                                false
                              )}
                            </div>
                          </div>
                        </div>

                        {driverDetails[0]?.driver?.vehicleUpload === true ? (
                          <>
                            <div className="row py-2 pr-4">
                              <div className="col-6 font-weight-bold">Car Insurance</div>
                              <div className="col-6 " style={{ display: "flex", flexDirection: "row", gap: "5px" }}>
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                  }}
                                >
                                  {" "}
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                      border:
                                        disapproveDetails?.CarInsuranceFrontUpdate === "0" && PENDING ? "1px dashed red" : "",
                                      padding:
                                        disapproveDetails?.CarInsuranceFrontUpdate === "0" && PENDING ? "2px 5px 2px 5px" : "",
                                    }}
                                  >
                                    <div style={{ maxWidth: "30px", maxHeight: "30px", overflow: "hidden" }}>
                                      <ModalImage
                                        small={driverDetails[0]?.vehicle[0]?.InsuranceImage?.fornt?.value}
                                        large={driverDetails[0]?.vehicle[0]?.InsuranceImage?.fornt?.value}
                                        alt="CI"
                                        hideDownload
                                        hideZoom
                                      />
                                    </div>
                                    <div style={{ paddingTop: "10px" }}>Front</div>
                                  </div>{" "}
                                  {disapproveDetails?.CarInsuranceFrontUpdate === "0" && PENDING ? (
                                    <span style={{ color: "red", fontWeight: "bold" }} className="">
                                      <sup>*</sup>Updated
                                    </span>
                                  ) : (
                                    false
                                  )}
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                      border:
                                        disapproveDetails?.CarInsuranceBackUpdate === "0" && PENDING ? "1px dashed red" : "",
                                      padding:
                                        disapproveDetails?.CarInsuranceBackUpdate === "0" && PENDING ? "2px 5px 2px 5px" : "",
                                    }}
                                  >
                                    <div style={{ maxWidth: "30px", maxHeight: "30px", overflow: "hidden" }}>
                                      <ModalImage
                                        small={driverDetails[0]?.vehicle[0]?.InsuranceImage?.back?.value}
                                        large={driverDetails[0]?.vehicle[0]?.InsuranceImage?.back?.value}
                                        alt="CI"
                                        hideDownload
                                        hideZoom
                                      />
                                    </div>
                                    <div style={{ paddingTop: "10px" }}>Back</div>
                                  </div>
                                  {disapproveDetails?.CarInsuranceBackUpdate === "0" && PENDING ? (
                                    <span style={{ color: "red", fontWeight: "bold" }} className="">
                                      <sup>*</sup>Updated
                                    </span>
                                  ) : (
                                    false
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="row py-2 pr-4">
                              <div className="col-6 font-weight-bold">Insurance Expiry Date</div>
                              <div className="col-6 ">
                                <div className="d-flex flex-column">
                                  <span
                                    style={{
                                      border:
                                        disapproveDetails?.InsuranceExpiryDateUpdate === "0" && PENDING ? "1px dashed red" : "",
                                      padding:
                                        disapproveDetails?.InsuranceExpiryDateUpdate === "0" && PENDING
                                          ? "2px 5px 2px 5px"
                                          : "",
                                    }}
                                  >
                                    {driverDetails[0]?.vehicle[0]?.insuranceExpireDate?.value}
                                  </span>{" "}
                                  {disapproveDetails?.InsuranceExpiryDateUpdate === "0" && PENDING ? (
                                    <span style={{ color: "red", fontWeight: "bold" }} className="ml-2">
                                      <sup>*</sup>Updated
                                    </span>
                                  ) : (
                                    false
                                  )}
                                </div>
                              </div>
                            </div>
                          </>
                        ) : (
                          false
                        )}
                        {/* {driverDetails[0]?.serviceType?._id == "62d53abebf652aa3778946cd" ? (
                          <div className="row py-2">
                            <div className="col-6 font-weight-bold">Expiry Date</div>
                            <div className="col-6 ">{driverDetails[0]?.licenceExpireDate?.value}</div>
                          </div>
                        ) : (
                          false
                        )} */}
                      </div>
                      // )
                      // : (
                      // false
                      // )
                    }
                    {/* section 5 */}

                    {/* {driverDetails[0]?.driver_bank_accounts.length > 0 ? ( */}
                    <div
                      style={{
                        margin: "20px 0px 20px 0px",
                        padding: "10px 10px 10px 10px",
                        borderRadius: "10px",
                        boxShadow: " rgba(0, 0, 0, 0.35) 0px 5px 15px",
                      }}
                      className="text-break"
                    >
                      <div className="row py-2">
                        <div className="col-6 font-weight-bold">Account Holder Name</div>
                        <div className="col-6 ">
                          {driverDetails[0]?.driver_bank_accounts[0]?.account_holder_name
                            ? driverDetails[0]?.driver_bank_accounts[0]?.account_holder_name
                            : "N/A"}
                        </div>
                      </div>
                      <div className="row py-2">
                        <div className="col-6 font-weight-bold">Card Number (last 4)</div>
                        <div className="col-6 ">
                          {driverDetails[0]?.driver_bank_accounts[0]?.last4
                            ? driverDetails[0]?.driver_bank_accounts[0]?.last4
                            : "N/A"}
                        </div>
                      </div>
                    </div>
                    {/* ) : (
                      false
                    )} */}
                  </Paper>
                  <Paper
                    elevation={0}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      flex: 1,
                      overflowY: "auto",
                      backgroundColor: "transparent",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-around",
                        gap: "0.5rem",
                        alignItems: "center",
                        flexWrap: "wrap",
                        marginBottom: "0.5rem",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <Button
                          variant="contained"
                          className="buttoncss mx-3"
                          style={{
                            backgroundColor: bookingStatus == "complete" ? "#0059cd" : "#c4c4c4", //"#0059cd",
                            color: "#fff",
                            margin: "5px",
                          }}
                          onClick={() => {
                            setBookingStatus("complete");
                          }}
                        >
                          completed ride
                        </Button>
                        <Button
                          variant="contained"
                          className="buttoncss mx-3"
                          style={{
                            backgroundColor: bookingStatus == "cancel" ? "#0059cd" : "#c4c4c4", //"#0059cd",
                            color: "#fff",
                            margin: "5px",
                          }}
                          onClick={() => {
                            setBookingStatus("cancel");
                          }}
                        >
                          cancelled ride
                        </Button>
                      </div>
                      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem" }}>
                        <CSVLink
                          ref={downloadExcel}
                          style={{
                            backgroundColor: "#0059cd",
                            color: "#fff",
                            padding: "8px",
                            textTransform: "uppercase",
                            borderRadius: "5px",
                            fontSize: "13px",
                          }}
                          {...csvLink}
                          className="buttoncss"
                          hidden
                        >
                          <GetAppIcon />
                          &nbsp; Download Excel
                        </CSVLink>

                        <div className="customReactSelect" style={{ width: "200px" }}>
                          <RSelect
                            options={serviceTypeData}
                            key={serviceTypeData}
                            isSearchable={false}
                            defaultValue={
                              !state[2]
                                ? { label: "All", value: "all" }
                                : serviceTypeData.filter((item) => item.value === state[2])[0]
                              // : { label: "Single Taxi", value: "62d53aa9bf652aa3778946ca" }
                            }
                            onChange={(e) => {
                              setServiceType(e.value);
                            }}
                          />
                          {console.log(serviceTypeData?.filter((ele) => ele.value === state[2])[0])}
                        </div>
                        <Tooltip title={<span style={{ color: "white", fontSize: "16px" }}>Download Excel</span>} arrow>
                          <IconButton
                            className="buttoncss"
                            style={{ backgroundColor: "#006FFF", color: "#fff" }}
                            onClick={() => {
                              downloadExcel.current.link.click();
                            }}
                          >
                            <GetAppIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={<span style={{ color: "white", fontSize: "16px" }}>Delete Driver</span>} arrow>
                          <IconButton
                            className="buttoncss"
                            style={{ backgroundColor: "#dc143c", color: "#fff" }}
                            onClick={() => {
                              DeleteDriver(driverDetails[0]?._id);
                            }}
                          >
                            <DeleteOutlineOutlined />
                          </IconButton>
                        </Tooltip>
                        {/* <div
                          style={{
                            textTransform: "capitalize",
                            textDecoration: "underline",
                            padding: "0px 10px 0px 10px",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            console.log(serviceType);
                            let payload = {
                              page: 1,
                              limit: 10,
                              Incomplete: Incomplete,
                              search: "",
                              status: bookingStatus == "complete" ? "completed" : "cancel",
                              serviceType: serviceType,
                              start_date: "",
                              end_date: "",
                            };
                            props.history.push({
                              pathname: "/adminPanel/Booking_Management",
                              state: payload,
                            });
                          }}
                        >
                          View All
                        </div> */}
                      </div>
                    </div>
                    <Paper>
                      <TableContainer className={classes.container}>
                        <Table className={classes.table} stickyHeader>
                          <TableHead>
                            <TableRow>
                              <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Sr. No.</TableCell>
                              <TableCell style={{ textAlign: "center", fontWeight: "bold" }}> Booking Id</TableCell>
                              <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>
                                {bookingStatus == "complete" ? `Date & Time(Start)` : `Date & Time`}
                              </TableCell>
                              {bookingStatus == "complete" ?   <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>
                                {`Date & Time(End)` }
                              </TableCell>:false}
                            
                              <TableCell style={{ textAlign: "center", fontWeight: "bold" }}> Driver Name</TableCell>
                              <TableCell style={{ textAlign: "center", fontWeight: "bold" }}> User Name</TableCell>
                              <TableCell style={{ textAlign: "center", fontWeight: "bold" }}> Total Distance</TableCell>
                              <TableCell style={{ textAlign: "center", fontWeight: "bold" }}> Total Fare</TableCell>

                              <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Actions</TableCell>
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
                                    {get(category, "bookingId", "N/A")}
                                  </TableCell>
                                  <TableCell style={{ textAlign: "center" }}>
                                 
                                    {category.status === "complete"
                                      ?
                                      moment(category.createdAt).format("Do MMM YY ,hh:mm a")
                                      //  `${moment(category.bookingAcceptTime).format("Do MMM YY ,hh:mm a")}-${moment(
                                      //     category.dropTime
                                      //   ).format("Do MMM YY ,hh:mm a")}`

                                      : moment(category.createdAt).format("Do MMM YY ,hh:mm a")}
                                  </TableCell>
                                  {bookingStatus == "complete" ?  <TableCell style={{ textAlign: "center" }}>
                                 
                               
                                   { moment(category.dropTime).format("Do MMM YY ,hh:mm a")}
                               </TableCell>:false}
                               
                                  <TableCell
                                    className={classes.textMiddle}
                                    style={{ textAlign: "center", textTransform: "capitalize" }}
                                  >
                                    {category.driver ? category?.driver?.firstName + " " + category?.driver?.lastName : "N/A"}
                                  </TableCell>
                                  <TableCell
                                    className={classes.textMiddle}
                                    style={{ textAlign: "center", textTransform: "capitalize" }}
                                  >
                                    {category.users ? category?.users?.firstName + " " + category?.users?.lastName : "N/A"}
                                  </TableCell>
                                  <TableCell className={classes.textMiddle} style={{ textAlign: "center" }}>
                                    {sanitizeDecimal(get(category, "ride_distance", "N/A"))}
                                  </TableCell>
                                  <TableCell className={classes.textMiddle} style={{ textAlign: "center" }}>
                                    {sanitizeDecimal(get(category, "price", "0"))}
                                  </TableCell>

                                  {/* <TableCell style={{textAlign:"center"}}>{category.doc?<img src={category.doc} alt="doc" style={{width:"50px",height:"50px"}}/>:"No Doc"}</TableCell> */}
                                  <TableCell className={classes.textMiddle} style={{ textAlign: "center" }}>
                                    <Button
                                      className=""
                                      onClick={() => ViewBookingDetails(category.bookingId)}
                                      style={{
                                        // border: "1.5px solid #c4c4c4",
                                        // margin: "0.5rem",
                                        color: "#696969",
                                      }}
                                    >
                                      <Tooltip title="View" arrow>
                                        <VisibilityIcon />
                                      </Tooltip>
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                      {DisplayNoDataImage && (
                        <div style={{ textAlign: "center" }}>
                          <img src={noData} alt="noData" style={{ maxHeight: "300px" }} />
                        </div>
                      )}
                      <TablePagination
                        rowsPerPageOptions={
                          totalUserListCount >= 100 ? [10, 25, 100] : totalUserListCount > 10 ? [10, 25] : [10]
                        }
                        component="div"
                        count={totalUserListCount}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                      />
                    </Paper>
                    {/* <TablePagination
                      // rowsPerPageOptions={[10, 25, 100]}
                      component="div"
                      count={totalUserListCount}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    /> */}

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

                    <Paper elevation={0} style={{ padding: "25px 0px 25px 0px", backgroundColor: "transparent" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          padding: "10px 10px 10px 10px",
                          borderRadius: "10px",
                          boxShadow: " rgba(0, 0, 0, 0.35) 0px 5px 15px",
                        }}
                      >
                        <div style={{ fontSize: "20px", fontWeight: "bolder" }}>Rating & Reviews</div>
                        <div
                          style={{ textDecoration: "underline", cursor: "pointer" }}
                          onClick={() => {
                            props.history.push({
                              pathname: "/adminPanel/RatingAndReview",
                              state: [driverDetails[0]?.driver?._id, state[1], "driver", state[0], serviceType, bookingStatus],
                            });
                          }}
                        >
                          View All
                        </div>
                      </div>
                    </Paper>
                    {driverDetails[0]?.status == "approved" ? (
                      <Paper elevation={0} style={{ padding: "25px 0px 25px 0px", backgroundColor: "transparent" }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            padding: "10px 10px 10px 10px",
                            borderRadius: "10px",
                            boxShadow: " rgba(0, 0, 0, 0.35) 0px 5px 15px",
                          }}
                        >
                          <div style={{ fontSize: "20px", fontWeight: "bolder" }}>Total Redeem</div>
                          <div
                            style={{ textDecoration: "underline", cursor: "pointer" }}
                            onClick={() => {
                              props.history.push({
                                pathname: "/adminPanel/Redeem",
                                state: [driverID, state[0], state[1], serviceType, bookingStatus],
                              });
                            }}
                          >
                            View All
                          </div>
                        </div>
                      </Paper>
                    ) : (
                      false
                    )}
                  </Paper>
                </Paper>
              </div>
            </div>
          </Paper>
        </div>
        <Dialog
          open={open}
          // onClose={handleClose}
          // maxWidth="xl"
          fullWidth={true}
        >
          <DialogTitle
          // style={{ display: "flex", justifyContent: "center" }}
          >
            <h4 className="">Disapprove List</h4>
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
                validationSchema={validationSchema}
                initialValues={disapproveDetails}
                onSubmit={(values) => {
                  valuesSubmit(values);

                  //   }
                }}
              >
                {({ values, setFieldValue }) => (
                  <Form>
                    <br />
                    <div className="container">
                      {driverDetails[0]?.driver?.vehicleUpload === true ? (
                        <>
                          <div className="row">
                            <h5>Vehicle Details</h5>
                          </div>
                          <div className="row">
                            {" "}
                            <div className="col-4 d-flex align-items-center">
                              <Field className="CustomCheckBox" name="driverDOBCheck" type="checkbox" autoComplete="off" />
                              &nbsp;
                              <div className="" style={{}}>
                                Driver DOB:
                              </div>
                            </div>
                            <div className="col-4">
                              <div className="d-flex align-tems-end ">
                                <span
                                  style={{
                                    color: "#e3941e",
                                    fontWeight: "bold",
                                    border: values.driverDOBUpdate === "0" && PENDING ? "1px dashed red" : "",
                                    padding: values.driverDOBUpdate === "0" && PENDING ? "2px 5px 2px 5px" : "",
                                  }}
                                >
                                  {moment(values.driverDOBValue).format("MM/DD/YYYY")}
                                </span>{" "}
                                {values.driverDOBUpdate === "0" && PENDING ? (
                                  <span style={{ color: "red", fontWeight: "bold" }} className="ml-2">
                                    <sup>*</sup>Updated
                                  </span>
                                ) : (
                                  false
                                )}
                              </div>
                              <Field
                                className="ErrorMessageField"
                                name="driverDOB"
                                type="text"
                                autoComplete="off"
                                disabled={values.driverDOBCheck ? false : true}
                              />
                              <KErrorMessage name="driverDOB" />
                            </div>
                          </div>
                          <br />
                          <div className="row">
                            {" "}
                            <div className="col-4 d-flex align-items-center">
                              <Field
                                className="CustomCheckBox"
                                name="driverFirstNameCheck"
                                type="checkbox"
                                autoComplete="off"
                              />
                              &nbsp;
                              <div className="" style={{}}>
                                First Name:
                              </div>
                            </div>
                            <div className="col-4">
                              <div className="d-flex align-items-end ">
                                <span
                                  style={{
                                    color: "#e3941e",
                                    fontWeight: "bold",
                                    border: values.driverFirstNameUpdate === "0" && PENDING ? "1px dashed red" : "",
                                    padding: values.driverFirstNameUpdate === "0" && PENDING ? "2px 5px 2px 5px" : "",
                                  }}
                                >
                                  {values.driverFirstNameValue}
                                </span>{" "}
                                {values.driverFirstNameUpdate === "0" && PENDING ? (
                                  <span style={{ color: "red", fontWeight: "bold" }} className="ml-2">
                                    <sup>*</sup>Updated
                                  </span>
                                ) : (
                                  false
                                )}
                              </div>
                              <Field
                                className="ErrorMessageField"
                                name="driverFirstName"
                                type="text"
                                autoComplete="off"
                                disabled={values.driverFirstNameCheck ? false : true}
                              />
                              <KErrorMessage name="driverFirstName" />
                            </div>
                          </div>
                          <br />
                          <div className="row">
                            {" "}
                            <div className="col-4 d-flex align-items-center">
                              <Field className="CustomCheckBox" name="driverLastNameCheck" type="checkbox" autoComplete="off" />
                              &nbsp;
                              <div className="" style={{}}>
                                Last Name:
                              </div>
                            </div>
                            <div className="col-4">
                              <div className="d-flex align-items-end ">
                                <span
                                  style={{
                                    color: "#e3941e",
                                    fontWeight: "bold",
                                    border: values.driverLastNameUpdate === "0" && PENDING ? "1px dashed red" : "",
                                    padding: values.driverLastNameUpdate === "0" && PENDING ? "2px 5px 2px 5px" : "",
                                  }}
                                >
                                  {values.driverLastNameValue}
                                </span>{" "}
                                {values.driverLastNameUpdate === "0" && PENDING ? (
                                  <span style={{ color: "red", fontWeight: "bold" }} className="ml-2">
                                    <sup>*</sup>Updated
                                  </span>
                                ) : (
                                  false
                                )}
                              </div>
                              <Field
                                className="ErrorMessageField"
                                name="driverLastName"
                                type="text"
                                autoComplete="off"
                                disabled={values.driverLastNameCheck ? false : true}
                              />
                              <KErrorMessage name="driverLastName" />
                            </div>
                          </div>
                          <br />
                          <div className="row">
                            {" "}
                            <div className="col-4 d-flex align-items-center">
                              <Field className="CustomCheckBox" name="driverGenderCheck" type="checkbox" autoComplete="off" />
                              &nbsp;
                              <div className="" style={{}}>
                                Gender:
                              </div>
                            </div>
                            <div className="col-4">
                              <div className="d-flex align-items-end ">
                                <span
                                  style={{
                                    color: "#e3941e",
                                    fontWeight: "bold",
                                    border: values.driverGenderUpdate === "0" && PENDING ? "1px dashed red" : "",
                                    padding: values.driverGenderUpdate === "0" && PENDING ? "2px 5px 2px 5px" : "",
                                  }}
                                >
                                  {values.driverGenderValue}
                                </span>{" "}
                                {values.driverGenderUpdate === "0" && PENDING ? (
                                  <span style={{ color: "red", fontWeight: "bold" }} className="ml-2">
                                    <sup>*</sup>Updated
                                  </span>
                                ) : (
                                  false
                                )}
                              </div>
                              <Field
                                className="ErrorMessageField"
                                name="driverGender"
                                type="text"
                                autoComplete="off"
                                disabled={values.driverGenderCheck ? false : true}
                              />
                              <KErrorMessage name="driverGender" />
                            </div>
                          </div>
                          <br />
                          {/* new data added  */}
                          <div className="row">
                            {" "}
                            <div className="col-4 d-flex align-items-center">
                              <Field className="CustomCheckBox" name="driverStreetCheck" type="checkbox" autoComplete="off" />
                              &nbsp;
                              <div className="" style={{}}>
                                Street Name:
                              </div>
                            </div>
                            <div className="col-4">
                              <div className="d-flex align-items-end ">
                                <span
                                  style={{
                                    color: "#e3941e",
                                    fontWeight: "bold",
                                    border: values.driverStreetUpdate === "0" && PENDING ? "1px dashed red" : "",
                                    padding: values.driverStreetUpdate === "0" && PENDING ? "2px 5px 2px 5px" : "",
                                  }}
                                >
                                  {values.driverStreetValue}
                                </span>{" "}
                                {values.driverStreetUpdate === "0" && PENDING ? (
                                  <span style={{ color: "red", fontWeight: "bold" }} className="ml-2">
                                    <sup>*</sup>Updated
                                  </span>
                                ) : (
                                  false
                                )}
                              </div>
                              <Field
                                className="ErrorMessageField"
                                name="driverStreet"
                                type="text"
                                autoComplete="off"
                                disabled={values.driverStreetCheck ? false : true}
                              />
                              <KErrorMessage name="driverStreet" />
                            </div>
                          </div>
                          <br />
                          {/* added */}
                          <div className="row">
                            {" "}
                            <div className="col-4 d-flex align-items-center">
                              <Field className="CustomCheckBox" name="driverProfileCheck" type="checkbox" autoComplete="off" />
                              &nbsp;
                              <div className="" style={{}}>
                                Profile Image: &nbsp;
                              </div>
                            </div>
                            <div className="col-4">
                              <div className="d-flex align-items-end">
                                <span
                                  style={{
                                    color: "navy",
                                    cursor: "pointer",
                                    textDecoration: "underline",
                                    border: values.driverProfileUpdate === "0" && PENDING ? "1px dashed red" : "",
                                    padding: values.driverProfileUpdate === "0" && PENDING ? "2px 5px 2px 5px" : "",
                                  }}
                                  onClick={() => {
                                    setImageDisplay({ ...ImagesDisplay, driverprofile: true });
                                  }}
                                >
                                  Image
                                </span>
                                &emsp;
                                {ImagesDisplay.driverprofile ? (
                                  <div style={{ maxWidth: "30px", maxHeight: "30px", overflow: "hidden" }}>
                                    <ModalImage
                                      small={driverDetails[0]?.driver?.driverProfile?.value}
                                      large={driverDetails[0]?.driver?.driverProfile?.value}
                                      alt="DL"
                                      hideDownload
                                      hideZoom
                                    />
                                  </div>
                                ) : (
                                  false
                                )}
                                {values.driverProfileUpdate === "0" && PENDING ? (
                                  <span style={{ color: "red", fontWeight: "bold" }} className="ml-2">
                                    <sup>*</sup>Updated
                                  </span>
                                ) : (
                                  false
                                )}
                              </div>

                              <Field
                                className="ErrorMessageField"
                                name="driverProfile"
                                type="text"
                                autoComplete="off"
                                disabled={values.driverProfileCheck ? false : true}
                              />
                              <KErrorMessage name="driverProfile" />
                            </div>
                          </div>
                          <br />
                          <div className="row">
                            {" "}
                            <div className="col-4 d-flex align-items-center">
                              <Field className="CustomCheckBox" name="VehicleTypeCheck" type="checkbox" autoComplete="off" />
                              &nbsp;
                              <div className="" style={{}}>
                                Vehicle Category:
                              </div>
                            </div>
                            <div className="col-4">
                              <div className="d-flex align-items-end ">
                                <span
                                  style={{
                                    color: "#e3941e",
                                    fontWeight: "bold",
                                    border: values.VehicleTypeUpdate === "0" && PENDING ? "1px dashed red" : "",
                                    padding: values.VehicleTypeUpdate === "0" && PENDING ? "2px 5px 2px 5px" : "",
                                  }}
                                >
                                  {values.VehicleTypeValue}
                                </span>{" "}
                                {values.VehicleTypeUpdate === "0" && PENDING ? (
                                  <span style={{ color: "red", fontWeight: "bold" }} className="ml-2">
                                    <sup>*</sup>Updated
                                  </span>
                                ) : (
                                  false
                                )}
                              </div>
                              <Field
                                className="ErrorMessageField"
                                name="VehicleType"
                                type="text"
                                autoComplete="off"
                                disabled={values.VehicleTypeCheck ? false : true}
                              />
                              <KErrorMessage name="VehicleType" />
                            </div>
                          </div>
                          <br />
                          <div className="row">
                            {" "}
                            <div className="col-4 d-flex align-items-center">
                              <Field className="CustomCheckBox" name="VehicleNameCheck" type="checkbox" autoComplete="off" />
                              &nbsp;
                              <div className="" style={{}}>
                                Vehicle Make:
                              </div>
                            </div>
                            <div className="col-4">
                              <div className="d-flex align-items-end ">
                                <span
                                  // style={{
                                  //   color: "#e3941e",
                                  //   fontWeight: "bold",
                                  //   border: values.MakeUpdate === "0" && PENDING ? "1px dashed red" : "",
                                  //   padding: values.MakeUpdate === "0" && PENDING ? "2px 5px 2px 5px" : "",
                                  // }}
                                  style={{
                                    color: "#e3941e",
                                    fontWeight: "bold",
                                    border: values.VehicleNameUpdate === "0" && PENDING ? "1px dashed red" : "",
                                    padding: values.VehicleNameUpdate === "0" && PENDING ? "2px 5px 2px 5px" : "",
                                  }}
                                >
                                  {/* {values.VehicleMakeValue} */}
                                  {values.VehicleNameValue}
                                </span>{" "}
                                {values.VehicleNameUpdate === "0" && PENDING ? (
                                  <span style={{ color: "red", fontWeight: "bold" }} className="ml-2">
                                    <sup>*</sup>Updated
                                  </span>
                                ) : (
                                  false
                                )}
                              </div>
                              <Field
                                className="ErrorMessageField"
                                name="VehicleName"
                                type="text"
                                autoComplete="off"
                                disabled={values.VehicleNameCheck ? false : true}
                              />
                              <KErrorMessage name="VehicleName" />
                            </div>
                          </div>
                          <br />

                          <div className="row">
                            {" "}
                            <div className="col-4 d-flex align-items-center">
                              <Field className="CustomCheckBox" name="ModelCheck" type="checkbox" autoComplete="off" />
                              &nbsp;
                              <div className="" style={{}}>
                                Vehicle Model :
                              </div>
                            </div>
                            <div className="col-4">
                              <div className="d-flex align-items-end">
                                <span
                                  style={{
                                    color: "#e3941e",
                                    fontWeight: "bold",
                                    border: values.ModelUpdate === "0" && PENDING ? "1px dashed red" : "",
                                    padding: values.ModelUpdate === "0" && PENDING ? "2px 5px 2px 5px" : "",
                                  }}
                                >
                                  {" "}
                                  {values.ModelValue}
                                </span>
                                {values.ModelUpdate === "0" && PENDING ? (
                                  <span style={{ color: "red", fontWeight: "bold" }} className="ml-2">
                                    <sup>*</sup>Updated
                                  </span>
                                ) : (
                                  false
                                )}
                              </div>
                              <Field
                                className="ErrorMessageField"
                                name="Model"
                                type="text"
                                autoComplete="off"
                                disabled={values.ModelCheck ? false : true}
                              />
                              <KErrorMessage name="Model" />
                            </div>
                          </div>
                          <br />
                          <div className="row">
                            {" "}
                            <div className="col-4 d-flex align-items-center">
                              <Field className="CustomCheckBox" name="ColorCheck" type="checkbox" autoComplete="off" />
                              &nbsp;
                              <div className="" style={{}}>
                                Vehicle Color :
                              </div>
                            </div>
                            <div className="col-4">
                              <div className="d-flex align-items-center">
                                <div
                                  className="d-flex align-items-center"
                                  style={{
                                    border: values.ColorUpdate === "0" && PENDING ? "1px dashed red" : "",
                                    padding: values.ColorUpdate === "0" && PENDING ? "2px 5px 2px 5px" : "",
                                  }}
                                >
                                  <span
                                    style={{
                                      color: "#e3941e",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    {values.ColorValue}
                                  </span>{" "}
                                  &emsp;
                                  <div
                                    style={{
                                      display: "inline-block",
                                      width: "30px",
                                      height: "10px",
                                      backgroundColor: `${values.ColorValue}`,
                                      border: "1px solid #c4c4c4",
                                      borderRadius: "2px",
                                    }}
                                  ></div>
                                </div>
                                {values.ColorUpdate === "0" && PENDING ? (
                                  <span style={{ color: "red", fontWeight: "bold" }} className="ml-2">
                                    <sup>*</sup>Updated
                                  </span>
                                ) : (
                                  false
                                )}
                              </div>

                              {/* <input type="color" id="head" name="head" value={`${values.ColorValue}`} /> */}
                              <Field
                                className="ErrorMessageField"
                                name="Color"
                                type="text"
                                autoComplete="off"
                                disabled={values.ColorCheck ? false : true}
                              />
                              <KErrorMessage name="Color" />
                            </div>
                          </div>
                          <br />
                          <div className="row">
                            {" "}
                            <div className="col-4 d-flex align-items-center">
                              <Field className="CustomCheckBox" name="vehicleVINCheck" type="checkbox" autoComplete="off" />
                              &nbsp;
                              <div className="" style={{}}>
                                Vehicle VIN : &nbsp;
                              </div>
                            </div>
                            <div className="col-4">
                              <div className="d-flex align-items-end">
                                <span
                                  style={{
                                    color: "#e3941e",
                                    fontWeight: "bold",
                                    border: values.vehicleVINUpdate === "0" && PENDING ? "1px dashed red" : "",
                                    padding: values.vehicleVINUpdate === "0" && PENDING ? "2px 5px 2px 5px" : "",
                                  }}
                                >
                                  {" "}
                                  {values.vehicleVINValue}
                                </span>
                                {values.VehicleVINUpdate === "0" && PENDING ? (
                                  <span style={{ color: "red", fontWeight: "bold" }} className="ml-2">
                                    <sup>*</sup>Updated
                                  </span>
                                ) : (
                                  false
                                )}
                              </div>
                              <Field
                                className="ErrorMessageField"
                                name="vehicleVIN"
                                type="text"
                                autoComplete="off"
                                disabled={values.vehicleVINCheck ? false : true}
                              />

                              <KErrorMessage name="vehicleVIN" />
                            </div>
                          </div>
                          <br />

                          <div className="row">
                            {" "}
                            <div className="col-4 d-flex align-items-center">
                              <Field className="CustomCheckBox" name="YearCheck" type="checkbox" autoComplete="off" />
                              &nbsp;
                              <div className="" style={{}}>
                                Year : &nbsp;
                              </div>
                            </div>
                            <div className="col-4">
                              <div className="d-flex align-items-end">
                                {" "}
                                <span
                                  style={{
                                    color: "#e3941e",
                                    fontWeight: "bold",
                                    border: values.YearUpdate === "0" && PENDING ? "1px dashed red" : "",
                                    padding: values.YearUpdate === "0" && PENDING ? "2px 5px 2px 5px" : "",
                                  }}
                                >
                                  {values.YearValue}
                                </span>{" "}
                                {values.YearUpdate === "0" && PENDING ? (
                                  <span style={{ color: "red", fontWeight: "bold" }} className="ml-2">
                                    <sup>*</sup>Updated
                                  </span>
                                ) : (
                                  false
                                )}
                              </div>
                              <Field
                                className="ErrorMessageField"
                                name="Year"
                                type="text"
                                autoComplete="off"
                                disabled={values.YearCheck ? false : true}
                              />
                              <KErrorMessage name="Year" />
                            </div>
                          </div>
                          <br />

                          <div className="row">
                            {" "}
                            <div className="col-4 d-flex align-items-center">
                              <Field className="CustomCheckBox" name="LicensePlateCheck" type="checkbox" autoComplete="off" />
                              &nbsp;
                              <div className="" style={{}}>
                                License Plate : &nbsp;
                              </div>
                            </div>
                            <div className="col-4">
                              <div className="d-flex align-items-end">
                                <span
                                  style={{
                                    color: "#e3941e",
                                    fontWeight: "bold",
                                    border: values.LicensePlateUpdate === "0" && PENDING ? "1px dashed red" : "",
                                    padding: values.LicensePlateUpdate === "0" && PENDING ? "2px 5px 2px 5px" : "",
                                  }}
                                >
                                  {" "}
                                  {values.LicensePlateValue}
                                </span>{" "}
                                {values.LicensePlateUpdate === "0" && PENDING ? (
                                  <span style={{ color: "red", fontWeight: "bold" }} className="ml-2">
                                    <sup>*</sup>Updated
                                  </span>
                                ) : (
                                  false
                                )}
                              </div>
                              <Field
                                className="ErrorMessageField"
                                name="LicensePlate"
                                type="text"
                                autoComplete="off"
                                disabled={values.LicensePlateCheck ? false : true}
                              />
                              <KErrorMessage name="LicensePlate" />
                            </div>
                          </div>
                          <br />
                          <div className="row">
                            {" "}
                            <div className="col-4 d-flex align-items-center">
                              <Field
                                className="CustomCheckBox"
                                name="seatAvailabilityCheck"
                                type="checkbox"
                                autoComplete="off"
                              />
                              &nbsp;
                              <div className="" style={{}}>
                                Seat Availability :
                              </div>
                            </div>
                            <div className="col-4">
                              <div className="d-flex align-items-end">
                                <span
                                  style={{
                                    color: "#e3941e",
                                    fontWeight: "bold",
                                    border: values.seatAvailabilityUpdate === "0" && PENDING ? "1px dashed red" : "",
                                    padding: values.seatAvailabilityUpdate === "0" && PENDING ? "2px 5px 2px 5px" : "",
                                  }}
                                >
                                  {values.seatAvailabilityValue}
                                </span>
                                {values.seatAvailabilityUpdate === "0" && PENDING ? (
                                  <span style={{ color: "red", fontWeight: "bold" }} className="ml-2">
                                    <sup>*</sup>Updated
                                  </span>
                                ) : (
                                  false
                                )}
                              </div>
                              <Field
                                className="ErrorMessageField"
                                name="seatAvailability"
                                type="text"
                                autoComplete="off"
                                disabled={values.seatAvailabilityCheck ? false : true}
                              />
                              <KErrorMessage name="seatAvailability" />
                            </div>
                          </div>
                        </>
                      ) : (
                        false
                      )}

                      <br />
                      <div className="row">
                        <h5>Documents</h5>
                      </div>
                      <div className="row">
                        {" "}
                        <div className="col-4 d-flex align-items-center">
                          <Field
                            className="CustomCheckBox"
                            name="DrivingLicenseFrontCheck"
                            type="checkbox"
                            autoComplete="off"
                          />
                          &nbsp;
                          <div className="" style={{}}>
                            License Front: &nbsp;
                          </div>
                        </div>
                        <div className="col-4">
                          <div className="d-flex align-items-end">
                            <span
                              style={{
                                color: "navy",
                                cursor: "pointer",
                                textDecoration: "underline",
                                border: values.DrivingLicenseFrontUpdate === "0" && PENDING ? "1px dashed red" : "",
                                padding: values.DrivingLicenseFrontUpdate === "0" && PENDING ? "2px 5px 2px 5px" : "",
                              }}
                              onClick={() => {
                                setImageDisplay({ ...ImagesDisplay, licensefront: true });
                              }}
                            >
                              Image
                            </span>
                            &emsp;
                            {ImagesDisplay.licensefront ? (
                              <div style={{ maxWidth: "30px", maxHeight: "30px", overflow: "hidden" }}>
                                <ModalImage
                                  small={driverDetails[0]?.driver?.drivingLicense?.fornt?.value}
                                  large={driverDetails[0]?.driver?.drivingLicense?.fornt?.value}
                                  alt="DL"
                                  hideDownload
                                  hideZoom
                                />
                              </div>
                            ) : (
                              false
                            )}
                            {values.DrivingLicenseFrontUpdate === "0" && PENDING ? (
                              <span style={{ color: "red", fontWeight: "bold" }} className="ml-2">
                                <sup>*</sup>Updated
                              </span>
                            ) : (
                              false
                            )}
                          </div>

                          <Field
                            className="ErrorMessageField"
                            name="DrivingLicenseFront"
                            type="text"
                            autoComplete="off"
                            disabled={values.DrivingLicenseFrontCheck ? false : true}
                          />
                          <KErrorMessage name="DrivingLicenseFront" />
                        </div>
                      </div>
                      <br />
                      <div className="row">
                        {" "}
                        <div className="col-4 d-flex align-items-center">
                          <Field className="CustomCheckBox" name="DrivingLicenseBackCheck" type="checkbox" autoComplete="off" />
                          &nbsp;
                          <div className="" style={{}}>
                            License Back: &nbsp;
                          </div>
                        </div>
                        <div className="col-4">
                          <div className="d-flex align-items-end">
                            <span
                              style={{
                                color: "navy",
                                cursor: "pointer",
                                textDecoration: "underline",
                                border: values.DrivingLicenseBackUpdate === "0" && PENDING ? "1px dashed red" : "",
                                padding: values.DrivingLicenseBackUpdate === "0" && PENDING ? "2px 5px 2px 5px" : "",
                              }}
                              onClick={() => {
                                setImageDisplay({ ...ImagesDisplay, licenseback: true });
                              }}
                            >
                              Image
                            </span>
                            &emsp;
                            {ImagesDisplay.licenseback ? (
                              <div style={{ maxWidth: "30px", maxHeight: "30px", overflow: "hidden" }}>
                                <ModalImage
                                  small={driverDetails[0]?.driver?.drivingLicense?.back?.value}
                                  large={driverDetails[0]?.driver?.drivingLicense?.back?.value}
                                  alt="DL"
                                  hideDownload
                                  hideZoom
                                />
                              </div>
                            ) : (
                              false
                            )}
                            {values.DrivingLicenseBackUpdate === "0" && PENDING ? (
                              <span style={{ color: "red", fontWeight: "bold" }} className="ml-2">
                                <sup>*</sup>Updated
                              </span>
                            ) : (
                              false
                            )}
                          </div>
                          <Field
                            className="ErrorMessageField"
                            name="DrivingLicenseBack"
                            type="text"
                            autoComplete="off"
                            disabled={values.DrivingLicenseBackCheck ? false : true}
                          />
                          <KErrorMessage name="DrivingLicenseBack" />
                        </div>
                      </div>
                      <br />
                      <div className="row">
                        {" "}
                        <div className="col-4 d-flex align-items-center">
                          <Field className="CustomCheckBox" name="LicenseExpiryDateCheck" type="checkbox" autoComplete="off" />
                          &nbsp;
                          <div className="" style={{}}>
                            License Expiry Date :
                          </div>
                        </div>
                        <div className="col-4">
                          <div className="d-flex align-items-end">
                            {" "}
                            <span
                              style={{
                                color: "#e3941e",
                                fontWeight: "bold",
                                border: values.LicenseExpiryDateUpdate === "0" && PENDING ? "1px dashed red" : "",
                                padding: values.LicenseExpiryDateUpdate === "0" && PENDING ? "2px 5px 2px 5px" : "",
                              }}
                            >
                              {values.LicenseExpiryDateValue}
                            </span>{" "}
                            {values.LicenseExpiryDateUpdate === "0" && PENDING ? (
                              <span style={{ color: "red", fontWeight: "bold" }} className="ml-2">
                                <sup>*</sup>Updated
                              </span>
                            ) : (
                              false
                            )}
                          </div>
                          <Field
                            className="ErrorMessageField"
                            name="LicenseExpiryDate"
                            type="text"
                            autoComplete="off"
                            disabled={
                              values.LicenseExpiryDateCheck && values.LicenseExpiryDate !== "License Date Expired"
                                ? false
                                : true
                            }
                          />
                          <KErrorMessage name="LicenseExpiryDate" />
                        </div>
                      </div>
                      <br />
                      {driverDetails[0]?.driver?.vehicleUpload === true ? (
                        <>
                          <div className="row">
                            {" "}
                            <div className="col-4 d-flex align-items-center">
                              <Field
                                className="CustomCheckBox"
                                name="CarInsuranceFrontCheck"
                                type="checkbox"
                                autoComplete="off"
                              />
                              &nbsp;
                              <div className="" style={{}}>
                                Insurance Front : &nbsp;
                              </div>
                            </div>
                            <div className="col-4">
                              <div className="d-flex align-items-end">
                                <span
                                  style={{
                                    color: "navy",
                                    cursor: "pointer",
                                    textDecoration: "underline",
                                    border: values.CarInsuranceFrontUpdate === "0" && PENDING ? "1px dashed red" : "",
                                    padding: values.CarInsuranceFrontUpdate === "0" && PENDING ? "2px 5px 2px 5px" : "",
                                  }}
                                  onClick={() => {
                                    setImageDisplay({ ...ImagesDisplay, insurancefront: true });
                                  }}
                                >
                                  Image
                                </span>
                                &emsp;
                                {ImagesDisplay.insurancefront ? (
                                  <div style={{ maxWidth: "30px", maxHeight: "30px", overflow: "hidden" }}>
                                    <ModalImage
                                      small={driverDetails[0]?.vehicle[0]?.InsuranceImage?.fornt?.value}
                                      large={driverDetails[0]?.vehicle[0]?.InsuranceImage?.fornt?.value}
                                      alt="DL"
                                      hideDownload
                                      hideZoom
                                    />
                                  </div>
                                ) : (
                                  false
                                )}
                                {values.CarInsuranceFrontUpdate === "0" && PENDING ? (
                                  <span style={{ color: "red", fontWeight: "bold" }} className="ml-2">
                                    <sup>*</sup>Updated
                                  </span>
                                ) : (
                                  false
                                )}
                              </div>
                              <Field
                                className="ErrorMessageField"
                                name="CarInsuranceFront"
                                type="text"
                                autoComplete="off"
                                disabled={values.CarInsuranceFrontCheck ? false : true}
                              />
                              <KErrorMessage name="CarInsuranceFront" />
                            </div>
                          </div>
                          <br />
                          <div className="row">
                            {" "}
                            <div className="col-4 d-flex align-items-center">
                              <Field
                                className="CustomCheckBox"
                                name="CarInsuranceBackCheck"
                                type="checkbox"
                                autoComplete="off"
                              />
                              &nbsp;
                              <div className="" style={{}}>
                                Insurance Back : &nbsp;
                              </div>
                            </div>
                            <div className="col-4">
                              <div className="d-flex align-items-end">
                                <span
                                  style={{
                                    color: "navy",
                                    cursor: "pointer",
                                    textDecoration: "underline",
                                    border: values.CarInsuranceBackUpdate === "0" && PENDING ? "1px dashed red" : "",
                                    padding: values.CarInsuranceBackUpdate === "0" && PENDING ? "2px 5px 2px 5px" : "",
                                  }}
                                  onClick={() => {
                                    setImageDisplay({ ...ImagesDisplay, insuranceback: true });
                                  }}
                                >
                                  Image
                                </span>
                                &emsp;
                                {ImagesDisplay.insuranceback ? (
                                  <div style={{ maxWidth: "30px", maxHeight: "30px", overflow: "hidden" }}>
                                    <ModalImage
                                      small={driverDetails[0]?.vehicle[0]?.InsuranceImage?.back?.value}
                                      large={driverDetails[0]?.vehicle[0]?.InsuranceImage?.back?.value}
                                      alt="DL"
                                      hideDownload
                                      hideZoom
                                    />
                                  </div>
                                ) : (
                                  false
                                )}
                                {values.CarInsuranceBackUpdate === "0" && PENDING ? (
                                  <span style={{ color: "red", fontWeight: "bold" }} className="ml-2">
                                    <sup>*</sup>Updated
                                  </span>
                                ) : (
                                  false
                                )}
                              </div>
                              <Field
                                className="ErrorMessageField"
                                name="CarInsuranceBack"
                                type="text"
                                autoComplete="off"
                                disabled={values.CarInsuranceBackCheck ? false : true}
                              />
                              <KErrorMessage name="CarInsuranceBack" />
                            </div>
                          </div>
                          <br />
                          <div className="row">
                            {" "}
                            <div className="col-4 d-flex align-items-center">
                              <Field
                                className="CustomCheckBox"
                                name="InsuranceExpiryDateCheck"
                                type="checkbox"
                                autoComplete="off"
                              />
                              &nbsp;
                              <div className="" style={{}}>
                                Insurance Expiry Date :
                              </div>
                            </div>
                            <div className="col-4">
                              <div className="d-flex align-items-end">
                                {" "}
                                <span
                                  style={{
                                    color: "#e3941e",
                                    fontWeight: "bold",
                                    border: values.InsuranceExpiryDateUpdate === "0" && PENDING ? "1px dashed red" : "",
                                    padding: values.InsuranceExpiryDateUpdate === "0" && PENDING ? "2px 5px 2px 5px" : "",
                                  }}
                                >
                                  {values.InsuranceExpiryDateValue}
                                </span>{" "}
                                {values.InsuranceExpiryDateUpdate === "0" && PENDING ? (
                                  <span style={{ color: "red", fontWeight: "bold" }} className="ml-2">
                                    <sup>*</sup>Updated
                                  </span>
                                ) : (
                                  false
                                )}
                              </div>
                              <Field
                                className="ErrorMessageField"
                                name="InsuranceExpiryDate"
                                type="text"
                                autoComplete="off"
                                disabled={values.InsuranceExpiryDateCheck ? false : true}
                              />
                              <KErrorMessage name="InsuranceExpiryDate" />
                            </div>
                          </div>
                          <br />
                        </>
                      ) : (
                        false
                      )}
                      <br />
                      {/* {driverDetails[0]?.serviceType?._id == "62d53abebf652aa3778946cd" ? (
                        <>
                          <div className="row">
                            <div className="col-4 d-flex align-items-center">
                              <Field
                                className="CustomCheckBox"
                                name="LicenseExpiryDateCheck"
                                type="checkbox"
                                autoComplete="off"
                              />
                              &nbsp;
                              <div className="" style={{}}>
                                Expiry Date : &nbsp;
                              </div>
                            </div>
                            <div className="col-4">
                              {values.LicenseExpiryDateValue}
                              <Field
                                className="ErrorMessageField"
                                name="LicenseExpiryDate"
                                type="text"
                                autoComplete="off"
                                disabled={values.LicenseExpiryDateCheck ? false : true}
                              />
                              <KErrorMessage name="LicenseExpiryDate" />
                            </div>
                          </div>
                          <br />
                        </>
                      ) : (
                        false
                      )} */}
                      {/* <div className="row">
                        <h5>Card Details</h5>
                      </div> */}
                      {/* <div className="row">
                        {" "}
                        <div className="col-4 d-flex align-items-center">
                          <Field
                            className=""
                            name="AccountHolderNameCheck"
                            // variant="outlined"
                            type="checkbox"
                            // inputProps={{name: "name"}}
                            autoComplete="off"
                            style={{
                              width: 15,
                              height: 15,
                              borderRadius: 5,
                              borderColor: "#d3d3d3",
                              borderStyle: "solid",
                              borderWidth: 1,
                              // backgroundColor: "#006FFF",
                              // paddingInlineStart: 10,
                            }}
                          />
                          &nbsp;
                          <div className="" style={{}}>
                            A/c Holder Name : &nbsp;
                          </div>
                        </div>
                        <div className="col-4">
                          <Field
                            className=""
                            name="AccountHolderName"
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
                          />
                          <KErrorMessage name="AccountHolderName" />
                        </div>
                      </div>
                      <br />
                      <div className="row">
                        {" "}
                        <div className="col-4 d-flex align-items-center">
                          <Field
                            className=""
                            name="CardNumberCheck"
                            // variant="outlined"
                            type="checkbox"
                            // inputProps={{name: "name"}}
                            autoComplete="off"
                            style={{
                              width: 15,
                              height: 15,
                              borderRadius: 5,
                              borderColor: "#d3d3d3",
                              borderStyle: "solid",
                              borderWidth: 1,
                              // backgroundColor: "#006FFF",
                              // paddingInlineStart: 10,
                            }}
                          />
                          &nbsp;
                          <div className="" style={{}}>
                            Card Number : &nbsp;
                          </div>
                        </div>
                        <div className="col-4">
                          <Field
                            className=""
                            name="CardNumber"
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
                          />
                          <KErrorMessage name="CardNumber" />
                        </div>
                      </div>
                      <br />

                      <div className="row">
                        {" "}
                        <div className="col-4 d-flex align-items-center">
                          <Field
                            className=""
                            name="ExpiryDateCheck"
                            // variant="outlined"
                            type="checkbox"
                            // inputProps={{name: "name"}}
                            autoComplete="off"
                            style={{
                              width: 15,
                              height: 15,
                              borderRadius: 5,
                              borderColor: "#d3d3d3",
                              borderStyle: "solid",
                              borderWidth: 1,
                              // backgroundColor: "#006FFF",
                              // paddingInlineStart: 10,
                            }}
                          />
                          &nbsp;
                          <div className="" style={{}}>
                            Expiry Date : &nbsp;
                          </div>
                        </div>
                        <div className="col-4">
                          <Field
                            className=""
                            name="ExpiryDate"
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
                          />
                          <KErrorMessage name="ExpiryDate" />
                        </div>
                      </div>
                      <br />
                      <div className="row">
                        {" "}
                        <div className="col-4 d-flex align-items-center">
                          <Field
                            className=""
                            name="CVVCheck"
                            // variant="outlined"
                            type="checkbox"
                            // inputProps={{name: "name"}}
                            autoComplete="off"
                            style={{
                              width: 15,
                              height: 15,
                              borderRadius: 5,
                              borderColor: "#d3d3d3",
                              borderStyle: "solid",
                              borderWidth: 1,
                              // backgroundColor: "#006FFF",
                              // paddingInlineStart: 10,
                            }}
                          />
                          &nbsp;
                          <div className="" style={{}}>
                            CVV : &nbsp;
                          </div>
                        </div>
                        <div className="col-4">
                          <Field
                            className=""
                            name="CVV"
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
                          />
                          <KErrorMessage name="CVV" />
                        </div>
                      </div> */}
                      <br />
                      <br />
                      <div className="text-center">
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
                              width: "15vw",
                              height: "5vh",
                              backgroundColor: "#006FFF",
                              color: "#fff",
                            }}
                            disabled={disapproveSaveButton}
                          >
                            SAVE
                          </button>
                        </div>
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
