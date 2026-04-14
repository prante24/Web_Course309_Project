// Gemini AI Integration Utility - Production Grade
// Using Gemini 3 Flash with Native JSON Mode & Safety Settings

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_MODEL = "gemini-3-flash-preview";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

/**
 * Call Gemini AI API with robust JSON handling
 * @param {string} prompt - The prompt to send
 * @param {object} options - Additional options
 * @param {boolean} options.jsonMode - Enable strict JSON output mode
 * @param {number} options.temperature - Creativity (0.4-0.5 for JSON, 0.7+ for chat)
 * @param {number} options.maxTokens - Max output tokens
 * @returns {Promise<string>} - The generated text response
 */
export async function callGeminiAI(prompt, options = {}) {
  if (!GEMINI_API_KEY) {
    console.error("❌ GEMINI API KEY NOT FOUND! Check .env.local file.");
    throw new Error("Gemini API key is not configured");
  }

  const isJsonMode = options.jsonMode || false;
  
  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: options.temperature || 0.7,
      maxOutputTokens: options.maxTokens || 8192,
      topP: options.topP || 0.95,
      // CRITICAL: Forces the model to output strict JSON when enabled
      responseMimeType: isJsonMode ? "application/json" : "text/plain",
    },
    // Safety Settings: Prevent blocking on educational topics (biology, anatomy, etc.)
    safetySettings: [
      { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },
      { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
      { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_ONLY_HIGH" },
      { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" }
    ]
  };

  console.log(`🚀 Calling Gemini 3 Flash API (JSON Mode: ${isJsonMode})...`);

  try {
    const response = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `API Error: ${response.status}`);
    }

    const data = await response.json();
    let text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Clean-up: Strip markdown wrappers if present (even in JSON mode)
    if (isJsonMode) {
      text = text.replace(/```json\n?|\n?```/g, "").trim();
    }

    console.log("✅ Gemini response received:", text.substring(0, 100) + "...");
    return text;
  } catch (error) {
    console.error("❌ Gemini API Error:", error.message);
    throw error;
  }
}

/**
 * Generate rich lecture notes from audio/video
 */
export async function generateLectureNotes(fileName, transcript = '') {
  const prompt = `You are an expert educational content creator. Generate comprehensive lecture notes.

File: ${fileName}
${transcript ? `Content: ${transcript}` : ''}

Return a JSON object with this structure:
{
  "title": "Engaging lecture title",
  "emoji": "📚",
  "summary": "2-3 sentence overview",
  "learningObjectives": ["Objective 1", "Objective 2", "Objective 3"],
  "vocabulary": [{"term": "Key Term", "definition": "Clear explanation", "example": "Usage example"}],
  "keyPoints": ["🔑 Point 1", "🔑 Point 2", "🔑 Point 3"],
  "detailedNotes": "Detailed markdown notes with headers and sections",
  "practiceQuestions": [{"question": "Check understanding?", "answer": "Expected answer"}],
  "studyTips": ["💡 Tip 1", "💡 Tip 2"]
}`;

  try {
    const jsonString = await callGeminiAI(prompt, { 
      temperature: 0.5, // Lower for structured data
      maxTokens: 8000,
      jsonMode: true 
    });
    
    const notes = JSON.parse(jsonString);
    notes.timestamp = new Date().toISOString();
    notes.wordCount = notes.detailedNotes?.split(/\s+/).length || 0;
    return notes;
  } catch (error) {
    console.error('Error generating notes:', error);
    return {
      title: fileName.replace(/\.[^/.]+$/, ""),
      emoji: "📝",
      summary: "AI-generated lecture notes",
      learningObjectives: ["Understand core concepts"],
      vocabulary: [],
      keyPoints: ["Generated from uploaded content"],
      detailedNotes: `# ${fileName}\n\nNotes generated from your content.`,
      practiceQuestions: [],
      studyTips: ["Review regularly"],
      timestamp: new Date().toISOString(),
      wordCount: 20
    };
  }
}

/**
 * Generate professional presentation slides
 */
