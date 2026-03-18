const Resume = require('../models/Resume');
const AIService = require('../services/aiService');
const puppeteer = require('puppeteer');
const { marked } = require('marked');


// @desc    Generate resume using AI
// @route   POST /api/resume/generate
const generateResume = async (req, res) => {
  try {
    const { 
      name, email, phone, location, gender, linkedin, github, leetcode, 
      summary, experience, education, skills, projects 
    } = req.body;
    

    // 🔥 Structured prompt — strict no-fabrication mode
    const prompt = `
You are a professional resume formatter.

Your ONLY job is to take the user's provided information below and format it into a clean, professional, ATS-friendly resume in Markdown.

🚨 ABSOLUTE RULES — FOLLOW EXACTLY:
1. NEVER invent, fabricate, or add ANY detail the user did not explicitly provide.
2. NEVER add fake companies, job roles, dates, skills, certifications, achievements, or project descriptions.
3. NEVER fill empty sections with examples, placeholders, or guesses.
4. If a section was NOT provided by the user — SKIP IT ENTIRELY from the output.
5. You may ONLY rephrase and lightly polish the user's actual words to sound more professional.
6. Use bullet points for experience and project descriptions, based ONLY on what the user wrote.

---

USER'S PROVIDED DETAILS:

PERSONAL INFO:
Name: ${name || ""}
Email: ${email || ""}
Phone: ${phone || ""}
Location: ${location || ""}
${gender ? `Gender: ${gender}` : ""}
${linkedin ? `LinkedIn: ${linkedin}` : ""}
${github ? `GitHub: ${github}` : ""}
${leetcode ? `LeetCode: ${leetcode}` : ""}

${summary ? `SUMMARY:\n${summary}` : ""}

${experience ? `EXPERIENCE:\n${experience}` : ""}

${education ? `EDUCATION:\n${education}` : ""}

${skills ? `SKILLS:\n${skills}` : ""}

${projects ? `PROJECTS:\n${projects}` : ""}

---

OUTPUT RULES:
- Use Markdown: # for the person's name, ## for each section heading
- Only output sections and content that the user actually provided above
- Do NOT add a "References" section or any other section not in the user's data
- Format existing content cleanly — do not expand or invent
`;


    const generatedResume = await AIService.generateResponse(
      prompt,
      "resume-builder"
    );

    // ✅ Log to tool history every time a resume is generated
    await require('../models/ToolHistory').create({
      userId: req.user._id,
      toolName: 'resume-builder',
      inputPrompt: `Generated resume for ${name || 'user'}`,
      outputResult: generatedResume.slice(0, 200),
    });

    res.json({
      success: true,
      data: {
        generatedResume,
        preview: generatedResume.slice(0, 300),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// @desc    Save resume to database
// @route   POST /api/resume/save
const saveResume = async (req, res) => {
  try {
    const { 
      name, email, phone, location, gender, linkedin, github, leetcode, 
      summary, experience, education, skills, projects, generatedResume 
    } = req.body;

    const resume = await Resume.create({
      userId: req.user._id,
      name, email, phone, location, gender, linkedin, github, leetcode,
      summary, education, experience, projects, skills,
      generatedResume,
    });


    res.status(201).json({
      success: true,
      data: resume,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Get all resumes for current user
// @route   GET /api/resume/user
const getUserResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: resumes,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Get single resume by ID
// @route   GET /api/resume/:id
const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({ 
        success: false, 
        message: 'Resume not found' 
      });
    }

    res.json({
      success: true,
      data: resume,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Generate PDF from Markdown
// @route   POST /api/resume/pdf
const generatePDF = async (req, res) => {
  try {
    const { markdown } = req.body;

    if (!markdown) {
      return res.status(400).json({ success: false, message: 'Markdown content is required' });
    }

    // Convert Markdown to HTML
    const htmlContent = marked.parse(markdown);


    // Styled HTML Template for Resume
    const styledHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Resume</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            font-family: 'Inter', sans-serif;
            line-height: 1.6;
            color: #1a202c;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px;
            background-color: #fff;
          }
          h1 {
            color: #2d3748;
            font-size: 32px;
            margin-bottom: 12px;
            border-bottom: 2px solid #3182ce;
            padding-bottom: 12px;
            text-align: center;
          }
          h2 {
            color: #2b6cb0;
            font-size: 20px;
            margin-top: 32px;
            margin-bottom: 12px;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          h3 {
            color: #4a5568;
            font-size: 16px;
            font-weight: 600;
            margin-top: 16px;
            margin-bottom: 4px;
          }
          ul {
            padding-left: 20px;
            margin-bottom: 16px;
            margin-top: 4px;
          }
          li {
            margin-bottom: 6px;
            color: #4a5568;
          }
          p {
            margin-bottom: 12px;
            color: #4a5568;
          }
          a {
            color: #3182ce;
            text-decoration: none;
          }
          strong {
            font-weight: 600;
            color: #2d3748;
          }
          em {
            font-style: italic;
            color: #718096;
          }
        </style>
      </head>
      <body>
        ${htmlContent}
      </body>
      </html>
    `;

    // Launch Puppeteer to generate PDF
    const browser = await puppeteer.launch({
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    await page.setContent(styledHtml, { waitUntil: 'networkidle0' });
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm'
      }
    });

    await browser.close();

    // Set headers and return PDF
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="resume.pdf"',
      'Content-Length': pdfBuffer.length
    });

    res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF Generation Error:', error);
    res.status(500).json({ success: false, message: 'Failed to generate PDF' });
  }
};

module.exports = {
  generateResume,
  saveResume,
  getUserResumes,
  getResumeById,
  generatePDF,
};