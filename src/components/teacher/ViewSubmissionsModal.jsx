import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
    Users,
    CheckCircle,
    Clock,
    Award,
    Loader2,
    FileText,
    ExternalLink,
    User,
} from "lucide-react"
import toast from "react-hot-toast"
import PropTypes from "prop-types"
import GradeSubmissionModal from "./GradeSubmissionModal"

const ViewSubmissionsModal = ({ isOpen, onClose, assignment }) => {
    const [submissions, setSubmissions] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedSubmission, setSelectedSubmission] = useState(null)
    const [isGradeModalOpen, setIsGradeModalOpen] = useState(false)

    useEffect(() => {
        if (isOpen && assignment?._id) {
            fetchSubmissions()
        }
    }, [isOpen, assignment?._id])

    const fetchSubmissions = async () => {
        try {
            setLoading(true)
            const response = await axios.get(
                `https://edumanagebackend.vercel.app/assignments/${assignment._id}/submissions`
            )
            setSubmissions(response.data.submissions || [])
        } catch (error) {
            console.error("Error fetching submissions:", error)
            toast.error("Failed to load submissions")
        } finally {
            setLoading(false)
        }
    }

    const handleGradeClick = (submission) => {
        setSelectedSubmission(submission)
        setIsGradeModalOpen(true)
    }

    const handleGradeComplete = () => {
        setIsGradeModalOpen(false)
        setSelectedSubmission(null)
        fetchSubmissions() // Refresh the list
    }

    const getStatusBadge = (status) => {
        const styles = {
            submitted: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
            graded: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
        }
        const icons = {
            submitted: <Clock className="w-3 h-3 mr-1" />,
            graded: <CheckCircle className="w-3 h-3 mr-1" />,
        }
        return { style: styles[status] || styles.submitted, icon: icons[status] }
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-[700px] max-h-[80vh] p-0 overflow-hidden border-none">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-primary to-primary/80 p-6">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
                                <Users className="w-5 h-5" />
                                Student Submissions
                            </DialogTitle>
                            <DialogDescription className="text-primary-foreground/80">
                                {assignment?.title} • {submissions.length} submission(s)
                            </DialogDescription>
                        </DialogHeader>
                    </div>

                    {/* Content */}
                    <div className="p-6 max-h-[60vh] overflow-y-auto">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-12">
                                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                                <p className="text-gray-500 dark:text-gray-400 mt-2">Loading submissions...</p>
                            </div>
                        ) : submissions.length === 0 ? (
                            <div className="text-center py-12">
                                <FileText className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    No Submissions Yet
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400">
                                    Students haven&apos;t submitted this assignment yet
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {submissions.map((submission, index) => {
                                    const statusBadge = getStatusBadge(submission.status)
                                    return (
                                        <motion.div
                                            key={submission._id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.2, delay: index * 0.05 }}
                                            className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/50 hover:shadow-md transition-all"
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                {/* Student Info */}
                                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
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
                                                    <div className="min-w-0 flex-1">
                                                        <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                                                            {submission.studentName || "Unknown Student"}
                                                        </h4>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                                            {submission.studentEmail || submission.userId}
                                                        </p>
                                                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                                            Submitted: {formatDate(submission.submittedAt)}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Status & Grade */}
                                                <div className="flex flex-col items-end gap-2">
                                                    <Badge className={`${statusBadge.style} border-none flex items-center`}>
                                                        {statusBadge.icon}
                                                        {submission.status}
                                                    </Badge>
                                                    {submission.grade !== undefined && submission.grade !== null && (
                                                        <div className="flex items-center gap-1 text-sm">
                                                            <Award className="w-4 h-4 text-primary" />
                                                            <span className="font-bold text-primary">
                                                                {submission.grade}/{assignment?.maxPoints || 100}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Submission Content Preview */}
                                            {(submission.submissionText || submission.submissionUrl) && (
                                                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                                                    {submission.submissionText && (
                                                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                                                            {submission.submissionText}
                                                        </p>
                                                    )}
                                                    {submission.submissionUrl && (
                                                        <a
                                                            href={submission.submissionUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-sm text-primary hover:underline flex items-center gap-1 mt-1"
                                                        >
                                                            <ExternalLink className="w-3 h-3" />
                                                            View Attachment
                                                        </a>
                                                    )}
                                                </div>
                                            )}

                                            {/* Actions */}
                                            <div className="mt-3 flex justify-end">
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleGradeClick(submission)}
                                                    className="bg-primary hover:bg-primary/90"
                                                >
                                                    <Award className="w-4 h-4 mr-1" />
                                                    {submission.status === "graded" ? "Update Grade" : "Grade"}
                                                </Button>
                                            </div>
                                        </motion.div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Grade Modal */}
            <GradeSubmissionModal
                isOpen={isGradeModalOpen}
                onClose={() => setIsGradeModalOpen(false)}
                submission={selectedSubmission}
                maxPoints={assignment?.maxPoints || 100}
                onGradeComplete={handleGradeComplete}
            />
        </>
    )
}

ViewSubmissionsModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    assignment: PropTypes.shape({
        _id: PropTypes.string,
        title: PropTypes.string,
        maxPoints: PropTypes.number,
    }),
}

export default ViewSubmissionsModal
