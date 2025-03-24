import { Response } from "express";
import { AppDataSource } from "../config/db";
import { Todo } from "../model/todo";
import {AuthRequest} from '../types/custom_types'
import { User } from "../model/user";

const deleteTodo = async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user || typeof req.user === 'string') {
        return res.status(401).json({ message: 'Invalid token' });
      }
  
      const user_id = req.user.id;
      if (!user_id) {
        return res.status(401).json({ message: 'Invalid token' });
      }
  
      const { id } = req.body;
      if (!id) {
        return res.status(400).json({ message: 'Todo ID is required' });
      }
  
      const todoRepository = AppDataSource.getRepository(Todo);
      const todo = await todoRepository.findOne({ where: { id, userId: user_id } });
  
      if (!todo) {
        return res.status(404).json({ message: 'Todo not found' });
      }
  
      await todoRepository.remove(todo);
      return res.status(200).json({ message: 'Todo deleted successfully' });
    } catch (err) {
      console.error('Error deleting todo:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
};
  
const getTodos = async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user || typeof req.user === 'string') {
        return res.status(401).json({ message: 'Invalid token' });
      }
  
      const user_id = req.user.id;
      if (!user_id) {
        return res.status(401).json({ message: 'Invalid token' });
      }
  
      const todoRepository = AppDataSource.getRepository(Todo);
      const todos = await todoRepository.find({ where: { userId: user_id } });
  
      return res.status(200).json({ message: 'Todos fetched successfully', todos });
    } catch (err) {
      console.error('Error fetching todos:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

const updateTodo = async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user || typeof req.user === 'string') {
        return res.status(401).json({ message: 'Invalid token' });
      }
  
      const user_id = req.user.id;
      if (!user_id) {
        return res.status(401).json({ message: 'Invalid token' });
      }
  
      const { id, title, description, completed } = req.body;
      if (!id) {
        return res.status(400).json({ message: 'Todo ID is required' });
      }
  
      const todoRepository = AppDataSource.getRepository(Todo);
      const todo = await todoRepository.findOne({ where: { id, userId: user_id } });
  
      if (!todo) {
        return res.status(404).json({ message: 'Todo not found' });
      }
  
      if (title !== undefined) {
        todo.title = title;
      }
      if (description !== undefined) {
        todo.description = description;
      }
      if (completed !== undefined) {
        todo.completed = completed;
      }
  
      const updatedTodo = await todoRepository.save(todo);
      return res.status(200).json({ message: 'Todo updated successfully', todo: updatedTodo });
    } catch (err) {
      console.error('Error updating todo:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

const createTodo = async (req:AuthRequest, res:Response)=>{
    try{
        if (!req.user || typeof req.user === 'string') {
            return res.status(401).json({ message: 'Invalid token' });
        }
        const user_id = req.user.id;
        
        if(!user_id){
            return res.status(401).json({ message: 'Invalid token' });
        }

        const { title, description, completed } = req.body;
        if (!title) {
            return res.status(400).json({ message: 'Title is required' });
        }

        const userRepository= AppDataSource.getRepository(User);
        const user = await userRepository.findOne({where: {id: user_id}})
        
        if(!user){
            return res.status(404).json({ message: 'User not found'});
        }

        const todoRepository = AppDataSource.getRepository(Todo);
        const todo=new Todo();
        todo.title = title;
        todo.user = user;
        todo.userId = user_id;
        
        if (description !== undefined) {
            todo.description = description;
        }
        
        if (completed !== undefined) {
            todo.completed = completed;
        }

        const savedTodo =await todoRepository.save(todo);

        return res.status(201).json({
            message: 'Todo created successfully',
            todo: savedTodo
        });

    }catch(err){
        console.error('Error creating todo:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export default {
    createTodo,
    updateTodo,
    deleteTodo,
    getTodos
}