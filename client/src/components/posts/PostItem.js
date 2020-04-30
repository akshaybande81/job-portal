import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Moment from "react-moment";

import { addLike, removeLike, deletePost } from "../../actions/post";

const PostItem = ({
  addLike,
  removeLike,
  deletePost,
  post: { _id, text, name, avatar, user, likes, comments, date },
  auth,
  showActions,
}) => (
  <div class="post bg-white my-1 p-1">
    <div>
      <Link to={`/profile/${user}`}>
        <img src={avatar} alt="" class="round-img" />
        <h4>{name}</h4>
      </Link>
    </div>
    <div>
      <p class="my-1">{text}</p>
      <p class="post-date">
        Posted on: <Moment format="YYYY/MM/DD">{date}</Moment>
      </p>
      {showActions && (
        <Fragment>
          <button
            onClick={(e) => {
              addLike(_id);
            }}
            class="btn"
            type="button"
          >
            <i class="fa fa-thumbs-up"></i>{" "}
            {likes.length > 0 && <span>{likes.length}</span>}
          </button>
          <button
            onClick={(e) => {
              removeLike(_id);
            }}
            class="btn"
          >
            <i class="fa fa-thumbs-down"></i>
          </button>
          <Link to={`/posts/${_id}`} class="btn btn-primary">
            Discussion{" "}
            {comments.length > 0 && (
              <span class="comment-count">{comments.length}</span>
            )}
          </Link>

          {!auth.loading && user === auth.user._id && (
            <button
              onClick={(e) => {
                deletePost(_id);
              }}
              class="btn btn-danger"
              type="button"
            >
              <i class="fa fa-times"></i>
            </button>
          )}
        </Fragment>
      )}
    </div>
  </div>
);

PostItem.defaultProps = {
  showActions: true,
};

PostItem.propTypes = {
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  addLike: PropTypes.func.isRequired,
  removeLike: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
  showActions: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { addLike, removeLike, deletePost })(
  PostItem
);
