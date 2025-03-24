import { Router } from 'express';
import todo_controller from '../controllers/todo.controller';
import authMiddleware from '../middlewares/authMiddleware';

const router = Router();

router.post('/create', authMiddleware as any, todo_controller.createTodo as any);
router.put('/update', authMiddleware as any, todo_controller.updateTodo as any);
router.delete('/delete', authMiddleware as any, todo_controller.deleteTodo as any);
router.get('/get', authMiddleware as any, todo_controller.getTodos as any);

export default router;