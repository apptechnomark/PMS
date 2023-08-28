"use client";

import React, { useState, useEffect, useRef } from "react";
import { Table, Switch, Toast, DataTable } from "next-ts-lib";
import "next-ts-lib/dist/index.css";
import axios from "axios";
// Import Common Components
import ColumnFilterDropdown from "@/components/common/ColumnFilterDropdown";
import TableActionIcon from "@/assets/icons/TableActionIcon";
import DeleteModal from "@/components/common/DeleteModal";
import SwitchModal from "@/components/common/SwitchModal";
import { ACTION } from "next/dist/client/components/app-router-headers";

const Project = ({ onOpen, onEdit, onDataFetch }: any) => {
  const headers = [
    { header: "CLIENT NAME", accessor: "ClientName", sortable: true },
    { header: "PROJECT NAME", accessor: "ProjectName", sortable: true },
    { header: "SUB-PROJECT NAME", accessor: "SubProjectName", sortable: true },
    { header: "STATUS", accessor: "IsActive", sortable: false },
  ];

  // const defaultVisibleHeaders = headers.slice(0, 5);
  // const [visibleHeaders, setVisibleHeaders] = useState(defaultVisibleHeaders);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isOpenSwitchModal, setIsOpenSwitchModal] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const [switchId, setSwitchId] = useState(0);
  const [switchActive, setSwitchActive] = useState(false);
  const [data, setData] = useState([]);

  const handleHeaderToggle = (header: any) => {
    const headerObj = headers.find((h) => h.header === header);
    if (!headerObj) return;

    // if (visibleHeaders.some((h) => h.header === header)) {
    //   setVisibleHeaders(visibleHeaders.filter((h) => h.header !== header));
    // } else {
    //   setVisibleHeaders([...visibleHeaders, headerObj]);
    // }
  };

  const columns = [
    ...headers,
    {
      header:
        // <ColumnFilterDropdown
        //   headers={headers.map((h) => h.header)}
        //   visibleHeaders={visibleHeaders.map((h) => h.header)}
        //   handleHeaderToggle={handleHeaderToggle}
        // />
        "ACTIONS",
      accessor: "actions",
      sortable: false,
    },
  ];

  const handleActionValue = async (actionId: string, id: any) => {
    setSelectedRowId(id);
    if (actionId.toLowerCase() === "edit") {
      onEdit(id);
    }
    if (actionId.toLowerCase() === "delete") {
      setIsDeleteOpen(true);
    }
  };

  const handleOutsideClick = async () => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.post(
        `${process.env.pms_api_url}/project/activeinactive`,
        {
          ProjectId: switchId,
          IsActive: !switchActive,
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
          setIsOpenSwitchModal(false);
          Toast.success("Status Updated Successfully.");
          getData();
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

  const closeSwitchModal = async () => {
    await setIsOpenSwitchModal(false);
  };

  const SwitchData = ({ id, IsActive }: any) => {
    const activeUser = async () => {
      await setIsOpenSwitchModal(true);
      await setSwitchId(id);
      await setSwitchActive(IsActive);
    };
    return (
      <div onClick={activeUser}>
        <Switch checked={IsActive} />
      </div>
    );
  };

  const Actions = ({ actions, id }: any) => {
    const actionsRef = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(false);
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        actionsRef.current &&
        !actionsRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    useEffect(() => {
      window.addEventListener("click", handleOutsideClick);
      return () => {
        window.removeEventListener("click", handleOutsideClick);
      };
    }, []);
    return (
      <div
        ref={actionsRef}
        className="w-5 h-5 cursor-pointer relative"
        onClick={() => setOpen(!open)}
      >
        <TableActionIcon />
        {open && (
          <React.Fragment>
            <div className="relative z-10 flex justify-center items-center">
              <div className="absolute top-1 right-0 py-2 border border-lightSilver rounded-md bg-pureWhite shadow-lg ">
                <ul className="w-40">
                  {actions.map((action: any, index: any) => (
                    <li
                      key={index}
                      onClick={() => {
                        handleActionValue(action, id);
                      }}
                      className="flex w-full h-9 px-3 hover:bg-lightGray !cursor-pointer"
                    >
                      <div className="flex justify-center items-center ml-2 cursor-pointer">
                        <label className="inline-block text-xs cursor-pointer">
                          {action}
                        </label>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </React.Fragment>
        )}
      </div>
    );
  };

  let tableData: any[] = data.map(
    (i: any) =>
      new Object({
        ...i,
        IsActive: (
          <SwitchData
            id={i.SubProjectId === null ? i.ProjectId : i.SubProjectId}
            IsActive={i.IsActive}
          />
        ),
        // IsActive: <Switch checked={i.IsActive} />,
        actions: (
          <Actions
            actions={["Edit", "Delete"]}
            id={i.SubProjectId === null ? i.ProjectId : i.SubProjectId}
          />
        ),
      })
  );

  const getData = async () => {
    const token = await localStorage.getItem("token");
    const org_Token = await localStorage.getItem("Org_Token");

    try {
      const response = await axios.post(
        `${process.env.pms_api_url}/project/getall`,
        {
          GlobalSearch: null,
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
          setData(response.data.ResponseData.List);
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
    getData();

    const fetchData = async () => {
      const fetchedData = await getData();
      onDataFetch(() => fetchData());
    };

    fetchData();
  }, []);

  const closeModal = () => {
    setIsDeleteOpen(false);
  };

  // For deleting row
  const handleDeleteRow = async () => {
    if (selectedRowId) {
      const token = await localStorage.getItem("token");
      const org_Token = await localStorage.getItem("Org_Token");

      try {
        const response = await axios.post(
          `${process.env.pms_api_url}/Project/Delete`,
          {
            ProjectId: selectedRowId,
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
            Toast.success("Project has been deleted successfully!");
            getData();
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
      setIsDeleteOpen(false);
    }
  };

  return (
    <div
      className={`${tableData.length === 0 ? "!h-full" : "!h-[440px] !w-full"}`}
    >
      {data.length > 0 && (
        <DataTable columns={columns} data={tableData} sticky />
      )}

      {tableData.length === 0 && (
        <p className="flex justify-center items-center py-[17px] text-[14px]">
          Currently there is no record, you may
          <a
            onClick={onOpen}
            className=" text-primary underline cursor-pointer ml-1 mr-1"
          >
            Create Project
          </a>
          to continue
        </p>
      )}

      {/* Delete Modal */}
      {isDeleteOpen && (
        <DeleteModal
          isOpen={isDeleteOpen}
          onClose={closeModal}
          title="Delete Project"
          actionText="Yes"
          onActionClick={handleDeleteRow}
        >
          <p>
            Are you sure you want to delete Project?
            <br /> If you delete the project, you will permanently lose project
            and project related data.
          </p>
        </DeleteModal>
      )}

      {isOpenSwitchModal && (
        <SwitchModal
          isOpen={isOpenSwitchModal}
          onClose={closeSwitchModal}
          title={`${switchActive === false ? "Active" : "InActive"} Project`}
          actionText="Yes"
          onActionClick={handleOutsideClick}
        >
          Are you sure you want to&nbsp;
          {switchActive === false ? "Active" : "InActive"} Project?
        </SwitchModal>
      )}
    </div>
  );
};

export default Project;
