// client/src/components/PostShare/PostShare.jsx
import React, { useState, useRef } from "react";
import "./PostShare.css";
import { UilScenery } from "@iconscout/react-unicons";
import { UilPlayCircle } from "@iconscout/react-unicons";
import { UilLocationPoint } from "@iconscout/react-unicons";
import { UilSchedule } from "@iconscout/react-unicons";
import { UilTimes } from "@iconscout/react-unicons";
import { useDispatch, useSelector } from "react-redux";
import { uploadPost } from "../../actions/UploadAction";
import placeHolderProfilePic from "../../img/fallback-profile-pic.png";
import { uploadFile } from "../../api/uploadFile";

const PF = process.env.REACT_APP_PUBLIC_FOLDER;

const PostShare = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.authReducer.authData);
  const loading = useSelector((state) => state.postReducer.uploading);
  const [image, setImage] = useState(null);
  const desc = useRef();

  // handle Image Change
  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]);
    }
  };

  const imageRef = useRef();

  // handle post upload
  const handleUpload = async (e) => {
    e.preventDefault();

    const newPost = {
      userId: user._id,
      desc: desc.current.value,
    };

    try {
      if (image) {
        const token = JSON.parse(localStorage.getItem("profile"))?.token;
        const uploadRes = await uploadFile(image, token); // { filename, url }
        newPost.image = uploadRes.filename;
      }

      dispatch(uploadPost(newPost));
      resetShare();
    } catch (err) {
      console.error("Error uploading/creating post:", err);
    }
  };

  // Reset Post Share
  const resetShare = () => {
    setImage(null);
    desc.current.value = "";
  };
  return (
    <div className="PostShare">
      <img
        src={user.profilePicture ? PF + user.profilePicture : placeHolderProfilePic}
        alt="Profile"
      />
      <div>
        <input type="text" placeholder="What's happening?" required ref={desc} />
        <div className="postOptions">
          <div className="option" style={{ color: "var(--photo)" }} onClick={() => imageRef.current.click()}>
            <UilScenery />
            Photo
          </div>

          <div className="option" style={{ color: "var(--video)" }}>
            <UilPlayCircle />
            Video
          </div>
          <div className="option location" style={{ color: "var(--location)" }}>
            <UilLocationPoint />
            Location
          </div>
          <div className="option schedule" style={{ color: "var(--shedule)" }}>
            <UilSchedule />
            Schedule
          </div>
          <button className="button ps-button" onClick={handleUpload} disabled={loading}>
            {loading ? "uploading" : "Share"}
          </button>

          <div style={{ display: "none" }}>
            <input type="file" ref={imageRef} onChange={onImageChange} style={{ width: "100%", height: "100%" }} />
          </div>
        </div>

        {image && (
          <div className="previewImage">
            <UilTimes onClick={() => setImage(null)} />
            <img src={URL.createObjectURL(image)} alt="preview" />
          </div>
        )}
      </div>
    </div>
  );
};

export default PostShare;
