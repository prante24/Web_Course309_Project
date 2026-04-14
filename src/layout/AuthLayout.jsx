import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import PageTitle from "@/components/PageTitle";



const AuthLayout = () => {
  return (
    <div className=" ">
      <PageTitle />
      <header className="">
        <Navbar />
      </header>
      <Outlet></Outlet>
    </div>
  );
};

export default AuthLayout;