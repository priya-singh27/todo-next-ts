import jwt from "jsonwebtoken";
import {AuthRequest} from '../types/custom_types'
import {Request, Response, NextFunction} from 'express';
import dotenv from 'dotenv';
dotenv.config();
const SECRET_KEY=process.env.SECRET_KEY||'';
const authMiddleware = (req:AuthRequest, res:Response, next:NextFunction)=>{
  const auth_token = req.header('x-auth-token');
  if(!auth_token)
    return res.status(401).json({message : "Authorization token is required"});
  try{
    const decoded = jwt.verify(auth_token,SECRET_KEY);
    req.user = decoded;
    next();
  }catch(err){
    console.log(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
export default authMiddleware;