import { useState, useEffect, useContext, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Rating } from "react-simple-star-rating";
import {
  Loader2,
  Calendar,
  FileText,
  CheckCircle,
  Star,
  ArrowLeft,
  AlertCircle,
  User,
  Link2,
  Copy,
  Check,
  ExternalLink,
  Award,
  Clock,
  Send,
  FolderOpen,
  Video,
  Image,
  Link as LinkIcon
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AuthContext } from "@/provider/AuthProvider";
import { motion } from "framer-motion";
import PropTypes from 'prop-types';
import axios from "axios";
import toast from "react-hot-toast";
import SubmitAssignmentModal from "./SubmitAssignmentModal";

const FadeIn = ({ children, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
  >
    {children}
  </motion.div>
);

FadeIn.propTypes = {
  children: PropTypes.node.isRequired,
  delay: PropTypes.number
};

FadeIn.defaultProps = {
  delay: 0
};

const MyEnrollClassDetails = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const [classDetails, setClassDetails] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [studentSubmissions, setStudentSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEvaluationOpen, setIsEvaluationOpen] = useState(false);
  const [evaluation, setEvaluation] = useState({ description: "", rating: 0 });
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [resources, setResources] = useState([]);
  const [loadingResources, setLoadingResources] = useState(true);

  // Submit modal state
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [existingSubmission, setExistingSubmission] = useState(null);

  // Class meeting link
  const classLink = "https://meet.google.com/xjk-bfrn-cyw";

  const copyClassLink = () => {
    navigator.clipboard.writeText(classLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fetchData = useCallback(async () => {
    try {
      // Get user ID
      const usersRes = await axios.get('https://edumanagebackend.vercel.app/users');
      const userId = usersRes.data.find(u => u.email === user?.email)?.uid;

      const [classResponse, assignmentsResponse] = await Promise.all([
        axios.get(`https://edumanagebackend.vercel.app/classes/${id}`),
        axios.get(`https://edumanagebackend.vercel.app/classes/${id}/assignments`)
      ]);

      setClassDetails(classResponse.data);
      setAssignments(assignmentsResponse.data.assignments || []);

      // Fetch student's submissions
      if (userId) {
        const submissionsRes = await axios.get(`https://edumanagebackend.vercel.app/students/${userId}/submissions`);
        setStudentSubmissions(submissionsRes.data.submissions || []);
      }

      // Fetch class resources
      try {
        setLoadingResources(true);
        const resourcesRes = await axios.get(`https://edumanagebackend.vercel.app/classes/${id}/resources`);
        setResources(resourcesRes.data.resources || []);
      } finally {
        setLoadingResources(false);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id, user?.email]);

  const getResourceIcon = (type) => {
    switch (type) {
      case 'video': return <Video className="w-5 h-5" />;
      case 'document': return <FileText className="w-5 h-5" />;
      case 'image': return <Image className="w-5 h-5" />;
      default: return <LinkIcon className="w-5 h-5" />;
    }
  };

  useEffect(() => {
    if (user?.email) {
      fetchData();
    }
  }, [fetchData, user?.email]);

  const getSubmissionForAssignment = (assignmentId) => {
    return studentSubmissions.find(sub => sub.assignmentId === assignmentId);
  };

  const handleSubmitClick = (assignment) => {
    setSelectedAssignment(assignment);
    setExistingSubmission(getSubmissionForAssignment(assignment._id));
    setIsSubmitModalOpen(true);
  };

  const handleSubmitSuccess = () => {
    fetchData(); // Refresh data
    toast.success("Assignment submitted successfully!");
  };

  const handleEvaluationSubmit = async () => {
    if (!evaluation.description.trim() || evaluation.rating === 0) {
      toast.error("Please provide both a description and rating");
      return;
    }

    setSubmitting(true);
    try {
      const usersRes = await axios.get('https://edumanagebackend.vercel.app/users');
      const userId = usersRes.data.find(u => u.email === user?.email)?.uid;

      if (!userId) throw new Error('User not found');

      await axios.post(`https://edumanagebackend.vercel.app/classes/${id}/evaluate`, {
        userId,
        name: user?.displayName || 'Anonymous',
        photo: user?.photoURL || '',
        rating: evaluation.rating,
        description: evaluation.description.trim()
      });

      setIsEvaluationOpen(false);
      setEvaluation({ description: "", rating: 0 });
      toast.success("Evaluation submitted successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit evaluation");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px] gap-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-600 dark:text-slate-400 font-medium">Loading course details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <FadeIn>
        <Card className="max-w-2xl mx-auto border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-red-900 dark:text-red-100 mb-2">Error Loading Course</h3>
            <p className="text-red-800 dark:text-red-200">{error}</p>
            <Button onClick={() => navigate('/dashboard/my-enroll-class')} className="mt-4" variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to My Courses
            </Button>
          </CardContent>
        </Card>
      </FadeIn>
    );
  }

  const getDeadlineStatus = (deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const daysLeft = Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24));

    if (daysLeft < 0) return { status: 'overdue', color: 'bg-red-500 text-white', text: 'Overdue', icon: <AlertCircle className="w-3 h-3" /> };
    if (daysLeft === 0) return { status: 'today', color: 'bg-orange-500 text-white', text: 'Due Today', icon: <Clock className="w-3 h-3" /> };
    if (daysLeft <= 3) return { status: 'urgent', color: 'bg-yellow-500 text-white', text: `${daysLeft} days left`, icon: <Clock className="w-3 h-3" /> };
    return { status: 'normal', color: 'bg-green-500 text-white', text: `${daysLeft} days left`, icon: <CheckCircle className="w-3 h-3" /> };
  };

  const getSubmissionStatus = (submission) => {
    if (!submission) return { label: "Not Submitted", color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300" };
    if (submission.status === "graded") return { label: "Graded", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" };
    return { label: "Submitted", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" };
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <FadeIn>
        <button
          onClick={() => navigate('/dashboard/my-enroll-class')}
          className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to My Courses</span>
        </button>
      </FadeIn>

      {/* Course Header Card */}
      <FadeIn delay={0.1}>
        <Card className="border-none shadow-sm bg-white dark:bg-slate-900/50 backdrop-blur-xl overflow-hidden">
          <div className="relative h-48 bg-blue-600">
            {classDetails?.image && (
              <img
                src={classDetails.image}
                alt={classDetails.title}
                className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <h1 className="text-3xl font-bold text-white mb-2">{classDetails?.title}</h1>
              <div className="flex items-center gap-4 text-white/90">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span className="text-sm">Instructor: {classDetails?.instructorName}</span>
                </div>
                <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-md">
                  {assignments.length} Assignment{assignments.length !== 1 ? 's' : ''}
                </Badge>
              </div>
            </div>
          </div>

          <CardContent className="p-6">
            <div className="flex flex-wrap gap-3">
              <Dialog open={isEvaluationOpen} onOpenChange={setIsEvaluationOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white border-none shadow-lg shadow-blue-600/30">
                    <Star className="w-4 h-4 mr-2" />
                    Teaching Evaluation Report (TER)
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">Submit Teaching Evaluation</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        Your Feedback
                      </label>
                      <Textarea
                        placeholder="Share your experience with this course..."
                        value={evaluation.description}
                        onChange={(e) => setEvaluation({ ...evaluation, description: e.target.value })}
                        className="min-h-[120px] dark:bg-gray-800 dark:text-white dark:border-gray-700"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        Rating
                      </label>
                      <div className="flex items-center gap-3">
                        <Rating
                          onClick={(rate) => setEvaluation({ ...evaluation, rating: rate })}
                          initialValue={evaluation.rating}
                          size={32}
                          transition
                          fillColor="#f59e0b"
                          emptyColor="#d1d5db"
                          SVGclassName="inline-block"
                          allowFraction={false}
                          showTooltip
                          tooltipArray={['Poor', 'Fair', 'Good', 'Very Good', 'Excellent']}
                          tooltipDefaultText="Select a rating"
                          tooltipClassName="!bg-gray-800 !text-white !text-xs !px-2 !py-1 !rounded"
                        />
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400 min-w-[60px]">
                          {evaluation.rating > 0 ? `${evaluation.rating}/5` : 'No rating'}
                        </span>
                      </div>
                    </div>
                    <Button
                      onClick={handleEvaluationSubmit}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      disabled={!evaluation.description.trim() || evaluation.rating === 0 || submitting}
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Send Evaluation
                        </>
                      )}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </FadeIn>

      {/* Class Link Section */}
      <FadeIn delay={0.15}>
        <Card className="border-none shadow-sm bg-blue-50 dark:bg-blue-900/20 backdrop-blur-xl">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20 shrink-0">
                  <Link2 className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">Class Link</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{classLink}</p>
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
                  className={`shrink-0 transition-all duration-200 ${copied
                    ? 'bg-green-50 border-green-500 text-green-600 dark:bg-green-900/20 dark:border-green-400 dark:text-green-400'
                    : 'hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:border-blue-200 hover:text-blue-600'
                    }`}
                >
                  {copied ? <><Check className="w-4 h-4 mr-1" /> Copied!</> : <><Copy className="w-4 h-4 mr-1" /> Copy Link</>}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </FadeIn>

      {/* Resources Section */}
      <FadeIn delay={0.18}>
        <Card className="border-none shadow-sm bg-white dark:bg-gray-900/50 backdrop-blur-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Class Resources</h3>
              </div>
              <Badge className="bg-blue-100 text-blue-700 border-none dark:bg-blue-900/30 dark:text-blue-300">{resources.length} Materials</Badge>
            </div>

            {loadingResources ? (
              <div className="flex items-center justify-center py-6">
                <div className="w-6 h-6 border-3 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : resources.length === 0 ? (
              <div className="text-center py-6">
                <FolderOpen className="w-10 h-10 mx-auto text-gray-300 dark:text-gray-600 mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">No resources shared yet</p>
              </div>
            ) : (
              <div className="grid gap-2">
                {resources.map((resource) => (
                  <motion.div
                    key={resource._id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all bg-gray-50/50 dark:bg-gray-800/50 group"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center shrink-0 text-blue-600">
                          {getResourceIcon(resource.type)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-white text-sm truncate">{resource.title}</h4>
                          {resource.description && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{resource.description}</p>
                          )}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => window.open(resource.url, '_blank')}
                        className="bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40 text-xs border-none"
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Open
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </FadeIn>

      {/* Assignments Section */}
      <FadeIn delay={0.2}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-600" />
              Assignments
            </h2>
            <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-none">
              {assignments.length} Total
            </Badge>
          </div>


          {assignments.length === 0 ? (
            <Card className="border-none shadow-sm bg-white dark:bg-gray-900/50 backdrop-blur-xl">
              <CardContent className="p-12 text-center">
                <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Assignments Yet</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Your instructor hasn&apos;t posted any assignments for this course yet.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {assignments.map((assignment, index) => {
                const deadlineInfo = getDeadlineStatus(assignment.deadline);
                const submission = getSubmissionForAssignment(assignment._id);
                const submissionStatus = getSubmissionStatus(submission);

                return (
                  <motion.div
                    key={assignment._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="border-none shadow-sm hover:shadow-lg transition-all duration-300 bg-white dark:bg-slate-900/50 backdrop-blur-xl group border border-slate-100 dark:border-slate-800">
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                          {/* Assignment Info */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
                                  <FileText className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 transition-colors">
                                    {assignment.title}
                                  </h3>
                                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                    {assignment.description}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-3 mt-3">
                              <Badge className={`${deadlineInfo.color} border-none flex items-center gap-1`}>
                                {deadlineInfo.icon}
                                {deadlineInfo.text}
                              </Badge>
                              <Badge className={`${submissionStatus.color} border-none`}>
                                {submissionStatus.label}
                              </Badge>
                              <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(assignment.deadline).toLocaleDateString()}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                <Award className="w-3 h-3" />
                                {assignment.maxPoints || 100} pts
                              </span>
                            </div>
                          </div>

                          {/* Grade & Submit */}
                          <div className="flex items-center gap-4">
                            {submission?.status === "graded" && (
                              <div className="text-right">
                                <div className="flex items-center gap-2">
                                  <Award className="w-5 h-5 text-primary" />
                                  <span className="text-2xl font-bold text-primary">
                                    {submission.grade}
                                  </span>
                                  <span className="text-sm text-gray-500 dark:text-gray-400">
                                    / {assignment.maxPoints || 100}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {((submission.grade / (assignment.maxPoints || 100)) * 100).toFixed(0)}%
                                </p>
                              </div>
                            )}

                            <Button
                              onClick={() => handleSubmitClick(assignment)}
                              className={submission
                                ? "bg-slate-100 hover:bg-slate-200 text-slate-900 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-100"
                                : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30"
                              }
                            >
                              <Send className="w-4 h-4 mr-2" />
                              {submission ? "Update" : "Submit"}
                            </Button>
                          </div>
                        </div>

                        {/* Feedback Display */}
                        {submission?.feedback && (
                          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                            <div className="flex items-start gap-2 p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                              <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                              <div>
                                <p className="text-sm font-medium text-green-800 dark:text-green-300">Instructor Feedback</p>
                                <p className="text-sm text-green-700 dark:text-green-400 mt-1">{submission.feedback}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </FadeIn>

      {/* Submit Assignment Modal */}
      <SubmitAssignmentModal
        isOpen={isSubmitModalOpen}
        onClose={() => {
          setIsSubmitModalOpen(false);
          setSelectedAssignment(null);
          setExistingSubmission(null);
        }}
        assignment={selectedAssignment}
        existingSubmission={existingSubmission}
        onSubmitSuccess={handleSubmitSuccess}
      />
    </div>
  );
};

export default MyEnrollClassDetails;