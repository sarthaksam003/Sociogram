import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getUser } from "../../api/UserRequests";

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

const Conversation = ({ data, currentUser, online }) => {
  const [userData, setUserData] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const userId = data.members.find((id) => id !== currentUser);
    const getUserData = async () => {
      try {
        const { data } = await getUser(userId);
        setUserData(data);
        dispatch({ type: "SAVE_USER", data: data });
      } catch (error) {
        console.log(error);
      }
    };

    getUserData();
  }, [currentUser, data, dispatch]);
  return (
    <>
      <div className="follower conversation">
        <div>
          {online && <div className="online-dot"></div>}
          <img
            src={
              userData?.profilePicture
                ? process.env.REACT_APP_PUBLIC_FOLDER + userData.profilePicture
                : process.env.REACT_APP_PUBLIC_FOLDER + "defaultProfile.png"
            }
            alt="Profile"
            className="followerImage"
            style={{ width: "50px", height: "50px" }}
          />
          <div className="name" style={{ fontSize: "0.8rem" }}>
            <span>
              {userData?.firstname} {userData?.lastname}
            </span>
            <span style={{ color: online ? "#51e200" : "" }}>
              {online ? "Online" : "Offline"}
            </span>
          </div>
        </div>
      </div>
      <hr style={{ width: "85%", border: "0.1px solid #ececec" }} />
    </>
  );
};

export default Conversation;