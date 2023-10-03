/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
// Library Components
import { Button, Select, Text, Toast, Tooltip } from "next-ts-lib";
import "next-ts-lib/dist/index.css";
// Icons
import DotsIcon from "@/assets/icons/DotsIcon";
import FilterIcon from "@/assets/icons/FilterIcon";
import ImportIcon from "@/assets/icons/ImportIcon";
import ExportIcon from "@/assets/icons/ExportIcon";
import AddPlusIcon from "@/assets/icons/AddPlusIcon";
// Setting's Components
import User from "@/components/settings/tables/User";
import Group from "@/components/settings/tables/Group";
import Client from "@/components/settings/tables/Client";
import Project from "@/components/settings/tables/Project";
import Process from "@/components/settings/tables/Process";
import Status from "@/components/settings/tables/Status";
import Permissions from "@/components/settings/tables/Permissions";
// Import Layout Component
import Drawer from "@/components/settings/drawer/Drawer";
import DrawerOverlay from "@/components/settings/drawer/DrawerOverlay";
import Wrapper from "@/components/common/Wrapper";
import Navbar from "@/components/common/Navbar";
import Organization from "@/components/settings/tables/Organization";
import { hasNoToken, hasPermissionWorklog } from "@/utils/commonFunction";
import { useRouter } from "next/navigation";
import SearchIcon from "@/assets/icons/SearchIcon";

type Tabs = { id: string; label: string; canView: boolean };

const initialTabs = [
  { id: "Client", label: "Client", canView: false },
  { id: "Project", label: "Project", canView: false },
  { id: "User", label: "User", canView: false },
  { id: "Process", label: "Process", canView: false },
  { id: "Group", label: "Group", canView: false },
  { id: "Status", label: "Status", canView: false },
  { id: "Permission", label: "Permissions", canView: false },
  { id: "Organization", label: "Organization", canView: false },
];

