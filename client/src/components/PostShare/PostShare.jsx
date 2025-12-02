import React, { useState, useRef } from "react";
import "./PostShare.css";
import { UilScenery } from "@iconscout/react-unicons";
import { UilPlayCircle } from "@iconscout/react-unicons";
import { UilLocationPoint } from "@iconscout/react-unicons";
import { UilSchedule } from "@iconscout/react-unicons";
import { UilTimes } from "@iconscout/react-unicons";
import { useDispatch, useSelector } from "react-redux";
import { uploadImage, uploadPost } from "../../actions/UploadAction";
import placeHolderProfilePic from "../../img/fallback-profile-pic.png"
import { PUBLIC_FOLDER } from '../../utils/config';
import { uploadFile } from "../../api/uploadFile";

const PostShare = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.authReducer.authData);
  const loading = useSelector((state) => state.postReducer.uploading);
  const [image, setImage] = useState(placeHolderProfilePic);
  const desc = useRef();
  const serverPublic = process.env.REACT_APP_PUBLIC_FOLDER;

  // handle Image Change
  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];
      setImage(img);
    }
  };

  const imageRef = useRef();

  // handle post upload
  // const handleUpload = async (e) => {
  //   e.preventDefault();

  //   //post data
  //   const newPost = {
  //     userId: user._id,
  //     desc: desc.current.value,
  //   };

  //   // if there is an image with post
  //   if (image) {
  //     const data = new FormData();
  //     const fileName = Date.now() + image.name;
  //     data.append("name", fileName);
  //     data.append("file", image);
  //     newPost.image = fileName;
  //     try {
  //       dispatch(uploadImage(data));
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   }
  //   dispatch(uploadPost(newPost));
  //   resetShare();
  // };


  // handle post upload
  const handleUpload = async (e) => {
    e.preventDefault();

    const newPost = {
      userId: user._id,
      desc: desc.current.value,
    };

    try {
      if (image) {
        // optional: pass token if your upload route requires auth
        const token = JSON.parse(localStorage.getItem("profile"))?.token;
        const uploadRes = await uploadFile(image, token);
        // server returns { filename, url }
        newPost.image = uploadRes.filename; // store this in DB
      }

      // now create post (your existing Redux action)
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
        src={
          user.profilePicture
            ? PUBLIC_FOLDER + user.profilePicture
            : placeHolderProfilePic
        }
        alt="Profile"
      />
      <div>
        <input
          type="text"
          placeholder="What's happening?"
          required
          ref={desc}
        />
        <div className="postOptions">
          <div
            className="option"
            style={{ color: "var(--photo)" }}
            onClick={() => imageRef.current.click()}
          >
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
          <button
            className="button ps-button"
            onClick={handleUpload}
            disabled={loading}
          >
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
