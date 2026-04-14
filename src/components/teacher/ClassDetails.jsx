import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import axios from "axios"
import CreateAssignmentModal from "./CreateAssignmentModal"
import ViewSubmissionsModal from "./ViewSubmissionsModal"
import AddResourceModal from "./AddResourceModal"
import { useLoaderData } from "react-router-dom"
import { motion } from "framer-motion"
import {
  Users,
  FileCheck,
  Send,
  Plus,
  TrendingUp,
  Link2,
  Copy,
  Check,
  ExternalLink,
  Calendar,
  Award,
  Eye,
  Trash2,
  Edit3,
  Clock,
  CheckCircle,
  AlertCircle,
  FolderPlus,
  Link as LinkIcon,
  FileText,
  Video,
  Image,
} from "lucide-react"
import toast from "react-hot-toast"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

const ClassDetails = () => {
  const loaderData = useLoaderData()
  const [classDetails, setClassDetails] = useState(loaderData)
  const [assignments, setAssignments] = useState([])
  const [loadingAssignments, setLoadingAssignments] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isViewSubmissionsOpen, setIsViewSubmissionsOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedAssignment, setSelectedAssignment] = useState(null)
  const [copied, setCopied] = useState(false)
  const [resources, setResources] = useState([])
  const [loadingResources, setLoadingResources] = useState(true)
  const [isAddResourceOpen, setIsAddResourceOpen] = useState(false)

  // Class meeting link
  const classLink = "https://meet.google.com/xjk-bfrn-cyw"

  const fetchAssignments = useCallback(async () => {
    if (!classDetails?._id) return
    try {
      setLoadingAssignments(true)
      const response = await axios.get(
        `https://edumanagebackend.vercel.app/classes/${classDetails._id}/assignments`
      )
      setAssignments(response.data.assignments || [])
    } catch (error) {
      console.error("Error fetching assignments:", error)
    } finally {
      setLoadingAssignments(false)
    }
  }, [classDetails?._id])

  const fetchResources = useCallback(async () => {
    if (!classDetails?._id) return
    try {
      setLoadingResources(true)
      const response = await axios.get(
        `https://edumanagebackend.vercel.app/classes/${classDetails._id}/resources`
      )
      setResources(response.data.resources || [])
    } catch (error) {
      console.error("Error fetching resources:", error)
    } finally {
      setLoadingResources(false)
    }
  }, [classDetails?._id])

  useEffect(() => {
    fetchAssignments()
    fetchResources()
  }, [fetchAssignments, fetchResources])

  const handleDeleteResource = async (resourceId) => {
    if (!window.confirm("Are you sure you want to delete this resource?")) return
    try {
      await axios.delete(`https://edumanagebackend.vercel.app/resources/${resourceId}`)
      toast.success("Resource deleted!")
      fetchResources()
    } catch (error) {
      console.error("Error deleting resource:", error)
      toast.error("Failed to delete resource")
    }
  }

  const getResourceIcon = (type) => {
    switch (type) {
      case 'video': return <Video className="w-5 h-5" />
      case 'document': return <FileText className="w-5 h-5" />
      case 'image': return <Image className="w-5 h-5" />
      default: return <LinkIcon className="w-5 h-5" />
    }
  }

  const copyClassLink = () => {
    navigator.clipboard.writeText(classLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleAssignmentCreated = async () => {
    try {
      const response = await axios.get(
        `https://edumanagebackend.vercel.app/classes/${classDetails._id}`
      )
      setClassDetails(response.data)
      setIsCreateModalOpen(false)
      fetchAssignments()
      toast.success("Assignment created successfully!")
    } catch (error) {
      console.error("Error refreshing class details:", error)
    }
  }

  const handleViewSubmissions = (assignment) => {
    setSelectedAssignment(assignment)
    setIsViewSubmissionsOpen(true)
  }

  const handleEditAssignment = (assignment) => {
    setSelectedAssignment(assignment)
    setIsEditModalOpen(true)
  }

  const handleDeleteAssignment = async (assignmentId) => {
    if (!window.confirm("Are you sure you want to delete this assignment?")) return
    try {
      await axios.delete(`https://edumanagebackend.vercel.app/assignments/${assignmentId}`)
      toast.success("Assignment deleted successfully!")
      fetchAssignments()
      // Refresh class stats
      const response = await axios.get(
        `https://edumanagebackend.vercel.app/classes/${classDetails._id}`
      )
      setClassDetails(response.data)
    } catch (error) {
      console.error("Error deleting assignment:", error)
      toast.error("Failed to delete assignment")
    }
  }

  const getDeadlineStatus = (deadline) => {
    const now = new Date()
    const deadlineDate = new Date(deadline)
    const diffDays = Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return { label: "Past Due", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400", icon: <AlertCircle className="w-3 h-3" /> }
    if (diffDays === 0) return { label: "Due Today", color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400", icon: <Clock className="w-3 h-3" /> }
    if (diffDays <= 3) return { label: `${diffDays}d left`, color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400", icon: <Clock className="w-3 h-3" /> }
    return { label: `${diffDays}d left`, color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400", icon: <CheckCircle className="w-3 h-3" /> }
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

  if (!classDetails) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px] gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-600 dark:text-gray-400 font-medium">Loading class details...</p>
      </div>
    )
  }

  const submissionRate = classDetails.totalAssignments > 0
    ? ((classDetails.totalSubmissions / (classDetails.totalAssignments * (classDetails.totalEnrollment || 1))) * 100).toFixed(0)
    : 0

  return (
    <div className="space-y-6">
      {/* Header with Class Info */}
      <FadeIn>
        <Card className="border-none shadow-sm bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 backdrop-blur-xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                  {classDetails.title}
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Manage assignments and track student progress
                </p>
              </div>
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Assignment
              </Button>
            </div>
          </CardContent>
        </Card>
      </FadeIn>

      {/* Class Link Section */}
      <FadeIn delay={0.05}>
        <Card className="border-none shadow-sm bg-blue-50 dark:bg-slate-900/50 backdrop-blur-xl border border-blue-100 dark:border-blue-900/20">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20 flex-shrink-0">
                  <Link2 className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">Class Link</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{classLink}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => window.open(classLink, '_blank')}
                  className="bg-blue-600 hover:bg-blue-700 text-white border-none"
                  size="sm"
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Join Class
                </Button>
                <Button
                  onClick={copyClassLink}
                  variant="outline"
                  size="sm"
                  className={`flex-shrink-0 transition-all duration-200 ${copied
                    ? 'bg-green-50 border-green-500 text-green-600 dark:bg-green-900/20 dark:border-green-400 dark:text-green-400'
                    : 'hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600'
                    }`}
                >
                  {copied ? <><Check className="w-4 h-4 mr-1" /> Copied!</> : <><Copy className="w-4 h-4 mr-1" /> Copy Link</>}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </FadeIn>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <FadeIn delay={0.1}>
          <motion.div whileHover={{ y: -4 }}>
            <Card className="border-none shadow-sm hover:shadow-lg transition-all duration-300 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 backdrop-blur-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Students</p>
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{classDetails.totalEnrollment || 0}</h3>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Enrolled</p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                    <Users className="w-7 h-7 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <motion.div whileHover={{ y: -4 }}>
            <Card className="border-none shadow-sm hover:shadow-lg transition-all duration-300 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 backdrop-blur-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Assignments</p>
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{classDetails.totalAssignments || 0}</h3>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Created</p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                    <FileCheck className="w-7 h-7 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </FadeIn>

        <FadeIn delay={0.3}>
          <motion.div whileHover={{ y: -4 }}>
            <Card className="border-none shadow-sm hover:shadow-lg transition-all duration-300 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 backdrop-blur-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Submissions</p>
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{classDetails.totalSubmissions || 0}</h3>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Received</p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                    <Send className="w-7 h-7 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </FadeIn>

        <FadeIn delay={0.4}>
          <motion.div whileHover={{ y: -4 }}>
            <Card className="border-none shadow-sm hover:shadow-lg transition-all duration-300 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 backdrop-blur-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Completion</p>
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{submissionRate}%</h3>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Rate</p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                    <TrendingUp className="w-7 h-7 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </FadeIn>
      </div>

      {/* Resources Section */}
      <FadeIn delay={0.45}>
        <Card className="border-none shadow-sm bg-white dark:bg-gray-900/50 backdrop-blur-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <FolderPlus className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Class Resources</h3>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-primary/10 text-primary border-none">{resources.length} Total</Badge>
                <Button
                  onClick={() => setIsAddResourceOpen(true)}
                  size="sm"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <FolderPlus className="w-4 h-4 mr-1" />
                  Add Resource
                </Button>
              </div>
            </div>

            {loadingResources ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : resources.length === 0 ? (
              <div className="text-center py-8">
                <FolderPlus className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-1">No Resources Yet</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Share materials with your students</p>
                <Button onClick={() => setIsAddResourceOpen(true)} size="sm" className="bg-primary hover:bg-primary/90">
                  <FolderPlus className="w-4 h-4 mr-2" /> Add Resource
                </Button>
              </div>
            ) : (
              <div className="grid gap-3">
                {resources.map((resource, index) => (
                  <motion.div
                    key={resource._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all bg-gray-50/50 dark:bg-gray-800/50 group"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                          {getResourceIcon(resource.type)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white truncate">{resource.title}</h4>
                          {resource.description && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{resource.description}</p>
                          )}
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs capitalize">{resource.type}</Badge>
                            <span className="text-xs text-gray-400">
                              {new Date(resource.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(resource.url, '_blank')}
                          className="hover:bg-primary/10 hover:text-primary hover:border-primary"
                        >
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Open
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteResource(resource._id)}
                          className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </FadeIn>

      {/* Assignments List */}
      <FadeIn delay={0.5}>
        <Card className="border-none shadow-sm bg-white dark:bg-gray-900/50 backdrop-blur-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Assignments</h3>
              <Badge className="bg-primary/10 text-primary border-none">{assignments.length} Total</Badge>
            </div>

            {loadingAssignments ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : assignments.length === 0 ? (
              <div className="text-center py-12">
                <FileCheck className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Assignments Yet</h4>
                <p className="text-gray-500 dark:text-gray-400 mb-4">Create your first assignment to get started</p>
                <Button onClick={() => setIsCreateModalOpen(true)} className="bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-2" /> Create Assignment
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {assignments.map((assignment, index) => {
                  const deadline = getDeadlineStatus(assignment.deadline)
                  return (
                    <motion.div
                      key={assignment._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all bg-gray-50/50 dark:bg-gray-800/50"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <FileCheck className="w-5 h-5 text-primary" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="font-semibold text-gray-900 dark:text-white truncate">{assignment.title}</h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{assignment.description}</p>
                              <div className="flex flex-wrap items-center gap-2 mt-2">
                                <Badge className={`${deadline.color} border-none flex items-center gap-1`}>
                                  {deadline.icon} {deadline.label}
                                </Badge>
                                <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {new Date(assignment.deadline).toLocaleDateString()}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                  <Award className="w-3 h-3" />
                                  {assignment.maxPoints || 100} pts
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                  <Send className="w-3 h-3" />
                                  {assignment.submissionCount || 0} submissions
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewSubmissions(assignment)}
                            className="hover:bg-primary/10 hover:text-primary hover:border-primary"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Submissions
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditAssignment(assignment)}
                            className="hover:bg-primary/10 hover:text-primary hover:border-primary"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteAssignment(assignment._id)}
                            className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </FadeIn>

      {/* Class Overview */}
      <FadeIn delay={0.6}>
        <Card className="border-none shadow-sm bg-white dark:bg-gray-900/50 backdrop-blur-xl">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Class Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Course Information</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
                    <span className={`text-sm font-semibold ${classDetails.status === 'approved' ? 'text-green-600 dark:text-green-400' : classDetails.status === 'pending' ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'}`}>
                      {classDetails.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Price</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">${classDetails.price}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Performance Metrics</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Avg. Submissions per Assignment</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {classDetails.totalAssignments > 0 ? (classDetails.totalSubmissions / classDetails.totalAssignments).toFixed(1) : 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Rating</span>
                    <span className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">
                      {classDetails.averageRating || 'N/A'} ⭐
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {classDetails.description && (
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Description</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">{classDetails.description}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </FadeIn>

      {/* Modals */}
      <CreateAssignmentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onAssignmentCreated={handleAssignmentCreated}
        classId={classDetails._id}
      />

      <ViewSubmissionsModal
        isOpen={isViewSubmissionsOpen}
        onClose={() => {
          setIsViewSubmissionsOpen(false)
          setSelectedAssignment(null)
        }}
        assignment={selectedAssignment}
      />

      {/* Edit Assignment Modal */}
      <EditAssignmentModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedAssignment(null)
        }}
        assignment={selectedAssignment}
        onSave={() => {
          setIsEditModalOpen(false)
          fetchAssignments()
        }}
      />

      {/* Add Resource Modal */}
      <AddResourceModal
        isOpen={isAddResourceOpen}
        onClose={() => setIsAddResourceOpen(false)}
        classId={classDetails._id}
        onResourceAdded={fetchResources}
      />
    </div>
  )
}

// Edit Assignment Modal Component
const EditAssignmentModal = ({ isOpen, onClose, assignment, onSave }) => {
  const [formData, setFormData] = useState({
    title: "",
    deadline: "",
    description: "",
    maxPoints: 100,
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (assignment) {
      setFormData({
        title: assignment.title || "",
        deadline: assignment.deadline || "",
        description: assignment.description || "",
        maxPoints: assignment.maxPoints || 100,
      })
    }
  }, [assignment])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: name === "maxPoints" ? Number(value) : value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await axios.put(`https://edumanagebackend.vercel.app/assignments/${assignment._id}`, formData)
      toast.success("Assignment updated successfully!")
      onSave()
    } catch (error) {
      console.error("Error updating assignment:", error)
      toast.error("Failed to update assignment")
    } finally {
      setLoading(false)
    }
  }

  if (!assignment) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden border-none">
        <div className="bg-gradient-to-r from-primary to-primary/80 p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
              <Edit3 className="w-5 h-5" />
              Edit Assignment
            </DialogTitle>
            <DialogDescription className="text-primary-foreground/80">
              Update assignment details
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Title</Label>
            <Input id="edit-title" name="title" value={formData.title} onChange={handleChange} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-deadline">Deadline</Label>
              <Input type="date" id="edit-deadline" name="deadline" value={formData.deadline} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-maxPoints">Max Points</Label>
              <Input type="number" id="edit-maxPoints" name="maxPoints" value={formData.maxPoints} onChange={handleChange} min="1" required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea id="edit-description" name="description" value={formData.description} onChange={handleChange} rows={4} required />
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1" disabled={loading}>Cancel</Button>
            <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default ClassDetails