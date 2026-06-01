import express from "express";
import { getUserById, getUserResumes, loginUser, registerUser, resetPassword } from "../controllers/UserController.js";
import protect from "../middleware/authmiddleware.js";



const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/reset-password', resetPassword);
userRouter.post('/data',protect, getUserById);
userRouter.get('/resumes', protect, getUserResumes);

export default userRouter;


