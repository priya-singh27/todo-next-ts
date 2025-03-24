import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/db';
import { User } from '../model/user';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const SecretKey = process.env.SECRET_KEY || 'fallback-secret-key';
  
const register = async (req: Request, res: Response) => {
  try {
    const { email, password, fullName } = req.body;

    if (!email || !password || !fullName) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const userRepository = AppDataSource.getRepository(User);
    
    const existingUser = await userRepository.findOne({ where: { email } });
    
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(12);
    const hash_password = await bcrypt.hash(password,salt);
    
    const user = new User();
    user.email = email;
    user.password = hash_password;
    user.fullName = fullName;
    
    const savedUser = await userRepository.save(user);
    
    const { password: _, ...userWithoutPassword } = savedUser;
    
    return res.status(201).json({
      message: 'User created successfully',
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    const userRepository = AppDataSource.getRepository(User);
    
    const user = await userRepository.findOne({ where: { email } });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    const isPasswordValid = await bcrypt.compare(password,user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    const token = jwt.sign({ id: user.id },SecretKey);
    
    const { password: _, ...userWithoutPassword } = user;
    
    return res.json({
      message: 'Login successful',
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export default {
  login,
  register
}