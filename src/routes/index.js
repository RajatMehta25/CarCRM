import React from "react";
import { Redirect } from "react-router-dom";
import Cookies from "js-cookie";

// Authentication related pages
import Login from "../pages/Authentication/Login";
import Logout from "../pages/Authentication/Logout";
import Register from "../pages/Authentication/Register";
import ForgetPwd from "../pages/Authentication/ForgetPassword";
import AuthLockScreen from "../pages/Authentication/AuthLockScreen";

// Dashboard
import Dashboard from "../pages/Dashboard/index";
// import UserManagement from "../pages/UserManagement/UserManagement";
import AccountManagement from "../pages/AccountManagement/Account_Management";
import AccountDetails from "../pages/AccountManagement/Account_Details";
import changePassword from "../pages/Authentication/changePasword";
import AddEditUser from "../pages/UserManagement/AddEditUser";
// import JobManagement from "../pages/JobManagement/JobManagement";

// import Notification_Management from "../pages/Notification_Management/Notification_Management";
// import Content_Management from "../pages/Content_Management/Content_Management";
import CustomChangePassword from "../pages/CustomChangePassword/CustomChangePassword";
// import Subscription_Management from "../pages/Subscription_Management/Subscription_Management";
// import AddEditSubscription from "../pages/Subscription_Management/AddEditSubscription";
// import DriverManagement from "../pages/DriverManagement/DriverManagement";
// import ViewDriver from "../pages/DriverManagement/ViewDriver";
// import TaxiSingleManagement from "../pages/ServiceManagement/TaxiSingleManagement";
// import AddEditTaxiSingle from "../pages/ServiceManagement/AddEditTaxiSingle";
// import FareTaxiSingle from "../pages/ServiceManagement/FareTaxiSingle";
// import PetCategoryManagement from "../pages/ServiceManagement/PetCategoryManagement";
// import AddEditPetCategory from "../pages/ServiceManagement/AddEditPetCategory";
// import FarePet from "../pages/ServiceManagement/FarePet";
// import PackageManagement from "../pages/ServiceManagement/PackageManagement";
// import AddEditPackage from "../pages/ServiceManagement/AddEditPackage";
// import FarePackage from "../pages/ServiceManagement/FarePackage";
// import FareDesignated from "../pages/ServiceManagement/FareDesignated";
// import ManageDesignated from "../pages/ServiceManagement/ManageDesignated";
// import Booking_Management from "../pages/Booking_Management/Booking_Management";
// import PromoCode_Management from "../pages/PromoCode_Management/PromoCode_Management";
// import AddEditPromocode from "../pages/PromoCode_Management/AddEditPromocode";
import SubAdmin_Management from "../pages/SubAdmin_Management/SubAdmin_Management";
import AddEdit_SubAdmin from "../pages/SubAdmin_Management/AddEdit_SubAdmin";
import Tip_Management from "../pages/Tip_Management/Tip_Management";
import AddEdit_Tip from "../pages/Tip_Management/AddEdit_Tip";
// import Payment_Management from "../pages/Payment_Management/Payment_Management";
// import ApprovedDriver from "../pages/DriverManagement/ApprovedDriver";
// import PendingDriver from "../pages/DriverManagement/PendingDriver";
// import DisapprovedDriver from "../pages/DriverManagement/DisapprovedDriver";
// import FAQ_Management from "../pages/FAQ_Management/FAQ_Management";
// import AddEditFAQ from "../pages/FAQ_Management/AddEditFAQ";
import About_us from "../pages/Mutli_pages/About_us";
import Privacy_policy from "../pages/Mutli_pages/Privacy_policy";
import Help_us from "../pages/Mutli_pages/Help_us";
import TermsAndCondition from "../pages/Mutli_pages/TermsAndCondition";
// import FareDesignatedScreen2 from "../pages/ServiceManagement/FareDesignatedScreen2";
// import Redeem from "../pages/DriverManagement/Redeem";
// import BookingDetails from "../pages/Booking_Management/BookingDetails";
// import ViewUser from "../pages/UserManagement/ViewUser";
// import RatingAndReview from "../pages/DriverManagement/RatingAndReview";
// import BannerManagement from "../pages/BannerManagement/BannerManagement";
// import AddEditBanner from "../pages/BannerManagement/AddEditBanner";
import CancellationReason from "../pages/CancellationReason/CancellationReason";
// import Payment_Management from "../pages/Payment_Management/Payment_Management";
import AddEditCancellation from "../pages/CancellationReason/AddEditCancellation";

