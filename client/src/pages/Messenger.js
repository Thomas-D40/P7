import Conversation from "../components/Conversations/Conversation";
import Message from "../components/Conversations/Message";
import { useContext, useEffect, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import { UidContext } from "../components/AppContext";
import { io } from "socket.io-client";

import { useDispatch, useSelector } from "react-redux";
import LeftNav from "../components/LeftNav";
import { addMsg, getConv } from "../actions/conversations.actions";
import { isEmpty } from "../components/Utils";
import FriendsHint from "../components/Profil/FriendsHint";

export default function Messenger() {
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const convList = useSelector((state) => state.convReducer);
  const userData = useSelector((state) => state.userReducer);

  const socket = useRef();
  const uid = useContext(UidContext);
  const scrollRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    socket.current = io("ws://localhost:8900");
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        userId: data.senderId,
        content: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage &&
      (arrivalMessage.userId === currentChat.userId1 ||
        arrivalMessage.userId === currentChat.userId2) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    socket.current.emit("addUser", uid);
    socket.current.on("getUsers", (users) => {
      !isEmpty(userData.friends) &&
        setOnlineUsers(
          userData.friends.filter((f) => users.some((u) => u.userId === f))
        );
    });
  }, [uid, userData.friends]);

  useEffect(() => {
    dispatch(getConv(uid));
  }, [uid, dispatch]);

  useEffect(() => {
    !isEmpty(userData) &&
      userData.currentConv.map((conv) => {
        if (!isEmpty(conv)) return setCurrentChat(conv);
        else return null;
      });
  }, [userData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const receiverId =
      currentChat.userId1 === uid ? currentChat.userId2 : currentChat.userId1;

    socket.current.emit("sendMessage", {
      senderId: uid,
      receiverId: receiverId,
      text: newMessage,
    });

    dispatch(addMsg(uid, newMessage, currentChat.id)).then(() =>
      dispatch(getConv(uid))
    );

    let message = {
      userId: uid,
      content: newMessage,
      createdAt: Date.now(),
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage("");
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (currentChat) {
      setMessages(currentChat.Messages);
    }
  }, [currentChat]);

  console.log(currentChat);

  return (
    <>
      <div className="messenger">
        <LeftNav />
        {uid ? (
          <>
            <div className="main">
              <div className="chatBoxWrapper">
                {currentChat ? (
                  <>
                    <div className="chatBoxTop">
                      {messages &&
                        messages.map((m) => (
                          <div ref={scrollRef}>
                            <Message message={m} own={m.userId === uid} />
                          </div>
                        ))}
                    </div>
                    <div className="chatBoxBottom">
                      <textarea
                        className="chatMessageInput"
                        placeholder="write something..."
                        onChange={(e) => setNewMessage(e.target.value)}
                        value={newMessage}
                      ></textarea>
                      <div className="button-container">
                        <button className="btn" onClick={handleSubmit}>
                          Send
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <span className="noConversationText">
                    Open a conversation to start a chat.
                  </span>
                )}
              </div>
            </div>
            <div className="right-side">
              <div className="right-side-container">
                <div className="chatMenuWrapper">
                  {!isEmpty(convList[0]) &&
                    convList.map((conversation) => (
                      <div onClick={() => setCurrentChat(conversation)}>
                        <Conversation
                          conversation={conversation}
                          currentUser={uid}
                          currentChat={currentChat}
                        />
                      </div>
                    ))}
                  {uid && <FriendsHint />}
                </div>
              </div>
            </div>
          </>
        ) : (
          <Navigate to="/" />
        )}
      </div>
    </>
  );
}
