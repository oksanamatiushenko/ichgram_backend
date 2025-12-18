import multer from "multer";
import path from "path";
import fs from "fs";
import { Request } from "express";

const rootUploadDir = path.join(process.cwd(), "uploads");

const getDestination = (req: Request, file: Express.Multer.File) => {
  if (file.fieldname === "avatar") {
    return "avatars";
  }

  if (file.fieldname === "image") {
    return "posts";
  }

  return "misc";
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = getDestination(req, file);
    const uploadPath = path.join(rootUploadDir, folder);

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },

  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${file.fieldname}-${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${ext}`;

    cb(null, filename);
  },
});

const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Only images allowed"));
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});


// import multer from "multer";
// import path from "path";
// import fs from "fs";

// const uploadDir = path.join(__dirname, "../../public/uploads");

// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// const storage = multer.diskStorage({
//   destination: (_req, _file, cb) => {
//     cb(null, uploadDir);
//   },
//   filename: (_req, file, cb) => {
//     const uniqueName = `${Date.now()}-${Math.round(
//       Math.random() * 1e9
//     )}${path.extname(file.originalname)}`;
//     cb(null, uniqueName);
//   },
// });

// export const upload = multer({ storage });


