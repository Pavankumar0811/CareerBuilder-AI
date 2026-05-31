import express from "express";
import protect from "../middleware/authmiddleware.js";
import { createResume, deleteResume, updateResume, getResumeById, getResumeByIdPublic } from "../controllers/ResumeController.js";
import upload from "../configs/multer.js";

const resumeRouter = express.Router();

resumeRouter.post('/create', protect, createResume);
resumeRouter.put('/update', upload.single('image'), protect, updateResume);
resumeRouter.delete('/delete/:resumeId', protect, deleteResume);
resumeRouter.get('/get/:resumeId', protect, getResumeById);
resumeRouter.get('/public/:resumeId', getResumeByIdPublic);

export default resumeRouter;
