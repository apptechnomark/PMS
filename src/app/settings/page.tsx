/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import React, { useEffect, useRef, useState } from "react";
// Library Components
import { Button, Select, Toast, Tooltip } from "next-ts-lib";
import "next-ts-lib/dist/index.css";
// Icons
import DotsIcon from "@/assets/icons/DotsIcon";
import FilterIcon from "@/assets/icons/FilterIcon";
import ImportIcon from "@/assets/icons/ImportIcon";
import ExportIcon from "@/assets/icons/ExportIcon";
import AddPlusIcon from "@/assets/icons/AddPlusIcon";
import ManageAccountsIcon from "@/assets/icons/ManageAccountsIcon";
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
import { hasNoToken } from "@/utils/commonFunction";
import { useRouter } from "next/navigation";
import axios from "axios";

type Tabs = { id: string; label: string };

const initialTabs = [
  { id: "Client", label: "Client" },
  { id: "Project", label: "Project" },
  { id: "User", label: "User" },
  { id: "Process", label: "Process" },
  { id: "Group", label: "Group" },
  { id: "Status", label: "Status" },
  { id: "Permissions", label: "Permissions" },
  { id: "Organization", label: "Organization" },
];

function page() {
  const [tabs, setTabs] = useState<Tabs[]>(initialTabs);
  const router = useRouter();
  const [tab, setTab] = useState<string>("Client");
  const [selectedTabIndex, setSelectedTabIndex] = useState<number>(0);
  const [visibleTabs, setVisibleTabs] = useState(tabs.slice(0, 6));
  const [dropdownTabs, setDropdownTabs] = useState(tabs.slice(6));
  const selectRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
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
    // const clickedTab = tabs[index];
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
      // updatedDropdownTabs[clickedTabIndexInDropdown] = clickedTab;

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
    {
      tab === "Permissions" && getPermissionDropdown();
    }
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

  const [textName, setTextName] = useState("");
  const [textValue, setTextValue] = useState(null);

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
          return { ...tab, label: arg1 };
          break;
        case "project":
          return { ...tab, label: arg2 };
          break;
        case "process":
          return { ...tab, label: arg3 };
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
                className={`border-r border-r-lightSilver px-[10px] text-[14px] cursor-pointer select-none ${selectedTabIndex === index
                    ? "text-[#0592C6] text-[16px] font-[600]"
                    : "text-slatyGrey"
                  }`}
              >
                {tab.label}
              </label>
            ))}
            <div ref={selectRef} className="cursor-pointer">
              <span onClick={handleToggleOpen}>
                <DotsIcon />
              </span>
              <div>
                <ul
                  className={`absolute w-[215px] py-2 z-10 bg-pureWhite overflow-y-auto transition-transform drop-shadow-lg 
                    ${open
                      ? "max-h-full transition-opacity opacity-100 duration-500 ease-out"
                      : "max-h-0 transition-opacity opacity-0 duration-500"
                    }`}
                >
                  {dropdownTabs.map((tab, index) => (
                    <li
                      key={tab.id}
                      onClick={() =>
                        handleTabClick(
                          tab.id,
                          // visibleTabs.length +
                          index
                        )
                      }
                      className="p-2 hover:bg-whiteSmoke font-normal cursor-pointer flex"
                    >
                      <label className="cursor-pointer">{tab.label}</label>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div
            className={`flex items-center px-[10px] ${tab === "Permissions"
                ? "gap-[5px]"
                : tab === "Organization"
                  ? "gap-[10px]"
                  : "gap-[10px]"
              }`}
          >
            {tab !== "Permissions" ? (
              <>
                <Tooltip position={"top"} content="Filter">
                  <FilterIcon />
                </Tooltip>
                <Tooltip position={"top"} content="Import">
                  <ImportIcon />
                </Tooltip>
                <Tooltip position={"top"} content="Export">
                  <ExportIcon />
                </Tooltip>
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
                  getError={(e) => { }}
                  options={permissionDropdownData}
                  // addDynamicForm
                  addDynamicForm_Icons_Edit
                  addDynamicForm_Icons_Delete
                  addDynamicForm_Label="Project Name"
                  addDynamicForm_Placeholder="Project Name"
                  // addDynamicForm_ButtonLabelAdd="ADD"
                  // addDynamicForm_ButtonLabelEdit="Save"
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
                    className={`rounded-md ${permissionValue === 0 ? "opacity-50" : ""
                      }`}
                    disabled={permissionValue === 0 ? true : false}
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
              className={tab === "Permissions" ? "rounded-[4px] !h-[45px] " : "rounded-[4px] !h-[36px] text-sm"}
              onClick={handleDrawerOpen}
            >
              <span
                className={`flex items-center justify-center ${tab === "Permissions" ? "text-sm" : ""
                  }`}
              >
                <span className="mr-2">
                  <AddPlusIcon />
                </span>
                <span>Create {tab === "Permissions" ? "Role" : tab}</span>
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
            onOpen={handleDrawerOpen}
            onEdit={handleEdit}
            onHandleClientData={handleClientData}
            onDataFetch={handleDataFetch}
            getOrgDetailsFunction={getOrgDetailsFunction}
          />
        )}
        {tab === "Project" && (
          <Project
            onOpen={handleDrawerOpen}
            onEdit={handleEdit}
            onDataFetch={handleDataFetch}
            onHandleProjectData={handleProjectData}
            getOrgDetailsFunction={getOrgDetailsFunction}
          />
        )}
        {tab === "User" && (
          <User
            onOpen={handleDrawerOpen}
            onEdit={handleEdit}
            onHandleUserData={handleUserData}
            onUserDataFetch={handleUserDataFetch}
            getOrgDetailsFunction={getOrgDetailsFunction}
          />
        )}
        {tab === "Group" && (
          <Group
            onOpen={handleDrawerOpen}
            onEdit={handleEdit}
            onDataFetch={handleDataFetch}
            onHandleGroupData={handleGroupData}
            getOrgDetailsFunction={getOrgDetailsFunction}
          />
        )}
        {tab === "Process" && (
          <Process
            onOpen={handleDrawerOpen}
            onEdit={handleEdit}
            onDataFetch={handleDataFetch}
            onHandleProcessData={handleProcessData}
            getOrgDetailsFunction={getOrgDetailsFunction}
          />
        )}
        {tab === "Status" && (
          <Status
            onOpen={handleDrawerOpen}
            onEdit={handleEdit}
            onDataFetch={handleDataFetch}
            onHandleStatusData={handleStatusData}
            getOrgDetailsFunction={getOrgDetailsFunction}
          />
        )}
        {tab === "Permissions" && (
          <Permissions
            onOpen={handleDrawerOpen}
            onEdit={handleEdit}
            expanded={isPermissionExpanded}
            permissionValue={permissionValue}
            sendDataToParent={(data: any) => setUpdatedPermissionsData(data)}
            getOrgDetailsFunction={getOrgDetailsFunction}
          />
        )}
        {tab === "Organization" && (
          <Organization
            onOpen={handleDrawerOpen}
            onEdit={handleEdit}
            onHandleOrgData={handleOrgData}
            onDataFetch={handleDataFetch}
            getOrgDetailsFunction={getOrgDetailsFunction}
          />
        )}
      </div>
    </Wrapper>
  );
}

export default page;