const page = () => {
  const router = useRouter();
  const [tabs, setTabs] = useState<Tabs[]>(initialTabs);
  const [tab, setTab] = useState<string>("");
  const [selectedTabIndex, setSelectedTabIndex] = useState<number>(-1);
  const [visibleTabs, setVisibleTabs] = useState(tabs.slice(0, 6));
  const [dropdownTabs, setDropdownTabs] = useState(tabs.slice(6));
  const selectRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [isLoaded, setLoaded] = useState<boolean>(false);
  const [hasEditId, setHasEditId] = useState("");
  const [userData, setUserData] = useState([]);
  const [getUserDataFunction, setUserGetDataFunction] = useState<
    (() => void) | null
  >(null);
  const [groupData, setGroupData] = useState("");
  const [projectData, setProjectData] = useState([]);

  const [statusData, setStatusData] = useState("");
  const [getProcessDataFunction, setProcessGetDataFunction] = useState<
    (() => void) | null
  >(null);
  const [processData, setProcessData] = useState("");

  const handleGroupData = (data: any) => {
    setGroupData(data);
  };

  const handleProjectData = (data: any) => {
    setProjectData(data);
  };
  const handleStatusData = (data: any) => {
    setStatusData(data);
  };

  const handleUserDataFetch = (getData: () => void) => {
    setUserGetDataFunction(() => getData);
  };

  const handleProcessData = (data: any) => {
    setProcessData(data);
  };

  const handleUserData = (data: any) => {
    setUserData(data);
  };
  const [orgData, setOrgData] = useState([]);
  const [clientData, setClientData] = useState([]);
  const [getDataFunction, setGetDataFunction] = useState<(() => void) | null>(
    null
  );
  const [getOrgDetailsFunction, setGetOrgDetailsFunction] = useState<
    (() => void) | null
  >(null);
  const [permissionValue, setPermissionValue] = useState(0);
  const [permissionDropdownData, setPermissionDropdownData] = useState([]);
  const [isPermissionExpanded, setPermissionExpanded] =
    useState<boolean>(false);
  const [updatedPermissionsData, setUpdatedPermissionsData] = useState([]);
  const [textName, setTextName] = useState("");
  const [textValue, setTextValue] = useState(null);

  const [clientSearchValue, setClientSearchValue] = useState("");
  const [clientSearchData, setClientSearchData] = useState("");
  const [projectSearchValue, setProjectSearchValue] = useState("");
  const [projectSearchData, setProjectSearchData] = useState("");
  const [userSearchValue, setUserSearchValue] = useState("");
  const [userSearchData, setUserSearchData] = useState("");
  const [processSearchValue, setProcessSearchValue] = useState("");
  const [processSearchData, setProcessSearchData] = useState("");
  const [statusSearchValue, setStatusSearchValue] = useState("");
  const [statusSearchData, setStatusSearchData] = useState("");
  const [groupSearchValue, setGroupSearchValue] = useState("");
  const [groupSearchData, setGroupSearchData] = useState("");
  const [orgSearchValue, setOrgSearchValue] = useState("");
  const [orgSearchData, setOrgSearchData] = useState("");

  const handleRefresh = () => {
    window.location.reload();
  };

  // setting getData function got from child (client) component
  const handleDataFetch = (getData: () => void) => {
    setGetDataFunction(() => getData);
  };

  const handleProcessDataFetch = (getData: () => void) => {
    setProcessGetDataFunction(() => getData);
  };

  const handleOrgData = (data: any) => {
    setOrgData(data);
  };

  const handleClientData = (data: any) => {
    setClientData(data);
  };

  useEffect(() => {
    hasNoToken(router);
  }, [router]);

  // To Toggle Tab-list
  const handleToggleOpen = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  // To Toggle Drawer
  const handleDrawerOpen = () => {
    setOpenDrawer(true);
  };

  const handleDrawerClose = () => {
    setOpenDrawer(false);
    setHasEditId("");
  };

  // To Toggle Drawer for Edit
  const handleEdit = (rowId: string) => {
    setHasEditId(rowId);
    setOpenDrawer(true);
  };

  const handleTabClick = (tabId: string, index: number) => {
    if (hasPermissionWorklog(tabId.toLowerCase(), "view", "settings")) {
      const clickedTab = dropdownTabs[index];
      const lastVisibleTab = visibleTabs[visibleTabs.length - 1];

      // Check if the clicked tab is already visible, then return
      if (visibleTabs.some((tab) => tab.id === tabId)) {
        setTab(tabId); // Update the tab state
        setSelectedTabIndex(index);
        return;
      }

      // Find the index of the clicked tab in the dropdownTabs array
      const clickedTabIndexInDropdown = dropdownTabs.findIndex(
        (tab) => tab.id === tabId
      );

      // Update the state to swap the tabs
      const updatedVisibleTabs = [...visibleTabs];
      const updatedDropdownTabs = [...dropdownTabs];

      // Replace the last visible tab with the clicked tab
      updatedVisibleTabs[visibleTabs.length - 1] = clickedTab;

      // If the clicked tab is already in the dropdown, replace it with the last visible tab
      if (clickedTabIndexInDropdown !== -1) {
        updatedDropdownTabs[clickedTabIndexInDropdown] = lastVisibleTab;

        // Find the new index of the selected tab in the visible tabs
        const newSelectedTabIndex = updatedVisibleTabs.findIndex(
          (tab) => tab.id === tabId
        );
        setSelectedTabIndex(newSelectedTabIndex);
      } else {
        // If the clicked tab is not in the dropdown, add the last visible tab to the beginning of the dropdown
        updatedDropdownTabs.unshift(lastVisibleTab);
        setSelectedTabIndex(visibleTabs.length + clickedTabIndexInDropdown);
      }

      setTab(tabId);
      setVisibleTabs(updatedVisibleTabs);
      setDropdownTabs(updatedDropdownTabs);
      setOpen(false);
    }
  };

  useEffect(() => {
    const handleOutsideClick = (event: any) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    window.addEventListener("click", handleOutsideClick);

    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const getPermissionDropdown = async () => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.get(
        `${process.env.pms_api_url}/Role/GetList`,
        {
          headers: {
            Authorization: `bearer ${token}`,
            org_token: `${Org_Token}`,
          },
        }
      );

      if (response.status === 200) {
        if (response.data.ResponseStatus === "Success") {
          setPermissionDropdownData(response.data.ResponseData);
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

  useEffect(() => {
    tab === "Permission" && getPermissionDropdown();
  }, [tab]);

  const handleSavePermissionData = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (updatedPermissionsData.length > 0) {
      saveData();
      setPermissionExpanded(false);
    } else {
      Toast.error("Please try again after sometime.");
    }
  };

  const saveData = async () => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.post(
        `${process.env.pms_api_url}/Role/SavePermission`,
        {
          RoleId: permissionValue !== 0 && permissionValue,
          Permissions: updatedPermissionsData,
        },
        {
          headers: {
            Authorization: `bearer ${token}`,
            org_token: `${Org_Token}`,
          },
        }
      );

      if (response.status === 200) {
        if (response.data.ResponseStatus === "Success") {
          Toast.success("Data saved successfully.");
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

  const handleFormButtonClick = (editing: boolean) => {
    if (editing) {
      if (textName.trim().length > 0 && textValue !== null) {
        const saveRole = async () => {
          const token = await localStorage.getItem("token");
          const Org_Token = await localStorage.getItem("Org_Token");
          try {
            const response = await axios.post(
              `${process.env.pms_api_url}/Role/Save`,
              {
                RoleId: textValue,
                Name: textName,
                Type: permissionDropdownData
                  .map((i: any) => (i.value === textValue ? i.Type : undefined))
                  .filter((i: any) => i !== undefined)[0],
              },
              {
                headers: {
                  Authorization: `bearer ${token}`,
                  org_token: `${Org_Token}`,
                },
              }
            );

            if (response.status === 200) {
              if (response.data.ResponseStatus === "Success") {
                getPermissionDropdown();
                Toast.success(`Role saved successfully.`);
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
                Toast.error("Failed Please try again.");
              } else {
                Toast.error(data);
              }
            }
          } catch (error) {
            console.error(error);
          }
        };
        saveRole();
      }
    }
  };

  const handleProjectDelete = (e: any) => {
    if (e > 0) {
      const saveRole = async () => {
        const token = await localStorage.getItem("token");
        const Org_Token = await localStorage.getItem("Org_Token");
        try {
          const response = await axios.post(
            `${process.env.pms_api_url}/Role/Delete`,
            {
              RoleId: e,
            },
            {
              headers: {
                Authorization: `bearer ${token}`,
                org_token: `${Org_Token}`,
              },
            }
          );

          if (response.status === 200) {
            if (response.data.ResponseStatus === "Success") {
              getPermissionDropdown();
              Toast.success(`Role has been deleted successfully!`);
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
              Toast.error("Failed Please try again.");
            } else {
              Toast.error(data);
            }
          }
        } catch (error) {
          console.error(error);
        }
      };
      saveRole();
    }
  };

  const handleUserDetailsFetch = (getData: () => void) => {
    setGetOrgDetailsFunction(() => getData);
    setLoaded(true);
  };

  const handleModuleNames = (
    arg1: string,
    arg2: string,
    arg3: string,
    arg4: string
  ) => {
    const updatedTabs = tabs.map((tab) => {
      switch (tab.id.toLowerCase()) {
        case "client":
          return {
            ...tab,
            label: arg1,
            canView: hasPermissionWorklog(
              tab.id.toLowerCase(),
              "view",
              "settings"
            ),
          };
          break;
        case "project":
          return {
            ...tab,
            label: arg2,
            canView: hasPermissionWorklog(
              tab.id.toLowerCase(),
              "view",
              "settings"
            ),
          };
          break;
        case "user":
          return {
            ...tab,
            canView: hasPermissionWorklog(
              tab.id.toLowerCase(),
              "view",
              "settings"
            ),
          };
          break;
        case "process":
          return {
            ...tab,
            label: arg3,
            canView: hasPermissionWorklog(
              tab.id.toLowerCase(),
              "view",
              "settings"
            ),
          };
          break;
        case "group":
          return {
            ...tab,
            canView: hasPermissionWorklog(
              tab.id.toLowerCase(),
              "view",
              "settings"
            ),
          };
          break;
        case "status":
          return {
            ...tab,
            canView: hasPermissionWorklog(
              tab.id.toLowerCase(),
              "view",
              "settings"
            ),
          };
          break;
        case "permission":
          return {
            ...tab,
            canView: hasPermissionWorklog(
              tab.id.toLowerCase(),
              "view",
              "settings"
            ),
          };
          break;
        case "organization":
          return {
            ...tab,
            canView: hasPermissionWorklog(
              tab.id.toLowerCase(),
              "view",
              "settings"
            ),
          };
          break;
        default:
          return { ...tab };
          break;
      }
    });

    setTabs(updatedTabs);
    setVisibleTabs(updatedTabs.slice(0, 6));
    setDropdownTabs(updatedTabs.slice(6));
  };

  useEffect(() => {
    hasPermissionWorklog(tab, "save", "settings");
    for (let i = 0; i < initialTabs.length; i++) {
      if (hasPermissionWorklog(initialTabs[i].id, "view", "settings")) {
        setTab(initialTabs[i].id);
        setSelectedTabIndex(i);
        break;
      }
    }
  }, []);

  // fetching client data according to search values
  const handleClientSearch = async (searchValue: any) => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.post(
        `${process.env.pms_api_url}/client/GetAll`,
        {
          GlobalSearch: searchValue,
          SortColumn: null,
          IsDesc: false,
          PageNo: 1,
          PageSize: 50000,
        },
        {
          headers: {
            Authorization: `bearer ${token}`,
            org_token: `${Org_Token}`,
          },
        }
      );

      if (response.status === 200) {
        if (response.data.ResponseStatus === "Success") {
          setClientSearchData(response.data.ResponseData.List);
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
          Toast.error("Login failed. Please try again.");
        } else {
          Toast.error(data);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (clientSearchValue.length >= 3) {
      handleClientSearch(clientSearchValue);
    } else {
      handleClientSearch("");
    }
  }, [clientSearchValue]);

  // fetching Project data according to search values
  const handleProjectSearch = async (searchValue: any) => {
    const token = await localStorage.getItem("token");
    const org_Token = await localStorage.getItem("Org_Token");

    try {
      const response = await axios.post(
        `${process.env.pms_api_url}/project/getall`,
        {
          GlobalSearch: searchValue,
          PageNo: 1,
          PageSize: 50000,
          ClientId: null,
          ProjectId: null,
          IsActive: null,
          SortColumn: null,
          IsDesc: true,
        },
        {
          headers: {
            Authorization: `bearer ${token}`,
            org_Token,
          },
        }
      );

      if (response.status === 200) {
        if (response.data.ResponseStatus === "Success") {
          setProjectSearchData(response.data.ResponseData.List);
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

  useEffect(() => {
    if (projectSearchValue.length >= 3) {
      handleProjectSearch(projectSearchValue);
    } else {
      handleProjectSearch("");
    }
  }, [projectSearchValue]);

  // fetching User data according to search values
  const handleUserSearch = async (searchValue: any) => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.post(
        `${process.env.api_url}/user/getall`,
        {
          GlobalSearch: searchValue,
          PageNo: 1,
          PageSize: 50000,
          RoleId: null,
          DepartmentId: null,
          Status: null,
          IsClientUser: null,
          SortColumn: null,
          IsDesc: true,
        },
        {
          headers: {
            Authorization: `bearer ${token}`,
            org_token: `${Org_Token}`,
          },
        }
      );

      if (response.status === 200) {
        if (response.data.ResponseStatus === "Success") {
          setUserSearchData(response.data.ResponseData.List);
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

  useEffect(() => {
    if (userSearchValue.length >= 3) {
      handleUserSearch(userSearchValue);
    } else {
      handleUserSearch("");
    }
  }, [userSearchValue]);

  // fetching Process data according to search values
  const handleProcessSearch = async (searchValue: any) => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const prams = {
        GlobalFilter: searchValue,
        PageNo: 1,
        PageSize: 50000,
        SortColumn: "",
        IsDesc: 0,
        IsBillable: null,
        IsProductive: null,
      };
      const response = await axios.post(
        `${process.env.pms_api_url}/process/GetAll`,
        prams,
        {
          headers: {
            Authorization: `bearer ${token}`,
            org_token: Org_Token,
          },
        }
      );

      if (response.status === 200) {
        if (response.data.ResponseStatus === "Success") {
          setProcessSearchData(response.data.ResponseData.List);
        } else {
          const data = response.data.Message;
          if (data === null) {
            Toast.error("Error", "Please try again later.");
          } else {
            Toast.error("Error", data);
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (processSearchValue.length >= 3) {
      handleProcessSearch(processSearchValue);
    } else {
      handleProcessSearch("");
    }
  }, [processSearchValue]);

  // fetching Group data according to search values
  const handleGroupSearch = async (searchValue: any) => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const prams = {
        UserId: 0,
        GlobalSearch: searchValue,
        SortColumn: null,
        IsDesc: true,
        PageNo: 1,
        PageSize: 50000,
        Status: true,
      };
      const response = await axios.post(
        `${process.env.pms_api_url}/group/getall`,
        prams,
        {
          headers: {
            Authorization: `bearer ${token}`,
            org_token: Org_Token,
          },
        }
      );

      if (response.status === 200) {
        if (response.data.ResponseStatus === "Success") {
          setGroupSearchData(response.data.ResponseData.List);
        } else {
          const data = response.data.Message;
          if (data === null) {
            Toast.error("Error", "Please try again later.");
          } else {
            Toast.error("Error", data);
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (groupSearchValue.length >= 3) {
      handleGroupSearch(groupSearchValue);
    } else {
      handleGroupSearch("");
    }
  }, [groupSearchValue]);

  // fetching Status data according to search values
  const handleStatusSearch = async (searchValue: any) => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const headers = {
        Authorization: `${token}`,
        org_token: Org_Token,
      };
      const param = {
        pageNo: 1,
        pageSize: 50000,
        SortColumn: "",
        IsDec: true,
        globalFilter: searchValue,
        IsDefault: null,
        Type: "",
        Export: false,
      };
      const response = await axios.post(
        `${process.env.pms_api_url}/status/GetAll`,
        param,
        { headers: headers }
      );
      if (response.status === 200) {
        setStatusSearchData(response.data.ResponseData.List);
      } else {
        const data = response.data.Message;
        if (data === null) {
          Toast.error("Error", "Please try again later.");
        } else {
          Toast.error("Error", data);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (statusSearchValue.length >= 3) {
      handleStatusSearch(statusSearchValue);
    } else {
      handleStatusSearch("");
    }
  }, [statusSearchValue]);

  // fetching Organization data according to search values
  const handleOrganizationSearch = async (searchValue: any) => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `bearer ${token}`,
        org_token: Org_Token,
      };
      const param = {
        GlobalSearch: searchValue,
        SortColumn: null,
        IsDesc: true,
      };
      const response = await axios.post(
        `${process.env.pms_api_url}/organization/getall`,
        param,
        { headers: headers }
      );
      if (response.status === 200) {
        if (response.data.ResponseStatus === "Success") {
          setOrgSearchData(response.data.ResponseData);
        } else {
          const data = response.data.Message;
          if (data === null) {
            Toast.error("Please try again later.");
          } else {
            Toast.error(data);
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (orgSearchValue.length >= 3) {
      handleOrganizationSearch(orgSearchValue);
    } else {
      handleOrganizationSearch("");
    }
  }, [orgSearchValue]);

  return (
    <Wrapper>
      <Navbar
        onUserDetailsFetch={handleUserDetailsFetch}
        onHandleModuleNames={handleModuleNames}
      />
      <div>
        <div className="bg-whiteSmoke flex justify-between items-center">
          <div className="flex items-center py-[6.5px]">
            {visibleTabs.map((tab, index) => (
              <label
                key={tab.id}
                onClick={() => handleTabClick(tab.id, index)}
                className={`border-r border-r-lightSilver px-[10px] text-[14px] cursor-pointer select-none ${
                  selectedTabIndex === index
                    ? "text-[#0592C6] text-[16px] font-[600]"
                    : "text-slatyGrey"
                } ${tab.canView ? "" : "opacity-50 pointer-events-none"}`}
              >
                {tab.label}
              </label>
            ))}
            <div ref={selectRef}>
              <span onClick={handleToggleOpen} className="cursor-pointer">
                <DotsIcon />
              </span>
              <div>
                <ul
                  className={`absolute w-[215px] py-2 z-10 bg-pureWhite overflow-y-auto transition-transform drop-shadow-lg 
                    ${
                      open
                        ? "max-h-full transition-opacity opacity-100 duration-500 ease-out"
                        : "max-h-0 transition-opacity opacity-0 duration-500"
                    }`}
                >
                  {dropdownTabs.map((tab, index) => (
                    <li
                      key={tab.id}
                      onClick={() => handleTabClick(tab.id, index)}
                      className={`p-2 hover:bg-whiteSmoke font-normal flex cursor-pointer ${
                        tab.canView ? "" : "opacity-50 pointer-events-none"
                      }`}
                    >
                      <label className="cursor-pointer">{tab.label}</label>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div
            className={`flex items-center px-[10px] ${
              tab === "Permissions" ? "gap-[5px]" : "gap-[10px]"
            }`}
          >
            {tab !== "Permission" ? (
              <>
                {tab === "Client" && (
                  <div className="flex items-center relative">
                    <Text
                      placeholder="Search"
                      className="!bg-transparent p-1 pr-5"
                      value={clientSearchValue}
                      getValue={(e) => setClientSearchValue(e)}
                      getError={() => {}}
                    />
                    <span className="absolute right-1 py-1 pl-1">
                      <SearchIcon />
                    </span>
                  </div>
                )}

                {tab === "Project" && (
                  <div className="flex items-center relative">
                    <Text
                      placeholder="Search"
                      className="!bg-transparent p-1 pr-5"
                      value={projectSearchValue}
                      getValue={(e) => setProjectSearchValue(e)}
                      getError={() => {}}
                    />
                    <span className="absolute right-1 py-1 pl-1">
                      <SearchIcon />
                    </span>
                  </div>
                )}

                {tab === "User" && (
                  <div className="flex items-center relative">
                    <Text
                      placeholder="Search"
                      className="!bg-transparent p-1 pr-5"
                      value={userSearchValue}
                      getValue={(e) => setUserSearchValue(e)}
                      getError={() => {}}
                    />
                    <span className="absolute right-1 py-1 pl-1">
                      <SearchIcon />
                    </span>
                  </div>
                )}

                {tab === "Process" && (
                  <div className="flex items-center relative">
                    <Text
                      placeholder="Search"
                      className="!bg-transparent p-1 pr-5"
                      value={processSearchValue}
                      getValue={(e) => setProcessSearchValue(e)}
                      getError={() => {}}
                    />
                    <span className="absolute right-1 py-1 pl-1">
                      <SearchIcon />
                    </span>
                  </div>
                )}

                {tab === "Group" && (
                  <div className="flex items-center relative">
                    <Text
                      placeholder="Search"
                      className="!bg-transparent p-1 pr-5"
                      value={groupSearchValue}
                      getValue={(e) => setGroupSearchValue(e)}
                      getError={() => {}}
                    />
                    <span className="absolute right-1 py-1 pl-1">
                      <SearchIcon />
                    </span>
                  </div>
                )}

                {tab === "Status" && (
                  <div className="flex items-center relative">
                    <Text
                      placeholder="Search"
                      className="!bg-transparent p-1 pr-5"
                      value={statusSearchValue}
                      getValue={(e) => setStatusSearchValue(e)}
                      getError={() => {}}
                    />
                    <span className="absolute right-1 py-1 pl-1">
                      <SearchIcon />
                    </span>
                  </div>
                )}

                {tab === "Organization" && (
                  <div className="flex items-center relative">
                    <Text
                      placeholder="Search"
                      className="!bg-transparent p-1 pr-5"
                      value={orgSearchValue}
                      getValue={(e) => setOrgSearchValue(e)}
                      getError={() => {}}
                    />
                    <span className="absolute right-1 py-1 pl-1">
                      <SearchIcon />
                    </span>
                  </div>
                )}

                <div
                  className={`${
                    hasPermissionWorklog(tab, "import", "settings")
                      ? ""
                      : "opacity-50 pointer-events-none"
                  }`}
                >
                  <Tooltip position={"top"} content="Import">
                    <ImportIcon />
                  </Tooltip>
                </div>
                <div
                  className={`${
                    hasPermissionWorklog(tab, "export", "settings")
                      ? ""
                      : "opacity-50 pointer-events-none"
                  }`}
                >
                  <Tooltip position={"top"} content="Export">
                    <ExportIcon />
                  </Tooltip>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center gap-3 mr-4">
                <Select
                  id="permissionName"
                  placeholder="Select Permission"
                  className="!w-[200px]"
                  defaultValue={permissionValue === 0 ? "" : permissionValue}
                  getValue={(value) => {
                    setPermissionValue(value);
                  }}
                  getError={(e) => {
                    console.error(e);
                  }}
                  options={permissionDropdownData}
                  addDynamicForm_Icons_Edit={
                    hasPermissionWorklog("permission", "save", "settings")
                      ? true
                      : false
                  }
                  addDynamicForm_Icons_Delete={
                    hasPermissionWorklog("permission", "delete", "settings")
                      ? true
                      : false
                  }
                  addDynamicForm_Label="Project Name"
                  addDynamicForm_Placeholder="Project Name"
                  onChangeText={(value, label) => {
                    setTextValue(value);
                    setTextName(label);
                  }}
                  onClickButton={handleFormButtonClick}
                  onDeleteButton={(e) => handleProjectDelete(e)}
                />
                <div className="w-[60px]">
                  <Button
                    variant="btn-secondary"
                    className={`rounded-md ${
                      permissionValue === 0 ||
                      !hasPermissionWorklog(tab, "save", "settings")
                        ? "opacity-50 pointer-events-none"
                        : ""
                    }`}
                    disabled={
                      permissionValue === 0 ||
                      !hasPermissionWorklog(tab, "save", "settings")
                        ? true
                        : false
                    }
                    onClick={handleSavePermissionData}
                  >
                    Save
                  </Button>
                </div>
              </div>
            )}
            <Button
              type="submit"
              variant="btn-secondary"
              className={`${
                tab === "Permissions"
                  ? "rounded-[4px] !h-[45px] "
                  : "rounded-[4px] !h-[36px] text-sm"
              } ${
                isLoaded && hasPermissionWorklog(tab, "save", "settings")
                  ? ""
                  : "cursor-not-allowed"
              }`}
              onClick={
                hasPermissionWorklog(tab, "save", "settings")
                  ? handleDrawerOpen
                  : undefined
              }
            >
              <span
                className={`flex items-center justify-center ${
                  tab === "Permissions" ? "text-sm" : ""
                }`}
              >
                <span className="mr-2">
                  <AddPlusIcon />
                </span>
                <span>Create {tab === "Permission" ? "Role" : tab}</span>
              </span>
            </Button>
          </div>
        </div>

        {/*  Drawer */}
        <Drawer
          userData={userData}
          orgData={orgData}
          clientData={clientData}
          projectData={projectData}
          processData={processData}
          onEdit={hasEditId}
          groupData={groupData}
          statusData={statusData}
          onOpen={openDrawer}
          tab={tab}
          onClose={handleDrawerClose}
          onDataFetch={getDataFunction}
          onUserDataFetch={getUserDataFunction}
          onRefresh={handleRefresh}
          getPermissionDropdown={getPermissionDropdown}
          getOrgDetailsFunction={getOrgDetailsFunction}
        />

        {/* Drawer Overlay */}
        <DrawerOverlay isOpen={openDrawer} onClose={handleDrawerClose} />

        {tab === "Client" && (
          <Client
            onOpen={
              hasPermissionWorklog(tab, "save", "settings")
                ? handleDrawerOpen
                : undefined
            }
            onEdit={handleEdit}
            onHandleClientData={handleClientData}
            onDataFetch={handleDataFetch}
            getOrgDetailsFunction={getOrgDetailsFunction}
            canView={hasPermissionWorklog("client", "view", "settings")}
            canEdit={hasPermissionWorklog("client", "save", "settings")}
            canDelete={hasPermissionWorklog("client", "delete", "settings")}
            canProcess={hasPermissionWorklog("client", "save", "settings")}
            onSearchClientData={clientSearchData}
          />
        )}
        {tab === "Project" && (
          <Project
            onOpen={
              hasPermissionWorklog(tab, "save", "settings")
                ? handleDrawerOpen
                : undefined
            }
            onEdit={handleEdit}
            onDataFetch={handleDataFetch}
            onHandleProjectData={handleProjectData}
            getOrgDetailsFunction={getOrgDetailsFunction}
            canView={hasPermissionWorklog("project", "view", "settings")}
            canEdit={hasPermissionWorklog("project", "save", "settings")}
            canDelete={hasPermissionWorklog("project", "delete", "settings")}
            onSearchProjectData={projectSearchData}
          />
        )}
        {tab === "User" && (
          <User
            onOpen={
              hasPermissionWorklog(tab, "save", "settings")
                ? handleDrawerOpen
                : undefined
            }
            onEdit={handleEdit}
            onHandleUserData={handleUserData}
            onUserDataFetch={handleUserDataFetch}
            getOrgDetailsFunction={getOrgDetailsFunction}
            canView={hasPermissionWorklog("user", "view", "settings")}
            canEdit={hasPermissionWorklog("user", "save", "settings")}
            canDelete={hasPermissionWorklog("user", "delete", "settings")}
            onSearchUserData={userSearchData}
          />
        )}
        {tab === "Group" && (
          <Group
            onOpen={
              hasPermissionWorklog(tab, "save", "settings")
                ? handleDrawerOpen
                : undefined
            }
            onEdit={handleEdit}
            onDataFetch={handleDataFetch}
            onHandleGroupData={handleGroupData}
            getOrgDetailsFunction={getOrgDetailsFunction}
            canView={hasPermissionWorklog("group", "view", "settings")}
            canEdit={hasPermissionWorklog("group", "save", "settings")}
            canDelete={hasPermissionWorklog("group", "delete", "settings")}
            onSearchGroupData={groupSearchData}
          />
        )}
        {tab === "Process" && (
          <Process
            onOpen={
              hasPermissionWorklog(tab, "save", "settings")
                ? handleDrawerOpen
                : undefined
            }
            onEdit={handleEdit}
            onDataFetch={handleDataFetch}
            onHandleProcessData={handleProcessData}
            getOrgDetailsFunction={getOrgDetailsFunction}
            canView={hasPermissionWorklog("process", "view", "settings")}
            canEdit={hasPermissionWorklog("process", "save", "settings")}
            canDelete={hasPermissionWorklog("process", "delete", "settings")}
            onSearchProcessData={processSearchData}
          />
        )}
        {tab === "Status" && (
          <Status
            onOpen={
              hasPermissionWorklog(tab, "save", "settings")
                ? handleDrawerOpen
                : undefined
            }
            onEdit={handleEdit}
            onDataFetch={handleDataFetch}
            onHandleStatusData={handleStatusData}
            getOrgDetailsFunction={getOrgDetailsFunction}
            canView={hasPermissionWorklog("status", "view", "settings")}
            canEdit={hasPermissionWorklog("status", "save", "settings")}
            canDelete={hasPermissionWorklog("status", "delete", "settings")}
            onSearchStatusData={statusSearchData}
          />
        )}
        {tab === "Permission" && (
          <Permissions
            onOpen={
              hasPermissionWorklog(tab, "save", "settings")
                ? handleDrawerOpen
                : undefined
            }
            onEdit={handleEdit}
            expanded={isPermissionExpanded}
            permissionValue={permissionValue}
            sendDataToParent={(data: any) => setUpdatedPermissionsData(data)}
            getOrgDetailsFunction={getOrgDetailsFunction}
            canView={hasPermissionWorklog("permission", "view", "settings")}
            canEdit={hasPermissionWorklog("permission", "save", "settings")}
            canDelete={hasPermissionWorklog("permission", "delete", "settings")}
          />
        )}
        {tab === "Organization" && (
          <Organization
            onOpen={
              hasPermissionWorklog(tab, "save", "settings")
                ? handleDrawerOpen
                : undefined
            }
            onEdit={handleEdit}
            onHandleOrgData={handleOrgData}
            onDataFetch={handleDataFetch}
            getOrgDetailsFunction={getOrgDetailsFunction}
            canView={hasPermissionWorklog("organization", "view", "settings")}
            onSearchOrgData={orgSearchData}
          />
        )}
      </div>
    </Wrapper>
  );
};

export default page;