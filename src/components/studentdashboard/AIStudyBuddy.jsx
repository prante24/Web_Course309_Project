import { useState, useRef, useEffect, useContext } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import {
  MessageSquare,
  Send,
  Sparkles,
  Bot,
  User,
  Trash2,
  Cpu,
  Zap
} from "lucide-react"
import toast from "react-hot-toast"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { studyBuddyChat } from "@/lib/gemini-ai"
import { AuthContext } from "@/provider/AuthProvider"

const AIStudyBuddy = () => {
  const { user } = useContext(AuthContext)
  const [enrolledClasses, setEnrolledClasses] = useState([])
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "ai",
      content: `Greetings${user?.displayName ? ` ${user.displayName.split(' ')[0]}` : ''}. I am **Study Buddy**, your advanced AI learning assistant.\n\nI have access to your enrolled courses and can help you study more effectively. What shall we focus on?`,
      timestamp: new Date().toISOString()
    }
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const fetchEnrolledClasses = async () => {
      if (!user?.email) return
      try {
        const userRes = await fetch('https://edumanagebackend.vercel.app/users')
        const users = await userRes.json()
        const userId = users.find((u) => u.email === user?.email)?.uid

        if (userId) {
          const classesResponse = await fetch(`https://edumanagebackend.vercel.app/enrolled-classes/${userId}`)
          if (classesResponse.ok) {
            const classesData = await classesResponse.json()
            setEnrolledClasses(classesData.enrolledClasses || [])
          }
        }
      } catch (error) {
        console.error("Failed to fetch enrolled classes:", error)
      }
    }
    fetchEnrolledClasses()
  }, [user])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: input,
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    try {
      const userContext = {
        name: user?.displayName || "",
        email: user?.email || "",
        classes: enrolledClasses
      }

      const aiResponse = await studyBuddyChat(input, messages, userContext)

      setMessages(prev => [...prev, {
        id: Date.now(),
        type: "ai",
        content: aiResponse,
        timestamp: new Date().toISOString()
      }])
    } catch (error) {
      console.error("AI chat error:", error)
      toast.error("Connection interrupted.")
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: "ai",
        content: "System error. Unable to process request. Please retry.",
        timestamp: new Date().toISOString()
      }])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const clearChat = () => {
    setMessages([{
      id: 1,
      type: "ai",
      content: "Memory cleared. I am ready to assist with your studies.",
      timestamp: new Date().toISOString()
    }])
    toast.success("Memory purged")
  }

  const quickQuestions = [
    "Explain concept",
    "Study plan",
    "Quiz me",
    "Key points"
  ]

  return (
    <div className="container mx-auto p-4 max-w-6xl min-h-[calc(100vh-100px)] flex flex-col justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6 px-2">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.3)] border border-blue-400/30">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500 border-2 border-white"></span>
              </span>
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white uppercase flex items-center gap-2">
                STUDY<span className="text-blue-600">AGENT</span>
              </h1>
              <div className="flex items-center gap-2 text-sm text-slate-500 font-mono">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                SYSTEM ONLINE
                <span className="text-xs px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800">V12.5</span>
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            className="border-slate-200 dark:border-slate-800 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-300"
            onClick={clearChat}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            RESET MEMORY
          </Button>
        </div>

        {/* Main Interface */}
        <Card className="border-0 shadow-2xl bg-white dark:bg-slate-950 overflow-hidden ring-1 ring-slate-200 dark:ring-slate-800 rounded-3xl">
          <div className="flex flex-col h-[700px]">

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-slate-50/50 dark:bg-slate-900/50 relative">
              {/* Grid Background Pattern */}
              <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
                style={{
                  backgroundImage: 'linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)',
                  backgroundSize: '40px 40px'
                }}>
              </div>

              <AnimatePresence mode="popLayout">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, x: message.type === "ai" ? -20 : 20, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    className={`relative z-10 flex gap-4 ${message.type === "user" ? "flex-row-reverse" : ""}`}
                  >
                    {/* Avatar */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg ${message.type === "user"
                      ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                      : "bg-blue-600 text-white"
                      }`}>
                      {message.type === "user" ? <User className="w-5 h-5" /> : <Cpu className="w-5 h-5" />}
                    </div>

                    {/* Message Bubble */}
                    <div className={`flex flex-col max-w-[80%] ${message.type === "user" ? "items-end" : "items-start"}`}>
                      <div className={`group relative px-6 py-4 rounded-2xl shadow-sm text-[15px] leading-relaxed transition-all duration-200 
                        ${message.type === "user"
                          ? "bg-blue-600 text-white rounded-tr-sm"
                          : "bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-tl-sm hover:shadow-md"
                        }`}>
                        <div className="prose dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:p-0 prose-pre:border-0 prose-pre:bg-transparent">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              // Style images for cool look
                              img: ({ node, ...props }) => (
                                <img className="rounded-lg shadow-lg max-w-full my-4 border-2 border-blue-100 dark:border-blue-900/50" {...props} />
                              ),
                              code: ({ node, inline, className, children, ...props }) => (
                                inline
                                  ? <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-sm font-mono text-blue-600 dark:text-blue-400" {...props}>{children}</code>
                                  : <div className="bg-slate-950 text-slate-50 p-4 rounded-xl my-4 border border-slate-800 overflow-x-auto shadow-inner">
                                    <code className="!bg-transparent !text-slate-50 text-sm font-mono" {...props}>{children}</code>
                                  </div>
                              )
                            }}
                          >
                            {message.content}
                          </ReactMarkdown>
                        </div>
                      </div>
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 mt-2 font-mono px-1">
                        {message.type === 'ai' ? 'AGENT' : 'YOU'} • {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Agentic Thinking Animation */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Cpu className="w-5 h-5 text-white animate-pulse" />
                  </div>
                  <div className="bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-900/50 px-6 py-4 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <motion.div
                        className="w-2.5 h-2.5 bg-blue-600 rounded-sm"
                        animate={{ scale: [1, 1.5, 1], rotate: [0, 90, 180] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      />
                      <motion.div
                        className="w-2.5 h-2.5 bg-blue-500 rounded-sm"
                        animate={{ scale: [1, 1.5, 1], rotate: [0, -90, -180] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                      />
                      <motion.div
                        className="w-2.5 h-2.5 bg-blue-400 rounded-sm"
                        animate={{ scale: [1, 1.5, 1], rotate: [0, 90, 180] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                      />
                    </div>
                    <span className="text-xs font-mono text-blue-600 dark:text-blue-400 font-bold tracking-widest animate-pulse">
                      PROCESSING DATA...
                    </span>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-900">
              {/* Quick Chips */}
              <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-none">
                {quickQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(q)}
                    className="px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 
                             text-slate-600 dark:text-slate-400 text-xs font-bold uppercase tracking-wide rounded-lg
                             hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-200 dark:hover:border-blue-800
                             transition-all duration-200 whitespace-nowrap"
                  >
                    {q}
                  </button>
                ))}
              </div>

              <div className="relative group">
                <div className="absolute -inset-0.5 bg-blue-200 dark:bg-blue-900/30 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none"></div>
                <div className="relative flex items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-2xl border-2 border-slate-100 dark:border-slate-800 focus-within:border-blue-500 transition-colors duration-300">
                  <div className="p-2">
                    <Sparkles className="w-5 h-5 text-blue-500" />
                  </div>
                  <Input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter command or query..."
                    className="flex-1 border-0 focus-visible:ring-0 bg-transparent text-lg placeholder:text-slate-300 dark:placeholder:text-slate-600 p-2 h-auto"
                    disabled={isTyping}
                  />
                  <Button
                    onClick={handleSend}
                    disabled={!input.trim() || isTyping}
                    className="h-12 w-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                  >
                    {isTyping ? <Zap className="w-5 h-5 animate-pulse" /> : <Send className="w-5 h-5" />}
                  </Button>
                </div>
              </div>
              <div className="text-center mt-3">
                <p className="text-[10px] text-slate-400 font-mono tracking-widest">
                  POWERED BY ADVANCED GEMINI MODELS • SECURE CHANNEL
                </p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

export default AIStudyBuddy
