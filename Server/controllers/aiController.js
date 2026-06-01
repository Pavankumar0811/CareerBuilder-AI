
import Resume from "../models/Resume.js";
import ai from "../configs/ai.js";
import fs from "fs/promises";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

const normalizeList = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
};

const normalizeResumeData = (data = {}) => ({
  personal_info: {
    image: data.personal_info?.image || "",
    full_name: data.personal_info?.full_name || "",
    profession: data.personal_info?.profession || "",
    email: data.personal_info?.email || "",
    phone: data.personal_info?.phone || "",
    location: data.personal_info?.location || "",
    linkedin: data.personal_info?.linkedin || "",
    website: data.personal_info?.website || "",
  },
  professional_summary: data.professional_summary || "",
  skills: normalizeList(data.skills),
  experience: Array.isArray(data.experience) ? data.experience : [],
  project: Array.isArray(data.project) ? data.project : Array.isArray(data.projects) ? data.projects : [],
  education: Array.isArray(data.education) ? data.education : [],
  template: data.template || "classic",
  accent_color: data.accent_color || "#3B82F6",
  public: Boolean(data.public),
});

const extractPdfText = async (fileBuffer) => {
  const pdfDocument = await pdfjsLib.getDocument({ data: new Uint8Array(fileBuffer) }).promise;
  const pageTexts = [];

  for (let pageNumber = 1; pageNumber <= pdfDocument.numPages; pageNumber += 1) {
    const page = await pdfDocument.getPage(pageNumber);
    const content = await page.getTextContent();
    pageTexts.push(content.items.map((item) => item.str).join(' '));
  }

  return pageTexts.join('\n');
};

export const enhanceProfessionalSummary = async (req, res) => {
    try {
      const {userContent} = req.body;

      if(!userContent) {
        return res.status(400).json({message: "Content is required"})
      }

     const response = await ai.chat.completions.create({
        model: process.env.OPENAI_MODEL,
    messages: [
        {   role: "system",
        content: "You are an expert resume writer. Rewrite the professional summary to be concise, compelling, and resume-friendly. Keep it to 1-2 sentences, emphasize the candidate's strongest skills, experience, measurable impact, and career value. Use ATS-friendly language, active voice, and strong action-oriented wording. Make the result sound polished, valuable, and tailored for hiring managers. Return only the revised summary text." 
        },
        {
            role: "user",
            content: userContent,
        },
    ],
      })

    const enhancedContent = response.choices[0].message.content;
      return res.status(200).json({enhancedContent})
    } catch (error){
      return res.status(400).json({message: "Error occurred while enhancing professional summary"})
    }
}

// controller for enhancing a resume's job description 
// post: /api/ai/enhance-job-desc

export const enhanceJobDescription = async (req, res) => {
    try {
      const {userContent} = req.body;

      if(!userContent) {
        return res.status(400).json({message: "Content is required"})
      }

     const response = await ai.chat.completions.create({
        model: process.env.OPENAI_MODEL,
    messages: [
        {   role: "system",
        content: "You are an expert resume writer. Rewrite the job description to be concise, professional, and valuable for a resume. Keep it to 1-2 sentences or short bullet-style prose, highlight key responsibilities, achievements, tools, and measurable outcomes when possible. Use strong action verbs, ATS-friendly keywords, and wording that increases the perceived impact of the role. Return only the revised text with no explanations." 
        },
        {
            role: "user",
            content: userContent,
        },
    ],
      })

    const enhancedContent = response.choices[0].message.content;
      return res.status(200).json({enhancedContent})
    } catch (error){
      return res.status(400).json({message: "Error occurred while enhancing professional summary"})
    }
}

//controller for uploading a resume to the database 
// post: /api/ai/upload-resume


export const uploadResume = async (req, res) => {
    try {
    const {title, resumeText} = req.body;
        const userId = req.userId;
    const uploadedFile = req.file;

    let extractedText = resumeText || "";

    if (uploadedFile?.path) {
      const fileBuffer = await fs.readFile(uploadedFile.path);
          extractedText = (await extractPdfText(fileBuffer)) || extractedText;
      await fs.unlink(uploadedFile.path).catch(() => {});
    }

    if(!extractedText) {
            return res.status(400).json({message: "Resume content is required"})
        }

    const systemPrompt = "You are an expert AI agent to extract resume data into structured JSON.";

    const userPrompt = `extract data from this resume: ${extractedText}
        
        provide data in the following JSON format with no additional text before or after:

        { 
  professional_summary: "",
  skills: ["JavaScript", "React"],
    personal_info:{
    image: "",
    full_name: "",
    profession: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    website: ""
    },
    experience: [
        {
      company: "",
      position: "",
      start_date: "",
      end_date: "",
      description: "",
      is_current: false

        }
    ],
  project: [
        {
      name: "",
      description: "",
      type: "",
        }
    ],
    education: [
        {
      institution: "",
      degree: "",
      field: "",
      graduation_date: "",
      gpa: "",

        }
    ],
  template: "classic",
  accent_color: "#3B82F6"
    }
    `


     const response = await ai.chat.completions.create({
        model: process.env.OPENAI_MODEL,
    messages: [
        {   role: "system",
            content: systemPrompt 
        },
        {
            role: "user",
            content: userPrompt,
        },
    ],

    response_format: {type: "json_object"}

    })

    const extractedData = response.choices[0].message.content;
    const parsedData = normalizeResumeData(JSON.parse(extractedData));
    const newResume = await Resume.create({
      userId,
      title,
      ...parsedData,
    })
      
      res.status(201).json({resume: newResume})
    } catch (error){
      return res.status(400).json({message: error.message || "Error occurred while uploading resume"})
    }
}