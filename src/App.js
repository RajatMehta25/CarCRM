import React from "react";
import { Switch, BrowserRouter as Router } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import { API_URL } from "./statics/constants";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Import Routes
import { authProtectedRoutes, publicRoutes, dynamicRoutes } from "./routes/index.js";
import AppRoute from "./routes/route";
// import AppRoute,{PrivateRoute,PublicOnlyRoute} from "./routes/route";

// layouts
import VerticalLayout from "./components/VerticalLayout/";
import HorizontalLayout from "./components/HorizontalLayout/";
import NonAuthLayout from "./components/NonAuthLayout";

// Import scss
import "./theme.scss";

const App = (props) => {
  // console.log(props);
  /**
   * Returns the layout
   */
  axios.defaults.baseURL = API_URL;
  const getLayout = () => {
    let layoutCls = VerticalLayout;

    switch (props.layout.layoutType) {
      case "horizontal":
        layoutCls = HorizontalLayout;
        break;
      default:
        layoutCls = VerticalLayout;
        break;
    }
    return layoutCls;
  };
  const Layout = getLayout();

  return (
    <React.Fragment>
      <Router>
        <Switch>
          {publicRoutes.map((route, idx) => (
            <AppRoute
              path={route.path}
              layout={NonAuthLayout}
              component={route.component}
              key={idx}
              isAuthProtected={false}
              title={route.title}
            />
          ))}
          {/* 
          {authProtectedRoutes.map((route, idx) => (
            <AppRoute
              path={route.path}
              layout={Layout}
              component={route.component}
              key={idx}
              isAuthProtected={true}
              title={route.title}
            />
      ))} */}

          {dynamicRoutes().map((route, idx) => (
            <AppRoute
              path={route.path}
              layout={Layout}
              component={route.component}
              key={idx}
              isAuthProtected={true}
              title={(console.log(route.title), route.title)}
            />
          ))}
          {/* <AppRoute path="/" component={Login} /> */}
        </Switch>
      </Router>
      <ToastContainer />
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    layout: state.Layout,
  };
};

export default connect(mapStateToProps, null)(App);
