import { mkdirSync } from 'fs';
import multer from 'multer';
import path from 'path';

// Prerequisites: Create the uploads directory before running the server
// Make sure the uploads directory is in the .gitignore file
const dirname = path.resolve();
const uploadPath = path.join(dirname, 'uploads');
mkdirSync(uploadPath, { recursive: true });

const uploadStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
})

const upload = multer({
  storage: uploadStorageEngine
});

export {
  uploadPath,
  upload
}