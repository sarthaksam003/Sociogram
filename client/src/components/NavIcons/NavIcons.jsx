import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../actions/AuthActions";

// import Home from "../../img/home.svg";
// import dark from "../../img/dark.svg";
// import Comment from "../../img/comment.png";
import {
  UilSetting,
  UilEstate,
  UilMoon,
  UilSun,
  UilCommentAltDots,
} from "@iconscout/react-unicons";
import { Link } from "react-router-dom";
import { useState } from "react";
const NavIcons = () => {
  const dispatch = useDispatch()
  const [mode, setMode] = useState(false);
  const handleLogOut = () => {
    dispatch(logout())
  }
  return (
    <div className="navIcons">
      <Link to="../home">
        <UilEstate style={{ color: mode ? "white" : "#2C344F" }} alt="Home" />
      </Link>
      {mode ? (
        <UilSun
          style={{ cursor: "pointer", color: "white" }}
          onClick={() => {
            setMode(false);
            document.getElementById("App").classList.remove("App-dark");
            document.getElementById("App").classList.add("App");
          }}
        />
      ) : (
        <UilMoon
          style={{ cursor: "pointer" }}
          onClick={() => {
            setMode(true);
            document.getElementById("App").classList.remove("App");
            document.getElementById("App").classList.add("App-dark");
          }}
        />
      )}
      <Link to="../chat">
        {/* <img src={Comment} alt="" /> */}
        <UilCommentAltDots
          style={{ cursor: "pointer", color: mode ? "white" : "#2C344F" }}
        />
      </Link>
      <div className="button logout-button"
        style={{ cursor: "pointer", color: mode ? "white" : "#2C344F", color: "white", padding: "0.3rem 0.6rem", borderRadius: "0.5rem", backgroundColor: "#f1356d" }}
        onClick={handleLogOut}
      >Logout</div>
    </div>
  );
};

export default NavIcons;
