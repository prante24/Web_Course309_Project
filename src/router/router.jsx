import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import Home from "../pages/Home/Home";
import AuthLayout from "../layout/AuthLayout";
import Login from "../components/Login";
import Register from "../components/Register";
import AllClasses from "@/pages/class/AllClasses";
import TeachForm from "@/pages/teach/TeachForm";
import DashboardLayout from "@/pages/Dashboard/StudentDashboard";
import MyEnrollClass from "@/components/studentdashboard/MyEnrollClass";
import MyEnrollClassDetails from "@/components/studentdashboard/MyEnrollClassDetails";
import MyProfile from "@/components/studentdashboard/MyProfile";
import AdminDashboardLayout from "@/pages/Dashboard/AdminDashBoardLayout";
import TeacherRequest from "@/components/admin/TeacherRequest";
import Users from "@/components/admin/Users";
import AllClassesAdmin from "@/components/admin/AllClassesAdmin";
import AdminProfile from "@/components/admin/AdminProfile";
import TeacherDashBoardLayout from "@/pages/Dashboard/TeacherDashBoardLayout";
import AddClass from "@/components/teacher/AddClass";
import MyClasses from "@/components/teacher/Myclasses";
import TeacherProfile from "@/components/teacher/TeacherProfile";
import ClassDetails from "@/components/teacher/ClassDetails";
import AILectureNotesGenerator from "@/components/teacher/AILectureNotesGenerator";
import ClassDetailsEnroll from "@/pages/class/ClassDetailsEnroll";
import PaymentPage from "@/pages/class/PaymentPage";
import ErrorPage from "@/pages/ErrorPage";
import PrivateRouter from "./PrivateRouter";
import InteractiveQuizGenerator from "@/components/teacher/InteractiveQuizGenerator";
import AIStudyBuddy from "@/components/studentdashboard/AIStudyBuddy";
import PerformanceAnalytics from "@/components/studentdashboard/PerformanceAnalytics";
import NotificationsCenter from "@/components/studentdashboard/NotificationsCenter";
import FlashcardGenerator from "@/components/studentdashboard/FlashcardGenerator";
import AchievementSystem from "@/components/studentdashboard/AchievementSystem";
import AssignmentsPage from "@/components/studentdashboard/AssignmentsPage";
import UIShowcasePage from "@/pages/UIShowcasePage";

const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                path: '/',
                element: <Home />
            },
            {
                path: '/all-classes',
                element: <AllClasses />,
            },
            {
                path: '/all-classes/:id',
                element: <PrivateRouter><ClassDetailsEnroll /></PrivateRouter>
            },
            {
                path: '/payment/:id',
                element: <PrivateRouter><PaymentPage /></PrivateRouter>
            },
            {
                path: '/teach',
                element: <PrivateRouter><TeachForm /></PrivateRouter>
            },
            {
                path: '/ui-showcase',
                element: <UIShowcasePage />
            }

        ]

    },
    {
        path: 'auth',
        element: <AuthLayout />,
        children: [
            {
                path: 'login',
                element: <Login />
            },
            {
                path: 'register',
                element: <Register />
            }
        ]
    }, {
        path: 'dashboard',
        element: <PrivateRouter><DashboardLayout /></PrivateRouter>,
        children: [
            {
                path: 'my-enroll-class',
                element: <PrivateRouter><MyEnrollClass /></PrivateRouter>
            }, {
                path: 'myenroll-class/:id',
                element: <PrivateRouter><MyEnrollClassDetails /></PrivateRouter>
            },
            {
                path: 'profile',
                element: <PrivateRouter><MyProfile /></PrivateRouter>
            },
            {
                path: 'assignments',
                element: <PrivateRouter><AssignmentsPage /></PrivateRouter>
            },
            {
                path: 'quiz-generator',
                element: <PrivateRouter><InteractiveQuizGenerator /></PrivateRouter>
            },
            {
                path: 'ai-study-buddy',
                element: <PrivateRouter><AIStudyBuddy /></PrivateRouter>
            },
            {
                path: 'analytics',
                element: <PrivateRouter><PerformanceAnalytics /></PrivateRouter>
            },
            {
                path: 'flashcards',
                element: <PrivateRouter><FlashcardGenerator /></PrivateRouter>
            },
            {
                path: 'achievements',
                element: <PrivateRouter><AchievementSystem /></PrivateRouter>
            },
            {
                path: 'notifications',
                element: <PrivateRouter><NotificationsCenter /></PrivateRouter>
            }
        ]
    }, {
        path: 'admin',
        element: <PrivateRouter><AdminDashboardLayout /></PrivateRouter>,
        children: [
            {
                path: 'teacher-request',
                element: <PrivateRouter><TeacherRequest /></PrivateRouter>
            },
            {
                path: 'users',
                element: <PrivateRouter><Users /></PrivateRouter>
            }, {
                path: 'all-classes',
                element: <PrivateRouter><AllClassesAdmin /></PrivateRouter>
            }, {
                path: 'profile',
                element: <PrivateRouter><AdminProfile /></PrivateRouter>
            }
        ]
    }, {
        path: 'teacher',
        element: <PrivateRouter><TeacherDashBoardLayout /></PrivateRouter>,
        children: [{
            path: 'addclass',
            element: <PrivateRouter><AddClass /></PrivateRouter>
        },
        {
            path: 'my-classes',
            element: <PrivateRouter><MyClasses /></PrivateRouter>
        },
        {
            path: 'my-classes/:id',
            element: <PrivateRouter><ClassDetails /></PrivateRouter>,
            loader: ({ params }) => fetch(`https://edumanagebackend.vercel.app/classes/${params.id}`)
        },
        {
            path: 'ai-lecture-notes',
            element: <PrivateRouter><AILectureNotesGenerator /></PrivateRouter>
        },
        {
            path: 'profile',
            element: <PrivateRouter><TeacherProfile /></PrivateRouter>
        }

        ]
    },
    {
        path: '*',
        element: <ErrorPage />
    }
])

export default router;