import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import axios from "../../axios";
import { toast } from "react-toastify";
import DRIVER from "axios";
import moment from "moment";
// import Switch from '@mui/material/Switch';
// import { styled } from '@mui/material/styles';
// import Skeleton from "react-loading-skeleton";
// import "react-loading-skeleton/dist/skeleton.css";
import AddIcon from "@material-ui/icons/Add";
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

// import { Delete } from '@material-ui/icons';
import VisibilityIcon from "@material-ui/icons/Visibility";
import BlockIcon from "@material-ui/icons/Block";
// import ArrowBackIcon from "@material-ui/icons/ArrowBack";

// For Table
import SearchBar from "material-ui-search-bar";
import { get, orderBy } from "lodash";

//history
import { useHistory } from "react-router-dom";
// import AddEditCategory from "../AccountManagement/Account_Details";

import EditIcon from "@material-ui/icons/Edit";
import { DeleteOutline, WidgetsOutlined } from "@material-ui/icons";
import { array } from "yup";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Close, Search } from "@material-ui/icons";
import RSelect from "react-select";
import SearchIcon from "@material-ui/icons/Search";
import FilterListIcon from "@material-ui/icons/FilterList";
import NoDataFound from "../../components/NoDataFound";
import PuffLoader from "react-spinners/PuffLoader";
import { Input, Modal } from "../../components/index";
import { AiOutlineClose } from "react-icons/ai";
import { handleValidateTip } from "../../utils/validators";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";
import KErrorMessage from "./KErrorMessage";
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
    // maxHeight: "62vh",
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

