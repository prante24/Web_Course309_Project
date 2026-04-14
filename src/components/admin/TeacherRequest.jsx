import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Loader2, CheckCircle, XCircle, GraduationCap, Award, Clock } from "lucide-react";
import { motion } from "framer-motion";

const FadeIn = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
  >
    {children}
  </motion.div>
);

const TeacherRequest = () => {
  const [teacherRequests, setTeacherRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchTeacherRequests();
  }, []);

  const fetchTeacherRequests = async () => {
    try {
      const response = await axios.get("https://edumanagebackend.vercel.app/reqteachers");
      setTeacherRequests(response.data.classes);
    } catch (error) {
      console.error("Error fetching teacher requests:", error);
      toast.error("Failed to fetch teacher requests");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (request) => {
    setProcessing(true);
    try {
      console.log("Approving request for:", request.instructorEmail);

      // Step 1: Approve the teacher request
      const approveResponse = await axios.put(
        `https://edumanagebackend.vercel.app/reqteachers/${request._id}/approve`
      );
      console.log("Approval response:", approveResponse.data);

      toast.success("Teacher request approved successfully");
      fetchTeacherRequests(); // Refresh the list
    } catch (error) {
      console.error("Error approving request:", error);
      toast.error(`Failed to approve: ${error.response?.data?.message || error.message}`);
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async (id) => {
    setProcessing(true);
    try {
      await axios.put(`https://edumanagebackend.vercel.app/reqteachers/${id}/reject`);
      toast.success("Teacher request rejected");
      fetchTeacherRequests();
    } catch (error) {
      console.error("Error rejecting request:", error);
      toast.error("Failed to reject teacher request");
    } finally {
      setProcessing(false);
    }
  };

  const statusCounts = {
    total: teacherRequests.length,
    pending: teacherRequests.filter(r => r.status === "pending").length,
    approved: teacherRequests.filter(r => r.status === "approved").length,
    rejected: teacherRequests.filter(r => r.status === "rejected").length
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px] gap-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-600 dark:text-gray-400 font-medium">Loading teacher requests...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <FadeIn>
          <motion.div whileHover={{ y: -2 }}>
            <Card className="border-none shadow-sm hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-900/50 backdrop-blur-xl">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Requests</p>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{statusCounts.total}</h3>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <motion.div whileHover={{ y: -2 }}>
            <Card className="border-none shadow-sm hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-900/50 backdrop-blur-xl">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
                    <h3 className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{statusCounts.pending}</h3>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center shadow-lg shadow-yellow-500/30">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <motion.div whileHover={{ y: -2 }}>
            <Card className="border-none shadow-sm hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-900/50 backdrop-blur-xl">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Approved</p>
                    <h3 className="text-2xl font-bold text-green-600 dark:text-green-400">{statusCounts.approved}</h3>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </FadeIn>

        <FadeIn delay={0.3}>
          <motion.div whileHover={{ y: -2 }}>
            <Card className="border-none shadow-sm hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-900/50 backdrop-blur-xl">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Rejected</p>
                    <h3 className="text-2xl font-bold text-red-600 dark:text-red-400">{statusCounts.rejected}</h3>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/30">
                    <XCircle className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </FadeIn>
      </div>

      {/* Teacher Requests Grid */}
      {teacherRequests.length === 0 ? (
        <FadeIn delay={0.4}>
          <Card className="border-none shadow-sm bg-white dark:bg-gray-900/50 backdrop-blur-xl">
            <CardContent className="p-12 text-center">
              <GraduationCap className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Teacher Requests</h3>
              <p className="text-gray-600 dark:text-gray-400">
                No teacher applications have been submitted yet.
              </p>
            </CardContent>
          </Card>
        </FadeIn>
      ) : (
        <div className="grid gap-4">
          {teacherRequests.map((request, index) => (
            <FadeIn key={request._id} delay={0.4 + index * 0.05}>
              <Card className="border-none shadow-sm hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-900/50 backdrop-blur-xl group">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Profile Section */}
                    <div className="flex items-center gap-4 flex-1">
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        <div className="relative">
                          <div className="w-20 h-20 rounded-xl overflow-hidden ring-2 ring-gray-200 dark:ring-gray-700 group-hover:ring-blue-500 dark:group-hover:ring-blue-400 transition-all">
                            <img
                              src={request.instructorImage}
                              alt={request.instructorName}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {request.instructorName}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-1">
                          {request.title}
                        </p>
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-none">
                            <Award className="w-3 h-3 mr-1" />
                            {request.experience}
                          </Badge>
                          <Badge className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-none">
                            {request.category}
                          </Badge>
                          <Badge className={`${request.status === "pending" ? "bg-yellow-500 text-white" :
                            request.status === "approved" ? "bg-green-500 text-white" :
                              "bg-red-500 text-white"
                            } border-none shadow-sm`}>
                            {request.status === "approved" && <CheckCircle className="w-3 h-3 mr-1" />}
                            {request.status === "rejected" && <XCircle className="w-3 h-3 mr-1" />}
                            {request.status === "pending" && <Clock className="w-3 h-3 mr-1" />}
                            {request.status}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex lg:flex-col gap-2 justify-end">
                      <Button
                        onClick={() => handleApprove(request)}
                        disabled={request.status !== "pending" || processing}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed flex-1 lg:flex-initial"
                      >
                        {processing ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-1" />
                        ) : (
                          <CheckCircle className="h-4 w-4 mr-1" />
                        )}
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleReject(request._id)}
                        disabled={request.status !== "pending" || processing}
                        size="sm"
                        variant="destructive"
                        className="flex-1 lg:flex-initial"
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeacherRequest;