import { Request, Response, Router } from 'express';
import dataSource from '../database/dataSource';
import { User } from '../database/models/User';
import auth from '../utils/auth';

const router = Router();

router.get('/', auth, async (req: Request, res: Response) => {
  const user = await dataSource.getRepository(User).findOne({
    where: { id: req.user?.id },
    relations: { savedFiles: true },
  });
  if (user) {
    if (!user.savedFiles || user.savedFiles.length == 0) {
      res.json({ success: true, files: [] });
    } else {
      res.json({
        success: true,
        files: user.savedFiles.map((file) => {
          return {
            id: file.id,
            originalName: file.originalName,
            creationTime: file.creationTime,
          };
        }),
      });
    }
  }
});

export default router;
