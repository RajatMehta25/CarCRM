import React, { useState, useEffect, Component, useRef, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import axios from "../../axios";
import { toast } from "react-toastify";
import EditIcon from "@material-ui/icons/Edit";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import AddIcon from "@material-ui/icons/Add";
// import Switch from '@mui/material/Switch';
// import { styled } from '@mui/material/styles';
// import Skeleton from 'react-loading-skeleton'
// import 'react-loading-skeleton/dist/skeleton.css'
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
import "./FAQ_Management.css";
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
// import QNA from "./QNA_Component";
import JoditEditor from "jodit-react";
import { Formik, Field, ErrorMessage, Form } from "formik";
import { get } from "lodash";
import RSelect from "react-select";
import { DeleteOutline, WidgetsOutlined } from "@material-ui/icons";

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

export default function FAQ_Management(props) {
  const classes = useStyles();
  // const registrationForm = useRef();

  const [tableData, setTableData] = useState([]);
  // const [inputData, setInputData] = useState("");
  // const [inputData2, setInputData2] = useState("");

  // const [inputquestion, setInputquestion] = useState("");
  // const [inputquestion2, setInputquestion2] = useState("");
  const [buttonDisabling, setButtonDisabling] = useState(false);

  const [storeType, setType] = useState("USER");
  //   const [tabColor, setTabColor] = useState("1");

  const [show, setShow] = useState(true);
  const {
    location: { state },
  } = props;
  useEffect(() => {
    !state ? getCategoriesContent("USER") : getCategoriesContent(state);
    //  setInputData2("");
  }, []);

  //get content
  const getCategoriesContent = async (type) => {
    console.log("type", type);
    setType(type);

    try {
      if (type === "USER") {
        setTableData([]);
        const { data } = await axios.post(`/private/faqList`, { faq_type: "user" });
        console.log(data);
        setTableData(data.data);

        setButtonDisabling(false);
        // setSearchedData(data.user)
        // setIsLoading(false)
      } else if (type === "DRIVER") {
        setTableData([]);
        const { data } = await axios.post(`/private/faqList`, { faq_type: "driver" });
        console.log(data);
        setTableData(data.data);

        setButtonDisabling(false);
      }
      // else if (type === "DRIVER") {
      //   setTableData([]);
      //   const { data } = await axios.get(`/user/getFaqByPanel?panel=DRIVER`);
      //   console.log(data);
      //   setTableData(data.data);

      //   setButtonDisabling(false);
      // }
    } catch (error) {
      console.log(error);
    }
  };

  console.log(tableData);

  const handleUpdate = async (values) => {
    // console.log(category);
    // if (category){
    try {
      setButtonDisabling(true);
      const { data } = await axios.post("/admin/updateFaq", {
        _id: values.id,
        question: values.question,
        answer: values.answer,
        createdFor: storeType,
      });

      // window.location.reload();
      // getCategoriesContent();
      toast.success(data.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      console.log(error);
    }
  };
  const handleAdd = async (values) => {
    try {
      setButtonDisabling(true);
      // let panelName = "USER";

      const { data } = await axios.post("/admin/createFaq", {
        // _id: category.data._id,
        question: values.newQuestion,
        answer: values.newAnswer,
        createdFor: storeType,
      });

      // window.location.reload();
      getCategoriesContent(storeType);
      setTimeout(() => {
        setShow(true);
      }, 401);
      toast.success(data.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handle_Deletion = async (id) => {
    if (window.confirm("Are you sure you want to delete this faq?")) {
      try {
        const { data } = await axios.delete(`/private/faqDelete/${id}`);
        // window.location.reload();

        toast.success(data.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
        getCategoriesContent(storeType);
      } catch (error) {
        console.log(error);
      }
    } else {
    }
  };
  const options = [
    { value: "USER", label: "USER" },
    { value: "DRIVER", label: "DRIVER" },
    // { value: "DRIVER", label: "DRIVER" },
  ];

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
                  <div style={{ width: "20%" }}>
                    <RSelect
                      defaultValue={
                        !state
                          ? { label: "USER", value: "USER" }
                          : {
                              label: state === "DRIVER" ? "DRIVER" : "USER",
                              value: state === "DRIVER" ? "DRIVER" : "USER",
                            }
                      }
                      options={options}
                      onChange={(e) => {
                        getCategoriesContent(e.value);
                      }}
                    />
                  </div>
                  {/* <Button
                    variant="contained"
                    className="buttoncss"
                    style={{ backgroundColor: "#0059cd", color: "#fff" }}
                    onClick={() => {
                      props.history.push({
                        pathname: "/adminPanel/AddEditFAQ",
                        state: [storeType, "ADD FAQ"],
                      });
                    }}
                  >
                    Add FAQ
                  </Button> */}
                  <Tooltip title={<span style={{ color: "white", fontSize: "16px" }}>Add FAQ</span>} arrow>
                    <IconButton
                      className="buttoncss"
                      style={{ backgroundColor: "#0059cd", color: "#fff" }}
                      onClick={() => {
                        props.history.push({
                          pathname: "/adminPanel/AddEditFAQ",
                          state: [storeType, "ADD FAQ"],
                        });
                      }}
                    >
                      <AddIcon />
                    </IconButton>
                  </Tooltip>
                </Paper>
                <Paper elevation={0} style={{ backgroundColor: "transparent" }}>
                  <div>
                    {/* <Button variant="contained" style={{ backgroundColor: '#0e3f37', color: "white" }}  onClick={()=>{getCategoriesContent("all")}}>All</Button>&emsp; */}
                    {/* <Button
                      variant="contained"
                      className={`${
                        tabColor === "1" ? "customButton" : "defaultButton"
                      }`}
                      onClick={() => {
                        getCategoriesContent("price");
                        setTabColor("1");
                      }}
                    >
                      Price
                    </Button>
                    &emsp;
                    <Button
                      variant="contained"
                      className={`${
                        tabColor === "2" ? "customButton" : "defaultButton"
                      }`}
                      onClick={() => {
                        setTabColor("2");
                        getCategoriesContent("service");
                      }}
                    >
                      Service
                    </Button> */}
                  </div>
                </Paper>
                {/* //new design */}

                {/* <br /> */}

                {/* status end */}

                <Paper>
                  {tableData.map((category, index) => (
                    <Formik
                      key={index}
                      initialValues={{
                        question: get(category, "question", ""),
                        answer: get(category, "answer", ""),
                        id: get(category, "_id", ""),
                      }}
                      validate={(values) => {
                        const errors = {};
                        console.log(values);
                        if (!values.question) {
                          errors.question = "Required";
                        }
                        if (
                          //  !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                          values.answer === "" ||
                          values.answer === "<p><br></p>"
                        ) {
                          errors.answer = "Required";
                        }
                        return errors;
                      }}
                      onSubmit={(values, { setSubmitting }) => {
                        setTimeout(() => {
                          //  alert(JSON.stringify(values, null, 2));
                          handleUpdate(values);
                          setSubmitting(false);
                        }, 400);
                      }}
                    >
                      {({ isSubmitting, setFieldValue, values }) => (
                        <Form>
                          <Accordion>
                            <AccordionSummary
                              expandIcon={<ExpandMoreIcon />}
                              aria-controls="panel1a-content"
                              id="panel1a-header"
                              className="my-2"
                            >
                              <Typography>
                                {" "}
                                <strong>Question:</strong>&emsp;
                              </Typography>
                              <Typography>
                                {/* <Field
                                  type="text"
                                  name="question"
                                  className="form-control"
                                  placeholder="Question"
                                /> */}
                                {values.question}
                              </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                              <Typography>
                                {/* <label className="label-text">QUESTION</label> */}
                                {/*                            
                                <ErrorMessage
                                  name="question"
                                  component="div"
                                  className="text-danger"
                                /> */}
                                {/* <div className="editor-container-1"> */}
                                {/* <label className="label-text">ANSWER</label> */}
                                {/* <JoditEditor
                                    value={values.answer}
                                    name="answer"
                                    // onChange={(newContent) => {
                                    //   // SettingData(newContent);
                                    //   setFieldValue("answer", newContent);
                                    // }}
                                    disabled
                                  /> */}
                                {/* </div> */}
                                {/* <ErrorMessage
                                  name="answer"
                                  component="div"
                                  className="text-danger"
                                /> */}
                                <strong>Answer :</strong>
                                <div
                                  dangerouslySetInnerHTML={{
                                    __html: values.answer,
                                  }}
                                />
                                <br />
                                <Button
                                  variant="contained"
                                  style={{
                                    backgroundColor: "#0059cd",
                                    color: "white",
                                  }}
                                  // onClick={()=>{
                                  //   handleCreate_Update2(category)
                                  // }}
                                  // type="submit"
                                  // disabled={isSubmitting}
                                  onClick={() => {
                                    props.history.push({
                                      pathname: "/adminPanel/AddEditFAQ",
                                      state: [storeType, "EDIT FAQ", category],
                                    });
                                  }}
                                >
                                  <EditIcon />
                                </Button>
                                &emsp;
                                <Button
                                  variant="contained"
                                  type="button"
                                  style={{
                                    backgroundColor: "#0059cd",
                                    color: "white",
                                  }}
                                  onClick={() => {
                                    handle_Deletion(category._id);
                                    // getCategoriesContent(storeType);
                                  }}
                                >
                                  <DeleteOutline />
                                </Button>
                                <br />
                                <br />
                              </Typography>
                            </AccordionDetails>
                          </Accordion>
                        </Form>
                      )}
                    </Formik>
                  ))}

                  {/* {show && (
                    <Formik
                      initialValues={{
                        newQuestion: "",
                        newAnswer: "",
                      }}
                      validate={(values) => {
                        const errors = {};
                        console.log(values);
                        if (!values.newQuestion) {
                          errors.newQuestion = "Required";
                        }
                        if (
                          //  !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                          values.newAnswer === "" ||
                          values.newAnswer === "<p><br></p>"
                        ) {
                          errors.newAnswer = "Required";
                        }
                        return errors;
                      }}
                      onSubmit={(values, { setSubmitting }) => {
                        setTimeout(() => {
                          //  alert(JSON.stringify(values, null, 2));
                          handleAdd(values);

                          setSubmitting(false);
                        }, 400);

                        //  getCategoriesContent(storeType);
                        // window.location.reload();
                        setShow(false);
                      }}
                    >
                      {({ isSubmitting, setFieldValue, values }) => (
                        <Form>
                          <label className="label-text">QUESTION</label>
                          <Field
                            type="text"
                            name="newQuestion"
                            className="form-control"
                            placeholder="New Question"
                          />
                          <ErrorMessage
                            name="newQuestion"
                            component="div"
                            className="text-danger"
                          />
                          <br />
                          <div className="editor-container-1">
                            <label className="label-text">ANSWER</label>
                            <JoditEditor
                              value={values.newAnswer}
                              name="newAnswer"
                              onChange={(newContent) => {
                                // SettingData(newContent);
                                setFieldValue("newAnswer", newContent);
                              }}
                            />
                          </div>
                          <ErrorMessage
                            name="newAnswer"
                            component="div"
                            className="text-danger"
                          />
                          <br />
                          <Button
                            variant="contained"
                            type="submit"
                            // style={{ backgroundColor: `${buttonDisabling?'#696969':'#0e3f37'}`, color: "white" }}
                            // onClick={()=>{handleAdd()}}
                            style={{
                              backgroundColor: "#0e3f37",
                              color: "white",
                            }}
                            disabled={isSubmitting}
                          >
                            ADD
                          </Button>
                          <br />
                          <br />
                        </Form>
                      )}
                    </Formik>
                  )} */}
                </Paper>
              </div>
            </div>
          </Paper>
        </div>
      </div>
    </React.Fragment>
  );
}
