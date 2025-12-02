// import React from "react";
import "./ProfileCard.css";
import Cover from "../../img/cover1.png";
import Profile from "../../img/profileImg.jpg";
import placeHolderProfilePic from "../../img/fallback-profile-pic.png"
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { PUBLIC_FOLDER } from '../../utils/config';

const API_BASE = process.env.REACT_APP_API_URL || "https://sociogram-backend-v2ax.onrender.com";

function resolveImageUrl(src) {
  if (!src) return null;
  try {
    const s = String(src);
    if (/^https?:\/\//.test(s)) {
      if (s.includes('localhost')) {
        const api = new URL(API_BASE);
        // extract path after host
        const parts = s.split('/').slice(3);
        const path = parts.join('/');
        return api.origin + '/' + path;
      }
      return s;
    }
    const PUBLIC = process.env.REACT_APP_PUBLIC_FOLDER || (API_BASE + '/images/');
    return PUBLIC + src;
  } catch (e) {
    return src;
  }
}


const ProfileCard = ({ location }) => {
  const { user } = useSelector((state) => state.authReducer.authData);
  const posts = useSelector((state) => state.postReducer.posts)
  const serverPublic = process.env.REACT_APP_PUBLIC_FOLDER;

  return (
    <div className="ProfileCard">
      <div className="ProfileImages">
        <img src={ user.coverPicture ? resolveImageUrl(user.coverPicture) : Cover } alt="CoverImage"
          style={{maxHeight:"300px",objectFit: "cover" }}
        />
        <img
          src={
            user.profilePicture
              ? PUBLIC_FOLDER + user.profilePicture
              :
              placeHolderProfilePic
          }
          style={{ background: "white", objectFit: "contain" }}
          alt="ProfileImage"
        />
      </div>
      <div className="ProfileName">
        <span>{user.firstname} {user.lastname}</span>
        <span>{user.worksAt ? user.worksAt : 'Write about yourself'}</span>
      </div>

      <div className="followStatus">
        <hr />
        <div>
          <div className="follow">
            <span>{user.followers.length}</span>
            <span>Followers</span>
          </div>
          <div className="vl"></div>
          <div className="follow">
            <span>{user.following.length}</span>
            <span>Following</span>
          </div>
          {/* for profilepage */}
          {location === "profilePage" && (
            <>
              <div className="vl"></div>
              <div className="follow">
                <span>{
                  posts.filter((post) => post.userId === user._id).length
                }</span>
                <span>Posts</span>
              </div>{" "}
            </>
          )}
        </div>
        <hr />
      </div>

      {location === "profilePage" ? (
        ""
      ) : (
        <span>
          <Link to={`/profile/${user._id}`} style={{ textDecoration: "none", color: "#AA00FF" }}>
            My Profile
          </Link>
        </span>
      )}
    </div>
  );
};

export default ProfileCard;