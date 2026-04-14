import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import {
  Sparkles,
  Plus,
  Shuffle,
  BookOpen,
  Loader2,
  RotateCw,
  Check,
  X,
  Brain,
  Zap,
  Lightbulb,
  Layers
} from "lucide-react"
import toast from "react-hot-toast"
import { generateFlashcards as generateFlashcardsAI } from "@/lib/gemini-ai"

const FlashcardGenerator = () => {
  const [content, setContent] = useState("")
  const [flashcards, setFlashcards] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState("study") // study, quiz
  const [quizAnswers, setQuizAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [flashcardSet, setFlashcardSet] = useState(null)

  const generateFlashcards = async () => {
    if (!content.trim()) {
      toast.error("Please enter some content to generate flashcards")
      return
    }

    setLoading(true)
    try {
      const result = await generateFlashcardsAI(content, 10)
      setFlashcards(result.cards || [])
      setFlashcardSet(result)
      setCurrentIndex(0)
      setIsFlipped(false)
      setQuizAnswers({})
      setShowResults(false)
      setShowHint(false)
      toast.success(`Generated ${result.cards?.length || 0} enhanced flashcards!`)
    } catch (error) {
      console.error("Flashcard generation error:", error)
      toast.error("Failed to generate flashcards")

      // Fallback flashcards
      setFlashcards([
        {
          id: 1,
          front: "What is the main concept?",
          back: "Based on the provided content.",
          category: "General",
          categoryEmoji: "📚",
          difficulty: "medium",
          difficultyEmoji: "🟡",
          hint: "Think about the core idea",
          memoryTip: "Relate it to something familiar"
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const nextCard = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setIsFlipped(false)
      setShowHint(false)
    }
  }

  const prevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setIsFlipped(false)
      setShowHint(false)
    }
  }

  const shuffle = () => {
    const shuffled = [...flashcards].sort(() => Math.random() - 0.5)
    setFlashcards(shuffled)
    setCurrentIndex(0)
    setIsFlipped(false)
    setShowHint(false)
    toast.success("Flashcards shuffled")
  }

  const markAnswer = (correct) => {
    setQuizAnswers({
      ...quizAnswers,
      [flashcards[currentIndex].id]: correct
    })

    setTimeout(() => {
      if (currentIndex < flashcards.length - 1) {
        nextCard()
      } else {
        setShowResults(true)
      }
    }, 300)
  }

  const resetQuiz = () => {
    setQuizAnswers({})
    setCurrentIndex(0)
    setIsFlipped(false)
    setShowResults(false)
    setShowHint(false)
  }

  const currentCard = flashcards[currentIndex]
  const correctCount = Object.values(quizAnswers).filter(v => v).length
  const totalAnswered = Object.keys(quizAnswers).length

  return (
    <div className="container mx-auto p-4 max-w-5xl space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Layers className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                FLASHCARD<span className="text-blue-600">GENERATOR</span>
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">AI Powered Study Tool</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {flashcards.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-0 shadow-xl bg-white dark:bg-slate-900 overflow-hidden ring-1 ring-slate-200 dark:ring-slate-800 rounded-2xl">
            <CardContent className="p-8 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-200 mb-2">
                  Source Material
                </h3>
                <p className="text-sm text-slate-500 mb-4">
                  Paste your notes, textbook excerpts, or any educational content below.
                </p>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="E.g., The mitochondria is the powerhouse of the cell..."
                  className="min-h-[240px] bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:ring-blue-500/20 focus:border-blue-500 resize-none text-base leading-relaxed p-4 rounded-xl"
                />
              </div>

              <Button
                onClick={generateFlashcards}
                disabled={loading || !content.trim()}
                className="w-full h-14 text-lg font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? (
                  <div className="flex items-center">
                    <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                    Analyzing Content...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Sparkles className="w-5 h-5 mr-3" />
                    Generate Flashcards
                  </div>
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {/* Controls */}
          <div className="flex flex-wrap justify-between items-center gap-4 bg-slate-100 dark:bg-slate-800/50 p-2 rounded-2xl">
            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={() => {
                  setMode("study")
                  resetQuiz()
                }}
                className={`rounded-xl transition-all duration-300 ${mode === "study" ? "bg-white dark:bg-slate-800 text-blue-600 shadow-sm font-bold" : "text-slate-500 hover:text-slate-700"}`}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Study Mode
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setMode("quiz")
                  resetQuiz()
                }}
                className={`rounded-xl transition-all duration-300 ${mode === "quiz" ? "bg-white dark:bg-slate-800 text-blue-600 shadow-sm font-bold" : "text-slate-500 hover:text-slate-700"}`}
              >
                <Zap className="w-4 h-4 mr-2" />
                Quiz Mode
              </Button>
            </div>

            <div className="flex gap-2">
              <Button variant="ghost" onClick={shuffle} className="text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl">
                <Shuffle className="w-4 h-4 mr-2" />
                Shuffle
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setFlashcards([])
                  setContent("")
                }}
                className="text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Set
              </Button>
            </div>
          </div>

          {/* Progress */}
          <div className="flex items-center justify-between px-4">
            <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">
              Card {currentIndex + 1} / {flashcards.length}
            </span>
            {mode === "quiz" && totalAnswered > 0 && (
              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200">
                Score: {correctCount}/{totalAnswered}
              </Badge>
            )}
          </div>

          {/* Flashcard Area */}
          {!showResults ? (
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="relative perspective-1000"
            >
              <div
                className="relative min-h-[400px] w-full"
                onClick={() => mode === "study" && setIsFlipped(!isFlipped)}
              >
                <AnimatePresence mode="wait">
                  {!isFlipped ? (
                    <motion.div
                      key="front"
                      initial={{ rotateY: -90, opacity: 0 }}
                      animate={{ rotateY: 0, opacity: 1 }}
                      exit={{ rotateY: 90, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0"
                    >
                      <Card className="h-full border-0 shadow-lg ring-1 ring-slate-200 dark:ring-slate-800 bg-white dark:bg-slate-900 rounded-3xl cursor-pointer hover:shadow-xl transition-shadow flex flex-col items-center justify-center p-8 md:p-12 text-center">

                        {/* Badges */}
                        <div className="absolute top-6 left-6 flex gap-2">
                          {currentCard?.difficultyEmoji && (
                            <Badge variant="outline" className="border-slate-200 text-slate-500">
                              {currentCard.difficultyEmoji} {currentCard.difficulty}
                            </Badge>
                          )}
                        </div>
                        <div className="absolute top-6 right-6">
                          {currentCard?.categoryEmoji && (
                            <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-200 border-0">
                              {currentCard.categoryEmoji} {currentCard.category}
                            </Badge>
                          )}
                        </div>

                        <div className="w-20 h-20 rounded-2xl bg-blue-50 dark:bg-slate-800 flex items-center justify-center mb-8">
                          <Brain className="w-10 h-10 text-blue-600" />
                        </div>

                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
                          {currentCard?.front || currentCard?.question}
                        </h2>

                        {/* Hint button */}
                        {currentCard?.hint && (
                          <div className="mt-4" onClick={(e) => e.stopPropagation()}>
                            {!showHint ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowHint(true)}
                                className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                              >
                                <Lightbulb className="w-4 h-4 mr-2" />
                                Show Hint
                              </Button>
                            ) : (
                              <motion.div
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-yellow-50 text-yellow-800 px-4 py-2 rounded-lg text-sm font-medium border border-yellow-100"
                              >
                                💡 {currentCard.hint}
                              </motion.div>
                            )}
                          </div>
                        )}

                        {mode === "study" && (
                          <div className="absolute bottom-6 text-slate-400 text-sm font-medium animate-pulse">
                            Click to flip
                          </div>
                        )}
                      </Card>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="back"
                      initial={{ rotateY: 90, opacity: 0 }}
                      animate={{ rotateY: 0, opacity: 1 }}
                      exit={{ rotateY: -90, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0"
                    >
                      <Card className="h-full border-0 shadow-lg ring-1 ring-blue-100 dark:ring-blue-900 bg-slate-50 dark:bg-slate-900/50 rounded-3xl cursor-pointer flex flex-col items-center justify-center p-8 md:p-12 text-center">

                        <div className="w-20 h-20 rounded-2xl bg-blue-600 flex items-center justify-center mb-8 shadow-lg shadow-blue-500/20">
                          <Sparkles className="w-10 h-10 text-white" />
                        </div>

                        <p className="text-xl md:text-2xl font-medium text-slate-800 dark:text-slate-100 mb-6 leading-relaxed">
                          {currentCard?.back || currentCard?.answer}
                        </p>

                        {/* Memory tip */}
                        {currentCard?.memoryTip && (
                          <div className="mt-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-4 rounded-xl shadow-sm text-sm text-slate-600 dark:text-slate-300 max-w-lg">
                            <strong className="text-blue-600 block mb-1">Memory Tip</strong>
                            {currentCard.memoryTip}
                          </div>
                        )}
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="bg-slate-900 text-white rounded-3xl p-12 text-center shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 p-32 bg-purple-500/10 rounded-full blur-3xl -ml-16 -mb-16"></div>

                <div className="relative z-10">
                  <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-6 ring-4 ring-slate-700">
                    <Check className="w-12 h-12 text-green-400" />
                  </div>

                  <h2 className="text-4xl font-black mb-2">Quiz Complete!</h2>
                  <p className="text-slate-400 mb-8 text-lg">You've mastered this set.</p>

                  <div className="flex justify-center gap-8 mb-10">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-400">{correctCount}</div>
                      <div className="text-xs uppercase tracking-wider text-slate-500 font-bold">Correct</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-slate-200">{flashcards.length}</div>
                      <div className="text-xs uppercase tracking-wider text-slate-500 font-bold">Total</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-400">{((correctCount / flashcards.length) * 100).toFixed(0)}%</div>
                      <div className="text-xs uppercase tracking-wider text-slate-500 font-bold">Score</div>
                    </div>
                  </div>

                  <Button
                    onClick={resetQuiz}
                    size="lg"
                    className="bg-white text-slate-900 hover:bg-slate-200 font-bold px-8 h-12 rounded-xl"
                  >
                    <RotateCw className="w-4 h-4 mr-2" />
                    Study Again
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Navigation Controls */}
          {!showResults && (
            <div className="flex justify-between items-center pt-4">
              <Button
                variant="outline"
                onClick={prevCard}
                disabled={currentIndex === 0}
                className="rounded-xl border-slate-200 hover:bg-slate-50 text-slate-600"
              >
                Previous
              </Button>

              <div className="flex gap-4">
                {mode === "quiz" && isFlipped && (
                  <>
                    <Button
                      onClick={() => markAnswer(false)}
                      className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl px-6"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Got it Wrong
                    </Button>
                    <Button
                      onClick={() => markAnswer(true)}
                      className="bg-green-50 hover:bg-green-100 text-green-600 border border-green-200 rounded-xl px-6"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Got it Right
                    </Button>
                  </>
                )}

                {mode === "study" && (
                  <Button
                    onClick={() => setIsFlipped(!isFlipped)}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/20 px-8"
                  >
                    <RotateCw className="w-4 h-4 mr-2" />
                    Flip Card
                  </Button>
                )}
              </div>

              <Button
                variant="outline"
                onClick={mode === "quiz" && !isFlipped ? () => setIsFlipped(true) : nextCard}
                disabled={currentIndex === flashcards.length - 1 && (mode === "study" || isFlipped)}
                className="rounded-xl border-slate-200 hover:bg-slate-50 text-slate-600"
              >
                {mode === "quiz" && !isFlipped ? "Show Answer" : "Next"}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default FlashcardGenerator
