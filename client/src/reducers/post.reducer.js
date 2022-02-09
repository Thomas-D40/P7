import {
  DELETE_COMMENT,
  DELETE_POST,
  EDIT_COMMENT,
  GET_POSTS,
  LIKE_POST,
  UNLIKE_POST,
  UPDATE_POST,
} from "../actions/post.actions";

const initialState = {};

export default function postReducer(state = initialState, action) {
  switch (action.type) {
    case GET_POSTS:
      return action.payload;
    case LIKE_POST:
      return state.map((post) => {
        if (post.id === action.payload.postId) {
          return {
            ...post,
            likes: post.likes + action.payload.likesInc,
            Likes: post.Likes.map((Likes) => {
              if (Likes.userId === action.payload.userId) {
                return {
                  ...Likes,
                  isLike: 1,
                };
              }
              return Likes;
            }),
          };
        }
        return post;
      });
    case UNLIKE_POST:
      return state.map((post) => {
        if (post.id === action.payload.postId) {
          return {
            ...post,
            likes: post.likes + action.payload.likesInc,
            Likes: post.Likes.map((Likes) => {
              if (Likes.userId === action.payload.userId) {
                return {
                  ...Likes,
                  isLike: 0,
                };
              }
              return Likes;
            }),
          };
        }
        return post;
      });
    case UPDATE_POST:
      return state.map((post) => {
        if (post.id === action.payload.postId) {
          return {
            ...post,
            content: action.payload.content,
          };
        } else return post;
      });
    case DELETE_POST:
      return state.filter((post) => post.id !== action.payload.postId);
    case EDIT_COMMENT:
      return state.map((post) => {
        if (post.id === action.payload.postId) {
          return {
            ...post,
            comments: post.Comments.map((comment) => {
              if (comment.id === action.payload.commentId) {
                return {
                  ...comment,
                  text: action.payload.text,
                };
              } else {
                return comment;
              }
            }),
          };
        } else return post;
      });
    case DELETE_COMMENT:
      return state.map((post) => {
        if (post.id === action.payload.postId) {
          return {
            ...post,
            comments: post.comments.filter(
              (comment) => comment.id !== action.payload.commentId
            ),
          };
        } else return post;
      });
    default:
      return state;
  }
}
