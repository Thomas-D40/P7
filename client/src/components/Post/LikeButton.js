import React, { useContext, useEffect, useState } from "react";
import { UidContext } from "../AppContext";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { useDispatch } from "react-redux";
import {
  getPosts,
  getTrends,
  likePost,
  unlikePost,
} from "../../actions/post.actions";

const LikeButton = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const uid = useContext(UidContext);
  const dispatch = useDispatch();

  const like = () => {
    dispatch(likePost(post.id, uid))
      .then(() => dispatch(getPosts()))
      .then(() => dispatch(getTrends()));
    setLiked(true);
  };

  const unlike = () => {
    dispatch(unlikePost(post.id, uid))
      .then(() => dispatch(getPosts()))
      .then(() => dispatch(getTrends()));
    setLiked(false);
  };

  useEffect(() => {
    for (let i = 0; i < post.Likes.length; i++) {
      if (post.Likes[i].userId === uid) {
        if (post.Likes[i].isLike === 1) {
          setLiked(true);
        } else {
          setLiked(false);
        }
      }
    }
  }, [uid, liked, post]);

  return (
    <div className="like-container">
      {uid === null && (
        <Popup
          trigger={<img src="./img/icons/heart.svg" alt="like" />}
          position={["bottom center", "bottom right", "bottom left"]}
          closeOnDocumentClick
        >
          <div>Connectez-vous pour aimer un post !</div>
        </Popup>
      )}
      {uid && liked === false && (
        <img src="./img/icons/heart.svg" onClick={like} alt="like" />
      )}
      {uid && liked && (
        <img src="./img/icons/heart-filled.svg" onClick={unlike} alt="unlike" />
      )}
      <span>{post.likes}</span>
    </div>
  );
};

export default LikeButton;
