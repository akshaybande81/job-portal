import React, { Fragment, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { setAlert } from "../../actions/alert";
import { register } from "../../actions/auth";

const Register = ({ setAlert, register, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: ""
  });

  const { name, email, password, password2 } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    if (password !== password2) {
      return setAlert("password do not match", "danger", 2000);
    }
    return register({ name, email, password });
  };

  // redirect if successfully registered

  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <Fragment>
      <h1 className="large text-primary">Sign Up</h1>
      <p className="lead">
        <i className="fa fa-user">Create your account</i>
      </p>

      <form className="form" onSubmit={e => onSubmit(e)}>
        <div className="form-group">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={name}
            onChange={e => onChange(e)}
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            name="email"
            value={email}
            placeholder="Email Address"
            onChange={e => onChange(e)}
          />
          <small className="form-text">
            This site uses gravatar, so if you want a profile image, use a
            gravatar email
          </small>
        </div>
        <div className="form-group">
          <input
            type="password"
            name="password"
            value={password}
            onChange={e => onChange(e)}
            placeholder="password"
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            name="password2"
            value={password2}
            onChange={e => onChange(e)}
            placeholder="confirm password"
          />
        </div>

        <input type="submit" value="Register" className="btn btn-primary" />
      </form>

      <p className="my-1">
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
    </Fragment>
  );
};

// getting something from actions to props
Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};

// getting something from state to props
const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

// need some initial state from mapStateToProps
export default connect(mapStateToProps, { setAlert, register })(
  Register
); /** connect component to redux */
