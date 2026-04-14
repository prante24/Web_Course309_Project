import { useState, useEffect, useContext } from 'react';
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from '@/components/ui/card';
import {
  LayoutDashboard,
  PlusCircle,
  BookOpen,
  User,
  LogOut,
  Menu,
  X,
  Home,
  Users,
  FileCheck,
  Star,
  GraduationCap,
  Activity,
  Sparkles,
  Bell,
  Clock,
  Calendar,
  CheckCircle,
  MessageSquare
} from "lucide-react";
import { AuthContext } from "@/provider/AuthProvider";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import PageTitle from "@/components/PageTitle";


const TeacherDashBoardLayout = () => {
  const { user, logOut } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [classes, setClasses] = useState([]);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalClasses: 0,
    totalAssignments: 0,
    averageRating: 0
  });

  const handleLogout = () => {
    logOut()
      .then(() => navigate("/"))
      .catch(err => console.log(err));
  };

  // Fetch dashboard data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://edumanagebackend.vercel.app/classes?instructorEmail=${user?.email}`);
        const data = await response.json();
        setClasses(data.classes || []);


        const totalStudents = data.classes?.reduce((acc, cls) => acc + (cls.totalEnrollment || 0), 0) || 0;
        const totalAssignments = data.classes?.reduce((acc, cls) => acc + (cls.totalAssignments || 0), 0) || 0;
        const avgRating = data.classes?.reduce((acc, cls) => acc + (cls.averageRating || 0), 0) / (data.classes?.length || 1);

        setStats({
          totalStudents,
          totalClasses: data.classes?.length || 0,
          totalAssignments,
          averageRating: avgRating.toFixed(1)
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (user?.email) {
      fetchData();
    }
  }, [user?.email]);

  const navItems = [
    { path: "/teacher", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/teacher/addclass", icon: PlusCircle, label: "Add Class" },
    { path: "/teacher/my-classes", icon: BookOpen, label: "My Classes" },
    { path: "/teacher/ai-lecture-notes", icon: Sparkles, label: "AI Lecture Notes" },
    { path: "/teacher/profile", icon: User, label: "Profile" }
  ];

  // Chart data preparation with enhanced data
  const enrollmentData = classes.map(cls => ({
    name: cls.title?.substring(0, 20) || 'Untitled',
    students: cls.totalEnrollment || 0
  })).slice(0, 5); // Show top 5

  const assignmentData = classes.map(cls => ({
    name: cls.title?.substring(0, 15) || 'Untitled',
    submitted: cls.totalSubmissions || 0,
    total: cls.totalAssignments || 0
  })).slice(0, 5); // Show top 5

  const statusCounts = {
    approved: classes.filter(cls => cls.status === 'approved').length,
    pending: classes.filter(cls => cls.status === 'pending').length,
    rejected: classes.filter(cls => cls.status === 'rejected').length
  };

  // Mock data for new sections
  const engagementData = [
    { day: 'Mon', active: 45, submissions: 12 },
    { day: 'Tue', active: 52, submissions: 15 },
    { day: 'Wed', active: 38, submissions: 10 },
    { day: 'Thu', active: 65, submissions: 22 },
    { day: 'Fri', active: 58, submissions: 18 },
    { day: 'Sat', active: 42, submissions: 14 },
    { day: 'Sun', active: 30, submissions: 8 },
  ];

  const recentActivities = [
    { id: 1, user: 'Sarah Johnson', action: 'submitted assignment', target: 'Web Development Basics', time: '2 mins ago', icon: FileCheck, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/30' },
    { id: 2, user: 'Mike Chen', action: 'enrolled in', target: 'Advanced React Patterns', time: '1 hour ago', icon: User, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    { id: 3, user: 'System', action: 'Class approved', target: 'UI/UX Design Masterclass', time: '3 hours ago', icon: CheckCircle, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/30' },
    { id: 4, user: 'Anna Li', action: 'posted a question', target: 'JavaScript Fundamentals', time: '5 hours ago', icon: MessageSquare, color: 'text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-900/30' },
  ];

  const FadeIn = ({ children, delay = 0 }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  );

  const DashboardContent = () => (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <FadeIn>
        <Card className="border-none shadow-sm bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900/50 dark:via-gray-800/50 dark:to-gray-900/50 backdrop-blur-xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Welcome back, {user?.displayName}! 👋
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Here&apos;s what&apos;s happening with your classes today
                </p>
              </div>
              <div className="flex items-center gap-2">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/teacher/addclass">
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/30">
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Create New Class
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </div>
          </CardContent>
        </Card>
      </FadeIn>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <FadeIn delay={0.1}>
          <motion.div whileHover={{ y: -4 }}>
            <Card className="border-none shadow-sm hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-900/50 backdrop-blur-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Students</p>
                    <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mt-2">
                      {stats.totalStudents}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Across all classes</p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <Users className="w-7 h-7 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <motion.div whileHover={{ y: -4 }}>
            <Card className="border-none shadow-sm hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-900/50 backdrop-blur-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Classes</p>
                    <h3 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mt-2">
                      {stats.totalClasses}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {statusCounts.approved} approved
                    </p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30">
                    <BookOpen className="w-7 h-7 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </FadeIn>

        <FadeIn delay={0.3}>
          <motion.div whileHover={{ y: -4 }}>
            <Card className="border-none shadow-sm hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-900/50 backdrop-blur-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Assignments</p>
                    <h3 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mt-2">
                      {stats.totalAssignments}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Created</p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center shadow-lg shadow-yellow-500/30">
                    <FileCheck className="w-7 h-7 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </FadeIn>

        <FadeIn delay={0.4}>
          <motion.div whileHover={{ y: -4 }}>
            <Card className="border-none shadow-sm hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-900/50 backdrop-blur-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Rating</p>
                    <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mt-2">
                      {stats.averageRating}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">⭐⭐⭐⭐⭐</p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                    <Star className="w-7 h-7 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </FadeIn>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enrollment Chart */}
        <FadeIn delay={0.5}>
          <Card className="border-none shadow-sm bg-white dark:bg-gray-900/50 backdrop-blur-xl">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
                Student Enrollment by Class
              </h3>
              {enrollmentData.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={enrollmentData}>
                      <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
                          <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.8} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                      <XAxis
                        dataKey="name"
                        tick={{ fill: 'currentColor' }}
                        className="text-xs text-gray-600 dark:text-gray-400"
                      />
                      <YAxis
                        tick={{ fill: 'currentColor' }}
                        className="text-xs text-gray-600 dark:text-gray-400"
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: 'none',
                          borderRadius: '12px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Bar dataKey="students" fill="url(#barGradient)" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
                  <p>No enrollment data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </FadeIn>

        {/* Assignment Completion Chart */}
        <FadeIn delay={0.6}>
          <Card className="border-none shadow-sm bg-white dark:bg-gray-900/50 backdrop-blur-xl">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
                Assignment Progress
              </h3>
              {assignmentData.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={assignmentData}>
                      <defs>
                        <linearGradient id="submittedGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10b981" stopOpacity={0.8} />
                          <stop offset="100%" stopColor="#059669" stopOpacity={0.8} />
                        </linearGradient>
                        <linearGradient id="totalGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.8} />
                          <stop offset="100%" stopColor="#d97706" stopOpacity={0.8} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                      <XAxis
                        dataKey="name"
                        tick={{ fill: 'currentColor' }}
                        className="text-xs text-gray-600 dark:text-gray-400"
                      />
                      <YAxis
                        tick={{ fill: 'currentColor' }}
                        className="text-xs text-gray-600 dark:text-gray-400"
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: 'none',
                          borderRadius: '12px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="submitted"
                        stroke="url(#submittedGradient)"
                        strokeWidth={3}
                        dot={{ fill: '#10b981', r: 4 }}
                        name="Submitted"
                      />
                      <Line
                        type="monotone"
                        dataKey="total"
                        stroke="url(#totalGradient)"
                        strokeWidth={3}
                        dot={{ fill: '#f59e0b', r: 4 }}
                        name="Total"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
                  <p>No assignment data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </FadeIn>
      </div>

      {/* Class Status Overview */}
      <FadeIn delay={0.7}>
        <Card className="border-none shadow-sm bg-white dark:bg-gray-900/50 backdrop-blur-xl">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
              Class Status Overview
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-700 dark:text-green-400">Approved</p>
                    <p className="text-2xl font-bold text-green-900 dark:text-green-300 mt-1">
                      {statusCounts.approved}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-yellow-700 dark:text-yellow-400">Pending</p>
                    <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-300 mt-1">
                      {statusCounts.pending}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-yellow-500 flex items-center justify-center">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-700 dark:text-red-400">Rejected</p>
                    <p className="text-2xl font-bold text-red-900 dark:text-red-300 mt-1">
                      {statusCounts.rejected}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-red-500 flex items-center justify-center">
                    <X className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </FadeIn>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student Engagement Trends */}
        <FadeIn delay={0.8}>
          <Card className="col-span-2 border-none shadow-sm bg-white dark:bg-gray-900/50 backdrop-blur-xl h-full">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Student Engagement Trends
                </h3>
                <div className="flex items-center gap-2">
                  <span className="flex items-center text-xs text-gray-500">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mr-1"></div> Active
                  </span>
                  <span className="flex items-center text-xs text-gray-500">
                    <div className="w-2 h-2 rounded-full bg-purple-500 mr-1"></div> Submissions
                  </span>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={engagementData}>
                    <defs>
                      <linearGradient id="activeGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="submissionsGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" vertical={false} />
                    <XAxis
                      dataKey="day"
                      tick={{ fill: 'currentColor' }}
                      className="text-xs text-gray-600 dark:text-gray-400"
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: 'currentColor' }}
                      className="text-xs text-gray-600 dark:text-gray-400"
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Area type="monotone" dataKey="active" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#activeGradient)" />
                    <Area type="monotone" dataKey="submissions" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#submissionsGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </FadeIn>

        {/* Recent Activity */}
        <FadeIn delay={0.9}>
          <Card className="border-none shadow-sm bg-white dark:bg-gray-900/50 backdrop-blur-xl h-full">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-500" />
                Recent Activity
              </h3>
              <div className="space-y-6">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex gap-4">
                    <div className={`w-10 h-10 rounded-full ${activity.bg} flex items-center justify-center flex-shrink-0`}>
                      <activity.icon className={`w-5 h-5 ${activity.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {activity.user}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                        {activity.action} <span className="text-indigo-600 dark:text-indigo-400">{activity.target}</span>
                      </p>
                      <p className="text-[10px] text-gray-400 mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="ghost" className="w-full mt-6 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                View All Activity
              </Button>
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </div>
  );

  return (
    <>
      <PageTitle />
      <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
        <AnimatePresence>
          {/* Mobile Sidebar Overlay */}
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <aside
          className={`fixed lg:static w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 h-full z-30 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            }`}
        >
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center justify-between h-20 px-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  TeacherHub
                </h1>
              </div>
              <button
                className="lg:hidden text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                onClick={() => setIsSidebarOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <NavLink
                    to={item.path}
                    end={item.path === "/teacher"}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`
                    }
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </NavLink>
                </motion.div>
              ))}
            </nav>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-2">
              <Link to="/">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Home className="mr-3 h-5 w-5" />
                  Home
                </Button>
              </Link>
              <Button
                variant="ghost"
                className="w-full justify-start text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                onClick={handleLogout}
              >
                <LogOut className="mr-3 h-5 w-5" />
                Logout
              </Button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="h-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
            <div className="h-full px-4 lg:px-8 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  className="lg:hidden p-2 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  onClick={() => setIsSidebarOpen(true)}
                >
                  <Menu className="h-5 w-5" />
                </button>
                <div>
                  <h2 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white">
                    Teacher Dashboard
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                    Manage your classes and track student progress
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <ThemeToggle />
                <div className="hidden sm:flex flex-col items-end mr-3">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {user?.displayName}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Teacher</span>
                </div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <div className="relative">
                    <img
                      src={user?.photoURL || "/placeholder.svg"}
                      alt="Profile"
                      className="w-10 h-10 rounded-xl object-cover ring-2 ring-gray-200 dark:ring-gray-700"
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" />
                  </div>
                </motion.div>
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-950 p-4 lg:p-8">
            {window.location.pathname === '/teacher' ? <DashboardContent /> : <Outlet />}
          </main>
        </div>
      </div>
    </>
  );
};

export default TeacherDashBoardLayout;