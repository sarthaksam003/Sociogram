import React, { useState } from "react";
import { Modal, useMantineTheme } from "@mantine/core";
import "./ProfileModal.css";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { updateUser } from "../../actions/UserAction";
import { uploadFile } from "../../api/uploadFile";   // IMPORTANT

const ProfileModal = ({ modalOpened, setModalOpened, data }) => {
  const theme = useMantineTheme();

  const { password, ...other } = data;
  const [formData, setFormData] = useState(other);

  const [profileImage, setProfileImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

  const dispatch = useDispatch();
  const param = useParams();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];

      if (event.target.name === "profileImage") {
        setProfileImage(img);
      } else {
        setCoverImage(img);
      }
    }
  };

  // ---------- FIXED SUBMISSION ----------
  const handleSubmit = async (e) => {
    e.preventDefault();

    let userData = { ...formData };

    try {
      const token = JSON.parse(localStorage.getItem("profile"))?.token;

      // upload profile image if selected
      if (profileImage) {
        const res = await uploadFile(profileImage, token);
        userData.profilePicture = res.filename; // store filename in DB
      }

      // upload cover image if selected
      if (coverImage) {
        const res = await uploadFile(coverImage, token);
        userData.coverPicture = res.filename;
      }

      // update db user
      dispatch(updateUser(param.id, userData));

      setModalOpened(false);
    } catch (err) {
      console.error("Profile update failed:", err);
    }
  };

  return (
    <Modal
      overlayColor={
        theme.colorScheme === "dark"
          ? theme.colors.dark[9]
          : theme.colors.gray[2]
      }
      overlayOpacity={0.55}
      overlayBlur={3}
      size="55%"
      opened={modalOpened}
      onClose={() => setModalOpened(false)}
    >
      <form className="infoForm" onSubmit={handleSubmit}>
        <h3>Your Info</h3>

        <div>
          <input
            value={formData.firstname}
            onChange={handleChange}
            type="text"
            placeholder="First Name"
            name="firstname"
            className="infoInput"
          />

          <input
            value={formData.lastname}
            onChange={handleChange}
            type="text"
            placeholder="Last Name"
            name="lastname"
            className="infoInput"
          />
        </div>

        <div>
          <input
            value={formData.worksAt}
            onChange={handleChange}
            type="text"
            placeholder="Works at"
            name="worksAt"
            className="infoInput"
          />
        </div>

        <div>
          <input
            value={formData.livesIn}
            onChange={handleChange}
            type="text"
            placeholder="Lives in"
            name="livesIn"
            className="infoInput"
          />

          <input
            value={formData.country}
            onChange={handleChange}
            type="text"
            placeholder="Country"
            name="country"
            className="infoInput"
          />
        </div>

        <div>
          <input
            value={formData.relationship}
            onChange={handleChange}
            type="text"
            className="infoInput"
            placeholder="Relationship status"
            name="relationship"
          />
        </div>

        <div>
          Profile image:
          <input type="file" name="profileImage" onChange={onImageChange} />

          Cover image:
          <input type="file" name="coverImage" onChange={onImageChange} />
        </div>

        <button className="button infoButton" type="submit">
          Update
        </button>
      </form>
    </Modal>
  );
};

export default ProfileModal;
