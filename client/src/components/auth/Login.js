import React, { Fragment, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { login } from "../../actions/auth";
import { setAlert } from "../../actions/alert";
import { connect } from "react-redux";
import PropTypes from "prop-types";

const Login = ({ login, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const { email, password } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    login(email, password);
  };

  // redirect if logged in
  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <Fragment>
      <h1 className="large text-primary">Sign In</h1>
      <p className="lead">
        <i className="fa fa-user">Login to your account</i>
      </p>

      <form className="form" onSubmit={e => onSubmit(e)}>
        <div className="form-group">
          <input
            type="email"
            name="email"
            value={email}
            placeholder="Email Address"
            onChange={e => onChange(e)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            name="password"
            value={password}
            onChange={e => onChange(e)}
            placeholder="password"
            minLength="6"
            required
          />
        </div>

        <input type="submit" value="Login" className="btn btn-primary" />
      </form>

      <p className="my-1">
        Don't have an account? <Link to="/register">Sign Up</Link>
      </p>
    </Fragment>
  );
};

Login.propTypes = {
  setAlert: PropTypes.func.isRequired,
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};

// to get something into props of the component generally from state
const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

// need some initial state from mapStateToProps
export default connect(mapStateToProps, { setAlert, login })(Login);
