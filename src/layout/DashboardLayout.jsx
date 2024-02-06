import { useContext, useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { AuthContext, useAuth, useNav } from "../context/AuthContext";
import Sidebar from "./SideBar/Sidebar";
import Navbar from "./Navbar/Navbar";
import CustomLoading from "../components/CustomLoading";

export default function DashboardLayout() {
  const { isAuthenticated, setIsRouteChange } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("token");
  const { isNavOpen, setIsNavOpen } = useNav();
  const { setLogout } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth/login");
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem("intendedPath", location.pathname);
    setIsRouteChange(Math.random());
  }, [location.pathname]);

  if (isLoading) {
    <CustomLoading />;
  } else {
    return (
      <div
        className={`text-neutral h-screen w-full bg-base-200 flex justify-between items-center md:pl-5 pb-5`}
      >
        <Sidebar />
        <main
          className={` w-full  scrollbar md:px-10 h-full overflow-y-auto pl-4 md:pl-5 pr-4 md:pr-9 `}
        >
          <div className="w-full fixed z-40">
            <Navbar />
          </div>
          <div
            className={`${
              isNavOpen ? "md:pl-32" : "pl-0"
            } md:ml-[90px] duration-300 transition-all pb-5 pt-24`}
          >
            <Outlet />
          </div>
        </main>

        {/* <footer className={`px-1 md:px-3 hidden`}>Footer</footer> */}
      </div>
    );
  }
}
