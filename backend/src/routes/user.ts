import {Router} from 'express';
import user_controller from '../controllers/user.controller'

const router = Router();

router.post('/register',user_controller.register as any) ;
router.post('/login',user_controller.login as any);

export default router;