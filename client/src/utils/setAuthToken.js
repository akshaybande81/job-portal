import axios from "axios";

/**setting global headers for axios
 * whenever we make any request with axios we will be sending this token with it
 */
const setAuthToken = token => {
  if (token) {
    axios.defaults.headers.common["x-auth-token"] = token;
  } else {
    delete axios.defaults.headers.common["x-auth-token"];
  }
};

export default setAuthToken;
