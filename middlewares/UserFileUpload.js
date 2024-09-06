const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = `uploads/user/`;
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const name = (req.body.username || "untitled").replace(
      /[^a-zA-Z0-9]/g,
      "_"
    );
    cb(null, `${name}${Date.now()}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else {
    cb(new Error("Invalid file type, only images are allowed!"), false);
  }
};

const limits = {
  fileSize: 5 * 1024 * 1024, // 5 MB file size limit
};

const UserFileUpload = multer({ storage, fileFilter, limits });
module.exports = UserFileUpload;
