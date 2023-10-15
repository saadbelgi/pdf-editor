import { Request, Response, Router } from 'express';
import dataSource from '../database/dataSource';
import { SavedFile } from '../database/models/SavedFile';
import auth from '../utils/auth';

const router = Router();

router.post('/', auth, async (req: Request, res: Response) => {
  console.log(req.body);
  const { fileId, newName }: { fileId: number, newName: string } = req.body;
  console.log(fileId, newName);
  const file = await dataSource
    .getRepository(SavedFile)
    .findOne({ where: { id: fileId }, relations: { owner: true } });
  if (!file) {
    res.json({ success: false, message: "File with given ID doesn't exist" });
  } else if (file.owner.id !== req.user?.id) {
    res.status(403).json({ success: false, message: 'Unauthorized user' });
  } else {
    await dataSource.getRepository(SavedFile).save({...file, originalName: newName});
    res.json({ success: true, message: 'Filename updated successfully' });
  }
});

export default router;
