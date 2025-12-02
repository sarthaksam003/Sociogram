// client/src/api/uploadFile.js
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "https://sociogram-backend-v2ax.onrender.com";

/**
 * Upload a File object. Returns response.data (expected { filename, url }).
 * If your upload needs auth token, pass token string as second param.
 */
export async function uploadFile(file, token = null) {
  if (!file) throw new Error("No file provided");

  const form = new FormData();
  form.append("file", file); // multer expects key "file"
  // if you want to preserve an original name you can append('name', file.name)

  const headers = { "Content-Type": "multipart/form-data" };
  if (token) headers.Authorization = `Bearer ${token}`;

  // prefer canonical images upload endpoint
  const url = `${API_BASE}/images/upload`;

  const res = await axios.post(url, form, { headers });
  return res.data; // { filename, url } expected
}

export default uploadFile;
