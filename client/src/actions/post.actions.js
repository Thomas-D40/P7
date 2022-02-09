import axios from "axios";
import qs from "qs";

// posts
export const GET_POSTS = "GET_POSTS";
export const GET_ALL_POSTS = "GET_ALL_POSTS";
export const ADD_POST = "ADD_POST";
export const LIKE_POST = "LIKE_POST";
export const UNLIKE_POST = "UNLIKE_POST";
export const UPDATE_POST = "UPDATE_POST";
export const DELETE_POST = "DELETE_POST";

// comments
export const ADD_COMMENT = "ADD_COMMENT";
export const EDIT_COMMENT = "EDIT_COMMENT";
export const DELETE_COMMENT = "DELETE_COMMENT";

// trends
export const GET_TRENDS = "GET_TRENDS";

// errors
export const GET_POST_ERRORS = "GET_POST_ERRORS";

export const getPosts = (num) => {
  return (dispatch) => {
    return axios
      .get(`${process.env.REACT_APP_API_URL}/api/posts/`)
      .then((res) => {
        const array = res.data.slice(0, num);
        dispatch({ type: GET_POSTS, payload: array });
        dispatch({ type: GET_ALL_POSTS, payload: res.data });
      })
      .catch((err) => console.log(err));
  };
};

export const addPost = (data) => {
  return (dispatch) => {
    return axios({
      method: "post",
      url: `${process.env.REACT_APP_API_URL}/api/posts/`,
      data: qs.stringify(data),
      withCredentials: true,
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        accept: "*/*",
      },
    }).then((res) => {
      if (res.data.errors) {
        dispatch({ type: GET_POST_ERRORS, payload: res.data.errors });
      } else {
        dispatch({ type: GET_POST_ERRORS, payload: "" });
      }
    });
  };
};

export const likePost = (postId, userId) => {
  return (dispatch) => {
    var data = qs.stringify({ id: userId });
    return axios({
      method: "post",
      url: `${process.env.REACT_APP_API_URL}/api/posts/like-post/` + postId,
      data: data,
      withCredentials: true,
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        accept: "*/*",
      },
    })
      .then((res) => {
        dispatch({ type: LIKE_POST, payload: { postId, userId, likesInc: 1 } });
      })
      .catch((err) => console.log(err));
  };
};

export const unlikePost = (postId, userId) => {
  return (dispatch) => {
    var data = qs.stringify({ id: userId });
    return axios({
      method: "post",
      url: `${process.env.REACT_APP_API_URL}/api/posts/unlike-post/` + postId,
      data: data,
      withCredentials: true,
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        accept: "*/*",
      },
    })
      .then((res) => {
        dispatch({
          type: UNLIKE_POST,
          payload: { postId, userId, likesInc: -1 },
        });
      })
      .catch((err) => console.log(err));
  };
};

export const updatePost = (postId, content) => {
  return (dispatch) => {
    return axios({
      method: "put",
      url: `${process.env.REACT_APP_API_URL}/api/posts/${postId}`,
      data: { content },
      withCredentials: true,
    })
      .then((res) => {
        dispatch({ type: UPDATE_POST, payload: { content, postId } });
      })
      .catch((err) => console.log(err));
  };
};

export const deletePost = (postId) => {
  return (dispatch) => {
    return axios({
      method: "delete",
      url: `${process.env.REACT_APP_API_URL}/api/posts/${postId}`,
    })
      .then((res) => {
        dispatch({ type: DELETE_POST, payload: { postId } });
      })
      .catch((err) => console.log(err));
  };
};

export const addComment = (postId, userId, content) => {
  return (dispatch) => {
    return axios({
      method: "post",
      url: `${process.env.REACT_APP_API_URL}/api/posts/comment-post/${postId}`,
      data: { userId, content, postId },
    })
      .then((res) => {
        dispatch({ type: ADD_COMMENT, payload: { postId } });
      })
      .catch((err) => console.log(err));
  };
};

export const editComment = (postId, commentId, content) => {
  return (dispatch) => {
    return axios({
      method: "put",
      url: `${process.env.REACT_APP_API_URL}/api/posts/edit-comment-post/${commentId}`,
      data: { commentId, content },
    })
      .then((res) => {
        dispatch({
          type: EDIT_COMMENT,
          payload: { postId, commentId, content },
        });
      })
      .catch((err) => console.log(err));
  };
};

export const deleteComment = (commentId, postId) => {
  return (dispatch) => {
    return axios({
      method: "delete",
      url: `${process.env.REACT_APP_API_URL}/api/posts/delete-comment-post/${commentId}`,
    })
      .then((res) => {
        dispatch({ type: DELETE_COMMENT, payload: { commentId, postId } });
      })
      .catch((err) => console.log(err));
  };
};

export const getTrends = (sortedArray) => {
  return (dispatch) => {
    dispatch({ type: GET_TRENDS, payload: sortedArray });
  };
};
