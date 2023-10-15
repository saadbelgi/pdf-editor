import { Request, Response, Router } from 'express';
import dataSource from '../database/dataSource';
import { SavedFile } from '../database/models/SavedFile';
import auth from '../utils/auth';
import path from 'path';
import fs from 'fs';

const router = Router();

router.post('/', auth, async (req: Request, res: Response) => {
  const { fileId }: { fileId: number } = req.body;
  const file = await dataSource
    .getRepository(SavedFile)
    .findOne({ where: { id: fileId }, relations: { owner: true } });
  if (!file) {
    res.json({ success: false, message: "File with given ID doesn't exist" });
  } else if (file.owner.id !== req.user?.id) {
    res.status(403).json({ success: false, message: 'Unauthorized user' });
  } else {
    fs.unlink(path.join(file.destinationFolder, file.fileName), (err) =>
      console.error(err)
    );
    await dataSource.getRepository(SavedFile).delete(file.id);
    res.json({ success: true, message: 'File deleted successfully' });
  }
});

export default router;
