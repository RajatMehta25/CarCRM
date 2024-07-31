import React, { Component } from "react";

// MetisMenu
import MetisMenu from "metismenujs";
import { withRouter } from "react-router-dom";
import { NavLink } from "react-router-dom";
import Cookies from "js-cookie";
//i18n
import { withNamespaces } from "react-i18next";

import { connect } from "react-redux";
import { changeLayout, changeLayoutWidth, changeSidebarTheme, changeSidebarType, changePreloader } from "../../store/actions";

class SidebarContent extends Component {
  constructor(props) {
    var rolesAccess = Cookies.get("access") ? JSON.parse(Cookies.get("access")) : [];
    super(props);
    this.state = { clicked: false, rolesAccess: rolesAccess, clicked2: false };
  }

  componentDidMount() {
    this.initMenu();
    this.setState({ ...this.state, clicked: false, clicked2: false });
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      if (this.props.type !== prevProps.type) {
        this.initMenu();
      }
    }
    console.log(this.state);
  }

  initMenu() {
    new MetisMenu("#side-menu");

    var matchingMenuItem = null;
    var ul = document.getElementById("side-menu");
    console.log("ul list", ul);
    var items = ul.getElementsByTagName("a");
    console.log("items", items);
    for (var i = 0; i < items.length; ++i) {
      if (this.props.location.pathname === items[i].pathname) {
        matchingMenuItem = items[i];
        console.log("matchingMenuItem", matchingMenuItem);
        break;
      }
    }
    if (matchingMenuItem) {
      this.activateParentDropdown(matchingMenuItem);
    }
  }

  activateParentDropdown = (item) => {
    item.classList.add("active");
    const parent = item.parentElement;
    console.log("parent", parent);

    if (parent) {
      parent.classList.add("mm-active");
      const parent2 = parent.parentElement;
      console.log("parent2", parent2);
      if (parent2) {
        parent2.classList.add("mm-show");

        const parent3 = parent2.parentElement;
        console.log("parent3", parent3);
        if (parent3) {
          parent3.classList.add("mm-active"); // li
          parent3.childNodes[0].classList.add("mm-active"); //a
          const parent4 = parent3.parentElement;
          console.log("parent4", parent4);
          if (parent4) {
            parent4.classList.add("mm-active");
          }
        }
      }
      return false;
    }
    return false;
  };

  render() {
    return (
      <React.Fragment>
        <div id="sidebar-menu">
          <ul className="metismenu list-unstyled" id="side-menu">
            <li className="menu-title">{this.props.t("Menu")}</li>
            {/* {(this.state.rolesAccess.includes("All") ||
              this.state.rolesAccess.includes("Dashboard")) && ( */}
            <li>
              <NavLink
                to="/adminPanel/dashboard"
                className="waves-effect"
                // style={{
                //   fontSize: 16,
                //   display: "flex",
                //   alignItems: "flex-start",
                //   // alignItems: "center",
                // }}
              >
                <i className="ri-dashboard-line"></i>
                {/*<span className="badge badge-pill badge-success float-right">3</span>*/}
                <span
                  style={{
                    borderBottom: this.props.history.location.pathname == "/adminPanel/dashboard" ? "2px solid #fff" : "",
                  }}
                  className="ml-1"
                >
                  {this.props.t("Dashboard")}
                </span>
              </NavLink>
            </li>
            {/* )} */}
            {(this.state.rolesAccess.includes("All") || this.state.rolesAccess.includes("Manage Banner")) && (
              <li>
                <NavLink
                  to="/adminPanel/BannerManagement"
                  className="waves-effect"
                  style={{
                    fontSize: 16,
                    display: "flex",
                    alignItems: "flex-start",
                  }}
                >
                  <i class="ri-image-2-fill"></i>
                  <span
                    style={{
                      borderBottom:
                        this.props.history.location.pathname == "/adminPanel/BannerManagement" ? "2px solid #fff" : "",
                    }}
                    className="ml-1"
                  >
                    {this.props.t("Manage Banner")}
                  </span>
                </NavLink>
              </li>
            )}
            {(this.state.rolesAccess.includes("All") || this.state.rolesAccess.includes("Manage User")) && (
              <li>
                <NavLink
                  to="/adminPanel/user-management"
                  className="waves-effect"
                  style={{
                    fontSize: 16,
                    display: "flex",
                    alignItems: "flex-start",
                    // alignItems: "center",
                  }}
                >
                  <i className="ri-user-3-fill"></i>{" "}
                  <span
                    style={{
                      borderBottom:
                        this.props.history.location.pathname == "/adminPanel/user-management" ? "2px solid #fff" : "",
                    }}
                    className="ml-1"
                  >
                    {this.props.t("Manage User")}
                  </span>
                </NavLink>
              </li>
            )}

            {/* {(this.state.rolesAccess.includes("All") || this.state.rolesAccess.includes("Manage Driver")) && (
              <li>
                <NavLink
                  to="/adminPanel/driver-management"
                  className="waves-effect"
                  style={{
                    fontSize: 16,
                    display: "flex",
                    alignItems: "flex-start",
                    // alignItems: "center",
                  }}
                >
                  <i class="ri-user-2-fill"></i> <span className="ml-1">{this.props.t("Manage Driver")}</span>
                </NavLink>
              </li>
            )} */}
            {/* driver lsiting */}
            {(this.state.rolesAccess.includes("All") || this.state.rolesAccess.includes("Manage Driver")) && (
              <li>
                <NavLink
                  to="/Driver-management"
                  className="waves-effect submenu"
                  onClick={() => {
                    this.setState({ ...this.state, clicked2: !this.state.clicked2, clicked: false });
                    console.log(this.state.clicked2, ":::::::");
                  }}
                >
                  <i class="ri-user-2-fill"></i>

                  <span className="ml-1">{this.props.t("Manage Driver")}</span>
                  {this.state.clicked2 === false ? (
                    <i className="ri-arrow-right-s-fill"></i>
                  ) : (
                    <i className="ri-arrow-down-s-fill"></i>
                  )}
                </NavLink>
                {
                  <ul style={{ backgroundColor: "#4d9aff", paddingLeft: "10px" }}>
                    <li>
                      <NavLink to="/adminPanel/ApprovedDriver" className="waves-effect">
                        <i class="ri-check-line"></i>
                        <span
                          className="ml-1"
                          style={{
                            borderBottom:
                              this.props.history.location.pathname == "/adminPanel/ApprovedDriver" ? "2px solid #fff" : "",
                          }}
                        >
                          {this.props.t("Approved Driver ")}
                        </span>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/adminPanel/PendingDriver" className="waves-effect">
                        <i
                          class="ri-error-warning-line"
                          // style={{
                          //   color: this.props.history.location.pathname == "/adminPanel/PendingDriver" ? "#191919" : "white",
                          // }}
                        ></i>
                        <span
                          className="ml-1"
                          style={{
                            borderBottom:
                              this.props.history.location.pathname == "/adminPanel/PendingDriver" ? "2px solid #fff" : "",
                          }}
                        >
                          {this.props.t("Pending Driver ")}
                        </span>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/adminPanel/DisapprovedDriver" className="waves-effect">
                        <i class="ri-close-line"></i>
                        <span
                          className="ml-1"
                          style={{
                            borderBottom:
                              this.props.history.location.pathname == "/adminPanel/DisapprovedDriver" ? "2px solid #fff" : "",
                          }}
                        >
                          {this.props.t("Disapproved Driver ")}
                        </span>
                      </NavLink>
                    </li>
                  </ul>
                }
              </li>
            )}

            {(this.state.rolesAccess.includes("All") || this.state.rolesAccess.includes("Manage Tip")) && (
              <li>
                <NavLink
                  to="/adminPanel/Tip_Management"
                  className="waves-effect"
                  style={{
                    fontSize: 16,
                    display: "flex",
                    alignItems: "flex-start",
                  }}
                >
                  <i class="ri-money-dollar-circle-fill"></i>
                  <span
                    style={{
                      borderBottom:
                        this.props.history.location.pathname == "/adminPanel/Tip_Management" ? "2px solid #fff" : "",
                    }}
                    className="ml-1"
                  >
                    {this.props.t("Manage Tip")}
                  </span>
                </NavLink>
              </li>
            )}
            {/* service */}
            {(this.state.rolesAccess.includes("All") || this.state.rolesAccess.includes("Manage Service")) && (
              <li>
                <NavLink
                  to="/Service-management"
                  className="waves-effect submenu"
                  onClick={() => {
                    this.setState({ ...this.state, clicked: !this.state.clicked, clicked2: false });
                    console.log(this.state.clicked, ":::::::");
                  }}
                >
                  <i className="ri-building-line"></i>

                  <span className="ml-1">{this.props.t("Manage Service")}</span>
                  {this.state.clicked === false ? (
                    <i className="ri-arrow-right-s-fill"></i>
                  ) : (
                    <i className="ri-arrow-down-s-fill"></i>
                  )}
                </NavLink>
                <ul style={{ backgroundColor: "#4d9aff", paddingLeft: "10px" }}>
                  <li>
                    <NavLink to="/adminPanel/TaxiSingleManagement" className="waves-effect">
                      <i class="ri-taxi-line"></i>

                      <span
                        className="ml-1"
                        style={{
                          borderBottom:
                            this.props.history.location.pathname == "/adminPanel/TaxiSingleManagement" ? "2px solid #fff" : "",
                        }}
                      >
                        {this.props.t("Single Taxi")}
                      </span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/adminPanel/ManageDesignatedDriver" className="waves-effect">
                      <i className="ri-account-circle-line"></i>
                      <span
                        className="ml-1"
                        style={{
                          borderBottom:
                            this.props.history.location.pathname == "/adminPanel/ManageDesignatedDriver"
                              ? "2px solid #fff"
                              : "",
                        }}
                      >
                        {this.props.t("Designated Driver ")}
                      </span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/adminPanel/PetCategoryManagement" className="waves-effect">
                      <i class="ri-bear-smile-fill"></i>
                      <span
                        className="ml-1"
                        style={{
                          borderBottom:
                            this.props.history.location.pathname == "/adminPanel/PetCategoryManagement" ? "2px solid #fff" : "",
                        }}
                      >
                        {this.props.t("Pet Service")}
                      </span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/adminPanel/PackageManagement" className="waves-effect">
                      <i class="ri-red-packet-fill"></i>
                      <span
                        className="ml-1"
                        style={{
                          borderBottom:
                            this.props.history.location.pathname == "/adminPanel/PackageManagement" ? "2px solid #fff" : "",
                        }}
                      >
                        {this.props.t("Package Service")}
                      </span>
                    </NavLink>
                  </li>
                </ul>
              </li>
            )}
            {/* service */}
            {(this.state.rolesAccess.includes("All") || this.state.rolesAccess.includes("Manage Booking")) && (
              <li>
                <NavLink
                  to="/adminPanel/Booking_Management"
                  className="waves-effect"
                  style={{
                    fontSize: 16,
                    display: "flex",
                    alignItems: "flex-start",
                    // alignItems: "center",
                  }}
                >
                  <i class="ri-book-open-fill"></i>{" "}
                  <span
                    style={{
                      borderBottom:
                        this.props.history.location.pathname == "/adminPanel/Booking_Management" ? "2px solid #fff" : "",
                    }}
                    className="ml-1"
                  >
                    {this.props.t("Manage Booking")}
                  </span>
                </NavLink>
              </li>
            )}
            {(this.state.rolesAccess.includes("All") || this.state.rolesAccess.includes("Manage Scheduled Rides")) && (
              <li>
                <NavLink
                  to="/adminPanel/ScheduledRidesManagement"
                  className="waves-effect"
                  style={{
                    fontSize: 16,
                    display: "flex",
                    alignItems: "flex-start",
                    // alignItems: "center",
                  }}
                >
                  <i class="ri-taxi-fill"></i>
                  <span
                    style={{
                      borderBottom:
                        this.props.history.location.pathname == "/adminPanel/ScheduledRidesManagement" ? "2px solid #fff" : "",
                    }}
                    className="ml-1"
                  >
                    {this.props.t("Manage Scheduled Rides")}
                  </span>
                </NavLink>
              </li>
            )}
              {(this.state.rolesAccess.includes("All") || this.state.rolesAccess.includes("Manage Miles")) && (
              <li>
                <NavLink to="/adminPanel/MilesManagement" className="waves-effect">
                <i class="ri-coins-line"></i>
                  <span
                    style={{
                      borderBottom:
                        this.props.history.location.pathname == "/adminPanel/MilesManagement" ? "2px solid #fff" : "",
                    }}
                    className="ml-1"
                  >
                    {this.props.t("Manage Miles")}
                  </span>
                </NavLink>
              </li>
            )}
              {(this.state.rolesAccess.includes("All") || this.state.rolesAccess.includes("Manage Gift Card")) && (
              <li>
                <NavLink to="/adminPanel/GiftCardManagement" className="waves-effect">
                <i class="ri-gift-fill"></i>
                  <span
                    style={{
                      borderBottom:
                        this.props.history.location.pathname == "/adminPanel/GiftCardManagement" ? "2px solid #fff" : "",
                    }}
                    className="ml-1"
                  >
                    {this.props.t("Manage Gift Card")}
                  </span>
                </NavLink>
              </li>
            )}
            {(this.state.rolesAccess.includes("All") || this.state.rolesAccess.includes("Manage Promocode")) && (
              <li>
                <NavLink
                  to="/adminPanel/PromoCode_Management"
                  className="waves-effect"
                  style={{
                    fontSize: 16,
                    display: "flex",
                    alignItems: "flex-start",
                    // alignItems: "center",
                  }}
                >
                  <i class="ri-coupon-3-fill"></i>{" "}
                  <span
                    style={{
                      borderBottom:
                        this.props.history.location.pathname == "/adminPanel/PromoCode_Management" ? "2px solid #fff" : "",
                    }}
                    className="ml-1"
                  >
                    {this.props.t("Manage Promocode")}
                  </span>
                </NavLink>
              </li>
            )}
            {(this.state.rolesAccess.includes("All") || this.state.rolesAccess.includes("Manage Cancellation Reason")) && (
              <li>
                <NavLink to="/adminPanel/CancellationReason" className="waves-effect">
                  <i class="ri-close-circle-fill"></i>
                  <span
                    style={{
                      borderBottom:
                        this.props.history.location.pathname == "/adminPanel/CancellationReason" ? "2px solid #fff" : "",
                    }}
                    className="ml-1"
                  >
                    {this.props.t("Manage Cancellation Reason")}
                  </span>
                </NavLink>
              </li>
            )}

            {/* {(this.state.rolesAccess.includes("All") || this.state.rolesAccess.includes("Manage Payment")) && (
              <li>
                <NavLink
                  to="/adminPanel/Payment_Management"
                  className="waves-effect"
                  style={{
                    fontSize: 16,
                    display: "flex",
                    alignItems: "flex-start",
                    // alignItems: "center",
                  }}
                >
                  <i className="ri-admin-fill"></i>
                  <span className="ml-1">{this.props.t("Manage Payment")}</span>
                </NavLink>
              </li>
            )} */}

            {(this.state.rolesAccess.includes("All") || this.state.rolesAccess.includes("Manage SubAdmin")) && (
              <li>
                <NavLink
                  to="/adminPanel/SubAdmin_Management"
                  className="waves-effect"
                  style={{
                    fontSize: 16,
                    display: "flex",
                    alignItems: "flex-start",
                    // alignItems: "center",
                  }}
                >
                  <i className="ri-admin-fill"></i>
                  <span
                    style={{
                      borderBottom:
                        this.props.history.location.pathname == "/adminPanel/SubAdmin_Management" ? "2px solid #fff" : "",
                    }}
                    className="ml-1"
                  >
                    {this.props.t("Manage SubAdmin")}
                  </span>
                </NavLink>
              </li>
            )}

            {(this.state.rolesAccess.includes("All") || this.state.rolesAccess.includes("Manage Notification")) && (
              <li>
                <NavLink
                  to="/adminPanel/Notification_Management"
                  className="waves-effect"
                  style={{
                    fontSize: 16,
                    display: "flex",
                    alignItems: "flex-start",
                    // alignItems: "center",
                  }}
                >
                  <i class="ri-notification-2-fill"></i>
                  <span
                    style={{
                      borderBottom:
                        this.props.history.location.pathname == "/adminPanel/Notification_Management" ? "2px solid #fff" : "",
                    }}
                    className="ml-1"
                  >
                    {this.props.t("Manage Notification")}
                  </span>
                </NavLink>
              </li>
            )}
            {(this.state.rolesAccess.includes("All") || this.state.rolesAccess.includes("Manage FAQ")) && (
              <li>
                <NavLink
                  to="/adminPanel/FAQ_Management"
                  className="waves-effect"
                  style={{
                    fontSize: 16,
                    display: "flex",
                    alignItems: "flex-start",
                    // alignItems: "center",
                  }}
                >
                  <i class="ri-question-answer-fill"></i>
                  <span
                    style={{
                      borderBottom:
                        this.props.history.location.pathname == "/adminPanel/FAQ_Management" ? "2px solid #fff" : "",
                    }}
                    className="ml-1"
                  >
                    {this.props.t("Manage FAQ")}
                  </span>
                </NavLink>
              </li>
            )}

            {/* <li>
              <NavLink
                to="/adminPanel/Azan_Management"
                className="waves-effect"
                style={{
                  fontSize: 16,
                  display: "flex",
                  alignItems: "flex-start",
                  // alignItems: "center",
                }}
              >
                <i class="ri-book-open-line"></i>{" "}
                <span className="ml-1">{this.props.t("Manage Azan")}</span>
              </NavLink>
            </li> */}
            {/* <li>
              <NavLink
                to="/adminPanel/Sects_Management"
                className="waves-effect"
                style={{
                  fontSize: 16,
                  display: "flex",
                  alignItems: "flex-start",
                  // alignItems: "center",
                }}
              >
                <i class="ri-parent-line"></i>{" "}
                <span className="ml-1">{this.props.t("Manage Sects")}</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/adminPanel/Calender_Management"
                className="waves-effect"
                style={{
                  fontSize: 16,
                  display: "flex",
                  alignItems: "flex-start",
                  // alignItems: "center",
                }}
              >
                <i className="ri-calendar-2-line"></i>
                <span
                  className="ml-1"
                  // style={{ fontSize: 18, display: "content" }}
                >
                  {this.props.t("Manage Calendar")}
                </span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/adminPanel/Subscription_Management"
                className="waves-effect"
                style={{
                  fontSize: 16,
                  display: "flex",
                  alignItems: "flex-start",
                  // alignItems: "center",
                }}
              >
                <i className="ri-account-circle-line"></i>
                <span className="ml-1">
                  {this.props.t("Manage Subscription")}
                </span>
              </NavLink>
            </li> */}
            {/* <li>
                  <NavLink
                    to="/adminPanel/Notification_Management"
                    className="waves-effect"
                  >
                    <i className="ri-account-circle-line"></i>
                    <span className="ml-1">
                      {this.props.t("Notification Management")}
                    </span>
                  </NavLink>
                </li> */}
            {(this.state.rolesAccess.includes("All") || this.state.rolesAccess.includes("Manage Settings")) && (
              <li>
                <NavLink to="/adminPanel/Content_Management" className="waves-effect">
                  <i class="ri-settings-5-fill"></i>
                  <span
                    style={{
                      borderBottom:
                        this.props.history.location.pathname == "/adminPanel/Content_Management" ? "2px solid #fff" : "",
                    }}
                    className="ml-1"
                  >
                    {this.props.t("Manage Settings")}
                  </span>
                </NavLink>
              </li>
            )}
            
            


            {/* <li>
                                <NavLink to="#" className="waves-effect">
                                    <i className="ri-account-circle-line"></i>
                                    <span className="ml-1">{this.props.t('Subscription Management')}</span>
                                </NavLink>
                            </li> */}
          </ul>
        </div>
      </React.Fragment>
    );
  }
}

const mapStatetoProps = (state) => {
  return { ...state.Layout };
};

export default withRouter(
  connect(mapStatetoProps, {
    changeLayout,
    changeSidebarTheme,
    changeSidebarType,
    changeLayoutWidth,
    changePreloader,
  })(withNamespaces()(SidebarContent))
);
