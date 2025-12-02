import React, { useEffect } from "react";
import PostSide from "../../components/PostSide/PostSide";
import ProfileCard from "../../components/ProfileCard/ProfileCard";
import ProfileLeft from "../../components/ProfileLeft/ProfileLeft";
import RightSide from "../../components/RightSide/RightSide";
import "./Profile.css";
const Profile = () => {
  useEffect(() => {
    document.title = `Sociogram : Profile`;
  }, []);

  return (
    <div className="">
      <div className="Profile profile-pc">
        <div>
          <ProfileLeft />
        </div>
        <div className="Profile-center">
          <ProfileCard location="profilePage" />
          <PostSide />
        </div>
        <RightSide />
      </div>
      <div className="Profile profile-mob">
        <div>
          <ProfileLeft />
        </div>
        <div className="Profile-center">
          <ProfileCard location="profilePage" />
          <PostSide />
        </div>
        <RightSide />
      </div>
    </div>
  );
};

export default Profile;
