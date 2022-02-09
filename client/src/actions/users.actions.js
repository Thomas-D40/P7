import axios from "axios";

export const GET_USERS = "GET_USERS";

export const getUsers = () => {
  return (dispatch) => {
    return axios
      .get(`${process.env.REACT_APP_API_URL}/api/users`)
      .then((res) => {
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].picture !== null) {
            let picture = res.data[i].picture.replace(/^"(.*)"$/, "$1");
            Object.defineProperty(res.data[i], "picture", {
              value: picture,
            });
          }
        }
        dispatch({ type: GET_USERS, payload: res.data });
      })
      .catch((err) => console.log(err));
  };
};
