import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import axios from "../../axios";
import { Formik, Form, Field } from "formik";
import { get } from "lodash";
import Axios from "axios";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { toast } from "react-toastify";
import AddIcon from "@material-ui/icons/Add";
import SearchIcon from "@material-ui/icons/Search";
import { Input, Modal } from "../../components/index";
import { AiOutlineClose } from "react-icons/ai";
import { useUploadImage } from "../../services/Imagecustomhook";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
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
import { handleValidateManageFare, handleValidateAddEditSingleTaxi } from "../../utils/validators";

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
import NoDataFound from "../../components/NoDataFound";
import PuffLoader from "react-spinners/PuffLoader";
import RSelect from "react-select";
// import Select from "../../components/Select";
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

  const [selectedLanguage, setSelectedLanguage] = useState({});
  const [puffLoader, setPuffLoader] = useState(false);
  const { isSuccess, uploadForm, progress } = useUploadImage(`${ImageUploadUrl}/fileUpload`);
  const [tableData, setTableData] = useState([]);
  const [selectedTaxiData, setSelectedTaxiData] = useState("");
  const [selectedTaxiDataAddEdit, setSelectedTaxiDataAddEdit] = useState(null);
  const [deletingImage, setDeletingImage] = useState(false);
  const [modalState, setModalState] = useState({
    isFareTaxiSingle: "",
    isAddEditTaxiSingle: "",
  });

  const [isLoading, setIsLoading] = useState(true);

  // status switch
  const [checked, setChecked] = useState(true);

  // For Pagination
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [totalUserListCount, settotalUserListCount] = useState(0);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [LanguageInputs, setLanguageInputs] = useState({
    name: selectedTaxiDataAddEdit?.languages.find(
      (ele) => filterLanguageValue(ele.lang) === selectedLanguage[selectedTaxiDataAddEdit?._id]?.value
    )?.title,
    file1: "",
    ImageLink: get(selectedTaxiDataAddEdit, "icon", ""),
    description: selectedTaxiDataAddEdit?.languages.find(
      (ele) => filterLanguageValue(ele.lang) === selectedLanguage[selectedTaxiDataAddEdit?._id]?.value
    )?.description,
    objectId: get(selectedTaxiDataAddEdit, "_id", ""),
    languageObjectId: selectedTaxiDataAddEdit?.languages.find(
      (ele) => filterLanguageValue(ele.lang) === selectedLanguage[selectedTaxiDataAddEdit?._id]?.value
    )?._id,
    lang: selectedTaxiDataAddEdit?.languages.find(
      (ele) => filterLanguageValue(ele.lang) === selectedLanguage[selectedTaxiDataAddEdit?._id]?.value
    )?.lang,
  });

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
  // useEffect(()=>{},[LanguageInputs])

  //get content
  const getCategoriesContent = async (page = 1, limit = 10, search = "") => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`/private/vehicleCategory?page=${page}&limit=${limit}&search=${search}`);
      console.log(data);
      setTableData([...data.data.docs]);
      // setSearchedData(data.data.docs);
      settotalUserListCount(data.data.totalDocs);
      setSearch(search);
      setIsLoading(false);
      setSelectedLanguage(data.data.docs.reduce((a, c) => ((a[c._id] = { label: "English", value: "English" }), a), {}));
      // console.log(data.data.docs.reduce((a, c) => (console.log(a)));
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

  // const EditTaxiSingle = (category) => {
  //   props.history.push({
  //     pathname: "/adminPanel/AddEditTaxiSingle",
  //     state: category,
  //   });
  // };

  //edit  categories attribute
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
        return "English";
    }
  }
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
            `/private/vehicleCategory/${category._id}`
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

      // if (window.confirm("Are you sure you want to delete this taxi?")) {
      //   const { data } = await axios.delete(
      //     `/private/vehicleCategory/${category._id}`
      //     // , {
      //     // icon: category.icon,
      //     // title: category.title,
      //     // }
      //   );
      //   console.log(data);
      //   getCategoriesContent(page, limit, search);
      //   toast.success("Deleted", {
      //     position: toast.POSITION.TOP_RIGHT,
      //   });
      // } else {
      //   toast.error("You have cancelled the operation", {
      //     position: toast.POSITION.TOP_RIGHT,
      //   });
      // }
    } catch (error) {
      console.log(error);
      toast.error(error, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  // status switch

  const statusSwitch = async (e, category) => {
    if (category.baseRate !== null || undefined) {
      try {
        const { data } = await axios.put(`/private/vehicleCategory/${category._id}`, {
          isActive: e.target.checked,
        });

        console.log(data);
        // console.log(e.target.checked);
        toast.success(data.data.isActive ? "Activated" : "Deactivated", {
          position: toast.POSITION.TOP_RIGHT,
        });
        getCategoriesContent();
      } catch (error) {
        console.log(error);
      }
    } else {
      toast.error("Please add fare first", {
        position: toast.POSITION.TOP_RIGHT,
      });
      // props.history.push({
      //   pathname: "/adminPanel/FareTaxiSingle",
      //   state: category,
      // });
      setModalState({
        isFareTaxiSingle: true,
      });
      setSelectedTaxiData(category);
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

  const SearchTaxiSingle = myDeb((search) => {
    getCategoriesContent(page, limit, search.toLowerCase());
  });

  console.log(modalState);
  const addNewTaxiSingle = async (values) => {
    try {
      console.log(values);

      const { data } = await axios.post("/private/vehicleCategory", {
        title: values.name,
        icon: values.ImageLink,
        description: values.description,
      });
      // props.history.push({
      //   pathname: "/adminPanel/TaxiSingleManagement",
      // });
      setSelectedTaxiDataAddEdit(null);
      setModalState({ isAddEditTaxiSingle: false });
      toast.success(data.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      getCategoriesContent();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  const EditTaxiSingle = async (values) => {
    if (selectedTaxiDataAddEdit?.icon === values.ImageLink) {
      try {
        console.log(values);
        // DeleteImage();

        const { data } = await axios.put(`/private/vehicleCategory/${selectedTaxiDataAddEdit?._id}`, {
          // title: values.name,
          icon: values.ImageLink,
          // description: values.description,
        });

        // props.history.push({
        //   pathname: "/adminPanel/TaxiSingleManagement",
        // });
        // setSelectedTaxiDataAddEdit(null);
        // setModalState({ isAddEditTaxiSingle: false });
        // toast.success(data.message, {
        //   position: toast.POSITION.TOP_RIGHT,
        // });
        // getCategoriesContent();
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        console.log(values);
        // DeleteImage();

        const { data } = await axios.put(`/private/vehicleCategory/${selectedTaxiDataAddEdit?._id}`, {
          title: values.name,
          icon: values.ImageLink,
          description: values.description,
        });

        // props.history.push({
        //   pathname: "/adminPanel/TaxiSingleManagement",
        // });
        await DeleteImage();
        setSelectedTaxiDataAddEdit(null);
        setModalState({ isAddEditTaxiSingle: false });
        toast.success(data.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
        // getCategoriesContent();
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    }
  };
  const DeleteImage = async () => {
    console.log(selectedTaxiDataAddEdit);
    setDeletingImage(true);
    let imageID = !selectedTaxiDataAddEdit ? "" : selectedTaxiDataAddEdit?.icon.split("/")[3];
    console.log(imageID);
    try {
      const { data } = await Axios.get(`http://18.221.140.83:3000/fileDelete/${imageID}`);
      setDeletingImage(false);
    } catch (error) {
      console.log(error);
    }
  };

  const EditFareTaxiSingle = async (values) => {
    try {
      console.log(values);

      const { data } = await axios.put(`/private/vehicleCategory/fare/${selectedTaxiData._id}`, {
        baseRate: values.baseRate,
        distanceRate: values.distanceRate,
        adminCommission: values.adminCommission,
        cancellationFee: values.cancellationFee,
        timeRate: values.timeRate,
        adminCancellationFee: values.adminCancellationFee,
        // driverCancellationFee: values.driverCancellationFee,
        // "ajk",
        // values.timeRate || state.timeRate,
        // is_active: state.is_active,
      });
      // props.history.push({
      //   pathname: "/adminPanel/TaxiSingleManagement",
      // });
      setSelectedTaxiData("");
      setModalState({ isFareTaxiSingle: false });
      toast.success(data.messages, {
        position: toast.POSITION.TOP_RIGHT,
      });
      getCategoriesContent();
      console.log(data);
    } catch (error) {
      const errors = error.response.data.errors;
      console.log(errors);
      var err = {};
      errors.map((e) => {
        err[e.param] = e.msg;
      });
      //  toast.success(errors.messages, {
      //    position: toast.POSITION.TOP_RIGHT,
      //  });
    }
  };

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    let checkEnglish = selectedTaxiDataAddEdit?.languages.find((ele) => filterLanguageValue(ele.lang) === "English");
    let checkSpanish = selectedTaxiDataAddEdit?.languages.find((ele) => filterLanguageValue(ele.lang) === "Spanish");
    let checkKorean = selectedTaxiDataAddEdit?.languages.find((ele) => filterLanguageValue(ele.lang) === "Korean");
    let checkChinese = selectedTaxiDataAddEdit?.languages.find((ele) => filterLanguageValue(ele.lang) === "Chinese");
    switch (newValue) {
      case 0:
        setSelectedLanguage((langs) => ({
          ...langs,
          [selectedTaxiDataAddEdit?._id]: { label: "English", value: "English" },
        }));
        // setSelectedLanguage({ ...selectedLanguage, selectedLanguage?.find((ele)=>(ele)) });
        // setLanguageInputs({
        //   ...LanguageInputs,
        //   name: checkEnglish?.title,
        //   file1: "",
        //   ImageLink: get(selectedTaxiDataAddEdit, "icon", ""),
        //   description: checkEnglish?.description,
        //   objectId: get(selectedTaxiDataAddEdit, "_id", ""),
        //   languageObjectId: checkEnglish?._id,
        // });
        break;
      case 1:
        setSelectedLanguage((langs) => ({
          ...langs,
          [selectedTaxiDataAddEdit?._id]: { label: "Spanish", value: "Spanish" },
        }));
        // setLanguageInputs({
        //   ...LanguageInputs,
        //   name: checkSpanish?.title,
        //   file1: "",
        //   ImageLink: get(selectedTaxiDataAddEdit, "icon", ""),
        //   description: checkSpanish?.description,
        //   objectId: get(selectedTaxiDataAddEdit, "_id", ""),
        //   languageObjectId: checkSpanish?._id,
        // });
        break;
      case 2:
        setSelectedLanguage((langs) => ({
          ...langs,
          [selectedTaxiDataAddEdit?._id]: { label: "Korean", value: "Korean" },
        }));
        // setLanguageInputs({
        //   ...LanguageInputs,
        //   name: checkKorean?.title,
        //   file1: "",
        //   ImageLink: get(selectedTaxiDataAddEdit, "icon", ""),
        //   description: checkKorean?.description,
        //   objectId: get(selectedTaxiDataAddEdit, "_id", ""),
        //   languageObjectId: checkKorean?._id,
        // });
        break;
      case 3:
        setSelectedLanguage((langs) => ({
          ...langs,
          [selectedTaxiDataAddEdit?._id]: { label: "Chinese", value: "Chinese" },
        }));
        // setLanguageInputs({
        //   ...LanguageInputs,
        //   name: checkChinese?.title,
        //   file1: "",
        //   ImageLink: get(selectedTaxiDataAddEdit, "icon", ""),
        //   description: checkChinese?.description,
        //   objectId: get(selectedTaxiDataAddEdit, "_id", ""),
        //   languageObjectId: checkChinese?._id,
        // });
        break;
      default:
        break;
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

  const updateLanguageData = async (values) => {
    console.log(values);
    try {
      const { data } = await axios.put(`/private/VehicleLanguagesUpdate`, {
        objectId: values.objectId,
        lang: values.lang,
        title: values.name,
        description: values.description,
      });
      toast.success(data.messages, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setSelectedTaxiDataAddEdit(null);
      setModalState({ isAddEditTaxiSingle: false });
      getCategoriesContent();
    } catch (err) {
      console.log(err);
    }
  };

  // const setTabValue = (value) => {
  //   console.log(value);
  //   switch (value) {
  //     case "English":
  //       setValue(0);
  //       break;
  //     case "Spanish":
  //       setValue(1);
  //       break;
  //     case "Korean":
  //       setValue(2);
  //       break;
  //     case "Chinese":
  //       setValue(3);
  //       break;

  //     default:
  //       break;
  //   }
  // };

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
  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };
  const getItemStyle = (isDragging, draggableStyle) => ({
    background: isDragging ? "#757ce8" : "white",
    ...draggableStyle,
  });

  const onDragEnd = async (result) => {
    if (!result.destination) {
      return;
    }
    let movedItems = reorder(tableData, result.source.index, result.destination.index);
    let arr = [];
    arr = movedItems;
    console.log("moveeeeeeeeeed", arr);
    setTableData(movedItems);
    console.log(movedItems);
    const newArray = arr.map((ele, i) => ({ id: ele._id, position: i }));
    console.log(newArray);
    //  const attValues = {
    //    category_id: categoryId,
    //    fields: movedItems,
    //  };
    //  console.log(attValues);
    //  if (attValues) {
    try {
      const { data } = await axios.put("/private/vehiclePostionChange", {
        data: newArray,
      });
      //      console.log(data);
      getCategoriesContent();

      toast.success(`${data.message}`, {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      toast.error(`${error.response.data.message}`, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
    // } else {
    // return "";
    //  }
  };

  return (
    <>
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
                    
                  
                    <SearchBar
                      className={"heightfix  "}
                      style={{ borderRadius: "25px" }}
                      onChange={(searchVal) => SearchTaxiSingle(searchVal)}
                      onCancelSearch={() => cancelSearch()}
                      placeholder="Search by Vehicle Name"
                    />
                  
                  </div>
                  <Tooltip title={<span style={{ color: "white", fontSize: "16px" }}>Add Vehicle Type</span>} arrow>
                      <IconButton
                        className="buttoncss"
                        style={{ backgroundColor: "#0059cd", color: "#fff" }}
                        onClick={() => {
                          setModalState({ isAddEditTaxiSingle: true });
                          setSelectedTaxiDataAddEdit(null);
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
                    <Table className={classes.table} stickyHeader size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell style={{ fontWeight: "bold" }}>Sr. No.</TableCell>
                          <TableCell style={{ fontWeight: "bold" }}> Vehicle Name</TableCell>
                          <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Vehicle Image</TableCell>
                          <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Vehicle Description</TableCell>
                          <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Status</TableCell>
                          <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Actions</TableCell>
                          {/* <TableCell>User Type</TableCell>
                              <TableCell>Status</TableCell> */}
                        </TableRow>
                      </TableHead>
                      <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="droppable">
                          {(provided, snapshot) => (
                            <TableBody {...provided.droppableProps} ref={provided.innerRef}>
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
                                .sort((a, b) => (a.position > b.position ? 1 : -1))
                                // .slice(
                                //   page * rowsPerPage,
                                //   page * rowsPerPage + rowsPerPage
                                // )
                                // .reverse()
                                .map((category, index) => (
                                  <Draggable
                                    key={category.position}
                                    draggableId={"q-" + category.position}
                                    index={category.position}
                                  >
                                    {(provided, snapshot) => (
                                      <TableRow
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                                      >
                                        <TableCell component="th" scope="row" className={classes.textMiddle}>
                                          {index + 1 + page * rowsPerPage}
                                        </TableCell>
                                        <TableCell className={classes.textMiddle} style={{ textTransform: "capitalize" }}>
                                          {
                                            category?.languages.find(
                                              (ele) => filterLanguageValue(ele.lang) === selectedLanguage[category._id]?.value
                                            )?.title
                                          }
                                          {/* {console.log(category?.languages.find((ele) => ele.lang === selectedLanguage[category._id]?.value)?..title)} */}
                                        </TableCell>

                                        <TableCell style={{ textAlign: "center" }}>
                                          {category.icon ? (
                                            <img src={category.icon} alt="image" style={{ width: "35px", height: "35px" }} />
                                          ) : (
                                            <img
                                              src={require("../../assets/images/logo/happyTaxi.png")}
                                              alt="image"
                                              style={{ width: "35px", height: "35px" }}
                                            />
                                          )}
                                        </TableCell>
                                        <TableCell
                                          className={classes.textMiddle}
                                          style={{ textAlign: "center", textTransform: "capitalize" }}
                                        >
                                          {
                                            category?.languages.find(
                                              (ele) => filterLanguageValue(ele.lang) === selectedLanguage[category._id]?.value
                                            )?.description
                                          }
                                        </TableCell>
                                        <TableCell className={classes.textMiddle} style={{ textAlign: "center" }}>
                                          <Tooltip
                                            title={
                                              <span className="TooltipCustomSize">{`${
                                                category?.isActive ? "Active" : "Inactive"
                                              }`}</span>
                                            }
                                            arrow
                                          >
                                            <Button>
                                              <IOSSwitch
                                                onChange={(e) => {
                                                  statusSwitch(e, category);
                                                }}
                                                checked={category.isActive}
                                              />
                                            </Button>
                                          </Tooltip>
                                        </TableCell>

                                        <TableCell
                                          className={classes.textMiddle}
                                          style={{ textAlign: "center", whiteSpace: "nowrap" }}
                                        >
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
                                          <Button
                                            className="WidgetButton"
                                            onClick={() => {
                                              setSelectedTaxiData(category);
                                              setModalState({
                                                isFareTaxiSingle: true,
                                              });
                                            }}
                                          >
                                            <Tooltip title={<span className="TooltipCustomSize">Manage</span>} arrow>
                                              <WidgetsOutlined />
                                            </Tooltip>
                                          </Button>
                                          <Button
                                            className="EditButton mx-2"
                                            onClick={() => {
                                              setModalState({ isAddEditTaxiSingle: true });
                                              setSelectedTaxiDataAddEdit(category);
                                            }}
                                          >
                                            <Tooltip title={<span className="TooltipCustomSize">Edit</span>} arrow>
                                              <EditIcon />
                                            </Tooltip>
                                          </Button>

                                          {/* <Button className="DeleteButton" onClick={() => DeleteTaxiSingle(category)}>
                                  <Tooltip title={<span className="TooltipCustomSize">Delete</span>} arrow>
                                    <DeleteOutline />
                                  </Tooltip>
                                </Button> */}
                                        </TableCell>
                                      </TableRow>
                                    )}
                                  </Draggable>
                                ))}
                              {provided.placeholder}
                            </TableBody>
                          )}
                        </Droppable>
                      </DragDropContext>
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
      {console.log("fixed", selectedLanguage[selectedTaxiDataAddEdit?._id]?.value)}
      {/* FareTaxi Single */}
      <Modal
        maxWidth="lg"
        width="840px"
        isOpen={modalState.isFareTaxiSingle}
        // onClose={() => {
        //   setModalState({
        //     isFareTaxiSingle: false,
        //   });
        //   setSelectedTaxiData("");
        // }}
        onClose={(event, reason) => {
          if (reason && (reason === "backdropClick" || "escapeKeyDown")) {
            console.log(reason);
            setModalState({
              isFareTaxiSingle: true,
            });
          } else {
            setModalState({
              isFareTaxiSingle: false,
            });
            setSelectedTaxiData("");
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
              Single Taxi Trip Fare
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
                    isFareTaxiSingle: false,
                  });
                  setSelectedTaxiData("");
                }}
              />
            </div>
          </div>
        }
        content={
          <>
            <Formik
              initialValues={{
                baseRate: get(selectedTaxiData, "baseRate", ""),
                timeRate: get(selectedTaxiData, "timeRate", ""),
                distanceRate: get(selectedTaxiData, "distanceRate", ""),
                adminCommission: get(selectedTaxiData, "adminCommission", ""),
                cancellationFee: get(selectedTaxiData, "cancellationFee", ""),
                adminCancellationFee: get(selectedTaxiData, "adminCancellationFee", ""),
                // driverCancellationFee: get(selectedTaxiData, "driverCancellationFee", ""),
              }}
              validate={(values) => handleValidateManageFare(values)}
              onSubmit={(values) => {
                console.log(values);
                if (selectedTaxiData !== "") {
                  EditFareTaxiSingle(values);
                } else {
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
                        <label>
                          Base Rate <span style={{ color: "#85BB65", fontWeight: "bold" }}>(in USD)</span>:
                        </label>
                        <Field name="baseRate">
                          {({ field }) => (
                            <Input
                              {...field}
                              type="number"
                              onChange={(e) => {
                                formikBag.setFieldValue("baseRate", e.target.value);
                              }}
                              error={formikBag.touched.baseRate && formikBag.errors.baseRate ? formikBag.errors.baseRate : null}
                              className="form-control"
                              placeholder={"Enter Base Rate"}
                            />
                          )}
                        </Field>
                      </div>
                      <div className="col-md-6">
                        <label>
                          Time Rate<span style={{ color: "brown", fontWeight: "bold" }}>(per min)</span>
                          <span style={{ color: "#85BB65", fontWeight: "bold" }}>(in USD)</span>:
                        </label>
                        <Field name="timeRate">
                          {({ field }) => (
                            <Input
                              {...field}
                              type="number"
                              onChange={(e) => {
                                formikBag.setFieldValue("timeRate", e.target.value);
                              }}
                              error={formikBag.touched.timeRate && formikBag.errors.timeRate ? formikBag.errors.timeRate : null}
                              className="form-control"
                              placeholder={"Enter Time Rate"}
                            />
                          )}
                        </Field>
                      </div>
                    </div>

                    <div className="row my-3">
                      <div className="col-md-6">
                        <label>
                          Distance Rate<span style={{ color: "brown", fontWeight: "bold" }}>(per mile)</span>
                          <span style={{ color: "#85BB65", fontWeight: "bold" }}>(in USD)</span>:
                        </label>
                        <Field name="distanceRate">
                          {({ field }) => (
                            <Input
                              {...field}
                              type="number"
                              onChange={(e) => {
                                formikBag.setFieldValue("distanceRate", e.target.value);
                              }}
                              error={
                                formikBag.touched.distanceRate && formikBag.errors.distanceRate
                                  ? formikBag.errors.distanceRate
                                  : null
                              }
                              className="form-control"
                              placeholder={"Enter Distance Rate"}
                            />
                          )}
                        </Field>
                      </div>
                      <div className="col-md-6">
                        <label>
                          Admin Commission<span style={{ color: "#e3941e", fontWeight: "bold" }}>(in %)</span>:
                        </label>
                        <Field name="adminCommission">
                          {({ field }) => (
                            <Input
                              {...field}
                              type="text"
                              onChange={(e) => {
                                formikBag.setFieldValue("adminCommission", e.target.value);
                              }}
                              error={
                                formikBag.touched.adminCommission && formikBag.errors.adminCommission
                                  ? formikBag.errors.adminCommission
                                  : null
                              }
                              className="form-control"
                              placeholder={"Enter Admin Commission"}
                            />
                          )}
                        </Field>
                      </div>
                    </div>

                    <div className="row my-3">
                      <div className="col-md-6">
                        <label>
                          Total Cancellation Fee<span style={{ color: "#e3941e", fontWeight: "bold" }}>(in %)</span>:
                        </label>
                        <Field name="cancellationFee">
                          {({ field }) => (
                            <Input
                              {...field}
                              type="text"
                              onChange={(e) => {
                                formikBag.setFieldValue("cancellationFee", e.target.value);
                              }}
                              error={
                                formikBag.touched.cancellationFee && formikBag.errors.cancellationFee
                                  ? formikBag.errors.cancellationFee
                                  : null
                              }
                              className="form-control"
                              placeholder={"Enter Cancellation Fee"}
                            />
                          )}
                        </Field>
                      </div>
                      <Tooltip
                        title={
                          <span style={{ fontSize: "20px" }}>
                            eg. if total cancellation fee(in%)=20 then admin cancellation fee= X% of 20
                          </span>
                        }
                        arrow
                      >
                        <div className="col-md-6">
                          <label>
                            {" "}
                            Admin Cancellation Fee<span style={{ color: "#e3941e", fontWeight: "bold" }}>(in %)</span>:
                          </label>
                          <Field name="adminCancellationFee">
                            {({ field }) => (
                              <Input
                                {...field}
                                type="text"
                                onChange={(e) => {
                                  if (e.nativeEvent.data) {
                                    if (e.target.value > 100) {
                                    } else {
                                      let code = e.nativeEvent.data.charCodeAt(0);
                                      if (code >= 48 && code <= 57) {
                                        formikBag.setFieldValue("adminCancellationFee", e.target.value);
                                        // formikBag.setFieldValue("driverCancellationFee", 100 - e.target.value);
                                      }
                                    }
                                  } else {
                                    formikBag.setFieldValue("adminCancellationFee", e.target.value);
                                    // formikBag.setFieldValue("driverCancellationFee", 100 - e.target.value);
                                  }
                                }}
                                error={
                                  formikBag.touched.adminCancellationFee && formikBag.errors.adminCancellationFee
                                    ? formikBag.errors.adminCancellationFee
                                    : null
                                }
                                className="form-control"
                                placeholder={"Enter Admin Cancellation Fee"}
                              />
                            )}
                          </Field>
                        </div>
                      </Tooltip>
                    </div>

                    {/* <div className="row my-3">
                      <div className="col-md-6">
                        <label> Driver Cancellation Fee(in %):</label>
                        <Field name="driverCancellationFee">
                          {({ field }) => (
                            <Input
                              {...field}
                              type="text"
                              onChange={(e) => {
                                if (e.nativeEvent.data) {
                                  if (e.target.value > 100) {
                                  } else {
                                    let code = e.nativeEvent.data.charCodeAt(0);
                                    if (code >= 48 && code <= 57) {
                                      formikBag.setFieldValue("driverCancellationFee", e.target.value);
                                      formikBag.setFieldValue("adminCancellationFee", 100 - e.target.value);
                                    }
                                  }
                                } else {
                                  formikBag.setFieldValue("driverCancellationFee", e.target.value);
                                  formikBag.setFieldValue("adminCancellationFee", 100 - e.target.value);
                                }
                              }}
                              error={
                                formikBag.touched.driverCancellationFee && formikBag.errors.driverCancellationFee
                                  ? formikBag.errors.driverCancellationFee
                                  : null
                              }
                              className="form-control"
                              placeholder={"Enter Driver Cancellation Fee"}
                            />
                          )}
                        </Field>
                      </div>
                    </div> */}
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

      {/* AddEdit Taxi Single */}
      <Modal
        maxWidth="lg"
        width="840px"
        isOpen={modalState.isAddEditTaxiSingle}
        onClose={(event, reason) => {
          if (reason && (reason === "backdropClick" || "escapeKeyDown")) {
            console.log(reason);
            setModalState({
              isAddEditTaxiSingle: true,
            });
          } else {
            setModalState({
              isAddEditTaxiSingle: false,
            });
            setSelectedTaxiDataAddEdit(null);
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
              {selectedTaxiDataAddEdit === null ? "Add Vehicle Type" : "Edit Vehicle Type"}
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
                    isAddEditTaxiSingle: false,
                  });
                  setSelectedTaxiDataAddEdit(null);
                  setLanguageInputs({});
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
              initialValues={
                // LanguageInputs
                {
                  name: selectedTaxiDataAddEdit?.languages.find(
                    (ele) => filterLanguageValue(ele.lang) === selectedLanguage[selectedTaxiDataAddEdit?._id]?.value
                  )?.title,
                  file1: "",
                  ImageLink: get(selectedTaxiDataAddEdit, "icon", ""),
                  description: selectedTaxiDataAddEdit?.languages.find(
                    (ele) => filterLanguageValue(ele.lang) === selectedLanguage[selectedTaxiDataAddEdit?._id]?.value
                  )?.description,
                  objectId: get(selectedTaxiDataAddEdit, "_id", ""),
                  languageObjectId: selectedTaxiDataAddEdit?.languages.find(
                    (ele) => filterLanguageValue(ele.lang) === selectedLanguage[selectedTaxiDataAddEdit?._id]?.value
                  )?._id,
                  lang: selectedTaxiDataAddEdit?.languages.find(
                    (ele) => filterLanguageValue(ele.lang) === selectedLanguage[selectedTaxiDataAddEdit?._id]?.value
                  )?.lang,
                }
              }
              validate={(values) => handleValidateAddEditSingleTaxi(values, selectedTaxiDataAddEdit)}
              onSubmit={(values) => {
                console.log(values);
                if (selectedTaxiDataAddEdit !== null) {
                  EditTaxiSingle(values);
                  updateLanguageData(values);
                } else {
                  addNewTaxiSingle(values);
                  console.log("gadbad");
                }
              }}
            >
              {(formikBag) => (
                <Form style={{ width: "100%" }}>
                  <div className="container">
                    <div className="row mt-2 mb-5 justify-content-center">
                      {selectedTaxiDataAddEdit !== null ? (
                        <Tabs
                          value={getTabValue(selectedLanguage[selectedTaxiDataAddEdit?._id]?.value)}
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
                        <label>Vehicle Name :</label>
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
                              placeholder={"Enter Vehicle Name"}
                            />
                          )}
                        </Field>
                      </div>
                      <div className="col-md-6">
                        <label>Description:</label>
                        <Field name="description">
                          {({ field }) => (
                            <>
                              <Input
                                {...field}
                                type="textarea"
                                onChange={(e) => {
                                  formikBag.setFieldValue("description", e.target.value);
                                }}
                                error={
                                  formikBag.touched.description && formikBag.errors.description
                                    ? formikBag.errors.description
                                    : null
                                }
                                className="form-control"
                                placeholder={"Enter Description"}
                              />
                              <div>
                                <span>{formikBag?.values?.description?.length}/100</span>
                              </div>
                            </>
                          )}
                        </Field>
                      </div>
                    </div>

                    <div className="row my-3">
                      <div className="col-md-6">
                        <label>
                          Vehicle Image<span style={{ color: "#85BB65", fontWeight: "bold" }}>(145x145)</span>:
                        </label>
                        <Field name="file1">
                          {({ field }) => (
                            <Input
                              {...field}
                              type="file"
                              value={undefined}
                              // onChange={(e) => {
                              //   formikBag.setFieldValue("file1", e.target.value);
                              // }}
                              accept="image/png, image/jpeg , image/jpg"
                              onChange={async (e) => {
                                // if (!selectedTaxiDataAddEdit) {
                                const [file] = e.target.files;
                                console.log(file);
                                if (file) {
                                  const img = new Image();
                                  console.log(URL.createObjectURL(file));
                                  img.src = URL.createObjectURL(file);
                                  img.onload = async () => {
                                    if (img.width === 145 && img.height === 145) {
                                      // alert("Image Dimensions accepted");
                                      imageVerificationAlert(true);
                                      let data = await uploadForm(file);
                                      formikBag.setFieldValue("file1", file);
                                      formikBag.setFieldValue("ImageLink", data);
                                      //  setProfileImagepath(data);
                                    } else {
                                      // alert("Image Dimensions not accepted");
                                      imageVerificationAlert(false);
                                      formikBag.setFieldValue("file1", "");
                                      formikBag.setFieldValue("ImageLink", "");
                                      //  setProfileImagepath("");
                                    }
                                  };
                                }
                                // } else {
                                //   const [file] = e.target.files;
                                //   console.log(file);
                                //   if (file) {
                                //     const img = new Image();
                                //     console.log(URL.createObjectURL(file));
                                //     img.src = URL.createObjectURL(file);
                                //     img.onload = async () => {
                                //       if (img.width === 145 && img.height === 145) {
                                //         // alert("Image Dimensions accepted");
                                //         imageVerificationAlert(true);
                                //         let data = await uploadForm(file);
                                //         formikBag.setFieldValue("file1", file);
                                //         formikBag.setFieldValue("ImageLink", data);
                                //         // DeleteImage();
                                //         //  setProfileImagepath(data);
                                //       } else {
                                //         // alert("Image Dimensions not accepted");
                                //         imageVerificationAlert(false);
                                //         formikBag.setFieldValue("file1", "");
                                //         formikBag.setFieldValue("ImageLink", "");
                                //         //  setProfileImagepath("");
                                //       }
                                //     };
                                //   }
                                // }
                              }}
                              error={formikBag.touched.file1 && formikBag.errors.file1 ? formikBag.errors.file1 : null}
                              className="form-control"
                              placeholder={"Enter Vehicle Image"}
                            />
                          )}
                        </Field>
                      </div>

                      <div className="col-md-6">
                        {/* <label>Preview:</label> */}
                        <Field name="ImageLink">
                          {({ field }) => (
                            <>
                              <img
                                {...field}
                                alt="vehicle image"
                                src={formikBag.values.ImageLink}
                                style={{
                                  width: 145,
                                  height: 145,
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
            loading={isLoading}
            size={100}
            // aria-label="Loading Spinner"
            // data-testid="loader"
          />
        </div>
      )}
    </>
  );
}
