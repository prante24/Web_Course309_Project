import { useState, useEffect } from "react"
import axios from "axios"
import ClassCard from "./ClassCard"
import { EmptyState } from "@/components/ui/empty-state"
import { BookOpen, SlidersHorizontal } from "lucide-react"
import { FadeIn, SkeletonLoader } from "@/components/ui/micro-interactions"

const AllClasses = () => {
  const [classes, setClasses] = useState([])
  const [sortOrder, setSortOrder] = useState("default") // default, asc, desc
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true)
      try {
        const response = await axios.get("https://edumanagebackend.vercel.app/classes?status=approved")
        setClasses(response.data.classes)
      } catch (error) {
        console.error("Error fetching classes:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchClasses()
  }, [])

  const handleSort = (order) => {
    setSortOrder(order)
    const sortedClasses = [...classes].sort((a, b) => {
      if (order === "asc") {
        return a.price - b.price
      } else if (order === "desc") {
        return b.price - a.price
      }
      return 0
    })
    setClasses(sortedClasses)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <FadeIn>
          <div className="mb-12">
            {/* Title Section */}
            <div className="text-center mb-8">
              <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                Explore All Classes
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Discover world-class courses taught by expert instructors. Start learning today and unlock your potential.
              </p>
            </div>

            {/* Sort Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-white dark:bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                  <SlidersHorizontal className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">Sort by Price</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {classes.length} {classes.length === 1 ? 'course' : 'courses'} available
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleSort("asc")}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${sortOrder === "asc"
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30 dark:shadow-purple-500/30 scale-105"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  disabled={loading}
                >
                  <span className="text-lg">↑</span>
                  Low to High
                </button>
                <button
                  onClick={() => handleSort("desc")}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${sortOrder === "desc"
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30 dark:shadow-purple-500/30 scale-105"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  disabled={loading}
                >
                  <span className="text-lg">↓</span>
                  High to Low
                </button>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="space-y-4">
                <SkeletonLoader className="h-52 w-full rounded-2xl" />
                <SkeletonLoader className="h-6 w-3/4" />
                <SkeletonLoader className="h-4 w-1/2" />
                <SkeletonLoader className="h-12 w-full rounded-xl" />
              </div>
            ))}
          </div>
        ) : classes.length === 0 ? (
          /* Empty State */
          <EmptyState
            icon={BookOpen}
            title="No Classes Available"
            description="There are no approved classes at the moment. Please check back later or contact support."
            illustration={
              <img
                src="https://i.postimg.cc/T1VJzmq8/undraw-empty-re-opql.svg"
                alt="No classes"
                className="w-64 h-64 mb-4"
              />
            }
          />
        ) : (
          /* Classes Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {classes.map((classItem, index) => (
              <FadeIn key={classItem._id} delay={index * 0.05}>
                <ClassCard classItem={classItem} />
              </FadeIn>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AllClasses