import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import axios from "axios"
import { motion } from "framer-motion"
import { FileText, Calendar, Award, Loader2, Plus, Sparkles } from "lucide-react"
import toast from "react-hot-toast"
import PropTypes from "prop-types"

const CreateAssignmentModal = ({ isOpen, onClose, onAssignmentCreated, classId }) => {
  const [formData, setFormData] = useState({
    title: "",
    deadline: "",
    description: "",
    maxPoints: 100,
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === "maxPoints" ? Number(value) : value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await axios.post(`https://edumanagebackend.vercel.app/classes/${classId}/assignments`, formData)
      toast.success("Assignment created successfully!")
      setFormData({ title: "", deadline: "", description: "", maxPoints: 100 })
      onAssignmentCreated()
    } catch (error) {
      console.error("Error creating assignment:", error)
      toast.error("Failed to create assignment")
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setFormData({ title: "", deadline: "", description: "", maxPoints: 100 })
    onClose()
  }

  // Calculate minimum date (today)
  const today = new Date().toISOString().split("T")[0]

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden border-none">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-primary to-primary/80 p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Create New Assignment
            </DialogTitle>
            <DialogDescription className="text-primary-foreground/80">
              Add a new assignment for your students to complete
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="p-6 space-y-5"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              Assignment Title
            </Label>
            <Input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., React Hooks Practice Exercise"
              required
              className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Deadline & Max Points Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="deadline" className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                Deadline
              </Label>
              <Input
                type="date"
                id="deadline"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                min={today}
                required
                className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxPoints" className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-primary" />
                Max Points
              </Label>
              <Input
                type="number"
                id="maxPoints"
                name="maxPoints"
                value={formData.maxPoints}
                onChange={handleChange}
                min="1"
                max="1000"
                required
                className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the assignment requirements, objectives, and any specific instructions..."
              rows={4}
              required
              className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/30"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Assignment
                </>
              )}
            </Button>
          </div>
        </motion.form>
      </DialogContent>
    </Dialog>
  )
}

CreateAssignmentModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAssignmentCreated: PropTypes.func.isRequired,
  classId: PropTypes.string.isRequired,
}

export default CreateAssignmentModal
