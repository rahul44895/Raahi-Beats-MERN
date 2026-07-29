const fs = require("fs/promises");

// Best-effort removal of a file left behind by a failed multipart request.
//
// Why it never throws: this only ever runs while the app is already handling
// some other failure. Letting a cleanup problem propagate would replace the
// real error the client needs to see with a confusing filesystem error.
const removeUploadedFile = async (file) => {
  if (!file?.path) return;
  try {
    await fs.rm(file.path, { force: true });
  } catch (error) {
    console.error(`Failed to clean up upload at ${file.path}:`, error.message);
  }
};

// Same, for multer's `.fields()` shape: { fieldName: [file, ...] }.
//
// Deliberately flattens every field rather than checking known field names.
// Utils/DeleteFile.js (still used by the song/artist routes) chains
// `if (coverImage) ... else if (filePath) ...`, so when a song upload fails
// after both files landed it deletes only the cover image and orphans the
// much larger audio file. Iterating the values has no such gap.
const removeUploadedFiles = async (files) => {
  if (!files) return;
  const all = Object.values(files).flat();
  await Promise.all(all.map(removeUploadedFile));
};

module.exports = { removeUploadedFile, removeUploadedFiles };
