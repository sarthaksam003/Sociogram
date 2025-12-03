// client/src/api/uploadFile.js
import axios from "axios";

const API_BASE =
  process.env.REACT_APP_API_URL ||
  "https://sociogram-backend-v2ax.onrender.com";

export async function uploadFile(file, token = null) {
  if (!file) throw new Error("No file provided");

  const form = new FormData();
  form.append("file", file);

  const headers = { "Content-Type": "multipart/form-data" };
  if (token) headers.Authorization = `Bearer ${token}`;

  // ONLY use the working endpoint
  const res = await axios.post(`${API_BASE}/images/upload`, form, { headers });

  return res.data; // { filename, url }
}

export default uploadFile;
