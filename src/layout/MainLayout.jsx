import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "@/components/Footer";
import PageTitle from "@/components/PageTitle";

const MainLayout = () => {
    return (
        <div className="dark:bg-gray-900" >
            <PageTitle />
            <Navbar />
            <Outlet />
            <Footer />
        </div>
    );
};

export default MainLayout;