//lazy imports
const Notification_Management = React.lazy(() => import("../pages/Notification_Management/Notification_Management"));
const BannerManagement = React.lazy(() => import("../pages/BannerManagement/BannerManagement"));
const AddEditBanner = React.lazy(() => import("../pages/BannerManagement/AddEditBanner"));
const Booking_Management = React.lazy(() => import("../pages/Booking_Management/Booking_Management"));
const BookingDetails = React.lazy(() => import("../pages/Booking_Management/BookingDetails"));

const UserManagement = React.lazy(() => import("../pages/UserManagement/UserManagement"));
const ViewUser = React.lazy(() => import("../pages/UserManagement/ViewUser"));
const Content_Management = React.lazy(() => import("../pages/Content_Management/Content_Management"));
const FAQ_Management = React.lazy(() => import("../pages/FAQ_Management/FAQ_Management"));
const AddEditFAQ = React.lazy(() => import("../pages/FAQ_Management/AddEditFAQ"));
const DriverManagement = React.lazy(() => import("../pages/DriverManagement/DriverManagement"));
const ViewDriver = React.lazy(() => import("../pages/DriverManagement/ViewDriver"));
const ApprovedDriver = React.lazy(() => import("../pages/DriverManagement/ApprovedDriver"));
const PendingDriver = React.lazy(() => import("../pages/DriverManagement/PendingDriver"));
const DisapprovedDriver = React.lazy(() => import("../pages/DriverManagement/DisapprovedDriver"));
const RatingAndReview = React.lazy(() => import("../pages/DriverManagement/RatingAndReview"));
const Redeem = React.lazy(() => import("../pages/DriverManagement/Redeem"));

const PromoCode_Management = React.lazy(() => import("../pages/PromoCode_Management/PromoCode_Management"));
const AddEditPromocode = React.lazy(() => "../pages/PromoCode_Management/AddEditPromocode");
const Subscription_Management = React.lazy(() => import("../pages/Subscription_Management/Subscription_Management"));
const AddEditSubscription = React.lazy(() => import("../pages/Subscription_Management/AddEditSubscription"));

const TaxiSingleManagement = React.lazy(() => import("../pages/ServiceManagement/TaxiSingleManagement"));
const AddEditTaxiSingle = React.lazy(() => import("../pages/ServiceManagement/AddEditTaxiSingle"));
const FareTaxiSingle = React.lazy(() => import("../pages/ServiceManagement/FareTaxiSingle"));
const PetCategoryManagement = React.lazy(() => import("../pages/ServiceManagement/PetCategoryManagement"));
const AddEditPetCategory = React.lazy(() => import("../pages/ServiceManagement/AddEditPetCategory"));
const FarePet = React.lazy(() => import("../pages/ServiceManagement/FarePet"));
const PackageManagement = React.lazy(() => import("../pages/ServiceManagement/PackageManagement"));
const AddEditPackage = React.lazy(() => import("../pages/ServiceManagement/AddEditPackage"));
const FarePackage = React.lazy(() => import("../pages/ServiceManagement/FarePackage"));
const FareDesignated = React.lazy(() => import("../pages/ServiceManagement/FareDesignated"));
const ManageDesignated = React.lazy(() => import("../pages/ServiceManagement/ManageDesignated"));
const FareDesignatedScreen2 = React.lazy(() => import("../pages/ServiceManagement/FareDesignatedScreen2"));

const ScheduledRidesManagement = React.lazy(() => import("../pages/ScheduledRidesManagement/ScheduledRidesManagement"));
const MilesManagement = React.lazy(() => import("../pages/MilesManagement/MilesManagement"));
const GiftCardManagement = React.lazy(() => import("../pages/GiftCardManagement/GiftCardManagement"));

// const CancelledRideDetails = React.lazy(() => import("../pages/Booking_Management/CancelledRideDetials"));

const adminToken = Cookies.get("admin_access_token");

