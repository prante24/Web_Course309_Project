import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import axios from "axios"
import { CheckCircle, XCircle, TrendingUp, Search, BookOpen, Users, Loader2, Eye } from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "react-hot-toast"

const FadeIn = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
  >
    {children}
  </motion.div>
);

const AllClassesAdmin = () => {
  const [classes, setClasses] = useState([])
  const [filteredClasses, setFilteredClasses] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    fetchClasses()
  }, [])

  useEffect(() => {
    filterClasses()
  }, [searchTerm, statusFilter, classes])

  const fetchClasses = async () => {
    setLoading(true)
    try {
      const response = await axios.get("https://edumanagebackend.vercel.app/all-classes")
      setClasses(response.data)
      setFilteredClasses(response.data)
    } catch (error) {
      console.error("Error fetching classes:", error)
      toast.error("Failed to fetch classes")
    } finally {
      setLoading(false)
    }
  }

  const filterClasses = () => {
    let filtered = classes

    if (searchTerm) {
      filtered = filtered.filter(
        (cls) =>
          cls.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cls.instructorEmail.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((cls) => cls.status === statusFilter)
    }

    setFilteredClasses(filtered)
  }

  const handleApprove = async (id) => {
    setProcessing(true)
    try {
      await axios.put(`https://edumanagebackend.vercel.app/classes/${id}/approve`)
      toast.success("Class approved successfully")
      fetchClasses()
    } catch (error) {
      console.error("Error approving class:", error)
      toast.error("Failed to approve class")
    } finally {
      setProcessing(false)
    }
  }

  const handleReject = async (id) => {
    setProcessing(true)
    try {
      await axios.put(`https://edumanagebackend.vercel.app/classes/${id}/reject`)
      toast.success("Class rejected")
      fetchClasses()
    } catch (error) {
      console.error("Error rejecting class:", error)
      toast.error("Failed to reject class")
    } finally {
      setProcessing(false)
    }
  }

  const handleProgress = (id) => {
    console.log("View progress for class:", id)
    toast("Progress view coming soon!", { icon: "📊" })
  }

  const statusCounts = {
    total: classes.length,
    approved: classes.filter((c) => c.status === "approved").length,
    pending: classes.filter((c) => c.status === "pending").length,
    rejected: classes.filter((c) => c.status === "rejected").length,
  }

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px] gap-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-600 dark:text-gray-400 font-medium">Loading classes...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <FadeIn>
          <motion.div whileHover={{ y: -2 }} className="cursor-pointer" onClick={() => setStatusFilter("all")}>
            <Card className={`border-none shadow-sm hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-900/50 backdrop-blur-xl ${statusFilter === "all" ? "ring-2 ring-blue-500" : ""}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Classes</p>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{statusCounts.total}</h3>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <motion.div whileHover={{ y: -2 }} className="cursor-pointer" onClick={() => setStatusFilter("approved")}>
            <Card className={`border-none shadow-sm hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-900/50 backdrop-blur-xl ${statusFilter === "approved" ? "ring-2 ring-green-500" : ""}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Approved</p>
                    <h3 className="text-2xl font-bold text-green-600">{statusCounts.approved}</h3>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <motion.div whileHover={{ y: -2 }} className="cursor-pointer" onClick={() => setStatusFilter("pending")}>
            <Card className={`border-none shadow-sm hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-900/50 backdrop-blur-xl ${statusFilter === "pending" ? "ring-2 ring-yellow-500" : ""}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
                    <h3 className="text-2xl font-bold text-yellow-600">{statusCounts.pending}</h3>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center shadow-lg shadow-yellow-500/30">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </FadeIn>

        <FadeIn delay={0.3}>
          <motion.div whileHover={{ y: -2 }} className="cursor-pointer" onClick={() => setStatusFilter("rejected")}>
            <Card className={`border-none shadow-sm hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-900/50 backdrop-blur-xl ${statusFilter === "rejected" ? "ring-2 ring-red-500" : ""}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Rejected</p>
                    <h3 className="text-2xl font-bold text-red-600">{statusCounts.rejected}</h3>
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

      {/* Search Bar */}
      <FadeIn delay={0.4}>
        <Card className="border-none shadow-sm bg-white dark:bg-gray-900/50 backdrop-blur-xl">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search by title or instructor email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 dark:bg-gray-800 dark:text-white dark:border-gray-700"
              />
            </div>
          </CardContent>
        </Card>
      </FadeIn>

      {/* Classes Grid */}
      {filteredClasses.length === 0 ? (
        <FadeIn delay={0.5}>
          <Card className="border-none shadow-sm bg-white dark:bg-gray-900/50 backdrop-blur-xl">
            <CardContent className="p-12 text-center">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Classes Found</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filters."
                  : "No classes have been submitted yet."}
              </p>
            </CardContent>
          </Card>
        </FadeIn>
      ) : (
        <div className="grid gap-4">
          {filteredClasses.map((classItem, index) => (
            <FadeIn key={classItem._id} delay={0.5 + index * 0.05}>
              <Card className="border-none shadow-sm hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-900/50 backdrop-blur-xl group">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Image */}
                    <div className="flex-shrink-0">
                      <div className="relative w-full lg:w-48 h-32 rounded-xl overflow-hidden ring-2 ring-gray-200 dark:ring-gray-700 group-hover:ring-blue-500 dark:group-hover:ring-blue-400 transition-all">
                        <img
                          src={classItem.image || "/placeholder.svg"}
                          alt={classItem.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 right-2">
                          <Badge className={`${classItem.status === "approved" ? "bg-green-500 text-white" :
                            classItem.status === "pending" ? "bg-yellow-500 text-white" :
                              "bg-red-500 text-white"
                            } border-none shadow-lg`}>
                            {classItem.status}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                        {classItem.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                        {classItem.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span>{classItem.instructorEmail}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4" />
                          <span>{classItem.totalEnrollment || 0} enrolled</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex lg:flex-col gap-2 justify-end">
                      <Button
                        onClick={() => handleApprove(classItem._id)}
                        disabled={classItem.status === "approved" || processing}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed flex-1 lg:flex-initial"
                      >
                        {processing ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <CheckCircle className="h-4 w-4 mr-1" />}
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleReject(classItem._id)}
                        disabled={classItem.status === "rejected" || processing}
                        size="sm"
                        variant="destructive"
                        className="flex-1 lg:flex-initial"
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                      <Button
                        onClick={() => handleProgress(classItem._id)}
                        disabled={classItem.status !== "approved"}
                        size="sm"
                        variant="outline"
                        className="flex-1 lg:flex-initial dark:border-gray-700 dark:text-gray-300"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
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
  )
}

export default AllClassesAdmin

