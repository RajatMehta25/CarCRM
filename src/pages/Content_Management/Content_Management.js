import React, { useState, useEffect, Component, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import axios from "../../axios";
import { toast } from "react-toastify";
// import Switch from '@mui/material/Switch';
// import { styled } from '@mui/material/styles';
// import Skeleton from 'react-loading-skeleton'
// import 'react-loading-skeleton/dist/skeleton.css'
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
import JoditEditor from "jodit-react";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
// import { Formik } from "formik";
import { Formik, Form, Field } from "formik";
import { indexOf } from "lodash";
import { submit } from "redux-form";
import * as yup from "yup";
import "./Content_Management.css";
// import { Delete } from '@material-ui/icons';
// import VisibilityIcon from '@material-ui/icons/Visibility';
// import BlockIcon from '@material-ui/icons/Block';
// import ArrowBackIcon from "@material-ui/icons/ArrowBack";

// For Table
// import SearchBar from "material-ui-search-bar";
// import { orderBy } from "lodash";

//history
// import {useHistory} from 'react-router-dom'
// import AddEditCategory from "../AccountManagement/Account_Details";

// import './Category_Management.css' ;
// import EditIcon from '@material-ui/icons/Edit';
// import { DeleteOutline, WidgetsOutlined } from "@material-ui/icons";
// import React, { Component } from 'react';
// import { Editor } from 'react-draft-wysiwyg';
// import { EditorState, convertToRaw, ContentState } from 'draft-js';
// import draftToHtml from 'draftjs-to-html';
// import htmlToDraft from 'html-to-draftjs';
// import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
// import '../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
// import QNA from './QNA_Component';
import { isEmpty } from "lodash";

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
    maxHeight: "58vh",
  },
  paperPaddingRightLeft: {
    padding: "0rem 1rem",
  },
}));

