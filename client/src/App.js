import React, { Fragment, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import "./App.css";
import setAuthToken from "./utils/setAuthToken";
import { loadUser } from "./actions/auth";
import { Provider } from "react-redux";
import store from "./store";

import Routes from './components/routing/Routes'

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  // const unsubscribe = store.subscribe(() =>
  //   console.log(store.getState(), "state")
  // );

  /** when state changes it will keep loading and it will infinite loop
   * hence add second parametere empty array to load it only once after state changes
   */
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Switch>
          <Route exact path="/" component={Landing} />
          <Route  component={Routes} />
          </Switch>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;

// exact is used to disable partial matching
