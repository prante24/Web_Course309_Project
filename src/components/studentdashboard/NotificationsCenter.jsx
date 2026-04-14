import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Bell, 
  CheckCircle, 
  Clock, 
  MessageSquare, 
  BookOpen, 
  Award,
  TrendingUp,
  X,
  Trash2,
  Filter,
  Calendar
} from "lucide-react"
import toast from "react-hot-toast"

const NotificationsCenter = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "assignment",
      title: "New Assignment Posted",
      message: "React Fundamentals - Assignment 3 has been posted",
      time: "2 hours ago",
      read: false,
      icon: BookOpen,
      color: "blue"
    },
    {
      id: 2,
      type: "grade",
      title: "Quiz Results Available",
      message: "Your score for Node.js Quiz: 94%",
      time: "5 hours ago",
      read: false,
      icon: Award,
      color: "purple"
    },
    {
      id: 3,
      type: "announcement",
      title: "Course Update",
      message: "New lecture materials added to Database Design",
      time: "1 day ago",
      read: true,
      icon: MessageSquare,
      color: "blue"
    },
    {
      id: 4,
      type: "reminder",
      title: "Deadline Approaching",
      message: "Assignment due in 2 days",
      time: "1 day ago",
      read: false,
      icon: Clock,
      color: "purple"
    },
    {
      id: 5,
      type: "achievement",
      title: "Achievement Unlocked!",
      message: "You've completed 5 quizzes this week",
      time: "2 days ago",
      read: true,
      icon: TrendingUp,
      color: "blue"
    }
  ])

  const [filter, setFilter] = useState("all") // all, unread, read

  const unreadCount = notifications.filter(n => !n.read).length

  const filteredNotifications = notifications.filter(n => {
    if (filter === "unread") return !n.read
    if (filter === "read") return n.read
    return true
  })

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
    toast.success("Marked as read")
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    toast.success("All notifications marked as read")
  }

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
    toast.success("Notification deleted")
  }

  const clearAll = () => {
    setNotifications([])
    toast.success("All notifications cleared")
  }

  const getColorClasses = (color) => {
    return color === "blue"
      ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600"
      : "bg-purple-100 dark:bg-purple-900/30 text-purple-600"
  }

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30 relative">
              <Bell className="w-6 h-6 text-white" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs border-2 border-white dark:border-gray-900">
                  {unreadCount}
                </Badge>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Notifications
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={markAllAsRead}
                className="text-blue-600 border-blue-200 hover:bg-blue-50"
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Mark all read
              </Button>
            )}
            {notifications.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearAll}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Clear all
              </Button>
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
            className={filter === "all" ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white" : ""}
          >
            All ({notifications.length})
          </Button>
          <Button
            variant={filter === "unread" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("unread")}
            className={filter === "unread" ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white" : ""}
          >
            Unread ({unreadCount})
          </Button>
          <Button
            variant={filter === "read" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("read")}
            className={filter === "read" ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white" : ""}
          >
            Read ({notifications.length - unreadCount})
          </Button>
        </div>
      </motion.div>

      <div className="space-y-3">
        <AnimatePresence>
          {filteredNotifications.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Card className="border-none shadow-lg bg-white dark:bg-gray-900/50 backdrop-blur-xl">
                <CardContent className="p-12 text-center">
                  <Bell className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    No notifications
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {filter === "unread" 
                      ? "You're all caught up!" 
                      : filter === "read"
                      ? "No read notifications"
                      : "You don't have any notifications yet"}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            filteredNotifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={`border-none shadow-sm hover:shadow-lg transition-all cursor-pointer ${
                  !notification.read ? 'bg-blue-50 dark:bg-blue-900/10' : 'bg-white dark:bg-gray-900/50'
                } backdrop-blur-xl`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-xl ${getColorClasses(notification.color)} flex items-center justify-center flex-shrink-0`}>
                        <notification.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                            {notification.title}
                          </h3>
                          {!notification.read && (
                            <Badge className="bg-blue-600 text-white text-xs">New</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-4">
                          <span className="text-xs text-gray-500 dark:text-gray-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {notification.time}
                          </span>
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                              className="h-7 text-xs text-blue-600 hover:text-blue-700"
                            >
                              Mark as read
                            </Button>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteNotification(notification.id)}
                        className="text-gray-400 hover:text-red-600 h-8 w-8 p-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Quick Stats */}
      {notifications.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6"
        >
          <Card className="border-none shadow-sm bg-white dark:bg-gray-900/50 backdrop-blur-xl">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Assignments
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {notifications.filter(n => n.type === "assignment").length} new
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white dark:bg-gray-900/50 backdrop-blur-xl">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Award className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Grades
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {notifications.filter(n => n.type === "grade").length} posted
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white dark:bg-gray-900/50 backdrop-blur-xl">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Reminders
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {notifications.filter(n => n.type === "reminder").length} upcoming
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}

export default NotificationsCenter
