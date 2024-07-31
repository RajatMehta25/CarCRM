import React, { Component } from "react";
import {
  Row,
  Col,
  Alert,
  Button,
  Container,
  FormGroup,
  Label,
} from "reactstrap";
import axios from "../../axios";
import { toast } from "react-toastify";

// Redux
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";

// availity-reactstrap-validation
import { AvForm, AvField } from "availity-reactstrap-validation";

// action
import { forgetUser } from "../../store/actions";

// import images
import logo from "../../assets/images/logo.png";

class ForgetPasswordPage extends Component {
  constructor(props) {
    super(props);
    this.state = { email: "" };

    // handleValidSubmit
    this.handleValidSubmit = this.handleValidSubmit.bind(this);
  }

  async handleValidSubmit(event, values) {
    // console.log(this.state);
    // console.log(this.props.forgetUser(values, this.props.history).payload.user);
    // console.log(this.event);
    let requestData = {
      email: this.props.forgetUser(values, this.props.history).payload.user
        .useremail,
    };
    try {
      console.log(requestData.email);
      let { data } = await axios.post("/api/v1/admin/forgot_password", {
        email: requestData.email,
      });
      console.log(data);
      //   this.props.history.push("//dashboard");
    } catch (error) {
      toast.error(`Some error in request`, {
        position: toast.POSITION.TOP_RIGHT,
      });

      console.log(error);
    }
  }

  // handleValidSubmit
  //   handleValidSubmit(event, values) {
  //     this.props.forgetUser(values, this.props.history);
  //   }

  render() {
    return (
      <React.Fragment>
        <div className="home-btn d-none d-sm-block">
          <Link to="/adminPanel/">
            <i className="mdi mdi-home-variant h2 text-white"></i>
          </Link>
        </div>
        <div>
          <Container fluid className="p-0">
            <Row className="no-gutters">
              <Col lg={4}>
                <div className="authentication-page-content p-4 d-flex align-items-center min-vh-100">
                  <div className="w-100">
                    <Row className="justify-content-center">
                      <Col lg={9}>
                        <div>
                          <div className="text-center">
                            <div>
                              <Link to="/adminPanel/login" className="logo">
                                <img src={logo} height="80" alt="logo" />
                              </Link>
                            </div>

                            <h4 className="font-size-18 mt-4">
                              Reset Password
                            </h4>
                            <p className="text-muted">
                              Enter your registered email here, we will send you
                              the link to reset your password.
                            </p>
                          </div>

                          <div className="p-2 mt-5">
                            {this.props.forgetError &&
                            this.props.forgetError ? (
                              <Alert color="danger" className="mb-4">
                                {this.props.forgetError}
                              </Alert>
                            ) : null}
                            {this.props.message ? (
                              <Alert color="success" className="mb-4">
                                {this.props.message}
                              </Alert>
                            ) : null}
                            <AvForm
                              className="form-horizontal"
                              onValidSubmit={this.handleValidSubmit}
                            >
                              <FormGroup className="auth-form-group-custom mb-4">
                                <i className="ri-mail-line auti-custom-input-icon"></i>
                                <Label htmlFor="useremail">Email</Label>
                                <AvField
                                  name="useremail"
                                  value={this.state.username}
                                  type="email"
                                  validate={{ email: true, required: true }}
                                  className="form-control"
                                  id="useremail"
                                  placeholder="Enter email"
                                />
                              </FormGroup>

                              <div className="mt-4 text-center">
                                <Button
                                  color="primary"
                                  className="w-md waves-effect waves-light"
                                  type="submit"
                                >
                                  {this.props.loading ? "Loading..." : "Reset"}
                                </Button>
                              </div>
                            </AvForm>
                          </div>

                          <div className="mt-5 text-center">
                            <p>
                              Return to
                              <Link
                                to="/adminPanel/login"
                                className="font-weight-medium text-primary"
                              >
                                {" "}
                                LogIn{" "}
                              </Link>{" "}
                            </p>
                            <p>© 2022 Happy Taxi.</p>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </div>
              </Col>
              <Col lg={8}>
                <div className="authentication-bg">
                  <div className="bg-overlay"></div>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

const mapStatetoProps = (state) => {
  const { message, forgetError, loading } = state.Forget;
  return { message, forgetError, loading };
};

export default withRouter(
  connect(mapStatetoProps, { forgetUser })(ForgetPasswordPage)
);
