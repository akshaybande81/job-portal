import React from "react";
import { Link } from "react-router-dom";

export const DashboardActions = () => {
  return (
    <div class="dash-buttons">
      <Link to="/edit-profile" class="btn dash-buttons">
        <i class="fa fa-user-circle text-primary"></i> Edit Profile
      </Link>
      <Link to="/add-experience" class="btn dash-buttons">
        <i class="fa fa-black-tie text-primary"></i> Add Experience
      </Link>
      <Link to="/add-education" class="btn dash-buttons">
        <i class="fa fa-graduation-cap text-primary"></i> Add Education
      </Link>
    </div>
  );
};

export default DashboardActions;
