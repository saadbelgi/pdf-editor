import { Router } from 'express';
import signup from './signup';
import login from './login';
import savefile from './savefile';
import yourfiles from './yourfiles';
import deletefile from './deletefile';
import renamefile from './renamefile';
import downloadfile from './downloadfile';


const router = Router();

router.use('/signup', signup);
router.use('/login', login);
router.use('/savefile', savefile);
router.use('/yourfiles', yourfiles);
router.use('/deletefile', deletefile);
router.use('/renamefile', renamefile);
router.use('/downloadfile', downloadfile);


router.all('*', (_, res) => {
  res.status(404).send({ sucess: false, message: 'Endpoint does not exist' });
});

export default router;
