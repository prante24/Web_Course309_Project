import { useContext, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AuthContext } from "@/provider/AuthProvider"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  GraduationCap, 
  Mail, 
  Phone, 
  Calendar,
  Book,
  Trophy,
  Clock,
  Edit2,
  Check,
  Award,
  Target,
  TrendingUp,
  X,
  Upload,
  Activity
} from "lucide-react"
import { motion } from "framer-motion"
import { FadeIn } from "@/components/ui/micro-interactions"
import toast from "react-hot-toast"

const MyProfile = () => {
  const { user, updateUserProfile } = useContext(AuthContext)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    displayName: user?.displayName || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    photoURL: user?.photoURL || "",
    bio: ""
  })
  const [loading, setLoading] = useState(false)

  const studentStats = {
    joinDate: "February 2024",
    enrolledCourses: "12",
    completedCourses: "8",
    averageGrade: "A-",
    currentStreak: "14 days",
    totalHours: "47hrs"
  }

  const achievements = [
    { id: 1, name: "Early Bird", icon: "🌅", description: "Completed 5 courses", unlocked: true },
    { id: 2, name: "Consistent Learner", icon: "🔥", description: "14 day streak", unlocked: true },
    { id: 3, name: "Rising Star", icon: "⭐", description: "Top 10% in class", unlocked: true },
    { id: 4, name: "Master Learner", icon: "🏆", description: "Complete 20 courses", unlocked: false }
  ]

  const handleSaveChanges = async () => {
    setLoading(true)
    try {
      await updateUserProfile({
        displayName: formData.displayName,
        photoURL: formData.photoURL
      })
      toast.success("Profile updated successfully!")
      setIsEditing(false)
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("Failed to update profile. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      displayName: user?.displayName || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
      photoURL: user?.photoURL || "",
      bio: ""
    })
    setIsEditing(false)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const StatCard = ({ title, value, icon: Icon, gradient, delay = 0 }) => (
    <FadeIn delay={delay}>
      <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
        <Card className={`border-none shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group bg-white dark:bg-gray-900/50 backdrop-blur-xl`}>
          <div className={`absolute inset-0 ${gradient} opacity-40 dark:opacity-20`} />
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{title}</p>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{value}</h3>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Icon className="h-7 w-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </FadeIn>
  )

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <FadeIn>
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">My Profile</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your account and view your progress</p>
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button 
                  variant="outline"
                  onClick={handleCancel}
                  disabled={loading}
                  className="gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </Button>
                <Button 
                  onClick={handleSaveChanges}
                  disabled={loading}
                  className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-none"
                >
                  <Check className="w-4 h-4" />
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </>
            ) : (
              <Button 
                variant="outline"
                onClick={() => setIsEditing(true)}
                className="gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Profile Card */}
        <FadeIn delay={0.1} className="lg:col-span-2">
          <Card className="border-none shadow-sm bg-white dark:bg-gray-900/50 backdrop-blur-xl h-full">
            <CardContent className="p-8">
              <div className="space-y-6">
                {/* Avatar and Name Section */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-75 transition duration-300" />
                      <div className="relative">
                        <Avatar className="w-32 h-32 border-4 border-white dark:border-gray-800 shadow-xl">
                          <AvatarImage src={user.photoURL} alt={user.displayName} className="object-cover" />
                          <AvatarFallback className="text-4xl bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold">
                            {user.displayName?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-2 -right-2">
                          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl shadow-lg flex items-center justify-center border-4 border-white dark:border-gray-900">
                            <Award className="w-6 h-6 text-white" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Name and Badges */}
                  <div className="flex-1 text-center sm:text-left">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{user.displayName}</h2>
                    <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                      <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-none shadow-lg shadow-blue-500/30">
                        <GraduationCap className="w-3 h-3 mr-1" />
                        Student
                      </Badge>
                      <Badge className="bg-green-500 text-white border-none">
                        <Activity className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                      <Badge className="bg-yellow-500 text-white border-none">
                        <Award className="w-3 h-3 mr-1" />
                        Level {studentStats.level}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Info Section - Full Width */}
                <div className="w-full">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="displayName" className="text-gray-700 dark:text-gray-300">Full Name</Label>
                        <Input
                          id="displayName"
                          name="displayName"
                          value={formData.displayName}
                          onChange={handleChange}
                          placeholder="Enter your full name"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="photoURL" className="text-gray-700 dark:text-gray-300">Profile Photo URL</Label>
                        <Input
                          id="photoURL"
                          name="photoURL"
                          value={formData.photoURL}
                          onChange={handleChange}
                          placeholder="https://example.com/photo.jpg"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email (Read-only)</Label>
                        <Input
                          id="email"
                          name="email"
                          value={formData.email}
                          disabled
                          className="mt-1 bg-gray-100 dark:bg-gray-800"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phoneNumber" className="text-gray-700 dark:text-gray-300">Phone Number</Label>
                        <Input
                          id="phoneNumber"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleChange}
                          placeholder="Enter your phone number"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="bio" className="text-gray-700 dark:text-gray-300">Bio</Label>
                        <Textarea
                          id="bio"
                          name="bio"
                          value={formData.bio}
                          onChange={handleChange}
                          placeholder="Tell us about yourself..."
                          className="mt-1"
                          rows={3}
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{user.displayName}</h2>
                        <div className="flex flex-wrap gap-2 mb-4">
                          <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-none px-3 py-1">
                            <GraduationCap className="w-3.5 h-3.5 mr-1.5" />
                            Student
                          </Badge>
                          <Badge className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-none px-3 py-1">
                            <Trophy className="w-3.5 h-3.5 mr-1.5" />
                            Grade: {studentStats.averageGrade}
                          </Badge>
                          <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-none px-3 py-1">
                            <Target className="w-3.5 h-3.5 mr-1.5" />
                            Active
                          </Badge>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {/* Top Row: Email and Join Date */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          <div className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                              <Mail className="text-blue-600 dark:text-blue-400 w-4 h-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-0.5">Email</p>
                              <p className="text-xs font-medium text-gray-900 dark:text-white truncate" title={user.email}>{user.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                              <Calendar className="text-green-600 dark:text-green-400 w-4 h-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-0.5">Join Date</p>
                              <p className="text-xs font-medium text-gray-900 dark:text-white">{studentStats.joinDate}</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Bottom Row: Phone and Last Active */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          <div className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                              <Phone className="text-purple-600 dark:text-purple-400 w-4 h-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-0.5">Phone</p>
                              <p className="text-xs font-medium text-gray-900 dark:text-white">{formData.phoneNumber || "Not provided"}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                            <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                              <Clock className="text-orange-600 dark:text-orange-400 w-4 h-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-0.5">Last Active</p>
                              <p className="text-xs font-medium text-gray-900 dark:text-white">Today</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </FadeIn>

        {/* Stats Column */}
        <div className="space-y-4">
          <FadeIn delay={0.2}>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Learning Stats
            </h3>
          </FadeIn>
          <StatCard 
            title="Enrolled"
            value={studentStats.enrolledCourses}
            icon={Book}
            gradient="from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20"
            delay={0.3}
          />
          <StatCard 
            title="Completed"
            value={studentStats.completedCourses}
            icon={Trophy}
            gradient="from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20"
            delay={0.4}
          />
          <StatCard 
            title="Study Time"
            value={studentStats.totalHours}
            icon={Clock}
            gradient="from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20"
            delay={0.5}
          />
        </div>
      </div>

      {/* Achievements */}
      <FadeIn delay={0.6}>
        <Card className="border-none shadow-sm bg-white dark:bg-gray-900/50 backdrop-blur-xl">
          <CardHeader className="border-b border-gray-100 dark:border-gray-800">
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
              <Award className="w-5 h-5 text-yellow-500" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  whileHover={{ y: -4 }}
                  className={`p-4 rounded-2xl border-2 ${
                    achievement.unlocked
                      ? "bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800"
                      : "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 opacity-50"
                  } transition-all duration-300`}
                >
                  <div className="text-4xl mb-2">{achievement.icon}</div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-1">{achievement.name}</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{achievement.description}</p>
                  {achievement.unlocked && (
                    <div className="mt-2">
                      <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-none text-xs">
                        <Check className="w-3 h-3 mr-1" />
                        Unlocked
                      </Badge>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  )
}

export default MyProfile