export default function TaxiSingleManagement(props) {
  const classes = useStyles();

  // const history=useHistory();
  const [rselKey, setRselKey] = useState(0);
  const [tableData, setTableData] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [modalState, setModalState] = useState({
    isAddEditPromoCode: "",
  });
  const [selectedPromoCodeData, setSelectedPromoCodeData] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  // status switch
  const [checked, setChecked] = useState(true);

  // For Pagination
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [totalUserListCount, settotalUserListCount] = useState(0);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [serviceType, setServiceType] = useState([]);
  const [showDesc, setShowDescription] = useState({ show: false, data: "" });
  const [serviceTypeFilter, setServiceTypeFilter] = useState({ label: "All", value: "" });
  const [userTypeFilter, setUserTypeFilter] = useState({ label: "All", value: "" });
  const handleChangePage = (event, newPage) => {
    // console.log(event);
    // console.log(newPage);
    console.log(newPage);
    console.log({ event, newPage });
    getCategoriesContent(newPage + 1, rowsPerPage, search, serviceTypeFilter.value, userTypeFilter.value);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    getCategoriesContent(0, event.target.value, search, serviceTypeFilter.value, userTypeFilter.value);
    setRowsPerPage(parseInt(event.target.value, 10));
    console.log({ event });
    setPage(0);
  };

  useEffect(() => {
    getCategoriesContent(page, limit, search, serviceTypeFilter.value, userTypeFilter.value);
    getServiceType();
  }, []);
  useEffect(() => {
    setRselKey((k) => k + 1);
  }, [tableData]);
  //get content

  const getCategoriesContent = async (page = 1, limit = 10, search = "", serviceType = "", userType = "") => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(
        `/private/promocode?page=${page}&limit=${limit}&search=${search}&serviceType=${serviceType}&userType=${userType}`
      );
      console.log(data);
      setTableData([...data.data.docs]);
      // setSearchedData(data.data.docs);
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

  // const EditPromocode = (category) => {
  //   props.history.push({
  //     pathname: "/adminPanel/AddEditPromocode",
  //     state: category,
  //   });
  // };

  //edit  categories attribute

  const EditAttributeContent = (category) => {
    console.log(tableData);
    props.history.push({
      pathname: "/EditCategoryAttributes",
      state: category,
    });

    // delete category
  };
  const DeleteTaxiSingle = async (category) => {
    try {
      if (window.confirm("Are you sure you want to delete this taxi?")) {
        const { data } = await axios.delete(
          `/vehicleCategory/${category._id}`
          // , {
          // icon: category.icon,
          // title: category.title,
          // }
        );
        console.log(data);
        getCategoriesContent(page, limit, search, serviceTypeFilter.value, userTypeFilter.value);
        toast.success("Deleted", {
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

  // status switch

  const statusSwitch = async (e, category) => {
    // if (window.confirm("Are you sure you want to change the status?")) {
    try {
      const { data } = await axios.put(`/private/promocode/${category._id}`, {
        status: e.target.checked ? "1" : "0",
        // serviceTypeId: category.serviceTypeId,
        // OfferType: category.OfferType,
        // offerName: category.offerName,
        // offerCode: category.offerCode,
        // discountAmount: category.discountAmount,
        // discountType: category.discountType,
        // startDate: category.startDate,
        // endDate: category.endDate,
        // userLimit: category.userLimit,
      });

      console.log(data);
      // console.log(e.target.checked);
      toast.success(data.data.status == 1 ? "Activated" : "Deactivated", {
        position: toast.POSITION.TOP_RIGHT,
      });
      getCategoriesContent(page, limit, search, serviceTypeFilter.value, userTypeFilter.value);
    } catch (error) {
      console.log(error);
    }
    // } else {
    // toast.error("Please add fare first", {
    //   position: toast.POSITION.TOP_RIGHT,
    // });
    // }
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
    getCategoriesContent(page, limit, "", serviceTypeFilter.value, userTypeFilter.value);
  };
  const ManageTaxiSingle = (category) => {
    props.history.push({
      pathname: "/adminPanel/FareTaxiSingle",
      state: category,
    });
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

  const SearchPromocode = myDeb((search) => {
    getCategoriesContent(page, limit, search.toLowerCase(), serviceTypeFilter.value, userTypeFilter.value);
  });

  useEffect(() => {
    getServiceType();
  }, []);

  // get service type
  const getServiceType = async () => {
    try {
      const { data } = await DRIVER.get(`${ServiceType_Url}`);
      setServiceType(data.data);
      console.log(data.data);
      // return res.data;
    } catch (error) {
      console.log(error);
    }
  };
  const serviceOptions = [
    { label: "All", value: "" },
    { label: "Single Taxi", value: "62d53aa9bf652aa3778946ca" },
    { label: "Designated Driver", value: "62d53abebf652aa3778946cd" },
    { label: "Pet Category", value: "62d53ad1bf652aa3778946d0" },
    { label: "Package Category", value: "62d53ae6bf652aa3778946d3" },
  ];
  const userTypeOptions = [
    { label: "All", value: "" },
    { label: "New User", value: "0" },
    { label: "Existing User", value: "1" },
  ];
  console.log(serviceType);
  // const test = () => {
  //   let a = serviceType.filter((ele, i) =>
  //     ele._id === tableData[0].serviceTypeId ? ele.title : "N/A"
  //   );
  //   console.log(a);
  // };
  // console.log(tableData);
  // console.log(test());

  const validationSchema = yup.object({
    serviceType: yup.string().required("Service Type is required"),
    offerType: yup.string().required("Offer Type is required"),
    offerName: yup
      .string()
      .min(5, "Mininum 5 characters required")
      .max(30, "Maximum 30 characters required")
      .required("Offer Name is required"),
    offerCode: yup.string().required("Offer Code is required"),

    discountType: yup.string().required("Discount Type is required"),
    discountAmount: yup.number().when("discountType", {
      is: (discountType) => discountType == "0",
      then: yup
        .number()
        .integer("Integer values only")
        .min(1, "Minimum value is 1")
        .max(99999, "Max value is 99999")
        .typeError("Numeric values only")
        .required("Discount Amount is required"),
      otherwise: yup
        .number()
        .integer("Integer values only")
        .min(1, "Minimum value is 1")
        .max(99, "Maximum value is 99")
        .typeError("Numeric values only")
        .required("Discount Percentage is required"),
      // .integer("Integer values only")
      // .min(1, "Minimum value is 1")
      // .typeError("Numeric values only")
      // .required("Discount Amount is required"),
      // startDate: !state ? "" : new Date(state.startDate),
      // endDate: !state ? "" : new Date(state.endDate),
    }),

    userLimit: yup.number().typeError("Numeric values only").required("User Limit is required"),
    minimumOrderLimit: yup.number().when("discountType", {
      is: (discountType) => discountType == "0",
      then: yup
        .number()
        .integer("Integer values only")
        .moreThan(yup.ref("discountAmount"), "Minimum value should be greater than discount amount")
        .typeError("Numeric values only")
        .required("Discount Amount is required"),
      otherwise: yup
        .number()
        .integer("Integer values only")
        .min(1, "Minimum value is 1")
        // .max(99, "Maximum value is 99")
        .typeError("Numeric values only")
        .required("Discount Percentage is required"),
      // .typeError("Numeric values only")
      // .min(1, "Minimum value is 1")
      // .required("Minimum Order Limit is required"),
    }),
    description: yup
      .string()
      .min(5, "Mininum 5 characters required")
      .max(150, "Maximum 150 characters required")
      .required("Description is required"),
  });
  const validationSchema2 = yup.object({
    serviceType: yup.string().required("Service Type is required"),
    // offerType: yup.string().required("Offer Type is required"),
    offerName: yup
      .string()
      .min(5, "Mininum 5 characters required")
      .max(30, "Maximum 30 characters required")
      .required("Offer Name is required"),
    offerCode: yup.string().required("Offer Code is required"),
    discountType: yup.string().required("Discount Type is required"),
    discountAmount: yup
      .number()
      // .integer("Integer values only")
      // .min(1, "Minimum value is 1")
      // .typeError("Numeric values only")
      // .required("Discount Amount is required"),
      // .when("discountType", (discountType) => {
      //   if (discountType == "1") {
      //     return yup
      //       .number()
      //       .typeError("Numeric values only")
      //       .required("Discount Percentage is required");
      //   } else {
      //     return yup
      //       .number()
      //       .typeError("Numeric values only")
      //       .required("Discount Amount is required");
      //   }
      .when("discountType", {
        is: (discountType) => discountType == "0",
        then: yup
          .number()
          .integer("Integer values only")
          .min(1, "Minimum value is 1")
          .max(99999, "Max value is 99999")
          .typeError("Numeric values only")
          .required("Discount Amount is required"),
        otherwise: yup
          .number()
          .integer("Integer values only")
          .min(1, "Minimum value is 1")
          .max(99, "Maximum value is 99")
          .typeError("Numeric values only")
          .required("Discount Percentage is required"),
        // if (discountType == "1") {
        //   return yup
        //     .number()
        //     .integer("Integer values only")
        //     .min(1, "Minimum value is 1")
        //     .max(99, "Maximum value is 99")
        //     .typeError("Numeric values only")
        //     .required("Discount Percentage is required");
        // } else {
        //   return yup
        //     .number()
        //     .integer("Integer values only")
        //     .min(1, "Minimum value is 1")
        //     .typeError("Numeric values only")
        //     .required("Discount Amount is required");
        // }
        // }),

        // startDate: yup.date().required("Start Date is required"),
        // endDate: yup.date().required("End Date is required"),
        // userLimit: yup.number().required("User Limit is required"),
      }),
    minimumOrderLimit: yup.number().when("discountType", {
      is: (discountType) => discountType == "0",
      then: yup
        .number()
        .integer("Integer values only")
        .moreThan(yup.ref("discountAmount"), "Minimum value should be greater than discount amount")
        .typeError("Numeric values only")
        .required("Discount Amount is required"),
      otherwise: yup
        .number()
        .integer("Integer values only")
        .min(1, "Minimum value is 1")
        // .max(99, "Maximum value is 99")
        .typeError("Numeric values only")
        .required("Discount Percentage is required"),
      // .typeError("Numeric values only")
      // .min(1, "Minimum value is 1")
      // .required("Minimum Order Limit is required"),
    }),
    description: yup
      .string()
      .min(5, "Mininum 5 characters required")
      .max(150, "Maximum 150 characters required")
      .required("Description is required"),
    // .typeError("Numeric values only")

    // .min(1, "Minimum value is 1")
    // .required("Minimum Order Limit is required"),
  });
  useEffect(() => {
    getServiceType();
  }, []);

  // ADDING NEW CATEGORY

  const addNewPromocode = async (values) => {
    try {
      console.log(values);

      const { data } = await axios.post("/private/promocode", {
        serviceTypeId: values.serviceType,
        OfferType: values.offerType,
        offerName: values.offerName,
        offerCode: values.offerCode,
        discountAmount: values.discountAmount,
        discountType: values.discountType,
        startDate: values.startDate,
        endDate: values.endDate,
        userLimit: values.userLimit,
        minimumOrderLimit: values.minimumOrderLimit,
        description: values.description,
      });
      setModalState({
        isAddEditPromoCode: false,
      });
      setSelectedPromoCodeData(null);

      toast.success(data.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      getCategoriesContent(page, limit, search, serviceTypeFilter.value, userTypeFilter.value);
      getServiceType();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  // Edit Category . update api

  const EditPromocode = async (values) => {
    try {
      console.log(values);

      const { data } = await axios.put(`/private/promocode/${selectedPromoCodeData._id}`, {
        serviceTypeId: values.serviceType,
        OfferType: values.offerType,
        offerName: values.offerName,
        offerCode: values.offerCode,
        discountAmount: values.discountAmount,
        discountType: values.discountType,
        startDate: values.startDate,
        endDate: values.endDate,
        userLimit: values.userLimit,
        minimumOrderLimit: values.minimumOrderLimit,
        description: values.description,
      });
      setModalState({
        isAddEditPromoCode: false,
      });
      setSelectedPromoCodeData(null);
      // props.history.push({
      //   pathname: "/adminPanel/PromoCode_Management",
      // });
      toast.success(data.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      getCategoriesContent(page, limit, search, serviceTypeFilter.value, userTypeFilter.value);
      getServiceType();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  const [offer, setOfferCode] = useState("");
  const generateOfferCode = async (values) => {
    let dataToReturn;
    if (values.offerName.length >= 5 && values.offerName.length <= 20) {
      try {
        const { data } = await axios.post(`/private/createOfferCode`, {
          serviceTypeId: values.serviceType,
          offerName: values.offerName,
          OfferType: values.offerType,
        });
        console.log(data);

        toast.success("Succesfully generated offer code", {
          position: toast.POSITION.TOP_RIGHT,
        });
        dataToReturn = data.data.offerCode;
      } catch (error) {
        console.log(error);
      }
      return dataToReturn;
    } else {
      toast.error("Check Form Values");
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <div className={classes.root}>
          <Paper elevation={0} style={{ backgroundColor: "transparent" }}>
            <div className={classes.paperPaddingRightLeft}>
              <div className="">
                <Paper elevation={0} style={{ backgroundColor: "transparent" }} className={classNames(classes.paperHeading)}>
                
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      // gap: "0.5rem",
                      flexWrap: "wrap",
                    }}
                  >
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", alignItems: "center" }}>
                      <div>
                        {" "}
                        <SearchBar
                          className={"heightfix  my-2 "}
                          style={{ borderRadius: "25px", width: "293px" }}
                          onChange={(searchVal) => SearchPromocode(searchVal)}
                          onCancelSearch={() => cancelSearch()}
                          placeholder="Search By Promocode Name"
                        />
                      </div>
                   
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
                      {" "}
                 
                   
                      <span style={{ fontSize: "18px", fontWeight: "700", whiteSpace: "nowrap" }}>
                        Filter By Service :
                      </span>{" "}
                  
                      <div className="customReactSelect" style={{ width: "150px", zIndex: 4 }}>
                        <RSelect
                          key={rselKey}
                          options={serviceOptions}
                          // defaultValue={{ label: "All", value: "" }}
                          isSearchable={false}
                          placeholder="Select"
                          value={serviceTypeFilter}
                          onChange={(e) => {
                            setServiceTypeFilter(e);
                            // getCategoriesContent(page, limit, search, e.value, userTypeFilter.value);
                          }}
                        />
                      </div>
                      {/* &emsp; */}
                      <span style={{ fontSize: "18px", fontWeight: "700", whiteSpace: "nowrap" }}>Filter By User :</span>
                      {/* &nbsp; */}
                      <div className="customReactSelect" style={{ width: "150px", zIndex: 4 }}>
                        <RSelect
                          key={rselKey}
                          options={userTypeOptions}
                          // defaultValue={{ label: "All", value: "" }}
                          isSearchable={false}
                          placeholder="Select"
                          value={userTypeFilter}
                          onChange={(e) => {
                            console.log(e);
                            setUserTypeFilter(e);
                            // getCategoriesContent(page, limit, search, serviceTypeFilter.value, e.value);
                          }}
                        />
                      </div>
                      {/* &emsp; */}
                      <Button
                        variant="contained"
                        className="buttoncss"
                        style={{ backgroundColor: "#0059cd", color: "#fff" }}
                        onClick={() => {
                          if (serviceTypeFilter.value !== "" && userTypeFilter.value !== "") {
                            getCategoriesContent(page, limit, search, serviceTypeFilter.value, userTypeFilter.value);
                          } else if (serviceTypeFilter.value !== "") {
                            getCategoriesContent(page, limit, search, serviceTypeFilter.value, userTypeFilter.value);
                            setUserTypeFilter({ label: "Select", value: "" });
                          } else if (userTypeFilter.value !== "") {
                            getCategoriesContent(page, limit, search, serviceTypeFilter.value, userTypeFilter.value);
                            setServiceTypeFilter({ label: "Select", value: "" });
                          } else {
                            getCategoriesContent();
                          }
                        }}
                      >
                        Apply
                      </Button>
                      {/* &emsp; */}
                      <Button
                        variant="contained"
                        className="buttoncss"
                        style={{ backgroundColor: "#0059cd", color: "#fff" }}
                        onClick={() => {
                          getCategoriesContent(1, 10, "", "", "");
                          setUserTypeFilter({ label: "Select", value: "" });
                          setServiceTypeFilter({ label: "Select", value: "" });
                        }}
                      >
                        RESET
                      </Button>
                      <Tooltip title={<span style={{ color: "white", fontSize: "16px" }}>Add Promocode</span>} arrow>
                        <IconButton
                          className="buttoncss"
                          style={{ backgroundColor: "#0059cd", color: "#fff" }}
                          onClick={() => {
                            // props.history.push({
                            //   pathname: "/adminPanel/AddEditPromocode",
                            // });
                            setSelectedPromoCodeData(null);
                            setModalState({ isAddEditPromoCode: true });
                          }}
                        >
                          <AddIcon />
                        </IconButton>
                      </Tooltip>
                    </div>
                  
                  </div>
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
                          <TableCell style={{ fontWeight: "bold" }}> Promocode Name</TableCell>
                          <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Service Type</TableCell>
                          <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Offer Code</TableCell>
                          <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Discount Type</TableCell>
                          <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Discount Amount</TableCell>
                          <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Minimum Ride Value</TableCell>
                          <TableCell
                            style={{
                              textAlign: "center",
                              fontWeight: "bold",
                            }}
                          >
                            Start Date
                          </TableCell>
                          <TableCell
                            style={{
                              textAlign: "center",
                              fontWeight: "bold",
                            }}
                          >
                            End Date
                          </TableCell>

                          <TableCell
                            style={{
                              textAlign: "center",
                              fontWeight: "bold",
                            }}
                          >
                            Status
                          </TableCell>
                          <TableCell
                            style={{
                              textAlign: "center",
                              fontWeight: "bold",
                            }}
                          >
                            Description
                          </TableCell>
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
                          // .slice(
                          //   page * rowsPerPage,
                          //   page * rowsPerPage + rowsPerPage
                          // )
                          // .reverse()
                          .map((category, index) => (
                            <TableRow hover key={index}>
                              <TableCell component="th" scope="row" className={classes.textMiddle}>
                                {index + 1 + page * rowsPerPage}
                              </TableCell>
                              <TableCell className={classes.textMiddle}>{get(category, "offerName", "N/A")}</TableCell>

                              <TableCell style={{ textAlign: "center" }}>
                                {serviceType.map((ele, i) =>
                                  ele._id === category?.serviceTypeId
                                    ? ele.title === "Taxi Single"
                                      ? "Single Taxi"
                                      : ele.title
                                    : false
                                )}
                              </TableCell>
                              <TableCell className={classes.textMiddle} style={{ textAlign: "center" }}>
                                {get(category, "offerCode", "N/A")}
                              </TableCell>
                              <TableCell className={classes.textMiddle} style={{ textAlign: "center" }}>
                                {/* <Switch
                                  checked={category.baseRate}
                                  onChange={(e) =>
                                    handleSwitchChange(e, category)
                                  }
                                /> */}
                                {/* <IOSSwitch
                                  onChange={(e) => {
                                    statusSwitch(e, category);
                                  }}
                                  checked={category.isActive}
                                /> */}
                                {category?.discountType == 0 ? "Flat" : "Percentage"}
                              </TableCell>
                              <TableCell className={classes.textMiddle} style={{ textAlign: "center" }}>
                                {get(category, "discountAmount", "N/A")}
                              </TableCell>
                              <TableCell className={classes.textMiddle} style={{ textAlign: "center" }}>
                                {get(category, "minimumOrderLimit", "N/A")}
                              </TableCell>
                              <TableCell className={classes.textMiddle} style={{ textAlign: "center" }}>
                                {category.startDate ? moment(category.startDate).format("DD/MM/YYYY") : "N/A"}
                                {/* {category.startDate
                                  ? new Date(category.startDate)
                                      // .toUTCString()
                                      .getUTCDate() +
                                    "/" +
                                    (new Date(category.startDate)
                                      // .toUTCString()
                                      .getUTCMonth() +
                                      1) +
                                    "/" +
                                    new Date(category.startDate)
                                      // .toUTCString()
                                      .getUTCFullYear()
                                  : // moment.utc(category.createdAt).format("L")
                                    "N/A"} */}
                              </TableCell>
                              <TableCell className={classes.textMiddle} style={{ textAlign: "center" }}>
                                {category.endDate ? moment(category.endDate).format("DD/MM/YYYY") : "N/A"}
                                {/* {category.endDate
                                  ? new Date(category.endDate)
                                      // .toUTCString()
                                      .getUTCDate() +
                                    "/" +
                                    (new Date(category.endDate)
                                      // .toUTCString()
                                      .getUTCMonth() +
                                      1) +
                                    "/" +
                                    new Date(category.endDate)
                                      // .toUTCString()
                                      .getUTCFullYear()
                                  : // moment.utc(category.createdAt).format("L")
                                    "N/A"} */}
                              </TableCell>
                              <TableCell className={classes.textMiddle} style={{ textAlign: "center" }}>
                                <Tooltip
                                  title={
                                    <span className="TooltipCustomSize">{`${
                                      category?.status == 1 ? "Active" : "Inactive"
                                    }`}</span>
                                  }
                                  arrow
                                >
                                  <Button>
                                    <IOSSwitch
                                      onChange={(e) => {
                                        statusSwitch(e, category);
                                      }}
                                      checked={category.status == 1 ? true : false}
                                    />
                                  </Button>
                                </Tooltip>
                                {/* {category?.status == 1 ? (
                                  <span
                                    style={{
                                      backgroundColor: "mediumseagreen",
                                      color: "white",
                                      padding: "7px 20px",
                                      borderRadius: "100px",
                                      boxShadow: "0 0.5em 1.5em -0.5em #14a73e98",
                                    }}
                                  >
                                    Active
                                  </span>
                                ) : (
                                  <span
                                    style={{
                                      backgroundColor: "red",
                                      color: "white",
                                      padding: "7px 20px",
                                      borderRadius: "100px",
                                      boxShadow: "0 0.5em 1.5em -0.5em #EE4B2B",
                                    }}
                                  >
                                    Inactive
                                  </span>
                                )} */}
                              </TableCell>
                              {/* <Tooltip title={showDesc ? "Click to View" : "Click to Hide"} arrow> */}
                              <TableCell
                                className={classes.textMiddle}
                                style={{
                                  textAlign: "center",
                                  whiteSpace: "nowrap",
                                  // whiteSpace: showDesc ? "nowrap" : "",
                                  // overflow: showDesc ? "hidden" : "",
                                  // textOverflow: showDesc ? "ellipsis" : "",
                                  // maxWidth: "200px",
                                  // cursor: "pointer",
                                }}
                                // onClick={() => {
                                //   setShowDescription(!showDesc);
                                // }}
                              >
                                {get(category, "description", "N/A").slice(0, 5)}...
                                <VisibilityIcon
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    setShowDescription({ ...showDesc, show: true, data: get(category, "description", "N/A") });
                                  }}
                                />
                              </TableCell>
                              {/* </Tooltip> */}

                              <TableCell className={classes.textMiddle} style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                                <Button
                                  onClick={() => {
                                    setSelectedPromoCodeData(category);
                                    setModalState({ isAddEditPromoCode: true });
                                  }}
                                  className="EditButton"
                                >
                                  <Tooltip title={<span className="TooltipCustomSize">Edit</span>} arrow>
                                    <EditIcon />
                                  </Tooltip>
                                </Button>
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
        <Dialog
          open={showDesc.show}
          // onClose={handleClose}
          className={""}
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
            onClick={() => setShowDescription({ ...showDesc, show: false, data: "" })}
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

            <div className="my-3">
              <h5 style={{ textAlign: "center" }}>Description</h5>
              <br />
              {showDesc.data}
              <br />
            </div>
            {/* </DialogContentText> */}
          </DialogContent>
        </Dialog>
      </div>

      {/* AddEdit promocode */}
      <Modal
        maxWidth="lg"
        width="840px"
        isOpen={modalState.isAddEditPromoCode}
        // onClose={() => {
        //   setModalState({
        //     isAddEditPromoCode: false,
        //   });
        //   setSelectedPromoCodeData(null);
        // }}
        onClose={(event, reason) => {
          if (reason && (reason === "backdropClick" || "escapeKeyDown")) {
            console.log(reason);
            setModalState({
              isAddEditPromoCode: true,
            });
          } else {
            setModalState({
              isAddEditPromoCode: false,
            });
            setSelectedPromoCodeData(null);
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
              {selectedPromoCodeData === null ? `Add PromoCode` : `Edit PromoCode`}
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
                    isAddEditPromoCode: false,
                  });
                  setSelectedPromoCodeData(null);
                }}
              />
            </div>
          </div>
        }
        content={
          <>
            <Formik
              validationSchema={!selectedPromoCodeData ? validationSchema : validationSchema2}
              initialValues={{
                // name: get(state, "title", ""),
                // file1: get(state, "icon", ""),
                serviceType: get(selectedPromoCodeData, "serviceTypeId", ""),
                offerType: get(selectedPromoCodeData, "OfferType", ""),
                offerName: get(selectedPromoCodeData, "offerName", ""),
                offerCode: get(selectedPromoCodeData, "offerCode", ""),
                discountAmount: get(selectedPromoCodeData, "discountAmount", ""),
                discountType: get(selectedPromoCodeData, "discountType", ""),
                startDate: !selectedPromoCodeData ? "" : new Date(selectedPromoCodeData.startDate),
                endDate: !selectedPromoCodeData ? "" : new Date(selectedPromoCodeData.endDate),
                userLimit: get(selectedPromoCodeData, "userLimit", ""),
                minimumOrderLimit: get(selectedPromoCodeData, "minimumOrderLimit", ""),
                description: get(selectedPromoCodeData, "description", ""),
                // description: get(state, "description", ""),
              }}
              onSubmit={(values) => {
                console.log(values);
                if (selectedPromoCodeData && selectedPromoCodeData !== null) {
                  EditPromocode(values);
                } else {
                  addNewPromocode(values);
                }
              }}
            >
              {({ values, setFieldValue }) => (
                <Form style={{ width: "100%" }}>
                  <div className="container ">
                    <div className="row my-4 justify-center">
                      <div className={"col-6 d-flex flex-column "}>
                        <div className="h5 ">Service Type</div>

                        <Field
                          name="serviceType"
                          as="select"
                          className="form-control"
                          style={{
                            // width: "90%",
                            height: "40px",
                            borderRadius: "5px",
                            border: "1px solid #ced4da",
                            padding: "0.5rem",
                            fontWeight: "bold",
                          }}
                        >
                          <option value="">Select Service Type</option>
                          {serviceType.map((ele, i) => (
                            <option key={i} value={ele._id}>
                              {ele.title === "Taxi Single" ? "Single Taxi" : ele.title}
                            </option>
                          ))}
                        </Field>
                        <KErrorMessage name="serviceType" />
                      </div>
                      <div className="col-6 d-flex flex-column " style={{}}>
                        <div className=" h5  ">Offer Type</div>

                        <Field
                          name="offerType"
                          as="select"
                          className="form-control"
                          style={{
                            // width: "90%",
                            height: "40px",
                            borderRadius: "5px",
                            border: "1px solid #ced4da",
                            padding: "0.5rem",
                            fontWeight: "bold",
                            cursor: !selectedPromoCodeData ? "" : "not-allowed",
                          }}
                          disabled={!selectedPromoCodeData ? false : true}
                        >
                          <option value="">Select Offer Type</option>
                          <option value="0">New User</option>
                          <option value="1">Existing User</option>
                        </Field>
                        <KErrorMessage name="offerType" />
                      </div>
                    </div>
                    {/* 1 */}
                    <div className="row my-4 justify-center ">
                      <div className="col-6 d-flex flex-column ">
                        <div className="h5 ">Offer Name</div>

                        <Field
                          name="offerName"
                          type="text"
                          className="form-control"
                          style={{
                            // width: "70%",
                            height: "40px",
                            borderRadius: "5px",
                            border: "1px solid #ced4da",
                            padding: "0.5rem",
                            fontWeight: "bold",
                          }}
                        />
                        <KErrorMessage name="offerName" />
                      </div>
                      <div className="col-6 d-flex flex-column ">
                        <div className="h5 ">Offer Code</div>

                        <div className="d-flex flex-row align-items-center">
                          {" "}
                          <Field
                            name="offerCode"
                            type="text"
                            className="form-control"
                            style={{
                              // width: "70%",
                              flex: 1,
                              height: "40px",
                              borderRadius: "5px",
                              border: "1px solid #ced4da",
                              padding: "0.5rem",
                              fontWeight: "bold",
                            }}
                            readOnly
                          />
                          <button
                            type="button"
                            onClick={() => {
                              generateOfferCode(values).then((res) => setFieldValue("offerCode", res));
                            }}
                            style={{
                              // width: "50%",
                              // height: "40px",
                              flex: 1,
                              borderRadius: "5px",
                              border: "1px solid #ced4da",
                              padding: "0.3rem",
                              // paddingRight: "0.5rem",
                              fontWeight: "bold",
                              fontSize: "16px",
                              backgroundColor:
                                values.serviceType && values.offerType && values.offerName ? "#0059cd" : "#c4c4c4",
                              color: "#fff",
                            }}
                            disabled={values.serviceType && values.offerType && values.offerName ? false : true}
                          >
                            Generate Code
                          </button>
                        </div>

                        <KErrorMessage name="offerCode" />
                      </div>
                    </div>
                    {/* 2 */}
                    <div className="row my-4 justify-center ">
                      <div className="col-6 d-flex flex-column ">
                        <div className="h5 ">Discount Type</div>

                        <Field
                          name="discountType"
                          as="select"
                          className="form-control"
                          style={{
                            // width: "70%",
                            height: "40px",
                            borderRadius: "5px",
                            border: "1px solid #ced4da",
                            padding: "0.5rem",
                            fontWeight: "bold",
                          }}
                        >
                          <option value="">Select Discount Type</option>
                          <option value="0">Flat</option>
                          <option value="1">Percentage</option>
                        </Field>
                        <KErrorMessage name="discountType" />
                      </div>
                      <div className="col-6 d-flex flex-column ">
                        <div className="h5 ">Discount Amount{values.discountType == "1" ? "(%)" : ""}</div>

                        <Field
                          name="discountAmount"
                          type="text"
                          className="form-control"
                          style={{
                            // width: "70%",
                            height: "40px",
                            borderRadius: "5px",
                            border: "1px solid #ced4da",
                            padding: "0.5rem",
                            fontWeight: "bold",
                          }}
                          // min={1}
                          // max={values.discountType == "1" ? 99 : 999999}
                        />
                        {console.log(values.discountType == "1")}
                        <KErrorMessage name="discountAmount" />
                      </div>
                    </div>
                    {/* 3 */}
                    <div className="row my-4 justify-center ">
                      <div className="col-6 d-flex flex-column  childDate">
                        <div className="h5 ">Start Date</div>

                        <DatePicker
                          minDate={new Date()}
                          value={values.startDate}
                          // value={startDate}
                          dateFormat="DD/MM/YYYY"
                          onChange={(date) => {
                            setStartDate(date);
                            setFieldValue("startDate", date);
                          }}
                          required
                        />
                        {/* <Field
                                  type="date"
                                  name="startDate"
                                  className="form-control"
                                  style={{
                                    width: "70%",
                                    height: "40px",
                                    borderRadius: "5px",
                                    border: "1px solid #ced4da",
                                    padding: "0.5rem",
                                  }}
                                /> */}
                      </div>
                      <div className="col-6 d-flex flex-column  childDate">
                        <div className="h5 ">End Date</div>

                        <DatePicker
                          disabled={!startDate ? true : false}
                          minDate={values.startDate}
                          value={values.endDate}
                          dateFormat="DD/MM/YYYY"
                          onChange={(date) => {
                            setEndDate(date);
                            setFieldValue("endDate", date);
                          }}
                          required
                        />
                        {/* <Field
                                  type="date"
                                  name="endDate"
                                  className="form-control"
                                  style={{
                                    width: "70%",
                                    height: "40px",
                                    borderRadius: "5px",
                                    border: "1px solid #ced4da",
                                    padding: "0.5rem",
                                  }}
                                  min={values.startDate}
                                />
                                {console.log(new Date(values.endDate))} */}
                      </div>
                    </div>
                    {/* 4 */}
                    <div className="row my-4 justify-center ">
                      <div className="col-6 d-flex flex-column ">
                        <div className="h5 ">No. of User Limit</div>

                        <Field
                          name="userLimit"
                          type="text"
                          className="form-control"
                          style={{
                            // width: "70%",
                            height: "40px",
                            borderRadius: "5px",
                            border: "1px solid #ced4da",
                            padding: "0.5rem",
                            fontWeight: "bold",
                            cursor: !selectedPromoCodeData ? "" : "not-allowed",
                          }}
                          disabled={!selectedPromoCodeData ? false : true}
                        />
                        <KErrorMessage name="userLimit" />
                      </div>
                      <div className="col-6 d-flex flex-column ">
                        <div className="h5 ">Minimum Ride Value </div>

                        <Field
                          name="minimumOrderLimit"
                          type="text"
                          className="form-control"
                          style={{
                            // width: "70%",
                            height: "40px",
                            borderRadius: "5px",
                            border: "1px solid #ced4da",
                            padding: "0.5rem",
                            fontWeight: "bold",
                          }}
                        />
                        <KErrorMessage name="minimumOrderLimit" />
                      </div>
                    </div>
                    <div className="row my-4 justify center">
                      <div className="col-12 d-flex flex-column">
                        <div className="h5">Description</div>
                        <Field
                          name="description"
                          // type="text"
                          as="textarea"
                          className="form-control"
                          style={{
                            // width: "70%",
                            height: "100px",
                            borderRadius: "5px",
                            border: "1px solid #ced4da",
                            padding: "0.5rem",
                            fontWeight: "bold",
                          }}
                        />
                        <div>
                          <span style={{ fontFamily: "'DM Sans', sans-serif", fontVariant: "small-caps" }}>
                            {values.description.length}/150
                          </span>
                        </div>
                        <KErrorMessage name="description" />
                      </div>
                    </div>
                    <br /> <br />
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
                          backgroundColor: "#0059cd",
                          color: "#fff",
                        }}
                      >
                        SAVE
                      </button>
                    </div>
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
