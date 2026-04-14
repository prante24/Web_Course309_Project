import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, BookOpen, GraduationCap, Loader2 } from "lucide-react";

// eslint-disable-next-line react/prop-types
const StatsCard = ({ icon: Icon, title, value, subtitle, color }) => (
  <Card className="overflow-hidden">
    <CardContent className="p-6">
      <div className="flex items-center gap-4">
        <div className={`rounded-lg p-3 ${color} dark:bg-secondary`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <h3 className="text-2xl font-bold mt-1 text-primary dark:text-secondary">{value.toLocaleString()}</h3>
          <p className="text-xs text-gray-400 mt-1 dark:text-gray-500">{subtitle}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

const StatsSection = () => {
  const [stats, setStats] = useState({
    users: [],
    classes: { classes: [] }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, classesResponse] = await Promise.all([
          fetch('https://edumanagebackend.vercel.app/users'),
          fetch('https://edumanagebackend.vercel.app/classes')
        ]);

        const usersData = await usersResponse.json();
        const classesData = await classesResponse.json();

        setStats({
          users: usersData,
          classes: classesData
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        Error loading stats: {error}
      </div>
    );
  }

  const totalUsers = stats.users.length;
  const totalClasses = stats.classes.classes.length;
  const totalEnrollments = stats.classes.classes.reduce(
    (acc, cls) => acc + (cls.totalEnrollment || 0),
    0
  );

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 bg-clip-text text-transparent">
            Our Growth in Numbers
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Empowering education through our growing community
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <StatsCard
              icon={Users}
              title="Total Users"
              value={totalUsers}
              subtitle="Active members in our community"
              color="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500"
            />
            <StatsCard
              icon={BookOpen}
              title="Total Classes"
              value={totalClasses}
              subtitle="Diverse courses available"
              color="bg-gradient-to-r from-purple-500 to-purple-600 dark:from-purple-400 dark:to-purple-500"
            />
            <StatsCard
              icon={GraduationCap}
              title="Total Enrollments"
              value={totalEnrollments}
              subtitle="Student enrollments across all classes"
              color="bg-gradient-to-r from-emerald-500 to-emerald-600 dark:from-emerald-400 dark:to-emerald-500"
            />
          </div>

          <div className="relative h-full min-h-[400px] rounded-2xl overflow-hidden shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 dark:from-blue-400/10 dark:to-purple-400/10" />
            <img
              src="https://i.postimg.cc/prPnjN60/istockphoto-1396113348-612x612.jpg"
              alt="Education Platform"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent dark:from-black/80 dark:to-transparent p-6">
              <h3 className="text-white text-2xl font-bold mb-2">
                Learning Made Simple
              </h3>
              <p className="text-white/80">
                Join our platform and start your learning journey today
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsSection;