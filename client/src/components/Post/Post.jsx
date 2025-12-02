// client/src/components/Post/Post.jsx
import React, { useState, useEffect } from "react";
import "./Post.css";
import Comment from "../../img/comment.png";
import Share from "../../img/share.png";
import Heart from "../../img/like.png";
import NotLike from "../../img/notlike.png";
import { likePost } from "../../api/PostsRequests";
import { useSelector } from "react-redux";
import axios from "axios";
import placeHolderProfilePic from "../../img/fallback-profile-pic.png";
import { PUBLIC_FOLDER } from '../../utils/config';

let API_BASE = process.env.REACT_APP_API_URL || "https://sociogram-backend-v2ax.onrender.com";

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


let API_BASE = process.env.REACT_APP_API_URL || "https://sociogram-backend-v2ax.onrender.com";
const PUBLIC = process.env.REACT_APP_PUBLIC_FOLDER || PUBLIC_FOLDER || `${API_BASE}/images/`;

const Post = ({ data }) => {
  const { user } = useSelector((state) => state.authReducer.authData);
  const [liked, setLiked] = useState(Array.isArray(data.likes) ? data.likes.includes(user._id) : false);
  const [likes, setLikes] = useState(Array.isArray(data.likes) ? data.likes.length : 0);

  const [comments, setComments] = useState(Array.isArray(data.comments) ? data.comments.filter(Boolean) : []);
  const [commentText, setCommentText] = useState("");

  const [poster, setPoster] = useState(null);
  const [commenterMap, setCommenterMap] = useState({});

  useEffect(() => {
    const fetchPoster = async () => {
      try {
        if (!data?.userId) return;
        const res = await axios.get(`${API_BASE}/user/${data.userId}`);
        setPoster(res.data);
      } catch (err) {
        console.error("fetchPoster error:", err);
        setPoster(null);
      }
    };

    setComments(Array.isArray(data.comments) ? data.comments.filter(Boolean) : []);
    fetchPoster();
  }, [data.userId, data.comments]);

  useEffect(() => {
    const ids = Array.from(new Set(comments.map(c => c?.commentor).filter(Boolean)));
    const idsToFetch = ids.filter(id => !commenterMap[id] && id !== user._id);

    if (idsToFetch.length === 0) return;

    const fetchers = idsToFetch.map(async (id) => {
      try {
        const res = await axios.get(`${API_BASE}/user/${id}`);
        return { id, userObj: res.data };
      } catch (err) {
        console.error("fetch commenter failed for", id, err);
        return null;
      }
    });

    (async () => {
      const results = await Promise.all(fetchers);
      const next = {};
      results.forEach(r => {
        if (r && r.userObj) next[r.id] = r.userObj;
      });
      if (Object.keys(next).length) setCommenterMap(prev => ({ ...prev, ...next }));
    })();
  }, [comments, commenterMap, user._id]);

  const handleLike = () => {
    likePost(data._id, user._id);
    setLiked(prev => !prev);
    setLikes(prev => (liked ? prev - 1 : prev + 1));
  };

  const addCommentHandler = async (e) => {
    e.preventDefault();
    const text = commentText?.trim();
    if (!text) return;

    const newComment = { commentor: user._id, cmnt: text };

    try {
      await axios.put(`${API_BASE}/posts/addcomment/${data._id}`, { comment: newComment });

      setComments(prev => [...prev, newComment]);
      setCommenterMap(prev => ({ ...prev, [user._id]: user }));
      setCommentText("");
    } catch (err) {
      console.error("Add comment failed!", err);
    }
  };

  const buildAvatarSrc = (profilePicture) => resolveImageUrl(profilePicture) || placeHolderProfilePic;

  return (
    <div className="Post">
      <div className="detail">
        <span style={{ display: "flex", alignItems: "center" }}>
          <img
            src={resolveImageUrl(poster?.profilePicture) || placeHolderProfilePic}
            alt="Profile"
            style={{ width: "3rem", height: "3rem", objectFit: "cover", borderRadius: "50%" }}
            onError={(e) => { if (e.currentTarget.src !== placeHolderProfilePic) e.currentTarget.src = placeHolderProfilePic; }}
          />
          <b style={{ margin: "0 1rem" }}>{poster ? `${poster.firstname} ${poster.lastname}` : "Unknown"}</b>
        </span>
      </div>

      <div className="detail">
        <span>{data.desc}</span>
      </div>

      {data.image ? (
        <img
          src={resolveImageUrl(data.image) || placeHolderProfilePic}
          alt=""
          style={{ objectFit: "contain", width: "100%", marginTop: "8px" }}
          onError={(e) => { if (e.currentTarget.src !== placeHolderProfilePic) e.currentTarget.src = placeHolderProfilePic; }}
        />
      ) : null}

      <div className="postReact">
        <img src={liked ? Heart : NotLike} alt="" style={{ cursor: "pointer" }} onClick={handleLike} />
        <img src={Comment} alt="" style={{ cursor: "pointer" }} />
        <img src={Share} alt="" />
      </div>

      <span style={{ color: "var(--gray)", fontSize: "12px" }}>{likes} likes</span>

      <div>
        <span style={{ color: "var(--gray)", fontSize: "12px" }}>
          {comments.length} {comments.length > 1 || comments.length === 0 ? "Comments" : "Comment"}
        </span>

        <div>
          <ul style={{ padding: 0, listStyle: "none", marginTop: 8 }}>
            {comments.filter(Boolean).map((item, idx) => {
              const commenter = item?.commentor === user._id ? user : (commenterMap[item?.commentor] || null);
              return (
                <li key={`${item?.commentor ?? 'anon'}-${idx}`} style={{ marginBottom: 8 }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <img
                      src={buildAvatarSrc(commenter?.profilePicture)}
                      alt="cmt-profile"
                      style={{ width: "3rem", height: "3rem", objectFit: "cover", borderRadius: "50%" }}
                      onError={(e) => { if (e.currentTarget.src !== placeHolderProfilePic) e.currentTarget.src = placeHolderProfilePic; }}
                    />
                    <div style={{ backgroundColor: "#F0F1F1", padding: "0.75rem 1rem", borderRadius: "1rem", width: "100%" }}>
                      <div style={{ fontWeight: 700, marginBottom: 6 }}>
                        {commenter ? `${commenter.firstname} ${commenter.lastname}` : (item?.commentor === user._id ? `${user.firstname} ${user.lastname}` : "Unknown")}
                      </div>
                      <div>{item?.cmnt ?? ""}</div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <form className="commentForm" onSubmit={addCommentHandler}>
          <input
            type="text"
            placeholder="Add a comment"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <button type="submit" className="commentFormButton button">Add comment</button>
        </form>
      </div>
    </div>
  );
};

export default Post;