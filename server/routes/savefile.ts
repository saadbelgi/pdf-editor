import { Request, Response, Router } from 'express';
import multer from 'multer';
import dataSource from '../database/dataSource';
import { User } from '../database/models/User';
import { SavedFile } from '../database/models/SavedFile';
import auth from '../utils/auth';
import path from 'path';

const router = Router();

const storage = multer.diskStorage({
  destination: path.resolve('./uploads'),
  filename(req, _, callback) {
    callback(null, req.user?.id + '-' + Date.now() + '.pdf');
  },
});

const upload = multer({ storage });

router.post(
  '/',
  auth,
  upload.single('file'),
  async (req: Request, res: Response) => {
    if (!req.file) {
      res.json({ success: false, message: 'No file sent' });
    } else {
      const file = new SavedFile();
      file.destinationFolder = req.file.destination;
      file.size = req.file.size;
      file.fileName = req.file.filename;
      file.originalName = req.file.originalname;
      file.owner = req.user as User;
      dataSource.getRepository(SavedFile).save([file]);
      res.json({ success: true, message: 'File uploaded successfully' });
    }
  }
);

export default router;
