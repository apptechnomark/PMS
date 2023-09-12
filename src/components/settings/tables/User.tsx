/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Avatar,
  AvatarGroup,
  DataTable,
  Loader,
  Switch,
  Toast,
  Tooltip,
} from "next-ts-lib";
import "next-ts-lib/dist/index.css";
// Import Common Components
import ColumnFilterDropdown from "@/components/common/ColumnFilterDropdown";
import TableActionIcon from "@/assets/icons/TableActionIcon";
import DeleteModal from "@/components/common/DeleteModal";
import axios from "axios";
import SwitchModal from "@/components/common/SwitchModal";

const User = ({
  onOpen,
  onEdit,
  onHandleUserData,
  onUserDataFetch,
  getOrgDetailsFunction,
}: any) => {
  const headers = [
    { header: "USER NAME", accessor: "FullName", sortable: true },
    { header: "USER TYPE", accessor: "UserType", sortable: true },
    { header: "EMAIL", accessor: "Email", sortable: true },
    { header: "MOBILE NO", accessor: "ContactNo", sortable: true },
    { header: "DEPARTMENT", accessor: "DepartmentName", sortable: false },
    { header: "REPORTING MANAGER", accessor: "RMUserName", sortable: false },
    { header: "GROUP", accessor: "GroupNames", sortable: false },
    { header: "STATUS", accessor: "IsActive", sortable: false },
  ];

  const headersDropdown = [
    { header: "USER TYPE", accessor: "UserType", sortable: true },
    { header: "EMAIL", accessor: "Email", sortable: true },
    { header: "MOBILE NO", accessor: "ContactNo", sortable: true },
    { header: "DEPARTMENT", accessor: "DepartmentName", sortable: false },
    { header: "REPORTING MANAGER", accessor: "RMUserName", sortable: false },
    { header: "GROUP", accessor: "GroupNames", sortable: false },
    { header: "STATUS", accessor: "IsActive", sortable: false },
  ];

  const defaultVisibleHeaders = headers.slice(0, 5);
  const [visibleHeaders, setVisibleHeaders] = useState(defaultVisibleHeaders);
  const [open, setOpen] = useState<boolean>(false);
  const [loader, setLoader] = useState(true);

  const handleHeaderToggle = (header: any) => {
    const headerObj = headers.find((h) => h.header === header);
    if (!headerObj) return;

    if (visibleHeaders.some((h) => h.header === header)) {
      setVisibleHeaders(visibleHeaders.filter((h) => h.header !== header));
    } else {
      setVisibleHeaders([...visibleHeaders, headerObj]);
    }
  };

  const handleOpen = (arg1: boolean) => {
    setOpen(arg1);
  };

  const columns = [
    ...visibleHeaders,
    {
      header: (
        <Tooltip position="left" content="Select columns">
          <span className="pl-5">
            <ColumnFilterDropdown
              headers={headersDropdown.map((h) => h.header)}
              visibleHeaders={visibleHeaders.map((h) => h.header)}
              isOpen={open}
              setOpen={handleOpen}
              handleHeaderToggle={handleHeaderToggle}
            />
          </span>
        </Tooltip>
      ),
      accessor: "actions",
      sortable: false,
    },
  ];
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isOpenSwitchModal, setIsOpenSwitchModal] = useState(false);
  const [switchId, setSwitchId] = useState(0);
  const [switchActive, setSwitchActive] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const [data, setData] = useState<any>([]);

  const handleActionValue = async (actionId: string, id: any) => {
    setSelectedRowId(id);
    if (actionId.toLowerCase() === "edit") {
      onEdit(id);
    }
    if (actionId.toLowerCase() === "delete") {
      setIsDeleteOpen(true);
    }
  };

  const handleToggleUser = async () => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.post(
        `${process.env.api_url}/user/activeinactive`,
        {
          UserId: switchId,
          ActiveStatus: !switchActive,
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
                      onClick={() => handleActionValue(action, id)}
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
        FullName: (
          <div className="text-[#0592C6] font-semibold">{i.FullName}</div>
        ),
        GroupNames: (
          <div className="flex">
            <AvatarGroup show={3}>
              {i.GroupNames?.map((i: any, index: any) => (
                <Avatar key={index} name={i}></Avatar>
              ))}
            </AvatarGroup>
          </div>
        ),
        IsActive: <SwitchData id={i.UserId} IsActive={i.IsActive} />,
        actions: <Actions actions={["Edit", "Delete"]} id={i.UserId} />,
      })
  );

  const getData = async () => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.post(
        `${process.env.api_url}/user/getall`,
        {
          GlobalSearch: "",
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
          setLoader(false);
          setData(response.data.ResponseData.List);
          getOrgDetailsFunction();
        } else {
          const data = response.data.Message;
          if (data === null) {
            Toast.error("Please try again later.");
          } else {
            Toast.error(data);
          }
        }
      } else {
        setLoader(false);
        const data = response.data.Message;
        if (data === null) {
          Toast.error("Please try again.");
        } else {
          Toast.error(data);
        }
      }
    } catch (error) {
      setLoader(false);
      console.error(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // For Closing Modal
  const closeModal = () => {
    setIsDeleteOpen(false);
  };

  // For deleting row
  const handleDeleteRow = async () => {
    if (selectedRowId) {
      const token = await localStorage.getItem("token");
      const Org_Token = await localStorage.getItem("Org_Token");
      try {
        const response = await axios.post(
          `${process.env.api_url}/user/delete`,
          {
            UserId: selectedRowId,
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
            Toast.success("User has been deleted successfully!");
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
      setSelectedRowId(null);
      setIsDeleteOpen(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const fetchedData = await getData();
      onUserDataFetch(() => fetchData());
    };

    fetchData();
  }, []);

  return (
    <>
      {loader ? (
        <div className="flex items-center justify-center min-h-screen">
          <Loader />
        </div>
      ) : (
        <div
          className={`${
            tableData.length === 0 ? "!h-full" : "!h-[81vh] !w-full"
          }`}
        >
          {data.length > 0 && (
            <DataTable columns={columns} data={tableData} sticky />
          )}
          {tableData.length === 0 && (
            <>
              <p className="flex justify-center items-center py-[17px] md:text-xs text-[14px] border-b border-b-[#E6E6E6]">
                Currently there is no record, you may
                <a
                  onClick={onOpen}
                  className=" text-[#0592C6] underline cursor-pointer ml-1 mr-1"
                >
                  Create User
                </a>
                to continue
              </p>
            </>
          )}

          {/* Delete Modal */}
          {isDeleteOpen && (
            <DeleteModal
              isOpen={isDeleteOpen}
              onClose={closeModal}
              title="Delete User"
              actionText="Yes"
              onActionClick={handleDeleteRow}
            >
              Are you sure you want to delete User? <br /> If you delete User,
              you will permanently lose user and user related data.
            </DeleteModal>
          )}

          {isOpenSwitchModal && (
            <SwitchModal
              isOpen={isOpenSwitchModal}
              onClose={closeSwitchModal}
              title={`${switchActive === false ? "Active" : "InActive"} User`}
              actionText="Yes"
              onActionClick={handleToggleUser}
            >
              Are you sure you want to&nbsp;
              {switchActive === false ? "Active" : "InActive"} User?
            </SwitchModal>
          )}
        </div>
      )}
    </>
  );
};

export default User;
