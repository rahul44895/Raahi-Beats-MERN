const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configure storage options for Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = "";
    const title = (req.body.title || "untitled").replace(/[^a-zA-Z0-9]/g, "_");

    // Determine the upload path based on the field name
    if (file.fieldname === "coverImage") {
      uploadPath = `uploads/songs/${title}`;
    } else if (file.fieldname === "filePath") {
      uploadPath = `uploads/songs/${title}/`;
    } else if (file.fieldname === "artistImage") {
      uploadPath = `uploads/artists/${title}/`;
    } else {
      // Handle unexpected field names
      return cb(new Error("Invalid field name"), null);
    }

    // Ensure the directory exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Generate a unique filename with timestamp
    const title = (req.body.title || "untitled").replace(/[^a-zA-Z0-9]/g, "_");
    const uniqueSuffix =
      Date.now() + Math.random().toString(36).substring(2, 15);
    cb(null, `${title}_${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

// Initialize Multer with storage configuration
const upload = multer({ storage: storage });

module.exports = upload;
