import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  FiUsers,
  FiClock,
  FiStar,
  FiBookOpen,
  FiAward,
  FiPlay,
  FiCheckCircle,
  FiArrowLeft
} from "react-icons/fi"
import { motion } from "framer-motion"
import { Breadcrumbs } from "@/components/ui/breadcrumbs"
import { FadeIn, SkeletonLoader } from "@/components/ui/micro-interactions"

const ClassDetailsEnroll = () => {
  const [classDetails, setClassDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchClassDetails = async () => {
      setLoading(true)
      try {
        const response = await axios.get(`https://edumanagebackend.vercel.app/classes/${id}`)
        setClassDetails(response.data)
      } catch (error) {
        console.error("Error fetching class details:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchClassDetails()
  }, [id])

  const handleEnroll = () => {
    navigate(`/payment/${id}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <SkeletonLoader className="h-8 w-64 mb-6" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <SkeletonLoader className="h-96 w-full rounded-2xl" />
              <SkeletonLoader className="h-64 w-full rounded-2xl" />
            </div>
            <div>
              <SkeletonLoader className="h-[500px] w-full rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!classDetails) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Class not found</p>
      </div>
    )
  }

  const breadcrumbItems = [
    { label: "All Classes", href: "/all-classes" },
    { label: classDetails.title }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Back Button & Breadcrumbs */}
        <FadeIn>
          <div className="mb-6 space-y-4">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors group"
            >
              <FiArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back to Classes</span>
            </button>
            <Breadcrumbs items={breadcrumbItems} />
          </div>
        </FadeIn>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Section */}
            <FadeIn delay={0.1}>
              <Card className="overflow-hidden border-none shadow-xl bg-white dark:bg-gray-900/50 backdrop-blur-sm">
                {/* Image */}
                <div className="relative h-[400px] overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
                  <img
                    src={classDetails.image || "/placeholder.svg"}
                    alt={classDetails.title}
                    className="w-full h-full object-cover"
                  />

                  {/* Floating Badges */}
                  <div className="absolute top-6 left-6 z-20 flex gap-3">
                    <Badge className="px-4 py-2 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md text-gray-900 dark:text-white border-none shadow-lg text-sm font-semibold">
                      <FiBookOpen className="w-4 h-4 mr-2 inline" />
                      {classDetails.category}
                    </Badge>
                    {classDetails.rating && (
                      <Badge className="px-4 py-2 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md text-gray-900 dark:text-white border-none shadow-lg text-sm font-semibold">
                        <FiStar className="w-4 h-4 mr-2 inline fill-yellow-400 text-yellow-400" />
                        {classDetails.rating}
                      </Badge>
                    )}
                  </div>

                  {/* Play Button Overlay */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="absolute inset-0 z-20 flex items-center justify-center"
                  >
                    <div className="w-20 h-20 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-md flex items-center justify-center shadow-2xl">
                      <FiPlay className="w-8 h-8 text-blue-600 ml-1" />
                    </div>
                  </motion.button>
                </div>

                {/* Title & Instructor */}
                <CardContent className="p-8">
                  <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
                    {classDetails.title}
                  </h1>

                  {/* Instructor Info */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative">
                      <img
                        src={classDetails.instructorImage || "/placeholder-avatar.svg"}
                        alt={classDetails.instructorName}
                        className="w-16 h-16 rounded-full object-cover ring-4 ring-gray-200 dark:ring-gray-800"
                      />
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-4 border-white dark:border-gray-900" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Instructor</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {classDetails.instructorName}
                      </p>
                    </div>
                    <div className="ml-auto">
                      <Badge className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-none">
                        <FiAward className="w-4 h-4 mr-1 inline" />
                        Expert
                      </Badge>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-4 py-6 border-y border-gray-200 dark:border-gray-800">
                    <div className="text-center">
                      <FiUsers className="w-6 h-6 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {classDetails.totalEnrollment}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Students</p>
                    </div>
                    <div className="text-center border-x border-gray-200 dark:border-gray-800">
                      <FiClock className="w-6 h-6 mx-auto mb-2 text-purple-600 dark:text-purple-400" />
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {classDetails.duration}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Duration</p>
                    </div>
                    <div className="text-center">
                      <FiBookOpen className="w-6 h-6 mx-auto mb-2 text-green-600 dark:text-green-400" />
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {classDetails.lessons || "12"}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Lessons</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            {/* Description */}
            <FadeIn delay={0.2}>
              <Card className="border-none shadow-sm bg-white dark:bg-gray-900/50 backdrop-blur-sm">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3">
                    <div className="w-1 h-8 bg-blue-600 rounded-full" />
                    About This Class
                  </h2>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg">
                    {classDetails.description}
                  </p>
                </CardContent>
              </Card>
            </FadeIn>

            {/* What You'll Learn */}
            <FadeIn delay={0.3}>
              <Card className="border-none shadow-sm bg-white dark:bg-gray-900/50 backdrop-blur-sm">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                    <div className="w-1 h-8 bg-blue-600 rounded-full" />
                    What You'll Learn
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      "Master the fundamentals and advanced concepts",
                      "Build real-world projects from scratch",
                      "Learn industry best practices",
                      "Get hands-on experience",
                      "Access to exclusive resources",
                      "Certificate upon completion"
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        <FiCheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-700 dark:text-slate-300">{item}</span>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          </div>

          {/* Sticky Sidebar */}
          <div className="lg:col-span-1">
            <FadeIn delay={0.2}>
              <div className="sticky top-8">
                <Card className="border-none shadow-lg bg-white dark:bg-gray-900/80 backdrop-blur-xl overflow-hidden">
                  {/* Price Header */}
                  <div className="bg-blue-600 dark:bg-blue-600 p-6 text-white">
                    <p className="text-sm font-medium opacity-90 mb-2">Course Price</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold">${classDetails.price}</span>
                      {classDetails.originalPrice && (
                        <span className="text-xl line-through opacity-60">
                          ${classDetails.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>

                  <CardContent className="p-6 space-y-6">
                    {/* Enroll Button */}
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        onClick={handleEnroll}
                        size="lg"
                        className="w-full h-14 text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white border-none shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300"
                      >
                        Enroll Now
                      </Button>
                    </motion.div>

                    {/* Features List */}
                    <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                      <p className="font-semibold text-gray-900 dark:text-white mb-4">
                        This course includes:
                      </p>
                      {[
                        { icon: FiPlay, text: "On-demand video lessons" },
                        { icon: FiBookOpen, text: "Downloadable resources" },
                        { icon: FiAward, text: "Certificate of completion" },
                        { icon: FiUsers, text: "Community access" }
                      ].map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 text-gray-700 dark:text-gray-300"
                        >
                          <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                            <feature.icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <span className="text-sm">{feature.text}</span>
                        </div>
                      ))}
                    </div>

                    {/* Money Back Guarantee */}
                    <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                      <div className="flex items-start gap-3">
                        <FiCheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-blue-900 dark:text-blue-100 text-sm">
                            30-Day Money-Back Guarantee
                          </p>
                          <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                            Full refund if you're not satisfied
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClassDetailsEnroll

