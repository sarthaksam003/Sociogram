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

const API_BASE = process.env.REACT_APP_API_URL || "https://sociogram-backend-v2ax.onrender.com";
const PUBLIC = process.env.REACT_APP_PUBLIC_FOLDER || PUBLIC_FOLDER || `${API_BASE}/images/`;

const Post = ({ data }) => {
  const { user } = useSelector((state) => state.authReducer.authData);
  const [liked, setLiked] = useState(Array.isArray(data.likes) ? data.likes.includes(user._id) : false);
  const [likes, setLikes] = useState(Array.isArray(data.likes) ? data.likes.length : 0);

  // comments state holds objects like { commentor: <id>, cmnt: <text> }
  const [comments, setComments] = useState(Array.isArray(data.comments) ? data.comments.filter(Boolean) : []);
  const [commentText, setCommentText] = useState("");

  // poster is the post author user object (not a string)
  const [poster, setPoster] = useState(null);

  // commenter cache: { userId: userObject }
  const [commenterMap, setCommenterMap] = useState({});

  useEffect(() => {
    // fetch poster (author) object
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

    // sync comments when data changes
    setComments(Array.isArray(data.comments) ? data.comments.filter(Boolean) : []);
    fetchPoster();
  }, [data.userId, data.comments]);

  // fetch commenter details for any commenter IDs not in cache
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

      // optimistic UI update
      setComments(prev => [...prev, newComment]);
      // cache current user in commenterMap so UI can show name/avatar immediately
      setCommenterMap(prev => ({ ...prev, [user._id]: user }));
      setCommentText("");
    } catch (err) {
      console.error("Add comment failed!", err);
      // optional: show feedback to user
    }
  };

  const buildAvatarSrc = (profilePicture) => {
    if (!profilePicture) return placeHolderProfilePic;
    if (typeof profilePicture === "string" && profilePicture.startsWith("http")) return profilePicture;
    if (typeof profilePicture === "string" && profilePicture.startsWith("data:")) return profilePicture;
    return PUBLIC + profilePicture;
  };

  return (
    <div className="Post">
      <div className="detail">
        <span style={{ display: "flex", alignItems: "center" }}>
          <img
            src={buildAvatarSrc(poster?.profilePicture)}
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
          src={buildAvatarSrc(data.image)} // if data.image is a filename, PUBLIC will resolve; if full URL, it will work too
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
