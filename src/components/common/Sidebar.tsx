"use client";
import styles from "../../assets/scss/sidebar.module.scss";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import DashboardIcon from "../../assets/icons/DashboardIcon";
import WorkloadIcon from "../../assets/icons/WorkloadIcon";
import Worklogs from "../../assets/icons/WorklogsIcon";
import Approvals from "../../assets/icons/ApprovalsIcon";
import Settings from "../../assets/icons/SettingsIcon";
import Reports from "../../assets/icons/ReportsIcon";
import MenuIcon from "../../assets/icons/MenuIcon";
import Pabs from "../../assets/icons/Pabs";
import PabsCollapse from "../../assets/icons/PabsCollaps";
import Link from "next/link";
import Image from "next/image";

interface SidebarItem {
  name: string;
  href: string;
  icon: JSX.Element;
}

const sidebarItems: SidebarItem[] = [
  // {
  //   name: "Dashboard",
  //   href: "/",
  //   icon: <DashboardIcon />,
  // },
  // {
  //   name: "Workload",
  //   href: "/workload",
  //   icon: <WorkloadIcon />,
  // },
  // {
  //   name: "Work Logs",
  //   href: "/worklogs",
  //   icon: <Worklogs />,
  // },
  // {
  //   name: "Approvals",
  //   href: "/approvals",
  //   icon: <Approvals />,
  // },
  {
    name: "Settings",
    href: "/settings",
    icon: <Settings />,
  },
  // {
  //   name: "Reports",
  //   href: "/reports",
  //   icon: <Reports />,
  // },
];

const DashboardItems = ({ pathname, isCollapsed }: any) => {
  // useEffect(() => {
  //   getHeaderOptions();
  // },[]);
  return (
    <>
      {sidebarItems.map((item, index) => (
        <Link
          key={index}
          href={item.href}
          className={`mb-[15px] flex items-center pl-[27px] border-l-[4px] hover:bg-[#F6F6F6] hover:border-[#0592C6] ${
            pathname === `${item.href}`
              ? "border-[#0592C6] bg-[#F6F6F6]"
              : "border-pureWhite"
          }`}
        >
          {isCollapsed ? (
            <span className="py-[19.65px]">{item.icon}</span>
          ) : (
            <>
              <span className="py-[10px]">{item.icon}</span>
              <span className="pl-[10px] py-[17.5px]">{item.name}</span>
            </>
          )}
        </Link>
      ))}
    </>
  );
};

const Sidebar = ({ setOpen, setSetting, toggleDrawer }: any) => {
  const pathname = usePathname();
  const [isCollapsed, setCollapse] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [windowSize, setWindowSize] = useState(0);

  const handleResize = () => {
    setWindowSize(window.innerWidth);
  };

  useEffect(() => {
    setIsOpen(toggleDrawer);
  }, [toggleDrawer]);

  useEffect(() => {
    setWindowSize(window.innerWidth);
    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  return (
    <>
      <div
        className={`${
          isCollapsed ? "lg:w-[6vw]" : "lg:w-[15vw]"
        } flex flex-col justify-between border-r border-[#E6E6E6] lg:h-screen text-darkCharcoal overflow-y-none overflow-x-hidden`}
      >
        <div className="flex flex-col">
          <div className="flex items-center justify-between">
            <span
              className={`py-[15px] ${
                isCollapsed ? "pr-[5vw] pl-[1vw]" : "pr-[15vw] pl-[2.13vw]"
              } text-[#0592C6] font-medium text-[24px] lg:border-b border-[#E6E6E6]`}
            >
              {isCollapsed ? <PabsCollapse width="50" height="36" /> : <Pabs height="36" />}
            </span>
            <span className="lg:hidden">
              <button
                className="flex flex-col h-12 w-12 rounded justify-center items-center group pr-5"
                onClick={() => {
                  setIsOpen(!isOpen);
                  setOpen(!isOpen);
                }}
              >
                <div
                  className={`h-1 w-6 my-1 rounded-full bg-darkCharcoal transition ease transform duration-300 ${
                    isOpen
                      ? "rotate-45 translate-y-3 opacity-50 group-hover:opacity-100"
                      : "opacity-50 group-hover:opacity-100"
                  }`}
                />
                <div
                  className={`h-1 w-6 my-1 rounded-full bg-darkCharcoal transition ease transform duration-300 ${
                    isOpen ? "opacity-0" : "opacity-50 group-hover:opacity-100"
                  }`}
                />
                <div
                  className={`h-1 w-6 my-1 rounded-full bg-darkCharcoal transition ease transform duration-300 ${
                    isOpen
                      ? "-rotate-45 -translate-y-3 opacity-50 group-hover:opacity-100"
                      : "opacity-50 group-hover:opacity-100"
                  }`}
                />
              </button>
            </span>
          </div>
          <div
            className={`${
              windowSize <= 1023
                ? `flex flex-col absolute h-screen z-50 top-[66px] bg-pureWhite w-[15vw] ${
                    isOpen ? styles.abc : styles.aaa
                  }`
                : "h-auto block"
            }`}
          >
            <DashboardItems pathname={pathname} isCollapsed={isCollapsed} />
          </div>
        </div>
        {windowSize >= 1024 && (
          <span
            className={`py-[32px] pl-[29px] ${
              isCollapsed ? "pr-[50px]" : "pr-[174px]"
            } border-t border-[#E6E6E6]`}
            onClick={() => {
              setCollapse(!isCollapsed);
              setSetting(!isCollapsed);
            }}
          >
            <MenuIcon />
          </span>
        )}
      </div>
    </>
  );
};

export default Sidebar;
