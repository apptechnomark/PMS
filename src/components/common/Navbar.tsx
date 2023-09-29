"use client";

import React, { useEffect, useRef, useState } from "react";
import NotificationIcon from "@/assets/icons/NotificationIcon";
import { Avatar, Button, Toast } from "next-ts-lib";
import "next-ts-lib/dist/index.css";
import axios from "axios";
import Dropdown from "./Dropdown";
import { useRouter } from "next/navigation";

const Navbar = ({ onUserDetailsFetch, onHandleModuleNames }: any) => {
  const router = useRouter();
  const [orgData, setOrgData] = useState([]);
  const [openLogout, setOpenLogout] = useState(false);
  const [userData, setUserData] = useState<any>([]);
  const [roleDropdownData, setRoleDropdownData] = useState([]);
  const selectRef = useRef<HTMLDivElement>(null);

  let token: any;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }

  let options: any[] = [];

  const getData = async () => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.get(
        `${process.env.pms_api_url}/Role/GetDropdown`,
        {
          headers: {
            Authorization: `bearer ${token}`,
            org_token: `${Org_Token}`,
          },
        }
      );
      if (response.status === 200) {
        if (response.data.ResponseStatus === "Success") {
          setRoleDropdownData(response.data.ResponseData);
        } else {
          const data = response.data.Message;
          if (data === null) {
            Toast.error("Please try again later.");
          } else {
            Toast.error(data);
          }
        }
      } else {
        const data = response.data.Message;
        if (data === null) {
          Toast.error("Please try again.");
        } else {
          Toast.error(data);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

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
        setUserData(response.data.ResponseData);
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
        getData();
        const filteredOrganization =
          response.data.ResponseData.Organizations.filter(
            (org: any) =>
              org.OrganizationName === localStorage.getItem("Org_Name")
          );
        const {
          ClientModuleName,
          ProjectModuleName,
          ProcessModuleName,
          SubProcessModuleName,
        } = filteredOrganization[0];
        onHandleModuleNames(
          ClientModuleName,
          ProjectModuleName,
          ProcessModuleName,
          SubProcessModuleName
        );
      }
    } catch (error: any) {
      if (error.response.status === 401) {
        router.push("/login");
        localStorage.clear();
      }
    }
  };

  const fetchData = async () => {
    const fetchedData = await getUserDetails();
    onUserDetailsFetch(() => fetchData());
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
        <div className="flex flex-col -m-2">
          <span className="inline-block text-base font-semibold text-darkCharcoal">
            {userData?.FirstName} {userData?.LastName}
          </span>
          <span className="inline-block text-base font-semibold text-darkCharcoal">
            {roleDropdownData.map((i: any) => {
              return i.value === userData.RoleId && i.label;
            })}
          </span>
        </div>
        <div
          ref={selectRef}
          className="flex items-center justify-center flex-col relative"
        >
          <span
            onClick={() => setOpenLogout(!openLogout)}
            className="cursor-pointer"
          >
            <Avatar name={`${userData.FirstName} ${userData.LastName}`} />
          </span>
          {openLogout && (
            <div className="absolute top-[55px] rounded-md -right-2 w-50 h-12 px-5 flex items-center justify-center bg-pureWhite shadow-xl z-50">
              <p
                onClick={handleLogout}
                className="flex items-center justify-center cursor-pointer"
              >
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0"
                  viewBox="0 0 1024 1024"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                  className="-rotate-90"
                >
                  <path d="M868 732h-70.3c-4.8 0-9.3 2.1-12.3 5.8-7 8.5-14.5 16.7-22.4 24.5a353.84 353.84 0 0 1-112.7 75.9A352.8 352.8 0 0 1 512.4 866c-47.9 0-94.3-9.4-137.9-27.8a353.84 353.84 0 0 1-112.7-75.9 353.28 353.28 0 0 1-76-112.5C167.3 606.2 158 559.9 158 512s9.4-94.2 27.8-137.8c17.8-42.1 43.4-80 76-112.5s70.5-58.1 112.7-75.9c43.6-18.4 90-27.8 137.9-27.8 47.9 0 94.3 9.3 137.9 27.8 42.2 17.8 80.1 43.4 112.7 75.9 7.9 7.9 15.3 16.1 22.4 24.5 3 3.7 7.6 5.8 12.3 5.8H868c6.3 0 10.2-7 6.7-12.3C798 160.5 663.8 81.6 511.3 82 271.7 82.6 79.6 277.1 82 516.4 84.4 751.9 276.2 942 512.4 942c152.1 0 285.7-78.8 362.3-197.7 3.4-5.3-.4-12.3-6.7-12.3zm88.9-226.3L815 393.7c-5.3-4.2-13-.4-13 6.3v76H488c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h314v76c0 6.7 7.8 10.5 13 6.3l141.9-112a8 8 0 0 0 0-12.6z"></path>
                </svg>
                &nbsp;Logout
              </p>
            </div>
          )}
        </div>
      </span>
    </div>
  );
};

export default Navbar;
