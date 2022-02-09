import axios from "axios";
import qs from "qs";

// conversations
export const CREATE_CONV = "CREATE_CONV";
export const GET_CONV = "GET_CONV";
export const GET_CURRENT_CONV = "GET_CURRENT_CONV";

// messages
export const ADD_MESSAGES = "ADD_MESSAGES";

export const addConv = (userId, idToDiscuss) => {
  return (dispatch) => {
    return axios({
      method: "post",
      url: `${process.env.REACT_APP_API_URL}/api/conversations/`,
      data: qs.stringify({ senderId: userId, receiverId: idToDiscuss }),
      withCredentials: true,
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        accept: "*/*",
      },
    })
      .then((res) => {
        dispatch({ type: CREATE_CONV, payload: { userId, idToDiscuss } });
      })
      .catch((err) => console.log(err));
  };
};

export const getConv = (uid, friendId) => {
  return (dispatch) => {
    return axios
      .get(`${process.env.REACT_APP_API_URL}/api/conversations/` + uid)
      .then((res) => {
        const currentConv = res.data.map((conv) => {
          if (conv.userId1 === friendId || conv.userId2 === friendId)
            return conv;
          else return null;
        });
        dispatch({ type: GET_CURRENT_CONV, payload: currentConv });
        dispatch({ type: GET_CONV, payload: res.data });
      })
      .catch((err) => console.log(err));
  };
};

export const addMsg = (userId, content, conversationId) => {
  return (dispatch) => {
    var data = qs.stringify({ userId: userId, content: content });
    return axios({
      method: "post",
      url: `${process.env.REACT_APP_API_URL}/api/messages/` + conversationId,
      data: data,
      withCredentials: true,
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        accept: "*/*",
      },
    })
      .then((res) => {
        dispatch({
          type: ADD_MESSAGES,
          payload: { userId, content, conversationId },
        });
      })
      .catch((err) => console.log(err));
  };
};
