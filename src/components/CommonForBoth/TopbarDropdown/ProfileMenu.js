import React, { Component } from "react";
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import Cookies from "js-cookie";
import { withRouter } from "react-router";
//i18n
import { withNamespaces } from "react-i18next";

// users
import avatar2 from "../../../assets/images/users/avatar-2.jpg";

class ProfileMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menu: false,
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState((prevState) => ({
      menu: !prevState.menu,
    }));
  }

  render() {
    let userType = Cookies.get("userType");
    let username = Cookies.get("username");
    let profileImage = Cookies.get("profileImage");
    if (userType === "admin") {
      console.log("usererrr", username);
      username = "Admin";
      // const obj = JSON.parse(localStorage.getItem("authUser"));
      // const uNm = obj.email.split("@")[0];
      // username = uNm.charAt(0).toUpperCase() + uNm.slice(1);
    } else if (userType === "sub_admin") {
      username = Cookies.get("username").replaceAll('"', "");
      console.log("usererrr", username);
    }

    return (
      <React.Fragment>
        <Dropdown isOpen={this.state.menu} toggle={this.toggle} className="d-inline-block user-dropdown">
          <DropdownToggle tag="button" className="btn header-item waves-effect" id="page-header-user-dropdown">
            {userType === "sub_admin" ? (
              <img className="rounded-circle header-profile-user mr-1" src={profileImage} alt="Header Avatar" />
            ) : (
              false
            )}
            <span className="d-none d-xl-inline-block ml-1 text-transform">{username}</span>
            <i className="mdi mdi-chevron-down d-none ml-1 d-xl-inline-block"></i>
          </DropdownToggle>
          <DropdownMenu right>
            {/*<DropdownItem href="#"><i className="ri-user-line align-middle mr-1"></i> {this.props.t('Profile')}</DropdownItem>*/}
            {/* <DropdownItem href="#"><i className="ri-wallet-2-line align-middle mr-1"></i> {this.props.t('My Wallet')}</DropdownItem> */}
            {/*<DropdownItem className="d-block" href="#"><span className="badge badge-success float-right mt-1">11</span><i className="ri-settings-2-line align-middle mr-1"></i> {this.props.t('Settings')}</DropdownItem>
                                <DropdownItem href="#"><i className="ri-lock-unlock-line align-middle mr-1"></i> {this.props.t('Lock screen')}</DropdownItem>*/}
            <DropdownItem href="/adminPanel/CustomChangePassword">
              <i className="ri-lock-unlock-line align-middle mr-1"></i> {this.props.t("Change Password")}
            </DropdownItem>
            <DropdownItem divider />
            <button
              className=" text-danger dropdown-item"
              href="#"
              onClick={() => {
                Cookies.remove("admin_access_token");
                Cookies.remove("access");
                Cookies.remove("userType");
                Cookies.remove("username");
                Cookies.remove("profileImage");

                this.props.history.push("/login");
              }}
            >
              <i className="ri-shut-down-line align-middle mr-1 text-danger"></i> {this.props.t("Logout")}
            </button>
          </DropdownMenu>
        </Dropdown>
      </React.Fragment>
    );
  }
}

export default withRouter(withNamespaces()(ProfileMenu));
