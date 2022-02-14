import React, { useContext } from "react";
import axios from "axios";
import cookie from "js-cookie";
import { UidContext } from "../AppContext";

const DeleteUser = () => {
  const uid = useContext(UidContext);

  const removeCookie = (key) => {
    if (window !== "undefined") {
      cookie.remove(key, { expires: 1 });
    }
  };

  const deleteUser = async () => {
    console.log("On arrive ici");
    await axios({
      method: "delete",
      url: `${process.env.REACT_APP_API_URL}/api/users/${uid}`,
      withCredentials: true,
    })
      .then(() => removeCookie("jwt"))
      .catch((err) => console.log(err));

    window.location = "/";
  };

  return (
    <button
      onClick={() => {
        if (window.confirm("Voulez-vous supprimer votre profil ?")) {
          deleteUser();
        }
      }}
    >
      Supprimer votre profil
    </button>
  );
};

export default DeleteUser;
