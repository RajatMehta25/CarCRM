import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import axios from "../../axios";
import { toast } from "react-toastify";
import AddIcon from "@material-ui/icons/Add";
import SearchIcon from "@material-ui/icons/Search";
// import Switch from '@mui/material/Switch';
// import { styled } from '@mui/material/styles';
// import Skeleton from "react-loading-skeleton";
// import "react-loading-skeleton/dist/skeleton.css";
import { Input, Modal } from "../../components/index";
import { Formik, Form, Field } from "formik";
import KErrorMessage from "./KErrorMessage";
import * as yup from "yup";
import { AiOutlineClose } from "react-icons/ai";
import { handleValidateManageFare } from "../../utils/validators";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import { EditOutlined, SaveAltOutlined, SaveOutlined, StoreMallDirectorySharp } from "@material-ui/icons";
// import InputRange from "react-input-range";
import Slider from "@material-ui/core/Slider";

import { get, max } from "lodash";
import RSelect from "react-select";
import { handleValidateAddEditPackageData } from "../../utils/validators";
import { useUploadImage } from "../../services/Imagecustomhook";

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
import Swal from "sweetalert2";
import "./ServiceManagement.css";
import PuffLoader from "react-spinners/PuffLoader";
import NoDataFound from "../../components/NoDataFound";
import Axios from "axios";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { ImageUploadUrl } from "../../statics/constants";

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
          backgroundColor: theme.palette.mode === "dark" ? "#2ECA45" : "#65C466",
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

