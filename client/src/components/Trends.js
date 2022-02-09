import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTrends } from "../actions/post.actions";
import { isEmpty } from "./Utils";
import { NavLink } from "react-router-dom";

const Trends = () => {
  const posts = useSelector((state) => state.allPostsReducer);
  const usersData = useSelector((state) => state.usersReducer);
  const trendList = useSelector((state) => state.trendingReducer);
  const dispatch = useDispatch();
  const defaultPicture = "http://localhost:5000/uploads/profil/random-user.png";

  useEffect(() => {
    if (!isEmpty(posts[0])) {
      const postsArr = Object.keys(posts).map((i) => posts[i]);
      let sortedArray = postsArr.sort((a, b) => {
        return b.likes - a.likes;
      });
      sortedArray.length = 5;
      dispatch(getTrends(sortedArray));
    }
  }, [posts, dispatch]);

  return (
    <div className="trending-container">
      <h4>Trending</h4>
      <NavLink exact to="/trending">
        <ul>
          {trendList.length &&
            trendList.map((post) => {
              return (
                <li key={post.id}>
                  <div>
                    <img
                      src={
                        !isEmpty(post.UserId)
                          ? usersData
                              .map((user) => {
                                if (user.id === post.UserId)
                                  return user.picture
                                    ? "http://localhost:5000" +
                                        user.picture.replace(/^./, "")
                                    : defaultPicture;
                                else return null;
                              })
                              .join("")
                          : defaultPicture
                      }
                      alt="poster-pic"
                    />
                  </div>
                  <div className="trend-content">
                    <p>{post.content}</p>
                    <span>Lire</span>
                  </div>
                </li>
              );
            })}
        </ul>
      </NavLink>
    </div>
  );
};

export default Trends;