const authProtectedRoutes = [
  { path: "/adminPanel/dashboard", component: Dashboard, title: "Dashboard" },

  { path: "/adminPanel/BannerManagement", component: BannerManagement, title: "Manage Banner" },
  { path: "/adminPanel/AddEditBanner", component: AddEditBanner },

  //new routes
  { path: "/adminPanel/user-management", component: UserManagement, title: "Manage User" },
  { path: "/adminPanel/ViewUser", component: ViewUser },

  { path: "/adminPanel/driver-management", component: DriverManagement, title: "Manage Driver" },
  { path: "/adminPanel/driver-view", component: ViewDriver },

  { path: "/adminPanel/TaxiSingleManagement", component: TaxiSingleManagement, title: "Manage Single Taxi" },
  { path: "/adminPanel/AddEditTaxiSingle", component: AddEditTaxiSingle },
  { path: "/adminPanel/FareTaxiSingle", component: FareTaxiSingle },

  { path: "/adminPanel/ManageDesignatedDriver", component: ManageDesignated, title: "Manage Designated Driver" },

  {
    path: "/adminPanel/PetCategoryManagement",
    component: PetCategoryManagement,
    title: "Manage Pet",
  },
  { path: "/adminPanel/FarePet", component: FarePet },
  { path: "/adminPanel/AddEditPetCategory", component: AddEditPetCategory },

  { path: "/adminPanel/PackageManagement", component: PackageManagement, title: "Manage Package" },
  { path: "/adminPanel/AddEditPackage", component: AddEditPackage },
  { path: "/adminPanel/FarePackage", component: FarePackage },
  { path: "/adminPanel/FareDesignated", component: FareDesignated },
  { path: "/adminPanel/FareDesignatedDriver", component: FareDesignatedScreen2 },

  { path: "/adminPanel/Booking_Management", component: Booking_Management, title: "Manage Booking" },
  { path: "/adminPanel/BookingDetails", component: BookingDetails },
  // { path: "/adminPanel/CancelledRideDetails", component: CancelledRideDetails },

  { path: "/adminPanel/PromoCode_Management", component: PromoCode_Management, title: "Manage Promocode" },
  { path: "/adminPanel/AddEditPromocode", component: AddEditPromocode },

  { path: "/adminPanel/SubAdmin_Management", component: SubAdmin_Management, title: "Manage SubAdmin" },
  { path: "/adminPanel/AddEdit_SubAdmin", component: AddEdit_SubAdmin },

  {
    path: "/adminPanel/Notification_Management",
    component: Notification_Management,
    title: "Manage Notification",
  },

  { path: "/adminPanel/account-management", component: AccountManagement },
  { path: "/adminPanel/account-details", component: AccountDetails },
  //   { path: "/adminPanel/changePassword", component: changePassword, title: "changePassword" },
  // { path: "/adminPanel/AddEditUser", component: AddEditUser, title: "AddEditUser" },
  // { path: "/adminPanel/job-management", component: JobManagement, title: "JobManagement" },

  { path: "/adminPanel/CustomChangePassword", component: CustomChangePassword, title: "Change Password" },

  // {
  //   path: "/adminPanel/Notification_Management",
  //   component: Notification_Management,
  // title: "Notification_Management"
  // },
  { path: "/adminPanel/Content_Management", component: Content_Management, title: "Manage Settings" },

  {
    path: "/adminPanel/Subscription_Management",
    component: Subscription_Management,
  },
  {
    path: "/adminPanel/AddEditSubscription",
    component: AddEditSubscription,
    title: "AddEditSubscription",
  },
  { path: "/adminPanel/Tip_Management", component: Tip_Management, title: "Manage Tip" },
  { path: "/adminPanel/AddEdit_Tip", component: AddEdit_Tip },

  // { path: "/adminPanel/Payment_Management", component: Payment_Management, title: "Payment_Management" },

  { path: "/adminPanel/ApprovedDriver", component: ApprovedDriver, title: "Approved Driver" },
  { path: "/adminPanel/PendingDriver", component: PendingDriver, title: "Pending Driver" },
  { path: "/adminPanel/DisapprovedDriver", component: DisapprovedDriver, title: "Disapproved Driver" },
  { path: "/adminPanel/Redeem", component: Redeem, title: "Redeem" },
  { path: "/adminPanel/RatingAndReview", component: RatingAndReview },

  { path: "/adminPanel/FAQ_Management", component: FAQ_Management, title: "Manage FAQ" },
  { path: "/adminPanel/AddEditFAQ", component: AddEditFAQ },

  { path: "/adminPanel/CancellationReason", component: CancellationReason, title: "Manage Cancellation Reason" },
  { path: "/adminPanel/AddEditCancellation", component: AddEditCancellation },

  { path: "/adminPanel/ScheduledRidesManagement", component: ScheduledRidesManagement, title: "Manage Scheduled Rides" },

  { path: "/adminPanel/MilesManagement", component: MilesManagement, title: "Manage Miles" },

  { path: "/adminPanel/GiftCardManagement", component: GiftCardManagement, title: "Manage Gift Card" },

  // { pah: "/adminPanel/Payment_Management", component: Payment_Management, title: "Payment_Management" },

  // { path: "*", component: Dashboard, title: "Dashboard" },

  {
    path: "/",
    exact: true,
    component: () =>
      adminToken && adminToken !== "" ? <Redirect to="/adminPanel/dashboard" /> : <Redirect to="/adminPanel/login" />,
  },
];

