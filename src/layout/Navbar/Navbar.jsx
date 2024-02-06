import React, { useEffect, useState } from "react";
import DarkmodeToggler from "../../components/DarkmodeToggler";
import { FiUser } from "react-icons/fi";
import { BsFillGearFill } from "react-icons/bs";
import { HiBell } from "react-icons/hi";
import Headings from "../../components/Headings/Headings";
import { useAuth, useNav } from "../../context/AuthContext";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import SidebarGenerator from "../../utils/SidebarGenerator";
import { menus } from "../../constant/menus";
import { OutsideClickHandler } from "../../components/OutsideClickHandler";
import { RiUser6Line } from "react-icons/ri";
import { IoNotificationsOutline } from "react-icons/io5";
import { TbLogout2, TbSettings2 } from "react-icons/tb";
import { getFullImageLink } from "../../utils/getFullImageLink";
import { usePermission } from "../../context/PermissionContext";
import { formatRole } from "../../utils/formatRole";
import {
  changeNotificationStatus,
  getAllNotification,
} from "../../apis/notification/notification";
import toast from "react-hot-toast";
import CustomToaster from "../../components/CustomToaster";
import CustomLoading from "../../components/CustomLoading";
import moment from "moment";
import { formatOrRelativeTime } from "../../utils/formatOrRetriveTimeFromDate";
import NotificationRow from "../../pages/Notification/NotificationRow";

