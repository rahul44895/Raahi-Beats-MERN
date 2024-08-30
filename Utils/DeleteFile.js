const fs = require('fs');

// Function to delete files
const deleteFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath); // Delete the file
      console.log(`File deleted: ${filePath}`);
    } else {
      console.log(`File not found: ${filePath}`);
    }
  } catch (err) {
    console.error(`Error deleting file: ${filePath}`, err);
  }
};

// Function to delete multiple files based on the field names
const deleteFiles = (files) => {
  if (files) {
    if (files["coverImage"]) {
      files["coverImage"].forEach((file) => deleteFile(file.path));
    }
    if (files["filePath"]) {
      files["filePath"].forEach((file) => deleteFile(file.path));
    }
  }
};

module.exports = deleteFiles;
