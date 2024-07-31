import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import axios from "../../axios";
import { toast } from "react-toastify";

// import Switch from '@mui/material/Switch';
import AddIcon from "@material-ui/icons/Add";
import Swal from "sweetalert2";

// import { styled } from '@mui/material/styles';
// import Skeleton from "react-loading-skeleton";
// import "react-loading-skeleton/dist/skeleton.css";
import moment from "moment";
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
import ModalImage from "react-modal-image";
import { Input, Modal } from "../../components/index";
import { AiOutlineClose } from "react-icons/ai";
import { useUploadImage } from "../../services/Imagecustomhook";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";
import Axios from "axios";
import { handleValidateAddEditCard ,handleValidateAddEditCategory} from "../../utils/validators";
import NoDataFound from "../../components/NoDataFound";
import PuffLoader from "react-spinners/PuffLoader";
import { ImageUploadUrl } from "../../statics/constants";
import GiftCardManagement3 from "../GiftCardManagement/GiftCardManagement3"
import BeatLoader from "react-spinners/BeatLoader";
import SelectInput from "../../components/Select";
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
    padding: "0rem 0rem",
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
    // height:"auto"
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

export default function BannerManagement(props) {
  const classes = useStyles();
  const [rselKey, setRselKey] = useState(0);
  // const history=useHistory();
// const [selectedCard,setSelectedCard]=useState( {
                
//   name:"",
//   category:"",
//   file1: "",
//   // ImageLink: get(selectedBannerData, "image", ""),
//   ImageLink:"",
//   _id:""
//   })
const [selectedCard,setSelectedCard]=useState( {
                
  nameEnglish:"",
  nameChinese:"",
  nameKorean:"",
  nameSpanish:"",
  category:"",
  file1: "",
  // ImageLink: get(selectedBannerData, "image", ""),
  ImageLink:"",
  _id:""
  }) 
  const [selectedCategory,setSelectedCategory]=useState( {
                
    nameEnglish:"",
    nameChinese:"",
    nameKorean:"",
    nameSpanish:"",
    _id:""
    }) 
  
  const [CategoryOrCard, setCategoryOrCard] = useState(1);
  const [OnOffButtonColor, setOnOffButtonColor] = useState({
    On: true,
    Off: false,
  });
  const [categoryList,setCategoryList]=useState([])
  const [categoryListAll,setCategoryListAll]=useState([])
const[htmlContent,setHTMLContent]=useState()
  const [tableData, setTableData] = useState([]);
  const [OldtableData, setOldTableData] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  // status switch
  // const [checked, setChecked] = useState(true);

  // For Pagination
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [totalUserListCount, settotalUserListCount] = useState(4);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  //
  const { isSuccess, uploadForm, progress } = useUploadImage(`${ImageUploadUrl}/fileUpload`);
  const [selectedBannerData, setSelectedBannerData] = useState(null);
  const [modalState, setModalState] = useState({
    isAddEditCategory: "",
    isAddEditCard:""
  });
  //

  const handleChangePage = (event, newPage) => {
    // console.log(event);
    // console.log(newPage);
    // console.log(newPage);
    // console.log({ event, newPage });
    // getCategoriesContent(newPage + 1, rowsPerPage, search);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    // getCategoriesContent(0, event.target.value, search);
    // setRowsPerPage(parseInt(event.target.value, 10));
    // console.log({ event });
    // setPage(0);
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    getCategoriesContent();
    getCategoriesList()
    setRselKey((k) => k + 1);
  }, [CategoryOrCard]);

  //get content
  const getCategoriesContent = async () => {
    setIsLoading(true);
    try {
     
      const { data } = await axios.get(
        
        CategoryOrCard==1? `/private/giftCardCategorieList`: `/private/giftCardList`
      );
      
      console.log(data);
      setTableData([...data.data]);
      setOldTableData([...data.data]);
      //   setSearchedData(data.data.docs);
      setSearch(search);
      settotalUserListCount(data.data.length);
      setIsLoading(false);
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

  const EditBanner = (category) => {
    props.history.push({
      pathname: "/adminPanel/AddEditBanner",
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
  const DeleteBanner = async (category) => {
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
            `/private/banner/${category._id}`
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
      // if (window.confirm("Are you sure you want to delete this Banner?")) {
      //   const { data } = await axios.delete(
      //     `/private/banner/${category._id}`
      //     // , {
      //     // icon: category.icon,
      //     // title: category.title,
      //     // }
      //   );
      //   console.log(data);
      //   getCategoriesContent();
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
    try {
      //   console.log(id);

      const { data } = await axios.put(`/private/banner/${category._id}`, {
        // percentage: category.percentage,
        isActive: e.target.checked,
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

  

  const cancelSearch = () => {
    getCategoriesContent();
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

  const addNew = async (values) => {
    if(CategoryOrCard==0){
    try {
      console.log(values);

      const { data } = await axios.post(`/private/giftCardAddEdit`, {
  //  title:values.name,
  languages: [
    {
        lang:"en",
        title:values.nameEnglish
    },
     {
        lang:"zh",
        title:values.nameChinese
    },
     {
        lang:"ko",
        title:values.nameKorean
     },
     {
        lang:"es",
        title:values.nameSpanish
    }
],
   image:values.ImageLink,
   categorieId:values.category.value
     }
      );
    
     
      getCategoriesContent();
      toast.success(data.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      // setSelectedBannerData("");
      setSelectedCard({
                
        // name:"",
        nameEnglish:"",
  nameChinese:"",
  nameKorean:"",
  nameSpanish:"",
        category:"",
        file1: "",
        // ImageLink: get(selectedBannerData, "image", ""),
        ImageLink:"",
        _id:""
        })
      setModalState({ isAddEditCard: false });
      console.log(data);
    } catch (error) {
      console.log(error);
    }}else{
      try {
        console.log(values);
  
        const { data } = await axios.post(`/private/giftCardCategorieAddEdit`, {
    //  title:values.name,
    data: [
      {
          lang:"en",
          title:values.nameEnglish
      },
       {
          lang:"zh",
          title:values.nameChinese
      },
       {
          lang:"ko",
          title:values.nameKorean
       },
       {
          lang:"es",
          title:values.nameSpanish
      }
  ],
    
       }
        );
      
        setModalState({ isAddEditCategory: false });
        getCategoriesContent();
        toast.success(data.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
        // setSelectedBannerData("");
        setSelectedCategory({
          nameEnglish:"",
          nameChinese:"",
          nameKorean:"",
          nameSpanish:"",
          _id:""
        });
       
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    }
  };
  const Edit = async (values) => {
    if(CategoryOrCard==0){
    try {
      console.log(values);

      const { data } = await axios.post(`/private/giftCardAddEdit`, {
        _id:values._id,
  //  title:values.name,
  languages: [
    {
        lang:"en",
        title:values.nameEnglish
    },
     {
        lang:"zh",
        title:values.nameChinese
    },
     {
        lang:"ko",
        title:values.nameKorean
     },
     {
        lang:"es",
        title:values.nameSpanish
    }
],
   image:values.ImageLink,
   categorieId:values.category.value
     }
      );
    
     
      getCategoriesContent();
      toast.success(data.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      // setSelectedBannerData("");
      setSelectedCard({
                
        // name:"",
        nameEnglish:"",
  nameChinese:"",
  nameKorean:"",
  nameSpanish:"",
        category:"",
        file1: "",
        // ImageLink: get(selectedBannerData, "image", ""),
        ImageLink:"",
        _id:""
        })
      setModalState({ isAddEditCard: false });
      console.log(data);
    } catch (error) {
      console.log(error);
    }}else{
      try {
        console.log(values);
  
        const { data } = await axios.post(`/private/giftCardCategorieAddEdit`, {
    //  title:values.name,
    data: [
      {
          lang:"en",
          title:values.nameEnglish
      },
       {
          lang:"zh",
          title:values.nameChinese
      },
       {
          lang:"ko",
          title:values.nameKorean
       },
       {
          lang:"es",
          title:values.nameSpanish
      }
  ],
    _id:values._id
       }
        );
      
        setModalState({ isAddEditCategory: false });
        getCategoriesContent();
        toast.success(data.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
        // setSelectedBannerData("");
        setSelectedCategory({
                
          // name:"",
          nameEnglish:"",
  nameChinese:"",
  nameKorean:"",
  nameSpanish:"",
         
          _id:""
          })
      
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  // Edit Category . update api

//   const EditBannerImage = async (values) => {
//     if (selectedBannerData?.image === values.ImageLink) {
//       try {
//         console.log(values);

//         const { data } = await axios.put(`/private/banner/${selectedBannerData._id}`, {
//           image: values.ImageLink,
//           isActive: selectedBannerData.isActive,
//           // description: values.description || state.description,
//           // is_active: state.is_active,
//         });
//         getCategoriesContent();
//         toast.success(data.message, {
//           position: toast.POSITION.TOP_RIGHT,
//         });
//         setSelectedBannerData("");
//         setModalState({ isAddEditBanner: false });
//         console.log(data);
//       } catch (error) {
//         console.log(error);
//       }
//     } else {
//       try {
//         console.log(values);

//         const { data } = await axios.put(`/private/banner/${selectedBannerData._id}`, {
//           image: values.ImageLink,
//           isActive: selectedBannerData.isActive,
//           // description: values.description || state.description,
//           // is_active: state.is_active,
//         });
//         await DeleteImage();
//         getCategoriesContent();
//         toast.success(data.message, {
//           position: toast.POSITION.TOP_RIGHT,
//         });
//         setSelectedBannerData("");
//         setModalState({ isAddEditBanner: false });
//         console.log(data);
//       } catch (error) {
//         console.log(error);
//       }
//     }
//   };
//   const DeleteImage = async () => {
//     let imageID = !selectedBannerData ? "" : selectedBannerData?.image.split("/")[3];
//     console.log(imageID);
//     try {
//       const { data } = await Axios.get(`http://18.221.140.83:3000/fileDelete/${imageID}`);
//     } catch (error) {
//       console.log(error);
//     }
//   };

const getCategoriesList=async()=>{
  const {data}=await axios.get(`/private/giftCardCategorieList`)
  console.log(data)
  let listing =data.data.map((ele)=>({label:(ele.languages[0].title).toUpperCase(),value:ele._id}))
  setCategoryList(listing)
  const l2 = listing.slice()
  l2.unshift({label:"All",value:"All"})
  setCategoryListAll(l2)
}
const DeleteCard=async(id)=>{
  const {data}=await axios.delete(`/private/giftCard/${id}`)
  getCategoriesContent();
  toast.success(data.message, {
    position: toast.POSITION.TOP_RIGHT,
  });
}
  const DeleteCategory=async(id)=>{
    const {data}=await axios.delete(`/private/giftCardCategorie/${id}`)
    getCategoriesContent();
    toast.success(data.message, {
      position: toast.POSITION.TOP_RIGHT,
    });
  
  }

  const requestSearch = (searchedVal) => {
   if(CategoryOrCard==1){
    const filteredRows = OldtableData.filter((row) => {
     
      let category=row.title;
     
      return (
        
        category.toLowerCase().includes(searchedVal.toLowerCase()) 
    
      
      );
    });
    setTableData(filteredRows);}else{
      const filteredRows = OldtableData.filter((row) => {
        let name = row.categories.title;
        let category=row.title;
       
        return (
          
        
          name.toLowerCase().includes(searchedVal.toLowerCase())
        
        );
      });
      setTableData(filteredRows);
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
                  style={{ backgroundColor: "transparent",padding:"1rem 0rem" }}
                  className={classNames(classes.paperHeading, classes.headingAlignment)}
                >
                   <SearchBar
                        // value={searched}
                        style={{  borderRadius: "25px" }}
                        className={"heightfix  "}
                         onChange={(searchVal) => requestSearch(searchVal)}
                        onCancelSearch={() => cancelSearch()}
                        placeholder={CategoryOrCard==1?"Search by Category":"Seach by Name"}
                        inputProps={{ maxLength: 30 }}
                      />
                  <div className="">
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      {" "}
                      <h5
                        style={{
                          margin: 0,
                          backgroundColor: CategoryOrCard == "1" ? "#006FFF" : "#c4c4c4",
                          transition: "1s",
                          color: "#fff",
                          flex: 1,
                          width: "200px",
                          // fontSize: "16px",
                          // borderRadius: "15px",
                          // backgroundColor: OnOffButtonColor.On ? "#006FFF" : "",
                          // width: "200px",
                          borderRadius: "5px 0px 0px 5px",
                          textAlign: "center",
                          padding: "10px",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          setOnOffButtonColor({ ...OnOffButtonColor, On: true, Off: false });
                          setCategoryOrCard(1);
                         
                        }}
                      >
                        {" "}
                        {isLoading && OnOffButtonColor.On ? (
                          <BeatLoader color="#fff" />
                        ) : OnOffButtonColor.On ? (
                          `Category (${totalUserListCount})`
                        ) : (
                          `Category`
                        )}
                      </h5>
                      <h5
                        style={{
                          margin: 0,
                          backgroundColor: CategoryOrCard == "0" ? "#006FFF" : "#c4c4c4",
                          transition: "1s",
                          color: "#fff",
                          flex: 1,
                          // width: "200px",
                          width: "200px",
                          textAlign: "center",
                          borderRadius: "0px 5px 5px 0px",
                          // fontSize: "16px",
                          // borderRadius: "15px",
                          // border: OnOffButtonColor.Off ? "3px solid #006FFF" : "",
                          padding: "10px",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          setOnOffButtonColor({ ...OnOffButtonColor, On: false, Off: true });
                          setCategoryOrCard(0);
                         
                        }}
                      >
                        {isLoading && OnOffButtonColor.Off ? (
                          <BeatLoader color="#fff" />
                        ) : OnOffButtonColor.Off ? (
                          `Gift Cards (${totalUserListCount})`
                        ) : (
                          `Gift Cards`
                        )}
                      </h5>
                    </div>
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
                        pathname: "/adminPanel/AddEditBanner",
                      });
                    }}
                  >
                    {" "}
                    Add Banner
                  </Button> */}
                  {/* <Tooltip title="Add Banner" arrow>
                    <IconButton
                      className="buttoncss"
                      style={{ backgroundColor: "#006FFF", color: "#fff" }}
                      onClick={() => {
                        props.history.push({
                          pathname: "/adminPanel/AddEditBanner",
                        });
                      }}
                    >
                      <AddIcon />
                    </IconButton>
                  </Tooltip> */}
                   <div className="" style={{display:"flex",gap:"0.5rem",alignItems:"center"}}>
                    {/* {
                    CategoryOrCard==0
                    ? */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
visibility:CategoryOrCard==0?"visible":"hidden",
                        // position: "relative",
                        zIndex: 3,
                      }}
                      className={""}
                    >
                      <span style={{ fontSize: "16px", fontWeight: "700" }}>Filter By Category :</span>&nbsp;
                      <div className="customReactSelect" style={{ width: "200px" }}>
                        <RSelect
                          key={rselKey}
                          options={categoryListAll}
                          isSearchable={false}
                           defaultValue={
                          {label:"All",value:"All"}
                           }
                          onChange={(e) => {
                            if(e.value=="All"){
                              setTableData(OldtableData)
                            }else{
                           let newdata= OldtableData.filter((ele)=>ele.categorieId==e.value)
                            setTableData(newdata)}
                          }}
                        />
                      </div>
                    </div>
                    {/* :
                    false
                    } */}
                  <Tooltip title={<span style={{ color: "white", fontSize: "16px" }}>{CategoryOrCard==1?"Add Category":"Add Card"}</span>} arrow>
                    <IconButton
                      className="buttoncss "
                      style={{ backgroundColor: "#0059cd", color: "#fff" }}
                      onClick={() => {
                        // props.history.push({
                        //   pathname: "/adminPanel/AddEditBanner",
                        // });
                        if(CategoryOrCard==1){
                          setModalState({ isAddEditCategory: true });
                        }else{
                          setModalState({ isAddEditCard: true });
                        }
                        // setSelectedBannerData(null);
                        // setModalState({ isAddEditBanner: true });
                      }}
                    >
                      <AddIcon />
                    </IconButton>
                  </Tooltip>
                  </div>
                </Paper>

                {/* //new design */}

                {/* <br /> */}

                {/* status end */}

                <Paper>
                  <TableContainer className={classes.container} style={{ minHeight: tableData.length > 0 ? "50vh" : "" }}>
                   {CategoryOrCard==1? <Table className={classes.table} stickyHeader size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell style={{ fontWeight: "bold" }}>Sr. No.</TableCell>
                          {/* <TableCell style={{ fontWeight: "bold" }}>
                            {" "}
                            Tip Name
                          </TableCell> */}
                          <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Created On</TableCell>
                          <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Category</TableCell>
                          <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Card Count</TableCell>
                          {/* <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Image</TableCell> */}
                         
                        
                          <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Action</TableCell>
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
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          //   .reverse()
                          .map((category, index) => (
                            <TableRow hover key={index}>
                              <TableCell component="th" scope="row" className={classes.textMiddle}>
                                {index + 1 + page * rowsPerPage}
                              </TableCell>
                              <TableCell className={classes.textMiddle} style={{ textAlign: "center" }}>
                                {moment(category?.createdAt).format("DD/MM/YYYY")}
                              </TableCell>
                              <TableCell className={classes.textMiddle} style={{ textAlign: "center",textTransform:"uppercase" }}>
                                {get(category.languages[0],"title","N/A")}
                              </TableCell>
                              <TableCell className={classes.textMiddle} style={{ textAlign: "center" }}>
                                {get(category,"card_count","N/A")}
                              </TableCell>
                              <TableCell className={classes.textMiddle} style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                              <Button
                                  className="EditButton mx-2"
                                  onClick={() => {
                                    setSelectedCategory(
                                      {
                
                                        // name:category.title,
                                        nameEnglish:category?.languages[0]?.title,
  nameChinese:category?.languages[1]?.title,
  nameKorean:category?.languages[2]?.title,
  nameSpanish:category?.languages[3]?.title,
  _id:category._id
                                       
                                        }
                                    );
                                    setModalState({ isAddEditCategory: true });
                                  }}
                                >
                                  <Tooltip title={<span style={{ fontSize: "16px" }}>Manage</span>} arrow>
                                    <EditIcon />
                                  </Tooltip>
                                </Button>
                            <Button
                                    // size="small"
                                    className="DeleteButton"
                                    onClick={() => DeleteCategory(category._id)}
                                  >
                                    <Tooltip title={<span style={{ fontSize: "16px" }}>Delete</span>} arrow>
                                      <DeleteOutline />
                                    </Tooltip>
                                  </Button>
                            
                            
                          
                            </TableCell>
                        

                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>:
                    <Table className={classes.table} stickyHeader size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell style={{ fontWeight: "bold" }}>Sr. No.</TableCell>
                        {/* <TableCell style={{ fontWeight: "bold" }}>
                          {" "}
                          Tip Name
                        </TableCell> */}
                        <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Created On</TableCell>
                        {/* <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Category Id</TableCell> */}
                        <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Category</TableCell>
                      
                        <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Name</TableCell>
                        <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Image</TableCell>
                        <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Action</TableCell>
                       
                      
                      
                      </TableRow>
                    </TableHead>

                    <TableBody>
                   
                      {tableData
                        // sortData()
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        //   .reverse()
                        .map((category, index) => (
                          <TableRow hover key={index}>
                            <TableCell component="th" scope="row" className={classes.textMiddle}>
                              {index + 1 + page * rowsPerPage}
                            </TableCell>
                            <TableCell className={classes.textMiddle} style={{ textAlign: "center" }}>
                              {moment(category?.createdAt).format("DD/MM/YYYY")}
                            </TableCell>
                            {/* <TableCell className={classes.textMiddle} style={{ textAlign: "center",textTransform:"uppercase" }}>
                              {get(category,"categorieId","N/A")}
                            </TableCell> */}
                            <TableCell className={classes.textMiddle} style={{ textAlign: "center",textTransform:"uppercase" }}>
                              {get(category,"categories.title","N/A")}
                            </TableCell>
                          
                            <TableCell className={classes.textMiddle} style={{ textAlign: "center" }}>
                              {get(category.languages[0],"title","N/A")}
                            </TableCell>
                            <TableCell
                              className={classes.textMiddle}
                              style={{ textAlign: "center", display: "flex", justifyContent: "center", alignItems: "center" }}
                            >
                              <div
                                className=""
                                style={{
                                  width: "40px",
                                  height: "40px",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  overflow: "hidden",
                                }}
                              >
                                <ModalImage
                                  small={category?.image}
                                  large={category?.image}
                                  alt="Image Preview"
                                  hideDownload
                                  hideZoom
                                />
                              </div>
                            </TableCell>
                          
                          
                            {/* <TableCell className={classes.textMiddle} style={{ textAlign: "center" }}>
                              <Tooltip
                                title={<span style={{ fontSize: "16px" }}>{category.isActive ? "Active" : "Inactive"}</span>}
                                arrow
                              >
                                <Button>
                                  <IOSSwitch
                                    onChange={(e) => {
                                      // statusSwitch(e, category);
                                    }}
                                    checked={category.isActive ? true : false}
                                  />
                                </Button>
                              </Tooltip>
                            </TableCell>  */}
 
                            <TableCell className={classes.textMiddle} style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                            <Button
                                  className="EditButton mx-2"
                                  onClick={() => {
                                    setSelectedCard(
                                      {
                
                                        // name:category.title,
                                        nameEnglish:category?.languages[0]?.title,
  nameChinese:category?.languages[1]?.title,
  nameKorean:category?.languages[2]?.title,
  nameSpanish:category?.languages[3]?.title,
                                        category:categoryList.filter((ele)=>ele.value===category.categorieId),
                                        file1: "",
                                        // ImageLink: get(selectedBannerData, "image", ""),
                                        ImageLink:category.image,
                                        _id:category._id
                                        }
                                    );
                                    setModalState({ isAddEditCard: true });
                                  }}
                                >
                                  <Tooltip title={<span style={{ fontSize: "16px" }}>Manage</span>} arrow>
                                    <EditIcon />
                                  </Tooltip>
                                </Button>
                            <Button
                                    // size="small"
                                    className="DeleteButton"
                                    onClick={() => DeleteCard(category._id)}
                                  >
                                    <Tooltip title={<span style={{ fontSize: "16px" }}>Delete</span>} arrow>
                                      <DeleteOutline />
                                    </Tooltip>
                                  </Button>
                            
                            
                          
                            </TableCell>
                           
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                    }
                  </TableContainer>
                  {tableData.length === 0 ? (
                    <NoDataFound TextToDisplay="No Data Found." fontSize="24px" Loading={isLoading} />
                  ) : (
                    false
                  )}
                  <TablePagination
                   style={{position:"fixed",bottom:4,backgroundColor:"white",right:27}}
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={tableData.length}
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
      {/* AddEdit Banner */}
      <Modal
        maxWidth="lg"
        width="840px"
        isOpen={CategoryOrCard==0&& modalState.isAddEditCard}
        onClose={(event, reason) => {
          if (reason && (reason === "backdropClick" || "escapeKeyDown")) {
            console.log(reason);
            setModalState({
              isAddEditCard: true,
            });
          } else {
            setModalState({
              isAddEditCard: false,
            });
          setSelectedCard({
                
            // name:"",
            nameEnglish:"",
            nameChinese:"",
            nameKorean:"",
            nameSpanish:"",
            category:"",
            file1: "",
            // ImageLink: get(selectedBannerData, "image", ""),
            ImageLink:"",
            _id:""
            })
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
              {CategoryOrCard==0? selectedCard._id === "" ? "Add Gift Card" : "Edit Gift Card":selectedBannerData === null ? "Add Category" : "Edit Category"}
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
                    isAddEditCard: false,
                  });
                  setSelectedCard({
                
                    // name:"",
                    nameEnglish:"",
                    nameChinese:"",
                    nameKorean:"",
                    nameSpanish:"",
                    category:"",
                    file1: "",
                    // ImageLink: get(selectedBannerData, "image", ""),
                    ImageLink:"",
                    _id:""
                    });
                }}
              />
            </div>
          </div>
        }
        content={
            <>
          
            <Formik
              enableReinitialize
            //   key={selectedLanguage}
              initialValues={
                selectedCard
                // LanguageInputs
                // {
                
                // name:"",
                // category:"",
                // file1: "",
                // // ImageLink: get(selectedBannerData, "image", ""),
                // ImageLink:""
                // }
              }
              validate={(values) => handleValidateAddEditCard(values)}
              onSubmit={(values) => {
                console.log(values);
                if (selectedCard._id !== "") {
                  Edit(values);
             
                } else {
                  addNew(values);
              }
              }}
            >
              {(formikBag) => (
                <Form style={{ width: "100%" }}>
                  <div className="container">
                   
                    <div className="row my-3">
                      <div className="col-md-6">
                        <div className="my-2">
                        <label>Category :</label>
                        <Field name="category">
                          {({ field }) => (
                            <SelectInput
                              {...field}
                              // type="text"
                              options={categoryList}
                              value={formikBag.values.category}
                              onChange={(e) => {
                                formikBag.setFieldValue("category", e);
                              }}
                              error={formikBag.touched.category && formikBag.errors.category ? formikBag.errors.category : null}
                              // className="form-control"
                              placeholder={"Select Category"}
                            />
                          )}
                        </Field>
                      </div>
                  
                      <div className="my-2">
                      <label>
                          Image<span style={{ color: "#85BB65", fontWeight: "bold" }}>(300x250)</span>:
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
                              accept="image/*"
                              onChange={async (e) => {
                                // if (!selectedTaxiDataAddEdit) {
                                const [file] = e.target.files;
                                console.log(file);
                                if (file) {
                                  const img = new Image();
                                  console.log(URL.createObjectURL(file));
                                  img.src = URL.createObjectURL(file);
                                  img.onload = async () => {
                                    if (img.width === 300 && img.height === 250) {
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
                             
                              }
                            }
                              error={formikBag.touched.file1 && formikBag.errors.file1 ? formikBag.errors.file1 : null}
                              className="form-control"
                              placeholder={"Enter Image"}
                            />
                          )}
                        </Field>
                      </div>
                      <div className="my-2">
                      <Field name="ImageLink">
                          {({ field }) => (
                            <>
                            <label>Image Preview:</label>
                              <img
                                {...field}
                                alt="Image Preview"
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
                      {/* <div className="col-md-6">
                        <label>Name:</label>
                        <Field name="name">
                          {({ field }) => (
                            <>
                              <Input
                                {...field}
                                type="text"
                                onChange={(e) => {
                                  formikBag.setFieldValue("name", e.target.value);
                                }}
                                error={
                                  formikBag.touched.name && formikBag.errors.name
                                    ? formikBag.errors.name
                                    : null
                                }
                                className="form-control"
                                placeholder={"Enter Name"}
                              />
                            
                            </>
                          )}
                        </Field>
                      </div> */}
                    {/* </div> */}

                    {/* <div className="row my-3"> */}
                      {/* <div className="col-md-6">
                        <label>
                          Image<span style={{ color: "#85BB65", fontWeight: "bold" }}>(300x250)</span>:
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
                              accept="image/*"
                              onChange={async (e) => {
                                // if (!selectedTaxiDataAddEdit) {
                                const [file] = e.target.files;
                                console.log(file);
                                if (file) {
                                  const img = new Image();
                                  console.log(URL.createObjectURL(file));
                                  img.src = URL.createObjectURL(file);
                                  img.onload = async () => {
                                    if (img.width === 300 && img.height === 250) {
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
                             
                              }
                            }
                              error={formikBag.touched.file1 && formikBag.errors.file1 ? formikBag.errors.file1 : null}
                              className="form-control"
                              placeholder={"Enter Image"}
                            />
                          )}
                        </Field>
                      </div> */}

                      {/* <div className="col-md-6">
                      
                        <Field name="ImageLink">
                          {({ field }) => (
                            <>
                            <label>Image Preview:</label>
                              <img
                                {...field}
                                alt="Image Preview"
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
                      </div> */}
                       <div className="col-md-6 ">
                       <div className="my-2">
                      <label>Name in English:</label>
                        <Field name="nameEnglish">
                          {({ field }) => (
                            <>
                              <Input
                                {...field}
                                type="text"
                                onChange={(e) => {
                                  formikBag.setFieldValue("nameEnglish", e.target.value);
                                }}
                                error={
                                  formikBag.touched.nameEnglish && formikBag.errors.nameEnglish
                                    ? formikBag.errors.nameEnglish
                                    : null
                                }
                                className="form-control"
                                placeholder={"Enter Name in English"}
                              />
                            
                            </>
                          )}
                        </Field>
                      </div>
                      <div className="my-2">
                      <label>Name in Chinese:</label>
                        <Field name="nameChinese">
                          {({ field }) => (
                            <>
                              <Input
                                {...field}
                                type="text"
                                onChange={(e) => {
                                  formikBag.setFieldValue("nameChinese", e.target.value);
                                }}
                                error={
                                  formikBag.touched.nameChinese && formikBag.errors.nameChinese
                                    ? formikBag.errors.nameChinese
                                    : null
                                }
                                className="form-control"
                                placeholder={"Enter Name in Chinese"}
                              />
                            
                            </>
                          )}
                        </Field>
                      </div>
                      <div className="my-2">
                      <label>Name in Korean:</label>
                        <Field name="nameKorean">
                          {({ field }) => (
                            <>
                              <Input
                                {...field}
                                type="text"
                                onChange={(e) => {
                                  formikBag.setFieldValue("nameKorean", e.target.value);
                                }}
                                error={
                                  formikBag.touched.nameKorean && formikBag.errors.nameKorean
                                    ? formikBag.errors.nameKorean
                                    : null
                                }
                                className="form-control"
                                placeholder={"Enter Name in Korean"}
                              />
                            
                            </>
                          )}
                        </Field>
                      </div>
                      <div className="my-2">
                      <label>Name in Spanish:</label>
                        <Field name="nameSpanish">
                          {({ field }) => (
                            <>
                              <Input
                                {...field}
                                type="text"
                                onChange={(e) => {
                                  formikBag.setFieldValue("nameSpanish", e.target.value);
                                }}
                                error={
                                  formikBag.touched.nameSpanish && formikBag.errors.nameSpanish
                                    ? formikBag.errors.nameSpanish
                                    : null
                                }
                                className="form-control"
                                placeholder={"Enter Name in Spanish"}
                              />
                            
                            </>
                          )}
                        </Field>
                      </div>
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
        {/* AddEdit Banner */}
        <Modal
        maxWidth="lg"
        width="840px"
        isOpen={CategoryOrCard==1&&modalState.isAddEditCategory}
        onClose={(event, reason) => {
          if (reason && (reason === "backdropClick" || "escapeKeyDown")) {
            console.log(reason);
            setModalState({
              isAddEditCategory: true,
            });
          } else {
            setModalState({
              isAddEditCategory: false,
            });
            setSelectedCategory({
              nameEnglish:"",
              nameChinese:"",
              nameKorean:"",
              nameSpanish:"",
              _id:""
            });
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
              {CategoryOrCard==0? selectedCard._id === "" ? "Add Gift Card" : "Edit Gift Card":selectedBannerData === null ? "Add Category" : "Edit Category"}
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
                    isAddEditCategory: false,
                  });
                  setSelectedCategory({
                    nameEnglish:"",
                    nameChinese:"",
                    nameKorean:"",
                    nameSpanish:"",
                    _id:""
                  });
                }}
              />
            </div>
          </div>
        }
        content={
            <>
            {
        
             <Formik
              enableReinitialize
            //   key={selectedLanguage}
              initialValues={
                // LanguageInputs
               selectedCategory
              }
              validate={(values) => handleValidateAddEditCategory(values)}
              onSubmit={(values) => {
                if (selectedCategory._id !== "") {
                  Edit(values);
             
                } else {
                  addNew(values);
              }
              
                
                  // addNew(values);
               
              }}
            >
              {(formikBag) => (
                <Form style={{ width: "100%" }}>
                  <div className="container">
                   
                    <div className="row my-3 ">
                      <div className="col-md-6 ">
                        <label>Category Name in English :</label>
                        <Field name="nameEnglish">
                          {({ field }) => (
                            <Input
                              {...field}
                              type="text"
                              onChange={(e) => {
                                formikBag.setFieldValue("nameEnglish", e.target.value);
                              }}
                              error={formikBag.touched.nameEnglish && formikBag.errors.nameEnglish ? formikBag.errors.nameEnglish : null}
                              className="form-control"
                              placeholder={"Enter Category in English"}
                            />
                          )}
                        </Field>
                      </div>
                      <div className="col-md-6 ">
                        <label>Category Name in Chinese :</label>
                        <Field name="nameChinese">
                          {({ field }) => (
                            <Input
                              {...field}
                              type="text"
                              onChange={(e) => {
                                formikBag.setFieldValue("nameChinese", e.target.value);
                              }}
                              error={formikBag.touched.nameChinese && formikBag.errors.nameChinese ? formikBag.errors.nameChinese : null}
                              className="form-control"
                              placeholder={"Enter Category in Chinese"}
                            />
                          )}
                        </Field>
                      </div>
                    
                    </div>
                    <div className="row my-3 ">
                      <div className="col-md-6 ">
                        <label>Category Name in Korean :</label>
                        <Field name="nameKorean">
                          {({ field }) => (
                            <Input
                              {...field}
                              type="text"
                              onChange={(e) => {
                                formikBag.setFieldValue("nameKorean", e.target.value);
                              }}
                              error={formikBag.touched.nameKorean && formikBag.errors.nameKorean ? formikBag.errors.nameKorean : null}
                              className="form-control"
                              placeholder={"Enter Category in Korean"}
                            />
                          )}
                        </Field>
                      </div>
                      <div className="col-md-6 ">
                        <label>Category Name in Spanish :</label>
                        <Field name="nameSpanish">
                          {({ field }) => (
                            <Input
                              {...field}
                              type="text"
                              onChange={(e) => {
                                formikBag.setFieldValue("nameSpanish", e.target.value);
                              }}
                              error={formikBag.touched.nameSpanish && formikBag.errors.nameSpanish ? formikBag.errors.nameSpanish : null}
                              className="form-control"
                              placeholder={"Enter Category in Spanish"}
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
            </Formik>}
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
      {/* <GiftCardManagement3/> */}
    </React.Fragment>
  );
}
