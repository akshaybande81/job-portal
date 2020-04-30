import axios from "axios";
import { setAlert } from "../actions/alert";
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  AUTH_ERROR,
  USER_LOADED,
  LOGIN_SUCCESS,
  LOGIN_FAIL
} from "./types";

import setAuthToken from "../utils/setAuthToken";

// Load user

export const loadUser = () => async dispatch => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const res = await axios.get("/api/auth");
    dispatch({
      type: USER_LOADED,
      payload: res.data
    });
  } catch (err) {
    console.log(err, "error in user loaded");
    dispatch({
      type: AUTH_ERROR
    });
  }
};

// Reigter user

export const register = ({ name, email, password }) => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };
  const body = JSON.stringify({ name, email, password });

  try {
    const res = await axios.post("/api/user", body, config);
    console.log(res.data);
    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data
    });
    dispatch(loadUser());
  } catch (err) {
    console.log(err, "error in register action");
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach(e => dispatch(setAlert(e.msg, "danger", 2000)));
    }
    dispatch({
      type: REGISTER_FAIL
    });
  }
};

// Login user
export const login = (email, password) => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };
  const body = JSON.stringify({ email, password });

  try {
    const res = await axios.post("/api/auth", body, config);
    console.log(res.data, "login api result");
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data
    });

    dispatch(loadUser());
  } catch (err) {
    console.log(err, "error in login action");
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach(e => dispatch(setAlert(e.msg, "danger", 2000)));
    }
    dispatch({
      type: LOGIN_FAIL
    });
  }
};

// logout/ clear profile

export const logout = () => async dispatch => {
  dispatch({
    type: "CLEAR_PROFILE"
  });
  dispatch({
    type: "LOGOUT"
  });
};
