import { useSelector } from "react-redux";

export default function Conversation({
  conversation,
  currentUser,
  currentChat,
}) {
  const usersData = useSelector((state) => state.usersReducer);
  const defaultPicture = "http://localhost:5000/uploads/profil/random-user.png";

  const friendId =
    conversation.userId1 === currentUser
      ? conversation.userId2
      : conversation.userId1;

  return (
    <div
      className={
        conversation === currentChat
          ? "conversation conversation__active"
          : "conversation"
      }
    >
      <img
        className="conversationImg"
        src={
          usersData
            ? usersData
                .map((user) => {
                  if (user.id === friendId)
                    return user.picture
                      ? "http://localhost:5000" + user.picture.replace(/^./, "")
                      : defaultPicture;
                  else return null;
                })
                .join("")
            : defaultPicture
        }
        alt=""
      />
      <span className="conversationName">
        {usersData
          .map((user) => {
            if (user.id === friendId) return user.username;
            else return null;
          })
          .join("")}
      </span>
    </div>
  );
}
