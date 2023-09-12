"use client";

import React, { useEffect, useRef, useState } from "react";
import ColumnFilterDropdown from "@/components/common/ColumnFilterDropdown";
import axios from "axios";
import TableActionIcon from "@/assets/icons/TableActionIcon";
import { DataTable, Loader, Toast, Tooltip } from "next-ts-lib";
import "next-ts-lib/dist/index.css";
import DeleteModal from "@/components/common/DeleteModal";

function Process({
  onOpen,
  onEdit,
  onDataFetch,
  onHandleProcessData,
  getOrgDetailsFunction,
}: any) {
  const token = localStorage.getItem("token");
  const org_token = localStorage.getItem("Org_Token");

  const headers = [
    { header: "PROCESS", accessor: "process", sortable: true },
    { header: "SUB-PROCESS", accessor: "sub_process", sortable: true },
    { header: "ACTIVITY", accessor: "activity", sortable: true },
    { header: "EST. TIME", accessor: "est_time", sortable: true },
    {
      header: "PRODUCTIVE/NON-PRODUCTIVE",
      accessor: "productive",
      sortable: true,
    },
    { header: "BILLABLE/NON-BILLABLE", accessor: "billable", sortable: true },
    { header: "ACTION", accessor: "actions", sortable: false },
  ];
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedData = await getAll();
      onDataFetch(() => fetchData());
    };
    fetchData();

    getAll();
  }, []);

  // GetAll Data in api
  const getAll = async () => {
    try {
      const prams = {
        GlobalFilter: "",
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
            org_token: org_token,
          },
        }
      );

      if (response.status === 200) {
        if (response.data.ResponseStatus === "Success") {
          setLoader(false);
          setData(response.data.ResponseData.List);
          getOrgDetailsFunction();
        } else {
          setLoader(false);
          const data = response.data.Message;
          if (data === null) {
            Toast.error("Error", "Please try again later.");
          } else {
            Toast.error("Error", data);
          }
        }
      }
    } catch (error) {
      setLoader(false);
      console.error(error);
    }
  };

  const handleActionValue = async (actionId: string, id: any) => {
    setSelectedRowId(id);
    if (actionId.toLowerCase() === "edit") {
      onEdit(id);
    }
    if (actionId.toLowerCase() === "delete") {
      setIsDeleteOpen(true);
    }
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

  let tableData: any[] = data.map((i: any) => {
    const modifiedList = i.ActivityList.map((activity: any, index: any) =>
      index === 0 ? activity : ","
    );

    const firstActivity = modifiedList.length > 0 ? modifiedList[0] : "";

    const remainingCount = modifiedList.filter(
      (item: any) => item === ","
    ).length;
    const totalSeconds = i.EstimatedHour;
    const hours = Math.floor(totalSeconds / 3600);
    const remainingSeconds = totalSeconds % 3600;
    const minutes = Math.floor(remainingSeconds / 60);
    const remainingSecondsFinal = remainingSeconds % 60;

    const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${remainingSecondsFinal.toString().padStart(2, "0")}`;

    return {
      ...i,
      process: i.ParentProcessName,
      sub_process: i.ChildProcessName,
      activity: `${firstActivity}${remainingCount > 0 ? `, +${remainingCount}` : ""
        }`,
      est_time: formattedTime,
      productive: i.IsProductive ? "Productive" : "Non-Productive",
      billable: i.IsBillable ? "Billable" : "Non-Billable",
      actions: <Actions actions={["Edit", "Delete"]} id={i.ProcessId} />,
      details:
        modifiedList.length > 0 ? (
          <DataTable
            columns={[{ header: "", accessor: "column1", sortable: false }]}
            data={[
              {
                column1: (
                  <span className="text-[12px] text-darkCharcoal">
                    <span className="font-medium ml-7">Activity: </span>
                    {i.ActivityList.map((activity: any, index: number) =>
                      index === i.ActivityList.length - 1
                        ? activity
                        : activity + ", "
                    )}
                  </span>
                ),
              },
            ]}
            noHeader
          />
        ) : (
          ""
        ),
    };
  });

  // For Closing Modal
  const closeModal = () => {
    setIsDeleteOpen(false);
  };

  const handleDeleteRow = async () => {
    try {
      const response = await axios.post(
        `${process.env.pms_api_url}/process/Delete`,
        {
          ProcessId: selectedRowId,
        },
        {
          headers: {
            Authorization: `bearer ${token}`,
            org_token: org_token,
          },
        }
      );

      if (response.status === 200) {
        if (response.data.ResponseStatus === "Success") {
          Toast.success("Process has been deleted successfully!");
          getAll();
        } else {
          const data = response.data.Message;
          if (data === null) {
            Toast.error("Please try again later.");
          } else {
            Toast.error("Error", data);
          }
        }
      } else {
        const data = response.data.Message;
        if (data === null) {
          Toast.error("Please try again.");
        } else {
          Toast.error("Error", data);
        }
      }
    } catch (error) {
      console.error(error);
    }
    setIsDeleteOpen(false);
  };

  return (
    <>
      {loader ? (
        <div className="flex items-center justify-center min-h-screen">
          <Loader />
        </div>
      ) : (
        <div
          className={`${tableData.length === 0 ? "!h-full" : "!h-[81vh] !w-full"
            }`}
        >
          <DataTable columns={headers} data={tableData} sticky expandable />
          {data.length === 0 && (
            <p className="flex justify-center items-center py-[17px] text-[14px]">
              Currently there is no record, you may
              <a
                onClick={onOpen}
                className=" text-primary underline cursor-pointer ml-1 mr-1"
              >
                Create Process
              </a>
              to continue
            </p>
          )}

          {isDeleteOpen && (
            <DeleteModal
              isOpen={isDeleteOpen}
              onClose={closeModal}
              title="Delete Process"
              actionText="Yes"
              onActionClick={handleDeleteRow}
            >
              Are you sure you want to delete Process? <br /> If you delete
              Process, you will permanently lose Process and Process related
              data.
            </DeleteModal>
          )}
        </div>
      )}
    </>
  );
}

export default Process;
