// server/routes/gridfs.js
import express from "express";
import multer from "multer";
import mongoose from "mongoose";
import { Readable } from "stream";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // hold file in memory, then stream to GridFS

let gfsBucket = null;
function initGrid() {
  if (!mongoose.connection.db) throw new Error("mongoose not connected");
  if (!gfsBucket) {
    gfsBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: "images",
    });
  }
}

// POST /images/upload
// Expects form-data with key "file"
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    initGrid();
    if (!req.file || !req.file.buffer) return res.status(400).json({ error: "No file uploaded" });

    // choose identifier: use a unique filename OR return the upload id
    // We will upload using originalname prefixed with timestamp to avoid collisions
    const filename = `${Date.now()}-${req.file.originalname}`;
    const readStream = Readable.from(req.file.buffer);

    const uploadStream = gfsBucket.openUploadStream(filename, {
      contentType: req.file.mimetype,
      metadata: { uploadedAt: new Date(), uploader: req.body.uploader || null },
    });

    readStream.pipe(uploadStream)
      .on("error", (err) => {
        console.error("GridFS upload error:", err);
        res.status(500).json({ error: "Upload failed" });
      })
      .on("finish", () => {
        // return both filename and fileId (ObjectId) — store whichever you prefer in Mongo documents
        res.status(200).json({ filename, fileId: uploadStream.id.toString() });
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /images/:filename  -> stream by name
router.get("/:filename", async (req, res) => {
  try {
    initGrid();
    const filename = req.params.filename;
    // find file document
    const files = await mongoose.connection.db.collection("images.files").find({ filename }).toArray();
    if (!files || files.length === 0) return res.status(404).send("File not found");

    const fileDoc = files[0];
    res.set("Content-Type", fileDoc.contentType || "application/octet-stream");
    gfsBucket.openDownloadStreamByName(filename).pipe(res).on("error", (err) => {
      console.error("GridFS read error", err);
      res.sendStatus(500);
    });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// GET /images/id/:id -> stream by id
router.get("/id/:id", async (req, res) => {
  try {
    initGrid();
    const id = new mongoose.Types.ObjectId(req.params.id);
    const files = await mongoose.connection.db.collection("images.files").find({ _id: id }).toArray();
    if (!files || files.length === 0) return res.status(404).send("File not found");
    const fileDoc = files[0];
    res.set("Content-Type", fileDoc.contentType || "application/octet-stream");
    gfsBucket.openDownloadStream(id).pipe(res);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

export default router;
