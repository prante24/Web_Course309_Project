/* eslint-disable react/prop-types */
import { Link } from "react-router-dom"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FiUsers, FiClock, FiStar, FiBookOpen } from "react-icons/fi"
import { motion } from "framer-motion"

const ClassCard = ({ classItem }) => {
  const {
    _id,
    image,
    title,
    instructorName,
    price,
    totalEnrollment,
    instructorImage,
    description,
    duration,
    rating,
    category
  } = classItem

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -8 }}
      className="h-full"
    >
      <Card className="group h-full flex flex-col overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 backdrop-blur-sm hover:shadow-2xl hover:shadow-blue-500/10 dark:hover:shadow-purple-500/20 transition-all duration-500">
        {/* Image Container with Overlay */}
        <div className="relative overflow-hidden h-52">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <img 
            src={image || "/placeholder.svg"} 
            alt={title} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" 
          />
          
          {/* Category Badge */}
          <Badge className="absolute top-3 right-3 z-20 px-3 py-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 font-medium shadow-lg">
            <FiBookOpen className="w-3 h-3 mr-1 inline" />
            {category}
          </Badge>

          {/* Rating Badge */}
          {rating && (
            <div className="absolute top-3 left-3 z-20 flex items-center gap-1 px-2.5 py-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-full shadow-lg border border-gray-200 dark:border-gray-700">
              <FiStar className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-semibold text-gray-900 dark:text-white">{rating}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <CardContent className="p-5 flex-grow flex flex-col space-y-4">
          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
            {title}
          </h3>

          {/* Instructor */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <img 
                src={instructorImage || "/placeholder-avatar.svg"} 
                alt={instructorName}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700" 
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {instructorName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Instructor</p>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
            {description}
          </p>

          {/* Stats */}
          <div className="flex items-center gap-4 pt-2">
            <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
              <FiUsers className="w-4 h-4" />
              <span className="text-sm font-medium">{totalEnrollment}</span>
            </div>
            <div className="w-px h-4 bg-gray-300 dark:bg-gray-700" />
            <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
              <FiClock className="w-4 h-4" />
              <span className="text-sm font-medium">{duration}</span>
            </div>
          </div>
        </CardContent>

        {/* Footer */}
        <CardFooter className="p-5 pt-0 mt-auto">
          <div className="w-full flex items-center justify-between gap-4">
            {/* Price */}
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Price</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                ${price}
              </span>
            </div>

            {/* Enroll Button */}
            <Link to={`/all-classes/${_id}`} className="flex-1 max-w-[140px]">
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600 text-white border-none shadow-lg shadow-blue-500/30 dark:shadow-purple-500/30 hover:shadow-xl hover:shadow-blue-500/40 dark:hover:shadow-purple-500/40 transition-all duration-300 font-semibold">
                Enroll Now
              </Button>
            </Link>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

export default ClassCard