// client/src/components/ProfileCard/ProfileCard.jsx
import "./ProfileCard.css";
import Cover from "../../img/cover1.png";
import placeHolderProfilePic from "../../img/fallback-profile-pic.png";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const PF = process.env.REACT_APP_PUBLIC_FOLDER; // e.g. https://sociogram-backend-v2ax.onrender.com/images/

const ProfileCard = ({ location }) => {
  const { user } = useSelector((state) => state.authReducer.authData);
  const posts = useSelector((state) => state.postReducer.posts);

  const coverSrc = user.coverPicture ? PF + user.coverPicture : Cover;
  const profileSrc = user.profilePicture ? PF + user.profilePicture : placeHolderProfilePic;

  return (
    <div className="ProfileCard">
      <div className="ProfileImages">
        <img src={coverSrc} alt="CoverImage" style={{ maxHeight: "300px", objectFit: "cover" }} />
        <img src={profileSrc} style={{ background: "white", objectFit: "contain" }} alt="ProfileImage" />
      </div>
      <div className="ProfileName">
        <span>{user.firstname} {user.lastname}</span>
        <span>{user.worksAt ? user.worksAt : 'Write about yourself'}</span>
      </div>

      <div className="followStatus">
        <hr />
        <div>
          <div className="follow">
            <span>{Array.isArray(user.followers) ? user.followers.length : 0}</span>
            <span>Followers</span>
          </div>
          <div className="vl"></div>
          <div className="follow">
            <span>{Array.isArray(user.following) ? user.following.length : 0}</span>
            <span>Following</span>
          </div>
          {location === "profilePage" && (
            <>
              <div className="vl"></div>
              <div className="follow">
                <span>{posts.filter((post) => post.userId === user._id).length}</span>
                <span>Posts</span>
              </div>
            </>
          )}
        </div>
        <hr />
      </div>

      {location === "profilePage" ? "" : (
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
