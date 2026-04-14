import { useState, useEffect, useContext } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import {
  TrendingUp,
  Target,
  Award,
  Activity,
  BarChart3,
  CheckCircle,
  Clock,
  Zap,
  BookOpen,
  Brain
} from "lucide-react"
import { AuthContext } from "@/provider/AuthProvider"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts'

const PerformanceAnalytics = () => {
  const { user } = useContext(AuthContext)
  const [enrolledClasses, setEnrolledClasses] = useState([])
  const [quizHistory, setQuizHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await fetch('https://edumanagebackend.vercel.app/users')
        const users = await userRes.json()
        const userId = users.find((u) => u.email === user?.email)?.uid

        const classesRes = await fetch(`https://edumanagebackend.vercel.app/enrolled-classes/${userId}`)
        const classesData = await classesRes.json()
        setEnrolledClasses(classesData.enrolledClasses || [])

        // Mock quiz history (replace with actual API)
        const mockQuizzes = [
          { date: "Nov 1", score: 75, subject: "React" },
          { date: "Nov 3", score: 82, subject: "Node.js" },
          { date: "Nov 5", score: 88, subject: "React" },
          { date: "Nov 7", score: 91, subject: "Database" },
          { date: "Nov 9", score: 85, subject: "Node.js" },
          { date: "Nov 11", score: 94, subject: "React" },
        ]
        setQuizHistory(mockQuizzes)
      } catch (error) {
        console.error("Error fetching analytics:", error)
      } finally {
        setLoading(false)
      }
    }

    if (user?.email) fetchData()
  }, [user])

  // Calculate statistics
  const totalQuizzes = quizHistory.length
  const averageScore = quizHistory.reduce((acc, q) => acc + q.score, 0) / totalQuizzes || 0
  const highestScore = Math.max(...quizHistory.map(q => q.score), 0)
  const improvementRate = quizHistory.length > 1
    ? ((quizHistory[quizHistory.length - 1].score - quizHistory[0].score) / quizHistory[0].score * 100)
    : 0

  const completionRate = enrolledClasses.reduce((acc, c) => acc + (c.progress || 0), 0) / enrolledClasses.length || 0

  // Subject performance
  const subjectPerformance = {}
  quizHistory.forEach(quiz => {
    if (!subjectPerformance[quiz.subject]) {
      subjectPerformance[quiz.subject] = { total: 0, count: 0 }
    }
    subjectPerformance[quiz.subject].total += quiz.score
    subjectPerformance[quiz.subject].count += 1
  })

  const radarData = Object.keys(subjectPerformance).map(subject => ({
    subject,
    score: Math.round(subjectPerformance[subject].total / subjectPerformance[subject].count)
  }))

  const performanceDistribution = [
    { name: "Excellent (90+)", value: quizHistory.filter(q => q.score >= 90).length },
    { name: "Good (80-89)", value: quizHistory.filter(q => q.score >= 80 && q.score < 90).length },
    { name: "Average (70-79)", value: quizHistory.filter(q => q.score >= 70 && q.score < 80).length },
    { name: "Needs Work (<70)", value: quizHistory.filter(q => q.score < 70).length },
  ]

  const COLORS = ['#3b82f6', '#8b5cf6', '#6366f1', '#a855f7']

  const stats = [
    {
      label: "Average Score",
      value: `${averageScore.toFixed(1)}%`,
      icon: Target,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
      iconColor: "text-blue-600"
    },
    {
      label: "Quizzes Taken",
      value: totalQuizzes,
      icon: Activity,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
      iconColor: "text-purple-600"
    },
    {
      label: "Highest Score",
      value: `${highestScore}%`,
      icon: Award,
      color: "from-blue-600 to-purple-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
      iconColor: "text-blue-600"
    },
    {
      label: "Improvement",
      value: `${improvementRate > 0 ? '+' : ''}${improvementRate.toFixed(1)}%`,
      icon: TrendingUp,
      color: "from-purple-600 to-blue-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
      iconColor: "text-purple-600"
    }
  ]

  if (loading) {
    return (
      <div className="container mx-auto p-4 max-w-7xl">
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Performance Analytics
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Track your learning progress</p>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-none shadow-lg bg-white dark:bg-gray-900/50 backdrop-blur-xl hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
                    <h3 className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                      {stat.value}
                    </h3>
                  </div>
                  <div className={`w-14 h-14 rounded-2xl ${stat.bgColor} flex items-center justify-center`}>
                    <stat.icon className={`w-7 h-7 ${stat.iconColor}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Score Trend */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-none shadow-lg bg-white dark:bg-gray-900/50 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Score Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={quizHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                  <XAxis dataKey="date" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="url(#colorGradient)"
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', r: 5 }}
                  />
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Performance Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-none shadow-lg bg-white dark:bg-gray-900/50 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                Performance Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={performanceDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {performanceDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject Radar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-none shadow-lg bg-white dark:bg-gray-900/50 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Brain className="w-5 h-5 text-blue-600" />
                Subject Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#374151" />
                  <PolarAngleAxis dataKey="subject" stroke="#6b7280" />
                  <PolarRadiusAxis stroke="#6b7280" />
                  <Radar name="Score" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Course Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-none shadow-lg bg-white dark:bg-gray-900/50 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-600" />
                Course Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={enrolledClasses.slice(0, 5)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                  <XAxis dataKey="title" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Bar dataKey="progress" fill="url(#barGradient)" radius={[8, 8, 0, 0]} />
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-6"
      >
        <Card className="border-none shadow-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">AI Insights</h3>
                <p className="text-sm opacity-90">
                  {averageScore >= 85
                    ? "🎉 Excellent performance! You're mastering the material. Keep up the great work!"
                    : averageScore >= 70
                      ? "👍 Good progress! Focus on your weaker subjects to boost your overall performance."
                      : "💪 Keep practicing! Regular study sessions will help improve your scores."}
                </p>
                <p className="text-sm opacity-90 mt-2">
                  {improvementRate > 0
                    ? `📈 You've improved by ${improvementRate.toFixed(1)}% - trending upward!`
                    : "📊 Stay consistent with your studies to see improvement trends."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default PerformanceAnalytics
