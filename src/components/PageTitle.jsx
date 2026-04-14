import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

// Route title mapping for dynamic page titles
const routeTitles = {
    '/': 'Home',
    '/all-classes': 'All Classes',
    '/teach': 'Teach on EduManage',
    '/ui-showcase': 'UI Showcase',
    '/auth/login': 'Login',
    '/auth/register': 'Register',
    // Student Dashboard
    '/dashboard': 'Student Dashboard',
    '/dashboard/my-enroll-class': 'My Enrolled Classes',
    '/dashboard/profile': 'My Profile',
    '/dashboard/quiz-generator': 'Quiz Generator',
    '/dashboard/ai-study-buddy': 'AI Study Buddy',
    '/dashboard/analytics': 'Performance Analytics',
    '/dashboard/flashcards': 'Flashcards',
    '/dashboard/achievements': 'Achievements',
    '/dashboard/notifications': 'Notifications',
    // Admin Dashboard
    '/admin': 'Admin Dashboard',
    '/admin/teacher-request': 'Teacher Requests',
    '/admin/users': 'Manage Users',
    '/admin/all-classes': 'All Classes - Admin',
    '/admin/profile': 'Admin Profile',
    // Teacher Dashboard
    '/teacher': 'Teacher Dashboard',
    '/teacher/addclass': 'Add New Class',
    '/teacher/my-classes': 'My Classes',
    '/teacher/ai-lecture-notes': 'AI Lecture Notes',
    '/teacher/profile': 'Teacher Profile',
};

// Function to get dynamic title based on route
const getDynamicTitle = (pathname) => {
    // Check for exact match first
    if (routeTitles[pathname]) {
        return routeTitles[pathname];
    }

    // Handle dynamic routes
    if (pathname.startsWith('/all-classes/')) {
        return 'Class Details';
    }
    if (pathname.startsWith('/payment/')) {
        return 'Payment';
    }
    if (pathname.startsWith('/dashboard/myenroll-class/')) {
        return 'Enrolled Class Details';
    }
    if (pathname.startsWith('/teacher/my-classes/')) {
        return 'Class Details';
    }

    // Default title
    return 'EduManage';
};

const PageTitle = ({ customTitle }) => {
    const location = useLocation();
    const baseTitle = 'EduManage';

    // Use custom title if provided, otherwise derive from route
    const pageTitle = customTitle || getDynamicTitle(location.pathname);

    // Format: "Page Title | EduManage" or just "EduManage" for home
    const fullTitle = pageTitle === 'Home' || pageTitle === 'EduManage'
        ? `${baseTitle} - Revolutionizing Education`
        : `${pageTitle} | ${baseTitle}`;

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={`${pageTitle} - EduManage is your premier education management platform for students, teachers, and administrators.`} />
            <link rel="icon" type="image/svg+xml" href="/edumanage-favicon.svg" />
        </Helmet>
    );
};

export default PageTitle;
