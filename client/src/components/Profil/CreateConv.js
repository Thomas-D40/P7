import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { addConv, getConv } from "../../actions/conversations.actions";

const CreateConv = ({ idToDiscuss }) => {
  const userData = useSelector((state) => state.userReducer);
  const convData = useSelector((state) => state.convReducer);
  const dispatch = useDispatch();

  const handleWriting = () => {
    let noConv = true;
    convData.map((conv) => {
      if (conv.userId1 === idToDiscuss || conv.userId2 === idToDiscuss) {
        noConv = false;
      }
    });
    noConv &&
      dispatch(addConv(userData.id, idToDiscuss)).then(() =>
        dispatch(getConv(userData.id))
      );
    dispatch(getConv(userData.id, idToDiscuss));
  };

  return (
    <>
      <Link
        to={{
          pathname: "/messenger",
        }}
      >
        <button onClick={handleWriting}>Ecrire</button>
      </Link>
    </>
  );
};

export default CreateConv;
