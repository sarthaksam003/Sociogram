// server/routes/gridfs.js
import express from "express";
import multer from "multer";
import mongoose from "mongoose";
import { Readable } from "stream";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // store file in memory then stream to GridFS

// gridfs bucket reference will be set after mongoose connects
let gfsBucket = null;
const initGrid = () => {
  if (!mongoose.connection.db) {
    throw new Error("mongoose not connected yet");
  }
  gfsBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: "images",
  });
};

// Upload endpoint: accepts form-data key "file"
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!gfsBucket) initGrid();

    if (!req.file || !req.file.buffer) return res.status(400).json({ msg: "No file" });

    const fileName = req.file.originalname; // you can prefix with user id or unique token if needed
    const readStream = Readable.from(req.file.buffer);

    const uploadStream = gfsBucket.openUploadStream(fileName, {
      contentType: req.file.mimetype,
      metadata: { uploadedAt: new Date() },
    });

    readStream.pipe(uploadStream)
      .on("error", (err) => {
        console.error("GridFS upload error:", err);
        res.status(500).json({ msg: "Upload failed" });
      })
      .on("finish", () => {
        // uploadStream.id is the ObjectId of the stored file
        return res.status(200).json({ fileId: uploadStream.id.toString(), filename: fileName });
      });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Download endpoint: by filename
router.get("/:filename", async (req, res) => {
  try {
    if (!gfsBucket) initGrid();
    const filename = req.params.filename;

    // find file by filename (if multiple exist, it returns the first)
    const files = await mongoose.connection.db.collection("images.files").find({ filename }).toArray();
    if (!files || files.length === 0) return res.status(404).send("File not found");

    const fileDoc = files[0];
    res.set("Content-Type", fileDoc.contentType || "application/octet-stream");
    const downloadStream = gfsBucket.openDownloadStreamByName(filename);
    downloadStream.pipe(res).on("error", (err) => {
      console.error("GridFS download error:", err);
      res.sendStatus(500);
    });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// Optional: download by id route
router.get("/id/:id", async (req, res) => {
  try {
    if (!gfsBucket) initGrid();
    const ObjectId = mongoose.Types.ObjectId;
    const id = new ObjectId(req.params.id);
    const files = await mongoose.connection.db.collection("images.files").find({ _id: id }).toArray();
    if (!files || files.length === 0) return res.status(404).send("File not found");
    const fileDoc = files[0];
    res.set("Content-Type", fileDoc.contentType || "application/octet-stream");
    const downloadStream = gfsBucket.openDownloadStream(id);
    downloadStream.pipe(res);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

export default router;
