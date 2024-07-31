import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import axios from "../../axios";
import { toast } from "react-toastify";
// import Switch from '@mui/material/Switch';
// import { styled } from '@mui/material/styles';

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
import "./Subscription_Management.css";

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
export default function Subscription_Management(props) {
  const classes = useStyles();

  const {
    location: { state },
  } = props;
  // const history=useHistory();

  const [tableData, setTableData] = useState([]);

  //User Type
  const [userType, setUserType] = useState([]);
  // capture ID on click
  const [changeid, setChangeId] = useState(null);
  // status switch
  // const [checked, setChecked] = useState(true);

  // color for button
  const [colorid, setColorid] = useState("");
  // title name
  const [titlename, setTitle] = useState("");
  // For Pagination
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    // console.log(event);
    // console.log(newPage);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    getUserTypes();
    getSubscriptionPlans();
  }, []);

  //get content

  const getUserTypes = async () => {
    try {
      const { data } = await axios.get("/admin/get_users_types");
      // console.log(data);
      setUserType(data.userType);

      console.log(data.userType);
    } catch (error) {
      console.log(error);
      // setIsloading(false);
    }
  };
  // get data

  const getSubscriptionPlans = async (id) => {
    try {
      if (id && id !== "") {
        const { data } = await axios.get("/admin/get_subscription_plans");
        console.log(data);
        console.log(data.plan);
        let newTableData = data.plan.filter((item) => item.userType._id === id);
        setTableData(
          orderBy(newTableData, (o) => new Date(o.createdAt).getTime(), [
            "desc",
          ])
        );
        setSearchedData(newTableData);

        setColorid(id);
        console.log(data.plan);
      } else {
        const { data } = await axios.get("/admin/get_subscription_plans");
        console.log(data);
        console.log(data.plan);
        if (state && state !== "undefined") {
          console.log(state);
          console.log(data.plan);
          let newTableData = data.plan.filter(
            (item) => item.userType._id === state
          );
          console.log(newTableData);
          let titleFind = data.plan.find((item) => item.userType._id === state)
            ?.userType.title;
          // let whenNoTitle=userType.find((item) => item._id === state).title
          // console.log(whenNoTitle);
          console.log(titleFind);
          setTableData(
            orderBy(newTableData, (o) => new Date(o.createdAt).getTime(), [
              "desc",
            ])
          );
          setSearchedData(newTableData);
          setColorid(state);
          switch (state) {
            case "61b0df509d05e9e75bdf4fc3":
              setChangeId({
                userType: { title: "Individual User", _id: state },
                Operation: "Add",
              });
              break;
            case "61b0df509d05e9e75bdf4fc4":
              setChangeId({
                userType: { title: "Agent Reprensentative", _id: state },
                Operation: "Add",
              });
              break;
            case "61b0df509d05e9e75bdf4fc5":
              setChangeId({
                userType: {
                  title: "Management Company Representative",
                  _id: state,
                },
                Operation: "Add",
              });
              break;
            case "61b0df509d05e9e75bdf4fc6":
              setChangeId({
                userType: { title: "Lawyer", _id: state },
                Operation: "Add",
              });
              break;
            case "61b0df509d05e9e75bdf4fc7":
              setChangeId({
                userType: { title: "Production", _id: state },
                Operation: "Add",
              });
              break;
            case "61b0df509d05e9e75bdf4fc8":
              setChangeId({
                userType: { title: "Subscriber Staff Member", _id: state },
                Operation: "Add",
              });
              break;
            default:
              setChangeId({
                userType: { title: titleFind, _id: state },
                Operation: "Add",
              });
              break;
          }
        } else {
          let newTableData = data.plan.filter(
            (item) => item.userType._id === "61b0df509d05e9e75bdf4fc3"
          );
          setTableData(
            orderBy(newTableData, (o) => new Date(o.createdAt).getTime(), [
              "desc",
            ])
          );
          setSearchedData(newTableData);
          setChangeId({
            userType: {
              title: "Individual User",
              _id: "61b0df509d05e9e75bdf4fc3",
            },
            Operation: "Add",
          });
          setColorid("61b0df509d05e9e75bdf4fc3");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  //edit  categories attribute

  // delete category

  // For Search
  const [searched, setSearched] = useState("");
  const [searchedData, setSearchedData] = useState([]);

  const requestSearch = (searchedVal) => {
    console.log(searchedVal);

    const filteredRows = searchedData.filter((row) => {
      let name = row.planName;
      return name.toLowerCase().includes(searchedVal.toLowerCase());
      console.log(name);
    });
    setTableData(filteredRows);
  };

  const cancelSearch = () => {
    getSubscriptionPlans(colorid);
    // setSearched("");
    //  console.log(searchedData);
    //  requestSearch()
  };

  //delete subscription
  const deleteSubscription = async (id) => {
    try {
      const { data } = await axios.post("/admin/remove_subscription_plan", {
        planId: id,
      });
      toast.success(data.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      getSubscriptionPlans(state);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const statusSwitch = async (e, category) => {
    try {
      // console.log(e);
      console.log(category);

      const { data } = await axios.post("/admin/block_unblock_plan", {
        planId: category._id,
        is_blocked: e.target.checked,
      });
      // props.history.push({
      //     pathname: "/Category_Management",
      //   });
      getSubscriptionPlans(category.userType._id);
      toast.success(data.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      // console.log(data);
    } catch (error) {
      console.log(error);
    }

    // console.log(e.target.checked);
    // console.log(checked);
    // console.log(id);
  };
  return (
    <React.Fragment>
      <div className="page-content">
        <div className={classes.root}>
          <Paper>
            <div className={classes.paperPaddingRightLeft}>
              <div className="py-4">
                <Paper
                  elevation={0}
                  className={classNames(
                    classes.paperHeading,
                    classes.headingAlignment
                  )}
                >
                  <h3 style={{}}>Subscription Management</h3>
                  <SearchBar
                    // value={searched}
                    className="heightfix"
                    onChange={(searchVal) => requestSearch(searchVal)}
                    onCancelSearch={() => cancelSearch()}
                    placeholder="Plan Name"
                  />
                  <Button
                    variant="contained"
                    className="buttoncss"
                    style={{ backgroundColor: "#0e3f37", color: "#fff" }}
                    onClick={() => {
                      props.history.push({
                        pathname: "/adminPanel/AddEditSubscription",
                        state: changeid,
                      });
                    }}
                  >
                    {" "}
                    ADD Subscription
                  </Button>
                </Paper>

                {/* //new design */}
                <Paper
                  elevation={0}
                  className={classNames(
                    classes.paperHeading,
                    classes.headingButton
                  )}
                >
                  <div>
                    {userType.map((type, i) => (
                      <Button
                        variant="contained"
                        //color="primary"
                        aria-label="add"
                        className={
                          classes.iconMargin +
                          " " +
                          (colorid === type._id ? classes.iconcolor : "")
                        }
                        key={i + 1}
                        onClick={() => {
                          // localStorage.removeItem('savemaindata');
                          // showStatusButton(type._id)
                          // getCategory(type._id)
                          //                           setChangeId(type._id)

                          // localStorage.removeItem('maindata')
                          setChangeId({
                            userType: { title: type.title, _id: type._id },
                            Operation: "Add",
                          });
                          console.log(type._id);
                          getSubscriptionPlans(type._id);
                        }}
                      >
                        {type.title}
                      </Button>
                    ))}
                  </div>
                </Paper>

                {/* <br /> */}

                {/* status end */}

                <Paper>
                  <TableContainer className={classes.container}>
                    <Table className={classes.table} stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell
                            style={{ fontWeight: "bold", textAlign: "center" }}
                          >
                            Sr. No.
                          </TableCell>
                          <TableCell
                            style={{ fontWeight: "bold", textAlign: "center" }}
                          >
                            Plan Name
                          </TableCell>
                          <TableCell
                            style={{ fontWeight: "bold", textAlign: "center" }}
                          >
                            Plan Type
                          </TableCell>
                          <TableCell
                            style={{ fontWeight: "bold", textAlign: "center" }}
                          >
                            Price
                          </TableCell>
                          <TableCell
                            style={{ fontWeight: "bold", textAlign: "center" }}
                          >
                            Status
                          </TableCell>
                          <TableCell
                            style={{ textAlign: "center", fontWeight: "bold" }}
                          >
                            Actions
                          </TableCell>
                          {/* <TableCell>User Type</TableCell>
                              <TableCell>Status</TableCell> */}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {tableData
                          .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                          .map((category, index) => (
                            <TableRow key={index}>
                              <TableCell
                                component="th"
                                scope="row"
                                className={classes.textMiddle}
                                style={{ textAlign: "center" }}
                              >
                                {index + 1 + page * rowsPerPage}
                              </TableCell>
                              <TableCell
                                className={classes.textMiddle}
                                style={{ textAlign: "center" }}
                              >
                                {category.planName}
                              </TableCell>

                              <TableCell style={{ textAlign: "center" }}>
                                {category.planType}
                              </TableCell>
                              <TableCell style={{ textAlign: "center" }}>
                                {`$` + category.planPrice}
                              </TableCell>
                              <TableCell style={{ textAlign: "center" }}>
                                <Tooltip title="Active/Inactive" arrow>
                                  <Android12Switch
                                    onChange={(e) => {
                                      statusSwitch(e, category);
                                    }}
                                    checked={category.is_blocked}
                                  />
                                </Tooltip>
                              </TableCell>

                              <TableCell
                                className={classes.textMiddle}
                                style={{ textAlign: "center" }}
                              >
                                <Button
                                  onClick={() => {
                                    props.history.push({
                                      pathname:
                                        "/adminPanel/AddEditSubscription",
                                      state: category,
                                    });
                                  }}
                                  className=""
                                  style={{
                                    border: "1.5px solid #c4c4c4",
                                    margin: "0.5rem",
                                    color: "#0e3f37",
                                  }}
                                >
                                  <Tooltip title="Edit Plan" arrow>
                                    <EditIcon />
                                  </Tooltip>
                                </Button>
                                {/* <Button onClick={()=>BlockCategory} style={{backgroundColor:"#696969"}} >Manage</Button> */}

                                {/* <Button  className="" style={{border:"1.5px solid #c4c4c4",margin:"0.5rem",color:"#0e3f37"}} > <Tooltip title="Manage Category" arrow><WidgetsOutlined /></Tooltip></Button> */}
                                {/* <Button onClick={()=>BlockCategory} style={{backgroundColor:"#696969"}} >Manage</Button> */}

                                <Button
                                  className=""
                                  onClick={() => {
                                    deleteSubscription(category._id);
                                  }}
                                  style={{
                                    border: "1.5px solid #c4c4c4",
                                    margin: "0.5rem",
                                    color: "#696969",
                                  }}
                                >
                                  <Tooltip title="Delete Plan" arrow>
                                    <DeleteOutline />
                                  </Tooltip>
                                </Button>
                                {/* <Button onClick={()=>BlockCategory} style={{backgroundColor:"#696969"}} >Manage</Button> */}
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TablePagination
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
    </React.Fragment>
  );
}
