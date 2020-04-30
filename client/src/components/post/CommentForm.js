import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addComment } from "../../actions/post";

const CommentForm = ({ postId, addComment }) => {
  const [text, setText] = useState("");
  return (
    <div class="post-form">
      <div class="post-form-header bg-primary">
        <h3>Leave a comment</h3>
      </div>
      <form
        action="#"
        class="form my-1"
        onSubmit={(e) => {
          e.preventDefault();
          addComment(postId, { text });
          setText("");
        }}
      >
        <textarea
          id=""
          cols="30"
          name="text"
          rows="5"
          onChange={(e) => setText(e.target.value)}
          placeholder="type here..."
          value={text}
        ></textarea>
        <input type="submit" value="Submit" class="btn btn-dark my-1" />
      </form>
    </div>
  );
};

CommentForm.propTypes = {
  addComment: PropTypes.func.isRequired,
};

export default connect(null, { addComment })(CommentForm);
