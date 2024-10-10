import express, {Request,Response}  from 'express';
import { createOrUpdateUser, getAllUsers } from '../controllers/userController';

const router = express.Router();

router.post('/',  async (req:Request, res:Response) => {
  await createOrUpdateUser(req,res);
  return;
})
router.get('/getAll', getAllUsers);

export default router;