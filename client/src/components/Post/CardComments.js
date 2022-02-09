import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addComment, getPosts, getTrends } from "../../actions/post.actions";
import FollowHandler from "../Profil/FollowHandler";
import { isEmpty, timestampParser } from "../Utils";
import EditDeleteComment from "./EditDeleteComment";

const CardComments = ({ post }) => {
  const [text, setText] = useState("");
  const usersData = useSelector((state) => state.usersReducer);
  const userData = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();
  const defaultPicture = "http://localhost:5000/uploads/profil/random-user.png";
  const missingName = "Ancien utilisateur";

  const handleComment = (e) => {
    e.preventDefault();

    if (text) {
      dispatch(addComment(post.id, userData.id, text, userData.pseudo))
        .then(() => dispatch(getPosts()))
        .then(() => dispatch(getTrends()));
      setText("");
    }
  };

  return (
    <div className="comments-container">
      {post.Comments.map((comment) => {
        return (
          <div
            className={
              comment.userId === userData.id || userData.isAdmin === true
                ? "comment-container client"
                : "comment-container"
            }
            key={comment.id}
          >
            <div className="left-part">
              <img
                src={
                  !isEmpty(comment.userId)
                    ? usersData
                        .map((user) => {
                          if (user.id === comment.userId)
                            return user.picture
                              ? "http://localhost:5000" +
                                  user.picture.replace(/^./, "")
                              : defaultPicture;
                          else return null;
                        })
                        .join("")
                    : defaultPicture
                }
                alt="commenter-pic"
              />
            </div>
            <div className="right-part">
              <div className="comment-header">
                <div className="pseudo">
                  <h3>
                    {!isEmpty(comment.userId)
                      ? usersData
                          .map((user) => {
                            if (user.id === comment.userId)
                              return user.username;
                            else return null;
                          })
                          .join("")
                      : missingName}
                  </h3>
                  {comment.userId !== userData.id && (
                    <FollowHandler idToFollow={comment.userId} type={"card"} />
                  )}
                </div>
                <span>{timestampParser(comment.updatedAt)}</span>
              </div>
              <p>{comment.content}</p>
              <EditDeleteComment comment={comment} postId={post.id} />
            </div>
          </div>
        );
      })}
      {userData.id && (
        <form action="" onSubmit={handleComment} className="comment-form">
          <textarea
            type="text"
            name="text"
            onChange={(e) => setText(e.target.value)}
            value={text}
            placeholder="Laisser un commentaire"
          />
          <br />
          <input type="submit" value="Envoyer" />
        </form>
      )}
    </div>
  );
};

export default CardComments;
