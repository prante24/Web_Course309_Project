import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaChalkboardTeacher } from "react-icons/fa";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../provider/AuthProvider";
import { ThemeContext } from "@/provider/ThemeProvider";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { FiUser, FiLogOut, FiGrid } from "react-icons/fi";

const Navbar = () => {
    const { user, logOut } = useContext(AuthContext);
    const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (user?.email) {
            fetch(`https://edumanagebackend.vercel.app/users?email=${user.email}`)
                .then(res => res.json())
                .then(data => {
                    if (data.length > 0) {
                        setUserRole(data[0].role);
                    }
                });
        }
    }, [user]);

    const handleLogout = () => {
        logOut()
            .then(() => {
                navigate('/');
            })
            .catch(err => console.log(err));
    };

    const getDashboardLink = () => {
        switch (userRole) {
            case 'admin':
                return '/admin';
            case 'teacher':
                return '/teacher';
            default:
                return '/dashboard';
        }
    };

    const activeClassName = "text-primary font-semibold relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-full after:bg-primary after:scale-x-100 after:origin-left after:transition-transform after:duration-300";
    const inactiveClassName = "text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-full after:bg-primary after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100";

    const navLinks = (
        <>
            <li>
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        `px-3 py-2 inline-block ${isActive ? activeClassName : inactiveClassName}`
                    }
                >
                    Home
                </NavLink>
            </li>
            <li>
                <NavLink
                    to="/all-classes"
                    className={({ isActive }) =>
                        `px-3 py-2 inline-block ${isActive ? activeClassName : inactiveClassName}`
                    }
                >
                    All Classes
                </NavLink>
            </li>
            {userRole !== 'teacher' && userRole !== 'admin' && (
                <li>
                    <NavLink
                        to="/teach"
                        className={({ isActive }) =>
                            `px-3 py-2 inline-block ${isActive ? activeClassName : inactiveClassName}`
                        }
                    >
                        Teach on EduManage
                    </NavLink>
                </li>
            )}
        </>
    );

    return (
        <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`${scrolled
                ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg"
                : "bg-white dark:bg-gray-900"
                } sticky top-0 z-50 transition-all duration-300`}
        >
            <div className="navbar container mx-auto px-4 py-3">
                <div className="navbar-start lg:hidden">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        {isMenuOpen ? (
                            <HiX className="text-2xl text-primary dark:text-blue-400" />
                        ) : (
                            <HiMenuAlt3 className="text-2xl text-primary dark:text-blue-400" />
                        )}
                    </button>
                </div>

                <div className="navbar-start hidden lg:flex items-center">
                    <Link to="/" className="flex items-center group">
                        <div className="relative overflow-hidden rounded-xl mr-2">
                            <img src="https://i.postimg.cc/zBkL3m8G/25-255865-google-classroom-icon-area-in-which-cameras-are.png" alt="Classroom Icon" className="w-8 h-8 transition-transform group-hover:scale-110 duration-300" />
                        </div>
                        <motion.span
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="text-xl font-bold"
                        >
                            <span className="bg-gradient-to-r from-primary to-blue-600 dark:from-blue-400 dark:to-blue-600 text-transparent bg-clip-text">
                                EduManage
                            </span>
                            <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-blue-600 dark:from-blue-400 dark:to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                        </motion.span>
                    </Link>
                </div>

                <div className="navbar-center hidden lg:flex">
                    <ul className="flex gap-8 items-center font-medium">
                        {navLinks}
                    </ul>
                </div>

                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="absolute top-16 left-0 w-full bg-white dark:bg-gray-900 lg:hidden z-50 border-t dark:border-gray-700 shadow-xl rounded-b-xl overflow-hidden"
                        >
                            <ul className="p-4 space-y-4">
                                {navLinks}
                            </ul>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="navbar-end flex items-center gap-4">
                    <motion.label
                        className="swap swap-rotate p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full cursor-pointer transition-colors"
                        whileTap={{ rotate: 180 }}
                        transition={{ duration: 0.3 }}
                    >
                        <input
                            type="checkbox"
                            onChange={toggleDarkMode}
                            checked={isDarkMode}
                            className="theme-controller hidden"
                        />
                        <svg className="swap-on fill-current w-6 h-6 text-amber-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" /></svg>
                        <svg className="swap-off fill-current w-6 h-6 text-blue-700" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" /></svg>
                    </motion.label>

                    {user ? (
                        <div className="dropdown dropdown-end">
                            <label tabIndex={0} className="btn btn-ghost btn-circle avatar group p-0 overflow-hidden ring ring-primary/30 hover:ring-primary dark:ring-blue-400/30 dark:hover:ring-blue-400 transition-all duration-300">
                                <div className="relative w-10 h-10 rounded-full overflow-hidden">
                                    <img
                                        src={user?.photoURL?.split("?")[0] || "https://via.placeholder.com/150"}
                                        alt="user-profile"
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                </div>
                            </label>
                            <motion.ul
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                tabIndex={0}
                                className="mt-3 z-[1] p-2 shadow-xl menu dropdown-content bg-white dark:bg-gray-800 rounded-xl w-56 border dark:border-gray-700 overflow-hidden"
                            >
                                <li className="px-4 py-3 cursor-default border-b dark:border-gray-700">
                                    <div className="flex flex-col">
                                        <span className="font-medium text-gray-800 dark:text-gray-200">
                                            {user?.displayName}
                                        </span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                            {user?.email}
                                        </span>
                                    </div>
                                </li>
                                <div className="p-1">
                                    <li>
                                        <NavLink
                                            to={getDashboardLink()}
                                            className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300 group transition-colors"
                                        >
                                            <FiGrid className="text-gray-500 group-hover:text-primary dark:text-gray-400 dark:group-hover:text-blue-400 transition-colors" />
                                            Dashboard
                                        </NavLink>
                                    </li>
                                    <li>
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center gap-2 px-3 py-2 w-full hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-left text-gray-700 dark:text-gray-300 group transition-colors"
                                        >
                                            <FiLogOut className="text-gray-500 group-hover:text-red-500 dark:text-gray-400 dark:group-hover:text-red-400 transition-colors" />
                                            Logout
                                        </button>
                                    </li>
                                </div>
                            </motion.ul>
                        </div>
                    ) : (
                        <NavLink
                            to="/auth/login"
                            className="relative flex items-center gap-2 px-5 py-2.5 font-medium whitespace-nowrap shrink-0 rounded-xl group bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all duration-300"
                        >
                            <FiUser className="w-5 h-5" />
                            <span>Sign In</span>
                        </NavLink>
                    )}
                </div>
            </div>
        </motion.nav>
    );
};

export default Navbar;