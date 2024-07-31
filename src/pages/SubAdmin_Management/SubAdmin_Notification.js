import React, { useEffect, useState } from "react";
// import { Container, Row, Col } from "reactstrap";
import axios from "../../axios";
// import axios from "../../http-comman";
import classNames from "classnames";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Label from "reactstrap/lib/Label";
import Checkbox from "@material-ui/core/Checkbox";
import { TextareaAutosize, TextField } from "@material-ui/core";
import { lightGreen } from "@material-ui/core/colors";
import Button from "@material-ui/core/Button";
import { toast } from "react-toastify";
import { Row, Col } from "reactstrap";
import SearchBar from "material-ui-search-bar";

// For Table
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TablePagination from "@material-ui/core/TablePagination";
import { autofill } from "redux-form";
import { BsPersonFill } from "react-icons/bs";
import { get, isEmpty } from "lodash";
import { Formik, Field, Form } from "formik";
import Input from "../../components/Input";
import { FeildManageValidatorNotification } from "../../utils/validator";
import TextArea from "../../components/TextArea";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

const useStyles = makeStyles((theme) => ({
  root: {
    flexWrap: "wrap",
    marginTop: "3rem",
  },
  deleteColor: {
    color: "#757575",
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
    // border: "1px solid black"
  },
  iconMargin: {
    marginRight: "0.5rem",
  },
  headingButton: {
    display: "flex",
    flexDirection: "row",
    // justifyContent: 'space-between',
    gap: "5%",
  },
  // container: {
  //     maxHeight: '61vh',
  // },
  paperPaddingRightLeft: {
    padding: "0rem 1rem",
  },
  tableFlex: {
    display: "flex",
  },
  searchHeight: {
    height: "2.3rem",
  },
  addButtonColor: {
    backgroundColor: "#0e3f37",
    color: "#ffffff",
    textTransform: "none",
  },
  tablePadding: {
    padding: "0.5rem",
    // textAlign: "center",
    fontSize: "0.8rem",
  },
  productDescription: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalDescription: {
    padding: "1rem",
    paddingTop: "0rem",
  },
  descriptionWidth: {
    width: "300px",
    borderRight: "0.5px solid #0000001f",
    borderLeft: "0.5px solid #0000001f",
  },
  descriptionCell: {
    borderRight: "0.5px solid #0000001f",
    borderLeft: "0.5px solid #0000001f",
  },
  iconFont: {
    fontSize: "1.1rem",
  },
  paperHeight: {
    height: "90vh",
  },
  paperTableHeight: {
    height: "100%",
  },
  tableContainerHeight: {
    height: "79%",
  },
  tablePaginationStyle: {
    border: "1px solid #0000001a",
    borderRadius: "0rem 0rem 0.4rem 0.4rem",
  },
  searchPending: {
    display: "flex",
    justifyContent: "flex-end",
  },
  searchWidth: {
    width: "30vw",
  },
  actionStyle: {
    textAlign: "center",
  },
  searchBox: {
    display: "flex",
    // backgroundColor: 'pink',
    justifyContent: "space-between",
    alignItems: "center",
    padding: "5px 20px",
  },
  personIcon: {
    height: "30px",
    width: "30px",
  },
  submitBtn: {
    display: "flex",
    justifyContent: "center",
    marginTop: "10px",
  },
  rowPadding: {
    padding: "2rem 2rem",
  },
  borderFor: {
    borderRight: "1.5px solid #0000001f",
  },
  borderAll: {
    border: "1.5px solid #0000001f",
  },
  textRight: {
    textAlign: "right",
  },
  textLeft: {
    textAlign: "left",
  },
}));

