/**
 * Tour Data Attributes Helper
 * Add these data attributes to elements you want to highlight in onboarding tours
 */

// Student Dashboard Tour Targets
export const STUDENT_TOUR_TARGETS = {
  ENROLLED_CLASSES: '[data-tour="enrolled-classes"]',
  CLASS_CARD: '[data-tour="class-card"]',
  PROFILE: '[data-tour="profile"]',
  PROGRESS: '[data-tour="progress"]',
  ASSIGNMENTS: '[data-tour="assignments"]',
  RESOURCES: '[data-tour="resources"]',
};

// Teacher Dashboard Tour Targets
export const TEACHER_TOUR_TARGETS = {
  ADD_CLASS: '[data-tour="add-class"]',
  MY_CLASSES: '[data-tour="my-classes"]',
  ANALYTICS: '[data-tour="analytics"]',
  STUDENTS: '[data-tour="students"]',
  ASSIGNMENTS: '[data-tour="assignments"]',
  PROFILE: '[data-tour="profile"]',
};

// Admin Dashboard Tour Targets
export const ADMIN_TOUR_TARGETS = {
  TEACHER_REQUESTS: '[data-tour="teacher-requests"]',
  USERS: '[data-tour="users"]',
  CLASSES: '[data-tour="classes"]',
  ANALYTICS: '[data-tour="analytics"]',
  PROFILE: '[data-tour="profile"]',
  SETTINGS: '[data-tour="settings"]',
};

/**
 * Usage Example:
 * 
 * import { STUDENT_TOUR_TARGETS } from '@/lib/tour-targets';
 * 
 * // In your component:
 * <div data-tour="enrolled-classes">
 *   My Enrolled Classes
 * </div>
 * 
 * // In your tour definition:
 * {
 *   title: "Your Classes",
 *   description: "View all your enrolled classes here",
 *   target: STUDENT_TOUR_TARGETS.ENROLLED_CLASSES
 * }
 */
