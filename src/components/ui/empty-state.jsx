import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

/**
 * EmptyState Component - Display when no data is available
 * @param {Object} props
 * @param {string} props.icon - Lucide icon component
 * @param {string} props.title - Main heading
 * @param {string} props.description - Supporting text
 * @param {string} props.actionLabel - Button text
 * @param {string} props.actionLink - Button link
 * @param {function} props.onAction - Button click handler
 * @param {React.ReactNode} props.illustration - Custom illustration/image
 */
export const EmptyState = ({
  icon: Icon,
  title = "No data found",
  description = "There's nothing here yet. Get started by adding some content.",
  actionLabel,
  actionLink,
  onAction,
  illustration,
  className = "",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`flex items-center justify-center min-h-[400px] p-8 ${className}`}
    >
      <Card className="max-w-md w-full border-dashed border-2 dark:border-gray-700">
        <CardContent className="flex flex-col items-center text-center p-8">
          {/* Icon or Illustration */}
          {illustration ? (
            <div className="mb-6">{illustration}</div>
          ) : Icon ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mb-6 p-4 rounded-full bg-gray-100 dark:bg-gray-800"
            >
              <Icon className="w-16 h-16 text-gray-400 dark:text-gray-600" />
            </motion.div>
          ) : null}

          {/* Title */}
          <h3 className="text-2xl font-semibold mb-3 dark:text-white">
            {title}
          </h3>

          {/* Description */}
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm">
            {description}
          </p>

          {/* Action Button */}
          {(actionLabel || actionLink || onAction) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {actionLink ? (
                <Link to={actionLink}>
                  <Button size="lg" className="gap-2">
                    {actionLabel || "Get Started"}
                  </Button>
                </Link>
              ) : (
                <Button size="lg" onClick={onAction} className="gap-2">
                  {actionLabel || "Get Started"}
                </Button>
              )}
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Preset Empty States for common scenarios
export const NoClassesFound = ({ onAction, actionLink = "/all-classes" }) => (
  <EmptyState
    title="No Classes Found"
    description="You haven't enrolled in any classes yet. Browse our catalog to find the perfect course for you."
    actionLabel="Browse Classes"
    actionLink={actionLink}
    onAction={onAction}
    illustration={
      <img
        src="https://i.postimg.cc/T1VJzmq8/undraw-empty-re-opql.svg"
        alt="No classes"
        className="w-48 h-48 mb-4"
      />
    }
  />
);

export const NoSearchResults = ({ searchTerm, onReset }) => (
  <EmptyState
    title="No Results Found"
    description={`We couldn't find any results for "${searchTerm}". Try adjusting your search or filters.`}
    actionLabel="Clear Search"
    onAction={onReset}
    illustration={
      <img
        src="https://i.postimg.cc/QCwnkqSz/undraw-not-found-re-bh2e.svg"
        alt="No results"
        className="w-48 h-48 mb-4"
      />
    }
  />
);

export const NoUsers = () => (
  <EmptyState
    title="No Users Found"
    description="No users match your search criteria. Try different search terms."
    illustration={
      <img
        src="https://i.postimg.cc/hvHGBmC6/undraw-people-search-re-5rre.svg"
        alt="No users"
        className="w-48 h-48 mb-4"
      />
    }
  />
);

export const NoTeacherRequests = () => (
  <EmptyState
    title="No Teacher Requests"
    description="There are currently no pending teacher requests to review."
    illustration={
      <img
        src="https://i.postimg.cc/2SvzJSvb/undraw-teaching-re-g7e3.svg"
        alt="No requests"
        className="w-48 h-48 mb-4"
      />
    }
  />
);

export const NoAssignments = ({ actionLabel, onAction }) => (
  <EmptyState
    title="No Assignments Yet"
    description="There are no assignments for this class. Check back later or contact your instructor."
    actionLabel={actionLabel}
    onAction={onAction}
    illustration={
      <img
        src="https://i.postimg.cc/jqG64wGb/undraw-exams-re-4ios.svg"
        alt="No assignments"
        className="w-48 h-48 mb-4"
      />
    }
  />
);
