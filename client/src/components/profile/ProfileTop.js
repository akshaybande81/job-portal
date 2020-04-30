import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const ProfileTop = ({
  profile: {
    status,
    company,
    location,
    website,
    social,
    user: { name, avatar }
  }
}) => {
  return (
    <div className="profile-top bg-primary p-2">
      <img src={avatar} alt="" className="round-img my-1" />
      <h1 className="large">{name}</h1>
      <p className="lead">
        {status} {company && <span> at {company}</span>}
      </p>
      <p>{location && <span>{location}</span>}</p>
      <div className="icons my-1">
        {website && (
          <a href={website} target="_blank">
            <i className="fa fa-globe fa-2x"></i>
          </a>
        )}

        {social && social.twitter && (
          <a href={social.twitter} target="_blank">
            <i className="fa fa-twitter fa-2x"></i>
          </a>
        )}

        {social && social.facebook && (
          <a href={social.facebook} target="_blank">
            <i className="fa fa-facebook fa-2x"></i>
          </a>
        )}

        {social && social.linkedin && (
          <a href={social.linkedin} target="_blank">
            <i className="fa fa-linkedin fa-2x"></i>
          </a>
        )}

        {social && social.instagram && (
          <a href={social.instagram} target="_blank">
            <i className="fa fa-instagram fa-2x"></i>
          </a>
        )}

        {social && social.youtube && (
          <a href={social.youtube} target="_blank">
            <i className="fa fa-youtube fa-2x"></i>
          </a>
        )}
      </div>
    </div>
  );
};

ProfileTop.propTypes = {
  profile: PropTypes.object.isRequired
};

export default ProfileTop;
