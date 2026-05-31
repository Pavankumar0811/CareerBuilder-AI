import express from "express";
import protect from "../middleware/authmiddleware";
import { createResume, deleteResume, updateResume, getResumeById, getResumeByIdPublic } from "../controllers/ResumeController";
import upload from "../configs/multer";

const resumeRouter = express.Router();

resumeRouter.post('/create', protect, createResume);
resumeRouter.put('/update', upload.single('image'), protect, updateResume);
resumeRouter.delete('/delete/:resumeId', protect, deleteResume);
resumeRouter.get('/get/:resumeId', protect, getResumeById);
resumeRouter.get('/public/:resumeId', getResumeByIdPublic);