const Index = (props) => {
  const classes = useStyles();

  // For Pagination
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(500);

  const [users, setUsers] = useState([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [allUsers, setAllUsers] = useState([]);

  // For Search
  const [searched, setSearched] = useState("");
  const [searchedData, setSearchedData] = useState([]);

  const requestSearch = (searchedVal) => {
    // console.log(searchedVal);
    const filteredRows = searchedData.filter((row) => {
      // console.log(searchedVal);
      //   console.log(row);
      return row.name.toLowerCase().includes(searchedVal.toLowerCase());
    });
    setUsers(filteredRows);
  };

  const getUsers = async () => {
    try {
      const { data } = await axios.get("/admin/subAdminsList");
      setUsers(data.data);
      console.log(data.data);
      setSearchedData(data.data);
      console.log(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const cancelSearch = () => {
    setSearched("");
    getUsers();
  };

  // console.log(checkId.map((val) => val.id));

  const Submit = async (value) => {
    console.log(value);

    if (value.title && value.description && !isEmpty(allNotificationsUser)) {
      try {
        await axios.post("/admin/send_notification", {
          admin_ids: allNotificationsUser,
          message: value.description,
          title: value.title,
        });
        toast.success("Notification sent successfully!", {
          position: toast.POSITION.TOP_RIGHT,
        });
        // console.log(allNotificationsUser);
        // console.log(value.description);
        // console.log(value.title);
        value.description = "";
        value.title = "";
        setSelected("");
        setSellerSelected("");
        setDeliverySelected("");
      } catch (error) {
        console.log(error);
      }
    } else {
      toast.error("Please Fill all the fields", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  //Select Checkbox

  const [selected, setSelected] = React.useState([]);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = users.map((n) => n._id);
      setSelected(newSelecteds);
      setAllUsers((allUsers) => [...allUsers, selected[0]]);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };
  const isSelected = (name) => selected.indexOf(name) !== -1;

  // Seller code

  //Select Checkbox

  const [sellerSelected, setSellerSelected] = React.useState([]);

  //  Delivery Boy Code

  //Select Checkbox

  const [deliverySelected, setDeliverySelected] = React.useState([]);

  var allNotifications = [selected, sellerSelected, deliverySelected];
  var allNotificationsUser = allNotifications
    .flat(2)
    .filter((item) => item !== "");

  return (
    <React.Fragment>
      <div className={classes.root}>
        <Paper>
          <div className={classNames("mt-5", classes.paperPaddingRightLeft)}>
            <div className={classNames("py-4", classes.paperHeight)}>
              <Paper
                elevation={0}
                className={classNames(
                  classes.paperHeading,
                  classes.headingButton
                )}
              >
                <Button
                  variant="outlined"
                  aria-label="add"
                  className={classes.iconMargin}
                  onClick={() => {
                    if (window.confirm("Leave this page?")) {
                      props.history.push({
                        pathname: "/adminPanel/SubAdmin_Management",
                      });
                    }
                  }}
                >
                  <ArrowBackIcon />
                </Button>

                <h3 className="mb-0">Sub-Admin Notifications Management</h3>
              </Paper>
              <Paper className={classes.paperTableHeight}>
                <TableContainer style={{ overflowX: "hidden" }}>
                  <Table stickyHeader>
                    <div
                      className={classNames(
                        "row with_label",
                        classes.borderAll
                      )}
                    >
                      <div
                        className={classNames("col-md-6", classes.borderFor)}
                      >
                        <Formik
                          enableReinitialize
                          initialValues={{
                            title: "",
                            description: "",
                          }}
                          validate={(values) =>
                            FeildManageValidatorNotification(values)
                          }
                          validateOnChange
                          onSubmit={Submit}
                        >
                          {(formikBag) => {
                            return (
                              <Form>
                                <div>
                                  <Field name="title">
                                    {({ field }) => (
                                      <div className="form-group mt-4">
                                        <label htmlFor="title">
                                          Notification Title
                                        </label>
                                        <Input
                                          {...field}
                                          type="text"
                                          className="form-control py-5"
                                          value={formikBag.values.title}
                                          // required
                                          onChange={(e) => {
                                            console.log(formikBag);
                                            formikBag.setFieldValue(
                                              "title",
                                              e.target.value
                                            );
                                          }}
                                          error={
                                            formikBag.touched.title &&
                                            formikBag.errors.title
                                              ? formikBag.errors.title
                                              : null
                                          }
                                        />
                                      </div>
                                    )}
                                  </Field>
                                </div>

                                <div>
                                  <Field name="description">
                                    {({ field }) => (
                                      <div>
                                        <label>Notification Description</label>
                                        <TextArea
                                          {...field}
                                          type="text"
                                          rows="10"
                                          value={formikBag.values.description}
                                          className="form-control"
                                          onChange={(e) => {
                                            formikBag.setFieldValue(
                                              "description",
                                              e.target.value
                                            );
                                          }}
                                          error={
                                            formikBag.touched.description &&
                                            formikBag.errors.description
                                              ? formikBag.errors.description
                                              : null
                                          }
                                        />
                                      </div>
                                    )}
                                  </Field>
                                </div>
                                <div
                                  className={classNames(
                                    "form-group",
                                    "mt-3",
                                    classes.submitBtn
                                  )}
                                >
                                  <button
                                    type="submit"
                                    style={{
                                      backgroundColor: "#4aa3ff",
                                      borderColor: "#4aa3ff",
                                    }}
                                    className="btn btn-success"
                                  >
                                    Send Notification
                                  </button>
                                </div>
                              </Form>
                            );
                          }}
                        </Formik>
                      </div>

                      <div
                        className={classNames("col-md-6 ", classes.borderFor)}
                      >
                        <div className={classNames(classes.container, "mt-4")}>
                          <Paper className={classes.searchBox}>
                            <SearchBar
                              style={{ width: "97%", boxShadow: "none" }}
                              value={searched}
                              placeholder="Search Sub-Admin Name"
                              onChange={(searchVal) => requestSearch(searchVal)}
                              onCancelSearch={() => cancelSearch()}
                              className={classes.searchHeight}
                            />
                          </Paper>
                          <TableContainer
                            className={classNames("mt-3")}
                            style={{
                              overflowY: "scroll",
                              overflowX: "hidden",
                              height: "63vh",
                            }}
                          >
                            <Table stickyHeader>
                              <TableHead>
                                <TableRow>
                                  <TableCell
                                    className={classes.textMiddle}
                                  ></TableCell>
                                  <TableCell className={classes.textRight}>
                                    <div>
                                      <b style={{ color: "#B0B0B0" }}>
                                        Select All
                                      </b>
                                    </div>
                                  </TableCell>
                                  <TableCell className={classes.textMiddle}>
                                    {console.log(users)}
                                    <Checkbox
                                      color="primary"
                                      // indeterminate={numSelected > 0 && numSelected < data.length  }
                                      indeterminate={
                                        selected.length > 0 &&
                                        selected.length < users.length
                                      }
                                      checked={
                                        users.length > 0 &&
                                        selected.length === users.length
                                      }
                                      onChange={handleSelectAllClick}
                                    />
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {users
                                  .slice(
                                    page * rowsPerPage,
                                    page * rowsPerPage + rowsPerPage
                                  )
                                  .map((user, index) => {
                                    const isItemSelected = isSelected(user._id);

                                    return (
                                      <TableRow
                                        key={user._id}
                                        hover
                                        onClick={(event) =>
                                          handleClick(event, user._id)
                                        }
                                        role="checkbox"
                                        tabIndex={-1}
                                        selected={isItemSelected}
                                      >
                                        <TableCell
                                          component="th"
                                          scope="row"
                                          className={classes.textMiddle}
                                        >
                                          {/* <BsPersonFill className={classes.personIcon}/> */}
                                          <img
                                            src={get(user, "profile_image", "")}
                                            alt="profile"
                                            style={{
                                              width: "30px",
                                              height: "30px",
                                            }}
                                          />
                                        </TableCell>
                                        <TableCell
                                          className={classes.textMiddle}
                                        >
                                          {get(user, "name", "")}
                                        </TableCell>
                                        <TableCell
                                          className={classes.textMiddle}
                                        >
                                          <Checkbox
                                            color="primary"
                                            checked={isItemSelected}
                                          />
                                        </TableCell>
                                      </TableRow>
                                    );
                                  })}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </div>
                      </div>
                    </div>
                  </Table>
                </TableContainer>
              </Paper>
            </div>
          </div>
        </Paper>
      </div>
    </React.Fragment>
  );
};

export default Index;
