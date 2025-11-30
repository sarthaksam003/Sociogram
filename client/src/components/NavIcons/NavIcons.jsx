import React from "react";

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
  const [mode, setMode] = useState(false);
  return (
    <div className="navIcons">
      <Link to="../home">
        <UilEstate style={{ color: mode ? "white" : "#2C344F" }} alt="Home"/>
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
      <UilSetting
        style={{ cursor: "pointer", color: mode ? "white" : "#2C344F" }}
      />
      <Link to="../chat">
        {/* <img src={Comment} alt="" /> */}
        <UilCommentAltDots
          style={{ cursor: "pointer", color: mode ? "white" : "#2C344F" }}
        />
      </Link>
    </div>
  );
};

export default NavIcons;
