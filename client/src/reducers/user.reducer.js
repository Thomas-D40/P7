import {
  GET_FRIENDS,
  GET_USER,
  UPDATE_BIO,
  UPLOAD_PICTURE,
} from "../actions/user.actions";
import { GET_CURRENT_CONV } from "../actions/conversations.actions";

const initialState = {};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case GET_USER:
      return action.payload;
    case GET_FRIENDS:
      return {
        ...state,
        friends: action.payload,
      };
    case GET_CURRENT_CONV:
      return {
        ...state,
        currentConv: action.payload,
      };
    case UPLOAD_PICTURE:
      return {
        ...state,
        picture: action.payload,
      };
    case UPDATE_BIO:
      return {
        ...state,
        bio: action.payload,
      };
    default:
      return state;
  }
}
