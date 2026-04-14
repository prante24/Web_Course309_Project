import { useState, useEffect, useContext } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
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
import {
    Send,
    Loader2,
    CheckCircle,
    Clock,
    Award,
    Calendar,
    Undo2
} from "lucide-react"
import toast from "react-hot-toast"
import PropTypes from "prop-types"
import { AuthContext } from "@/provider/AuthProvider"
import { Badge } from "@/components/ui/badge"

const SubmitAssignmentModal = ({ isOpen, onClose, assignment, existingSubmission, onSubmitSuccess }) => {
    const { user } = useContext(AuthContext)
    const [submissionText, setSubmissionText] = useState("")
    const [submissionUrl, setSubmissionUrl] = useState("")
    const [loading, setLoading] = useState(false)
    const [isEditing, setIsEditing] = useState(false) // Track if user clicked "Unsubmit"

    useEffect(() => {
        if (existingSubmission) {
            setSubmissionText(existingSubmission.submissionText || "")
            setSubmissionUrl(existingSubmission.submissionUrl || "")
            setIsEditing(false) // Reset editing state when modal opens
        } else {
            setSubmissionText("")
            setSubmissionUrl("")
            setIsEditing(true) // No submission = editing mode
        }
    }, [existingSubmission])

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!submissionText.trim() && !submissionUrl.trim()) {
            toast.error("Please enter a response or provide a link")
            return
        }

        setLoading(true)
        try {
            await axios.post(`https://edumanagebackend.vercel.app/assignments/${assignment._id}/submit`, {
                userId: user?.uid,
                submissionText: submissionText.trim(),
                submissionUrl: submissionUrl.trim(),
            })
            toast.success(existingSubmission ? "Submission updated!" : "Assignment turned in!")
            setIsEditing(false)
            onSubmitSuccess?.()
            handleClose()
        } catch (error) {
            console.error("Error submitting assignment:", error)
            toast.error("Failed to submit assignment")
        } finally {
            setLoading(false)
        }
    }

    const handleUnsubmit = () => {
        // Ensure form is pre-filled with existing submission data
        if (existingSubmission) {
            setSubmissionText(existingSubmission.submissionText || "")
            setSubmissionUrl(existingSubmission.submissionUrl || "")
        }
        setIsEditing(true)
        toast.success("You can now edit your submission")
    }

    const handleClose = () => {
        if (!existingSubmission) {
            setSubmissionText("")
            setSubmissionUrl("")
        }
        setIsEditing(false)
        onClose()
    }

    const getDeadlineStatus = () => {
        if (!assignment?.deadline) return null
        const now = new Date()
        const deadline = new Date(assignment.deadline)
        const diffDays = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24))

        if (diffDays < 0) return { text: "Past Due", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" }
        if (diffDays === 0) return { text: "Due Today", color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400" }
        if (diffDays <= 3) return { text: `${diffDays} days left`, color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" }
        return { text: `${diffDays} days left`, color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" }
    }

    if (!assignment) return null

    const deadlineStatus = getDeadlineStatus()
    const isGraded = existingSubmission?.status === "graded"
    const isTurnedIn = existingSubmission && !isEditing && !isGraded

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-none">
                {/* Header */}
                <div className="bg-gradient-to-r from-primary to-primary/80 p-6">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
                            <Send className="w-5 h-5" />
                            {isGraded ? "Assignment Grade" : isTurnedIn ? "Turned In" : existingSubmission ? "Edit Submission" : "Submit Assignment"}
                        </DialogTitle>
                        <DialogDescription className="text-primary-foreground/80">
                            {assignment.title}
                        </DialogDescription>
                    </DialogHeader>
                </div>

                {/* Assignment Info */}
                <div className="px-6 pt-4">
                    <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 space-y-3">
                        <p className="text-sm text-gray-600 dark:text-gray-300">{assignment.description}</p>
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                                <Calendar className="w-4 h-4" />
                                Due: {new Date(assignment.deadline).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                                <Award className="w-4 h-4" />
                                {assignment.maxPoints || 100} points
                            </div>
                            {deadlineStatus && (
                                <Badge className={`${deadlineStatus.color} border-none`}>
                                    <Clock className="w-3 h-3 mr-1" />
                                    {deadlineStatus.text}
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>

                {/* Submission Status */}
                {existingSubmission && !isEditing && (
                    <div className="px-6 pt-3">
                        <div className={`p-3 rounded-lg ${isGraded
                            ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                            : "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"}`}>
                            <div className={`flex items-center gap-2 ${isGraded
                                ? "text-green-800 dark:text-green-400"
                                : "text-blue-800 dark:text-blue-400"}`}>
                                <CheckCircle className="w-4 h-4" />
                                <span className="text-sm font-medium">
                                    {isGraded
                                        ? `Graded: ${existingSubmission.grade}/${assignment.maxPoints || 100}`
                                        : "Turned In - Awaiting grade"}
                                </span>
                            </div>
                            {existingSubmission.feedback && (
                                <p className="text-sm text-green-700 dark:text-green-300 mt-2">
                                    <strong>Feedback:</strong> {existingSubmission.feedback}
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* GRADED: Read-only view */}
                {isGraded && (
                    <div className="p-6 space-y-4">
                        {existingSubmission.submissionText && (
                            <div className="space-y-2">
                                <Label>Your Response</Label>
                                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                    {existingSubmission.submissionText}
                                </div>
                            </div>
                        )}
                        {existingSubmission.submissionUrl && (
                            <div className="space-y-2">
                                <Label>Submission Link</Label>
                                <a
                                    href={existingSubmission.submissionUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-primary hover:underline block"
                                >
                                    {existingSubmission.submissionUrl}
                                </a>
                            </div>
                        )}
                        <div className="pt-2">
                            <Button type="button" variant="outline" onClick={handleClose} className="w-full">
                                Close
                            </Button>
                        </div>
                    </div>
                )}

                {/* TURNED IN (not graded): Show submission with Unsubmit button */}
                {isTurnedIn && (
                    <div className="p-6 space-y-4">
                        {existingSubmission.submissionText && (
                            <div className="space-y-2">
                                <Label>Your Response</Label>
                                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                    {existingSubmission.submissionText}
                                </div>
                            </div>
                        )}
                        {existingSubmission.submissionUrl && (
                            <div className="space-y-2">
                                <Label>Submission Link</Label>
                                <a
                                    href={existingSubmission.submissionUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-primary hover:underline block"
                                >
                                    {existingSubmission.submissionUrl}
                                </a>
                            </div>
                        )}
                        <div className="flex gap-3 pt-2">
                            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
                                Close
                            </Button>
                            <Button
                                type="button"
                                onClick={handleUnsubmit}
                                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                            >
                                <Undo2 className="w-4 h-4 mr-2" />
                                Unsubmit
                            </Button>
                        </div>
                    </div>
                )}

                {/* EDITING MODE: Show form */}
                {(isEditing || !existingSubmission) && !isGraded && (
                    <motion.form
                        onSubmit={handleSubmit}
                        className="p-6 space-y-4"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Previous Submission Preview (when editing existing) */}
                        {existingSubmission && isEditing && (existingSubmission.submissionText || existingSubmission.submissionUrl) && (
                            <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 mb-4">
                                <p className="text-xs font-medium text-yellow-800 dark:text-yellow-400 mb-2">Previous Submission:</p>
                                {existingSubmission.submissionText && (
                                    <p className="text-sm text-yellow-700 dark:text-yellow-300 whitespace-pre-wrap">{existingSubmission.submissionText}</p>
                                )}
                                {existingSubmission.submissionUrl && (
                                    <a href={existingSubmission.submissionUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline block mt-1">
                                        {existingSubmission.submissionUrl}
                                    </a>
                                )}
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="submissionText">Your Response</Label>
                            <Textarea
                                id="submissionText"
                                value={submissionText}
                                onChange={(e) => setSubmissionText(e.target.value)}
                                placeholder="Type your assignment response here..."
                                rows={5}
                                className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary resize-none"
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {submissionText.length} characters
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="submissionUrl">Submission Link (Optional)</Label>
                            <Input
                                id="submissionUrl"
                                type="url"
                                value={submissionUrl}
                                onChange={(e) => setSubmissionUrl(e.target.value)}
                                placeholder="https://drive.google.com/... or https://github.com/..."
                                className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary"
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Paste a link to your Google Drive, GitHub, or other file hosting service
                            </p>
                        </div>

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
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4 mr-2" />
                                        Turn In
                                    </>
                                )}
                            </Button>
                        </div>
                    </motion.form>
                )}
            </DialogContent>
        </Dialog>
    )
}

SubmitAssignmentModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    assignment: PropTypes.shape({
        _id: PropTypes.string,
        title: PropTypes.string,
        description: PropTypes.string,
        deadline: PropTypes.string,
        maxPoints: PropTypes.number,
    }),
    existingSubmission: PropTypes.shape({
        _id: PropTypes.string,
        submissionText: PropTypes.string,
        submissionUrl: PropTypes.string,
        status: PropTypes.string,
        grade: PropTypes.number,
        feedback: PropTypes.string,
    }),
    onSubmitSuccess: PropTypes.func,
}

export default SubmitAssignmentModal
