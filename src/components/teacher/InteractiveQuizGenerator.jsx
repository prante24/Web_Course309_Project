import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import {
  Brain,
  Plus,
  Trash2,
  Eye,
  Download,
  Sparkles,
  Loader2,
  CheckCircle,
  XCircle,
  HelpCircle,
  Target,
  TrendingUp,
  Copy,
  Save,
  Zap
} from "lucide-react"
import toast from "react-hot-toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { generateQuiz as generateQuizWithAI } from "@/lib/gemini-ai"

const InteractiveQuizGenerator = () => {
  const [courseMaterial, setCourseMaterial] = useState("")
  const [difficulty, setDifficulty] = useState("medium")
  const [questionCount, setQuestionCount] = useState(5)
  const [processing, setProcessing] = useState(false)
  const [generatedQuiz, setGeneratedQuiz] = useState(null)
  const [activeView, setActiveView] = useState("create")
  const [previewMode, setPreviewMode] = useState(false)
  const [userAnswers, setUserAnswers] = useState({})
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [adaptiveLevel, setAdaptiveLevel] = useState("beginner")
  const [savedQuizzes, setSavedQuizzes] = useState([])

  // Generate quiz from course material
  const generateQuiz = async () => {
    if (!courseMaterial.trim()) {
      toast.error("Please enter course material")
      return
    }

    setProcessing(true)

    try {
      const quiz = await generateQuizWithAI(courseMaterial, difficulty, questionCount);
      setGeneratedQuiz(quiz);
      setActiveView("preview");
      toast.success("Quiz generated successfully with AI!");
    } catch (error) {
      console.error("Error generating quiz:", error);
      toast.error("Failed to generate quiz. Please try again.");
    } finally {
      setProcessing(false);
    }
  }

  // Generate mock questions based on difficulty
  const generateMockQuestions = (count, level) => {
    const questions = []

    const easyQuestions = [
      {
        id: 1,
        type: "multiple-choice",
        question: "What does MERN stack stand for?",
        options: [
          "MongoDB, Express, React, Node.js",
          "MySQL, Express, React, Next.js",
          "MongoDB, Ember, Ruby, Node.js",
          "MySQL, Express, Ruby, Next.js"
        ],
        correctAnswer: 0,
        points: 10,
        explanation: "MERN stands for MongoDB (database), Express (backend framework), React (frontend library), and Node.js (runtime environment)."
      },
      {
        id: 2,
        type: "true-false",
        question: "React is a JavaScript framework developed by Facebook.",
        options: ["True", "False"],
        correctAnswer: 1,
        points: 10,
        explanation: "React is actually a JavaScript library, not a framework. It focuses specifically on building user interfaces."
      },
      {
        id: 3,
        type: "multiple-choice",
        question: "Which of the following is used for state management in React?",
        options: ["Redux", "Context API", "MobX", "All of the above"],
        correctAnswer: 3,
        points: 10,
        explanation: "All three - Redux, Context API, and MobX - are popular state management solutions in React applications."
      }
    ]

    const mediumQuestions = [
      {
        id: 4,
        type: "multiple-choice",
        question: "What is the purpose of useEffect hook in React?",
        options: [
          "To manage component state",
          "To perform side effects in function components",
          "To create context",
          "To optimize rendering performance"
        ],
        correctAnswer: 1,
        points: 15,
        explanation: "useEffect is used to perform side effects like data fetching, subscriptions, or manually changing the DOM in function components."
      },
      {
        id: 5,
        type: "short-answer",
        question: "Explain the difference between props and state in React.",
        correctAnswer: "Props are read-only data passed from parent to child components, while state is mutable data managed within a component.",
        points: 15,
        explanation: "Props enable component communication, while state allows components to create and manage their own data."
      },
      {
        id: 6,
        type: "multiple-choice",
        question: "Which HTTP method is used to update a resource in a RESTful API?",
        options: ["GET", "POST", "PUT", "DELETE"],
        correctAnswer: 2,
        points: 15,
        explanation: "PUT (or PATCH) is used to update existing resources, while POST creates new resources."
      }
    ]

    const hardQuestions = [
      {
        id: 7,
        type: "multiple-choice",
        question: "What is the Virtual DOM in React and why is it used?",
        options: [
          "A copy of the real DOM stored in memory for faster updates",
          "A database for storing component state",
          "A tool for debugging React applications",
          "A method for server-side rendering"
        ],
        correctAnswer: 0,
        points: 20,
        explanation: "Virtual DOM is a lightweight copy of the actual DOM. React uses it to minimize expensive DOM operations by batching updates and only applying necessary changes."
      },
      {
        id: 8,
        type: "essay",
        question: "Describe the authentication flow in a MERN stack application using JWT tokens. Include security considerations.",
        correctAnswer: "A comprehensive answer should cover: user login, server verification, JWT generation, token storage, token validation on requests, refresh tokens, and security measures like HTTPS, secure storage, and token expiration.",
        points: 25,
        explanation: "JWT authentication provides stateless authentication, but requires proper implementation of security measures to prevent vulnerabilities."
      },
      {
        id: 9,
        type: "short-answer",
        question: "What are React Higher-Order Components (HOCs) and when would you use them?",
        correctAnswer: "HOCs are functions that take a component and return a new component with additional props or behavior. They're used for code reuse, logic abstraction, and cross-cutting concerns.",
        points: 20,
        explanation: "HOCs enable component composition and reusability without modifying the original component."
      }
    ]

    // Select questions based on difficulty
    let questionPool = []
    if (level === "easy") {
      questionPool = [...easyQuestions]
    } else if (level === "medium") {
      questionPool = [...easyQuestions, ...mediumQuestions]
    } else {
      questionPool = [...easyQuestions, ...mediumQuestions, ...hardQuestions]
    }

    // Randomly select questions up to the requested count
    const shuffled = questionPool.sort(() => 0.5 - Math.random())
    return shuffled.slice(0, Math.min(count, shuffled.length))
  }

  // Handle answer selection
  const handleAnswerSelect = (questionId, answerIndex) => {
    setUserAnswers({
      ...userAnswers,
      [questionId]: answerIndex
    })
  }

  // Submit quiz and calculate score
  const submitQuiz = () => {
    if (!generatedQuiz) return

    const totalQuestions = generatedQuiz.questions.length
    const answeredCount = Object.keys(userAnswers).length

    if (answeredCount < totalQuestions) {
      toast.error(`Please answer all questions (${answeredCount}/${totalQuestions} answered)`)
      return
    }

    let correctCount = 0
    let totalPoints = 0
    let earnedPoints = 0

    generatedQuiz.questions.forEach(question => {
      totalPoints += question.points
      const userAnswer = userAnswers[question.id]

      if (question.type === "multiple-choice" || question.type === "true-false") {
        if (userAnswer === question.correctAnswer) {
          correctCount++
          earnedPoints += question.points
        }
      }
    })

    const score = (earnedPoints / totalPoints) * 100

    setQuizSubmitted(true)

    // Adaptive difficulty adjustment
    if (score >= 90) {
      setAdaptiveLevel("advanced")
      toast.success(`Excellent! Score: ${score.toFixed(0)}%. Moving to advanced level!`, { duration: 4000 })
    } else if (score >= 70) {
      setAdaptiveLevel("intermediate")
      toast.success(`Good job! Score: ${score.toFixed(0)}%. Ready for intermediate level!`, { duration: 4000 })
    } else {
      setAdaptiveLevel("beginner")
      toast(`Score: ${score.toFixed(0)}%. Let's practice more on the basics.`, { duration: 4000 })
    }
  }

  // Reset quiz
  const resetQuiz = () => {
    setUserAnswers({})
    setQuizSubmitted(false)
    setPreviewMode(false)
  }

  // Save quiz
  const saveQuiz = () => {
    if (!generatedQuiz) return

    const updatedQuizzes = [...savedQuizzes, generatedQuiz]
    setSavedQuizzes(updatedQuizzes)
    toast.success("Quiz saved successfully!")
  }

  // Download quiz as JSON
  const downloadQuiz = () => {
    if (!generatedQuiz) return

    const blob = new Blob([JSON.stringify(generatedQuiz, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `quiz-${generatedQuiz.id}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success("Quiz downloaded!")
  }

  // Copy quiz to clipboard
  const copyQuiz = () => {
    if (!generatedQuiz) return

    navigator.clipboard.writeText(JSON.stringify(generatedQuiz, null, 2))
    toast.success("Quiz copied to clipboard!")
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">QUIZ<span className="text-blue-600">GENERATOR</span></h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">AI Powered Assessment</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* View Toggle */}
      <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800/50 rounded-xl w-fit">
        <Button
          variant="ghost"
          onClick={() => setActiveView("create")}
          className={`rounded-lg transition-all duration-300 ${activeView === "create" ? "bg-white dark:bg-slate-800 text-blue-600 shadow-sm font-bold" : "text-slate-500 hover:text-slate-700"}`}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New
        </Button>
        <Button
          variant="ghost"
          onClick={() => setActiveView("preview")}
          disabled={!generatedQuiz}
          className={`rounded-lg transition-all duration-300 ${activeView === "preview" ? "bg-white dark:bg-slate-800 text-blue-600 shadow-sm font-bold" : "text-slate-500 hover:text-slate-700"}`}
        >
          <Eye className="w-4 h-4 mr-2" />
          Current Quiz
        </Button>
        <Button
          variant="ghost"
          onClick={() => setActiveView("saved")}
          className={`rounded-lg transition-all duration-300 ${activeView === "saved" ? "bg-white dark:bg-slate-800 text-blue-600 shadow-sm font-bold" : "text-slate-500 hover:text-slate-700"}`}
        >
          <Save className="w-4 h-4 mr-2" />
          Library <Badge className="ml-2 bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200">{savedQuizzes.length}</Badge>
        </Button>
      </div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        {activeView === "create" && (
          <motion.div
            key="create"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-0 shadow-xl bg-white dark:bg-slate-900 overflow-hidden ring-1 ring-slate-200 dark:ring-slate-800 rounded-2xl">
              <CardContent className="p-8 space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-base font-semibold text-slate-900 dark:text-slate-200">Source Material</Label>
                      <p className="text-sm text-slate-500">Paste lecture notes, text, or topic summary used to generate questions.</p>
                      <Textarea
                        placeholder="Enter content here..."
                        value={courseMaterial}
                        onChange={(e) => setCourseMaterial(e.target.value)}
                        rows={12}
                        className="bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:ring-blue-500/20 focus:border-blue-500 resize-none text-base leading-relaxed p-4 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="space-y-4">
                      <Label className="text-base font-semibold text-slate-900 dark:text-slate-200">Configuration</Label>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-xs font-semibold uppercase text-slate-500">Difficulty</Label>
                          <Select value={difficulty} onValueChange={setDifficulty}>
                            <SelectTrigger className="h-12 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="easy">Easy (Recall)</SelectItem>
                              <SelectItem value="medium">Medium (Apply)</SelectItem>
                              <SelectItem value="hard">Hard (Analyze)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-xs font-semibold uppercase text-slate-500">Quantity</Label>
                          <div className="relative">
                            <Input
                              type="number"
                              min="1"
                              max="20"
                              value={questionCount}
                              onChange={(e) => setQuestionCount(parseInt(e.target.value) || 5)}
                              className="h-12 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl pl-4"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                      <div className="flex items-center gap-3 mb-2">
                        <Zap className="w-5 h-5 text-blue-600" />
                        <h3 className="font-bold text-blue-900 dark:text-blue-100">Adaptive Mode Enabled</h3>
                      </div>
                      <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
                        The AI will analyze your source material and generate questions optimized for your selected difficulty level.
                      </p>
                    </div>

                    <Button
                      onClick={generateQuiz}
                      disabled={processing || !courseMaterial.trim()}
                      className="w-full h-14 text-lg font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      {processing ? (
                        <div className="flex items-center">
                          <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                          Analyzing Content...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <Sparkles className="w-5 h-5 mr-3" />
                          Generate Assessment
                        </div>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {activeView === "preview" && generatedQuiz && (
          <motion.div
            key="preview"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Quiz Header */}
            <Card className="border-0 shadow-lg bg-white dark:bg-slate-900">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{generatedQuiz.title}</h3>
                    <p className="text-slate-500">{generatedQuiz.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={saveQuiz} className="h-10 w-10 rounded-xl border-slate-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200">
                      <Save className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={copyQuiz} className="h-10 w-10 rounded-xl border-slate-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200">
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={downloadQuiz} className="h-10 w-10 rounded-xl border-slate-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Badge variant="secondary" className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 px-3 py-1 rounded-lg">
                    {generatedQuiz.totalQuestions} Questions
                  </Badge>
                  <Badge variant="secondary" className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 px-3 py-1 rounded-lg">
                    ~{generatedQuiz.timeLimit} Minutes
                  </Badge>
                  <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 hover:bg-blue-100 px-3 py-1 rounded-lg uppercase text-xs font-bold tracking-wider">
                    {generatedQuiz.difficulty}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Questions */}
            <div className="space-y-6">
              {generatedQuiz.questions.map((question, index) => (
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`border overflow-hidden transition-all duration-300 ${quizSubmitted && userAnswers[question.id] === question.correctAnswer
                    ? "border-green-200 dark:border-green-800 shadow-md"
                    : quizSubmitted && userAnswers[question.id] !== undefined
                      ? "border-red-200 dark:border-red-800 shadow-md"
                      : "border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700"
                    }`}>
                    <div className="p-6">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold text-sm">
                            {index + 1}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-3">
                            <Badge variant="outline" className="text-xs font-mono text-slate-400 border-slate-200">{question.points} PTS</Badge>
                            <Badge variant="outline" className="text-xs uppercase text-slate-400 border-slate-200">{question.type}</Badge>
                          </div>
                          <h4 className="text-lg font-medium text-slate-900 dark:text-white mb-6 leading-relaxed">{question.question}</h4>

                          {question.type !== "essay" && question.type !== "short-answer" && (
                            <div className="space-y-3">
                              {question.options.map((option, optionIndex) => (
                                <button
                                  key={optionIndex}
                                  onClick={() => !quizSubmitted && handleAnswerSelect(question.id, optionIndex)}
                                  disabled={quizSubmitted}
                                  className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between group ${userAnswers[question.id] === optionIndex
                                    ? quizSubmitted && optionIndex === question.correctAnswer
                                      ? "border-green-500 bg-green-50/50 dark:bg-green-900/20"
                                      : quizSubmitted
                                        ? "border-red-500 bg-red-50/50 dark:bg-red-900/20"
                                        : "border-blue-600 bg-blue-50/50 dark:bg-blue-900/20"
                                    : quizSubmitted && optionIndex === question.correctAnswer
                                      ? "border-green-500 bg-green-50/50 dark:bg-green-900/20"
                                      : "border-slate-100 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 bg-white dark:bg-slate-900"
                                    } ${quizSubmitted ? "cursor-default" : "cursor-pointer"}`}
                                >
                                  <span className={`font-medium ${userAnswers[question.id] === optionIndex ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white"}`}>{option}</span>
                                  {quizSubmitted && optionIndex === question.correctAnswer && <CheckCircle className="w-5 h-5 text-green-500" />}
                                  {quizSubmitted && userAnswers[question.id] === optionIndex && optionIndex !== question.correctAnswer && <XCircle className="w-5 h-5 text-red-500" />}
                                </button>
                              ))}
                            </div>
                          )}

                          {(question.type === "short-answer" || question.type === "essay") && (
                            <Textarea
                              placeholder="Type your answer here..."
                              rows={question.type === "essay" ? 6 : 3}
                              disabled={quizSubmitted}
                              className="w-full bg-slate-50 dark:bg-slate-950 border-slate-200"
                            />
                          )}
                        </div>
                      </div>

                      {quizSubmitted && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 ml-12"
                        >
                          <div className="flex gap-3">
                            <div className="mt-1">
                              <Sparkles className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                              <p className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-1">
                                AI Explanation
                              </p>
                              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                {question.explanation}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Submit Button */}
            {!quizSubmitted ? (
              <div className="sticky bottom-4">
                <Button
                  onClick={submitQuiz}
                  className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-white shadow-xl rounded-xl text-lg font-bold tracking-wide dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                >
                  Submit Assessment
                </Button>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl p-8 text-center shadow-xl space-y-6"
              >
                <div>
                  <h3 className="text-3xl font-black mb-2">ASSESSMENT COMPLETE</h3>
                  <p className="text-slate-400 dark:text-slate-600">Your adaptive learning profile has been updated.</p>
                </div>

                <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/10 dark:bg-slate-900/10 backdrop-blur-sm">
                  <TrendingUp className="w-5 h-5" />
                  <span className="font-bold tracking-wide">LEVEL REACHED: {adaptiveLevel.toUpperCase()}</span>
                </div>

                <div className="flex gap-4 max-w-md mx-auto">
                  <Button onClick={resetQuiz} variant="outline" className="flex-1 text-black border-white/20 hover:bg-white/10 dark:text-white dark:border-slate-900/20 dark:hover:bg-slate-900/10">
                    Retry
                  </Button>
                  <Button
                    onClick={() => {
                      resetQuiz()
                      setActiveView("create")
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-500 text-white border-0"
                  >
                    New Quiz
                  </Button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {activeView === "saved" && (
          <motion.div
            key="saved"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {savedQuizzes.length === 0 ? (
              <div className="col-span-full h-96 flex flex-col items-center justify-center text-center opacity-50">
                <Save className="w-16 h-16 mb-6" />
                <p className="text-xl font-medium">No saved assessments found.</p>
              </div>
            ) : (
              savedQuizzes.map((quiz, index) => (
                <Card key={quiz.id} className="group hover:border-blue-400 transition-all duration-300">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600">
                        <Target className="w-5 h-5" />
                      </div>
                      <Badge variant="outline" className="uppercase text-[10px] tracking-wider">{quiz.difficulty}</Badge>
                    </div>

                    <div>
                      <h4 className="font-bold text-lg mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">{quiz.title}</h4>
                      <p className="text-sm text-slate-500">{new Date(quiz.createdAt).toLocaleDateString()}</p>
                    </div>

                    <div className="pt-4 flex gap-2 border-t border-slate-100 dark:border-slate-800">
                      <Button
                        className="flex-1 bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900"
                        onClick={() => {
                          setGeneratedQuiz(quiz)
                          setActiveView("preview")
                        }}
                      >
                        Start
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="hover:text-red-600 hover:border-red-200"
                        onClick={() => {
                          const updated = savedQuizzes.filter((_, i) => i !== index)
                          setSavedQuizzes(updated)
                          toast.success("Quiz deleted")
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default InteractiveQuizGenerator
