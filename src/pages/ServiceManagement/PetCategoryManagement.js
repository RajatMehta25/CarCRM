import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import axios from "../../axios";
import { toast } from "react-toastify";
import AddIcon from "@material-ui/icons/Add";
import SearchIcon from "@material-ui/icons/Search";
import { Input, Modal } from "../../components/index";
import { Formik, Form, Field } from "formik";
import { AiOutlineClose } from "react-icons/ai";
import { handleValidateAddEditPetData } from "../../utils/validators";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import { EditOutlined, SaveAltOutlined, SaveOutlined, StoreMallDirectorySharp } from "@material-ui/icons";
import KErrorMessage from "./KErrorMessage";
import * as yup from "yup";
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
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
// import { Delete } from '@material-ui/icons';
import VisibilityIcon from "@material-ui/icons/Visibility";
import BlockIcon from "@material-ui/icons/Block";
// import ArrowBackIcon from "@material-ui/icons/ArrowBack";

// For Table
import SearchBar from "material-ui-search-bar";
import { get, orderBy, set } from "lodash";

//history
import { useHistory } from "react-router-dom";
// import AddEditCategory from "../AccountManagement/Account_Details";

import EditIcon from "@material-ui/icons/Edit";
import { DeleteOutline, WidgetsOutlined } from "@material-ui/icons";
import Swal from "sweetalert2";
import "./ServiceManagement.css";
// import InputRange from "react-input-range";
import RSelect from "react-select";
import PuffLoader from "react-spinners/PuffLoader";
import { useUploadImage } from "../../services/Imagecustomhook";
import Axios from "axios";
import NoDataFound from "../../components/NoDataFound";
import { ImageUploadUrl } from "../../statics/constants";
import Slider from "@material-ui/core/Slider";
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
    // minHeight: "50vh",
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
export default function PetCategoryManagement(props) {
  const classes = useStyles();
  const [puffLoader, setPuffLoader] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState({});

  const [VehicleData, setVehilceData] = useState([]);
  const [VehicleMutliValue, setVehicleMultiValue] = useState([]);
  const [displayManagePetFare, setDisplayPetFare] = useState(false);
  const [displayManagePetPrice, setDisplayManagePetPrice] = useState(false);
  const { isSuccess, uploadForm, progress } = useUploadImage(`${ImageUploadUrl}/fileUpload`);

  const [tableData, setTableData] = useState([]);
  const [modalState, setModalState] = useState({ isFarePet: "" });
  const [selectedPetData, setSelectedPetData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [totalUserListCount, settotalUserListCount] = useState(0);
  const [limit, setLimit] = useState(10);
  const [showDropDown, setShowDropDown] = useState(false);
  const [selectedPetCategoryData, setSelectedPetCategoryData] = useState(null);
  const [modalStatePetCategory, setModalStatePetCategory] = useState({
    isAddEditPetCategory: "",
  });
  // status switch
  // const [checked, setChecked] = useState(true);
  // const history=useHistory();
  console.log(selectedPetData);
  const [val, setVal] = useState([1, 10]);
  const [val1, setVal1] = useState([1, 10]);
  const [val2, setVal2] = useState([1, 10]);
  const [editValue, setEdit] = useState({
    0: false,
    1: false,
    2: false,
    3: false,
  });
  const ActionOptions = [
    { label: "Manage Pet Size & Price", value: "Manage Pet Size & Price" },
    { label: "Manage Pet Fare", value: "Manage Pet Fare" },
  ];
  //
  // For Pagination
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [selectedActionsValue, setSelectedActionsValue] = useState();

  const [value, setValue] = React.useState(0);
  const handleChangePage = (event, newPage) => {
    // console.log(event);
    // console.log(newPage);
    console.log(newPage);
    console.log({ event, newPage });
    getCategoriesContent(newPage + 1, rowsPerPage, search);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    console.log(+event.target.value);
    // setRowsPerPage(+event.target.value);
    // setPage(0);
    getCategoriesContent(0, event.target.value, search);
    setRowsPerPage(parseInt(event.target.value, 10));
    console.log({ event });
    setPage(0);
  };

  useEffect(() => {
    getCategoriesContent(page, limit, search);
    //change here
    getVehicleList();
  }, []);
  // useEffect(() => {
  //   getPetFare();
  // }, [modalState]);

  useEffect(() => {
    console.log(VehicleData);
    getSelectData();
  }, [VehicleData]);

  //get content
  const getCategoriesContent = async (page = 1, limit = 10, search = "") => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`/private/petCategory?page=${page}&limit=${limit}&search=${search}`);
      console.log(data);
      setTableData([...data.data.docs]);
      // setSearchedData(data.data.docs);
      settotalUserListCount(data.data.totalDocs);
      setSearch(search);
      setIsLoading(false);
      setIsLoading(false);
      setSelectedLanguage(data.data.docs.reduce((a, c) => ((a[c._id] = { label: "English", value: "English" }), a), {}));
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

  const EditTaxiSingle = (category) => {
    props.history.push({
      pathname: "/adminPanel/AddEditTaxiSingle",
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
  const DeletePetCategory = async (category) => {
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
          `/private/petCategory/${category._id}?status=delete`
          // , {
          // icon: category.icon,
          // title: category.title,
          // }
        );
        console.log(data);
        getCategoriesContent(page, limit, search);
        toast.success("Pet Category deleted", {
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
    //   if (window.confirm("Are you sure you want to delete this pet category?")) {
    //     const { data } = await axios.delete(
    //       `/private/petCategory/${category._id}?status=delete`
    //       // , {
    //       // icon: category.icon,
    //       // title: category.title,
    //       // }
    //     );
    //     console.log(data);
    //     getCategoriesContent(page, limit, search);
    //     toast.success("Pet Category deleted", {
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

  // status switch

  const statusSwitch = async (e, id) => {
    try {
      console.log(id);

      const { data } = await axios.post("/admin/updatesect", {
        _id: id,
        is_active: e.target.checked,
      });
      // props.history.push({
      //     pathname: "/Category_Management",
      //   });
      getCategoriesContent(page, limit);
      toast.success(data.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      console.log(data);
    } catch (error) {
      console.log(error);
    }

    // console.log(e.target.checked);
    // console.log(checked);
    // console.log(id);
  };
  // useEffect(() => {
  //    window.localStorage.setItem('query',JSON.stringify([]))

  // }, [])

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

  const BlockPetCategory = async (id) => {
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
        const { data } = await axios.delete(`/private/petCategory/${id}?status=block`);
        console.log(data);
        getCategoriesContent(page, limit, search);
        toast.success("Pet Category Blocked", {
          position: toast.POSITION.TOP_RIGHT,
        });
        // Swal.fire("Deleted!", "Your file has been deleted.", "success");
      } else {
        toast.error("You have cancelled the operation", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    });
    // if (window.confirm("Are you sure you want to block this pet category?")) {
    //   try {
    //     // console.log(category);
    //     const { data } = await axios.delete(`/private/petCategory/${id}?status=block`);
    //     console.log(data);
    //     getCategoriesContent(page, limit, search);
    //     toast.success("Pet Category Blocked", {
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

  const UnBlockPetCategory = async (id) => {
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
        const { data } = await axios.delete(`/private/petCategory/${id}?status=unblock`);
        console.log(data);
        getCategoriesContent(page, limit, search);
        toast.success("Pet Category Unblocked", {
          position: toast.POSITION.TOP_RIGHT,
        });
        // Swal.fire("Deleted!", "Your file has been deleted.", "success");
      } else {
        toast.error("You have cancelled the operation", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    });
    // if (window.confirm("Are you sure you want to unblock this pet category?")) {
    //   try {
    //     // console.log(category);
    //     const { data } = await axios.delete(`/private/petCategory/${id}?status=unblock`);
    //     console.log(data);
    //     getCategoriesContent(page, limit, search);
    //     toast.success("Pet Category Unblocked", {
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
  const getPetFare = async () => {
    setPuffLoader(true);
    try {
      const { data } = await axios.get(`/private/petManageAdminFare`);
      // props.history.push({
      //   pathname: "/adminPanel/FarePet",
      //   state: data.data,
      // });
      // setModalState({ isFarePet: true });
      setSelectedPetData(data.data);
      setVal([data.data?.result[0]?.rangeStart, data.data?.result[0]?.rangeEnd]);
      setVal1([data.data?.result[1]?.rangeStart, data.data?.result[1]?.rangeEnd]);
      setVal2([data.data?.result[2]?.rangeStart, data.data?.result[2]?.rangeEnd]);
      setPuffLoader(false);
      console.log(data.data);
      setModalState({ isFarePet: true });
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

  const SearchPet = myDeb((search) => {
    getCategoriesContent(page, limit, search.toLowerCase());
  });

  const submitEach = async (values, key) => {
    switch (key) {
      case 0:
        try {
          console.log(values);
          const { data } = await axios.put(`/private/petCategoryManageFare/${selectedPetData?.result[0]._id}`, {
            petSize: values.petSize1 || selectedPetData?.result[0].petSize,
            rangeStart: val[0] || selectedPetData?.result[0].rangeStart,
            rangeEnd: val[1] || selectedPetData?.result[0].rangeEnd,
            petPrize: values.petPrize1 || selectedPetData?.result[0].petPrize,
            cargePrize: values.cargePrize1 || selectedPetData?.result[0].cargePrize,
            adminFareSet: selectedPetData?.adminFare._id,
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
          const { data } = await axios.put(`/private/petCategoryManageFare/${selectedPetData?.result[1]._id}`, {
            petSize: values.petSize2 || selectedPetData?.result[1].petSize,
            rangeStart: val1[0] || selectedPetData?.result[1].rangeStart,
            rangeEnd: val1[1] || selectedPetData?.result[1].rangeEnd,
            petPrize: values.petPrize2 || selectedPetData?.result[1].petPrize,
            cargePrize: values.cargePrize2 || selectedPetData?.result[1].cargePrize,
            adminFareSet: selectedPetData?.adminFare._id,
            // "ajk",
            // values.timeRate || state.timeRate,
            // is_active: state.is_active,
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
          const { data } = await axios.put(`/private/petCategoryManageFare/${selectedPetData?.result[2]._id}`, {
            petSize: values.petSize3 || selectedPetData?.result[2].petSize,
            rangeStart: val2[0] || selectedPetData?.result[2].rangeStart,
            rangeEnd: val2[1] || selectedPetData?.result[2].rangeEnd,
            petPrize: values.petPrize3 || selectedPetData?.result[2].petPrize,
            cargePrize: values.cargePrize3 || selectedPetData?.result[2].cargePrize,
            adminFareSet: selectedPetData?.adminFare._id,
            // "ajk",
            // values.timeRate || state.timeRate,
            // is_active: state.is_active,
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
          const { data } = await axios.put(`/private/rideVehicleUpdate/62d53ad1bf652aa3778946d0`, {
            // vehicleId: values.vehicleId,
            vehicleId: [...VehicleMutliValue.map((val) => val.value)],
            // "ajk",
            // values.timeRate || state.timeRate,
            // is_active: state.is_active,
          });
          toast.success("Success", {
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
  const getData = async () => {
    const apiGetData = await axios.get(`/private/petManageAdminFare`);
    console.log(apiGetData.data.data);
    getVehicleList();
    // if (apiGetData.data.data.vehicleId !== undefined || apiGetData.data.data.vehicleId !== []) {
    //   setVehicleMultiValue(VehicleData.filter((ele) => apiGetData.data.data.vehicleId.some((ele2) => ele.value === ele2._id)));
    // } else {
    //   setVehicleMultiValue([]);
    // }
    // history.replace({
    //   pathname: "/adminPanel/FarePet",
    //   state: apiGetData.data.data,
    // });
  };
  const getVehicleList = async () => {
    const { data } = await axios.get(`/private/vehicaleList`);
    console.log(data);
    let newArray = data.data.map((ele) => ({ label: ele.title, value: ele._id }));
    setVehilceData(newArray);
  };
  const getSelectData = async () => {
    // if (selectedPetData?.vehicleId !== undefined || selectedPetData?.vehicleId !== []) {
    //   setVehicleMultiValue(VehicleData?.filter((ele) => selectedPetData?.vehicleId.some((ele2) => ele.value === ele2._id)));
    // } else {
    //   setVehicleMultiValue([]);
    // }
  };
  const validationSchema = yup.object({
    bookingFee: yup
      .number()
      .typeError("Only Number Accepted")
      .min(0.1, "Min value 0.1.")

      .max(99999, "Max value 99999")
      .required("Booking Fee is required"),
    distanceRate: yup
      .number()
      .typeError("Only Number Accepted")
      .min(0.1, "Min value 0.1.")
      .max(99999, "Max value is 99999")
      .required("Distance Rate is required"),
    // timeRate: yup.number().required("Time Rate is required"),
    adminCommission: yup
      .number()
      .typeError("Only Number Accepted")
      .min(0.1, "Min value 0.1.")
      .max(99, "Max value 99.")
      .required("Admin Commission is required"),
    cancellationFee: yup
      .number()
      .typeError("Only Number Accepted")
      .min(0.1, "Min value 0.1.")
      .max(99, "Max value 99.")

      .required("Cancellation Fee is required"),
    timeRate: yup
      .number()
      .min(0.1, "Min value 0.1.")
      .typeError("Only Number Accepted")
      .max(99999, "Max value is 99999")
      .required("Time Rate is required"),
    petPrize1: yup
      .number()
      .typeError("Only Number Accepted")
      .min(0.1, "Min value 0.1.")
      .max(99999, "Max value is 99999")

      .required("Pet Price is required"),
    petPrize2: yup
      .number()
      .typeError("Only Number Accepted")
      .min(0.1, "Min value 0.1.")
      .max(99999, "Max value is 99999")

      .required("Pet Price is required"),
    petPrize3: yup
      .number()
      .typeError("Only Number Accepted")
      .min(0.1, "Min value 0.1.")
      .max(99999, "Max value is 99999")

      .required("Pet Price is required"),
    cargePrize1: yup
      .number()
      .lessThan(yup.ref("petPrize1"), "Cage price should be less than pet price")
      .typeError("Only Number Accepted")
      .required("Cage Prize is required"),
    cargePrize2: yup
      .number()
      .lessThan(yup.ref("petPrize2"), "Cage price should be less than pet price")
      .typeError("Only Number Accepted")
      .required("Cage Prize is required"),
    cargePrize3: yup
      .number()
      .lessThan(yup.ref("petPrize3"), "Cage price should be less than pet price")
      .typeError("Only Number Accepted")
      .required("Cage Prize is required"),

    adminCancellationFee: yup
      .number()
      .typeError("Only Number Accepted")
      .min(0.1, "Min value 0.1.")
      .max(99, "Max value 99.")
      .required("Admin Cancellation Fee is required"),
    // driverCancellationFee: yup
    //   .number()
    //   .typeError("Only Number Accepted")
    //   .min(0, "Min value 0.")
    //   .max(99, "Max value 99.")
    //   .required("Driver Cancellation Fee is required"),
  });
  const EditFarePet = async (values) => {
    try {
      console.log(values);

      const { data } = await axios.put(`/private/petCategoryAdminManageFare/${selectedPetData.adminFare._id}`, {
        bookingFee: values.bookingFee || selectedPetData.adminFare.bookingFee,
        distanceRate: values.distanceRate || selectedPetData.adminFare.distanceRate,
        adminCommission: values.adminCommission || selectedPetData.adminFare.adminCommission,
        cancellationFee: values.cancellationFee || selectedPetData.adminFare.cancellationFee,
        timeRate: values.timeRate || selectedPetData.adminFare.timeRate,
        adminCancellationFee: values.adminCancellationFee || selectedPetData.adminCancellationFee,
        // driverCancellationFee: values.driverCancellationFee || selectedPetData.driverCancellationFee,
        // vehicleId: values.vehicleId || state.vehicleId,
        // "ajk",
        // values.timeRate || state.timeRate,
        // is_active: state.is_active,
      });

      //  props.history.push({
      //    pathname: "/adminPanel/PetCategoryManagement",
      //  });
      setModalState({ isFarePet: false });
      setShowDropDown(!showDropDown);
      toast.success("Updated Successfully", {
        position: toast.POSITION.TOP_RIGHT,
      });
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

  const addNewPetCategoryImage = async (values) => {
    try {
      console.log(values);

      const { data } = await axios.post("/private/petCategory", {
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
  const EditPetCategoryImage = async (values) => {
    if (selectedPetCategoryData?.icon === values.ImageLink) {
      try {
        console.log(values);

        const { data } = await axios.put(`/private/petCategory/${selectedPetCategoryData._id}`, {
          icon: values.ImageLink,
          // title: values.name,
        });
        setSelectedPetCategoryData(null);
        setModalStatePetCategory({ isAddEditPetCategory: false });
        // getCategoriesContent();
        // toast.success(data.message, {
        //   position: toast.POSITION.TOP_RIGHT,
        // });
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        console.log(values);

        const { data } = await axios.put(`/private/petCategory/${selectedPetCategoryData._id}`, {
          icon: values.ImageLink,
          // title: values.name,
        });
        await DeleteImage();
        setSelectedPetCategoryData(null);
        setModalStatePetCategory({ isAddEditPetCategory: false });
        // getCategoriesContent();
        // toast.success(data.message, {
        //   position: toast.POSITION.TOP_RIGHT,
        // });
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    }
  };
  const DeleteImage = async () => {
    let imageID = !selectedPetCategoryData ? "" : selectedPetCategoryData.icon.split("/")[3];
    console.log(imageID);
    try {
      const { data } = await Axios.get(`http://18.221.140.83:3000/fileDelete/${imageID}`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
    let checkEnglish = selectedPetCategoryData?.languages.find((ele) => ele.lang === "en" || "English");
    let checkSpanish = selectedPetCategoryData?.languages.find((ele) => ele.lang === "es" || "Spanish");
    let checkKorean = selectedPetCategoryData?.languages.find((ele) => ele.lang === "ko" || "Korean");
    let checkChinese = selectedPetCategoryData?.languages.find((ele) => ele.lang === "zh" || "Chinese");
    switch (newValue) {
      case 0:
        setSelectedLanguage((langs) => ({
          ...langs,
          [selectedPetCategoryData._id]: { label: "English", value: "English" },
        }));

        break;
      case 1:
        setSelectedLanguage((langs) => ({
          ...langs,
          [selectedPetCategoryData._id]: { label: "Spanish", value: "Spanish" },
        }));

        break;
      case 2:
        setSelectedLanguage((langs) => ({
          ...langs,
          [selectedPetCategoryData._id]: { label: "Korean", value: "Korean" },
        }));

        break;
      case 3:
        setSelectedLanguage((langs) => ({
          ...langs,
          [selectedPetCategoryData._id]: { label: "Chinese", value: "Chinese" },
        }));

        break;
      default:
        break;
    }
  };
  const updateLanguageData = async (values) => {
    console.log(values);

    try {
      const { data } = await axios.put(`/private/petCategoryLanguagesUpdate`, {
        objectId: values.objectId,
        lang: values.lang,
        title: values.name,
      });
      toast.success(data.messages, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setSelectedPetCategoryData(null);
      setModalState({ isAddEditTaxiSingle: false });
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
                <div className=" my-3" style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
                  <SearchBar
                    // value={searched}
                    style={{ borderRadius: "25px" }}
                    className={"heightfix  "}
                    onChange={(searchVal) => SearchPet(searchVal)}
                    onCancelSearch={() => cancelSearch()}
                    placeholder="Search by Pet Name"
                  />

                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem" }}>
                    <Tooltip title={<span style={{ color: "white", fontSize: "16px" }}>Manage Fare</span>} arrow>
                      <Button
                        className="buttoncss"
                        style={{ backgroundColor: "#0059cd", color: "#fff" }}
                        onClick={() => {
                          setDisplayManagePetPrice(false);
                          setDisplayPetFare(true);

                          getPetFare();
                        }}
                      >
                        <WidgetsOutlined />
                        &nbsp; Manage Pet Fare
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
                          setDisplayManagePetPrice(true);
                          setDisplayPetFare(false);

                          getPetFare();
                        }}
                      >
                        <WidgetsOutlined />
                        &nbsp; Manage Pet Size & Price
                      </Button>
                    </Tooltip>
                  </div>
                </div>
                {/* </Paper> */}

                {/* //new design */}

                {/* <br /> */}

                {/* status end */}

                <Paper>
                  {/* {showSearch ? (
                    
                  ) : (
                    false
                  )} */}
                  <TableContainer className={classes.container} style={{ minHeight: tableData.length > 0 ? "50vh" : "" }}>
                    <Table className={classes.table} stickyHeader size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell style={{ fontWeight: "bold" }}>Sr. No.</TableCell>
                          <TableCell style={{ fontWeight: "bold" }}> Pet Name</TableCell>
                          <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Pet Image</TableCell>

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
                              <TableCell className={classes.textMiddle}>
                                {/* {category.title ? category.title.charAt(0).toUpperCase() + category.title.slice(1) : "N/A"} */}
                                {
                                  category?.languages.find(
                                    (ele) => filterLanguageValue(ele.lang) === selectedLanguage[category._id]?.value
                                  )?.title
                                }
                              </TableCell>

                              <TableCell style={{ textAlign: "center" }}>
                                {/* <IOSSwitch
                                  onChange={(e) => {
                                    statusSwitch(e, category._id);
                                  }}
                                  checked={category.is_active}
                                /> */}
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
                                      setSelectedPetCategoryData(category);
                                      setModalStatePetCategory({ isAddEditPetCategory: true });
                                    }}
                                    className="EditButton"
                                  >
                                    <Tooltip title={<span className="TooltipCustomSize">Manage</span>} arrow>
                                      <EditIcon />
                                    </Tooltip>
                                  </Button>
                                )}
                                <Button
                                  className={`${category.block === "block" ? "BlockedButton mx-2" : "BlockButton mx-2"}`}
                                  onClick={() =>
                                    category.block === "block"
                                      ? UnBlockPetCategory(category._id)
                                      : BlockPetCategory(category._id)
                                  }
                                >
                                  <Tooltip title={<span className="TooltipCustomSize">Block/Unblock</span>} arrow>
                                    <BlockIcon />
                                  </Tooltip>
                                </Button>
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
                                {/* <Button onClick={()=>BlockCategory} style={{backgroundColor:"#696969"}} >Manage</Button> */}
                                {/* <Button
                                  className=""
                                  onClick={() => DeletePetCategory(category)}
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
                    style={{ position: "fixed", bottom: 4, backgroundColor: "white", right: 27 }}
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

      {/* Fare Pet */}
      <Modal
        maxWidth="lg"
        width="840px"
        isOpen={modalState.isFarePet}
        // onClose={() => {
        //   setModalState({
        //     isFarePet: false,
        //   });
        //   setSelectedPetData(null);
        //   setShowDropDown(!showDropDown);
        // }}
        onClose={(event, reason) => {
          if (reason && (reason === "backdropClick" || "escapeKeyDown")) {
            console.log(reason);
            setModalState({
              isFarePet: true,
            });
          } else {
            setModalState({
              isFarePet: false,
            });
            setSelectedPetData(null);
            setShowDropDown(!showDropDown);
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
              {displayManagePetPrice ? "Manage Pet Size & Price" : "Manage Pet Fare"}
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
                    isFarePet: false,
                  });
                  setSelectedPetData(null);
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
                cargePrize1: selectedPetData?.result[0].cargePrize,
                petPrize1: selectedPetData?.result[0].petPrize,
                petSize1: selectedPetData?.result[0].petSize,

                cargePrize2: selectedPetData?.result[1].cargePrize,
                petPrize2: selectedPetData?.result[1].petPrize,
                petSize2: selectedPetData?.result[1].petSize,

                cargePrize3: selectedPetData?.result[2].cargePrize,
                petPrize3: selectedPetData?.result[2].petPrize,
                petSize3: selectedPetData?.result[2].petSize,

                //adminfare
                distanceRate: selectedPetData?.adminFare?.distanceRate,

                adminCommission: get(selectedPetData?.adminFare, "adminCommission", ""),
                cancellationFee: get(selectedPetData?.adminFare, "cancellationFee", ""),
                timeRate: get(selectedPetData?.adminFare, "timeRate", ""),
                bookingFee: get(selectedPetData?.adminFare, "bookingFee", ""),
                adminCancellationFee: get(selectedPetData?.adminFare, "adminCancellationFee", ""),
                // driverCancellationFee: get(selectedPetData?.adminFare, "driverCancellationFee", ""),
              }}
              // validate={(values) => handleValidateManageFarePet(values)}
              onSubmit={(values) => {
                console.log(values);
                if (selectedPetData !== null) {
                  EditFarePet(values);
                } else {
                  // addNewTaxiSingle(values);
                  console.log("gadbad");
                }
              }}
            >
              {({ values, setFieldValue, errors }) => (
                <Form>
                  <div className="container my-5">
                    {displayManagePetPrice ? (
                      <>
                        {/* <div className="row my-4 mx-1">
                              <h4> Manage Vehicle:</h4>
                            </div>
                            <div className="row my-4 d-flex align-items-end ">
                              <div className="col-9 d-flex flex-column">
                                <span
                                  style={{
                                    fontSize: "16px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  Select Vehicle:
                                </span>
                                <div>
                                  <RSelect
                                    isSearchable={false}
                                    value={VehicleMutliValue}
                                    //  VehicleData.filter((ele) => state.vehicleId.some((ele2) => ele.value === ele2._id))

                                    isMulti={true}
                                    options={VehicleData}
                                    styles={customStyles}
                                    onChange={(e) => {
                                      setVehicleMultiValue(e);
                                      // setFieldValue(
                                      //   "vehicleId",
                                      //   e?.map((ele, index) => ele.value)
                                      // );
                                      console.log(e);
                                    }}
                                    isDisabled={editValue[3] ? false : true}
                                  />
                                </div>
                                <KErrorMessage name="vehicleId" />
                              </div>
                              <div className="col-3 d-flex align-items-center">
                                <button
                                  type="button"
                                  className="FarePackageEditButton"
                                  onClick={() => {
                                    setEdit({ ...editValue, 3: true });
                                  }}
                                >
                                  Edit
                                
                                </button>
                                {editValue[3] ? (
                                  <button
                                    type="button"
                                    className="FarePackageSaveButton"
                                    onClick={() => {
                                      VehicleMutliValue === null || VehicleMutliValue === undefined
                                        ? toast.error("Select Value", {
                                            position: "top-right",
                                          })
                                        : submitEach(values, 3);
                                      setEdit({ ...editValue, 3: false });
                                    }}
                                  >
                                    Save
                                   
                                  </button>
                                ) : (
                                  ""
                                )}
                              </div>
                            </div> */}

                        <div className="row">
                          <div className="col-3">
                            <span
                              style={{
                                fontSize: "16px",
                                fontWeight: "bold",
                              }}
                            >
                              Pet Size
                            </span>
                          </div>
                          <div className="col-3">
                            <span
                              style={{
                                fontSize: "16px",
                                fontWeight: "bold",
                              }}
                            >
                              Range<span style={{ color: "brown", fontWeight: "bold" }}>(lbs)</span>
                            </span>
                          </div>
                          <div className="col-2">
                            <span
                              style={{
                                fontSize: "16px",
                                fontWeight: "bold",
                                whiteSpace: "nowrap",
                              }}
                            >
                              Pet Price<span style={{ color: "#85BB65", fontWeight: "bold" }}>(USD)</span>
                            </span>
                          </div>
                          <div className="col-2">
                            <span
                              style={{
                                fontSize: "16px",
                                fontWeight: "bold",
                                whiteSpace: "nowrap",
                              }}
                            >
                              Cage Price<span style={{ color: "#85BB65", fontWeight: "bold" }}>(USD)</span>
                            </span>
                          </div>
                        </div>
                        <div className="row align-items-center">
                          <div className="col-3 d-flex flex-column">
                            {" "}
                            <Field className="FarePetFieldSize" name="petSize1" type="text" readOnly />
                            <KErrorMessage name="petSize1" />
                          </div>
                          <div className="col-3">
                            {/* <InputRange
                              step={1}
                              formatLabel={(value) => value + "lbs"}
                              draggableTrack={false}
                              allowSameValues={false}
                              maxValue={100}
                              minValue={0}
                              value={val}
                              onChange={setVal}
                              onChangeComplete={(args) => console.log(args)}
                            /> */}
                            <Slider
                              step={1}
                              min={0}
                              max={100}
                              value={val}
                              onChange={(e, val) => setVal(val)}
                              valueLabelDisplay="auto"
                              aria-labelledby="range-slider"
                              // getAriaValueText={valuetext}
                            />
                          </div>
                          <div className="col-2 d-flex flex-column">
                            <Field
                              className="FarePetFieldPrice"
                              name="petPrize1"
                              type="text"
                              readOnly={editValue[0] ? false : true}
                            />
                            <KErrorMessage name="petPrize1" />
                          </div>
                          <div className="col-2 d-flex flex-column">
                            <Field
                              className="FarePetFieldPrice"
                              name="cargePrize1"
                              type="text"
                              readOnly={editValue[0] ? false : true}
                            />
                            <KErrorMessage name="cargePrize1" />
                          </div>
                          <div className="col-2 d-flex">
                            <button
                              type="button"
                              className="FarePackageSmallEditButton"
                              onClick={() => {
                                setEdit({ ...editValue, 0: true });
                              }}
                            >
                              <EditIcon />
                            </button>
                            {editValue[0] ? (
                              <button
                                type="button"
                                className="FarePackageSmallSaveButton"
                                onClick={() => {
                                  errors.cargePrize1
                                    ? toast.error("Incorrect Value", {
                                        position: "top-right",
                                      })
                                    : submitEach(values, 0);
                                  setEdit({ ...editValue, 0: false });
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
                          <div className="col-3 d-flex flex-column">
                            {" "}
                            <Field className="FarePetFieldSize" name="petSize2" type="text" readOnly />
                            <KErrorMessage name="petSize2" />
                          </div>
                          <div className="col-3">
                            {/* <InputRange
                              step={1}
                              formatLabel={(value) => value + "lbs"}
                              draggableTrack={false}
                              allowSameValues={false}
                              maxValue={100}
                              minValue={0}
                              value={val1}
                              onChange={setVal1}
                              onChangeComplete={(args) => console.log(args)}
                            /> */}
                            <Slider
                              step={1}
                              min={0}
                              max={100}
                              value={val1}
                              onChange={(e, val1) => setVal1(val1)}
                              valueLabelDisplay="auto"
                              aria-labelledby="range-slider"
                              // getAriaValueText={valuetext}
                            />
                          </div>
                          <div className="col-2 d-flex flex-column">
                            <Field
                              className="FarePetFieldPrice"
                              name="petPrize2"
                              type="text"
                              readOnly={editValue[1] ? false : true}
                            />
                            <KErrorMessage name="petPrize2" />
                          </div>
                          <div className="col-2 d-flex flex-column">
                            <Field
                              className="FarePetFieldPrice"
                              name="cargePrize2"
                              type="text"
                              readOnly={editValue[1] ? false : true}
                            />
                            <KErrorMessage name="cargePrize2" />
                          </div>
                          <div className="col-2 d-flex">
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
                                  errors.cargePrize2
                                    ? toast.error("Incorrect Value", {
                                        position: "top-right",
                                      })
                                    : submitEach(values, 1);
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
                          <div className="col-3 d-flex flex-column">
                            {" "}
                            <Field className="FarePetFieldSize" name="petSize3" type="text" readOnly />
                            <KErrorMessage name="petSize3" />
                          </div>
                          <div className="col-3">
                            {/* <InputRange
                              step={1}
                              formatLabel={(value) => value + "lbs"}
                              draggableTrack={false}
                              allowSameValues={false}
                              maxValue={100}
                              minValue={0}
                              value={val2}
                              onChange={setVal2}
                              onChangeComplete={(args) => console.log(args)}
                            /> */}
                            <Slider
                              step={1}
                              min={0}
                              max={100}
                              value={val2}
                              onChange={(e, val2) => setVal2(val2)}
                              valueLabelDisplay="auto"
                              aria-labelledby="range-slider"
                              // getAriaValueText={valuetext}
                            />
                          </div>
                          <div className="col-2 d-flex flex-column">
                            <Field
                              className="FarePetFieldPrice"
                              name="petPrize3"
                              type="text"
                              readOnly={editValue[2] ? false : true}
                            />
                            <KErrorMessage name="petPrize3" />
                          </div>
                          <div className="col-2 d-flex flex-column">
                            <Field
                              className="FarePetFieldPrice"
                              name="cargePrize3"
                              type="text"
                              readOnly={editValue[2] ? false : true}
                            />
                            <KErrorMessage name="cargePrize3" />
                          </div>

                          <div className="col-2 d-flex ">
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
                                  errors.cargePrize3
                                    ? toast.error("Incorrect Value", {
                                        position: "top-right",
                                      })
                                    : submitEach(values, 2);
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
                      </>
                    ) : (
                      false
                    )}
                    {displayManagePetFare ? (
                      <>
                        {" "}
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
                            <Field className="FarePetFieldPrice" name="distanceRate" type="text" />
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
                            <Field className="FarePetFieldPrice" name="timeRate" type="text" />
                            <KErrorMessage name="timeRate" />
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
                              Booking Fee<span style={{ color: "#85BB65", fontWeight: "bold" }}>(USD)</span>:
                            </span>
                            <Field className="FarePetFieldPrice" name="bookingFee" type="text" />
                            <KErrorMessage name="bookingFee" />
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
                            <Field className="FarePetFieldPrice" name="adminCommission" type="text" />
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
                            <Field className="FarePetFieldPrice" name="cancellationFee" type="text" />
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
                              <Field className="FarePetFieldPrice" name="adminCancellationFee" type="text" />
                              <KErrorMessage name="adminCancellationFee" />
                            </div>
                          </Tooltip>
                        </div>
                      </>
                    ) : (
                      false
                    )}
                  </div>
                  {displayManagePetFare ? (
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
      {/* AddEdit pet Category */}
      <Modal
        maxWidth="lg"
        width="840px"
        isOpen={modalStatePetCategory.isAddEditPetCategory}
        onClose={(event, reason) => {
          if (reason && (reason === "backdropClick" || "escapeKeyDown")) {
            console.log(reason);
            setModalStatePetCategory({
              isAddEditPetCategory: true,
            });
          } else {
            setModalStatePetCategory({
              isAddEditPetCategory: false,
            });
            setSelectedPetCategoryData(null);
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
              {selectedPetCategoryData === null ? "Add Pet" : "Edit Pet"}
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
                  setModalStatePetCategory({
                    isAddEditPetCategory: false,
                  });
                  setSelectedPetCategoryData(null);
                }}
              />
            </div>
          </div>
        }
        content={
          <>
            <Formik
              enableReinitialize
              key={selectedLanguage}
              // validationSchema={validationSchema}
              initialValues={{
                name: selectedPetCategoryData?.languages.find(
                  (ele) => filterLanguageValue(ele.lang) === selectedLanguage[selectedPetCategoryData._id]?.value
                )?.title,
                // name: selectedPetCategoryData?.languages.find(
                //   (ele) => ele.lang === selectedLanguage[selectedPetCategoryData._id]?.value
                // )?.title,
                file1: "",
                ImageLink: get(selectedPetCategoryData, "icon", ""),
                // description: selectedPetCategoryData?.languages.find(
                //   (ele) => ele.lang === selectedLanguage[selectedPetCategoryData._id]?.value
                // )?.description,
                objectId: get(selectedPetCategoryData, "_id", ""),
                // languageObjectId: selectedPetCategoryData?.languages.find(
                //   (ele) => filterLanguageValue(ele.lang) === selectedLanguage[selectedPetCategoryData._id]?.value
                // )?._id,
                lang: selectedPetCategoryData?.languages.find(
                  (ele) => filterLanguageValue(ele.lang) === selectedLanguage[selectedPetCategoryData._id]?.value
                )?.lang,

                // description: get(selectedBannerData, "description", ""),
              }}
              validate={(values) => handleValidateAddEditPetData(values, selectedPetCategoryData)}
              onSubmit={(values) => {
                console.log(values);
                if (selectedPetCategoryData !== null) {
                  EditPetCategoryImage(values);
                  updateLanguageData(values);
                  // EditBannerImage(values);
                  // EditTaxiSingle(values);
                } else {
                  addNewPetCategoryImage(values);
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
                      {selectedPetCategoryData !== null ? (
                        <Tabs
                          value={getTabValue(selectedLanguage[selectedPetCategoryData._id].value)}
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
                          <label>Pet Name :</label>
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
                                placeholder={"Enter Pet Name"}
                              />
                            )}
                          </Field>
                        </div>
                        <div className="">
                          <label>
                            Pet Image<span style={{ color: "#85BB65", fontWeight: "bold" }}>(145x145)</span>:
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
                                error={formikBag.touched.file1 && formikBag.errors.file1 ? formikBag.errors.file1 : null}
                                className="form-control"
                                placeholder={"Enter Pet Image"}
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
