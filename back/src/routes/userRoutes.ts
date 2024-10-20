import express, {Request,Response}  from 'express';
import { createOrUpdateUser, getAllUsers, getUserCourse } from '../controllers/userController';

const router = express.Router();

router.post('/',  async (req:Request, res:Response) => {
  await createOrUpdateUser(req,res);
  return;
})
router.get('/getAll', getAllUsers);
router.get('/purchased', getUserCourse)

export default router;