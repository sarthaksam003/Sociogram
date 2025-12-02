// client/src/components/User/User.jsx
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { followUser, unfollowUser } from "../../actions/UserAction";
import placeHolderProfilePic from "../../img/fallback-profile-pic.png";
import { PUBLIC_FOLDER as CONFIG_PUBLIC_FOLDER } from '../../utils/config';

// prefer explicit env var, then config export, then empty string
const PUBLIC_FOLDER = process.env.REACT_APP_PUBLIC_FOLDER || CONFIG_PUBLIC_FOLDER || '';

const User = ({ person, mode }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.authReducer.authData);

  // guard if person.followers is undefined
  const initiallyFollowing = Array.isArray(person?.followers) ? person.followers.includes(user._id) : false;
  const [following, setFollowing] = useState(initiallyFollowing);

  const handleFollow = () => {
    if (following) {
      dispatch(unfollowUser(person._id, user));
    } else {
      dispatch(followUser(person._id, user));
    }
    setFollowing((prev) => !prev);
  };

  const buildAvatarSrc = (profilePicture) => {
    if (!profilePicture) return placeHolderProfilePic;
    if (typeof profilePicture === "string" && (profilePicture.startsWith("http") || profilePicture.startsWith("data:"))) return profilePicture;
    return PUBLIC_FOLDER + profilePicture;
  };

  return (
    <div className={`follower ${mode === 'suggestion' ? 'suggestion-mode' : ''}`} style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <img
        src={buildAvatarSrc(person?.profilePicture)}
        alt={`${person?.firstname ?? ''} ${person?.lastname ?? ''}`}
        style={{ width: 50, height: 50, borderRadius: "50%", objectFit: "cover" }}
        onError={(e) => {
          if (e.currentTarget.src !== placeHolderProfilePic) {
            e.currentTarget.src = placeHolderProfilePic;
          }
        }}
      />
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700 }}>{person?.firstname} {person?.lastname}</div>
        {/* <div style={{ fontSize: 12, color: "var(--gray)" }}>{person?.worksAt || "Write about yourself"}</div> */}
      </div>

      <button
        className={following ? "button fc-button UnfollowButton" : "button fc-button"}
        onClick={handleFollow}
      >
        {following ? "Unfollow" : "Follow"}
      </button>
    </div>
  );
};

export default User;
