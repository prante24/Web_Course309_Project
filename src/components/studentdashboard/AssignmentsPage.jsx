import { useState, useEffect, useContext } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import axios from "axios"
import {
    FileCheck,
    Calendar,
    Award,
    Clock,
    CheckCircle,
    AlertCircle,
    Search,
    Send,
    BookOpen,
    TrendingUp,
    Loader2,
} from "lucide-react"
import { AuthContext } from "@/provider/AuthProvider"
import toast from "react-hot-toast"
import { Link } from "react-router-dom"

const AssignmentsPage = () => {
    const { user } = useContext(AuthContext)
    const [submissions, setSubmissions] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState("all")
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        if (user?.uid) {
            fetchSubmissions()
        }
    }, [user?.uid])

    const fetchSubmissions = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`https://edumanagebackend.vercel.app/students/${user.uid}/submissions`)
            setSubmissions(response.data.submissions || [])
        } catch (error) {
            console.error("Error fetching submissions:", error)
            toast.error("Failed to load assignments")
        } finally {
            setLoading(false)
        }
    }

    const getStatusInfo = (status, grade, maxPoints) => {
        if (status === "graded") {
            const percentage = (grade / maxPoints) * 100
            if (percentage >= 70) {
                return { label: "Passed", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400", icon: <CheckCircle className="w-3 h-3" /> }
            }
            return { label: "Needs Improvement", color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400", icon: <AlertCircle className="w-3 h-3" /> }
        }
        return { label: "Pending", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400", icon: <Clock className="w-3 h-3" /> }
    }

    const filteredSubmissions = submissions.filter((sub) => {
        const matchesSearch = sub.assignmentTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            sub.className?.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesFilter = filter === "all" || sub.status === filter
        return matchesSearch && matchesFilter
    })

    const stats = {
        total: submissions.length,
        graded: submissions.filter(s => s.status === "graded").length,
        pending: submissions.filter(s => s.status === "submitted").length,
        averageGrade: submissions.filter(s => s.status === "graded" && s.grade).length > 0
            ? (submissions.filter(s => s.status === "graded" && s.grade).reduce((acc, s) => acc + (s.grade / (s.maxPoints || 100)) * 100, 0) / submissions.filter(s => s.status === "graded" && s.grade).length).toFixed(0)
            : 0,
    }

    const FadeIn = ({ children, delay = 0 }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
        >
            {children}
        </motion.div>
    )

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center min-h-[400px] gap-4">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                <p className="text-gray-600 dark:text-gray-400 font-medium">Loading your assignments...</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <FadeIn>
                <Card className="border-none shadow-sm bg-blue-600 text-white overflow-hidden relative shadow-lg shadow-blue-500/20">
                    <CardContent className="p-6">
                        <h2 className="text-3xl font-bold text-white mb-2">My Assignments</h2>
                        <p className="text-blue-100">View all your submitted assignments and grades</p>
                    </CardContent>
                </Card>
            </FadeIn>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <FadeIn delay={0.1}>
                    <Card className="border-none shadow-sm bg-white dark:bg-gray-900/50 backdrop-blur-xl">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Total Submitted</p>
                                    <h3 className="text-2xl font-bold text-blue-600">{stats.total}</h3>
                                </div>
                                <Send className="w-8 h-8 text-blue-600/50" />
                            </div>
                        </CardContent>
                    </Card>
                </FadeIn>

                <FadeIn delay={0.15}>
                    <Card className="border-none shadow-sm bg-white dark:bg-gray-900/50 backdrop-blur-xl">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Graded</p>
                                    <h3 className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.graded}</h3>
                                </div>
                                <CheckCircle className="w-8 h-8 text-green-600/50" />
                            </div>
                        </CardContent>
                    </Card>
                </FadeIn>

                <FadeIn delay={0.2}>
                    <Card className="border-none shadow-sm bg-white dark:bg-gray-900/50 backdrop-blur-xl">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Pending</p>
                                    <h3 className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pending}</h3>
                                </div>
                                <Clock className="w-8 h-8 text-yellow-600/50" />
                            </div>
                        </CardContent>
                    </Card>
                </FadeIn>

                <FadeIn delay={0.25}>
                    <Card className="border-none shadow-sm bg-white dark:bg-gray-900/50 backdrop-blur-xl">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Avg. Score</p>
                                    <h3 className="text-2xl font-bold text-blue-600">{stats.averageGrade}%</h3>
                                </div>
                                <TrendingUp className="w-8 h-8 text-blue-600/50" />
                            </div>
                        </CardContent>
                    </Card>
                </FadeIn>
            </div>

            {/* Filters */}
            <FadeIn delay={0.3}>
                <Card className="border-none shadow-sm bg-white dark:bg-gray-900/50 backdrop-blur-xl">
                    <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <Input
                                    type="text"
                                    placeholder="Search assignments..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 bg-gray-50 dark:bg-gray-800"
                                />
                            </div>
                            <div className="flex gap-2">
                                {["all", "submitted", "graded"].map((f) => (
                                    <Button
                                        key={f}
                                        variant={filter === f ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setFilter(f)}
                                        className={filter === f ? "bg-blue-600 hover:bg-blue-600/90" : ""}
                                    >
                                        {f.charAt(0).toUpperCase() + f.slice(1)}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </FadeIn>

            {/* Submissions List */}
            <FadeIn delay={0.4}>
                {filteredSubmissions.length === 0 ? (
                    <Card className="border-none shadow-sm bg-white dark:bg-gray-900/50 backdrop-blur-xl">
                        <CardContent className="p-12 text-center">
                            <FileCheck className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                {submissions.length === 0 ? "No Submissions Yet" : "No Matching Assignments"}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                {submissions.length === 0
                                    ? "Submit your first assignment to see it here"
                                    : "Try adjusting your search or filter"}
                            </p>
                            <Link to="/dashboard/my-enroll-class">
                                <Button className="bg-blue-600 hover:bg-blue-600/90">
                                    <BookOpen className="w-4 h-4 mr-2" />
                                    View My Classes
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-3">
                        {filteredSubmissions.map((submission, index) => {
                            const statusInfo = getStatusInfo(submission.status, submission.grade, submission.maxPoints)
                            return (
                                <motion.div
                                    key={submission._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.2, delay: index * 0.05 }}
                                >
                                    <Card className="border-none shadow-sm hover:shadow-md transition-all bg-white dark:bg-gray-900/50 backdrop-blur-xl">
                                        <CardContent className="p-4">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                <div className="flex items-start gap-3 flex-1 min-w-0">
                                                    <div className="w-10 h-10 rounded-lg bg-blue-600/10 flex items-center justify-center flex-shrink-0">
                                                        <FileCheck className="w-5 h-5 text-blue-600" />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                                                            {submission.assignmentTitle || "Assignment"}
                                                        </h4>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                                            {submission.className || "Class"}
                                                        </p>
                                                        <div className="flex flex-wrap items-center gap-2 mt-2">
                                                            <Badge className={`${statusInfo.color} border-none flex items-center gap-1`}>
                                                                {statusInfo.icon}
                                                                {statusInfo.label}
                                                            </Badge>
                                                            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                                                <Calendar className="w-3 h-3" />
                                                                {new Date(submission.submittedAt).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Grade Display */}
                                                <div className="flex items-center gap-4">
                                                    {submission.status === "graded" && (
                                                        <div className="text-right">
                                                            <div className="flex items-center gap-2">
                                                                <Award className="w-5 h-5 text-blue-600" />
                                                                <span className="text-2xl font-bold text-blue-600">
                                                                    {submission.grade}
                                                                </span>
                                                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                                                    / {submission.maxPoints || 100}
                                                                </span>
                                                            </div>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                {((submission.grade / (submission.maxPoints || 100)) * 100).toFixed(0)}%
                                                            </p>
                                                        </div>
                                                    )}
                                                    <Link to={`/dashboard/myenroll-class/${submission.classId}`}>
                                                        <Button variant="outline" size="sm" className="hover:bg-blue-600/10 hover:text-blue-600 hover:border-blue-600">
                                                            View Class
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>

                                            {/* Feedback */}
                                            {submission.feedback && (
                                                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                                        <span className="font-medium">Feedback:</span> {submission.feedback}
                                                    </p>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )
                        })}
                    </div>
                )}
            </FadeIn>
        </div>
    )
}

export default AssignmentsPage