export default function PackageManagement(props) {
  const classes = useStyles();
  const [puffLoader, setPuffLoader] = useState(false);
  //
  const [placeholderValue, setPlaceholderValue] = useState({
    min1: 0,
    max1: 0.8,
    min2: 0.9,
    max2: 1.3,
    min3: 1.4,
    max3: 1.5,
    min4: 1.6,
    max4: 3,
    min5: 3.1,
    max5: 4.5,
    min6: 4.6,
    max6: 10,
  });
  const [selectedLanguage, setSelectedLanguage] = useState({});
  const [value, setValue] = React.useState(0);

  const [VehicleData, setVehilceData] = useState([]);
  const [VehicleMutliValue, setVehicleMultiValue] = useState([]);
  const [val, setVal] = useState([0.2, 0.5]);
  const [val1, setVal1] = useState([0.1, 1.1]);
  const [val2, setVal2] = useState([1.4, 1.5]);

  const [val3, setVal3] = useState([1.7, 2]);
  const [val4, setVal4] = useState([3.2, 4]);
  const [val5, setVal5] = useState([4.7, 9]);
  const [editValue, setEdit] = useState({
    0: false,
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
    7: false,
  });
  const ActionOptions = [
    { label: "Manage Package Size & Price", value: "Manage Package Size & Price" },
    { label: "Manage Package Fare", value: "Manage Package Fare" },
  ];
  const [selectedActionsValue, setSelectedActionsValue] = useState();
  const { isSuccess, uploadForm, progress } = useUploadImage(`${ImageUploadUrl}/fileUpload`);

  const [modalState, setModalState] = useState({ isFarePackage: "" });
  const [selectedPackageData, setSelectedPackageData] = useState(null);
  const [showDropDown, setShowDropDown] = useState(false);
  const [displayManagePackageFare, setDisplayPackageFare] = useState(false);
  const [displayManagePackagePrice, setDisplayManagePackagePrice] = useState(false);
  // const history=useHistory();
  const [modalStatePackageCategory, setModalStatePackageCategory] = useState({ isAddEditPackageCategory: "" });
  const [selectedPackageCategoryData, setSelectedPackageCategoryData] = useState(null);
  const [tableData, setTableData] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

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
  // useEffect(() => {
  //   getPackageFare();
  // }, [modalState]);

  //get content
  const getCategoriesContent = async (page = 1, limit = 10, search = "") => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`/private/courierCategory?page=${page}&limit=${limit}&search=${search}`);
      console.log(data);
      setTableData([...data.data.docs]);
      //   setSearchedData(data.data.docs);
      setSearch(search);
      settotalUserListCount(data.data.totalDocs);
      setIsLoading(false);
      setSelectedLanguage(data.data.docs.reduce((a, c) => ((a[c._id] = { label: "English", value: "English" }), a), {}));
      console.log(
        "checkLanguagee",
        data.data.docs.reduce((a, c) => ((a[c._id] = { label: "English", value: "English" }), a), {})
      );
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

  const EditAttributeContent = (category) => {
    console.log(tableData);
    props.history.push({
      pathname: "/EditCategoryAttributes",
      state: category,
    });

    // delete category
  };
  const DeletePackage = async (category) => {
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
          `/private/courierCategory/${category._id}?status=delete`
          // , {
          // icon: category.icon,
          // title: category.title,
          // }
        );
        console.log(data);
        getCategoriesContent(page, limit, search);
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
    // try {
    //   if (window.confirm("Are you sure you want to delete this package category?")) {
    //     const { data } = await axios.delete(
    //       `/private/courierCategory/${category._id}?status=delete`
    //       // , {
    //       // icon: category.icon,
    //       // title: category.title,
    //       // }
    //     );
    //     console.log(data);
    //     getCategoriesContent(page, limit, search);
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
  };

  const BlockPackageCategory = async (id) => {
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
        const { data } = await axios.delete(`/private/courierCategory/${id}?status=block`);
        console.log(data);
        getCategoriesContent(page, limit, search);
        toast.success("Package Blocked", {
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

  const UnBlockPackageCategory = async (id) => {
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
        const { data } = await axios.delete(`/private/courierCategory/${id}?status=unblock`);
        console.log(data);
        getCategoriesContent(page, limit, search);
        toast.success("Package Unblocked", {
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
  const getPackageFare = async () => {
    setPuffLoader(true);
    try {
      const { data } = await axios.get(`/private/courier`);

      setSelectedPackageData(data.data);
      // let PackageSizeData;
      //PackageSizeData=data.data?.result?.docs
      //

      setVal([data.data?.result.docs[0].rangeStart, data.data?.result.docs[0].rangeEnd]);
      setVal1([data.data?.result.docs[1].rangeStart, data.data?.result.docs[1].rangeEnd]);
      setVal2([data.data?.result.docs[2].rangeStart, data.data?.result.docs[2].rangeEnd]);
      setVal3([data.data?.result.docs[3].rangeStart, data.data?.result.docs[3].rangeEnd]);
      setVal4([data.data?.result.docs[4].rangeStart, data.data?.result.docs[4].rangeEnd]);
      setVal5([data.data?.result.docs[5].rangeStart, data.data?.result.docs[5].rangeEnd]);
      console.log(data);
      setPuffLoader(false);
      setModalState({ isFarePackage: true });
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
  //
  const submitEach = async (values, key) => {
    switch (key) {
      case 0:
        try {
          console.log(values);
          const { data } = await axios.put(`/private/courier/${selectedPackageData?.result.docs[3]._id}`, {
            packagePrice: values.EnvelopePrice || selectedPackageData?.result.docs[3].EnvelopePrice,
            rangeStart: val3[0] || selectedPackageData?.result.docs[3].rangeStart,
            rangeEnd: val3[1] || selectedPackageData?.result.docs[3].rangeEnd,
          });
          toast.success(data.messages, {
            position: toast.POSITION.TOP_RIGHT,
          });
          // getData();

          console.log(data);
        } catch (error) {
          console.log(error);
        }
        break;
      case 1:
        try {
          const { data } = await axios.put(`/private/courier/${selectedPackageData?.result.docs[4]._id}`, {
            packagePrice: values.PakPrice || selectedPackageData?.result.docs[4].PakPrice,
            rangeStart: val4[0] || selectedPackageData?.result.docs[4].rangeStart,
            rangeEnd: val4[1] || selectedPackageData?.result.docs[4].rangeEnd,
          });
          toast.success(data.messages, {
            position: toast.POSITION.TOP_RIGHT,
          });
          // getData();
        } catch (error) {
          console.log(error);
        }
        break;
      case 2:
        try {
          const { data } = await axios.put(`/private/courier/${selectedPackageData?.result.docs[2]._id}`, {
            packagePrice: values.packagePriceSmall || selectedPackageData?.result.docs[2].packagePriceSmall,
            rangeStart: val2[0] || selectedPackageData?.result.docs[2].rangeStart,
            rangeEnd: val2[1] || selectedPackageData?.result.docs[2].rangeEnd,
          });
          toast.success(data.messages, {
            position: toast.POSITION.TOP_RIGHT,
          });
          // getData();
        } catch (error) {
          console.log(error);
        }
        break;
      case 3:
        try {
          const { data } = await axios.put(`/private/courier/${selectedPackageData?.result.docs[1]._id}`, {
            rangeStart: val1[0] || selectedPackageData?.result.docs[1].rangeStart,
            rangeEnd: val1[1] || selectedPackageData?.result.docs[1].rangeEnd,

            packagePrice: values.packagePriceMedium || selectedPackageData?.result.docs[1].packagePriceMedium,
          });
          toast.success(data.messages, {
            position: toast.POSITION.TOP_RIGHT,
          });
          // getData();
        } catch (error) {
          console.log(error);
        }
        break;
      case 4:
        try {
          const { data } = await axios.put(`/private/courier/${selectedPackageData?.result.docs[0]._id}`, {
            packagePrice: values.packagePriceLarge || selectedPackageData?.result.docs[0].packagePriceLarge,
            rangeStart: val[0] || selectedPackageData?.result.docs[0].rangeStart,
            rangeEnd: val[1] || selectedPackageData?.result.docs[0].rangeEnd,
          });
          toast.success(data.messages, {
            position: toast.POSITION.TOP_RIGHT,
          });
          // getData();
        } catch (error) {
          console.log(error);
        }
        break;

      case 5:
        try {
          const { data } = await axios.put(`/private/courier/${selectedPackageData?.result.docs[5]._id}`, {
            packagePrice: values.packagePriceExtraLarge || selectedPackageData?.result.docs[5].packagePriceExtraLarge,
            rangeStart: val5[0] || selectedPackageData?.result.docs[5].rangeStart,
            rangeEnd: val5[1] || selectedPackageData?.result.docs[5].rangeEnd,
          });
          toast.success(data.messages, {
            position: toast.POSITION.TOP_RIGHT,
          });
          // getData();
        } catch (error) {
          console.log(error);
        }
        break;
      case 6:
        try {
          const { data } = await axios.put(`/private/rideVehicleUpdate/62d53ae6bf652aa3778946d3`, {
            vehicleId: [...VehicleMutliValue.map((val) => val.value)],
            // "ajk",
            // values.timeRate || state.timeRate,
            // is_active: state.is_active,
          });
          console.log(data);
          toast.success("Success", {
            position: toast.POSITION.TOP_RIGHT,
          });
          // getData();
        } catch (error) {
          console.log(error);
        }
        break;
      case 7:
        try {
          const { data } = await axios.put(`/private/courier/${selectedPackageData?.result.docs[7]._id}`, {
            specialFees: values.specialFees,
          });
          toast.success(data.messages, {
            position: toast.POSITION.TOP_RIGHT,
          });
          // getData();
        } catch (error) {
          console.log(error);
        }
        break;
      default:
        break;
    }
  };
  const validationSchema = yup.object({
    distanceRate: yup
      .number()
      .min(0.1, "Min value 0.1.")
      .max(99999, "Max value is 99999")
      .typeError("Only Number Accepted")
      .required("Distance Rate is required"),
    adminCommission: yup
      .number()
      .typeError("Only Number Accepted")
      .min(0.1, "Min value 0.1.")
      .max(99, "Max value 99.")
      .required("Admin Commission is required"),
    cancellationFee: yup
      .number()
      .min(0.1, "Min value 0.1.")
      .max(99, "Max value 99")
      .typeError("Only Number Accepted")
      .required("Cancellation Fee is required"),
    timeRate: yup
      .number()
      .min(0.1, "Min value 0.1.")
      .typeError("Only Number Accepted")
      .max(99999, "Max value is 99999")
      .required("Time Rate is required"),
    maxRadius: yup.number().min(0.1, "Min value 0.1."),
    // .max(100, "Max value is 100")
    adminCancellationFee: yup.number().min(0.1, "Min value 0.1.").max(99, "Max value is 99"),
    EnvelopePrice: yup
      .number()
      .min(0.1, "Min value 0.1.")
      .max(99999, "Max value is 99999")
      .typeError("Only Number Accepted")
      .required("Envelope Price is required"),
    PakPrice: yup
      .number()
      .min(0.1, "Min value 0.1.")
      .max(99999, "Max value is 99999")
      .typeError("Only Number Accepted")
      .max(99999, "Max value is 99999")
      .required("Pak Prize is required"),

    packagePriceSmall: yup
      .number()
      .min(0.1, "Min value 0.1.")
      .max(99999, "Max value is 99999")
      .typeError("Only Number Accepted")
      .required("Small Box Price is required"),
    packagePriceMedium: yup
      .number()
      .min(0.1, "Min value 0.1.")
      .max(99999, "Max value is 99999")
      .typeError("Only Number Accepted")
      .required("Medium Box Price is required"),
    packagePriceLarge: yup
      .number()
      .min(0.1, "Min value 0.1.")
      .max(99999, "Max value is 99999")
      .typeError("Only Number Accepted")
      .required("Large Box is required"),
    packagePriceExtraLarge: yup
      .number()
      .min(0.1, "Min value 0.1.")
      .max(99999, "Max value is 99999")
      .typeError("Only Number Accepted")
      .required("EXtra Large Box is required"),
    specialFees: yup
      .number()
      .min(0.1, "Min value 0.1.")
      .typeError("Only Number Accepted")
      .max(99999, "Max value is 99999")
      .required("Special fee is required"),
  });
  const customStyles = {
    control: (provided) => ({
      ...provided,
      height: 45,
    }),
  };
  const EditFarePackage = async (values) => {
    try {
      console.log(values);

      const { data } = await axios.put(`/private/courierAdminFee/${selectedPackageData?.adminFee[0]._id}`, {
        distanceRate: values.distanceRate || selectedPackageData?.adminFee[0].distanceRate,
        adminCommission: values.adminCommission || selectedPackageData?.adminFee[0].adminCommission,
        cancellationFee: values.cancellationFee || selectedPackageData?.adminFee[0].cancellationFee,
        timeRate: values.timeRate || selectedPackageData?.adminFee[0].timeRate,
        maxRadius: values.maxRadius || selectedPackageData?.adminFee[0].maxRadius,
        adminCancellationFee: values.adminCancellationFee || selectedPackageData?.adminFee[0].adminCancellationFee,
        specialFees: values.specialFees || selectedPackageData?.adminFee[0].specialFees,
        // driverCancellationFee: values.driverCancellationFee || selectedPackageData?.adminFee[0].driverCancellationFee,
        // vehicleId: values.vehicleId || state.vehicleId,
      });
      setModalState({ isFarePackage: false });
      setShowDropDown(!showDropDown);
      toast.success(data.message, {
        position: toast.POSITION.TOP_RIGHT,
      });

      //  props.history.push({
      //    pathname: "/adminPanel/PackageManagement",
      //  });

      console.log(data);
    } catch (error) {
      // const errors = error.response.data.errors;
      console.log(error);
      // var err = {};
      // errors.map((e) => {
      //   err[e.param] = e.msg;
      // });
      //  toast.success(errors.messages, {
      //    position: toast.POSITION.TOP_RIGHT,
      //  });
    }
  };

  const imageVerificationAlert = (condition) => {
    if (condition) {
      Swal.fire({
        customClass: {
          container: "my_swal",
        },
        icon: "success",
        title: "Success.",
        text: "Image Dimensions Accepted!",
      });
    } else {
      Swal.fire({
        customClass: {
          container: "my_swal",
        },
        icon: "error",
        title: "Oops...",
        text: "Image Dimensions not Accepted!",
      });
    }
  };

  const addNewPackageCategoryImage = async (values) => {
    try {
      console.log(values);

      const { data } = await axios.post("/private/courierCategory", {
        title: values.name,
        icon: values.ImageLink,
        // description: values.description,
      });

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
  console.log(selectedPackageCategoryData);

  const EditPackageCategoryImage = async (values) => {
    console.log(values);
    if (selectedPackageCategoryData?.icon === values.ImageLink) {
      try {
        console.log(values);

        const { data } = await axios.put(`/private/courierCategory/${selectedPackageCategoryData._id}`, {
          icon: values.ImageLink,
          packageSizeStatus: values.packageSizeStatus,
          // title: values.name,
        });
        setSelectedPackageCategoryData(null);
        setModalStatePackageCategory({ isAddEditPackageCategory: false });

        console.log(data);
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        console.log(values);

        const { data } = await axios.put(`/private/courierCategory/${selectedPackageCategoryData._id}`, {
          icon: values.ImageLink,
          packageSizeStatus: values.packageSizeStatus,
          // title: values.name,
        });
        await DeleteImage();
        setSelectedPackageCategoryData(null);
        setModalStatePackageCategory({ isAddEditPackageCategory: false });

        console.log(data);
      } catch (error) {
        console.log(error);
      }
    }
  };
  const DeleteImage = async () => {
    let imageID = !selectedPackageCategoryData ? "" : selectedPackageCategoryData.icon.split("/")[3];
    console.log(imageID);
    try {
      const { data } = await Axios.get(`http://18.221.140.83:3000/fileDelete/${imageID}`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
    let checkEnglish = selectedPackageCategoryData?.languages.find((ele) => ele.lang === "en" || "English");
    let checkSpanish = selectedPackageCategoryData?.languages.find((ele) => ele.lang === "es" || "Spanish");
    let checkKorean = selectedPackageCategoryData?.languages.find((ele) => ele.lang === "ko" || "Korean");
    let checkChinese = selectedPackageCategoryData?.languages.find((ele) => ele.lang === "zh" || "Chinese");
    switch (newValue) {
      case 0:
        setSelectedLanguage((langs) => ({
          ...langs,
          [selectedPackageCategoryData._id]: { label: "English", value: "English" },
        }));

        break;
      case 1:
        setSelectedLanguage((langs) => ({
          ...langs,
          [selectedPackageCategoryData._id]: { label: "Spanish", value: "Spanish" },
        }));

        break;
      case 2:
        setSelectedLanguage((langs) => ({
          ...langs,
          [selectedPackageCategoryData._id]: { label: "Korean", value: "Korean" },
        }));

        break;
      case 3:
        setSelectedLanguage((langs) => ({
          ...langs,
          [selectedPackageCategoryData._id]: { label: "Chinese", value: "Chinese" },
        }));

        break;
      default:
        break;
    }
  };
  const updateLanguageData = async (values) => {
    console.log(values);

    try {
      const { data } = await axios.put(`/private/updateCourierCategoryLanguageUpdate`, {
        objectId: values.objectId,
        lang: values.lang,
        title: values.name,
      });
      toast.success(data.messages, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setModalStatePackageCategory({
        isAddEditPackageCategory: false,
      });
      setSelectedPackageCategoryData(null);
      getCategoriesContent();
    } catch (err) {
      console.log(err);
    }
  };

  const getTabValue = (value) => {
    switch (value) {
      case "English":
        return 0;
      case "Spanish":
        return 1;
      case "Korean":
        return 2;
      case "Chinese":
        return 3;

      default:
        break;
    }
  };
  const filterLanguageValue = (language) => {
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
        return "English";
    }
  };
  return (
    <React.Fragment>
      <div className="page-content">
        <div className={classes.root}>
          <Paper elevation={0} style={{ backgroundColor: "transparent" }}>
            <div className={classes.paperPaddingRightLeft}>
              <div className="">
                <div className=" my-3" style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap"}}>
                <SearchBar
                    className={"heightfix  "}
                    style={{ borderRadius: "25px" }}
                    onChange={(searchVal) => SearchPackage(searchVal)}
                    onCancelSearch={() => cancelSearch()}
                    placeholder="Search by Package Name"
                  />
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem" }}>
                    <Tooltip title={<span style={{ color: "white", fontSize: "16px" }}>Manage Fare</span>} arrow>
                      <Button
                        className="buttoncss"
                        style={{ backgroundColor: "#0059cd", color: "#fff" }}
                        onClick={() => {
                          setDisplayManagePackagePrice(false);
                          setDisplayPackageFare(true);

                          getPackageFare();
                        }}
                      >
                        <WidgetsOutlined />
                        &nbsp; Manage Package Fare
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
                          setDisplayManagePackagePrice(true);
                          setDisplayPackageFare(false);

                          getPackageFare();
                        }}
                      >
                        <WidgetsOutlined />
                        &nbsp; Manage Package Size & Price
                      </Button>
                    </Tooltip>
                  </div>
               
                </div>

                {/* //new design */}

                {/* <br /> */}

                {/* status end */}

                <Paper>
                  <TableContainer className={classes.container} style={{ minHeight: tableData.length > 0 ? "50vh" : "" }}>
                    <Table className={classes.table} stickyHeader size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell style={{ fontWeight: "bold" }}>Sr. No.</TableCell>
                          <TableCell style={{ fontWeight: "bold" }}> Package Name</TableCell>
                          <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Package Image</TableCell>

                          <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Actions</TableCell>
                          {/* <TableCell>User Type</TableCell>
                              <TableCell>Status</TableCell> */}
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {tableData.map((category, index) => (
                          <TableRow hover key={index}>
                            <TableCell component="th" scope="row" className={classes.textMiddle}>
                              {index + 1 + page * rowsPerPage}
                            </TableCell>
                            <TableCell className={classes.textMiddle}>
                              {/* {category.title ? category.title.charAt(0).toUpperCase() + category.title.slice(1) : "N/A"} */}
                              {
                                category?.languages.find(
                                  (ele) => filterLanguageValue(ele.lang) === selectedLanguage[category._id]?.value
                                )?.title
                              }
                            </TableCell>

                            <TableCell style={{ textAlign: "center" }}>
                              {category.icon ? (
                                <img src={category.icon} alt="image" style={{ width: "35px", height: "35px" }} />
                              ) : (
                                // <img
                                //   src={require("../../assets/images/logo/happyTaxi.png")}
                                //   alt="image"
                                //   style={{ width: "35px", height: "35px" }}
                                // />
                                "No Image"
                              )}
                            </TableCell>

                            <TableCell className={classes.textMiddle} style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                              <div className="mx-2" style={{ display: "inline-block", width: "150px" }}>
                                {" "}
                                <RSelect
                                  placeholder="Language"
                                  isSearchable={false}
                                  options={category?.languages.map((ele) => ({
                                    label: filterLanguageValue(ele.lang),
                                    value: filterLanguageValue(ele.lang),
                                  }))}
                                  value={selectedLanguage[category._id]}
                                  onChange={(e) => {
                                    setSelectedLanguage((langs) => ({ ...langs, [category._id]: e }));
                                    // setTabValue(e.value);
                                  }}
                                />
                              </div>
                              {category?.title == "other" ? (
                                <Button disabled={true}></Button>
                              ) : (
                                <Button
                                  onClick={() => {
                                    setSelectedPackageCategoryData(category);
                                    setModalStatePackageCategory({ isAddEditPackageCategory: true });
                                  }}
                                  className="EditButton"
                                >
                                  <Tooltip title={<span className="TooltipCustomSize">Manage</span>} arrow>
                                    <EditIcon />
                                  </Tooltip>
                                </Button>
                              )}
                              <Button
                                className={`${category.isBlock === "block" ? "BlockedButton mx-2" : "BlockButton mx-2"}`}
                                onClick={() =>
                                  category.isBlock === "block"
                                    ? UnBlockPackageCategory(category._id)
                                    : BlockPackageCategory(category._id)
                                }
                              >
                                <Tooltip title={<span className="TooltipCustomSize">Block / Unblock</span>} arrow>
                                  <BlockIcon />
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
      </div>
      {/* Fare Package*/}
      <Modal
        maxWidth="lg"
        width="840px"
        isOpen={modalState.isFarePackage}
        // onClose={() => {
        //   setModalState({
        //     isFarePackage: false,
        //   });
        //   setSelectedPackageData(null);
        //   setShowDropDown(!showDropDown);
        // }}
        onClose={(event, reason) => {
          if (reason && (reason === "backdropClick" || "escapeKeyDown")) {
            console.log(reason);
            setModalState({
              isFarePackage: true,
            });
          } else {
            setModalState({
              isFarePackage: false,
            });
            setSelectedPackageData(null);
            setShowDropDown(!showDropDown);
            setSelectedActionsValue("");
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
              {displayManagePackagePrice ? "Manage Package Size & Price" : "Manage Package Fare"}
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
                    isFarePackage: false,
                  });
                  setSelectedPackageData(null);
                  setShowDropDown(!showDropDown);
                }}
              />
            </div>
          </div>
        }
        content={
          <>
            <Formik
              validationSchema={validationSchema}
              initialValues={{
                EnvelopeSize: selectedPackageData?.result.docs[3].packageSize,
                EnvelopePrice: selectedPackageData?.result.docs[3].packagePrice,
                Pak: selectedPackageData?.result.docs[4].packageSize,
                PakPrice: selectedPackageData?.result.docs[4].packagePrice,
                packageSizeSmall: selectedPackageData?.result.docs[2].packageSize,
                packagePriceSmall: selectedPackageData?.result.docs[2].packagePrice,

                packageSizeMedium: selectedPackageData?.result.docs[1].packageSize,
                packagePriceMedium: selectedPackageData?.result.docs[1].packagePrice,

                packageSizeLarge: selectedPackageData?.result.docs[0].packageSize,
                packagePriceLarge: selectedPackageData?.result.docs[0].packagePrice,

                packageSizeExtraLarge: selectedPackageData?.result.docs[5].packageSize,
                packagePriceExtraLarge: selectedPackageData?.result.docs[5].packagePrice,

                //adminfare
                distanceRate: selectedPackageData?.adminFee[0]?.distanceRate,

                // distanceRate: get(state, "distanceRate", ""),
                adminCommission: get(selectedPackageData?.adminFee[0], "adminCommission", ""),
                cancellationFee: get(selectedPackageData?.adminFee[0], "cancellationFee", ""),
                timeRate: get(selectedPackageData?.adminFee[0], "timeRate", ""),
                maxRadius: get(selectedPackageData?.adminFee[0], "maxRadius", ""),
                // driverCancellationFee: get(state?.adminFee[0], "driverCancellationFee"),
                adminCancellationFee: get(selectedPackageData?.adminFee[0], "adminCancellationFee", ""),
                specialFees: get(selectedPackageData?.adminFee[0], "specialFees", ""),
              }}
              // validate={(values) => handleValidateManageFare(values)}

              onSubmit={(values) => {
                console.log(values);
                if (selectedPackageData !== null) {
                  EditFarePackage(values);
                } else {
                  // addNewTaxiSingle(values);
                  console.log("gadbad");
                }
              }}
            >
              {({ values, setFieldValue, errors }) => (
                <Form style={{ width: "100%" }}>
                  {console.log(errors)}
                  <div className="container my-5">
                    {displayManagePackagePrice ? (
                      <>
                        <div className="row">
                          <div className="col-4">
                            <span
                              style={{
                                fontSize: "16px",
                                fontWeight: "bold",
                              }}
                            >
                              Package Size
                            </span>
                          </div>
                          <div className="col-4">
                            <span
                              style={{
                                fontSize: "16px",
                                fontWeight: "bold",
                              }}
                            >
                              {" "}
                              Range<span style={{ color: "brown", fontWeight: "bold" }}>(in cubic feet)</span>
                            </span>
                          </div>
                          <div className="col-3">
                            <span
                              style={{
                                fontSize: "16px",
                                fontWeight: "bold",
                              }}
                            >
                              Package Price<span style={{ color: "#85BB65", fontWeight: "bold" }}>(USD)</span>
                            </span>
                          </div>
                        </div>

                        <div className="row align-items-center">
                          <div className="col-8 d-flex align-items-center">
                            {" "}
                            <Field className="FarePackageFieldSize" name="EnvelopeSize" type="text" readOnly />
                            {/* <InputRange
                              step={0.1}
                              formatLabel={(value) => value}
                              draggableTrack={false}
                              allowSameValues={false}
                              maxValue={placeholderValue.max1}
                              minValue={placeholderValue.min1}
                              value={val3}
                              onChange={setVal3}
                              onChangeComplete={(args) => console.log(args)}
                            /> */}
                            <Slider
                              step={0.1}
                              min={0}
                              max={0.8}
                              value={val3}
                              onChange={(e, val3) => setVal3(val3)}
                              valueLabelDisplay="auto"
                              aria-labelledby="range-slider"
                              // getAriaValueText={valuetext}
                            />
                          </div>

                          <div className="col-2 d-flex flex-column">
                            <Field
                              className="FarePackageFieldPrice"
                              name="EnvelopePrice"
                              type="text"
                              readOnly={editValue[0] ? false : true}
                            />
                            <KErrorMessage name="EnvelopePrice" />
                          </div>
                          <div className="col-2 d-flex">
                            <button
                              type="button"
                              className="FarePackageSmallEditButton"
                              style={{}}
                              onClick={() => {
                                setEdit({
                                  ...editValue,
                                  0: true,
                                });
                              }}
                            >
                              <EditIcon />
                            </button>
                            {editValue[0] ? (
                              <button
                                type="button"
                                className="FarePackageSmallSaveButton"
                                style={{}}
                                onClick={() => {
                                  submitEach(values, 0);
                                  setEdit({
                                    ...editValue,
                                    0: false,
                                  });
                                }}
                              >
                                <SaveOutlined />
                              </button>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>

                        <div className="row align-items-center">
                          <div className="col-8 d-flex align-items-center ">
                            {" "}
                            <Field className="FarePackageFieldSize" name="Pak" type="text" readOnly />
                            {/* <InputRange
                              step={0.1}
                              formatLabel={(value) => value}
                              draggableTrack={false}
                              allowSameValues={false}
                              maxValue={placeholderValue.max2}
                              minValue={placeholderValue.min2}
                              value={val4}
                              onChange={setVal4}
                              onChangeComplete={(args) => console.log(args)}
                            /> */}
                            <Slider
                              step={0.1}
                              min={0.9}
                              max={1.3}
                              value={val4}
                              onChange={(e, val4) => setVal4(val4)}
                              valueLabelDisplay="auto"
                              aria-labelledby="range-slider"
                              // getAriaValueText={valuetext}
                            />
                          </div>
                          <div className="col-2 d-flex flex-column">
                            <Field
                              className="FarePackageFieldPrice"
                              name="PakPrice"
                              type="text"
                              readOnly={editValue[1] ? false : true}
                            />
                            <KErrorMessage name="PakPrice" />
                          </div>
                          <div className="col-2 d-flex ">
                            <button
                              type="button"
                              className="FarePackageSmallEditButton"
                              onClick={() => {
                                setEdit({ ...editValue, 1: true });
                              }}
                            >
                              <EditIcon />
                            </button>
                            {editValue[1] ? (
                              <button
                                type="button"
                                className="FarePackageSmallSaveButton"
                                onClick={() => {
                                  submitEach(values, 1);
                                  setEdit({ ...editValue, 1: false });
                                }}
                              >
                                <SaveOutlined />
                              </button>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>

                        <div className="row align-items-center">
                          <div className="col-8 d-flex align-items-center">
                            {" "}
                            <Field className="FarePackageFieldSize" name="packageSizeSmall" type="text" readOnly />
                            {/* <InputRange
                              step={0.1}
                              formatLabel={(value) => value}
                              draggableTrack={false}
                              allowSameValues={false}
                              maxValue={placeholderValue.max3}
                              minValue={placeholderValue.min3}
                              value={val2}
                              onChange={setVal2}
                              onChangeComplete={(args) => console.log(args)}
                            /> */}
                            <Slider
                              step={0.01}
                              min={1.4}
                              max={1.5}
                              value={val2}
                              onChange={(e, val2) => setVal2(val2)}
                              valueLabelDisplay="auto"
                              aria-labelledby="range-slider"
                              // getAriaValueText={valuetext}
                            />
                          </div>
                          <div className="col-2 d-flex flex-column">
                            <Field
                              className="FarePackageFieldPrice"
                              name="packagePriceSmall"
                              type="text"
                              readOnly={editValue[2] ? false : true}
                            />
                            <KErrorMessage name="packagePriceSmall" />
                          </div>
                          <div className="col-2 d-flex">
                            <button
                              type="button"
                              className="FarePackageSmallEditButton"
                              onClick={() => {
                                setEdit({ ...editValue, 2: true });
                              }}
                            >
                              <EditIcon />
                            </button>
                            {editValue[2] ? (
                              <button
                                type="button"
                                className="FarePackageSmallSaveButton"
                                onClick={() => {
                                  submitEach(values, 2);
                                  setEdit({ ...editValue, 2: false });
                                }}
                              >
                                <SaveOutlined />
                              </button>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>

                        <div className="row align-items-center">
                          <div className="col-8 d-flex align-items-center">
                            {" "}
                            <Field className="FarePackageFieldSize" name="packageSizeMedium" type="text" readOnly />
                            {/* <InputRange
                              step={0.1}
                              formatLabel={(value) => value}
                              draggableTrack={false}
                              allowSameValues={false}
                              maxValue={placeholderValue.max4}
                              minValue={placeholderValue.min4}
                              value={val1}
                              onChange={setVal1}
                              onChangeComplete={(args) => console.log(args)}
                            /> */}
                            <Slider
                              step={0.1}
                              min={1.6}
                              max={3}
                              value={val1}
                              onChange={(e, val1) => setVal1(val1)}
                              valueLabelDisplay="auto"
                              aria-labelledby="range-slider"
                              // getAriaValueText={valuetext}
                            />
                          </div>
                          <div className="col-2 d-flex flex-column">
                            <Field
                              className="FarePackageFieldPrice"
                              name="packagePriceMedium"
                              type="text"
                              readOnly={editValue[3] ? false : true}
                            />
                            <KErrorMessage name="packagePriceMedium" />
                          </div>
                          <div className="col-2 d-flex">
                            <button
                              type="button"
                              className="FarePackageSmallEditButton"
                              onClick={() => {
                                setEdit({ ...editValue, 3: true });
                              }}
                            >
                              <EditIcon />
                            </button>
                            {editValue[3] ? (
                              <button
                                type="button"
                                className="FarePackageSmallSaveButton"
                                onClick={() => {
                                  setEdit({ ...editValue, 3: false });
                                  submitEach(values, 3);
                                }}
                              >
                                <SaveOutlined />
                              </button>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>

                        <div className="row align-items-center">
                          <div className="col-8 d-flex align-items-center">
                            {" "}
                            <Field className="FarePackageFieldSize" name="packageSizeLarge" type="text" readOnly />
                            {/* <InputRange
                              step={0.1}
                              formatLabel={(value) => value}
                              draggableTrack={false}
                              allowSameValues={false}
                              maxValue={placeholderValue.max5}
                              minValue={placeholderValue.min5}
                              value={val}
                              onChange={setVal}
                              onChangeComplete={(args) => console.log(args)}
                            /> */}
                            <Slider
                              step={0.1}
                              min={3.1}
                              max={4.5}
                              value={val}
                              onChange={(e, val) => setVal(val)}
                              valueLabelDisplay="auto"
                              aria-labelledby="range-slider"
                              // getAriaValueText={valuetext}
                            />
                          </div>
                          <div className="col-2 d-flex flex-column">
                            <Field
                              className="FarePackageFieldPrice"
                              name="packagePriceLarge"
                              type="text"
                              readOnly={editValue[4] ? false : true}
                            />
                            <KErrorMessage name="packagePriceLarge" />
                          </div>
                          <div className="col-2 d-flex">
                            <button
                              type="button"
                              className="FarePackageSmallEditButton"
                              onClick={() => {
                                setEdit({ ...editValue, 4: true });
                              }}
                            >
                              <EditIcon />
                            </button>
                            {editValue[4] ? (
                              <button
                                type="button"
                                className="FarePackageSmallSaveButton"
                                onClick={() => {
                                  submitEach(values, 4);
                                  setEdit({ ...editValue, 4: false });
                                }}
                              >
                                <SaveOutlined />
                              </button>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                        {/* xl */}

                        <div className="row align-items-center">
                          <div className="col-8 d-flex align-items-center">
                            {" "}
                            <Field className="FarePackageFieldSize" name="packageSizeExtraLarge" type="text" readOnly />
                            {/* <InputRange
                              step={0.1}
                              formatLabel={(value) => value}
                              draggableTrack={false}
                              allowSameValues={false}
                              maxValue={placeholderValue.max6}
                              minValue={placeholderValue.min6}
                              value={val5}
                              onChange={setVal5}
                              onChangeComplete={(args) => console.log(args)}
                            /> */}
                            <Slider
                              step={0.1}
                              min={4.6}
                              max={10}
                              value={val5}
                              onChange={(e, val5) => setVal5(val5)}
                              valueLabelDisplay="auto"
                              aria-labelledby="range-slider"

                              // getAriaValueText={valuetext}
                            />
                          </div>
                          <div className="col-2 d-flex flex-column">
                            <Field
                              className="FarePackageFieldPrice"
                              name="packagePriceExtraLarge"
                              type="text"
                              readOnly={editValue[5] ? false : true}
                            />
                            <KErrorMessage name="packagePriceExtraLarge" />
                          </div>
                          <div className="col-2 d-flex">
                            <button
                              type="button"
                              className="FarePackageSmallEditButton"
                              onClick={() => {
                                setEdit({ ...editValue, 5: true });
                              }}
                            >
                              <EditIcon />
                            </button>
                            {editValue[5] ? (
                              <button
                                type="button"
                                className="FarePackageSmallSaveButton"
                                onClick={() => {
                                  submitEach(values, 5);
                                  setEdit({ ...editValue, 5: false });
                                }}
                              >
                                <SaveOutlined />
                              </button>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                        {/* <div className="row align-items-center my-4">
                          <div className="col-4 d-flex align-items-center">
                            <div
                              style={{
                                fontSize: "16px",

                                fontWeight: "bold",
                              }}
                            >
                              Special Fees<span style={{ color: "#85BB65", fontWeight: "bold" }}>(USD)</span>:
                            </div>
                          </div>
                          <div className="col-4  align-items-center">
                            <Field
                              className="FareSpecialFees"
                              name="specialFees"
                              type="text"
                              readOnly={editValue[7] ? false : true}
                            />
                            <KErrorMessage name="specialFees" />
                          </div>
                          <div className="col-4 d-flex">
                            <button
                              type="button"
                              className="FarePackageSmallEditButton"
                              style={{ marginBottom: "0px" }}
                              onClick={() => {
                                setEdit({ ...editValue, 7: true });
                              }}
                            >
                              <EditIcon />
                            </button>
                            {editValue[7] ? (
                              <button
                                type="button"
                                className="FarePackageSmallSaveButton"
                                style={{ marginBottom: "0px" }}
                                onClick={() => {
                                  submitEach(values, 7);
                                  setEdit({ ...editValue, 7: false });
                                }}
                              >
                                <SaveOutlined />
                              </button>
                            ) : (
                              ""
                            )}
                          </div>
                        </div> */}
                      </>
                    ) : (
                      false
                    )}
                    {displayManagePackageFare ? (
                      <>
                        <div className="row my-2">
                          <div className="col-6 d-flex flex-column ">
                            <span
                              style={{
                                fontSize: "16px",
                                fontWeight: "bold",
                              }}
                            >
                              Distance Rate<span style={{ color: "brown", fontWeight: "bold" }}>(per mile)</span>
                              <span style={{ color: "#85BB65", fontWeight: "bold" }}>(USD)</span>:
                            </span>
                            <Field className="FarePackageFieldPrice" name="distanceRate" type="text" />
                            <KErrorMessage name="distanceRate" />
                          </div>
                          <div className="col-6 d-flex flex-column">
                            <span
                              style={{
                                fontSize: "16px",
                                fontWeight: "bold",
                              }}
                            >
                              Time Rate<span style={{ color: "brown", fontWeight: "bold" }}>(per min)</span>
                              <span style={{ color: "#85BB65", fontWeight: "bold" }}>(USD)</span>:
                            </span>
                            <Field className="FarePackageFieldPrice" name="timeRate" type="text" />
                            <KErrorMessage name="timeRate" />
                          </div>
                        </div>
                        <div className="row my-2">
                          <div className="col-6 d-flex flex-column ">
                            <span
                              style={{
                                fontSize: "16px",
                                fontWeight: "bold",
                              }}
                            >
                              Maximum Radius<span style={{ color: "brown", fontWeight: "bold" }}>(miles)</span>:
                            </span>
                            <Field className="FarePackageFieldPrice" name="maxRadius" type="text" />
                            <KErrorMessage name="maxRadius" />
                          </div>

                          <div className="col-6 d-flex flex-column">
                            <span
                              style={{
                                fontSize: "16px",
                                fontWeight: "bold",
                              }}
                            >
                              Admin Commission<span style={{ color: "#e3941e", fontWeight: "bold" }}>(in %)</span>:
                            </span>
                            <Field className="FarePackageFieldPrice" name="adminCommission" type="text" />
                            <KErrorMessage name="adminCommission" />
                          </div>
                        </div>

                        <div className="row my-2">
                          <div className="col-6 d-flex flex-column">
                            <span
                              style={{
                                fontSize: "16px",
                                fontWeight: "bold",
                              }}
                            >
                              Total Cancellation Fee<span style={{ color: "#e3941e", fontWeight: "bold" }}>(in %)</span>:
                            </span>
                            <Field className="FarePackageFieldPrice" name="cancellationFee" type="text" />
                            <KErrorMessage name="cancellationFee" />
                          </div>
                          <Tooltip
                            title={
                              <span style={{ fontSize: "20px" }}>
                                eg. if total cancellation fee(in%)=20 then admin cancellation fee= X% of 20
                              </span>
                            }
                            arrow
                          >
                            <div className="col-6 d-flex flex-column">
                              <span
                                style={{
                                  fontSize: "16px",
                                  fontWeight: "bold",
                                }}
                              >
                                Admin Cancellation Fee<span style={{ color: "#e3941e", fontWeight: "bold" }}>(in %)</span>:
                              </span>
                              <Field className="FarePackageFieldPrice" name="adminCancellationFee" type="text" />
                              <KErrorMessage name="adminCancellationFee" />
                            </div>
                          </Tooltip>
                        </div>
                        <div className="row align-items-center my-2">
                          <div className="col-6 d-flex flex-column">
                            <div
                              style={{
                                fontSize: "16px",

                                fontWeight: "bold",
                              }}
                            >
                              Special Fees<span style={{ color: "#85BB65", fontWeight: "bold" }}>(USD)</span>:
                            </div>

                            <Field className="FareSpecialFees" name="specialFees" type="text" />
                            <KErrorMessage name="specialFees" />
                          </div>
                        </div>
                      </>
                    ) : (
                      false
                    )}
                  </div>
                  {displayManagePackageFare ? (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <button type="submit" className="SaveButton buttoncss">
                        SAVE
                      </button>
                    </div>
                  ) : (
                    false
                  )}
                </Form>
              )}
            </Formik>
          </>
        }
      />

      {/* AddEdit package Category */}
      <Modal
        maxWidth="lg"
        width="840px"
        isOpen={modalStatePackageCategory.isAddEditPackageCategory}
        onClose={(event, reason) => {
          if (reason && (reason === "backdropClick" || "escapeKeyDown")) {
            console.log(reason);
            setModalStatePackageCategory({
              isAddEditPackageCategory: true,
            });
          } else {
            setModalStatePackageCategory({
              isAddEditPackageCategory: false,
            });
            setSelectedPackageCategoryData(null);
          }
        }}
        backgroundModal={false}
        backgroundModalContent={false}
        title={
          <div>
            <div
              className="my-3"
              style={{ textAlign: "center", fontWeight: "bold", fontSize: "22px", fontFamily: "'DM Sans', sans-serif" }}
            >
              {selectedPackageCategoryData === null ? "Add Package" : "Edit Package"}
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
                  setModalStatePackageCategory({
                    isAddEditPackageCategory: false,
                  });
                  setSelectedPackageCategoryData(null);
                }}
              />
            </div>
          </div>
        }
        content={
          <>
            {console.log(selectedPackageCategoryData)}
            <Formik
              enableReinitialize
              key={selectedLanguage}
              // validationSchema={validationSchema}
              initialValues={{
                // isActive: get(selectedBannerData, "isActive", ""),
                name: selectedPackageCategoryData?.languages.find(
                  (ele) => filterLanguageValue(ele.lang) === selectedLanguage[selectedPackageCategoryData._id]?.value
                )?.title,

                file1: "",
                ImageLink: get(selectedPackageCategoryData, "icon", ""),
                objectId: get(selectedPackageCategoryData, "_id", ""),
                // languageObjectId: selectedPackageCategoryData?.languages.find(
                //   (ele) => filterLanguageValue(ele.lang) === selectedLanguage[selectedPackageCategoryData._id]?.value
                // )?._id,
                lang: selectedPackageCategoryData?.languages.find(
                  (ele) => filterLanguageValue(ele.lang) === selectedLanguage[selectedPackageCategoryData._id]?.value
                )?.lang,
                packageSizeStatus: get(selectedPackageCategoryData, "packageSizeStatus", "0"),
                // description: get(selectedBannerData, "description", ""),
              }}
              validate={(values) => handleValidateAddEditPackageData(values, selectedPackageCategoryData)}
              onSubmit={(values) => {
                console.log(values);
                if (selectedPackageCategoryData !== null) {
                  EditPackageCategoryImage(values);
                  updateLanguageData(values);
                  // EditBannerImage(values);
                  // EditTaxiSingle(values);
                } else {
                  addNewPackageCategoryImage(values);
                  // addNewBanner(values);
                  // addNewTaxiSingle(values);
                  console.log("gadbad");
                }
              }}
            >
              {(formikBag) => (
                <Form style={{ width: "100%" }}>
                  <div className="container">
                    <div className="row mt-2 mb-5 justify-content-center">
                      {selectedPackageCategoryData !== null ? (
                        <Tabs
                          value={getTabValue(selectedLanguage[selectedPackageCategoryData._id].value)}
                          onChange={handleChange}
                          indicatorColor="primary"
                          textColor="primary"
                          centered
                        >
                          <Tab label="English" />
                          <Tab label="Spanish" />
                          <Tab label="Korean" />
                          <Tab label="Chinese" />
                        </Tabs>
                      ) : (
                        false
                      )}
                    </div>
                    <div className="row my-3">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label>Package Name :</label>
                          <Field name="name">
                            {({ field }) => (
                              <Input
                                {...field}
                                type="text"
                                onChange={(e) => {
                                  formikBag.setFieldValue("name", e.target.value);
                                }}
                                error={formikBag.touched.name && formikBag.errors.name ? formikBag.errors.name : null}
                                className="form-control"
                                placeholder={"Enter Package Name"}
                              />
                            )}
                          </Field>
                        </div>
                        <div className="">
                          <label>
                            Package Image<span style={{ color: "#85BB65", fontWeight: "bold" }}>(145x145)</span>:
                          </label>
                          <Field name="file1">
                            {({ field }) => (
                              <Input
                                {...field}
                                type="file"
                                value={undefined}
                                accept="image/png, image/jpeg , image/jpg"
                                onChange={async (e) => {
                                  const [file] = e.target.files;
                                  console.log(file);
                                  if (file) {
                                    const img = new Image();
                                    console.log(URL.createObjectURL(file));
                                    img.src = URL.createObjectURL(file);
                                    img.onload = async () => {
                                      if (img.width === 145 && img.height === 145) {
                                        imageVerificationAlert(true);
                                        let data = await uploadForm(file);
                                        formikBag.setFieldValue("file1", file);
                                        formikBag.setFieldValue("ImageLink", data);
                                      } else {
                                        imageVerificationAlert(false);
                                        formikBag.setFieldValue("file1", "");
                                        formikBag.setFieldValue("ImageLink", "");
                                      }
                                    };
                                  }
                                }}
                                error={
                                  formikBag.touched.ImageLink && formikBag.errors.ImageLink ? formikBag.errors.ImageLink : null
                                }
                                className="form-control"
                                placeholder={"Enter Package Image"}
                              />
                            )}
                          </Field>
                        </div>
                      </div>
                      <div className="col-md-6 mt-3 d-flex justify-content-center align-items-center">
                        {/* <label>Preview:</label> */}
                        <Field name="ImageLink">
                          {({ field }) => (
                            <>
                              <img
                                {...field}
                                alt="pet image"
                                src={formikBag.values.ImageLink}
                                style={{
                                  width: 240,
                                  height: 140,
                                }}
                                // error={
                                //   formikBag.touched.description && formikBag.errors.description
                                //     ? formikBag.errors.description
                                //     : null
                                // }
                                className="form-control"
                                // placeholder={"Enter Description"}
                              />
                            </>
                          )}
                        </Field>
                      </div>
                    </div>

                    <div className="row my-4">
                      <div className="col-6 ">
                        {" "}
                        <label>Include Package Size :</label>
                      </div>
                      <div className="col-6 d-flex align-items-center justify-content-center">
                        <label className="mb-0">Yes </label>&emsp;
                        <Field name="packageSizeStatus">
                          {({ field }) => (
                            <Input
                              {...field}
                              style={{ width: "1.5rem", height: "1.5rem" }}
                              name="packageSizeStatus"
                              value="1"
                              checked={field.value == "1"}
                              type="radio"
                              onChange={(e) => {
                                formikBag.setFieldValue(field.name, e.target.value);
                              }}
                              error={
                                formikBag.touched.packageSizeStatus && formikBag.errors.packageSizeStatus
                                  ? formikBag.errors.packageSizeStatus
                                  : null
                              }
                              className="form-control"
                            />
                          )}
                        </Field>
                        &emsp;
                        <label className="mb-0">No </label>&emsp;
                        <Field name="packageSizeStatus">
                          {({ field }) => (
                            <Input
                              {...field}
                              style={{ width: "1.5rem", height: "1.5rem" }}
                              name="packageSizeStatus"
                              value="0"
                              checked={field.value == "0"}
                              type="radio"
                              onChange={(e) => {
                                formikBag.setFieldValue(field.name, e.target.value);
                              }}
                              error={
                                formikBag.touched.packageSizeStatus && formikBag.errors.packageSizeStatus
                                  ? formikBag.errors.packageSizeStatus
                                  : null
                              }
                              className="form-control"
                            />
                          )}
                        </Field>
                      </div>
                    </div>

                    {/* <div className="row my-3">
                      <div className="col-md-6">
                     
                      </div>
                    </div> */}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <button type="submit" className="SaveButton buttoncss">
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
