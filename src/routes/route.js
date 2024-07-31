import React, { Suspense } from "react";
import { Route, Redirect } from "react-router-dom";
import Cookies from "js-cookie";
// import { routesToMap } from ".";
const AppRoute = ({ component: Component, layout: Layout, isAuthProtected, title, ...rest }) => {
  const token = Cookies.get("admin_access_token");

  console.log("----------------------------------", title);

  return (
    <Route
      {...rest}
      render={(props) => {
        if (isAuthProtected && !token) {
          return <Redirect to={{ pathname: "/adminPanel/login", state: { from: props.location } }} />;
        }

        return (
          <Layout title={title}>
            <Suspense fallback={<div>loading..</div>}>
              <Component {...props} />
            </Suspense>
          </Layout>
        );
      }}
    />
  );
};

export default AppRoute;
