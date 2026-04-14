// Groq AI Integration Utility
import Groq from "groq-sdk";

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

// Initialize Groq client
const groq = new Groq({
  apiKey: GROQ_API_KEY,
  dangerouslyAllowBrowser: true // Required for client-side usage
});

/**
 * Call Groq AI API with a prompt
 * @param {string} prompt - The prompt to send to Groq
 * @param {object} options - Additional options
 * @returns {Promise<string>} - The generated text response
 */
export async function callGroqAI(prompt, options = {}) {
  if (!GROQ_API_KEY) {
    console.error("❌ GROQ API KEY NOT FOUND! Check .env.local file.");
    throw new Error("Groq API key is not configured");
  }

  console.log("🚀 Calling Groq API with model:", options.model || "llama-3.3-70b-versatile");
  
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      model: options.model || "llama-3.3-70b-versatile", // Fast and capable model
      temperature: options.temperature || 0.7,
      max_tokens: options.max_tokens || 8000,
      top_p: options.top_p || 0.95,
      frequency_penalty: options.frequency_penalty || 0,
      presence_penalty: options.presence_penalty || 0,
    });

    const response = chatCompletion.choices[0]?.message?.content || "";
    console.log("✅ Groq API Response received:", response.substring(0, 100) + "...");
    return response;
  } catch (error) {
    console.error("❌ Groq API Error:", error.message);
    console.error("Full error:", error);
    throw error;
  }
}

/**
 * Generate lecture notes from audio/video transcript
 * @param {string} fileName - Name of the uploaded file
 * @param {string} transcript - Transcript or description of the content
 * @returns {Promise<object>} - Structured notes object
 */
export async function generateLectureNotes(fileName, transcript = '') {
  const prompt = `You are an expert educational content creator. Generate comprehensive lecture notes based on the following information:

File Name: ${fileName}
${transcript ? `Content/Transcript: ${transcript}` : ''}

Please generate structured lecture notes in the following JSON format:
{
  "title": "Lecture title",
  "summary": "Brief 2-3 sentence summary",
  "keyPoints": ["Point 1", "Point 2", "Point 3", "Point 4", "Point 5"],
  "detailedNotes": "Detailed notes in markdown format with proper headers, bullet points, and sections"
}

Make the notes educational, well-organized, and comprehensive. Include sections like Introduction, Main Topics, Key Takeaways, and References if applicable. Return ONLY valid JSON, no markdown formatting.`;

  try {
    const response = await callGroqAI(prompt, { temperature: 0.7, max_tokens: 4000 });
    
    // Extract JSON from the response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const notes = JSON.parse(jsonMatch[0]);
      notes.timestamp = new Date().toISOString();
      notes.wordCount = notes.detailedNotes.split(/\s+/).length;
      return notes;
    }
  } catch (error) {
    console.error('Error generating notes:', error);
  }
  
  // Fallback if JSON parsing fails
  return {
    title: fileName.replace(/\.[^/.]+$/, ""),
    summary: "AI-generated lecture notes based on the uploaded content.",
    keyPoints: ["Content analysis from uploaded media file"],
    detailedNotes: `# ${fileName.replace(/\.[^/.]+$/, "")}\n\n${response || 'Unable to generate detailed notes.'}`,
    timestamp: new Date().toISOString(),
    wordCount: 50
  };
}

/**
 * Generate presentation slides from course outline
 * @param {string} outline - Course outline or topics
 * @returns {Promise<object>} - Slides object
 */
export async function generateSlides(outline) {
  const prompt = `You are an expert presentation designer. Create professional presentation slides based on the following course outline:

${outline}

Generate 8 slides in the following JSON format:
{
  "title": "Presentation title",
  "totalSlides": 8,
  "slides": [
    {
      "slideNumber": 1,
      "title": "Slide title",
      "content": ["Bullet point 1", "Bullet point 2", "Bullet point 3"],
      "notes": "Speaker notes for this slide"
    }
  ],
  "theme": "professional"
}

Create 8 engaging slides with clear content points and helpful speaker notes. Make it educational and professional. Return ONLY valid JSON, no markdown formatting.`;

  try {
    const response = await callGroqAI(prompt, { temperature: 0.7, max_tokens: 4000 });
    
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const slides = JSON.parse(jsonMatch[0]);
      slides.generatedAt = new Date().toISOString();
      return slides;
    }
  } catch (error) {
    console.error('Error generating slides:', error);
  }
  
  return {
    title: "AI-Generated Presentation",
    totalSlides: 1,
    slides: [{
      slideNumber: 1,
      title: "Generated Content",
      content: ["AI-generated slides based on your outline"],
      notes: "AI-generated presentation content"
    }],
    theme: "professional",
    generatedAt: new Date().toISOString()
  };
}

/**
 * Generate mind map from course content
 * @param {string} content - Course content or concepts
 * @returns {Promise<object>} - Mind map object
 */
