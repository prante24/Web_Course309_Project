import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

/**
 * OnboardingTour Component - Interactive step-by-step guide
 * @param {Object[]} steps - Array of tour steps
 * @param {string} steps[].title - Step title
 * @param {string} steps[].description - Step description
 * @param {string} steps[].target - CSS selector for element to highlight
 * @param {string} steps[].position - Tooltip position (top, bottom, left, right)
 * @param {boolean} show - Whether to show the tour
 * @param {function} onComplete - Callback when tour completes
 * @param {function} onSkip - Callback when tour is skipped
 */
export const OnboardingTour = ({
  steps = [],
  show = false,
  onComplete,
  onSkip,
  storageKey = "onboarding-completed",
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [targetPosition, setTargetPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    // Check if user has completed onboarding
    const completed = localStorage.getItem(storageKey);
    if (!completed && show) {
      setIsVisible(true);
    }
  }, [show, storageKey]);

  useEffect(() => {
    if (isVisible && steps[currentStep]?.target) {
      const element = document.querySelector(steps[currentStep].target);
      if (element) {
        const rect = element.getBoundingClientRect();
        setTargetPosition({
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
          height: rect.height,
        });

        // Scroll element into view
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [currentStep, isVisible, steps]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    setIsVisible(false);
    localStorage.setItem(storageKey, "true");
    onSkip?.();
  };

  const handleComplete = () => {
    setIsVisible(false);
    localStorage.setItem(storageKey, "true");
    onComplete?.();
  };

  if (!isVisible || steps.length === 0) return null;

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[998]"
            onClick={handleSkip}
          />

          {/* Highlight Box */}
          {currentStepData.target && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed z-[999] pointer-events-none"
              style={{
                top: targetPosition.top - 8,
                left: targetPosition.left - 8,
                width: targetPosition.width + 16,
                height: targetPosition.height + 16,
                boxShadow: "0 0 0 4px rgba(59, 130, 246, 0.5)",
                borderRadius: "8px",
              }}
            />
          )}

          {/* Tooltip */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed z-[1000]"
            style={{
              top: targetPosition.top + targetPosition.height + 20,
              left: targetPosition.left,
              maxWidth: "400px",
            }}
          >
            <Card className="shadow-2xl">
              <CardContent className="p-6">
                {/* Close Button */}
                <button
                  onClick={handleSkip}
                  className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <motion.div
                      className="bg-blue-600 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Step {currentStep + 1} of {steps.length}
                  </p>
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold mb-2 dark:text-white">
                  {currentStepData.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {currentStepData.description}
                </p>

                {/* Navigation */}
                <div className="flex justify-between items-center">
                  <Button
                    variant="ghost"
                    onClick={handleSkip}
                    className="text-gray-500"
                  >
                    Skip Tour
                  </Button>
                  <div className="flex gap-2">
                    {currentStep > 0 && (
                      <Button variant="outline" onClick={handlePrevious}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Previous
                      </Button>
                    )}
                    <Button onClick={handleNext}>
                      {currentStep === steps.length - 1 ? "Finish" : "Next"}
                      {currentStep < steps.length - 1 && (
                        <ArrowRight className="w-4 h-4 ml-2" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Preset tours for different user roles
export const studentDashboardTour = [
  {
    title: "Welcome to Your Dashboard! 🎉",
    description:
      "Let's take a quick tour to help you get started with your learning journey.",
    target: null,
  },
  {
    title: "My Enrolled Classes",
    description:
      "View all your enrolled classes here. Track your progress and continue learning.",
    target: "[data-tour='enrolled-classes']",
  },
  {
    title: "Class Details",
    description:
      "Click on any class to view assignments, materials, and submit your work.",
    target: "[data-tour='class-card']",
  },
  {
    title: "Profile Settings",
    description:
      "Manage your profile, view achievements, and update your information.",
    target: "[data-tour='profile']",
  },
];

export const teacherDashboardTour = [
  {
    title: "Welcome, Teacher! 👨‍🏫",
    description: "Let's explore your teaching dashboard and its features.",
    target: null,
  },
  {
    title: "Add New Class",
    description:
      "Create and manage your classes. Upload materials and set assignments.",
    target: "[data-tour='add-class']",
  },
  {
    title: "My Classes",
    description:
      "View all your classes, track student enrollment, and manage content.",
    target: "[data-tour='my-classes']",
  },
  {
    title: "Class Analytics",
    description:
      "Monitor student progress, assignment submissions, and engagement metrics.",
    target: "[data-tour='analytics']",
  },
];

export const adminDashboardTour = [
  {
    title: "Admin Dashboard",
    description: "Manage the entire platform from your admin panel.",
    target: null,
  },
  {
    title: "Teacher Requests",
    description: "Review and approve teacher applications.",
    target: "[data-tour='teacher-requests']",
  },
  {
    title: "User Management",
    description: "Manage user roles, permissions, and account status.",
    target: "[data-tour='users']",
  },
  {
    title: "Class Management",
    description: "Approve, reject, or monitor all classes on the platform.",
    target: "[data-tour='classes']",
  },
];
