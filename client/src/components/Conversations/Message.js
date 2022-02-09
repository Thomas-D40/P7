import { format } from "timeago.js";
import { isEmpty } from "../Utils";
import { useSelector } from "react-redux";

export default function Message({ message, own }) {
  const defaultPicture = "http://localhost:5000/uploads/profil/random-user.png";
  const usersData = useSelector((state) => state.usersReducer);

  return (
    <div className={own ? "message own" : "message"}>
      <div className="messageTop">
        <img
          className="messageImg"
          src={
            !isEmpty(message.userId)
              ? usersData
                  .map((user) => {
                    if (user.id === message.userId)
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
        <p className="messageText">{message.content}</p>
      </div>
      <div className="messageBottom">{format(message.createdAt)}</div>
    </div>
  );
}