export async function generateSlides(outline) {
  const prompt = `You are a professional presentation designer. Create engaging slides.

Course Outline:
${outline}

Return a JSON object with this structure:
{
  "title": "Presentation Title",
  "theme": "modern-gradient",
  "totalSlides": 10,
  "slides": [
    {
      "slideNumber": 1,
      "type": "title",
      "title": "Slide Title",
      "subtitle": "Subtitle text",
      "content": ["• Point 1", "• Point 2", "• Point 3"],
      "visualSuggestion": "Use a hero image showing...",
      "speakerNotes": "Start with an engaging hook...",
      "animationType": "fade-in"
    }
  ],
  "designTips": ["Tip 1", "Tip 2"]
}

Include slides: title, agenda, 5-6 content slides, summary, Q&A.`;

  try {
    const jsonString = await callGeminiAI(prompt, { 
      temperature: 0.5,
      maxTokens: 8000,
      jsonMode: true 
    });
    
    const slides = JSON.parse(jsonString);
    slides.generatedAt = new Date().toISOString();
    return slides;
  } catch (error) {
    console.error('Error generating slides:', error);
    return {
      title: "AI-Generated Presentation",
      theme: "modern",
      totalSlides: 1,
      slides: [{
        slideNumber: 1,
        type: "title",
        title: "Generated Slides",
        content: ["Based on your outline"],
        speakerNotes: "Introduce the topic"
      }],
      generatedAt: new Date().toISOString()
    };
  }
}

/**
 * Generate comprehensive mind map
 */
export async function generateMindMap(content) {
  const prompt = `Create a detailed mind map structure for educational content.

Content:
${content}

Return a JSON object with this structure:
{
  "centralTopic": "Main Topic",
  "centralEmoji": "🧠",
  "branches": [
    {
      "id": 1,
      "topic": "Branch Name",
      "emoji": "📌",
      "color": "#6366f1",
      "subtopics": [
        {
          "id": 11,
          "name": "Subtopic",
          "items": ["Detail 1", "Detail 2"],
          "connections": ["Related to branch 2"]
        }
      ]
    }
  ],
  "connections": [{"from": 1, "to": 2, "label": "relates to"}],
  "totalNodes": 30
}

Create 5 branches with 2-3 subtopics each. Include cross-connections.`;

  try {
    const jsonString = await callGeminiAI(prompt, { 
      temperature: 0.5,
      maxTokens: 6000,
      jsonMode: true 
    });
    
    const mindMap = JSON.parse(jsonString);
    mindMap.generatedAt = new Date().toISOString();
    return mindMap;
  } catch (error) {
    console.error('Error generating mind map:', error);
    return {
      centralTopic: "Mind Map",
      centralEmoji: "🧠",
      branches: [{
        id: 1,
        topic: "Generated Content",
        emoji: "📌",
        subtopics: [{ id: 11, name: "From your input", items: ["Analysis pending"] }]
      }],
      totalNodes: 3,
      generatedAt: new Date().toISOString()
    };
  }
}

/**
 * Generate rich quiz questions with hints and explanations
 */
