import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  followUser,
  getFriends,
  getUser,
  unfollowUser,
} from "../../actions/user.actions";
import { isEmpty } from "../Utils";

const FollowHandler = ({ idToFollow, type }) => {
  const userData = useSelector((state) => state.userReducer);
  const [isFollowed, setIsFollowed] = useState(false);
  const dispatch = useDispatch();

  const handleFollow = () => {
    dispatch(followUser(userData.id, idToFollow))
      .then(() => dispatch(getUser(userData.id)))
      .then(() => dispatch(getFriends(userData.id)));
    setIsFollowed(true);
  };

  const handleUnfollow = () => {
    dispatch(unfollowUser(userData.id, idToFollow))
      .then(() => dispatch(getUser(userData.id)))
      .then(() => dispatch(getFriends(userData.id)));
    setIsFollowed(false);
  };

  useEffect(() => {
    if (!isEmpty(userData.friends)) {
      userData.friends.map((i) => {
        if (i.friendId) {
          if (i.friendId === idToFollow) {
            return setIsFollowed(true);
          }
        } else return setIsFollowed(false);
      });
    }
  }, [userData, idToFollow]);

  return (
    <>
      {isFollowed && !isEmpty(userData) && (
        <span onClick={handleUnfollow}>
          {type === "suggestion" && (
            <button className="unfollow-btn">Abonné</button>
          )}
          {type === "card" && (
            <img src="./img/icons/checked.svg" alt="checked" />
          )}
        </span>
      )}
      {isFollowed === false && !isEmpty(userData) && (
        <span onClick={handleFollow}>
          {type === "suggestion" && (
            <button className="follow-btn">Suivre</button>
          )}
          {type === "card" && <img src="./img/icons/check.svg" alt="check" />}
        </span>
      )}
    </>
  );
};

export default FollowHandler;
