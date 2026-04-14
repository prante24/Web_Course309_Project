import { useContext, useEffect, useState, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import axios from "axios"
import { AuthContext } from "@/provider/AuthProvider"
import { motion } from "framer-motion"
import {
  Search,
  Eye,
  Trash2,
  Users,
  DollarSign,
  BookOpen,
  CheckCircle,
  Clock,
  XCircle,
  Plus
} from "lucide-react"
import toast from "react-hot-toast"
import { Link } from "react-router-dom"

const MyClasses = () => {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  const fetchClasses = useCallback(async () => {
    try {
      setLoading(true)
      const response = await axios.get(`https://edumanagebackend.vercel.app/classes?instructorEmail=${user?.email}`)
      setClasses(response.data.classes || [])
    } catch (error) {
      console.error("Error fetching classes:", error)
      toast.error("Failed to load classes")
    } finally {
      setLoading(false)
    }
  }, [user?.email])

  useEffect(() => {
    if (user?.email) {
      fetchClasses()
    }
  }, [user?.email, fetchClasses])

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this class?")) {
      try {
        await axios.delete(`https://edumanagebackend.vercel.app/classes/${id}`)
        toast.success("Class deleted successfully")
        fetchClasses()
      } catch (error) {
        console.error("Error deleting class:", error)
        toast.error("Failed to delete class")
      }
    }
  }

  const handleSeeDetails = (id) => {
    navigate(`/teacher/my-classes/${id}`)
  }

  const getStatusBadge = (status) => {
    const styles = {
      approved: "bg-green-500 text-white",
      pending: "bg-yellow-500 text-white",
      rejected: "bg-red-500 text-white"
    }
    const icons = {
      approved: <CheckCircle className="w-3 h-3 mr-1" />,
      pending: <Clock className="w-3 h-3 mr-1" />,
      rejected: <XCircle className="w-3 h-3 mr-1" />
    }
    return { style: styles[status] || styles.pending, icon: icons[status] }
  }

  const filteredClasses = classes.filter((cls) => {
    const matchesSearch = cls.title?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === "all" || cls.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const statusCounts = {
    all: classes.length,
    approved: classes.filter(c => c.status === "approved").length,
    pending: classes.filter(c => c.status === "pending").length,
    rejected: classes.filter(c => c.status === "rejected").length
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
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-600 dark:text-gray-400 font-medium">Loading your classes...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <FadeIn>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">My Classes</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage and track all your courses
            </p>
          </div>
          <Link to="/teacher/addclass">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/30">
              <Plus className="w-4 h-4 mr-2" />
              Create New Class
            </Button>
          </Link>
        </div>
      </FadeIn>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <FadeIn delay={0.1}>
          <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={() => setFilterStatus("all")}
            className="cursor-pointer"
          >
            <Card className={`border-none shadow-sm transition-all duration-300 ${filterStatus === "all"
              ? "ring-2 ring-blue-500 shadow-lg"
              : "hover:shadow-lg"
              } bg-white dark:bg-gray-900/50 backdrop-blur-xl`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Total</p>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {statusCounts.all}
                    </h3>
                  </div>
                  <BookOpen className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={() => setFilterStatus("approved")}
            className="cursor-pointer"
          >
            <Card className={`border-none shadow-sm transition-all duration-300 ${filterStatus === "approved"
              ? "ring-2 ring-green-500 shadow-lg"
              : "hover:shadow-lg"
              } bg-white dark:bg-gray-900/50 backdrop-blur-xl`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Approved</p>
                    <h3 className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {statusCounts.approved}
                    </h3>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </FadeIn>

        <FadeIn delay={0.3}>
          <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={() => setFilterStatus("pending")}
            className="cursor-pointer"
          >
            <Card className={`border-none shadow-sm transition-all duration-300 ${filterStatus === "pending"
              ? "ring-2 ring-yellow-500 shadow-lg"
              : "hover:shadow-lg"
              } bg-white dark:bg-gray-900/50 backdrop-blur-xl`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Pending</p>
                    <h3 className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                      {statusCounts.pending}
                    </h3>
                  </div>
                  <Clock className="w-8 h-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </FadeIn>

        <FadeIn delay={0.4}>
          <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={() => setFilterStatus("rejected")}
            className="cursor-pointer"
          >
            <Card className={`border-none shadow-sm transition-all duration-300 ${filterStatus === "rejected"
              ? "ring-2 ring-red-500 shadow-lg"
              : "hover:shadow-lg"
              } bg-white dark:bg-gray-900/50 backdrop-blur-xl`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Rejected</p>
                    <h3 className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {statusCounts.rejected}
                    </h3>
                  </div>
                  <XCircle className="w-8 h-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </FadeIn>
      </div>

      {/* Search */}
      <FadeIn delay={0.5}>
        <Card className="border-none shadow-sm bg-white dark:bg-gray-900/50 backdrop-blur-xl">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search classes by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </CardContent>
        </Card>
      </FadeIn>

      {/* Classes Grid */}
      {filteredClasses.length === 0 ? (
        <FadeIn delay={0.6}>
          <Card className="border-none shadow-sm bg-white dark:bg-gray-900/50 backdrop-blur-xl">
            <CardContent className="p-12 text-center">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {searchQuery ? "No classes found" : "No classes yet"}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {searchQuery ? "Try a different search term" : "Create your first class to get started"}
              </p>
              {!searchQuery && (
                <Link to="/teacher/addclass">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Class
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        </FadeIn>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClasses.map((classItem, index) => {
            const statusBadge = getStatusBadge(classItem.status)
            return (
              <FadeIn key={classItem._id} delay={0.6 + index * 0.05}>
                <Card className="border-none shadow-sm hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-900/50 backdrop-blur-xl group overflow-hidden">
                  <div className="relative overflow-hidden">
                    <img
                      src={classItem.image || "/placeholder.svg"}
                      alt={classItem.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3">
                      <Badge className={`${statusBadge.style} shadow-lg flex items-center`}>
                        {statusBadge.icon}
                        {classItem.status}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {classItem.title}
                    </h3>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <DollarSign className="w-4 h-4" />
                        <span className="font-semibold">${classItem.price}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Users className="w-4 h-4" />
                        <span>{classItem.totalEnrollment || 0} students enrolled</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleSeeDetails(classItem._id)}
                        disabled={classItem.status !== "approved"}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                        size="sm"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Details
                      </Button>
                      <Button
                        onClick={() => handleDelete(classItem._id)}
                        variant="destructive"
                        size="sm"
                        className="px-3"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default MyClasses

