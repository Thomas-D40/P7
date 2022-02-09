import {
  CREATE_CONV,
  GET_CONV,
  ADD_MESSAGES,
} from "../actions/conversations.actions";

const initialState = {};

export default function convReducer(state = initialState, action) {
  switch (action.type) {
    case GET_CONV:
      return action.payload;
    case ADD_MESSAGES:
      return state.map((conv) => {
        if (conv.id === action.payload.postId) {
          return {
            ...conv,
            messages: action.payload.messages,
          };
        } else return state;
      });
    default:
      return state;
  }
}
