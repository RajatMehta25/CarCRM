import React, { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import axios from "../../axios";
import { toast } from "react-toastify";

import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination,     } from '@material-ui/core';

import { Delete } from '@material-ui/icons';
import VisibilityIcon from '@material-ui/icons/Visibility';
import BlockIcon from '@material-ui/icons/Block';


// For Table
import SearchBar from "material-ui-search-bar";
import { get } from "lodash";



const useStyles = makeStyles((theme) => ({
  root: {
    flexWrap: 'wrap',
    marginTop: '5rem',
  },
  margin: {
    margin: theme.spacing(1),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
  paperHeading: {
      padding: '1rem 0rem',
  },
  table: {
      minWidth: 650,
  },
  textMiddle: {
      verticalAlign: 'middle !important',
  },
  iconMargin: {
    marginRight: '0.5rem',
  },
  headingButton: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  container: {
    maxHeight: '58vh',
  },
  paperPaddingRightLeft: {
    padding: '0rem 1rem',
  },
}));





export default function TableData(props) {
  const classes = useStyles();

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    getCategory();
  }, []);


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

  // For Search 
  const [searched, setSearched] = useState("");
  const [searchedData, setSearchedData] = useState([]);

  const requestSearch = (searchedVal) => {
    const filteredRows = searchedData.filter((row) => {
      let name = row.firstName+" "+ row.lastName;
      return name.toLowerCase().includes(searchedVal.toLowerCase()) || row.email.toLowerCase().includes(searchedVal.toLowerCase()) || row.mobileNumber.toLowerCase().includes(searchedVal.toLowerCase());
    });
    setTableData(filteredRows);
  };

  const cancelSearch = () => {
    setSearched("");
    getCategory();
    // requestSearch(searched);
    // console.log('cancwlled');
    };

  

  // console.log(props);

  const getCategory = async () => {
    // setIsloading(true);
    try {
      const { data } = await axios.get("/admin/get_users_list");
      console.log(data);
      setTableData(data.users);
      setSearchedData(data.users);
      // setIsloading(false);
    } catch (error) {
      console.log(error);
      // setIsloading(false);
    }
  };

  const deleteCategory = async (id) => {
    if(window.confirm('Are you sure you want to delete this User?')) {
      try {
        await axios.post("/admin/delete_user", {
          _id: id,
        });
        getCategory();
        toast.success("User deleted successfully", {
          position: toast.POSITION.TOP_RIGHT,
        });
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong.", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } else {
      getCategory();
    }
    
  };


  const is_approved = (e) => {
    if(e === true) {
      return "Approved"
    } else if (e === false) {
      return ""
    } else {
      return ""
    }
  }

  const userBlocked = async (e) => {
    // console.log(e);
    if(e.categoryBlocked === true) {
      if(window.confirm('Are you sure you want to unblock this user?')) {
        try {
          await axios.post("/admin/block_unblock_user", {
            _id: e.categoryId,
            isBlocked: false
          });
          getCategory();
          toast.success("User unblocked successfully", {
            position: toast.POSITION.TOP_RIGHT,
          });
        } catch (error) {
          console.log(error);
        }
      } else {
        getCategory();
      }
    } else if (e.categoryBlocked === false) {
      if(window.confirm('Are you sure you want to block this product?')) {
        try {
          await axios.post("/admin/block_unblock_user", {
            _id: e.categoryId,
            isBlocked: true
          });
          getCategory();
          toast.success("User blocked successfully", {
            position: toast.POSITION.TOP_RIGHT,
          });
        } catch (error) {
          console.log(error);
        }
      } else {
        getCategory();
      }
    } else {
      return "error"
    }
    
  };

  const blockColor = (e) => {
    if (e === true) {
      return "secondary"
    } else if (e === false) {
      return "primary"
    } else {
      return ""
    }
  }


  return (
    <React.Fragment>
      <div className={classes.root}>
        <Paper>
          <div className={classes.paperPaddingRightLeft}>
            <div className="py-4">
                <Paper elevation={0} className={classNames(classes.paperHeading, classes.headingButton)}>
                    <h1>Account Management</h1>
                    <SearchBar
                      value={searched}
                      onChange={(searchVal) => requestSearch(searchVal)}
                      onCancelSearch={() => cancelSearch()}
                    />
                    <div>
                      {/*<Button 
                      variant="outlined"
                      // color="primary" 
                      aria-label="add"
                      className={classes.iconMargin}
                      onClick={() => {
                        props.history.goBack();
                      }}                                      
                      >
                        <ArrowBackIcon/>
                      </Button>*/}
                      {/*<Button 
                      variant="contained"
                      color="primary" 
                      aria-label="add"
                      className={classes.iconMargin}
                      onClick={()=> {
                        props.history.push({
                          pathname: "//addCategory",
                        });
                      }}                                     
                      >
                        Add Category
                    </Button>*/}
                    </div>
                </Paper>
                <Paper>
                  <TableContainer className={classes.container}>
                    <Table className={classes.table} stickyHeader>
                      <TableHead>
                          <TableRow>
                              <TableCell>Sr. No.</TableCell>
                              <TableCell>User Name</TableCell>
                              <TableCell>Email Id</TableCell>
                              <TableCell>Mobile Number</TableCell>
                              <TableCell>User Type</TableCell>
                              <TableCell>Status</TableCell>
                              <TableCell>Actions</TableCell>
                          </TableRow>
                      </TableHead>
                      <TableBody>
                            {tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((category, index) => (
                                <TableRow key={category._id}>
                                    <TableCell component="th" scope="row" className={classes.textMiddle}>
                                        {index + 1+ (page)*rowsPerPage}
                                    </TableCell>
                                    <TableCell className={classes.textMiddle}>{category.firstName} {category.lastName}</TableCell>
                                    <TableCell className={classes.textMiddle}>
                                      {category.email}
                                    </TableCell>
                                    <TableCell className={classes.textMiddle}>
                                      {category.mobileNumber}
                                    </TableCell>
                                    <TableCell className={classes.textMiddle}>
                                      { get(category, "userType.title", "")}
                                    </TableCell>
                                    <TableCell className={classes.textMiddle}>
                                      {(category.userType.type === "NEEDAPPROVEL") && (category.isapproved === false) &&
                                      <div style={{backgroundColor:"yellow",color:"black", padding: "0.25rem 0.55rem", borderRadius:"0.4rem", textAlign:"center"}}>
                                        Pending
                                      </div>
                                      } 

                                      {(category.userType.type === "NEEDAPPROVEL") && (category.isapproved === true) &&
                                      <div style={{backgroundColor:"green",color:"white", padding: "0.25rem 0.55rem", borderRadius:"0.4rem", textAlign:"center"}}>
                                       {is_approved(category.isapproved)}
                                      </div>
                                      } 
                                    
                                    </TableCell>
                                    <TableCell>
                                      <div  className={classes.tableFlex}>
                                            <Button 
                                            variant="outlined"
                                            // color="primary" 
                                            aria-label="add"
                                            className={classes.iconMargin}
                                            onClick={() => {
                                                props.history.push({
                                                pathname: "/account-details",
                                                state: category,
                                            });
                                            }}                                      
                                            >
                                                <VisibilityIcon
                                                color="primary" 
                                                />
                                            </Button>
                                            <Button 
                                            variant="outlined"
                                            // color="primary" 
                                            aria-label="add"
                                            className={classes.iconMargin}
                                            onClick={() => {
                                                userBlocked({categoryId:category._id,categoryBlocked:category.isBlocked});
                                            }}                                      
                                            >
                                            <BlockIcon
                                              color={blockColor(category.isBlocked)} 
                                            />
                                            </Button>
                                          <Button 
                                          variant="outlined"
                                          aria-label="add"
                                          onClick={() => deleteCategory(category._id)}                                
                                          >
                                            <Delete
                                              className={classes.deleteColor}
                                            /> 
                                          </Button>
                                      </div>
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
    </React.Fragment>
  );
}
