import { ChevronRight, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

/**
 * Breadcrumbs Component - Navigation breadcrumbs
 * @param {Object[]} items - Array of breadcrumb items
 * @param {string} items[].label - Display text
 * @param {string} items[].href - Link path (optional for last item)
 */
export const Breadcrumbs = ({ items = [], className = "" }) => {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center space-x-2 text-sm ${className}`}
    >
      {/* Home Link */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Link
          to="/"
          className="flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
        >
          <Home className="w-4 h-4" />
          <span className="sr-only">Home</span>
        </Link>
      </motion.div>

      {/* Breadcrumb Items */}
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex items-center space-x-2"
          >
            <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-600" />
            {isLast || !item.href ? (
              <span
                className="font-medium text-gray-900 dark:text-white"
                aria-current="page"
              >
                {item.label}
              </span>
            ) : (
              <Link
                to={item.href}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors hover:underline"
              >
                {item.label}
              </Link>
            )}
          </motion.div>
        );
      })}
    </nav>
  );
};

// Preset breadcrumb configurations
export const dashboardBreadcrumbs = {
  student: (currentPage) => [
    { label: "Dashboard", href: "/dashboard" },
    { label: currentPage },
  ],
  teacher: (currentPage) => [
    { label: "Teacher", href: "/teacher" },
    { label: currentPage },
  ],
  admin: (currentPage) => [
    { label: "Admin", href: "/admin" },
    { label: currentPage },
  ],
};
