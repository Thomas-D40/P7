import axios from "axios";

export const GET_USER = "GET_USER";
export const UPLOAD_PICTURE = "UPLOAD_PICTURE";
export const UPDATE_BIO = "UPDATE_BIO";
export const FOLLOW_USER = "FOLLOW_USER";
export const UNFOLLOW_USER = "UNFOLLOW_USER";
export const GET_FRIENDS = "GET_FRIENDS";

export const GET_USER_ERRORS = "GET_USER_ERRORS";

export const getUser = (uid) => {
  return (dispatch) => {
    return axios
      .get(`${process.env.REACT_APP_API_URL}/api/users/${uid}`)
      .then((res) => {
        if (res.data.picture !== null) {
          let picture = res.data.picture.replace(/^"(.*)"$/, "$1");
          Object.defineProperty(res.data, "picture", {
            value: picture,
          });
        }
        dispatch({ type: GET_USER, payload: res.data });
      })
      .catch((err) => console.log(err));
  };
};

export const uploadPicture = (data, id) => {
  return (dispatch) => {
    return axios({
      method: "post",
      url: `${process.env.REACT_APP_API_URL}/api/users/upload`,
      data,
      withCredentials: true,
      headers: {
        "content-type": "multipart/form-data",
        accept: "*/*",
      },
    })
      .then((res) => {
        if (res.data.errors) {
          dispatch({ type: GET_USER_ERRORS, payload: res.data.errors });
        } else {
          dispatch({ type: GET_USER_ERRORS, payload: "" });
          return axios
            .get(`${process.env.REACT_APP_API_URL}api/users/${id}`)
            .then((res) => {
              dispatch({ type: UPLOAD_PICTURE, payload: res.data.picture });
            });
        }
      })
      .catch((err) => console.log(err));
  };
};

export const updateBio = (userId, bio) => {
  return (dispatch) => {
    return axios({
      method: "put",
      url: `${process.env.REACT_APP_API_URL}/api/users/` + userId,
      data: { bio },
      withCredentials: true,
    })
      .then((res) => {
        dispatch({ type: UPDATE_BIO, payload: bio });
      })
      .catch((err) => console.log(err));
  };
};

export const followUser = (userId, idToFollow) => {
  return (dispatch) => {
    return axios({
      method: "post",
      url: `${process.env.REACT_APP_API_URL}/api/users/follow/` + idToFollow,
      data: { userId },
    })
      .then((res) => {
        dispatch({ type: FOLLOW_USER, payload: { userId } });
      })
      .catch((err) => console.log(err));
  };
};

export const unfollowUser = (userId, idToUnfollow) => {
  return (dispatch) => {
    return axios({
      method: "delete",
      url:
        `${process.env.REACT_APP_API_URL}/api/users/unfollow/` + idToUnfollow,
      data: { userId },
    })
      .then((res) => {
        dispatch({ type: UNFOLLOW_USER, payload: { userId } });
      })
      .catch((err) => console.log(err));
  };
};

export const getFriends = (userId) => {
  return (dispatch) => {
    return axios({
      method: "get",
      url: `${process.env.REACT_APP_API_URL}/api/users/friends/` + userId,
    })
      .then((res) => {
        dispatch({ type: GET_FRIENDS, payload: res.data });
      })
      .catch((err) => console.log(err));
  };
};
