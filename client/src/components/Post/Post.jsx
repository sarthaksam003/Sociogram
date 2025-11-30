import React, { useState } from "react";
import "./Post.css";
import Comment from "../../img/comment.png";
import Share from "../../img/share.png";
import Heart from "../../img/like.png";
import NotLike from "../../img/notlike.png";
import { likePost } from "../../api/PostsRequests";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import axios from "axios";

const Post = ({ data }) => {
  const { user } = useSelector((state) => state.authReducer.authData);
  const [liked, setLiked] = useState(data.likes.includes(user._id));
  const [likes, setLikes] = useState(data.likes.length);
  const [commentToPost, setCommentToPost] = useState("");
  // const [totalComments, setTotalComments] = useState(data.comments.length);
  // const [comments, setComments] = useState(data.comments);
  const [poster, setPoster] = useState("");
  const handleLike = () => {
    likePost(data._id, user._id);
    setLiked((prev) => !prev);
    liked ? setLikes((prev) => prev - 1) : setLikes((prev) => prev + 1);
  };
  useEffect(() => {
    const id = data.userId;
    const response = axios
      .get(`https://sociogram-backend-v2ax.onrender.com/user/${id}`)
      .then(function (response) {
        setPoster(`${response.data.firstname} ${response.data.lastname}`);
      })
      .catch(function (error) {
        console.log(error);
      });
    console.log(response);
  }, [data.userId]);

  const addCommentHandler = (e) => {
    e.preventDefault();
    console.log(user._id);
    console.log(e.target[0].value);
    setCommentToPost(`{commentor: ${user._id}, cmnt: ${e.target[0].value}}`);
    const response = axios
      .put(
        `https://sociogram-backend-v2ax.onrender.com/posts/addcomment/${data._id}`,
        commentToPost
      )
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
    console.log(response);
  };
  console.log(data);
  return (
    <div className="Post">
      <div className="detail">
        <span>
          <b>{poster} </b>
        </span>
      </div>
      <img
        src={data.image ? process.env.REACT_APP_PUBLIC_FOLDER + data.image : ""}
        alt=""
      />
      <div className="detail">
        <span>{data.desc}</span>
      </div>
      <div className="postReact">
        <img
          src={liked ? Heart : NotLike}
          alt=""
          style={{ cursor: "pointer" }}
          onClick={handleLike}
        />
        <img src={Comment} alt="" style={{ cursor: "pointer" }} />
        <img src={Share} alt="" />
      </div>

      <span style={{ color: "var(--gray)", fontSize: "12px" }}>
        {likes} likes
      </span>
      <div>
        <span style={{ color: "var(--gray)", fontSize: "12px" }}>
          {data.comments.length} Comments
        </span>
        <ul>
          {data.comments.map((item) => {
            return <li>{item.cmnt}</li>;
          })}
        </ul>
        <form className="commentForm" onSubmit={addCommentHandler}>
          <input type="text" placeholder="Add a comment" />
          <button type="submit" className="commentFormButton button">
            Add comment
          </button>
        </form>
      </div>
    </div>
  );
};

export default Post;
