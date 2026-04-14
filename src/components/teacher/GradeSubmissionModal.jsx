import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import axios from "axios"
import { motion } from "framer-motion"
import { Award, Loader2, MessageSquare, User, Star } from "lucide-react"
import toast from "react-hot-toast"
import PropTypes from "prop-types"

const GradeSubmissionModal = ({
    isOpen,
    onClose,
    submission,
    maxPoints,
    onGradeComplete,
}) => {
    const [grade, setGrade] = useState("")
    const [feedback, setFeedback] = useState("")
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (submission) {
            setGrade(submission.grade ?? "")
            setFeedback(submission.feedback ?? "")
        }
    }, [submission])

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (Number(grade) < 0 || Number(grade) > maxPoints) {
            toast.error(`Grade must be between 0 and ${maxPoints}`)
            return
        }

        setLoading(true)
        try {
            await axios.put(`https://edumanagebackend.vercel.app/submissions/${submission._id}/grade`, {
                grade: Number(grade),
                feedback,
            })
            toast.success("Grade saved successfully!")
            onGradeComplete()
        } catch (error) {
            console.error("Error grading submission:", error)
            toast.error("Failed to save grade")
        } finally {
            setLoading(false)
        }
    }

    const handleClose = () => {
        setGrade("")
        setFeedback("")
        onClose()
    }

    const getGradeColor = () => {
        const percentage = (Number(grade) / maxPoints) * 100
        if (percentage >= 90) return "text-green-600 dark:text-green-400"
        if (percentage >= 70) return "text-blue-600 dark:text-blue-400"
        if (percentage >= 50) return "text-yellow-600 dark:text-yellow-400"
        return "text-red-600 dark:text-red-400"
    }

    if (!submission) return null

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none">
                {/* Header */}
                <div className="bg-gradient-to-r from-primary to-primary/80 p-6">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
                            <Award className="w-5 h-5" />
                            Grade Submission
                        </DialogTitle>
                        <DialogDescription className="text-primary-foreground/80">
                            Assign a grade and provide feedback
                        </DialogDescription>
                    </DialogHeader>
                </div>

                {/* Student Info */}
                <div className="px-6 pt-4">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                            {submission.studentPhoto ? (
                                <img
                                    src={submission.studentPhoto}
                                    alt={submission.studentName}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <User className="w-5 h-5 text-gray-400" />
                            )}
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                                {submission.studentName || "Unknown Student"}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {submission.studentEmail || submission.userId}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Submission Preview */}
                {(submission.submissionText || submission.submissionUrl) && (
                    <div className="px-6 pt-4">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                            Submission Content
                        </h4>
                        <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 max-h-32 overflow-y-auto">
                            {submission.submissionText && (
                                <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                                    {submission.submissionText}
                                </p>
                            )}
                            {submission.submissionUrl && (
                                <a
                                    href={submission.submissionUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-primary hover:underline"
                                >
                                    📎 View Attachment
                                </a>
                            )}
                        </div>
                    </div>
                )}

                {/* Grade Form */}
                <motion.form
                    onSubmit={handleSubmit}
                    className="p-6 space-y-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {/* Grade Input */}
                    <div className="space-y-2">
                        <Label htmlFor="grade" className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                            <Star className="w-4 h-4 text-primary" />
                            Grade (out of {maxPoints})
                        </Label>
                        <div className="flex items-center gap-3">
                            <Input
                                type="number"
                                id="grade"
                                value={grade}
                                onChange={(e) => setGrade(e.target.value)}
                                min="0"
                                max={maxPoints}
                                required
                                className="w-24 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary text-center text-lg font-bold"
                            />
                            <span className="text-gray-500 dark:text-gray-400">/ {maxPoints}</span>
                            {grade && (
                                <span className={`text-lg font-bold ${getGradeColor()}`}>
                                    ({((Number(grade) / maxPoints) * 100).toFixed(0)}%)
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Quick Grade Buttons */}
                    <div className="flex flex-wrap gap-2">
                        {[100, 90, 80, 70, 60, 50].map((percent) => (
                            <Button
                                key={percent}
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setGrade(Math.round((percent / 100) * maxPoints))}
                                className="text-xs"
                            >
                                {percent}%
                            </Button>
                        ))}
                    </div>

                    {/* Feedback */}
                    <div className="space-y-2">
                        <Label htmlFor="feedback" className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                            <MessageSquare className="w-4 h-4 text-primary" />
                            Feedback (Optional)
                        </Label>
                        <Textarea
                            id="feedback"
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder="Provide constructive feedback for the student..."
                            rows={3}
                            className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary resize-none"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            className="flex-1"
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/30"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Award className="w-4 h-4 mr-2" />
                                    Save Grade
                                </>
                            )}
                        </Button>
                    </div>
                </motion.form>
            </DialogContent>
        </Dialog>
    )
}

GradeSubmissionModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    submission: PropTypes.shape({
        _id: PropTypes.string,
        userId: PropTypes.string,
        studentName: PropTypes.string,
        studentEmail: PropTypes.string,
        studentPhoto: PropTypes.string,
        submissionText: PropTypes.string,
        submissionUrl: PropTypes.string,
        grade: PropTypes.number,
        feedback: PropTypes.string,
    }),
    maxPoints: PropTypes.number.isRequired,
    onGradeComplete: PropTypes.func.isRequired,
}

export default GradeSubmissionModal
