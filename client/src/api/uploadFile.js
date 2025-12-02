// client/src/api/uploadFile.js
import axios from "axios";
const API_BASE = process.env.REACT_APP_API_URL || "https://sociogram-backend-v2ax.onrender.com";

/**
 * Uploads a single file to the server's GridFS / images upload route.
 * Returns the server JSON, expected shape: { filename, fileId }
 * If your server requires Authorization, add headers (see note below).
 */
export async function uploadFile(file, uploaderId = null) {
    const form = new FormData();
    form.append("file", file);
    if (uploaderId) form.append("uploader", uploaderId);

    const token = JSON.parse(localStorage.getItem("profile"))?.token;
    const res = await axios.post(`${API_BASE}/images/upload`, form, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
    });

    return res.data;
}
