import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Users as UsersIcon, Shield, GraduationCap, User as UserIcon } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

const FadeIn = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
  >
    {children}
  </motion.div>
);

const Users = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://edumanagebackend.vercel.app/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setSearching(true);
    try {
      const response = await axios.get(`https://edumanagebackend.vercel.app/users/search?term=${searchTerm}`);
      setUsers(response.data);
    } catch (error) {
      console.error("Error searching users:", error);
    } finally {
      setSearching(false);
    }
  };

  const handleResetSearch = () => {
    setSearchTerm("");
    fetchUsers();
  };

  const handleUpdateRoleWithToast = async (id, role) => {
    try {
      await axios.put(`https://edumanagebackend.vercel.app/users/${id}/update-role`, { role });
      toast.success(`User role updated to ${role}`);
      fetchUsers();
    } catch (error) {
      console.error("Error updating user role:", error);
      toast.error("Failed to update user role");
    }
  };

  const roleStats = {
    total: users.length,
    admins: users.filter(u => u.role === "admin").length,
    teachers: users.filter(u => u.role === "teacher").length,
    students: users.filter(u => u.role === "student").length
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "admin": return Shield;
      case "teacher": return GraduationCap;
      default: return UserIcon;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px] gap-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-600 dark:text-gray-400 font-medium">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <FadeIn>
          <motion.div whileHover={{ y: -2 }}>
            <Card className="border-none shadow-sm hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-900/50 backdrop-blur-xl">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{roleStats.total}</h3>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <UsersIcon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <motion.div whileHover={{ y: -2 }}>
            <Card className="border-none shadow-sm hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-900/50 backdrop-blur-xl">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Administrators</p>
                    <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400">{roleStats.admins}</h3>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <motion.div whileHover={{ y: -2 }}>
            <Card className="border-none shadow-sm hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-900/50 backdrop-blur-xl">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Teachers</p>
                    <h3 className="text-2xl font-bold text-green-600 dark:text-green-400">{roleStats.teachers}</h3>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </FadeIn>

        <FadeIn delay={0.3}>
          <motion.div whileHover={{ y: -2 }}>
            <Card className="border-none shadow-sm hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-900/50 backdrop-blur-xl">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Students</p>
                    <h3 className="text-2xl font-bold text-purple-600 dark:text-purple-400">{roleStats.students}</h3>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                    <UserIcon className="w-6 h-6 text-white" />
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
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search by username or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-10 dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:placeholder-gray-500"
                />
              </div>
              <Button
                onClick={handleSearch}
                disabled={searching}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                {searching ? "Searching..." : "Search"}
              </Button>
              {searchTerm && (
                <Button variant="outline" onClick={handleResetSearch} className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
                  Reset
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </FadeIn>

      {/* Users Grid */}
      {users.length === 0 ? (
        <FadeIn delay={0.5}>
          <Card className="border-none shadow-sm bg-white dark:bg-gray-900/50 backdrop-blur-xl">
            <CardContent className="p-12 text-center">
              <UsersIcon className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Users Found</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchTerm
                  ? "Try adjusting your search terms."
                  : "No users have been registered yet."}
              </p>
            </CardContent>
          </Card>
        </FadeIn>
      ) : (
        <div className="grid gap-4">
          {users.map((user, index) => {
            const RoleIcon = getRoleIcon(user.role);
            return (
              <FadeIn key={user._id} delay={0.5 + index * 0.05}>
                <Card className="border-none shadow-sm hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-900/50 backdrop-blur-xl group">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6">
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        <div className="relative">
                          <div className="w-20 h-20 rounded-xl overflow-hidden ring-2 ring-gray-200 dark:ring-gray-700 group-hover:ring-blue-500 dark:group-hover:ring-blue-400 transition-all">
                            <img
                              src={user.photo?.split("?")[0] || "/placeholder.svg"}
                              alt={user.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        </div>
                      </div>

                      {/* User Info */}
                      <div className="flex-1 min-w-0 text-center lg:text-left">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {user.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 truncate">
                          {user.email}
                        </p>
                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                          <Badge className={`${user.role === "admin" ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300" :
                            user.role === "teacher" ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300" :
                              "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                            } border-none`}>
                            <RoleIcon className="w-3 h-3 mr-1" />
                            {user.role}
                          </Badge>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2 w-full lg:w-auto">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1 text-center lg:text-left">Change Role</p>
                        <Select
                          value={user.role}
                          onValueChange={(value) => handleUpdateRoleWithToast(user._id, value)}
                        >
                          <SelectTrigger className="w-full lg:w-[140px] hover:border-blue-500 dark:hover:border-blue-400 transition-colors dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                            <SelectItem value="admin" className="dark:text-white dark:focus:bg-gray-700">
                              <div className="flex items-center gap-2">
                                <Shield className="w-4 h-4" />
                                Admin
                              </div>
                            </SelectItem>
                            <SelectItem value="teacher" className="dark:text-white dark:focus:bg-gray-700">
                              <div className="flex items-center gap-2">
                                <GraduationCap className="w-4 h-4" />
                                Teacher
                              </div>
                            </SelectItem>
                            <SelectItem value="student" className="dark:text-white dark:focus:bg-gray-700">
                              <div className="flex items-center gap-2">
                                <UserIcon className="w-4 h-4" />
                                Student
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Users;