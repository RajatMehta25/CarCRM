import { values } from "lodash";

const messages = {
  invalid: "Field is required.",
  email: "Enter a valid email address.",
  password:
    "It should contain 7 to 15 characters which contain at least one numeric digit and a special character and one uppercase no whitespace.",
  passwordMatch: "Password does not match.",
  invalid: "Given data is invalid.",
};

//global regex
const noHtmlRegex = /<\/?[^>]+(>|$)/g;
const onlyAlphbetRegex = /^[a-zA-Z ]*$/;
const phoneRegex = /^([4-9])(\d{9})$/;

const checkEmail = (value) => {
  if (
    !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      value
    )
  ) {
    return true;
  } else if (value.includes('"') || value.includes("'") || value.includes(",") || value.includes(" ")) {
    return true;
  } else {
    return false;
  }
};
// const emal

export const loginValidator = (values) => {
  let errors = {};
  if (!values.email) {
    errors.email = "Email is required.";
  }
  if (!values.password) {
    errors.password = "Password is required.";
  }
  return errors;
};

export const bannerValidator = (values, bannerImage) => {
  let errors = {};
  if (!bannerImage) {
    alert("Select a Banner Image");
  }

  return errors;
};
export const cuisineValidator = (values, bannerImage) => {
  let errors = {};
  if (!values.title) {
    errors.title = "Please enter title";
  }

  if (!values.image) {
    errors.image = "Please upload cuisine image";
  }

  return errors;
};

export const forgotPasswordValidator = (values) => {
  let errors = {};
  if (!values.email) {
    errors.email = "Email is required.";
  } else if (checkEmail(values.email)) {
    errors.email = "Enter a valid email address.";
  }
  console.log(errors);
  return errors;
};

export const resetValidator = (values) => {
  let errors = {};
  if (!values.password) {
    errors.password = "Password is required.";
  } else if (!/^(?=.*[0-9])(?=.*[!@#$%^&*-])(?=.*[A-Z])(?=.*[a-z])[a-zA-Z0-9!@#$%^&*-]{7,15}$/.test(values.password)) {
    errors.password =
      "It should contain 7 to 15 characters which contain at least one numeric digit and a special character and one uppercase no whitespace.";
  }

  if (!values.confirm_password) {
    errors.confirm_password = "Confirm Password is required.";
  } else if (values.password !== values.confirm_password) {
    errors.confirm_password = "Password does not Match.";
  }
  return errors;
};

export const changePasswordValidator = (values) => {
  let errors = {};
  if (!values.current_password) {
    errors.current_password = "Current Password is required.";
  }
  if (!values.password) {
    errors.password = "New Password is required.";
  } else if (!/^(?=.*[0-9])(?=.*[!@#$%^&*-])(?=.*[A-Z])(?=.*[a-z])[a-zA-Z0-9!@#$%^&*-]{7,15}$/.test(values.password)) {
    errors.password =
      "It should contain 7 to 15 characters which contain at least one numeric digit and a special character and one uppercase no whitespace.";
  }

  if (!values.confirm_password) {
    errors.confirm_password = "Confirm password is required.";
  } else if (values.password !== values.confirm_password) {
    errors.confirm_password = "Password does not Match.";
  }
  return errors;
};

export const employeeValidator = (values) => {
  let errors = {};

  if (!values.name) {
    errors.name = "Employee name is required.";
  } else if (noHtmlRegex.test(values.name)) {
    errors.name = messages.invalid;
  }
  let emailval = String(values.email).toLowerCase();
  if (!values.email) {
    errors.email = "Employee email is required.";
  } else if (noHtmlRegex.test(values.email)) {
    errors.email = messages.invalid;
  } else if (checkEmail(values.email)) {
    errors.email = messages.invalid;
  } else if (!/(.*)@singleinterface\.com/.test(emailval)) {
    errors.email = "Only singleinterface email id need to be enter.";
  }

  if (!values.phone) {
    errors.phone = "Employee phone number is required.";
  } else if (noHtmlRegex.test(values.phone)) {
    errors.phone = messages.invalid;
  } else if (!phoneRegex.test(values.phone)) {
    errors.phone = "Phone no is Invalid.";
  }

  if (!values.department) {
    errors.department = "Employee department is required.";
  }

  return errors;
};

export const orderValidator = (values, activeStep) => {
  let errors = {};

  //step 1
  if (activeStep === 1) {
    if (!values.business_name) {
      errors.business_name = "Business name is required.";
    } else if (noHtmlRegex.test(values.business_name)) {
      errors.business_name = messages.invalid;
    }

    if (!values.contact_person_name) {
      errors.contact_person_name = "Contact person name is required.";
    } else if (noHtmlRegex.test(values.contact_person_name)) {
      errors.contact_person_name = messages.invalid;
    }
    if (!values.company_email) {
      errors.company_email = "Company email is required.";
    } else if (checkEmail(values.company_email)) {
      errors.company_email = "Company Email is not valid.";
    } else if (noHtmlRegex.test(values.company_email)) {
      errors.company_email = messages.invalid;
    }

    if (!values.website) {
      errors.website = "Website name is required.";
    } else if (
      /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/.test(
        values.website
      ) !== true
    ) {
      errors.website = "Invalid website name.";
    }

    if (!values.phone) {
      errors.phone = "Phone number is required.";
    } else if (noHtmlRegex.test(values.phone)) {
      errors.phone = messages.invalid;
    } else if (!/^([4-9])(\d{9})$/.test(values.phone)) {
      errors.phone = "Phone no is Invalid.";
    }
  }
  //step 2
  if (activeStep === 2) {
    if (!values.pincode) {
      errors.pincode = "Pincode is required.";
    } else if (noHtmlRegex.test(values.pincode)) {
      errors.pincode = messages.invalid;
    }
    if (!values.address) {
      errors.address = "Address is required.";
    } else if (noHtmlRegex.test(values.address)) {
      errors.address = messages.invalid;
    }
  }

  if (activeStep === 3) {
    if (values["employee_id"] == undefined || values.employee_id.length === 0) {
      errors.employee_id = "Please select an employee.";
    } else if (values.employee_id.length > 10) {
      errors.employee_id = "You may select max 10 person only.";
    }
  }
  if (activeStep === 4) {
    if (!values.locations) {
      errors.locations = "Locations are required.";
    } else if (/^[0-9]*$/g.test(values.locations) !== true) {
      errors.locations = messages.invalid;
    } else if (values.locations < 1) {
      errors.locations = messages.invalid;
    } else if (values.locations > 100000) {
      errors.locations = "Please enter location less than 100000";
    }

    if (!values.order_code) {
      errors.order_code = "Order Code required.";
    } else if (!/^.{5,6}$/.test(values.order_code)) {
      errors.order_code = "Minimum 5 character or max 6 character required.";
    } else if (noHtmlRegex.test(values.order_code)) {
      errors.order_code = messages.invalid;
    }

    if (!values.subscription_start_date) {
      errors.subscription_start_date = "Please Select Date Properly.";
    }
    if (!values.subscription_end_date) {
      errors.subscription_start_date = "Please Select Date Properly.";
    }

    if (values.subscription_end_date < values.subscription_start_date) {
      errors.subscription_start_date = "Start date can’t be greater than end date.";
    }
    if (values.gmb_multi_acc_allowed) {
      if (!values.gmb_email_address) {
        errors.gmb_email_address = "GMB email is required.";
      } else if (checkEmail(values.gmb_email_address)) {
        errors.gmb_email_address = "GMB Email is not valid.";
      } else if (noHtmlRegex.test(values.gmb_email_address)) {
        errors.gmb_email_address = messages.invalid;
      }
    }
  }

  return errors;
};

export const permissionValidator = (values) => {
  let errors = {};
  if (!values.name) {
    errors.name = "Name is required.";
  } else if (noHtmlRegex.test(values.name)) {
    errors.name = messages.invalid;
  }
  if (!values.menu_id) {
    errors.menu_id = "Menu is required.";
  } else if (noHtmlRegex.test(values.menu_id)) {
    errors.menu_id = messages.invalid;
  }
  if (!values.action) {
    errors.action = "Action is required.";
  } else if (noHtmlRegex.test(values.action)) {
    errors.action = messages.invalid;
  }
  if (noHtmlRegex.test(values.prefix)) {
    errors.prefix = messages.invalid;
  }
  if (noHtmlRegex.test(values.plugin)) {
    errors.plugin = messages.invalid;
  }
  if (noHtmlRegex.test(values.description)) {
    errors.description = messages.invalid;
  }

  return errors;
};

export const menuValidator = (values) => {
  let errors = {};
  if (!values.name) {
    errors.name = "Name is required.";
  } else if (noHtmlRegex.test(values.name)) {
    errors.name = messages.invalid;
  }
  if (!values.controller) {
    errors.controller = "Controller is required.";
  } else if (noHtmlRegex.test(values.name)) {
    errors.controller = messages.invalid;
  }

  if (noHtmlRegex.test(values.span)) {
    errors.span = messages.invalid;
  }
  if (noHtmlRegex.test(values.inline_style)) {
    errors.inline_style = messages.invalid;
  }
  if (noHtmlRegex.test(values.description)) {
    errors.description = messages.invalid;
  }

  return errors;
};

export const countryValidator = (values) => {
  let errors = {};
  if (!values.name) {
    errors.name = "Name is required.";
  } else if (values.name.length > 30) {
    errors.name = messages.invalid;
  } else if (values.name.includes("  ")) {
    errors.name = "Please remove extra whitespace.";
  } else if (!onlyAlphbetRegex.test(values.name)) {
    errors.name = messages.invalid;
  }

  if (!onlyAlphbetRegex.test(values.alias)) {
    errors.alias = messages.invalid;
  }

  return errors;
};

export const cityValidator = (values) => {
  let errors = {};
  if (!values.name) {
    errors.name = "Name is required.";
  } else if (values.name.length > 30) {
    errors.name = messages.invalid;
  } else if (!onlyAlphbetRegex.test(values.name)) {
    errors.name = messages.invalid;
  }
  if (!values.state_id) {
    errors.state_id = "State is required.";
  } else if (noHtmlRegex.test(values.state_id)) {
    errors.state_id = messages.invalid;
  }

  if (!values.country_id) {
    errors.country_id = "Country is required.";
  } else if (noHtmlRegex.test(values.country_id)) {
    errors.country_id = messages.invalid;
  }

  return errors;
};

export const stateValidator = (values) => {
  let errors = {};
  if (!values.name) {
    errors.name = "Name is required.";
  } else if (values.name.length > 30) {
    errors.name = messages.invalid;
  } else if (!onlyAlphbetRegex.test(values.name)) {
    errors.name = messages.invalid;
  }

  if (values.state_code.length > 30) {
    errors.state_code = messages.invalid;
  } else if (noHtmlRegex.test(values.state_code)) {
    errors.state_code = messages.invalid;
  }

  if (!values.country_id) {
    errors.country_id = "Country is required.";
  } else if (noHtmlRegex.test(values.country_id)) {
    errors.country_id = messages.invalid;
  }

  return errors;
};
export const localityValidtor = (values) => {
  let errors = {};
  if (!values.name) {
    errors.name = "Name is required.";
  } else if (noHtmlRegex.test(values.name)) {
    errors.name = messages.invalid;
  }

  if (!values.pin_code) {
    errors.pin_code = "Pincode is required.";
  } else if (!/^[1-9][0-9]{5}$/.test(values.pin_code)) {
    errors.pin_code = "Invalid Pincode";
  } else if (noHtmlRegex.test(values.pin_code)) {
    errors.pin_code = messages.invalid;
  }
  if (!values.city_id) {
    errors.city_id = "City is required.";
  } else if (noHtmlRegex.test(values.city_id)) {
    errors.city_id = messages.invalid;
  }
  if (!values.state_id) {
    errors.state_id = "State is required.";
  } else if (noHtmlRegex.test(values.state_id)) {
    errors.state_id = messages.invalid;
  }

  if (!values.country_id) {
    errors.country_id = "Country is required.";
  } else if (noHtmlRegex.test(values.country_id)) {
    errors.country_id = messages.invalid;
  }

  return errors;
};

export const campaignValidator = (values) => {
  let errors = {};
  if (!values.campaign_name) {
    errors.campaign_name = "Campaign name is required.";
  } else if (values.campaign_name.includes("  ")) {
    errors.campaign_name = "Please remove extra whitespace.";
  } else if (noHtmlRegex.test(values.campaign_name)) {
    errors.campaign_name = messages.invalid;
  }

  if (values.template_id !== null ? values.template_id.length === 0 : true) {
    errors.template_id = "Template is required.";
  }
  if (values.campaign_type !== null ? values.campaign_type.length === 0 : true) {
    errors.campaign_type = "Campaign Type is required.";
  }

  if (values.location_id !== null ? values.location_id.length === 0 : true) {
    errors.location_id = "Location is required.";
  }

  if (!values.start_date) {
    errors.start_date = "Please Select Date Properly.";
  }
  if (!values.end_date) {
    errors.end_date = "Please Select Date Properly.";
  }

  if (values.end_date < values.end_date) {
    errors.start_date = "Start date can’t be greater than end date.";
  }

  return errors;
};

export const roleValidator = (values, data) => {
  let errors = {};

  // if (data.length === 0) {
  //   errors.permission = true;
  // }
  if (!values.name) {
    errors.name = "Name is required.";
  } else if (values.name.length > 100) {
    errors.name = "Name should not be greater than 100.";
  } else if (noHtmlRegex.test(values.name)) {
    errors.name = messages.invalid;
  }

  return errors;
};

export const userValidator = (values, superAdminSelected, roleDefaultVal) => {
  let errors = {};
  if (!values.name) {
    errors.name = "Name is required.";
  } else if (noHtmlRegex.test(values.name)) {
    errors.name = messages.invalid;
  }
  if (noHtmlRegex.test(values.nick_name)) {
    errors.nick_name = messages.invalid;
  }
  if (noHtmlRegex.test(values.department)) {
    errors.department = messages.invalid;
  }

  if (noHtmlRegex.test(values.department)) {
    errors.job_title = messages.invalid;
  }

  if (!values.phone) {
    errors.phone = "Phone no is required.";
  } else if (!phoneRegex.test(values.phone) && values.phone) {
    errors.phone = "Phone no is Invalid.";
  }

  if (!values.email) {
    errors.email = "Email is required.";
  } else if (checkEmail(values.email)) {
    errors.email = "Email is not valid.";
  } else if (noHtmlRegex.test(values.company_email)) {
    errors.email = messages.invalid;
  }

  if (!roleDefaultVal) {
    errors.role = "Role is required.";
  }
  if (!superAdminSelected) {
    if (values.location_id !== null ? values.location_id.length === 0 : true) {
      errors.location_id = "Location is required.";
    } else if (noHtmlRegex.test(values.location_id)) {
      errors.location_id = messages.invalid;
    }
  }

  return errors;
};

export const contactValidator = (values) => {
  let errors = {};
  if (!values.name) {
    errors.name = "Please enter contact name.";
  } else if (values.name.includes("  ")) {
    errors.name = messages.invalid;
  } else if (noHtmlRegex.test(values.name)) {
    errors.name = messages.invalid;
  }

  if (!values.email) {
    if (!values.phone) {
      errors.email = "Email is required.";
    }
  } else if (checkEmail(values.email)) {
    errors.email = "Email is not valid.";
  } else if (noHtmlRegex.test(values.company_email)) {
    errors.email = messages.invalid;
  }

  if (!values.phone) {
    if (!values.email) {
      errors.phone = "Please enter contact phone number.";
    }
  } else if (noHtmlRegex.test(values.phone) && values.phone) {
    errors.phone = messages.invalid;
  } else if (!/^([4-9])(\d{9})$/.test(values.phone) && values.phone) {
    errors.phone = "Enter a valid phone no.";
  }

  if (values.location_id === null) {
    errors.location_id = "Please select contact location.";
  }

  if (values.group !== null ? values.group.length === 0 : true) {
    if (values.campaign_id === null) {
      errors.campaign_id = "Please select a camgpaign if you are not selecting a group.";
    }
  }
  if (values.campaign_id === null) {
    if (values.group !== null ? values.group.length === 0 : true) {
      errors.group = "Please select at-least one group if you are not selecting a campaign.";
    }
  }

  return errors;
};

export const qrContactValidator = (values) => {
  let errors = {};
  if (!values.name) {
    errors.name = "Please enter contact name.";
  } else if (values.name.includes("  ")) {
    errors.name = messages.invalid;
  } else if (noHtmlRegex.test(values.name)) {
    errors.name = messages.invalid;
  }

  if (!values.email) {
    errors.email = "Email is required.";
  } else if (checkEmail(values.email)) {
    errors.email = "Email is not valid.";
  } else if (noHtmlRegex.test(values.company_email)) {
    errors.email = messages.invalid;
  }

  if (!values.phone) {
    errors.phone = "Please enter contact phone number.";
  } else if (noHtmlRegex.test(values.phone) && values.phone) {
    errors.phone = messages.invalid;
  } else if (!/^([4-9])(\d{9})$/.test(values.phone) && values.phone) {
    errors.phone = "Enter a valid phone no.";
  }

  return errors;
};

export const assignCampaignvalidator = (values) => {
  let errors = {};
  console.log(values.location_id);
  if (values.location_id === null) {
    errors.location_id = "Please select  location.";
  }
  if (values.campaign.length === 0) {
    errors.campaign = "Please select at least one campaign to assign.";
  }
  if (values.location_id !== null) {
    if (values.group.length === 0) {
      errors.group = "Please select at least one group.";
    }
  }
  console.log(errors);

  return errors;
};

export const editValidator = (values) => {
  let errors = {};
  if (!values.name) {
    errors.name = "Please enter contact name.";
  } else if (values.name.includes("  ")) {
    errors.name = messages.invalid;
  } else if (noHtmlRegex.test(values.name)) {
    errors.name = messages.invalid;
  }

  if (!values.email) {
    if (!values.phone) {
      errors.email = "Email is required.";
    }
  } else if (checkEmail(values.email)) {
    errors.email = "Email is not valid";
  } else if (noHtmlRegex.test(values.company_email)) {
    errors.email = messages.invalid;
  }

  if (!values.phone) {
    if (!values.email) {
      errors.phone = "Please enter contact phone number.";
    }
  } else if (noHtmlRegex.test(values.phone) && values.phone) {
    errors.phone = messages.invalid;
  } else if (!/^([4-9])(\d{9})$/.test(values.phone) && values.phone) {
    errors.phone = "Phone no is Invalid.";
  }

  return errors;
};

export const bulkContactValidator = (values, groupVal) => {
  let errors = {};
  var extension = "";
  if (values.file) {
    extension = values.file.name.slice(values.file.name.lastIndexOf("."), values.file.name.length);
  }
  if (!values.file) {
    errors.file = "Please select a file.";
  } else if (extension !== ".xls" && extension !== ".csv" && extension !== ".xlsx") {
    errors.file = "Given file format is invalid.";
  }
  return errors;
};

export const bulkUserValidator = (values) => {
  let errors = {};
  let extension = "";
  if (values.file) {
    extension = values.file.name.slice(values.file.name.lastIndexOf("."), values.file.name.length);
  }

  if (!values.file) {
    errors.file = "Please select a file.";
  } else if (extension !== ".xls" && extension !== ".csv" && extension !== ".xlsx") {
    errors.file = "Given file format is invalid.";
  }

  return errors;
};

export const responseValitor = (values) => {
  let errors = {};
  if (!values.name) {
    errors.name = "Response title is required.";
  }
  if (!values.description) {
    errors.description = "Description is required.";
  }
  if (!values.content) {
    errors.content = "Content is required.";
  }
  return errors;
};

export const assignGroupValidator = (values) => {
  let errors = {};
  if (values.group === null) {
    errors.group = "Please select at-least one group.";
  }

  if (values.group !== null) {
    if (values.group.length === 0) {
      errors.group = "Please select at-least one group.";
    } else if (noHtmlRegex.test(values.group)) {
      errors.group = messages.invalid;
    }
  }

  return errors;
};

export const groupValidator = (values) => {
  let errors = {};
  if (!values.name) {
    errors.name = "Group Name is required.";
  } else if (values.name.length > 100) {
    errors.name = "Group Name should not be greater than 100.";
  } else if (noHtmlRegex.test(values.name)) {
    errors.name = messages.invalid;
  } else if (values.name.includes("  ")) {
    errors.name = "Please remove extra whitespace.";
  }

  if (!values.location_id) {
    errors.location_id = "Select location.";
  } else if (noHtmlRegex.test(values.location_id)) {
    errors.location_id = messages.invalid;
  }

  return errors;
};

export const templateValidator = (values, tmpUrl, pdUrl) => {
  let errors = {};
  if (!values.template_title) {
    errors.template_title = "Template Name is required.";
  } else if (values.template_title.includes("  ")) {
    errors.template_title = "Please remove extra whitespace.";
  } else if (values.template_title.length > 200) {
    errors.template_title = "Template title should not be greater than 200";
  } else if (noHtmlRegex.test(values.template_title)) {
    errors.template_title = messages.invalid;
  }

  if (!values.sms && !values.email) {
    errors.channel_type = "Please Select atleat one channel type.";
  }

  return errors;
};

export const emailValidtor = (values, tmpUrl) => {
  let errors = {};

  if (!values.email_from_name) {
    errors.email_from_name = "From name  is  required.";
  } else if (values.email_from_name.includes("  ")) {
    errors.email_from_name = messages.invalid;
  } else if (noHtmlRegex.test(values.from)) {
    errors.email_from_name = messages.invalid;
  }

  if (!values.email_from_email) {
    errors.email_from_email = "From email  is  required.";
  } else if (values.email_from_email.includes("  ")) {
    errors.email_from_email = messages.invalid;
  } else if (checkEmail(values.email_from_email)) {
    errors.email_from_email = "Enter a valid email address.";
  }
  if (!values.brand_logo && tmpUrl === null) {
    errors.brand_logo = "Logo image is required.";
  }

  if (values.brand_logo !== null ? values.brand_logo.size >= 2000000 : false) {
    errors.brand_logo = "The brand logo may not be greater than 2048 kilobytes.";
  }
  if (values.body.replace(/<(.|\n)*?>/g, "").trim().length === 0) {
    errors.body = "Body content is required.";
  }

  if (!values.subject) {
    errors.subject = "Subject is required.";
  } else if (values.subject.includes("  ")) {
    errors.subject = "Please remove extra whitespace.";
  } else if (values.subject.length > 200) {
    errors.subject = "Email Subject  should not be greater than 200";
  } else if (noHtmlRegex.test(values.subject)) {
    errors.subject = messages.invalid;
  }

  if (!values.headline) {
    errors.headline = "Headline is required.";
  } else if (values.headline.includes("  ")) {
    errors.headline = "Please remove extra whitespace.";
  } else if (values.headline.length > 200) {
    errors.headline = "Headline  should not be greater than 200";
  } else if (noHtmlRegex.test(values.headline)) {
    errors.headline = messages.invalid;
  }

  if (!values.button_title) {
    errors.button_title = "Button Title is required.";
  } else if (values.button_title.includes("  ")) {
    errors.button_title = "Please remove extra whitespace.";
  } else if (values.button_title.length > 50) {
    errors.button_title = "Button Title  should not be greater than 25";
  } else if (noHtmlRegex.test(values.button_title)) {
    errors.button_title = messages.invalid;
  }

  return errors;
};

export const smsValidator = (values) => {
  let errors = {};
  // if (!values.sms_title) {
  //   errors.sms_title = "SMS title is  required.";
  // } else if (values.sms_title.includes("  ")) {
  //   errors.sms_title = messages.invalid;
  // } else if (noHtmlRegex.test(values.sms_title)) {
  //   errors.sms_title = messages.invalid;
  // }

  if (!values.content) {
    errors.content = "Text Message is required.";
  } else if (noHtmlRegex.test(values.content)) {
    errors.content = messages.invalid;
  } else if (values.content.length > 200) {
    errors.content = "Text Message may not be greater than 200 characters.";
  }

  return errors;
};

export const quickValidator = (values) => {
  let errors = {};
  if (!values.email) {
    errors.email = "Email is required.";
  } else if (checkEmail(values.email)) {
    errors.email = "Email is not valid.";
  } else if (noHtmlRegex.test(values.email)) {
    errors.email = messages.invalid;
  }

  if (!values.phone) {
    errors.phone = "Phone number is required.";
  } else if (noHtmlRegex.test(values.phone)) {
    errors.phone = messages.invalid;
  } else if (!/^([4-9])(\d{9})$/.test(values.phone)) {
    errors.phone = "Phone no is Invalid.";
  }

  return errors;
};

export const quickSendValidator = (values) => {
  let errors = {};
  if (!values.name) {
    errors.name = "Name is required.";
  } else if (noHtmlRegex.test(values.email)) {
    errors.name = messages.invalid;
  }

  if (!values.email) {
    errors.email = "Email is required.";
  } else if (checkEmail(values.email)) {
    errors.email = "Email is not valid.";
  } else if (noHtmlRegex.test(values.email)) {
    errors.email = messages.invalid;
  }

  if (!values.phone) {
    errors.phone = "Phone number is required.";
  } else if (noHtmlRegex.test(values.phone)) {
    errors.phone = messages.invalid;
  } else if (!phoneRegex.test(values.phone)) {
    errors.phone = "Phone no is Invalid.";
  }

  if (values.outlet_id === null) {
    errors.outlet_id = "Please select  location.";
  }
  if (values.template_id !== null) {
    errors.template = "Template is required.";
  }

  return errors;
};

export const QrValidtor = (values, tmpUrl) => {
  let errors = {};
  if (!values.business_name) {
    errors.business_name = "Business name is required.";
  } else if (noHtmlRegex.test(values.business_name)) {
    errors.business_name = messages.invalid;
  }

  if (!values.brand_logo && tmpUrl === null) {
    errors.brand_logo = "Logo image is required.";
  }

  if (values.brand_logo !== null ? values.brand_logo.size >= 2000000 : false) {
    errors.brand_logo = "The brand logo may not be greater than 2048 kilobytes.";
  }

  if (values.outlet_id === null) {
    errors.outlet_id = "Please select  location.";
  }
  if (values.template_id !== null ? values.template_id.length === 0 : true) {
    errors.template_id = "Template is required.";
  }

  return errors;
};
export const goalValidator = (values, tmpUrl) => {
  let errors = {};
  if (!values.type) {
    errors.type = "Goal type is required.";
  }

  if (!values.count) {
    errors.count = "Count  is required.";
  }

  return errors;
};

export const CustomerExperianceValidator = (values, tmpUrl) => {
  let errors = {};
  if (!values.cust_heading) {
    errors.cust_heading = "Review title required.";
  } else if (values.cust_heading.length > 200) {
    errors.cust_heading = "The customer heading may not be greater than 200 characters.";
  } else if (noHtmlRegex.test(values.cust_heading)) {
    errors.cust_heading = messages.invalid;
  }

  if (!values.brand_logo && tmpUrl === null) {
    errors.brand_logo = "Logo image is required.";
  }

  if (values.brand_logo !== null ? values.brand_logo.size >= 2000000 : false) {
    errors.brand_logo = "The brand logo may not be greater than 2048 kilobytes.";
  }

  return errors;
};

export const setRuleValidator = (values, completeRule) => {
  let errors = {};
  // if (!values.rule_title) {
  //   errors.rule_title = "Rule Title is  required.";
  // }
  if (values.rule_title.includes("  ")) {
    errors.rule_title = messages.invalid;
  } else if (noHtmlRegex.test(values.rule_title)) {
    errors.rule_title = messages.invalid;
  }

  if (!values.starify_review_message) {
    errors.starify_review_message = "Starify review message is required.";
  } else if (noHtmlRegex.test(values.starify_review_message)) {
    errors.starify_review_message = messages.invalid;
  }

  if (!values.button_title) {
    errors.button_title = "Button Title is required.";
  } else if (values.button_title.length > 100) {
    errors.button_title = "Customer button title should not be greater than 100.";
  } else if (noHtmlRegex.test(values.button_title)) {
    errors.button_title = messages.invalid;
  }
  // if(!completeRule.some(item=> item===1)){
  //   errors.star1 = true;
  // }

  return errors;
};

export const ruleValidator = (fieldName, value, preErrors) => {
  let errors = { ...preErrors };

  // if (ruleType === "tags") {
  //   if (!values.question) {
  //     errors.question = "Question is required.";
  //     document.querySelector("." + RuleClass + " .tagQuestion").focus();
  //   } else if (noHtmlRegex.test(values.question)) {
  //     document.querySelector("." + RuleClass + " .tagQuestion").focus();
  //     errors.question = messages.invalid;
  //   }
  //   if (tags.length === 0) {
  //     errors.tagsInput = "Tags are required.";
  //     document.querySelector("." + RuleClass + " .tagsInput").focus();
  //   }
  // }
  // if (ruleType === "question") {
  //   if (questions.length === 0) {
  //     errors.questionInput = "Questions are required.";
  //     document.querySelector("." + RuleClass + " .questionInput").focus();
  //   }
  // }

  // if (!values.thanks_message) {
  //   errors.thanks_message = "Thanks Message is required.";
  //   document.querySelector("." + RuleClass + " .thanks_message").focus();
  // } else if (noHtmlRegex.test(values.thanks_message)) {
  //   document.querySelector("." + RuleClass + " .thanks_message").focus();
  //   errors.thanks_message = messages.invalid;
  // }

  // if (values.additional_message) {
  //   if (values.additional_message.includes("  ")) {
  //     errors.additional_message = messages.invalid;
  //     document.querySelector("." + RuleClass + " .additional_message").focus();
  //   } else if (noHtmlRegex.test(values.additional_message)) {
  //     errors.additional_message = messages.invalid;
  //     document.querySelector("." + RuleClass + " .additional_message").focus();
  //   } else if (values.additional_message.length > 200) {
  //     errors.additional_message =
  //       "Additional message title  should not be greater than 200";
  //     document.querySelector("." + RuleClass + " .additional_message").focus();
  //   }
  // }

  if (fieldName === "additional_message") {
    if (!value) {
      errors[fieldName] = "Thanks message is required.";
      //document.querySelector("." + RuleClass + " .rule_message").focus();
    } else if (value.includes("  ")) {
      errors[fieldName] = messages.invalid;
      //document.querySelector("." + RuleClass + " .rule_message").focus();
    } else if (noHtmlRegex.test(value)) {
      errors[fieldName] = messages.invalid;
      // document.querySelector("." + RuleClass + " .rule_message").focus();
    } else if (value.length > 200) {
      errors[fieldName] = "Thanks message  should not be greater than 200";
      // document.querySelector("." + RuleClass + " .rule_message").focus();
    } else {
      errors[fieldName] = null;
    }
  }
  if (fieldName === "rule_message") {
    if (!value) {
      errors[fieldName] = "Review page title is required.";
      //document.querySelector("." + RuleClass + " .rule_message").focus();
    } else if (value.includes("  ")) {
      errors[fieldName] = messages.invalid;
      //document.querySelector("." + RuleClass + " .rule_message").focus();
    } else if (noHtmlRegex.test(value)) {
      errors[fieldName] = messages.invalid;
      // document.querySelector("." + RuleClass + " .rule_message").focus();
    } else if (value.length > 200) {
      errors[fieldName] = "Review page title  should not be greater than 200";
      // document.querySelector("." + RuleClass + " .rule_message").focus();
    } else {
      errors[fieldName] = null;
    }
  }

  if (fieldName === "thanks_message") {
    if (!value) {
      errors[fieldName] = "Thanks message  is required.";
      //document.querySelector("." + RuleClass + " .rule_message").focus();
    } else if (value.includes("  ")) {
      errors[fieldName] = messages.invalid;
      //document.querySelector("." + RuleClass + " .rule_message").focus();
    } else if (noHtmlRegex.test(value)) {
      errors[fieldName] = messages.invalid;
      // document.querySelector("." + RuleClass + " .rule_message").focus();
    } else if (value.length > 200) {
      errors[fieldName] = "Thanks message  should not be greater than 200";
      // document.querySelector("." + RuleClass + " .rule_message").focus();
    } else {
      errors[fieldName] = null;
    }
  }

  if (fieldName === "question") {
    if (value ? value.length === 0 : true) {
      errors[fieldName] = "Question is required.";
      //document.querySelector("." + RuleClass + " .rule_message").focus();
    } else {
      errors[fieldName] = null;
    }
  }

  return errors;
};

export const validateRules = (ruleData, RuleClass) => {
  let errors = {};

  if (ruleData.rule_type === "tags") {
    if (ruleData.question ? ruleData.question.length === 0 : true) {
      errors.question = "Question is required.";
      if (RuleClass) {
        document.querySelector("." + RuleClass + " .tagQuestion").focus();
      }
    }
    if (ruleData.tags ? ruleData.tags.length === 0 : true) {
      errors.tagsInput = "Tags are required.";
      if (RuleClass) {
        document.querySelector("." + RuleClass + " .tagsInput").focus();
      }
    }
  }

  if (ruleData.rule_type === "question") {
    if (ruleData.question ? ruleData.question.length === 0 : true) {
      errors.questionInput = "Questions are required.";
      if (RuleClass) {
        document.querySelector("." + RuleClass + " .questionInput").focus();
      }
    }
  }

  if (!ruleData.thanks_message) {
    errors.thanks_message = "Thanks Message is required.";
    if (RuleClass) {
      document.querySelector("." + RuleClass + " .thanks_message").focus();
    }
  } else if (noHtmlRegex.test(ruleData.thanks_message)) {
    if (RuleClass) {
      document.querySelector("." + RuleClass + " .thanks_message").focus();
    }
    errors.thanks_message = messages.invalid;
  }

  // if (ruleData.additional_message) {
  //   if (ruleData.additional_message.includes("  ")) {
  //     errors.additional_message = messages.invalid;
  //     if (RuleClass) {
  //       document
  //         .querySelector("." + RuleClass + " .additional_message")
  //         .focus();
  //     }
  //   } else if (noHtmlRegex.test(ruleData.additional_message)) {
  //     errors.additional_message = messages.invalid;
  //     if (RuleClass) {
  //       document
  //         .querySelector("." + RuleClass + " .additional_message")
  //         .focus();
  //     }
  //   } else if (ruleData.additional_message.length > 200) {
  //     errors.additional_message =
  //       "Additional message title  should not be greater than 200";
  //     if (RuleClass) {
  //       document
  //         .querySelector("." + RuleClass + " .additional_message")
  //         .focus();
  //     }
  //   }
  // }

  // if (!ruleData.rule_message) {
  //   errors.rule_message = "Review page title is required.";
  //   if (RuleClass) {
  //     document.querySelector("." + RuleClass + " .rule_message").focus();
  //   }
  // } else if (ruleData.rule_message) {
  //   if (ruleData.rule_message.includes("  ")) {
  //     errors.rule_message = messages.invalid;
  //     if (RuleClass) {
  //       document.querySelector("." + RuleClass + " .rule_message").focus();
  //     }
  //   } else if (noHtmlRegex.test(ruleData.additional_message)) {
  //     errors.rule_message = messages.invalid;
  //     if (RuleClass) {
  //       document.querySelector("." + RuleClass + " .rule_message").focus();
  //     }
  //   } else if (ruleData.additional_message.length > 200) {
  //     errors.rule_message = "Review page title  should not be greater than 200";
  //     if (RuleClass) {
  //       document.querySelector("." + RuleClass + " .rule_message").focus();
  //     }
  //   }
  //}

  return errors;
};

export const cloneTemplateValidator = (values) => {
  let errors = {};
  if (!values.template_title) {
    errors.template_title = "Template Title is  required.";
  } else if (noHtmlRegex.test(values.template_title)) {
    errors.template_title = messages.invalid;
  }

  return errors;
};

export const reviewValidator = (values, ruleValue, noEmail) => {
  let errors = {};
  console.log(values);
  if (ruleValue.tell_us_more) {
    if (!values.tell_us_more) {
      errors.tell_us_more = "Field is required.";
    } else if (values.tell_us_more.includes("  ")) {
      errors.tell_us_more = messages.invalid;
    } else if (noHtmlRegex.test(values.tell_us_more)) {
      errors.tell_us_more = messages.invalid;
    }
  }
  if (ruleValue.rule_type === "tags") {
    if (values.question.length === 0) {
      errors.tags = "please select atleast one tag.";
    }
  }
  if (ruleValue.rule_type === "question") {
    for (let i = 0; i < ruleValue.question.length; i++) {
      if (!values["question" + i]) {
        errors["question" + i] = "This Field required.";
      } else if (values["question" + i].includes("  ")) {
        errors["question" + i] = "Please remove extra whitespace.";
      }
    }
  }

  return errors;
};

export const replyValidator = (values) => {
  console.log(values);
  let errors = {};
  if (!values.reply_comment) {
    errors.reply_comment = "Please add your Comment First!";
  }
  if (noHtmlRegex.test(values.reply_comment)) {
    errors.reply_comment = messages.invalid;
  }

  return errors;
};

export const ticketValidtor = (values) => {
  let errors = {};
  // if (!values.assigned_to) {
  //   errors.assigned_to = "Please Select a user to assign";
  // }
  // if (!values.priority) {
  //   errors.priority = "Please Select a priortiy";
  // }
  // if (!values.comments) {
  //   errors.comments = "Please Enter your comment";
  // }
  // if (noHtmlRegex.test(values.reply_comment)) {
  //   errors.reply_comment = messages.invalid;
  // }

  return errors;
};

export const autoReplayValidator = (values) => {
  let errors = {};
  if (!values.title) {
    errors.title = "Title is required.";
  }
  if (values.review_type !== null ? values.review_type.length === 0 : true) {
    errors.review_type = "Review Type is Required.";
  }
  if (values.outlet_id !== null ? values.outlet_id.length === 0 : true) {
    errors.outlet_id = "Please select at least one location.";
  }
  if (values.review_template_id !== null ? values.review_template_id.length === 0 : true) {
    errors.review_template_id = "Review Template is required.";
  }
  if (!values.day && !values.hours && !values.minutes) {
    errors.day = "Time is required.";
  }

  if (values.day && parseInt(values.day) > 10) {
    errors.day = "you cannot select more than 10 days.";
  }
  if (values.hours && parseInt(values.hours) > 24) {
    errors.hours = "you cannot select more than 24 hours.";
  }
  if (values.c && parseInt(values.minutes) > 60) {
    errors.minutes = "you cannot select more than 60 minutes.";
  }
  // if (!values.priority) {
  //   errors.priority = "Please Select a priortiy";
  // }
  // if (!values.comments) {
  //   errors.comments = "Please Enter your comment";
  // }
  // if (noHtmlRegex.test(values.reply_comment)) {
  //   errors.reply_comment = messages.invalid;
  // }

  return errors;
};

export const regionValidator = (values) => {
  let errors = {};
  if (!values.name) {
    errors.name = "Add Region Name";
  }

  return errors;
};

export const FeildManageValidatorPassword = (values) => {
  // console.log(values);
  let errors = {};
  if (!values.email) {
    errors.email = "Email is Required";
  }
  if (!values.password) {
    errors.password = "Old Password is Required";
  }
  if (!values.newPassword) {
    errors.newPassword = "New Password is Required";
  }
  return errors;
};

export const FeildManageValidatorNotification = (values) => {
  console.log(values);
  let errors = {};
  if (!values.title) {
    errors.title = "Title is Required";
  }
  if (values.title) {
    if (values.title.length > 50) {
      errors.title = "Maximum 50 characters";
    }
  }
  if (!values.description) {
    errors.description = "Description is Required";
  }
  if (values.description) {
    if (values.description.length > 150) {
      errors.description = "Maximum 150 characters";
    }
  }
  if (!values.Notification) {
    errors.Notification = "Select a Type";
  }
  return errors;
};

export const handleValidateManageFare = (values) => {
  let errors = {};
  console.log(values);
  if (!values.baseRate) {
    errors.baseRate = "Please enter Base rate";
  } else if (values.baseRate <= 0) {
    errors.baseRate = "Invalid Value";
  }
  if (!values.timeRate) {
    errors.timeRate = "Please enter Time rate";
  } else if (values.timeRate <= 0) {
    errors.timeRate = "Invalid Value";
  }
  if (!values.distanceRate) {
    errors.distanceRate = "Please enter Distance rate";
  } else if (values.distanceRate <= 0) {
    errors.distanceRate = "Invalid Value";
  }
  if (!values.adminCommission) {
    errors.adminCommission = "Please enter Admin commission";
  } else if (values.adminCommission <= 0 || values.adminCommission > 100) {
    errors.adminCommission = "Min value is 1 Max is 100";
  }
  if (!values.cancellationFee) {
    errors.cancellationFee = "Please enter Cancellation fee";
  } else if (values.cancellationFee <= 0 || values.cancellationFee > 100) {
    errors.cancellationFee = "Min value is 1 Max is 100";
  }
  if (!values.adminCancellationFee) {
    errors.adminCancellationFee = "Please enter Admin cancellation fee";
    // } else if (+values.adminCancellationFee === 100) {
  } else if (values.cancellationFee <= 0 || values.cancellationFee > 100) {
    // errors.adminCancellationFee = "Max value is 99";
    errors.adminCancellationFee = "Min value is 1 Max is 100";
  }
  // if (!values.driverCancellationFee) {
  //   errors.driverCancellationFee = "Please enter Driver cancellation fee";
  // } else if (+values.driverCancellationFee === 100) {
  //   errors.driverCancellationFee = "Max value is 99";
  // }

  return errors;
};

export const handleValidateManageDesignatedFare = (values) => {
  let errors = {};
  let Regex = /^[0-9]{1,5}(\.[0-9]{1,2})?$/;
  console.log(values);
  if (!values.baseRate) {
    errors.baseRate = "Please enter Base rate";
  }
  if (values.baseRate) {
    if (!Regex.test(values.baseRate)) {
      errors.baseRate = "Invalid Value";
    }
    if (values.baseRate <= 0) {
      errors.baseRate = "Invalid Value";
    }
  }
  if (!values.timeRate) {
    errors.timeRate = "Please enter Time rate";
  }
  if (values.timeRate) {
    if (!Regex.test(values.timeRate)) {
      errors.timeRate = "Invalid Value";
    }
    if (values.timeRate <= 0) {
      errors.timeRate = "Invalid Value";
    }
  }
  if (!values.distanceRate) {
    errors.distanceRate = "Please enter Distance rate";
  }
  if (values.distanceRate) {
    if (!Regex.test(values.distanceRate)) {
      errors.distanceRate = "Invalid Value";
    }
    if (values.distanceRate <= 0) {
      errors.distanceRate = "Invalid Value";
    }
  }
  if (!values.adminCommission) {
    errors.adminCommission = "Please enter Admin commission";
  }
  if (values.adminCommission) {
    if (values.adminCommission <= 0 || values.adminCommission > 99) {
      errors.adminCommission = "Minimum value is 1 & Maximum is 99";
    }
  }
  if (!values.cancellationFee) {
    errors.cancellationFee = "Please enter Cancellation fee";
  } else if (values.cancellationFee <= 0 || values.cancellationFee > 99) {
    errors.cancellationFee = "Minimum value is 1 & Maximum is 99";
  }
  if (!values.adminCancellationFee) {
    errors.adminCancellationFee = "Please enter Admin cancellation fee";
  } else if (+values.adminCancellationFee === 100) {
    errors.adminCancellationFee = "Maximum value is 99";
  }
  // if (!values.driverCancellationFee) {
  //   errors.driverCancellationFee = "Please enter Driver cancellation fee";
  // } else if (+values.driverCancellationFee === 100) {
  //   errors.driverCancellationFee = "Max value is 99";
  // }

  return errors;
};
export const handleValidateManageDesignatedFare2 = (values) => {
  let errors = {};
  console.log(values);
  if (!values.driver_1_Fare) {
    errors.driver_1_Fare = "Please enter driver 1 fare";
  } else if (values.driver_1_Fare <= 0 && values.driver_1_Fare > 99) {
    errors.driver_1_Fare = "Invalid Value";
  }
  if (!values.driver_2_Fare) {
    errors.driver_2_Fare = "Please enter driver 2 fare";
  } else if (values.driver_2_Fare <= 0 && values.driver_2_Fare > 99) {
    errors.driver_2_Fare = "Invalid Value";
  }
  if (!values.driverRadiusSearching) {
    errors.driverRadiusSearching = "Please enter driver radius for searching";
  } else if (values.driverRadiusSearching <= 0) {
    errors.driverRadiusSearching = "Invalid Value";
  }

  return errors;
};

export const handleValidateTip = (values) => {
  let errors = {};
  let Regex = /^[0-9]{1,2}(\.[0-9]{1,2})?$/;
  console.log(values);
  if (!values.tip) {
    errors.tip = "Please enter tip amount";
  }
  if (values.tip) {
    if (!Regex.test(values.tip)) {
      errors.tip = "Invalid value";
    }
    if (values.tip <= 0.5) {
      errors.tip = "Invalid Value";
    }
  }

  return errors;
};
export const handleValidateAddEditSingleTaxi = (values, selectedTaxiDataAddEdit) => {
  let errors = {};
  values = values || {};
  let regex = /^[a-zA-Z ]+$/;
  console.log(values);
  if (!values.name) {
    errors.name = "Please enter vehicle name";
  }
  if (values.name) {
    if (values.description?.name > 30) errors.description = "Maximum 30 characters allowed";
  }
  if (values.description) {
    if (values.description?.length > 100) errors.description = "Maximum 100 characters allowed";
  }
  if (selectedTaxiDataAddEdit === null) {
    if (!values.file1) {
      errors.file1 = "Please select vehicle image";
    }
  } else {
    if (!values.file1 && !values.ImageLink) {
      errors.file1 = "Please select vehicle image";
    }
  }

  return errors;
};

export const handleValidateManageFarePet = (values) => {
  let errors = {};
  // let regex = /^[a-zA-Z ]+$/;
  console.log(values);
  if (!values.name) {
    errors.name = "Please enter vehicle name";
  }
  // else if (!regex.test(values.name)) {
  //   errors.name = "Invalid Value";
  // }

  return errors;
};

export const handleValidateAddEditBannerData = (values, selectedBannerData) => {
  let errors = {};
  let regex = /^[a-zA-Z ]+$/;
  console.log(values);

  // if (!values.file1 && selectedBannerData === null) {
  //   errors.file1 = "Please select banner image";
  // }
  //
  if (selectedBannerData === null) {
    if (!values.file1) {
      errors.file1 = "Please select banner image";
    }
  } else {
    if (!values.file1 && !values.ImageLink) {
      errors.file1 = "Please select banner image";
    }
  }
  return errors;
};
export const handleValidateAddEditPetData = (values, selectedPetCategoryData) => {
  let errors = {};
  // let regex = /^[a-zA-Z ]+$/;
  console.log(values);
  if (!values.name) {
    errors.name = "Please enter pet name";
  }
  if (values.name) {
    // if (!regex.test(values.name)) {
    //   errors.name = "Invalid Value";
    // }
    if (values.name.length > 30) {
      errors.name = "Maximum 30 characters";
    }
  }
  if (selectedPetCategoryData === null) {
    if (!values.file1) {
      errors.file1 = "Please select pet image";
    }
  } else {
    if (!values.file1 && !values.ImageLink) {
      errors.file1 = "Please select pet image";
    }
  }
  return errors;
};

export const handleValidateAddEditCancellationData = (values, selectedCancellationData) => {
  let errors = {};
  // let regex = /^[a-zA-Z ]+$/;
  console.log(values);
  if (!values.English) {
    errors.English = "Please Enter Reason in English";
  } else if (values.English.length < 1) {
    errors.English = "Minimum 5 characters required";
  } else if (values.English.length > 35) {
    errors.English = "Maximum 25 characters accepted";
  }
  if (!values.Korean) {
    errors.Korean = "Please Enter Reason in Korean";
  } else if (values.Korean.length < 1) {
    errors.Korean = "Minimum 5 characters required";
  } else if (values.Korean.length > 35) {
    errors.Korean = "Maximum 25 characters accepted";
  }
  if (!values.Chinese) {
    errors.Chinese = "Please Enter Reason in Chinese";
  } else if (values.Chinese.length < 1) {
    errors.Chinese = "Minimum 5 characters required";
  } else if (values.Chinese.length > 35) {
    errors.Chinese = "Maximum 25 characters accepted";
  }
  if (!values.Spanish) {
    errors.Spanish = "Please Enter Reason in Spanish";
  } else if (values.Spanish.length < 1) {
    errors.Spanish = "Minimum 5 characters required";
  } else if (values.Spanish.length > 35) {
    errors.Spanish = "Maximum 25 characters accepted";
  }
  return errors;
};

export const handleValidateAddEditPackageData = (values, selectedPackageCategoryData) => {
  let errors = {};
  // let regex = /^[a-zA-Z ]+$/;
  console.log(values);
  if (!values.name) {
    errors.name = "Please enter package name";
  }
  if (values.name) {
    // if (!regex.test(values.name)) {
    //   errors.name = "Invalid Value";
    // }
    if (values.name.length > 30) {
      errors.name = "Maximum 30 characters";
    }
  }
  if (selectedPackageCategoryData === null) {
    if (!values.file1) {
      errors.file1 = "Please select package image";
    }
  } else {
    if (!values.file1 && !values.ImageLink) {
      errors.file1 = "Please select package image";
    }
  }
  return errors;
};

export const handleValidateCashbackPoints =(values)=>{
  let errors = {};

  let Regex = /^[0-9]{1,2}(\.[0-9]{1,2})?$/;
  console.log(values);
   
   if (!values.range) {
     errors.range = "Please enter a value";
   }
   if (!values.point) {
    errors.point = "Please enter a value";
  }
  // if (!values.mileStart) {
  //   errors.mileStart = "Please enter a value";
  // }
  // if (!values.mileEnd) {
  //   errors.mileEnd = "Please enter a value";
  // }
  // if (!values.percentage) {
  //   errors.percentage = "Please enter a value";
  // }
  // if (values.mileStart) {
  //   if (!Regex.test(values.mileStart)) {
  //     errors.mileStart = "Invalid value";
  //   }
  //   if (values.mileStart < 0) {
  //     errors.mileStart = "Invalid Value";
  //   }
  // }
  // if (values.mileEnd) {
  //   if (!Regex.test(values.mileEnd)) {
  //     errors.mileEnd = "Invalid value";
  //   }
  //   if (values.mileEnd < 0) {
  //     errors.mileEnd = "Invalid Value";
  //   }
  // }
  // if (values.percentage) {
  //   if (!Regex.test(values.percentage)) {
  //     errors.percentage = "Invalid value";
  //   }
  //   if (values.percentage < 0 ||values.percentage>100) {
  //     errors.percentage = "Invalid Value";
  //   }
  // }


  if (values.range) {
      if (!Regex.test(values.range)) {
        errors.range = "Invalid value";
      }
      if (values.range < 0) {
        errors.range = "Invalid Value";
      }
     }
     if (values.point) {
      if (!Regex.test(values.point)) {
        errors.point = "Invalid value";
      }
      if (values.point < 0) {
        errors.point = "Invalid Value";
      }
     }

  return errors;
}

export const handleValidateAddEditCard=(values)=>{
  let errors = {};
  values = values || {};
  let regex = /^[a-zA-Z ]+$/;
  console.log(values);
  //English
  if (!values.nameEnglish) {
    errors.nameEnglish = "Please enter card name";
  }
  if (values.nameEnglish) {
    if (values.nameEnglish.length > 30) errors.nameEnglish = "Maximum 30 characters allowed";
  }
   //Chinese
   if (!values.nameChinese) {
    errors.nameChinese = "Please enter card name";
  }
  if (values.nameChinese) {
    if (values.nameChinese.length > 30) errors.nameChinese = "Maximum 30 characters allowed";
  }
  //Korean
  if (!values.nameKorean) {
    errors.nameKorean = "Please enter card name";
  }
  if (values.nameKorean) {
    if (values.nameKorean.length > 30) errors.nameKorean = "Maximum 30 characters allowed";
  }
  //Spanish
  if (!values.nameSpanish) {
    errors.nameSpanish = "Please enter card name";
  }
  if (values.nameSpanish) {
    if (values.nameSpanish.length > 30) errors.nameSpanish = "Maximum 30 characters allowed";
  }

  if (!values.category) {
     errors.category = "Please select category";
  }
  // if (selectedTaxiDataAddEdit === null) {
  //   if (!values.file1) {
  //     errors.file1 = "Please select card image";
  //   }
  // } else {
    if (!values.file1 && !values.ImageLink) {
      errors.file1 = "Please select card image";
    }
  // }

  return errors;
}
export const handleValidateAddEditCategory=(values)=>{
  let errors = {};
  values = values || {};
  let regex = /^[a-zA-Z ]+$/;
  console.log(values);
  //English
  if (!values.nameEnglish) {
    errors.nameEnglish = "Please enter category name";
  }
  if (values.nameEnglish) {
    if (values.nameEnglish.length > 30) errors.nameEnglish = "Maximum 30 characters allowed";
  }
  //Chinese
  if (!values.nameChinese) {
    errors.nameChinese = "Please enter category name";
  }
  if (values.nameChinese) {
    if (values.nameChinese.length > 30) errors.nameChinese = "Maximum 30 characters allowed";
  }
  //Korean
  if (!values.nameKorean) {
    errors.nameKorean = "Please enter category name";
  }
  if (values.nameKorean) {
    if (values.nameKorean.length > 30) errors.nameKorean = "Maximum 30 characters allowed";
  }
  //Spanish
  if (!values.nameSpanish) {
    errors.nameSpanish = "Please enter category name";
  }
  if (values.nameSpanish) {
    if (values.nameSpanish.length > 30) errors.nameSpanish = "Maximum 30 characters allowed";
  }
 

  return errors;
}

export const handleValidatePointsValueData = (values) => {
  let errors = {};
  let Regex = /^[0-9]{1,2}(\.[0-9]{1,2})?$/;
  console.log(values);
  if (!values.point) {
    errors.point = "Please enter points";
  }
  if (!values.price) {
    errors.price = "Please enter price";
  }
  if (values.point) {
    if (!Regex.test(values.point)) {
      errors.point = "Invalid value";
    }
    
  }
  if (values.price) {
    if (!Regex.test(values.price)) {
      errors.price = "Invalid value";
    }
    
  }
  return errors;
}