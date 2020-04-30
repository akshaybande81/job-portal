import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addPost } from "../../actions/post";

const PostForm = ({ addPost }) => {
  const [text, setText] = useState("");
  return (
    <div class="post-form">
      <div class="post-form-header bg-primary">
        <h3>Say something</h3>
      </div>
      <form
        action="#"
        class="form my-1"
        onSubmit={(e) => {
          e.preventDefault();
          addPost({ text });
          setText("");
        }}
      >
        <textarea
          id=""
          cols="30"
          name="text"
          rows="5"
          onChange={(e) => setText(e.target.value)}
          placeholder="Create a post"
          value={text}
        ></textarea>
        <input type="submit" value="Submit" class="btn btn-dark my-1" />
      </form>
    </div>
  );
};

PostForm.propTypes = {
  addPost: PropTypes.func.isRequired,
};

export default connect(null, { addPost })(PostForm);
