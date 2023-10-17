/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import React, { useEffect, useState } from "react";

import Datatable from "@/components/approvals/Datatable";
import Navbar from "@/components/common/Navbar";
import Wrapper from "@/components/common/Wrapper";
// Icons
import ExportIcon from "@/assets/icons/ExportIcon";
import FilterIcon from "@/assets/icons/FilterIcon";
import ImportIcon from "@/assets/icons/ImportIcon";
// Material Import
import {
  Popover,
  TextField,
  Tooltip,
  TooltipProps,
  tooltipClasses,
  styled,
} from "@mui/material";
import PopupState, { bindPopover, bindTrigger } from "material-ui-popup-state";
import { Delete, Edit, Search } from "@mui/icons-material";
import EditDialog from "@/components/approvals/EditDialog";
import Drawer from "@/components/approvals/Drawer";
import { ToastContainer } from "react-toastify";
// import SearchIcon from "@/assets/icons/SearchIcon";
import { useRouter } from "next/navigation";
import { hasPermissionWorklog } from "@/utils/commonFunction";

const page = () => {
  const router = useRouter();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [hasEditId, setHasEditId] = useState("");
  const [iconIndex, setIconIndex] = useState<number>(0);
  const [hasId, setHasId] = useState("");
  const [getOrgDetailsFunction, setGetOrgDetailsFunction] = useState<
    (() => void) | null
  >(null);
  const [isEditOpen, setisEditOpen] = useState<boolean>(false);
  const [isFilterOpen, setisFilterOpen] = useState<boolean>(false);
  const [savedFilters, setSavedFilters] = useState<any>([]);
  const [dataFunction, setDataFunction] = useState<(() => void) | null>(null);

  useEffect(() => {
    if (
      !hasPermissionWorklog("", "View", "Approvals") &&
      !localStorage.getItem("isClient")
    ) {
      router.push("/settings");
    }
  }, [router]);

  const ColorToolTip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
      color: "#0281B9",
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: "#0281B9",
    },
  }));

  const handleUserDetailsFetch = (getData: () => void) => {
    setGetOrgDetailsFunction(() => getData);
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
  const handleEdit = (rowId: any, Id: any, iconIndex?: number) => {
    setIconIndex(iconIndex !== undefined ? iconIndex : 0);
    setHasEditId(rowId);
    setOpenDrawer(true);
    setHasId(Id);
  };

  // For refreshing data in Datatable from drawer
  const handleDataFetch = (getData: () => void) => {
    setDataFunction(() => getData);
  };

  // For Closing Filter Modal
  // const closeFilterModal = () => {
  //   setisFilterOpen(false);
  // };

  return (
    <Wrapper>
      <div>
        <Navbar onUserDetailsFetch={handleUserDetailsFetch} />
        <div className="bg-white flex justify-between items-center px-[20px]">
          <div className="flex gap-[10px] items-center py-[6.5px]">
            <label className="px-[20px] py-[11px] font-bold text-[16px] cursor-pointer select-none text-slatyGrey">
              REVIEW
            </label>
          </div>
          <div className="flex gap-[20px] items-center">
            <ColorToolTip title="Filter" placement="top" arrow>
              {savedFilters.length > 0 ? (
                <PopupState variant="popover" popupId="action-button">
                  {(popupState) => (
                    <div>
                      <span
                        {...bindTrigger(popupState)}
                        className="cursor-pointer"
                      >
                        <FilterIcon />
                      </span>
                      <Popover
                        {...bindPopover(popupState)}
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "right",
                        }}
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "right",
                        }}
                      >
                        <div className="flex flex-col py-2 w-[200px]">
                          <span
                            className="p-2 cursor-pointer hover:bg-lightGray"
                            onClick={() => {
                              popupState.close();
                              setisFilterOpen(true);
                            }}
                          >
                            Default Filter
                          </span>
                          <hr className="text-lightSilver mt-2" />
                          <span className="py-3 px-2 relative">
                            <TextField
                              variant="standard"
                              placeholder="Search Saved Filters"
                            />
                            <Search className="absolute top-4 right-2 text-slatyGrey" />
                          </span>
                          <div className="group p-2 cursor-pointer hover:bg-lightGray flex justify-between">
                            <span
                              onClick={() => {
                                popupState.close();
                                setisFilterOpen(true);
                              }}
                            >
                              Test Filter
                            </span>
                            <span className="flex gap-[10px] pr-[10px]">
                              <span onClick={() => console.log("edit")}>
                                <Edit className="hidden group-hover:inline-block w-5 h-5 ml-2 text-slatyGrey fill-current" />
                              </span>
                              <span onClick={() => console.log("Delete")}>
                                <Delete className="hidden group-hover:inline-block w-5 h-5 ml-2 text-slatyGrey fill-current" />
                              </span>
                            </span>
                          </div>
                        </div>
                      </Popover>
                    </div>
                  )}
                </PopupState>
              ) : (
                <span
                  className="cursor-pointer"
                  onClick={() => setisEditOpen(true)}
                >
                  <FilterIcon />
                </span>
              )}
            </ColorToolTip>
            <ColorToolTip title="Import" placement="top" arrow>
              <span className="cursor-pointer">
                <ImportIcon />
              </span>
            </ColorToolTip>
            <ColorToolTip title="Export" placement="top" arrow>
              <span className="cursor-pointer">
                <ExportIcon />
              </span>
            </ColorToolTip>
          </div>
        </div>
        <Datatable
          onDataFetch={handleDataFetch}
          onEdit={handleEdit}
          onDrawerOpen={handleDrawerOpen}
        />

        <Drawer
          onDataFetch={dataFunction}
          onOpen={openDrawer}
          onClose={handleDrawerClose}
          onEdit={hasEditId}
          hasIconIndex={iconIndex > 0 ? iconIndex : 0}
          onHasId={hasId}
        />

        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </Wrapper>
  );
};

export default page;
