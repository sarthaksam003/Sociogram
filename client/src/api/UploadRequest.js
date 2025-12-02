// client/src/api/UploadRequest.js
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "https://sociogram-backend-v2ax.onrender.com";

// upload formData to server. Returns server response (JSON { filename, url } expected)
export const uploadImage = async (formData) => {
  // formData should be a FormData instance (key: "file")
  const token = JSON.parse(localStorage.getItem("profile"))?.token;
  const headers = { "Content-Type": "multipart/form-data" };
  if (token) headers.Authorization = `Bearer ${token}`;

  // Try canonical images upload route first
  try {
    const res = await axios.post(`${API_BASE}/images/upload`, formData, { headers });
    return res;
  } catch (err) {
    // If canonical fails with 404, fall back to legacy /upload (keeps compatibility)
    if (err.response && err.response.status === 404) {
      return axios.post(`${API_BASE}/upload`, formData, { headers });
    }
    throw err;
  }
};

// create a new post (payload is plain JSON: { userId, desc, image })
export const uploadPost = async (payload) => {
  const token = JSON.parse(localStorage.getItem("profile"))?.token;
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  return axios.post(`${API_BASE}/posts`, payload, { headers });
};
export default { uploadImage, uploadPost };
