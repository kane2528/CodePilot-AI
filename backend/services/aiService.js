const Groq = require('groq-sdk');


class AIService {
    constructor() {
        // Initialize Groq (default)
        if (process.env.GROQ_API_KEY) {
            this.groq = new Groq({
                apiKey: process.env.GROQ_API_KEY,
            });
        }


    }

    async generateResponse(prompt, toolName, level, language) {
        const systemPrompts = {

            'code-explainer': `
You are a senior software engineer with 15+ years of experience.

Explain the given code clearly and in depth.

Your response MUST include:
1. High-level overview (what the code does)
2. Step-by-step breakdown
3. Key concepts used (e.g., closures, async, OOP)
4. Time & space complexity (if applicable)
5. Possible improvements or optimizations

Format in clean markdown with headings and code blocks.

Keep explanations beginner-friendly but technically accurate.
`,

            'sql-generator': `
You are an expert SQL developer.

Generate a correct and optimized SQL query.

STRICT RULES:
- Return ONLY SQL query inside a code block
- Do NOT include explanation unless explicitly asked

Format:
\`\`\`sql
SELECT ...
\`\`\`

Ensure:
- Proper joins if needed
- Optimized query (no unnecessary operations)
- Readable formatting

Requirement:
`,

            'regex-generator': `
You are a regex expert.

Generate a precise and efficient regex pattern.

STRICT RULES:
- Return ONLY regex inside a code block
- No unnecessary explanation

Format:
\`\`\`
/your-regex/
\`\`\`

Ensure:
- Covers edge cases
- Efficient and minimal
- Valid syntax

Requirement:
`,

            'code-reviewer': `
You are a senior software engineer and code reviewer.

Review the code thoroughly.

Your response MUST include:

## Issues
- Bugs or logical errors
- Edge cases not handled

## Improvements
- Performance optimizations
- Code readability improvements
- Best practices

## Optimized Code
Provide improved version in code block

## Summary
Short final verdict

Use markdown formatting.
Be constructive, not harsh.
`,

            'interview': (input, level, language) => `
You are a senior technical interviewer.

First, check if the combination of the requested topic and the programming language (if provided) makes logical sense. For example, asking for "HTML" questions in "C++", or "SQL" questions in "CSS" does not make sense. 
If the combination DOES NOT make sense, DO NOT generate questions. Instead, reply EXACTLY with:
"❌ The combination of the requested topic and the programming language '${language}' does not make sense. Please choose a valid combination."

If the combination makes sense or no specific language is requested, generate EXACTLY 15 interview questions.

Difficulty level: ${level}
${language && language !== 'any' ? `Programming Language: ${language}` : ''}

RULES:

If level = "mixed":
- Easy (4)
- Medium (4)
- Hard (4)
- Advanced (3)

Else:
- All 15 questions must be strictly ${level}

For EACH question include:
- Question
- Answer (clear, concise, and MUST include a well-formatted code snippet in ${language && language !== 'any' ? language : 'an appropriate programming language'} if the question involves programming logic or syntax)
- Companies where this is commonly asked (Google, Amazon, Microsoft, etc.)

Format:

## ${level === "mixed" ? "Mixed Levels" : level}

### Question 1
Q:
A:
Companies:

Make questions realistic and industry-level.
Avoid generic textbook questions.
`,
            'resume-builder': `
You are a professional resume writer with experience hiring at top tech companies.

Create a clean, ATS-friendly resume.

Include sections:
- Summary
- Skills
- Experience
- Projects
- Education

Rules:
- Use bullet points
- Strong action verbs
- Quantify achievements where possible
- Keep it concise and impactful

Format in clean markdown.
`
        };
        
        const promptTemplate = systemPrompts[toolName];
        let systemMessage = "";
        
        if (typeof promptTemplate === 'function') {
            systemMessage = promptTemplate(prompt, level, language);
        } else {
            systemMessage = promptTemplate;
        }

        const fullPrompt = `${systemMessage}\n\n${prompt}\n\nResponse:`;

        try {
            // Try Groq first
            if (this.groq) {
                const completion = await this.groq.chat.completions.create({
                    messages: [
                        {
                            role: 'system',
                            content: 'You are a helpful AI assistant specialized in programming and development tools.',
                        },
                        {
                            role: 'user',
                            content: fullPrompt,
                        },
                    ],
                    model: "meta-llama/llama-4-scout-17b-16e-instruct",
                    temperature: 0.7,
                    max_tokens: 2000,
                });

                return completion.choices[0]?.message?.content || 'No response generated';
            }

            // Fallback to OpenAI
            if (this.openai) {
                const completion = await this.openai.chat.completions.create({
                    model: 'gpt-4',
                    messages: [
                        {
                            role: 'system',
                            content: 'You are a helpful AI assistant specialized in programming and development tools.',
                        },
                        {
                            role: 'user',
                            content: fullPrompt,
                        },
                    ],
                    temperature: 0.7,
                    max_tokens: 2000,
                });

                return completion.choices[0]?.message?.content || 'No response generated';
            }

            throw new Error('No AI service configured');
        } catch (error) {
            console.error('AI Service Error:', error);
            throw new Error(`AI service failed: ${error.message}`);
        }
    }
}

module.exports = new AIService();