const dynamicRoutes = () => {
  const rolesAccess = Cookies.get("access") ? JSON.parse(Cookies.get("access")) : [];
  // alert(rolesAccess)
  // const adminOrSubAdmin = Cookies.get("isSuperAdmin")
  //   ? JSON.parse(Cookies.get("isSuperAdmin"))
  //   : [];
  // console.log(rolesAccess);
  // const adminToken = Cookies.get("admin_access_token");

  let routesToMap = [];
  console.log(rolesAccess);
  if (rolesAccess.includes("All")) {
    // if (JSON.stringify(adminOrSubAdmin) === "true") {
    // 	routesToMap.push(
    // 		{ path: "/adminPanel/AddEdit_SubAdmin", component: AddEdit_SubAdmin },
    // 	)
    // }
    routesToMap.push(...authProtectedRoutes);
  } else {
    if (rolesAccess.includes("Manage Banner")) {
      routesToMap.push(
        { path: "/adminPanel/BannerManagement", component: BannerManagement, title: "Manage Banner" },
        { path: "/adminPanel/AddEditBanner", component: AddEditBanner }
      );
    }
    if (rolesAccess.includes("Manage User")) {
      routesToMap.push(
        {
          path: "/adminPanel/user-management",
          component: UserManagement,
          title: "Manage User",
        },
        { path: "/adminPanel/ViewUser", component: ViewUser },
        { path: "/adminPanel/RatingAndReview", component: RatingAndReview },
        { path: "/adminPanel/BookingDetails", component: BookingDetails }
      );
    }

    if (rolesAccess.includes("Manage Driver")) {
      routesToMap.push(
        {
          path: "/adminPanel/driver-management",
          component: DriverManagement,
          title: "Manage Driver",
        },
        { path: "/adminPanel/ApprovedDriver", component: ApprovedDriver, title: "Approved Driver" },
        { path: "/adminPanel/PendingDriver", component: PendingDriver, title: "Pending Driver" },
        { path: "/adminPanel/DisapprovedDriver", component: DisapprovedDriver, title: "Disapproved Driver" },
        { path: "/adminPanel/driver-view", component: ViewDriver },
        { path: "/adminPanel/Redeem", component: Redeem },
        { path: "/adminPanel/RatingAndReview", component: RatingAndReview },
        { path: "/adminPanel/BookingDetails", component: BookingDetails }
      );
    }
    if (rolesAccess.includes("Manage Service")) {
      routesToMap.push(
        {
          path: "/adminPanel/TaxiSingleManagement",
          component: TaxiSingleManagement,
          title: "Manage Single Taxi",
        },
        { path: "/adminPanel/AddEditTaxiSingle", component: AddEditTaxiSingle },
        { path: "/adminPanel/FareTaxiSingle", component: FareTaxiSingle },

        {
          path: "/adminPanel/ManageDesignatedDriver",
          component: ManageDesignated,
          title: "Manage Designated Driver",
        },

        {
          path: "/adminPanel/PetCategoryManagement",
          component: PetCategoryManagement,
          title: "Manage Pet",
        },
        { path: "/adminPanel/FarePet", component: FarePet },
        {
          path: "/adminPanel/AddEditPetCategory",
          component: AddEditPetCategory,
        },

        { path: "/adminPanel/PackageManagement", component: PackageManagement, title: "Manage Package" },
        { path: "/adminPanel/AddEditPackage", component: AddEditPackage },
        { path: "/adminPanel/FarePackage", component: FarePackage },
        { path: "/adminPanel/FareDesignated", component: FareDesignated }, //check here for path
        { path: "/adminPanel/FareDesignatedDriver", component: FareDesignatedScreen2 }
      );
    }

    if (rolesAccess.includes("Manage Booking")) {
      routesToMap.push(
        {
          path: "/adminPanel/Booking_Management",
          component: Booking_Management,
          title: "Manage Booking",
        },
        { path: "/adminPanel/BookingDetails", component: BookingDetails },
        { path: "/adminPanel/ScheduledRidesManagement", component: ScheduledRidesManagement, title: "Manage Scheduled Rides" },

        // { path: "/adminPanel/CancelledRideDetails", component: CancelledRideDetails },
      );
    }
    if (rolesAccess.includes("Manage Promocode")) {
      routesToMap.push(
        {
          path: "/adminPanel/PromoCode_Management",
          component: PromoCode_Management,
          title: "Manage Promocode",
        },
        { path: "/adminPanel/AddEditPromocode", component: AddEditPromocode }
      );
    }

    if (rolesAccess.includes("Manage SubAdmin")) {
      routesToMap.push(
        {
          path: "/adminPanel/SubAdmin_Management",
          component: SubAdmin_Management,
          title: "Manage SubAdmin",
        },
        { path: "/adminPanel/AddEdit_SubAdmin", component: AddEdit_SubAdmin }
      );
    }
    if (rolesAccess.includes("Manage Notification")) {
      routesToMap.push({
        path: "/adminPanel/Notification_Management",
        component: Notification_Management,
        title: "Manage Notification",
      });
    }

    if (rolesAccess.includes("Manage Tip")) {
      routesToMap.push(
        {
          path: "/adminPanel/Tip_Management",
          component: Tip_Management,
          title: "Manage Tip",
        },
        { path: "/adminPanel/AddEdit_Tip", component: AddEdit_Tip }
      );
    }

    if (rolesAccess.includes("Manage FAQ")) {
      routesToMap.push(
        {
          path: "/adminPanel/FAQ_Management",
          component: FAQ_Management,
          title: "Manage FAQ",
        },
        { path: "/adminPanel/AddEditFAQ", component: AddEditFAQ }
      );
    }
    if (rolesAccess.includes("Manage Settings")) {
      routesToMap.push({ path: "/adminPanel/Content_Management", component: Content_Management, title: "Manage Settings" });
    }
    if (rolesAccess.includes("Manage Cancellation Reason")) {
      routesToMap.push(
        { path: "/adminPanel/CancellationReason", component: CancellationReason, title: "Manage Cancellation Reason" },
        { path: "/adminPanel/AddEditCancellation", component: AddEditCancellation }
      );
    }
    routesToMap.push(
      {
        path: "/adminPanel/dashboard",
        component: Dashboard,
        title: "Dashboard",
      },
      {
        path: "/adminPanel/CustomChangePassword",
        component: CustomChangePassword,
        title: "Change Password",
      }
    );

    routesToMap.push({
      path: "/",
      exact: true,
      component: () =>
        adminToken && adminToken !== "" ? <Redirect to="/adminPanel/dashboard" /> : <Redirect to="/adminPanel/login" />,
    });
  }
  // }
  return routesToMap;
};

const publicRoutes = [
  { path: "/adminPanel/login", component: Login, title: "Login" },
  { path: "/adminPanel/logout", component: Logout, title: "Logout" },
  { path: "/adminPanel/forgot-password", component: ForgetPwd, title: "ForgetPwd" },
  { path: "/adminPanel/register", component: Register, title: "Register" },
  { path: "/adminPanel/auth-lock-screen", component: AuthLockScreen, title: "AuthLockScreen" },
  { path: "/adminPanel/About_us", component: About_us, title: "About_us" },
  { path: "/adminPanel/Help_us", component: Help_us, title: "Help_us" },
  { path: "/adminPanel/Privacy_policy", component: Privacy_policy, title: "Privacy_policy" },
  { path: "/adminPanel/TermsAndCondition", component: TermsAndCondition, title: "TermsAndCondition" },
];

export { authProtectedRoutes, publicRoutes, dynamicRoutes };
