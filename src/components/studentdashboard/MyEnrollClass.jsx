import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, BookOpen, Clock, TrendingUp, Filter, Search, Play, CheckCircle2 } from "lucide-react";
import { AuthContext } from "@/provider/AuthProvider";
import { NoClassesFound } from "@/components/ui/empty-state";
import { FadeIn } from "@/components/ui/micro-interactions";
import { motion } from "framer-motion";

const MyEnrollClass = () => {
  const { user } = useContext(AuthContext);
  const [enrolledClasses, setEnrolledClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, in-progress, completed
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchEnrolledClasses = async () => {
      try {
        const res = await fetch('https://edumanagebackend.vercel.app/users');
        const users = await res.json();
        const userId = users.find((u) => u.email === user?.email)?.uid;
        const response = await fetch(`https://edumanagebackend.vercel.app/enrolled-classes/${userId}`);

        if (!response.ok) {
          throw new Error('Failed to fetch enrolled classes');
        }

        const data = await response.json();
        setEnrolledClasses(data.enrolledClasses);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) {
      fetchEnrolledClasses();
    }
  }, [user]);

  const filteredClasses = enrolledClasses.filter(classItem => {
    const matchesSearch = classItem.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filter === 'all' ||
      (filter === 'completed' && (classItem.progress || 0) === 100) ||
      (filter === 'in-progress' && (classItem.progress || 0) < 100 && (classItem.progress || 0) > 0) ||
      (filter === 'not-started' && (classItem.progress || 0) === 0);
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: enrolledClasses.length,
    completed: enrolledClasses.filter(c => (c.progress || 0) === 100).length,
    inProgress: enrolledClasses.filter(c => (c.progress || 0) < 100 && (c.progress || 0) > 0).length,
    notStarted: enrolledClasses.filter(c => (c.progress || 0) === 0).length
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px] gap-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-600 dark:text-gray-400 font-medium">Loading your courses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
              <Loader2 className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <p className="text-red-800 dark:text-red-200">Error loading enrolled classes: {error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (enrolledClasses.length === 0) {
    return <NoClassesFound actionLink="/all-classes" />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <FadeIn>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Courses</h1>
          <p className="text-gray-600 dark:text-gray-400">Track your learning progress and continue where you left off</p>
        </div>
      </FadeIn>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <FadeIn delay={0.1}>
          <motion.div whileHover={{ y: -2 }} className="cursor-pointer" onClick={() => setFilter('all')}>
            <Card className={`border-none shadow-sm transition-all duration-300 ${filter === 'all'
              ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white'
              : 'bg-white dark:bg-gray-900/50 hover:shadow-lg'
              }`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-xs font-medium mb-1 ${filter === 'all' ? 'text-white/80' : 'text-gray-600 dark:text-gray-400'}`}>
                      Total Courses
                    </p>
                    <p className={`text-2xl font-bold ${filter === 'all' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                      {stats.total}
                    </p>
                  </div>
                  <BookOpen className={`w-8 h-8 ${filter === 'all' ? 'text-white' : 'text-blue-600 dark:text-blue-400'}`} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <motion.div whileHover={{ y: -2 }} className="cursor-pointer" onClick={() => setFilter('in-progress')}>
            <Card className={`border-none shadow-sm transition-all duration-300 ${filter === 'in-progress'
              ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white'
              : 'bg-white dark:bg-gray-900/50 hover:shadow-lg'
              }`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-xs font-medium mb-1 ${filter === 'in-progress' ? 'text-white/80' : 'text-gray-600 dark:text-gray-400'}`}>
                      In Progress
                    </p>
                    <p className={`text-2xl font-bold ${filter === 'in-progress' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                      {stats.inProgress}
                    </p>
                  </div>
                  <TrendingUp className={`w-8 h-8 ${filter === 'in-progress' ? 'text-white' : 'text-orange-600 dark:text-orange-400'}`} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </FadeIn>

        <FadeIn delay={0.3}>
          <motion.div whileHover={{ y: -2 }} className="cursor-pointer" onClick={() => setFilter('completed')}>
            <Card className={`border-none shadow-sm transition-all duration-300 ${filter === 'completed'
              ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white'
              : 'bg-white dark:bg-gray-900/50 hover:shadow-lg'
              }`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-xs font-medium mb-1 ${filter === 'completed' ? 'text-white/80' : 'text-gray-600 dark:text-gray-400'}`}>
                      Completed
                    </p>
                    <p className={`text-2xl font-bold ${filter === 'completed' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                      {stats.completed}
                    </p>
                  </div>
                  <CheckCircle2 className={`w-8 h-8 ${filter === 'completed' ? 'text-white' : 'text-green-600 dark:text-green-400'}`} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </FadeIn>

        <FadeIn delay={0.4}>
          <motion.div whileHover={{ y: -2 }} className="cursor-pointer" onClick={() => setFilter('not-started')}>
            <Card className={`border-none shadow-sm transition-all duration-300 ${filter === 'not-started'
              ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white'
              : 'bg-white dark:bg-gray-900/50 hover:shadow-lg'
              }`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-xs font-medium mb-1 ${filter === 'not-started' ? 'text-white/80' : 'text-gray-600 dark:text-gray-400'}`}>
                      Not Started
                    </p>
                    <p className={`text-2xl font-bold ${filter === 'not-started' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                      {stats.notStarted}
                    </p>
                  </div>
                  <Clock className={`w-8 h-8 ${filter === 'not-started' ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </FadeIn>
      </div>

      {/* Search and Filter */}
      <FadeIn delay={0.5}>
        <Card className="border-none shadow-sm bg-white dark:bg-gray-900/50 backdrop-blur-xl">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 transition-colors outline-none text-gray-900 dark:text-white"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-none">
                  {filter.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </FadeIn>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClasses.map((classItem, index) => (
          <FadeIn key={classItem._id} delay={0.6 + index * 0.05}>
            <motion.div
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="group overflow-hidden border-none shadow-sm hover:shadow-2xl transition-all duration-300 bg-white dark:bg-gray-900/50 backdrop-blur-xl h-full">
                <div className="relative overflow-hidden h-48">
                  <img
                    src={classItem.image || "/api/placeholder/400/300"}
                    alt={classItem.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute top-3 right-3">
                    <Badge className={`${(classItem.progress || 0) === 100
                      ? 'bg-green-500 text-white'
                      : (classItem.progress || 0) > 0
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-500 text-white'
                      } border-none`}>
                      {(classItem.progress || 0) === 100 ? 'Completed' : (classItem.progress || 0) > 0 ? 'In Progress' : 'Not Started'}
                    </Badge>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Link to={`/dashboard/myenroll-class/${classItem._id}`} className="w-full">
                      <Button className="w-full bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 shadow-lg">
                        <Play className="w-4 h-4 mr-2" />
                        Continue Learning
                      </Button>
                    </Link>
                  </div>
                </div>
                <CardContent className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {classItem.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    by {classItem.instructorName}
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Progress</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{classItem.progress || 0}%</span>
                    </div>
                    <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${classItem.progress || 0}%` }}
                        transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </FadeIn>
        ))}
      </div>

      {filteredClasses.length === 0 && (
        <FadeIn delay={0.3}>
          <Card className="border-none shadow-sm bg-white dark:bg-gray-900/50 backdrop-blur-xl">
            <CardContent className="p-12 text-center">
              <Search className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No courses found</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Try adjusting your search or filter criteria
              </p>
              <Button onClick={() => { setSearchTerm(''); setFilter('all'); }} variant="outline">
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        </FadeIn>
      )}
    </div>
  );
};

export default MyEnrollClass;