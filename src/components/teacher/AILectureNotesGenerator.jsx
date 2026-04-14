import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { motion, AnimatePresence } from "framer-motion"
import {
  Upload,
  FileText,
  Presentation,
  Brain,
  Download,
  Sparkles,
  Video,
  Music,
  X,
  CheckCircle,
  Loader2,
  FileAudio,
  Copy,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Maximize2
} from "lucide-react"
import toast from "react-hot-toast"
import { useDropzone } from "react-dropzone"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { generateLectureNotes, generateSlides, generateMindMap } from "@/lib/gemini-ai"
import pptxgen from "pptxgenjs"
import MindMapVisualization from "./MindMapVisualization"

const AILectureNotesGenerator = () => {
  const [activeTab, setActiveTab] = useState("upload")
  const [uploadedFile, setUploadedFile] = useState(null)
  const [courseOutline, setCourseOutline] = useState("")
  const [courseContent, setcourseContent] = useState("")
  const [processing, setProcessing] = useState(false)
  const [generatedNotes, setGeneratedNotes] = useState(null)
  const [generatedSlides, setGeneratedSlides] = useState(null)
  const [generatedMindMap, setGeneratedMindMap] = useState(null)
  const [activeOutput, setActiveOutput] = useState("notes")
  const [currentSlide, setCurrentSlide] = useState(0)

  // Export slides to PPTX
  const exportToPPTX = () => {
    if (!generatedSlides || !generatedSlides.slides) {
      toast.error("No slides to export")
      return
    }

    try {
      const pptx = new pptxgen()
      pptx.layout = "LAYOUT_16x9"
      pptx.title = generatedSlides.title || "AI Generated Presentation"
      pptx.author = "EduManage AI"

      generatedSlides.slides.forEach((slideData, index) => {
        const slide = pptx.addSlide()

        // Add solid background
        slide.background = {
          color: index === 0 ? "2563eb" : "0f172a" // blue-600 : slate-900
        }

        // Title slide styling
        if (index === 0 || slideData.type === "title") {
          slide.addText(slideData.title || `Slide ${slideData.slideNumber}`, {
            x: 0.5, y: 2, w: "90%", h: 1.5,
            fontSize: 44, bold: true, color: "FFFFFF",
            align: "center", fontFace: "Arial"
          })
          if (slideData.subtitle) {
            slide.addText(slideData.subtitle, {
              x: 0.5, y: 3.5, w: "90%", h: 0.8,
              fontSize: 24, color: "94a3b8",
              align: "center", fontFace: "Arial"
            })
          }
        } else {
          // Content slide styling
          slide.addText(slideData.title || `Slide ${slideData.slideNumber}`, {
            x: 0.5, y: 0.3, w: "90%", h: 0.8,
            fontSize: 32, bold: true, color: "FFFFFF",
            fontFace: "Arial"
          })

          // Add content bullets
          if (slideData.content && slideData.content.length > 0) {
            const bulletPoints = slideData.content.map(item => ({
              text: item.replace(/^[•\-]\s*/, ""),
              options: { bullet: true, color: "e2e8f0" }
            }))

            slide.addText(bulletPoints, {
              x: 0.5, y: 1.3, w: "90%", h: 3.5,
              fontSize: 20, color: "e2e8f0",
              fontFace: "Arial", valign: "top",
              lineSpacingMultiple: 1.5
            })
          }
        }

        // Add speaker notes if available
        if (slideData.speakerNotes || slideData.notes) {
          slide.addNotes(slideData.speakerNotes || slideData.notes)
        }
      })

      pptx.writeFile({ fileName: `${generatedSlides.title || "presentation"}.pptx` })
      toast.success("PowerPoint downloaded successfully!")
    } catch (error) {
      console.error("PPTX export error:", error)
      toast.error("Failed to export PowerPoint")
    }
  }

  // Dropzone for file upload
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      setUploadedFile(file)
      toast.success(`File "${file.name}" uploaded successfully!`)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.avi', '.mov', '.mkv'],
      'audio/*': ['.mp3', '.wav', '.m4a', '.ogg']
    },
    maxFiles: 1
  })

  // Simulate AI processing for audio/video to notes
  const processMediaToNotes = async () => {
    if (!uploadedFile) {
      toast.error("Please upload a media file first")
      return
    }

    setProcessing(true)
    setActiveOutput("notes")

    try {
      // In a real implementation, you would transcribe the audio/video first
      // For now, we'll use the filename as context for AI generation
      const transcript = `This is a lecture about ${uploadedFile.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ")}. The content covers educational concepts and teaching methodologies.`;

      const notes = await generateLectureNotes(uploadedFile.name, transcript);
      setGeneratedNotes(notes);
      toast.success("Notes generated successfully with AI!");
    } catch (error) {
      console.error("Error generating notes:", error);
      toast.error("Failed to generate notes. Please try again.");
    } finally {
      setProcessing(false);
    }
  }

  // Generate slides from course outline
  const generateSlidesFromOutline = async () => {
    if (!courseOutline.trim()) {
      toast.error("Please enter a course outline")
      return
    }

    setProcessing(true)
    setActiveOutput("slides")

    try {
      const slides = await generateSlides(courseOutline);
      setGeneratedSlides(slides);
      toast.success("Slides generated successfully with AI!");
    } catch (error) {
      console.error("Error generating slides:", error);
      toast.error("Failed to generate slides. Please try again.");
    } finally {
      setProcessing(false);
    }
  }

  // Generate mind map from course content
  const generateMindMapFromContent = async () => {
    if (!courseContent.trim()) {
      toast.error("Please enter course content")
      return
    }

    setProcessing(true)
    setActiveOutput("mindmap")

    try {
      const mindMap = await generateMindMap(courseContent);
      setGeneratedMindMap(mindMap);
      toast.success("Mind map generated successfully with AI!");
    } catch (error) {
      console.error("Error generating mind map:", error);
      toast.error("Failed to generate mind map. Please try again.");
    } finally {
      setProcessing(false);
    }
  }

  // Copy content to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard!")
  }

  // Download content as file
  const downloadContent = (content, filename) => {
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success("Download started!")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-none shadow-none bg-transparent">
          <CardContent className="p-0">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  LECTURE<span className="text-blue-600">NOTES</span>
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Transform your lectures into structured notes, slides, and mind maps
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tab Navigation */}
      {/* Tab Navigation */}
      <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800/50 rounded-xl w-fit">
        <Button
          variant="ghost"
          onClick={() => setActiveTab("upload")}
          className={`rounded-lg transition-all duration-300 ${activeTab === "upload" ? "bg-white dark:bg-slate-800 text-blue-600 shadow-sm font-bold" : "text-slate-500 hover:text-slate-700"}`}
        >
          <Video className="w-4 h-4 mr-2" />
          Media to Notes
        </Button>
        <Button
          variant="ghost"
          onClick={() => setActiveTab("slides")}
          className={`rounded-lg transition-all duration-300 ${activeTab === "slides" ? "bg-white dark:bg-slate-800 text-blue-600 shadow-sm font-bold" : "text-slate-500 hover:text-slate-700"}`}
        >
          <Presentation className="w-4 h-4 mr-2" />
          Generate Slides
        </Button>
        <Button
          variant="ghost"
          onClick={() => setActiveTab("mindmap")}
          className={`rounded-lg transition-all duration-300 ${activeTab === "mindmap" ? "bg-white dark:bg-slate-800 text-blue-600 shadow-sm font-bold" : "text-slate-500 hover:text-slate-700"}`}
        >
          <Brain className="w-4 h-4 mr-2" />
          Create Mind Map
        </Button>
      </div>

      {/* Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card className="border-none shadow-sm">
          <CardContent className="p-6">
            <AnimatePresence mode="wait">
              {activeTab === "upload" && (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <h3 className="text-xl font-semibold mb-4">Upload Audio/Video</h3>

                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${isDragActive
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-slate-200 dark:border-slate-800 hover:border-blue-400"
                      }`}
                  >
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center gap-3">
                      {uploadedFile ? (
                        <>
                          <CheckCircle className="w-12 h-12 text-green-500" />
                          <p className="font-medium text-gray-900 dark:text-white">
                            {uploadedFile.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              setUploadedFile(null)
                            }}
                          >
                            <X className="w-4 h-4 mr-2" />
                            Remove
                          </Button>
                        </>
                      ) : (
                        <>
                          {isDragActive ? (
                            <Upload className="w-12 h-12 text-blue-500 animate-bounce" />
                          ) : (
                            <div className="flex gap-4">
                              <Video className="w-12 h-12 text-gray-400" />
                              <FileAudio className="w-12 h-12 text-gray-400" />
                            </div>
                          )}
                          <p className="font-medium text-gray-900 dark:text-white">
                            {isDragActive ? "Drop the file here" : "Drag & drop media file"}
                          </p>
                          <p className="text-sm text-gray-500">
                            or click to browse (MP4, AVI, MOV, MP3, WAV)
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  <Button
                    onClick={processMediaToNotes}
                    disabled={processing || !uploadedFile}
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20"
                  >
                    {processing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate Notes
                      </>
                    )}
                  </Button>
                </motion.div>
              )}

              {activeTab === "slides" && (
                <motion.div
                  key="slides"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <h3 className="text-xl font-semibold mb-4">Course Outline</h3>

                  <div className="space-y-3">
                    <Label htmlFor="outline">Enter your course outline or topics</Label>
                    <Textarea
                      id="outline"
                      placeholder="Example:&#10;1. Introduction to React&#10;2. Components and Props&#10;3. State Management&#10;4. Hooks and Lifecycle&#10;5. Advanced Patterns"
                      value={courseOutline}
                      onChange={(e) => setCourseOutline(e.target.value)}
                      rows={12}
                      className="font-mono text-sm"
                    />
                  </div>

                  <Button
                    onClick={generateSlidesFromOutline}
                    disabled={processing || !courseOutline.trim()}
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20"
                  >
                    {processing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating with AI...
                      </>
                    ) : (
                      <>
                        <Presentation className="w-4 h-4 mr-2" />
                        Generate Slides
                      </>
                    )}
                  </Button>
                </motion.div>
              )}

              {activeTab === "mindmap" && (
                <motion.div
                  key="mindmap"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <h3 className="text-xl font-semibold mb-4">Course Content</h3>

                  <div className="space-y-3">
                    <Label htmlFor="content">Enter your course content or key concepts</Label>
                    <Textarea
                      id="content"
                      placeholder="Example:&#10;React is a JavaScript library for building user interfaces. Key concepts include components, props, state, hooks, and the virtual DOM. Components are reusable pieces of UI..."
                      value={courseContent}
                      onChange={(e) => setcourseContent(e.target.value)}
                      rows={12}
                      className="text-sm"
                    />
                  </div>

                  <Button
                    onClick={generateMindMapFromContent}
                    disabled={processing || !courseContent.trim()}
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20"
                  >
                    {processing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating with AI...
                      </>
                    ) : (
                      <>
                        <Brain className="w-4 h-4 mr-2" />
                        Create Mind Map
                      </>
                    )}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Output Section */}
        <Card className="border-none shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Generated Output</h3>
              {(generatedNotes || generatedSlides || generatedMindMap) && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      let content = ""
                      let filename = "output.txt"

                      if (activeOutput === "notes" && generatedNotes) {
                        content = generatedNotes.detailedNotes
                        filename = "lecture-notes.md"
                      } else if (activeOutput === "slides" && generatedSlides) {
                        content = JSON.stringify(generatedSlides, null, 2)
                        filename = "slides.json"
                      } else if (activeOutput === "mindmap" && generatedMindMap) {
                        content = JSON.stringify(generatedMindMap, null, 2)
                        filename = "mindmap.json"
                      }

                      copyToClipboard(content)
                    }}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      let content = ""
                      let filename = "output.txt"

                      if (activeOutput === "notes" && generatedNotes) {
                        content = generatedNotes.detailedNotes
                        filename = "lecture-notes.md"
                      } else if (activeOutput === "slides" && generatedSlides) {
                        content = JSON.stringify(generatedSlides, null, 2)
                        filename = "slides.json"
                      } else if (activeOutput === "mindmap" && generatedMindMap) {
                        content = JSON.stringify(generatedMindMap, null, 2)
                        filename = "mindmap.json"
                      }

                      downloadContent(content, filename)
                    }}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>

            <AnimatePresence mode="wait">
              {generatedNotes && activeOutput === "notes" && (
                <motion.div
                  key="notes-output"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-slate-800">
                    <h4 className="font-bold text-lg mb-2">{generatedNotes.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {generatedNotes.summary}
                    </p>
                    <div className="flex gap-4 text-sm text-gray-500">
                      <span>📊 {generatedNotes.wordCount} words</span>
                      <span>📅 {new Date(generatedNotes.timestamp).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-semibold mb-2">Key Points:</h5>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {generatedNotes.keyPoints.map((point, idx) => (
                        <li key={idx} className="text-gray-700 dark:text-gray-300">{point}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 max-h-96 overflow-y-auto prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {generatedNotes.detailedNotes}
                    </ReactMarkdown>
                  </div>
                </motion.div>
              )}

              {generatedSlides && activeOutput === "slides" && (
                <motion.div
                  key="slides-output"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  {/* Header with export button */}
                  <div className="flex items-center justify-between">
                    <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-800 flex-1">
                      <h4 className="font-bold text-lg mb-1">{generatedSlides.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        📊 {generatedSlides.totalSlides || generatedSlides.slides?.length} slides generated
                      </p>
                    </div>
                    <Button
                      onClick={exportToPPTX}
                      className="ml-4 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export PPTX
                    </Button>
                  </div>

                  {/* Visual Slide Preview */}
                  <div className="relative">
                    {/* Slide Display - looks like a real PPT slide */}
                    <div
                      className="aspect-video rounded-xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700"
                      style={{
                        background: currentSlide === 0
                          ? "#1e3a8a"
                          : "#0f172a"
                      }}
                    >
                      <div className="h-full flex flex-col justify-center p-8 md:p-12">
                        {generatedSlides.slides[currentSlide] && (
                          <>
                            {/* Slide Title */}
                            <h3 className={`font-bold text-white mb-4 ${currentSlide === 0 ? "text-3xl md:text-4xl text-center" : "text-2xl md:text-3xl"
                              }`}>
                              {generatedSlides.slides[currentSlide].title}
                            </h3>

                            {/* Subtitle for title slide */}
                            {currentSlide === 0 && generatedSlides.slides[currentSlide].subtitle && (
                              <p className="text-lg text-blue-200 text-center mt-2">
                                {generatedSlides.slides[currentSlide].subtitle}
                              </p>
                            )}

                            {/* Content bullets */}
                            {currentSlide !== 0 && generatedSlides.slides[currentSlide].content && (
                              <ul className="space-y-3 mt-4">
                                {generatedSlides.slides[currentSlide].content.map((item, idx) => (
                                  <motion.li
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="flex items-start gap-3 text-gray-100 text-lg"
                                  >
                                    <span className="text-blue-400 mt-1">•</span>
                                    <span>{item.replace(/^[•\-]\s*/, "")}</span>
                                  </motion.li>
                                ))}
                              </ul>
                            )}
                          </>
                        )}
                      </div>

                      {/* Slide number indicator */}
                      <div className="absolute bottom-4 right-4 bg-black/30 text-white px-3 py-1 rounded-full text-sm">
                        {currentSlide + 1} / {generatedSlides.slides.length}
                      </div>
                    </div>

                    {/* Navigation Controls */}
                    <div className="flex items-center justify-center gap-4 mt-4">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
                        disabled={currentSlide === 0}
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </Button>

                      <div className="flex gap-1">
                        {generatedSlides.slides.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentSlide(idx)}
                            className={`w-2 h-2 rounded-full transition-all ${idx === currentSlide
                              ? "bg-blue-600 w-6"
                              : "bg-slate-200 dark:bg-slate-700 hover:bg-blue-400"
                              }`}
                          />
                        ))}
                      </div>

                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setCurrentSlide(prev => Math.min(generatedSlides.slides.length - 1, prev + 1))}
                        disabled={currentSlide === generatedSlides.slides.length - 1}
                      >
                        <ChevronRight className="w-5 h-5" />
                      </Button>
                    </div>

                    {/* Speaker Notes */}
                    {(generatedSlides.slides[currentSlide]?.speakerNotes || generatedSlides.slides[currentSlide]?.notes) && (
                      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <h5 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                          💡 Speaker Notes
                        </h5>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {generatedSlides.slides[currentSlide].speakerNotes || generatedSlides.slides[currentSlide].notes}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Slide Thumbnails */}
                  <div className="grid grid-cols-5 md:grid-cols-8 gap-2 mt-4">
                    {generatedSlides.slides.map((slide, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentSlide(idx)}
                        className={`aspect-video rounded-md text-xs font-bold text-white flex items-center justify-center transition-all ${idx === currentSlide
                          ? "ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-900"
                          : "opacity-60 hover:opacity-100"
                          }`}
                        style={{
                          background: idx === 0
                            ? "#1e3a8a"
                            : "#0f172a"
                        }}
                      >
                        {idx + 1}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {generatedMindMap && activeOutput === "mindmap" && (
                <motion.div
                  key="mindmap-output"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-slate-800">
                    <h4 className="font-bold text-lg mb-2 text-center">
                      🧠 {generatedMindMap.centralTopic}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                      {generatedMindMap.totalNodes} nodes mapped
                    </p>
                  </div>

                  {/* Visual Mind Map */}
                  <MindMapVisualization mindMapData={generatedMindMap} />
                </motion.div>
              )}

              {!generatedNotes && !generatedSlides && !generatedMindMap && (
                <div className="flex flex-col items-center justify-center h-96 text-gray-400">
                  <FileText className="w-16 h-16 mb-4" />
                  <p className="text-center">
                    Your generated content will appear here
                  </p>
                </div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AILectureNotesGenerator
