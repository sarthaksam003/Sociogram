// client/src/api/uploadFile.js  (replace existing file)
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "https://sociogram-backend-v2ax.onrender.com";

export async function uploadFile(file, token = null) {
  if (!file) throw new Error("No file provided");
  const form = new FormData();
  form.append("file", file);

  const headers = { "Content-Type": "multipart/form-data" };
  if (token) headers.Authorization = `Bearer ${token}`;

  // try canonical route first, fallback to legacy
  try {
    const res = await axios.post(`${API_BASE}/images/upload`, form, { headers });
    return res.data; // { filename, url } expected
  } catch (err) {
    // if canonical endpoint not found, try legacy /upload
    if (err.response && err.response.status === 404) {
      const res2 = await axios.post(`${API_BASE}/upload`, form, { headers });
      return res2.data;
    }
    // otherwise rethrow
    throw err;
  }
}

export default uploadFile;
