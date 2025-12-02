import React from "react";
import { Link } from "react-router-dom";
import Logo from "../../img/fav.png";
import "./LogoSearch.css";
import { UilSearch } from "@iconscout/react-unicons";
const LogoSearch = () => {
  return (
    <div className="LogoSearch">
      <div>
        <Link to="../home" >
          <img src={Logo} alt="" style={{ width: "70px", height: "70px" }} />
        </Link>
      </div>
      <div className="Search">
        <input type="text" placeholder="#Explore" />
        <div className="s-icon">
          <UilSearch />
        </div>
      </div>
    </div>
  );
};

export default LogoSearch;
