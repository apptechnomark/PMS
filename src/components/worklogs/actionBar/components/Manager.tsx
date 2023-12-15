import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { InputBase, List, Popover } from "@mui/material";
import { ColorToolTip } from "@/utils/datatable/CommonStyle";
import { getManagerDropdownData } from "@/utils/commonDropdownApiCall";
import ManagerIcon from "@/assets/icons/worklogs/ManagerIcon";
import SearchIcon from "@/assets/icons/SearchIcon";

const Manager = ({ selectedRowIds, getWorkItemList }: any) => {
  const [managerSearchQuery, setManagerSearchQuery] = useState("");
  const [managerDropdownData, setManagerDropdownData] = useState([]);

  const [anchorElManager, setAnchorElManager] =
    React.useState<HTMLButtonElement | null>(null);

  const handleClickManager = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElManager(event.currentTarget);
    getManagerData();
  };

  const handleCloseManager = () => {
    setAnchorElManager(null);
  };

  const openManager = Boolean(anchorElManager);
  const idManager = openManager ? "simple-popover" : undefined;

  const handleManagerSearchChange = (event: any) => {
    setManagerSearchQuery(event.target.value);
  };

  const filteredManager = managerDropdownData?.filter((manager: any) =>
    manager.label.toLowerCase().includes(managerSearchQuery.toLowerCase())
  );

  const handleOptionManager = (id: any) => {
    updateManager(selectedRowIds, id);
    handleCloseManager();
  };

  const getManagerData = async () => {
    setManagerDropdownData(await getManagerDropdownData());
  };

  // API for update Manager
  const updateManager = async (id: number[], manager: number) => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.post(
        `${process.env.worklog_api_url}/workitem/bulkupdateworkitemmanager`,
        {
          WorkitemIds: id,
          ManagerId: manager,
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
          toast.success("Manager has been updated successfully.");
          // handleClearSelection();
          getWorkItemList();
        } else {
          const data = response.data.Message;
          if (data === null) {
            toast.error("Something went wrong, Please try again later..");
          } else {
            toast.error(data);
          }
        }
      } else {
        const data = response.data.Message;
        if (data === null) {
          toast.error("Something went wrong, Please try again later..");
        } else {
          toast.error(data);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <ColorToolTip title="Manager" arrow>
        <span aria-describedby={idManager} onClick={handleClickManager}>
          <ManagerIcon />
        </span>
      </ColorToolTip>

      {/* Manager Popover */}
      <Popover
        id={idManager}
        open={openManager}
        anchorEl={anchorElManager}
        onClose={handleCloseManager}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <nav className="!w-52">
          <div className="mr-4 ml-4 mt-4">
            <div
              className="flex items-center h-10 rounded-md pl-2 flex-row"
              style={{
                border: "1px solid lightgray",
              }}
            >
              <span className="mr-2">
                <SearchIcon />
              </span>
              <span>
                <InputBase
                  placeholder="Search"
                  inputProps={{ "aria-label": "search" }}
                  value={managerSearchQuery}
                  onChange={handleManagerSearchChange}
                  style={{ fontSize: "13px" }}
                />
              </span>
            </div>
          </div>
          <List>
            {managerDropdownData.length === 0 ? (
              <span className="flex flex-col py-2 px-4  text-sm">
                No Data Available
              </span>
            ) : (
              filteredManager.map((manager: any) => {
                return (
                  <span
                    key={manager.value}
                    className="flex flex-col py-2 px-4 hover:bg-gray-100 text-sm"
                  >
                    <span
                      className="pt-1 pb-1 cursor-pointer flex flex-row items-center gap-2"
                      onClick={() => handleOptionManager(manager.value)}
                    >
                      <span className="pt-[0.8px]">{manager.label}</span>
                    </span>
                  </span>
                );
              })
            )}
          </List>
        </nav>
      </Popover>
    </div>
  );
};

export default Manager;