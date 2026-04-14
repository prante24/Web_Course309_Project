import { Link, NavLink, Outlet, useNavigate } from "react-router-dom"
import { useContext, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LayoutDashboard, UserPlus, Users, BookOpen, User, LogOut, Menu, X, Home, Star, GraduationCap, TrendingUp, Activity, Award, ChevronRight, Shield } from "lucide-react"
import { AuthContext } from "@/provider/AuthProvider"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { motion, AnimatePresence } from "framer-motion"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import PageTitle from "@/components/PageTitle"


const FadeIn = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
  >
    {children}
  </motion.div>
);

const AdminDashboardLayout = () => {
  const { user, logOut } = useContext(AuthContext)
  const navigate = useNavigate()
  const [isSidebarOpen, setSidebarOpen] = useState(false)
  const [stats, setStats] = useState({
    users: [],
    classes: [],
    teacherRequests: [],
    reviews: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [users, classes, teacherReqs, reviews] = await Promise.all([
          fetch('https://edumanagebackend.vercel.app/users').then(res => res.json()),
          fetch('https://edumanagebackend.vercel.app/all-classes').then(res => res.json()),
          fetch('https://edumanagebackend.vercel.app/reqteachers').then(res => res.json()),
          fetch('https://edumanagebackend.vercel.app/reviews').then(res => res.json())
        ]);

        setStats({
          users,
          classes,
          teacherRequests: teacherReqs.classes,
          reviews: reviews.reviews || []
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    logOut()
      .then(() => navigate("/"))
      .catch(err => console.log(err))
  }

  const navItems = [
    { path: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/admin/teacher-request", icon: UserPlus, label: "Teacher Request" },
    { path: "/admin/users", icon: Users, label: "Users" },
    { path: "/admin/all-classes", icon: BookOpen, label: "All Classes" },
    { path: "/admin/profile", icon: User, label: "Profile" },
  ]

  // Calculate summary statistics
  const totalUsers = stats.users.length;
  const totalClasses = stats.classes.length;
  const pendingTeacherRequests = stats.teacherRequests.filter(req => req.status === 'pending').length;
  const totalReviews = stats.reviews.length;

  // Prepare data for user roles pie chart
  const userRolesData = stats.users.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {});

  const pieChartData = Object.entries(userRolesData).map(([role, count]) => ({
    name: role,
    value: count
  }));

  // Prepare data for class status bar chart
  const classStatusData = stats.classes.reduce((acc, cls) => {
    acc[cls.status] = (acc[cls.status] || 0) + 1;
    return acc;
  }, {});

  const barChartData = Object.entries(classStatusData).map(([status, count]) => ({
    status,
    count
  }));

  // Prepare data for enrollment trend line chart
  const enrollmentData = stats.classes.map(cls => ({
    name: cls.title?.substring(0, 15) + '...',
    enrollments: cls.totalEnrollment || 0
  }));

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  // eslint-disable-next-line react/prop-types
  const NavItem = ({ path, icon: Icon, label }) => (
    <NavLink
      to={path}
      end={path === "/admin"}
      className={({ isActive }) =>
        `group flex items-center gap-3 px-4 py-2.5 mx-2 rounded-xl font-medium transition-all duration-200
        ${isActive
          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30 dark:shadow-purple-500/30"
          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
        }`
      }
    >
      <Icon className={`h-5 w-5 transition-transform duration-200 group-hover:scale-110`} />
      <span>{label}</span>
    </NavLink>
  )

  const DashboardContent = () => (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <FadeIn>
        <Card className="border-none bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white overflow-hidden relative">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-10" />
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium mb-1 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Admin Dashboard
                </p>
                <h2 className="text-3xl font-bold mb-2">Welcome back, {user?.displayName}</h2>
                <p className="text-white/90">Monitor and manage your entire platform 🚀</p>
              </div>
              <div className="hidden md:block">
                <div className="text-right">
                  <p className="text-white/80 text-sm">System Status</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <p className="text-xl font-bold">All Systems Operational</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </FadeIn>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <FadeIn delay={0.1}>
          <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
            <Card className="border-none shadow-sm hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-900/50 backdrop-blur-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Users</p>
                    <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{totalUsers}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      Platform growth
                    </p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <Users className="h-7 w-7 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
            <Card className="border-none shadow-sm hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-900/50 backdrop-blur-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Classes</p>
                    <h3 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{totalClasses}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 flex items-center gap-1">
                      <Activity className="w-3 h-3" />
                      Active courses
                    </p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30">
                    <BookOpen className="h-7 w-7 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </FadeIn>

        <FadeIn delay={0.3}>
          <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
            <Card className="border-none shadow-sm hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-900/50 backdrop-blur-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Pending Teachers</p>
                    <h3 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">{pendingTeacherRequests}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      Awaiting review
                    </p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center shadow-lg shadow-yellow-500/30">
                    <GraduationCap className="h-7 w-7 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </FadeIn>

        <FadeIn delay={0.4}>
          <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
            <Card className="border-none shadow-sm hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-900/50 backdrop-blur-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Reviews</p>
                    <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{totalReviews}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      User feedback
                    </p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                    <Star className="h-7 w-7 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </FadeIn>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Roles Distribution */}
        <FadeIn delay={0.5}>
          <Card className="border-none shadow-sm bg-white dark:bg-gray-900/50 backdrop-blur-xl">
            <CardHeader className="border-b border-gray-100 dark:border-gray-800">
              <CardTitle className="flex items-center justify-between">
                <span className="text-gray-900 dark:text-white font-semibold">User Role Distribution</span>
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {pieChartData.length > 0 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieChartData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: 'none',
                          borderRadius: '12px',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-80 flex items-center justify-center text-gray-500 dark:text-gray-400">
                  <Users className="w-12 h-12 opacity-50 mb-3" />
                  <p>No user data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </FadeIn>

        {/* Class Status Distribution */}
        <FadeIn delay={0.6}>
          <Card className="border-none shadow-sm bg-white dark:bg-gray-900/50 backdrop-blur-xl">
            <CardHeader className="border-b border-gray-100 dark:border-gray-800">
              <CardTitle className="flex items-center justify-between">
                <span className="text-gray-900 dark:text-white font-semibold">Class Status Distribution</span>
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {barChartData.length > 0 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-800" />
                      <XAxis dataKey="status" stroke="#6b7280" className="dark:stroke-gray-400" fontSize={12} />
                      <YAxis stroke="#6b7280" className="dark:stroke-gray-400" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: 'none',
                          borderRadius: '12px',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                        }}
                      />
                      <Legend />
                      <Bar dataKey="count" fill="url(#colorBar)" radius={[8, 8, 0, 0]} />
                      <defs>
                        <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10b981" />
                          <stop offset="100%" stopColor="#059669" />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-80 flex items-center justify-center text-gray-500 dark:text-gray-400">
                  <BookOpen className="w-12 h-12 opacity-50 mb-3" />
                  <p>No class data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </FadeIn>
      </div>

      {/* Enrollment Trend */}
      <FadeIn delay={0.7}>
        <Card className="border-none shadow-sm bg-white dark:bg-gray-900/50 backdrop-blur-xl">
          <CardHeader className="border-b border-gray-100 dark:border-gray-800">
            <CardTitle className="flex items-center justify-between">
              <span className="text-gray-900 dark:text-white font-semibold">Class Enrollment Overview</span>
              <Link
                to="/admin/all-classes"
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                View all
                <ChevronRight className="w-4 h-4" />
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {enrollmentData.length > 0 ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={enrollmentData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-800" />
                    <XAxis dataKey="name" stroke="#6b7280" className="dark:stroke-gray-400" fontSize={12} />
                    <YAxis stroke="#6b7280" className="dark:stroke-gray-400" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="enrollments" stroke="url(#colorLine)" strokeWidth={2} dot={{ fill: '#3b82f6', r: 4 }} />
                    <defs>
                      <linearGradient id="colorLine" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>
                    </defs>
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-500 dark:text-gray-400">
                <GraduationCap className="w-12 h-12 opacity-50 mb-3" />
                <p>No enrollment data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  );

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
          className={`fixed lg:static inset-y-0 left-0 w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-30 transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        >
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center justify-between h-20 px-6 border-b border-gray-200 dark:border-gray-800">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-xl group-hover:shadow-blue-500/40 transition-all">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AdminHub
                </h1>
              </Link>
              <button
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
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
            <div className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-2">
              <Link
                to='/'
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 group"
              >
                <Home className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
                <span className="font-medium">Home</span>
              </Link>
              <Button
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-none shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 transition-all duration-300 rounded-xl"
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
          <header className="h-20 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl sticky top-0 z-10">
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
                    {window.location.pathname === '/admin' ? 'Dashboard' :
                      window.location.pathname.includes('/teacher-request') ? 'Teacher Requests' :
                        window.location.pathname.includes('/users') ? 'User Management' :
                          window.location.pathname.includes('/all-classes') ? 'Class Management' :
                            window.location.pathname.includes('/profile') ? 'Admin Profile' : 'Admin Dashboard'}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
                    {window.location.pathname === '/admin' ? 'Overview of your platform' :
                      window.location.pathname.includes('/teacher-request') ? 'Review and approve teacher applications' :
                        window.location.pathname.includes('/users') ? 'Manage all platform users' :
                          window.location.pathname.includes('/all-classes') ? 'Monitor and approve classes' :
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
                    <p className="text-xs text-gray-500 dark:text-gray-400">Administrator</p>
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
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-950">
            <div className="p-4 lg:p-8">
              {window.location.pathname === '/admin' ? DashboardContent() : <Outlet />}
            </div>
          </main>
        </div>
      </div>
    </>
  )
}

export default AdminDashboardLayout