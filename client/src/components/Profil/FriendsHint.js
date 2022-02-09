import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getConv } from "../../actions/conversations.actions";
import { isEmpty } from "../Utils";
import CreateConv from "./CreateConv";
import FollowHandler from "./FollowHandler";

const FriendsHint = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [playOnce, setPlayOnce] = useState(true);
  const [friendsHint, setFriendsHint] = useState([]);
  const userData = useSelector((state) => state.userReducer);
  const usersData = useSelector((state) => state.usersReducer);
  const defaultPicture = "http://localhost:5000/uploads/profil/random-user.png";
  const dispatch = useDispatch();

  // if (document.location)

  useEffect(() => {
    const notFriendList = () => {
      let array = [];
      usersData.map((user) => {
        if (user.id !== userData.id) {
          return array.push(user.id);
        } else return null;
      });
      setFriendsHint(array);
    };

    if (playOnce && !isEmpty(usersData[0]) && !isEmpty(userData.id)) {
      notFriendList();
      dispatch(getConv(userData.id));
      setIsLoading(false);
      setPlayOnce(false);
    }
  }, [usersData, userData, playOnce, friendsHint, dispatch]);

  console.log(window.location.pathname);

  return (
    <div className="get-friends-container">
      <h4>Suggestions</h4>
      {isLoading ? (
        <div className="icon">
          <i className="fas fa-spinner fa-pulse"></i>
        </div>
      ) : (
        <ul>
          {friendsHint &&
            friendsHint.map((user) => {
              for (let i = 0; i < usersData.length; i++) {
                if (user === usersData[i].id) {
                  return (
                    <li className="user-hint" key={user}>
                      <img
                        src={
                          usersData[i].picture
                            ? "http://localhost:5000" +
                              usersData[i].picture.replace(/^./, "")
                            : defaultPicture
                        }
                        alt="user-pic"
                      />
                      <p>{usersData[i].username}</p>
                      <CreateConv idToDiscuss={usersData[i].id} />
                      <FollowHandler
                        idToFollow={usersData[i].id}
                        type={"suggestion"}
                      />
                    </li>
                  );
                }
              }
            })}
        </ul>
      )}
    </div>
  );
};

export default FriendsHint;
