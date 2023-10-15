import { Request, Response, Router } from 'express';
import dataSource from '../database/dataSource';
import { SavedFile } from '../database/models/SavedFile';
import auth from '../utils/auth';
import path from 'path';
// import fs from 'fs';
import {LocalFileData} from 'get-file-object-from-local-path';

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
    // const f = fs.readFileSync(path.join(file.destinationFolder, file.fileName));
    const fileData = new LocalFileData(path.resolve(file.destinationFolder, file.fileName));
    console.log(fileData);
    // const send = new File([f.buffer], file.originalName + '.pdf', {
    //   type: 'application/pdf',
    //   lastModified: file.creationTime.getMilliseconds(),
    // });
    res.json({ success: true, message: 'File sent successfully', file: fileData });
  }
});

export default router;