export async function generateQuiz(material, difficulty = 'medium', count = 5) {
  const difficultyEmoji = difficulty === 'easy' ? '🟢' : difficulty === 'medium' ? '🟡' : '🔴';
  const points = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 15 : 20;

  const prompt = `Create ${count} ${difficulty} difficulty quiz questions based on this material.

Material:
${material}

Return a JSON object with this structure:
{
  "questions": [
    {
      "id": 1,
      "type": "multiple-choice",
      "topic": "Topic being tested",
      "difficulty": "${difficulty}",
      "difficultyEmoji": "${difficultyEmoji}",
      "question": "Question text?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "hint": "A helpful hint without giving away the answer",
      "explanation": "Detailed explanation why this answer is correct",
      "points": ${points}
    }
  ]
}

Make questions educational with real hints and detailed explanations.`;

  try {
    const jsonString = await callGeminiAI(prompt, { 
      temperature: 0.5, // Lower for consistent structured output
      maxTokens: 8000,
      jsonMode: true 
    });
    
    const quizData = JSON.parse(jsonString);
    
    return {
      id: Date.now(),
      title: "AI-Generated Quiz",
      description: `${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} difficulty quiz`,
      difficulty,
      totalQuestions: quizData.questions.length,
      questions: quizData.questions,
      timeLimit: quizData.questions.length * 2,
      passingScore: 70,
      createdAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error generating quiz:', error);
    return {
      id: Date.now(),
      title: "Quiz (Fallback)",
      difficulty,
      totalQuestions: 1,
      questions: [{
        id: 1,
        type: "multiple-choice",
        topic: "General",
        difficulty,
        difficultyEmoji,
        question: "Sample question based on the material?",
        options: ["Option A", "Option B", "Option C", "Option D"],
        correctAnswer: 0,
        hint: "Think about the core concepts",
        explanation: "This tests fundamental understanding of the material.",
        points
      }],
      timeLimit: 2,
      passingScore: 70,
      createdAt: new Date().toISOString()
    };
  }
}

/**
 * Generate enhanced flashcards with hints and memory tips
 */
export async function generateFlashcards(material, count = 10) {
  const prompt = `Create ${count} study flashcards from this material.

Material:
${material}

Return a JSON object with this structure:
{
  "title": "Flashcard Set Title",
  "cards": [
    {
      "id": 1,
      "front": "Question or term on front",
      "back": "Answer or definition on back",
      "hint": "A clue without giving away the answer",
      "difficulty": "easy|medium|hard",
      "difficultyEmoji": "🟢|🟡|🔴",
      "category": "Topic/Category",
      "categoryEmoji": "📚",
      "memoryTip": "A mnemonic or technique to remember this",
      "example": "Real-world example"
    }
  ],
  "totalCards": ${count},
  "categories": ["Category1", "Category2"]
}

Distribute difficulty: 30% easy (🟢), 50% medium (🟡), 20% hard (🔴). Include helpful memory tips.`;

  try {
    const jsonString = await callGeminiAI(prompt, { 
      temperature: 0.5,
      maxTokens: 6000,
      jsonMode: true 
    });
    
    const flashcards = JSON.parse(jsonString);
    flashcards.generatedAt = new Date().toISOString();
    return flashcards;
  } catch (error) {
    console.error('Error generating flashcards:', error);
    return {
      title: "Study Flashcards",
      cards: [{
        id: 1,
        front: "Sample Term",
        back: "Sample Definition",
        hint: "Think about the basics",
        difficulty: "medium",
        difficultyEmoji: "🟡",
        category: "General",
        categoryEmoji: "📚",
        memoryTip: "Associate with a familiar concept"
      }],
      totalCards: 1,
      categories: ["General"],
      generatedAt: new Date().toISOString()
    };
  }
}

/**
 * AI Study Buddy chat with user context awareness
 * Note: System prompt is sent every time to ensure consistent behavior
 */
export async function studyBuddyChat(message, chatHistory = [], userContext = {}) {
  const contextInfo = userContext.name ? 
    `Student's name: ${userContext.name}.\nEnrolled Courses: ${userContext.classes?.length > 0 ? userContext.classes.map(c => c.title).join(', ') : 'No specific courses found'}.\n\nIMPORTANT: You know exactly what courses the user is taking. If they ask "explain concept", "quiz me", or general questions, PRIORITIZE answering based on their enrolled courses. Explicitly reference their courses when relevant (e.g., "In your Physics 101 class...").` : 
    '';

  // System prompt included every time for consistent behavior
  const systemPrompt = `You are Study Buddy, an advanced AI learning assistant for EduManage. Be friendly, encouraging, and helpful.

${contextInfo}

Your capabilities:
- Explain complex topics simply with examples
- Create step-by-step explanations with numbered steps
- Provide code examples with syntax highlighting (use \`\`\`language)
- Show math equations clearly
- Give mnemonics and memory techniques
- Offer study tips and strategies
- Quiz students on topics

Format tips:
- Use emojis for engagement 📚✨💡
- Use bullet points and numbered lists
- Bold **key terms**
- Keep responses concise (under 300 words)
- Always be encouraging!

Previous conversation context:
${chatHistory.slice(-6).map(msg => `${msg.type === 'user' ? 'Student' : 'Study Buddy'}: ${msg.content}`).join('\n')}

Student's new message: ${message}

Respond helpfully and engagingly:`;

  try {
    // Use higher temperature for conversational chat
    const response = await callGeminiAI(systemPrompt, { 
      temperature: 0.7, 
      maxTokens: 1000,
      jsonMode: false // Chat uses text mode
    });
    return response;
  } catch (error) {
    console.error('Chat error:', error);
    return "I'm having trouble connecting right now. Please try again! 🔄";
  }
}
