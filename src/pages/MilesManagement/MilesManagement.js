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
import { Category, DeleteOutline, WidgetsOutlined } from "@material-ui/icons";
import AddIcon from "@material-ui/icons/Add";
import Swal from "sweetalert2";
import { Input, Modal } from "../../components/index";
import { AiOutlineClose } from "react-icons/ai";
import { handleValidateCashbackPoints,handleValidatePointsValueData } from "../../utils/validators";
import { Formik, Form, Field } from "formik";
import NoDataFound from "../../components/NoDataFound";
import PuffLoader from "react-spinners/PuffLoader";
import BeatLoader from "react-spinners/BeatLoader";

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

export default function Tip_Management(props) {
  const classes = useStyles();
  const [MilesOrValue, setMilesOrValue] = useState(1);
  const [OnOffButtonColor, setOnOffButtonColor] = useState({
    On: true,
    Off: false,
  });
  // const history=useHistory();
const [miles_data,setMilesData]=useState({
  point:"",
  range:"",
  _id:""
})
const [points_data,setPointsData]=useState({
  point:"",
  price:"",
  _id:""
})
  const [tableData, setTableData] = useState([]);
  const [selectedTip, setSelectedTip] = useState("");
  const [modalState, setModalState] = useState({
    isTip: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  // status switch
  // const [checked, setChecked] = useState(true);

  // For Pagination
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [totalUserListCount, settotalUserListCount] = useState(4);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  

  useEffect(() => {
    getCategoriesContent();
  }, [MilesOrValue]);

  //get content
  const getCategoriesContent = async () => {
    setIsLoading(true);
    if(MilesOrValue==1){
    try {
      const { data } = await axios.get(
    
        `/private/get_miles`
      );
      console.log(data);
      setTableData([...data.data]);
      setMilesData({
        point:data.data[0].point,
        range:data.data[0].range,
        _id:data.data[0]._id
      })
    
      setSearch(search);
      settotalUserListCount(data.data.length);
      setIsLoading(false);
      if (data.data.docs.length === 0 || data.status === 500) {
      
      } else {
      }
    } catch (error) {
      console.log(error);
    }}
    else{
      try {
        const { data } = await axios.get(
        
          `/private/milesPointPrice`
        );
        console.log(data);
      
        setPointsData({
          point:data.data[0].point,
          price:data.data[0].price,
          _id:data.data[0]._id
        })
    
       
        setIsLoading(false);
        if (data.data.docs.length === 0 || data.status === 500) {
          
        } else {
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  // edit category itself

 


  

 
  
  const addNewCashbackMile = async (values) => {
    try {
      console.log(values);

      const { data } = await axios.post("/private/add_miles", {
        range:values.range,
    point:values.point,
   
        
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
  const EditCashbackMile = async (values) => {
    try {
      console.log(values);

      const { data } = await axios.post(`/private/add_miles`, {
        _id:values._id,
        range:values.range,
        point:values.point,
      
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
console.log(miles_data)
const addNewPointData = async (values) => {
  try {
    console.log(values);

    const { data } = await axios.post("/private/milesPointPrice", {
      price:values.price,
      point:values.point
 
      
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
const EditPointData = async (values) => {
  try {
    console.log(values);

    const { data } = await axios.post(`/private/milesPointPrice`, {
      _id:values._id,
      price:values.price,
      point:values.point
     
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
console.log(points_data)
  return (
    <React.Fragment>
      <div className="page-content">
        <div className={classes.root}>
          <Paper elevation={0} style={{ backgroundColor: "transparent" }}>
            <div className={classes.paperPaddingRightLeft}>
              <div className="">
                <Paper
                  elevation={0}
                  style={{ backgroundColor: "transparent",display:"flex" ,justifyContent:"center"}}
                  className={classNames(classes.paperHeading, classes.headingAlignment)}
                >
                    <div className="">
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      {" "}
                      <h5
                        style={{
                          margin: 0,
                          backgroundColor: MilesOrValue == "1" ? "#006FFF" : "#c4c4c4",
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
                          setMilesOrValue(1);
                         
                        }}
                      >
                        {" "}
                        {isLoading && OnOffButtonColor.On ? (
                          <BeatLoader color="#fff" />
                        ) : OnOffButtonColor.On ? (
                          `Set Miles`
                        ) : (
                          `Set Miles`
                        )}
                      </h5>
                      <h5
                        style={{
                          margin: 0,
                          backgroundColor: MilesOrValue == "0" ? "#006FFF" : "#c4c4c4",
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
                          setMilesOrValue(0);
                         
                        }}
                      >
                        {isLoading && OnOffButtonColor.Off ? (
                          <BeatLoader color="#fff" />
                        ) : OnOffButtonColor.Off ? (
                          `Set Point Value`
                        ) : (
                          `Set Point Value`
                        )}
                      </h5>
                    </div>
                  </div>
                 {/* <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem" }}>
                    {" "}
                    <SearchBar
                      // value={searched}
                      style={{ borderRadius: "25px" }}
                      className={"heightfix   "}
                    //   onChange={(searchVal) => SearchSubAdmin(searchVal)}
                      onCancelSearch={() => cancelSearch()}
                      placeholder="Search by Name,Email"
                    />
                 
                  </div> */}
                
                  
                  {/* <Tooltip title={<span style={{ color: "white", fontSize: "16px" }}>Add </span>} arrow>
                    <IconButton
                      className="buttoncss"
                      style={{ backgroundColor: "#0059cd", color: "#fff" }}
                      onClick={() => {
                        // props.history.push({
                        //   pathname: "/adminPanel/AddEdit_Tip",
                        // });
                        setModalState({ isTip: true });
                      }}
                    >
                      <AddIcon />
                    </IconButton>
                  </Tooltip> */}
                </Paper>

                {/* //new design */}

                {/* <br /> */}

                {/* status end */}

               {MilesOrValue==1? <Paper>
            
                <Formik
                enableReinitialize
              initialValues={miles_data}
              validate={(values) => handleValidateCashbackPoints(values)}
              onSubmit={(values) => {
                console.log(values);
                if (miles_data.point!==""||miles_data.range!==""||miles_data._id!=="") {
                    EditCashbackMile(values);
                } else {
                    addNewCashbackMile(values);
                  console.log("gadbad");
                }
              }}
            >
              {(formikBag) => (
                <Form style={{ width: "100%",padding:"3rem 20rem" }}>
                  <div className=" container">
                 
                  <div className="row my-3 d-flex flex-column" style={{fontWeight:"700",fontSize:"17px"}}>Points per mile:</div>
    <div className="row my-3 d-flex flex-column">
                      <div className=" ">
                        <label>
                          Miles :
                        </label>
                      </div>
                      <div className="">
                        <Field name="range">
                          {({ field }) => (
                            <Input
                              {...field}
                              type="number"
                              onChange={(e) => {
                                formikBag.setFieldValue("range", e.target.value);
                              }}
                              error={formikBag.touched.range && formikBag.errors.range ? formikBag.errors.range : null}
                              className="form-control"
                              placeholder={"Enter Miles "}
                            />
                          )}
                        </Field>
                      </div>
                    </div>
                 
                      
                    
                    <div className="row my-3 d-flex flex-column">
                      <div className=" ">
                        <label>
                          Points:
                        </label>
                      </div>
                      <div className="">
                        <Field name="point">
                          {({ field }) => (
                            <Input
                              {...field}
                              type="number"
                              onChange={(e) => {
                                formikBag.setFieldValue("point", e.target.value);
                              }}
                              error={formikBag.touched.point && formikBag.errors.point ? formikBag.errors.point : null}
                              className="form-control"
                              placeholder={"Enter Points"}
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
                      gap:"1rem"
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
                      Update
                    </button>
                  
                  </div>
                </Form>
              )}
            </Formik>
                </Paper>
                :
                <Paper>
            
            <Formik
            enableReinitialize
          initialValues={points_data}
          validate={(values) => handleValidatePointsValueData(values)}
          onSubmit={(values) => {
            console.log(values);
            if (points_data.point !== ""||points_data.price!==""||points_data._id!=="") {
              EditPointData(values);
            } else {
                addNewPointData(values);
              console.log("gadbad");
            }
          }}
        >
          {(formikBag) => (
            <Form style={{ width: "100%",padding:"3rem 20rem" }}>
              <div className=" container">
              

               
                  
                
            
                <div className="row my-3 d-flex flex-column" style={{fontWeight:"700",fontSize:"17px"}}>Points Value:</div>
                <div className="row my-3 d-flex flex-column">
                  <div className=" ">
                    <label>
                      Points:
                    </label>
                  </div>
                  <div className="">
                    <Field name="point">
                      {({ field }) => (
                        <Input
                          {...field}
                          type="number"
                          onChange={(e) => {
                            formikBag.setFieldValue("point", e.target.value);
                          }}
                          error={formikBag.touched.point && formikBag.errors.point ? formikBag.errors.point : null}
                          className="form-control"
                          placeholder={"Enter Points"}
                        />
                      )}
                    </Field>
                  </div>
                </div>
                <div className="row my-3 d-flex flex-column">
                  <div className=" ">
                    <label>
                      Price:
                    </label>
                  </div>
                  <div className="">
                    <Field name="price">
                      {({ field }) => (
                        <Input
                          {...field}
                          type="number"
                          onChange={(e) => {
                            formikBag.setFieldValue("price", e.target.value);
                          }}
                          error={formikBag.touched.price && formikBag.errors.price ? formikBag.errors.price : null}
                          className="form-control"
                          placeholder={"Enter Price "}
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
                  gap:"1rem"
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
                  Update
                </button>
              
              </div>
            </Form>
          )}
        </Formik>
            </Paper>}
              </div>
            </div>
          </Paper>
        </div>
      </div>
      {/* FareTaxi Single */}
      
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
