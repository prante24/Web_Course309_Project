import { Link, NavLink, Outlet, useNavigate } from "react-router-dom"
import { useContext, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LayoutDashboard, BookOpen, User, LogOut, Menu, X, Home, GraduationCap, Star, Clock, TrendingUp, Award, Activity, ChevronRight, Brain, MessageCircle, BarChart3, Bell, Sparkles, Trophy, FileCheck, CheckCircle } from "lucide-react"
import { AuthContext } from "@/provider/AuthProvider"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts'
import { motion, AnimatePresence } from "framer-motion"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { FadeIn } from "@/components/ui/micro-interactions"
import PageTitle from "@/components/PageTitle"


const DashboardLayout = () => {
  const { user, logOut } = useContext(AuthContext)
  const navigate = useNavigate()
  const [isSidebarOpen, setSidebarOpen] = useState(false)
  const [enrolledClasses, setEnrolledClasses] = useState([])
  const [reviews, setReviews] = useState([])
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const handleLogout = () => {
    logOut()
      .then(() => navigate("/"))
      .catch(err => console.log(err))
  }

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch user details
        const userRes = await fetch('https://edumanagebackend.vercel.app/users');
        const users = await userRes.json();
        const userId = users.find((u) => u.email === user?.email)?.uid;

        // Fetch enrolled classes
        const classesResponse = await fetch(`https://edumanagebackend.vercel.app/enrolled-classes/${userId}`);
        if (!classesResponse.ok) {
          throw new Error('Failed to fetch enrolled classes');
        }
        const classesData = await classesResponse.json();
        setEnrolledClasses(classesData.enrolledClasses || []);

        // Fetch reviews
        const reviewsResponse = await fetch('https://edumanagebackend.vercel.app/reviews');
        if (!reviewsResponse.ok) {
          throw new Error('Failed to fetch reviews');
        }
        const reviewsData = await reviewsResponse.json();
        setReviews(reviewsData.reviews || []);

        // Fetch submissions
        const submissionsResponse = await fetch(`https://edumanagebackend.vercel.app/students/${userId}/submissions`);
        if (submissionsResponse.ok) {
          const submissionsData = await submissionsResponse.json();
          setSubmissions(submissionsData.submissions || []);
        }

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) {
      fetchDashboardData();
    }
  }, [user]);

  const navItems = [
    { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/dashboard/my-enroll-class", icon: BookOpen, label: "My Enroll Class" },
    { path: "/dashboard/assignments", icon: Award, label: "My Assignments" },
    { path: "/dashboard/quiz-generator", icon: Brain, label: "Quiz Generator" },
    { path: "/dashboard/ai-study-buddy", icon: MessageCircle, label: "AI Study Buddy" },
    { path: "/dashboard/analytics", icon: BarChart3, label: "Analytics" },
    { path: "/dashboard/flashcards", icon: Sparkles, label: "Flashcards" },
    { path: "/dashboard/achievements", icon: Trophy, label: "Achievements" },
    { path: "/dashboard/notifications", icon: Bell, label: "Notifications" },
    { path: "/dashboard/profile", icon: User, label: "Profile" },
  ]

  // Calculate statistics
  const totalEnrolledCourses = enrolledClasses.length;
  const averageProgress = enrolledClasses.reduce((acc, course) => acc + (course.progress || 0), 0) / totalEnrolledCourses || 0;
  const completedCourses = enrolledClasses.filter(course => course.progress === 100).length;

  // Chart data
  const progressData = enrolledClasses.map(course => ({
    name: course.title?.substring(0, 15) + '...',
    progress: course.progress || 0
  }));

  const NavItem = ({ path, icon: Icon, label }) => (
    <NavLink
      to={path}
      end={path === "/dashboard"}
      className={({ isActive }) =>
        `group flex items-center gap-3 px-4 py-2.5 mx-2 rounded-xl font-medium transition-all duration-200
        ${isActive
          ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
          : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400"
        }`
      }
    >
      <Icon className={`h-5 w-5 transition-transform duration-200 group-hover:scale-110`} />
      <span>{label}</span>
    </NavLink>
  )

  const renderDashboardContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-full">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-slate-600 dark:text-slate-400 font-medium">Loading your dashboard...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-full">
          <Card className="max-w-md border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
                <X className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <p className="text-red-800 dark:text-red-200">{error}</p>
            </CardContent>
          </Card>
        </div>
      );
    }

    const activityData = [
      { name: 'Mon', hours: 2 },
      { name: 'Tue', hours: 4.5 },
      { name: 'Wed', hours: 3 },
      { name: 'Thu', hours: 5 },
      { name: 'Fri', hours: 4 },
      { name: 'Sat', hours: 6 },
      { name: 'Sun', hours: 3.5 },
    ];

    const radarData = [
      { subject: 'Math', A: 120, fullMark: 150 },
      { subject: 'Science', A: 98, fullMark: 150 },
      { subject: 'English', A: 86, fullMark: 150 },
      { subject: 'History', A: 99, fullMark: 150 },
      { subject: 'Physics', A: 85, fullMark: 150 },
      { subject: 'Coding', A: 65, fullMark: 150 },
    ];

    return (
      <div className="space-y-6">
        {/* Welcome Banner */}
        <FadeIn>
          <Card className="border-none bg-blue-600 text-white overflow-hidden relative shadow-lg shadow-blue-500/20">
            <CardContent className="p-8 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-bold uppercase tracking-wider mb-2">Student Dashboard</p>
                  <h2 className="text-3xl font-black mb-2">Welcome back, {user?.displayName}</h2>
                  <p className="text-blue-100 text-lg">You've got some great progress this week! 🚀</p>
                </div>
                <div className="hidden md:flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-blue-100 text-sm font-medium">Course Completion</p>
                    <p className="text-4xl font-black">{totalEnrolledCourses > 0 ? ((completedCourses / totalEnrolledCourses) * 100).toFixed(0) : 0}%</p>
                  </div>
                  <div className="w-20 h-20">
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie
                          data={[
                            { value: completedCourses },
                            { value: totalEnrolledCourses - completedCourses }
                          ]}
                          innerRadius={25}
                          outerRadius={40}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          <Cell fill="#fff" />
                          <Cell fill="rgba(255,255,255,0.3)" />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </CardContent>
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-blue-500/30 rounded-full blur-2xl"></div>
          </Card>
        </FadeIn>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <FadeIn delay={0.1}>
            <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
              <Card className="border-none shadow-sm hover:shadow-lg transition-all duration-300 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Enrolled Courses</p>
                      <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{totalEnrolledCourses}</h3>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                      <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
              <Card className="border-none shadow-sm hover:shadow-lg transition-all duration-300 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Assignments Done</p>
                      <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{submissions.length}</h3>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                      <FileCheck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </FadeIn>

          <FadeIn delay={0.3}>
            <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
              <Card className="border-none shadow-sm hover:shadow-lg transition-all duration-300 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Completed</p>
                      <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{completedCourses}</h3>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                      <GraduationCap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </FadeIn>

          <FadeIn delay={0.4}>
            <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
              <Card className="border-none shadow-sm hover:shadow-lg transition-all duration-300 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Total Reviews</p>
                      <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{reviews.length}</h3>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                      <Star className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </FadeIn>
        </div>

        {/* Charts & Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Submissions - NEW COMPONENT */}
          <FadeIn delay={0.5}>
            <Card className="border-none shadow-sm bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 h-full">
              <CardHeader className="border-b border-slate-100 dark:border-slate-800">
                <CardTitle className="flex items-center justify-between">
                  <span className="text-slate-900 dark:text-white font-bold text-lg flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-blue-600" />
                    Recent Assignments
                  </span>
                  <Link
                    to="/dashboard/assignments"
                    className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-1"
                  >
                    View all
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {submissions.length > 0 ? (
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {submissions.slice(0, 4).map((sub, idx) => (
                      <div key={idx} className="p-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${sub.status === 'graded' ? 'bg-green-100 text-green-600 dark:bg-green-900/30' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30'}`}>
                          {sub.status === 'graded' ? <CheckCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-slate-900 dark:text-white truncate">{sub.assignmentTitle}</h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{sub.className} • {new Date(sub.submittedAt).toLocaleDateString()}</p>
                        </div>
                        {sub.status === 'graded' ? (
                          <div className="text-right">
                            <span className="block font-bold text-slate-900 dark:text-white">{sub.grade}/{sub.maxPoints}</span>
                            <span className="text-xs text-green-600 dark:text-green-400 font-medium">Graded</span>
                          </div>
                        ) : (
                          <span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-1 rounded-full font-medium">
                            Submitted
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-slate-500">
                    <p>No assignments submitted yet.</p>
                    <Link to="/dashboard/my-enroll-class" className="text-blue-600 text-sm font-medium mt-2 hover:underline inline-block">Go to courses</Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </FadeIn>

          {/* Enrolled Courses Progress */}
          <FadeIn delay={0.6}>
            <Card className="border-none shadow-sm bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 h-full">
              <CardHeader className="border-b border-slate-100 dark:border-slate-800">
                <CardTitle className="flex items-center justify-between">
                  <span className="text-slate-900 dark:text-white font-bold text-lg flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    My Courses
                  </span>
                  <Link
                    to="/dashboard/my-enroll-class"
                    className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-1"
                  >
                    All courses
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {enrolledClasses.length > 0 ? (
                    enrolledClasses.slice(0, 4).map((course, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group"
                      >
                        <div className="flex justify-between mb-2">
                          <h4 className="font-medium text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">{course.title}</h4>
                          <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{course.progress || 0}%</span>
                        </div>
                        <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${course.progress || 0}%` }}
                            transition={{ duration: 1 }}
                            className="h-full bg-blue-600 rounded-full"
                          />
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                      <p>No courses enrolled yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FadeIn delay={0.7}>
            <Card className="border-none shadow-sm bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
              <CardHeader className="border-b border-slate-100 dark:border-slate-800">
                <CardTitle className="text-slate-900 dark:text-white font-bold text-lg">Weekly Activity</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={activityData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-gray-800" vertical={false} />
                      <XAxis dataKey="name" stroke="#64748b" className="dark:stroke-gray-400" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                      <YAxis stroke="#64748b" className="dark:stroke-gray-400" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: 'none',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="hours"
                        stroke="#2563eb"
                        strokeWidth={3}
                        dot={{ fill: '#2563eb', strokeWidth: 0, r: 4 }}
                        activeDot={{ r: 6, strokeWidth: 0 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          <FadeIn delay={0.8}>
            <Card className="border-none shadow-sm bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
              <CardHeader className="border-b border-slate-100 dark:border-slate-800">
                <CardTitle className="text-slate-900 dark:text-white font-bold text-lg">Skills Assessment</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                      <PolarGrid stroke="#e2e8f0" className="dark:stroke-gray-700" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} className="dark:fill-gray-400" />
                      <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                      <Radar
                        name="Skills"
                        dataKey="A"
                        stroke="#2563eb"
                        fill="#3b82f6"
                        fillOpacity={0.5}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: 'none',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                        }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </div>
    );
  };

  return (
    <>
      <PageTitle />
      <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
        {/* Mobile Overlay */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-30 transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        >
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center justify-between h-20 px-6 border-b border-slate-200 dark:border-slate-800">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                  EduManage
                </h1>
              </Link>
              <button
                className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-6 px-3">
              <div className="space-y-1">
                {navItems.map((item) => (
                  <NavItem key={item.path} {...item} />
                ))}
              </div>
            </nav>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
              <Link
                to='/'
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 transition-all duration-200 group"
              >
                <Home className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
                <span className="font-medium">Home</span>
              </Link>
              <Button
                className="w-full bg-red-600 hover:bg-red-700 text-white border-none transition-all duration-300 rounded-xl shadow-lg shadow-red-600/20"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="h-20 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl sticky top-0 z-10">
            <div className="h-full flex items-center justify-between px-4 lg:px-8">
              <div className="flex items-center gap-4">
                <button
                  className="lg:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                </button>
                <div>
                  <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
                    {window.location.pathname === '/dashboard' ? 'Dashboard' :
                      window.location.pathname.includes('/my-enroll-class') ? 'My Courses' :
                        window.location.pathname.includes('/profile') ? 'My Profile' : 'Student Dashboard'}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
                    {window.location.pathname === '/dashboard' ? 'Overview of your learning journey' :
                      window.location.pathname.includes('/my-enroll-class') ? 'Manage your enrolled courses' :
                        window.location.pathname.includes('/profile') ? 'View and edit your profile' : ''}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <ThemeToggle />
                <div className="h-10 w-px bg-gray-200 dark:bg-gray-800" />
                <div className="flex items-center gap-3 group cursor-pointer">
                  <div className="hidden sm:block text-right">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">
                      {user?.displayName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Student</p>
                  </div>
                  <div className="relative">
                    <img
                      src={user?.photoURL || "/placeholder.svg"}
                      alt="Profile"
                      className="w-10 h-10 rounded-xl object-cover ring-2 ring-gray-200 dark:ring-gray-700 group-hover:ring-blue-500 dark:group-hover:ring-blue-400 transition-all"
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" />
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 dark:bg-slate-950">
            <div className="p-4 lg:p-8">
              {window.location.pathname === '/dashboard' ? renderDashboardContent() : <Outlet />}
            </div>
          </main>
        </div>
      </div>
    </>
  )
}

export default DashboardLayout