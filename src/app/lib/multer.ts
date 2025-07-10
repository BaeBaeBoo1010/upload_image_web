import multer from "multer";
import path from "path";

// Lưu file tạm vào thư mục /tmp
const storage = multer.diskStorage({
  destination: "/tmp",
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});

export const upload = multer({ storage });
