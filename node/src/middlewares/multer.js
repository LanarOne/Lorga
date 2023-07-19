import multer from "multer";
import * as path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const fileExtension = path.extname(file.originalname);
    const modifiedName = `${req.body.name}_${Date.now()}${fileExtension}`;
    cb(null, modifiedName);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith("image/png") ||
    file.mimetype.startsWith("image/jpeg") ||
    file.mimetype.startsWith("image/webp")
  ) {
    cb(null, true);
  } else {
    cb(new Error(`Only image files are allowed`), false);
  }
};

export const upload = multer({ storage: storage, fileFilter: fileFilter });
