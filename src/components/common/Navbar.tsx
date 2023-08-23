"use client";

import React, { useEffect, useRef, useState } from "react";
import NotificationIcon from "@/assets/icons/NotificationIcon";
import { Avatar, Button } from "next-ts-lib";
import "next-ts-lib/dist/index.css";
import axios from "axios";
import Dropdown from "./Dropdown";
import { useRouter } from "next/navigation";

const Navbar = ({ onUserDetailsFetch }: any) => {
  const router = useRouter();
  const [orgData, setOrgData] = useState([]);
  const [openLogout, setOpenLogout] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  let token: any;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }

  let options: any[] = [];

  const getUserDetails = async () => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: token,
      };
      const response = await axios.get(
        `${process.env.api_url}/auth/getuserdetails`,
        { headers: headers }
      );
      if (response.status === 200) {
        setOrgData(response.data.ResponseData.Organizations);
        if (localStorage.getItem("Org_Token") === null) {
          localStorage.setItem(
            "Org_Token",
            response.data.ResponseData.Organizations[0].Token
          );
        }
        if (localStorage.getItem("Org_Id") === null) {
          localStorage.setItem(
            "Org_Id",
            response.data.ResponseData.Organizations[0].OrganizationId
          );
        }
        if (localStorage.getItem("Org_Name") === null) {
          localStorage.setItem(
            "Org_Name",
            response.data.ResponseData.Organizations[0].OrganizationName
          );
        }
      } else if (response.status === 401) {
        router.push("/login");
        localStorage.clear();
      }
    } catch {}
  };

  const fetchData = async () => {
    const fetchedData = await getUserDetails();
    onUserDetailsFetch(() => fetchData()); // Here you are treating onUserDetailsFetch as a function
  };

  useEffect(() => {
    fetchData();
    getUserDetails();
  }, [token]);

  orgData.map(({ Token, OrganizationName, OrganizationId }) => {
    return options.push({
      id: OrganizationId,
      label: OrganizationName,
      token: Token,
    });
  });

  const handleLogout = () => {
    setOpenLogout(false);
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("Org_Token");
      localStorage.removeItem("Org_Id");
      localStorage.removeItem("Org_Name");
    }
    router.push("/login");
  };

  useEffect(() => {
    const handleOutsideClick = (event: any) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setOpenLogout(false);
      }
    };

    window.addEventListener("click", handleOutsideClick);

    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  return (
    <div className="flex items-center justify-between px-[20px] py-[13px] border-b border-lightSilver z-5">
      {orgData.length > 0 ? ( // Check if orgData is not empty
        <Dropdown
          options={orgData.map(
            ({ Token, OrganizationName, OrganizationId }) => {
              return {
                id: OrganizationId,
                label: OrganizationName,
                token: Token,
              };
            }
          )}
        />
      ) : null}
      <span className="flex items-center gap-[30px]">
        <NotificationIcon />
        <div ref={selectRef} className="flex items-center justify-center flex-col relative">
          <span onClick={() => setOpenLogout(!openLogout)}>
            <Avatar />
          </span>
          {openLogout && (
            <div
              // ref={selectRef}
              className="absolute top-12 -right-5 mt-1.5 flex items-center cursor-pointer justify-center bg-pureWhite pr-1 z-50"
              onClick={handleLogout}
            >
              <Button variant="btn-error" className="rounded-md">
                <span className="flex items-center justify-center gap-1">
                  Logout
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                    />
                  </svg>
                </span>
              </Button>
            </div>
          )}
        </div>
      </span>
    </div>
  );
};

export default Navbar;