export async function generateMindMap(content) {
  const prompt = `You are an expert in creating educational mind maps. Create a hierarchical mind map based on the following course content:

${content}

Generate a mind map in the following JSON format:
{
  "centralTopic": "Main topic",
  "branches": [
    {
      "id": 1,
      "topic": "Branch topic",
      "subtopics": [
        {
          "id": 11,
          "name": "Subtopic name",
          "items": ["Item 1", "Item 2", "Item 3"]
        }
      ]
    }
  ],
  "totalNodes": 45
}

Create 5 main branches with 2-3 subtopics each, and 2-4 items per subtopic. Make it comprehensive and well-organized. Return ONLY valid JSON, no markdown formatting.`;

  try {
    const response = await callGroqAI(prompt, { temperature: 0.7, max_tokens: 4000 });
    
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const mindMap = JSON.parse(jsonMatch[0]);
      mindMap.generatedAt = new Date().toISOString();
      return mindMap;
    }
  } catch (error) {
    console.error('Error generating mind map:', error);
  }
  
  return {
    centralTopic: "Generated Mind Map",
    branches: [{
      id: 1,
      topic: "AI-Generated Content",
      subtopics: [{
        id: 11,
        name: "Content Analysis",
        items: ["Based on provided content"]
      }]
    }],
    totalNodes: 5,
    generatedAt: new Date().toISOString()
  };
}

/**
 * Generate quiz questions from course material
 * @param {string} material - Course material
 * @param {string} difficulty - easy, medium, or hard
 * @param {number} count - Number of questions to generate
 * @returns {Promise<object>} - Quiz object
 */
export async function generateQuiz(material, difficulty = 'medium', count = 5) {
  const difficultyPrompts = {
    easy: 'basic recall and understanding level multiple choice questions',
    medium: 'application and analysis level multiple choice questions',
    hard: 'evaluation and synthesis level multiple choice questions'
  };

  const prompt = `You are an expert quiz creator. Generate EXACTLY ${count} ${difficulty} difficulty MULTIPLE CHOICE questions based on the following course material:

${material}

IMPORTANT RULES:
- Generate ONLY multiple-choice questions (MCQ)
- Each question MUST have exactly 4 options
- Each question MUST have exactly ONE correct answer
- NO short-answer, essay, or true/false questions
- Return ONLY valid JSON, no markdown code blocks

Generate the quiz in the following JSON format:
{
  "questions": [
    {
      "id": 1,
      "type": "multiple-choice",
      "question": "Question text?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "points": 10,
      "explanation": "Detailed explanation of the correct answer"
    }
  ]
}

For difficulty levels:
- Easy: 10 points per question, simple recall and recognition
- Medium: 15 points per question, application and analysis
- Hard: 20 points per question, complex reasoning and synthesis

Make questions educational, clear, challenging, and well-explained.`;

  try {
    console.log(`📝 Generating ${count} ${difficulty} quiz questions...`);
    const response = await callGroqAI(prompt, { temperature: 0.8, max_tokens: 6000 });
    
    console.log("📊 Quiz generation response received, parsing JSON...");
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const quizData = JSON.parse(jsonMatch[0]);
      console.log("✅ Quiz parsed successfully:", quizData.questions.length, "questions");
      
      return {
        id: Date.now(),
        title: "AI-Generated Quiz",
        description: `This quiz tests your understanding of the course material. Difficulty: ${difficulty}`,
        difficulty: difficulty,
        totalQuestions: quizData.questions.length,
        questions: quizData.questions,
        timeLimit: quizData.questions.length * 2,
        passingScore: 70,
        adaptiveEnabled: true,
        createdAt: new Date().toISOString(),
        config: {
          questionTypes: ["multiple-choice"],
          complexity: difficulty === 'easy' ? "Basic recall and understanding" :
                     difficulty === 'medium' ? "Application and analysis" :
                     "Evaluation and synthesis"
        }
      };
    } else {
      console.warn("⚠️ No JSON found in response, using fallback");
    }
  } catch (error) {
    console.error('❌ Error generating quiz:', error.message);
    console.error('Full error details:', error);
  }
  
  // Fallback with minimal quiz
  console.warn("⚠️ USING FALLBACK QUIZ - Groq API may have failed");
  return {
    id: Date.now(),
    title: "Quiz (Fallback Mode)",
    description: `Quiz based on course material - ${difficulty} difficulty. Note: Generated in fallback mode.`,
    difficulty: difficulty,
    totalQuestions: 1,
    questions: [{
      id: 1,
      type: "multiple-choice",
      question: "Based on the material, what is the main concept discussed?",
      options: ["Core Concept A", "Core Concept B", "Core Concept C", "Core Concept D"],
      correctAnswer: 0,
      points: 10,
      explanation: "This represents the primary concept from the provided material."
    }],
    timeLimit: 2,
    passingScore: 70,
    adaptiveEnabled: true,
    createdAt: new Date().toISOString()
  };
}