export default function Navbar() {
  const { setLogout } = useAuth();
  const permissions = JSON.parse(localStorage.getItem("permissions"));
  const user = JSON.parse(localStorage.getItem("userData"));

  const { isNavOpen, setIsNavOpen } = useNav();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [profileToggle, setProfileToggle] = useState(false);
  const location = useLocation();

  // NOTIFICATION RELATED WORK
  // FILTERS
  const [filters, setFilters] = useState({
    perPage: 20,
    page: 1,
  });

  // GET ALL DATA
  const [notifications, setNotifications] = useState({});
  const [totalUnreadNotifications, setTotalUnreadNotifications] = useState(0);
  const [isNotificationLoading, setIsNotificationLoading] = useState(true);
  const [isNotificationDropdownOn, setIsNotificationDropdownOn] =
    useState(false);
  const handleOpenNotification = (id, url, status) => {
    navigate("/");
    {
      status === "unread" &&
        changeNotificationStatus({
          notification_ids: [id],
        })
          .then((res) => {})
          .catch((error) => {
            toast.custom((t) => (
              <CustomToaster
                t={t}
                type={"error"}
                text={`ID: #00119 - ${error?.response?.data?.message}`}
                errors={error?.response?.data?.errors}
              />
            ));
          });
    }
  };
  const getAllData = () => {
    setIsNotificationLoading(true);
    getAllNotification({
      perPage: filters?.perPage,
      page: filters?.page,
    })
      .then((res) => {
        setNotifications(res?.notifications?.data || []);
        setTotalUnreadNotifications(res?.total_unread_messages || 0);
        setIsNotificationLoading(false);
      })
      .catch((error) => {
        setIsNotificationLoading(false);
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type={"error"}
            text={`ID: #00119 - ${error?.response?.data?.message}`}
            errors={error?.response?.data?.errors}
          />
        ));
      });
  };

  useEffect(() => {
    getAllData();
    setProfileToggle(false);
  }, [location.pathname]);

  return (
    <nav className="w-[100%] z-50 pr-8 shadow-sm md:w-[98%] h-20 flex items-center justify-between relative bg-base-200">
      {/* THIS IS DESKTOP MENU TOGGLE BUTTON  */}
      <button
        className={`relative bg-transparent transition-all duration-300 w-10 h-10 hidden md:block overflow-hidden ${
          isNavOpen ? "left-52" : "left-24"
        }`}
        onClick={() => {
          setIsNavOpen(!isNavOpen);
        }}
      >
        <span
          className={`absolute ${
            isNavOpen ? "-rotate-45 top-6" : "top-4"
          } left-3  h-[3px] rounded-full w-7 bg-primary block duration-200`}
        ></span>
        <span
          className={`absolute ${
            isNavOpen ? "-left-40 opacity-0" : "left-3"
          } top-6 h-[3px] rounded-full w-7 bg-primary block duration-200`}
        ></span>
        <span
          className={`absolute ${
            isNavOpen ? "rotate-45 top-5" : "top-8"
          } left-3  h-[3px] rounded-full w-7 bg-primary block duration-200`}
        ></span>
      </button>
      <OutsideClickHandler
        onOutsideClick={() => {
          setIsOpen(false);
        }}
        className="relative z-50 block md:hidden w-1/3 "
      >
        <button
          className="relative bg-transparent w-10 h-10 block md:hidden "
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        >
          <span
            className={`absolute ${
              isOpen ? "-rotate-45 top-7" : "top-4"
            } left-3  h-[3px] rounded-full w-7 bg-primary block duration-200`}
          ></span>
          <span
            className={`absolute ${
              isOpen ? "-left-20" : "left-3"
            } top-6 h-[3px] rounded-full w-7 bg-primary block duration-200`}
          ></span>
          <span
            className={`absolute ${
              isOpen ? "rotate-45 top-5" : "top-8"
            } left-3  h-[3px] rounded-full w-7 bg-primary block duration-200`}
          ></span>
        </button>
        <div
          className={`${
            isOpen ? "-left-[0.90rem]" : "-left-72"
          } duration-200  top-16 absolute w-[220px] rounded-r-xl md:rounded-xl scrollbar h-[90vh] border-r border-t border-b border-primary-content  bg-base-300 shadow-xl text-base-100 flex-col md:hidden flex`}
        >
          <NavLink
            to={"/"}
            className="w-full flex justify-center items-center py-3"
          >
            <img
              className={`w-[70%] h-auto hidden md:block`}
              src={`/assets/lightLogo.png`}
              alt=""
            />
          </NavLink>

          <div
            className={`navmenu flex flex-col gap-2 items-center md:items-start`}
          >
            <SidebarGenerator
              links={menus({ permissions, userData: user })}
              isNested={false}
            />
          </div>
        </div>
      </OutsideClickHandler>

      <NavLink
        to={`/`}
        data-tip={user?.business?.name}
        className="w-1/2 tooltip tooltip-bottom tooltip-primary flex justify-center items-center md:hidden"
      >
        {user?.business !== null ? (
          <>
            {user?.business?.logo ? (
              <>
                <img
                  className="h-16 w-16 object-cover rounded-full shadow-md"
                  src={`${getFullImageLink(user?.business?.logo)}`}
                  alt={""}
                />
              </>
            ) : (
              <h1 className="text-xl text-primary font-medium">
                {user?.business?.name}
              </h1>
            )}
          </>
        ) : (
          <img
            className="w-16 h-16  object-cover rounded-full shadow-md"
            src={`/assets/lightLogo.png`}
            alt={""}
          />
        )}
      </NavLink>

      <div className="flex gap-3 w-1/3 justify-end ">
        <div className="flex items-center relative">
          {/* PROFILE BUTTON  */}
          <button
            data-tip={`${
              user?.first_Name.slice(0, 1).toUpperCase() +
              user?.first_Name.slice(1)
            }
          ${
            user?.middle_Name
              ? user?.middle_Name.slice(0, 1).toUpperCase() +
                user?.middle_Name.slice(1)
              : ""
          }
          ${
            user?.last_Name.slice(0, 1).toUpperCase() + user?.last_Name.slice(1)
          }`}
            className="flex tooltip tooltip-left tooltip-primary items-center gap-2"
            onClick={() => setProfileToggle(!profileToggle)}
          >
            {user?.image ? (
              <div className="avatar">
                <div className="w-10 ring ring-primary  rounded-full">
                  <img src={getFullImageLink(user?.image)} />
                </div>
              </div>
            ) : (
              <div className="avatar placeholder">
                <div className="bg-primary rounded-full text-base-300 w-10">
                  <span className="text-md font-medium">
                    {user?.first_Name.slice(0, 1).toUpperCase()}
                    {user?.middle_Name
                      ? user?.middle_Name.slice(0, 1).toUpperCase()
                      : ""}
                    {user?.last_Name.slice(0, 1).toUpperCase()}
                  </span>
                </div>
              </div>
            )}
          </button>

          {/* PROFILE DROPDOWN  */}
          <OutsideClickHandler
            onOutsideClick={() => {
              setProfileToggle(false);
            }}
            className={`absolute profileDropdown z-50 right-0  bg-base-300 w-auto mt-5 py-5 shadow-xl rounded-xl ${
              profileToggle ? "block top-10" : "hidden top-64"
            }`}
          >
            <div className="w-[270px] flex flex-col items-start">
              <div className="border-b border-primary-content pb-3 flex justify-between w-full px-5">
                <button
                  className=" flex justify-start gap-3 items-center "
                  onClick={() => navigate("/profile")}
                >
                  {user?.image ? (
                    <div className="avatar">
                      <div className="w-10 ring ring-primary  rounded-full">
                        <img src={getFullImageLink(user?.image)} />
                      </div>
                    </div>
                  ) : (
                    <div className="avatar placeholder">
                      <div className="bg-primary text-base-300 rounded-full w-10">
                        <span className="text-md font-medium">
                          {user?.first_Name.slice(0, 1).toUpperCase()}
                          {user?.middle_Name
                            ? user?.middle_Name.slice(0, 1).toUpperCase()
                            : ""}
                          {user?.last_Name.slice(0, 1).toUpperCase()}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col justify-start items-start">
                    <h1 className="leading-4 text-primary font-medium text-left">
                      {user?.first_Name}{" "}
                      {user?.middle_Name ? user?.middle_Name : ""}{" "}
                      {user?.last_Name}
                    </h1>
                    <span className="text-gray-500 font-light">
                      {formatRole(user?.roles[0]?.name)}
                    </span>
                  </div>
                </button>
              </div>

              <button
                className="px-5 py-3 w-full text-left hover:bg-base-200 flex items-center gap-3"
                onClick={() => navigate("/profile")}
              >
                <RiUser6Line className="text-xl" /> My Profile
              </button>

              {/* <button
                className="px-5 py-3 w-full text-left hover:bg-base-200 flex items-center gap-3"
                onClick={() => navigate("/notification")}
              >
                <IoNotificationsOutline className="text-xl" /> Notification
              </button> */}

              {/* <button
                className="px-5 py-3 w-full text-left hover:bg-base-200 flex items-center gap-3"
                onClick={() => navigate("/settings")}
              >
                <TbSettings2 className="text-xl" /> Settings
              </button> */}

              <button
                className="px-5 py-3 w-full text-left text-red-500 hover:bg-base-200 flex items-center gap-3"
                onClick={() => setLogout()}
              >
                <TbLogout2 className="text-xl" /> Logout
              </button>
            </div>
          </OutsideClickHandler>
        </div>
      </div>
    </nav>
  );
}