export default function Content_Management(props) {
  const classes = useStyles();
  //   const registrationForm = useRef();
  //   const [persons,setPerson] = useState([<QNA key={0} />]);
  // const [AllData,setAllData] = useState([]);
  const config = {
    // minHeight: 500,
    buttons: [
      "bold",
      "italic",
      "underline",
      "source",
      "|",
      "image",
      "video",
      "link",
      "|",
      "font",
      "fontsize",
      "brush",
      "eraser",
      "|",
      "align",
      "|",
      "ul",
      "ol",
      "|",
      "undo",
      "redo",
      "|",
      "cut",
      "copy",
      "paste",
      "|",
      "|",
      "about",
    ],
  };
  // const history=useHistory();
  const [inputData, setInputData] = useState();
  const [htmlData, setHtmlData] = useState("");
  //   const [tableData, setTableData] = useState([]);
  const [panelName, setPanelName] = useState("");
  const [heading, setHeading] = useState("");
  const [Language, setLanguage] = useState("");
  const selectHeadingData = [
    "privacyPolicy",
    "termsAndConditions",
    "aboutUs",
    // "help",
    // "contactUs",
  ];
  const panelData = ["USER", "DRIVER"];
  const [updateID, setUpdateID] = useState("");
  // const[isLoading,setIsLoading]=useState(true);

  // status switch
  // const [checked, setChecked] = useState(true);

  //handle add QnA component

  //   // For Pagination
  //   const [page, setPage] = React.useState(0);
  //   const [rowsPerPage, setRowsPerPage] = React.useState(10);

  //   const handleChangePage = (event, newPage) => {
  // console.log(event);
  // console.log(newPage);
  // setPage(newPage);
  //   };

  //    useEffect(() => {getContent()} , []);

  //get content
  const getContent = async (values) => {
    // setInputData("");
    if (values?.select1 !== "" && values?.select2 !== "") {
      try {
        const { data } = await axios.get(`/private/listWebPage?pageName=${values.select1}&pageType=${values.select2}`); //params needed here
        console.log("api", data);
        if (!isEmpty(data.data)) {
          console.log("nnnn");
          setInputData(data.data[0].html);
          setUpdateID(data.data[0]._id);
        }
        // setTableData(data.data)
        // setSearchedData(data.user)
        // setIsLoading(false)
        else {
          console.log("kki");
          toast.error("No Data Found", { position: "top-right" });
          setInputData("");
        }
      } catch (error) {
        console.log(error);
      }
    } else if (values.select2 === "") {
      toast.info("Please Select Panel", {
        position: "top-right",
      });
      setInputData("");
    } else if (values.select1 === "") {
      toast.info("Please Select Heading", {
        position: "top-right",
      });
      setInputData("");
    }
  };

  // creation and updation
  const Create = async () => {
    if (inputData !== "" && inputData !== "<p><br></p>" && heading && panelName) {
      try {
        // console.log(values);

        const { data } = await axios.post(`/private/createWebPage`, {
          // contentId:,
          pageName: heading,
          pageType: panelName,
          html: `${inputData}`,
        });
        console.log(data);
        toast.success("Content Saved Successfully");
        getContent();
      } catch (error) {
        toast.info("Use Update Button to Update Content", { position: "top-right" });
        console.log(error);
      }
    } else {
      alert("Text and Selection fields cannot be blank");
    }
  };

  const Update = async (category) => {
    if (inputData !== "" && inputData !== "<p><br></p>" && heading && panelName) {
      try {
        // console.log(values);

        const { data } = await axios.put(`/private/updateWebPage/${updateID}`, {
          // contentId:,
          pagename: heading,
          pageType: panelName,
          html: `${inputData}`,
        });
        console.log(data);
        toast.success("Content Saved Successfully");
        setUpdateID("");
        getContent();
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("Text and Selection fields cannot be blank");
    }
  };
  //edit  categories attribute

  // status switch

  // useMemo(() => {
  //   const SettingData = (newContent) => {
  //     // setInputData(JSON.stringify(newContent));
  //     setInputData(newContent);
  //     console.log(newContent);
  //   }
  // }, [newContent]);

  const SettingData = (newContent) => {
    // setInputData(JSON.stringify(newContent));
    setInputData(newContent);
    console.log(newContent);
  };

  let validationSchema = yup.object().shape({
    select1: yup.string().required("heading is required"),
    select2: yup.string().required("panel is required"),
  });

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
                  <h3 style={{}}></h3>

                  <Formik
                    //   validationSchema={validationSchema}
                    initialValues={{
                      select1: "",
                      select2: "",
                    }}
                    onSubmit={(values) => {
                      if (values.select1 === "" && values.select2 === "") {
                        toast.info("Please select Panel and Heading", {
                          position: toast.POSITION.TOP_RIGHT,
                        });
                      } else {
                        getContent(values);
                      }

                      console.log(values);
                    }}
                  >
                    {({ values, setFieldValue, handleSubmit }) => (
                      <Form>
                        {/* <label className="" style={{ }}>
                                Name:
                              </label> */}
                        &emsp;
                        <Field
                          className=""
                          name="select2"
                          // variant="outlined"
                          as="select"
                          // inputProps={{name: "name"}}
                          onChange={(e) => {
                            setFieldValue("select2", e.target.value);
                            setPanelName(e.target.value);
                            handleSubmit();
                          }}
                          style={{
                            width: 200,
                            height: 35,
                            borderRadius: 5,
                            borderColor: "#d3d3d3",
                            borderStyle: "solid",
                            borderWidth: 1,
                            paddingInlineStart: 10,
                          }}
                        >
                          <option value="">Select Panel</option>
                          <option value="user">USER</option>
                          <option value="driver">DRIVER</option>
                          {/* {panelData.map((item, index) => {
                            return (
                              <option key={index} value={item}>
                                {item}
                              </option>
                              
                            );
                          })} */}
                        </Field>
                        &emsp;
                        <Field
                          className=""
                          name="select1"
                          // variant="outlined"
                          as="select"
                          // inputProps={{name: "name"}}
                          onChange={(e) => {
                            setFieldValue("select1", e.target.value);
                            setHeading(e.target.value);
                            handleSubmit();
                          }}
                          style={{
                            width: 200,
                            height: 35,
                            borderRadius: 5,
                            borderColor: "#d3d3d3",
                            borderStyle: "solid",
                            borderWidth: 1,
                            paddingInlineStart: 10,
                          }}
                        >
                          <option value="">Select Heading</option>
                          <option value="privacy_policy">PRIVACY POLICY</option>
                          <option value="termsAndConditions">TERMS AND CONDITIONS</option>
                          <option value="about_us">ABOUT US</option>
                          {/* <option value="help">HELP</option> */}
                          {/* <option value="contactUs">CONTACT US</option> */}
                          {/* {selectHeadingData.map((item,index)=>{
                                    return(
                                        <option key={index} value={item}>{item.toLocaleUpperCase()}</option>
                                    )
                                })} */}
                        </Field>
                        {/* &emsp;
                        <Field
                          className=""
                          name="select3"
                          // variant="outlined"
                          as="select"
                          // inputProps={{name: "name"}}
                          onChange={(e) => {
                            setFieldValue("select3", e.target.value);
                            setLanguage(e.target.value);
                            handleSubmit();
                          }}
                          style={{
                            width: 200,
                            height: 35,
                            borderRadius: 5,
                            borderColor: "#d3d3d3",
                            borderStyle: "solid",
                            borderWidth: 1,
                            paddingInlineStart: 10,
                          }}
                        >
                          <option value="">Select Language</option>
                          <option value="en">ENGLISH</option>
                          <option value="kr">KOREAN</option>
                          <option value="sp">SPANISH</option>

                          
                        </Field> */}
                        {/* &emsp;
                        <Field
                          className=""
                          name="select4"
                          // variant="outlined"
                          as="select"
                          // inputProps={{name: "name"}}
                          onChange={(e) => {
                            setFieldValue("select4", e.target.value);
                            setLanguage(e.target.value);
                            handleSubmit();
                          }}
                          style={{
                            width: 200,
                            height: 35,
                            borderRadius: 5,
                            borderColor: "#d3d3d3",
                            borderStyle: "solid",
                            borderWidth: 1,
                            paddingInlineStart: 10,
                          }}
                        >
                          <option value="">Select Language</option>
                          <option value="en">ENGLISH</option>
                          <option value="kr">KOREAN</option>
                          <option value="sp">SPANISH</option>

                        </Field> */}
                        {/* <KErrorMessage name="name" /> */}
                        <br />
                      </Form>
                    )}
                  </Formik>
                </Paper>

                {/* //new design */}

                {/* <br /> */}

                {/* status end */}

                <Paper elevation={0}>
                  <div className="customHeight">
                    <JoditEditor
                      config={{
                        askBeforePasteFromWord: false,
                        askBeforePasteHTML: false,
                        defaultActionOnPaste: "insert_only_text",
                        readonly: false,
                      }}
                      value={inputData}
                      onBlur={(newContent) => {
                        SettingData(newContent);
                      }}

                      // value={category.data?.answer}
                      // config={config}
                      // ref={editor}
                      // value={content}
                      // config={config}
                      //tabIndex={1} // tabIndex of textarea
                      //onBlur={newContent => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
                    />
                  </div>
                  <br />
                  <Button
                    variant="contained"
                    style={{ color: "white", backgroundColor: "#006FFF" }}
                    onClick={() => {
                      Create();
                    }}
                  >
                    Create
                  </Button>
                  &emsp;
                  <Button
                    variant="contained"
                    style={{ color: "white", backgroundColor: "#006FFF" }}
                    onClick={() => {
                      Update();
                    }}
                  >
                    Update
                  </Button>
                  <br />
                  <br />
                </Paper>
                <Paper></Paper>
              </div>
            </div>
          </Paper>
        </div>
      </div>
    </React.Fragment>
  );
}
