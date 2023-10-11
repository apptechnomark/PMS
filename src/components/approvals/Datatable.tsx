import React, { useEffect, useState } from "react";

import MUIDataTable from "mui-datatables";
import { createTheme, styled, ThemeProvider } from "@mui/material/styles";
import {
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { hasPermissionWorklog } from "@/utils/commonFunction";
import TablePagination from "@mui/material/TablePagination";
import axios from "axios";
// icons imports
import PlayButton from "@/assets/icons/worklogs/PlayButton";
import Minus from "@/assets/icons/worklogs/Minus";
import EditIcon from "@/assets/icons/worklogs/EditIcon";
import AcceptIcon from "@/assets/icons/worklogs/AcceptIcon";
import AcceptNote from "@/assets/icons/worklogs/AcceptNote";
import ErrorLogs from "@/assets/icons/worklogs/ErrorLogs";
import RejectIcon from "@/assets/icons/worklogs/RejectIcon";
// Internal component Imports
import EditDialog from "./EditDialog";
import AcceptDiloag from "./AcceptDiloag";
import RejectDialog from "./RejectDialog";
import { toHoursAndMinutes } from "@/utils/timerFunctions";
import PlayPause from "@/assets/icons/worklogs/PlayPause";
import PauseButton from "@/assets/icons/worklogs/PauseButton";
import StopButton from "@/assets/icons/worklogs/StopButton";
import RestartButton from "@/assets/icons/worklogs/RestartButton";

const ColorToolTip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(() => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: "#0281B9",
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#0281B9",
  },
}));

const getMuiTheme = () =>
  createTheme({
    components: {
      MUIDataTableHeadCell: {
        styleOverrides: {
          root: {
            backgroundColor: "#F6F6F6",
            whiteSpace: "nowrap",
            fontWeight: "bold",
          },
        },
      },
      MUIDataTableBodyCell: {
        styleOverrides: {
          root: {
            overflowX: "auto",
            whiteSpace: "nowrap",
          },
        },
      },
    },
  });

const Datatable = ({ onDrawerOpen, onEdit, onDataFetch }: any) => {
  const [selectedRowsCount, setSelectedRowsCount] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isEditOpen, setisEditOpen] = useState<boolean>(false);
  const [isAcceptOpen, setisAcceptOpen] = useState<boolean>(false);
  const [isRejectOpen, setisRejectOpen] = useState<boolean>(false);
  const [selectedRowId, setSelectedRowId] = useState<any | number>(null);
  const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
  const [workitemId, setWorkitemId] = useState(0);
  const [id, setId] = useState(0);
  const [note, setNote] = useState<string>("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [tableDataCount, setTableDataCount] = useState(0);
  const [isRunning, setRunning] = useState<number>(-1);
  const [workitemTimeId, setWorkitemTimeId] = useState<number>(-1);
  const [submissionId, setSubmissionId] = useState<number>(-1);
  const [stopReviewTimer, setStopReviewTimer] = useState<boolean>(false);

  const [reviewList, setReviewList] = useState<any>([]);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRowSelect = (
    currentRowsSelected: any,
    allRowsSelected: any,
    rowsSelected: any
  ) => {
    const selectedData = allRowsSelected.map(
      (row: any) => reviewList[row.dataIndex]
    );

    setSelectedRowsCount(rowsSelected.length);
    setSelectedRows(rowsSelected);

    // adding selected Id
    const lastSelectedWorkItemId =
      selectedData.length > 0
        ? selectedData[selectedData.length - 1].WorkitemId
        : null;
    setSelectedRowId(lastSelectedWorkItemId);

    // adding selected workItem Id
    const workitem =
      selectedData.length > 0
        ? selectedData[selectedData.length - 1].WorkitemId
        : null;
    setWorkitemId(workitem);

    // adding selected workItem Id
    const Id =
      selectedData.length > 0
        ? selectedData[selectedData.length - 1].SubmissionId
        : null;
    setId(Id);

    // adding all selected Ids in an array
    const selectedWorkItemIds =
      selectedData.length > 0
        ? selectedData.map((selectedRow: any) => selectedRow.SubmissionId)
        : [];

    setSelectedRowIds(selectedWorkItemIds);

    if (allRowsSelected) {
      setIsPopupOpen(true);
    } else {
      setIsPopupOpen(false);
    }
  };

  const handleClearSelection = () => {
    setSelectedRowsCount(0);
    setSelectedRows([]);
    setIsPopupOpen(false);
  };

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === "Escape") {
        handleClearSelection();
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const settingSelectedId = () => {
    onEdit(workitemId, id);
    handleClearSelection();
  };

  // converting seconds into HH:MM:SS
  function formatTime(seconds: any) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  }

  const handleReviewTimer = async (
    state: number,
    workitemId: number,
    submissionId: number,
    workitemTimeId?: number
  ) => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");

    // if (state === 1 && isOnBreak !== 0) {
    //   onGetBreakData();
    //   onSetBreak();
    // }

    try {
      const response = await axios.post(
        `${process.env.worklog_api_url}/workitem/approval/saveworkitemreviewertimestamp`,
        {
          state: state,
          workitemId: workitemId,
          submissionId: submissionId,
          timeId: workitemTimeId && workitemTimeId > 0 ? workitemTimeId : 0,
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
          setWorkitemTimeId((prev) =>
            response.data.ResponseData !== prev
              ? response.data.ResponseData
              : -1
          );
          setRunning((prev) => (selectedRowId !== prev ? selectedRowId : -1));
          getReviewList();
        } else {
          const data = response.data.Message;
          if (data === null) {
            toast.error("Please try again later.");
          } else {
            toast.error(data);
          }
        }
      } else {
        const data = response.data.Message;
        if (data === null) {
          toast.error("Please try again later.");
        } else {
          toast.error(data);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleReviewSync = async (submissionId: number) => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");

    try {
      const response = await axios.post(
        `${process.env.worklog_api_url}/workitem/approval/getreviewerworkitemsync`,
        {
          submissionId: submissionId,
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
          setReviewList((prev: any) =>
            prev.map((data: any, index: number) => {
              if (data.SubmissionId === submissionId) {
                return new Object({
                  ...data,
                  Timer: response.data.ResponseData.SyncTime,
                });
              } else {
                return data;
              }
            })
          );
        } else {
          const data = response.data.Message;
          if (data === null) {
            toast.error("Please try again later.");
          } else {
            toast.error(data);
          }
        }
      } else {
        const data = response.data.Message;
        if (data === null) {
          toast.error("Please try again later.");
        } else {
          toast.error(data);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setRunning(
      reviewList.filter(
        (data: any) => data.TimelogId > 0 || data.TimelogId !== null
      ).length > 0
        ? reviewList.filter(
            (data: any) => data.TimelogId > 0 || data.TimelogId !== null
          )[0].WorkitemId
        : -1
    );
    setWorkitemTimeId(
      reviewList.filter(
        (data: any) => data.TimelogId > 0 || data.TimelogId !== null
      ).length > 0
        ? reviewList.filter(
            (data: any) => data.TimelogId > 0 || data.TimelogId !== null
          )[0].TimelogId
        : -1
    );
    setSubmissionId(
      reviewList.filter(
        (data: any) => data.TimelogId > 0 || data.TimelogId !== null
      ).length > 0
        ? reviewList.filter(
            (data: any) => data.TimelogId > 0 || data.TimelogId !== null
          )[0].SubmissionId
        : -1
    );
  }, [reviewList]);

  // Table columns
  const columns = [
    {
      name: "EmpolyeeName",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm uppercase">Employees</span>
        ),
      },
    },
    {
      name: "Role",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm uppercase">Designation</span>
        ),
      },
    },
    {
      name: "EstimateTime",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm uppercase">EST. Hours</span>
        ),
        // converting time (Seconnds) into HH:MM:SS
        customBodyRender: (value: any) => {
          return <div>{value ? formatTime(value) : "00:00:00"}</div>;
        },
      },
    },
    {
      name: "TotalTime",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm uppercase">total hrs</span>
        ),
        // converting time (Seconnds) into HH:MM:SS
        customBodyRender: (value: any) => {
          return <div>{value ? formatTime(value) : "00:00:00"}</div>;
        },
      },
    },

    // {
    //   name: "Timer",
    //   options: {
    //     filter: true,
    //     sort: true,
    //     customHeadLabelRender: () => (
    //       <span className="font-extrabold uppercase">Review Timer</span>
    //     ),
    //     customBodyRender: (value: any, tableMeta: any) => {
    //       const timerValue: any = "00:00:00";
    //       // value === 0 ? "00:00:00" : toHoursAndMinutes(value);
    //       return (
    //         <div className="flex items-center">
    //           <ColorToolTip title={`Estimated Time: min`} placement="top" arrow>
    //             {timerValue}
    //           </ColorToolTip>
    //           <ColorToolTip title="Start" placement="top" arrow>
    //             <span className="ml-2 cursor-pointer">
    //               <PlayButton />
    //             </span>
    //           </ColorToolTip>
    //         </div>
    //       );
    //     },
    //   },
    // },
    {
      name: "Timer",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-extrabold">REVIEW TIMER</span>
        ),
        customBodyRender: (value: any, tableMeta: any) => {
          const timerValue =
            value === 0 ? "00:00:00" : toHoursAndMinutes(value);

          return (
            <div className="w-40 h-7 flex items-center">
              <ColorToolTip
                title={`Estimated Time: ${toHoursAndMinutes(
                  tableMeta.rowData[3]
                )}`}
                placement="top"
                arrow
              >
                <span
                  className={`w-16 text-center text-ellipsis overflow-hidden ${
                    tableMeta.rowData[tableMeta.rowData.length - 2] === 3
                      ? "text-primary"
                      : ""
                  }`}
                >
                  {timerValue}
                </span>
              </ColorToolTip>
              {tableMeta.rowData[tableMeta.rowData.length - 2] !== 3 &&
                tableMeta.rowData[tableMeta.rowData.length - 1] !== isRunning &&
                (tableMeta.rowData[tableMeta.rowData.length - 2] === 0 ? (
                  <ColorToolTip title="Start" placement="top" arrow>
                    <span
                      className="cursor-pointer"
                      onClick={() =>
                        handleReviewTimer(
                          1,
                          tableMeta.rowData[tableMeta.rowData.length - 1],
                          tableMeta.rowData[tableMeta.rowData.length - 3],
                          0
                        )
                      }
                    >
                      <PlayButton />
                    </span>
                  </ColorToolTip>
                ) : (
                  tableMeta.rowData[tableMeta.rowData.length - 2] === 2 && (
                    <ColorToolTip title="Resume" placement="top" arrow>
                      <span
                        className="cursor-pointer"
                        onClick={() =>
                          handleReviewTimer(
                            1,
                            tableMeta.rowData[tableMeta.rowData.length - 1],
                            tableMeta.rowData[tableMeta.rowData.length - 3],
                            0
                          )
                        }
                      >
                        <PlayPause />
                      </span>
                    </ColorToolTip>
                  )
                ))}
              {(tableMeta.rowData[tableMeta.rowData.length - 2] === 1 ||
                tableMeta.rowData[tableMeta.rowData.length - 1] ===
                  isRunning) && (
                <div className="flex">
                  <ColorToolTip title="Pause" placement="top" arrow>
                    <span
                      className="cursor-pointer"
                      onClick={() => {
                        setRunning(
                          tableMeta.rowData[tableMeta.rowData.length - 1]
                        );
                        handleReviewTimer(
                          2,
                          tableMeta.rowData[tableMeta.rowData.length - 1],
                          tableMeta.rowData[tableMeta.rowData.length - 3],
                          workitemTimeId
                        );
                      }}
                    >
                      <PauseButton />
                    </span>
                  </ColorToolTip>
                  <ColorToolTip title="Stop" placement="top" arrow>
                    <span
                      className="cursor-pointer mt-[2px]"
                      onClick={() => setStopReviewTimer(true)}
                    >
                      <StopButton />
                    </span>
                  </ColorToolTip>
                  <ColorToolTip title="Sync" placement="top" arrow>
                    <span
                      className="cursor-pointer"
                      onClick={() =>
                        handleReviewSync(
                          tableMeta.rowData[tableMeta.rowData.length - 3]
                        )
                      }
                    >
                      <RestartButton />
                    </span>
                  </ColorToolTip>
                </div>
              )}
            </div>
          );
        },
      },
    },
    {
      name: "ClientName",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm uppercase">Client</span>
        ),
      },
    },
    {
      name: "ProjectName",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm uppercase">Project</span>
        ),
      },
    },
    {
      name: "ParentProcess",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm uppercase">Process</span>
        ),
        customBodyRender: (value: any) => {
          const shortProcessName = value.split(" ");
          return (
            <div className="font-semibold">
              <ColorToolTip title={value} placement="top">
                {shortProcessName[0]}
              </ColorToolTip>
            </div>
          );
        },
      },
    },
    {
      name: "SubProcess",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm uppercase">Sub Process</span>
        ),
      },
    },
    {
      name: "StartDate",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm uppercase">Start Date</span>
        ),
        customBodyRender: (value: any, tableMeta: any, updateValue: any) => {
          if (value === null || value === undefined || value === "") {
            return <div>-</div>;
          } else {
            const startDate = value?.split("T");
            return <div>{startDate[0]}</div>;
          }
        },
      },
    },
    {
      name: "EndDate",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm uppercase">End Date</span>
        ),
        customBodyRender: (value: any, tableMeta: any, updateValue: any) => {
          if (value === null || value === undefined || value === "") {
            return <div>-</div>; // Handle null/undefined value here
          } else {
            const endDate = value?.split("T");
            return <div>{endDate[0]}</div>;
          }
        },
      },
    },
    {
      name: "Quantity",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm uppercase">Qty.</span>
        ),
      },
    },
    {
      name: "EmployeeManualTime",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm uppercase">Edited Time</span>
        ),
        customBodyRender: (value: any, tableMeta: any, updateValue: any) => {
          return <div>{value ? formatTime(value) : "00:00:00"}</div>;
        },
      },
    },
    {
      name: "EmployeeIsManual",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm uppercase">Is Manual</span>
        ),
        customBodyRender: (value: any, tableMeta: any, updateValue: any) => {
          return <div>{value === true ? "Yes" : "No"}</div>;
        },
      },
    },

    {
      name: "ManagerName",
      options: {
        filter: true,
        sort: true,
        customHeadLabelRender: () => (
          <span className="font-bold text-sm uppercase">Manager</span>
        ),
        customBodyRender: (value: any) => {
          if (value === null || value === undefined || value === "") {
            return <div>-</div>;
          } else {
            return <div>{value}</div>;
          }
        },
      },
    },
    {
      name: "SubmissionId",
      options: {
        display: false,
      },
    },
    {
      name: "State",
      options: {
        display: false,
      },
    },
    {
      name: "WorkitemId",
      options: {
        display: false,
      },
    },
  ];

  // Review List API
  const getReviewList = async () => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.post(
        `${process.env.worklog_api_url}/workitem/approval/GetReviewList`,
        {
          pageNo: page + 1,
          pageSize: rowsPerPage,
          sortColumn: "",
          isDesc: true,
          globalSearch: "",
          userId: null,
          clientId: null,
          projectId: null,
          startDate: null,
          endDate: null,
          Status: 6,
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
          setReviewList(response.data.ResponseData.List);
          setTableDataCount(response.data.ResponseData.TotalCount);
        } else {
          const data = response.data.Message;
          if (data === null) {
            toast.error("Please try again later.");
          } else {
            toast.error(data);
          }
        }
      } else {
        // setLoader(false);
        const data = response.data.Message;
        if (data === null) {
          toast.error("Please try again later.");
        } else {
          toast.error(data);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Accept WorkItem or Accept with Note API
  const acceptWorkitem = async (note: string, id: number[]) => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.post(
        `${process.env.worklog_api_url}/workitem/approval/acceptworkitem`,
        {
          workitemSubmissionIds: id,
          comment: note ? note : null,
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
          toast.success("Selected tasks have been successfully approved.");
          handleClearSelection();
          getReviewList();
        } else {
          const data = response.data.Message;
          if (data === null) {
            toast.error("Please try again later.");
          } else {
            toast.error(data);
          }
        }
      } else {
        const data = response.data.Message;
        if (data === null) {
          toast.error("Please try again later.");
        } else {
          toast.error(data);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Accept WorkItem or Accept with Note API
  const rejectWorkitem = async (note: string, id: number[]) => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.post(
        `${process.env.worklog_api_url}/workitem/approval/rejectworkitem`,
        {
          workitemSubmissionIds: id,
          comment: note ? note : "",
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
          toast.success("Selected tasks have been successfully rejected.");
          handleClearSelection();
          getReviewList();
        } else {
          const data = response.data.Message;
          if (data === null) {
            toast.error("Please try again later.");
          } else {
            toast.error(data);
          }
        }
      } else {
        const data = response.data.Message;
        if (data === null) {
          toast.error("Please try again later.");
        } else {
          toast.error(data);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // refreshing data from Drawer side
    const fetchData = async () => {
      const fetchedData = await getReviewList();
      onDataFetch(() => fetchData());
    };
    fetchData();
    getReviewList();
  }, []);

  const options: any = {
    filterType: "checkbox",
    responsive: "standard",
    tableBodyHeight: "73vh",
    viewColumns: false,
    filter: false,
    print: false,
    download: false,
    search: false,
    selectToolbarPlacement: "none",
    pagination: false,
    draggableColumns: {
      enabled: true,
      transitionTime: 300,
    },
    textLabels: {
      body: {
        noMatch: (
          <div className="flex items-start">
            <span>Currently there is no records available.</span>
          </div>
        ),
        toolTip: "",
      },
    },
  };

  const closeModal = () => {
    setisEditOpen(false);
    setisAcceptOpen(false);
    setisRejectOpen(false);
  };

  return (
    <div>
      <ThemeProvider theme={getMuiTheme()}>
        <MUIDataTable
          data={reviewList}
          columns={columns}
          title={undefined}
          options={{
            ...options,
            onRowSelectionChange: (
              currentRowsSelected: any,
              allRowsSelected: any,
              rowsSelected: any
            ) =>
              handleRowSelect(
                currentRowsSelected,
                allRowsSelected,
                rowsSelected
              ),
            selectAllRows: isPopupOpen && selectedRowsCount === 0,
            rowsSelected: selectedRows,
          }}
        />
        <TablePagination
          className="mt-[10px]"
          component="div"
          count={tableDataCount}
          page={page}
          // rowsPerPageOptions={[5, 10, 15]}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </ThemeProvider>

      {/* filter popup box*/}
      {selectedRowsCount > 0 && (
        <div className="flex items-center justify-center">
          <Card className="rounded-full flex border p-2 border-[#1976d2] absolute shadow-lg w-[65%] bottom-0 -translate-y-1/2">
            <div className="flex flex-row w-full">
              <div className="pt-1 pl-2 flex w-[40%]">
                <span className="cursor-pointer" onClick={handleClearSelection}>
                  <Minus />
                </span>
                <span className="pl-2 pt-[1px] pr-2 text-[14px]">
                  {selectedRowsCount || selectedRows} task selected
                </span>
              </div>

              <div className="flex flex-row z-10 h-8 justify-center w-[50%]">
                {hasPermissionWorklog("", "Approve", "Approvals") && (
                  <ColorToolTip title="Accept" arrow>
                    <span
                      className={`pl-2 pr-2 pt-1 cursor-pointer border-l-[1.5px] border-gray-300 ${
                        selectedRowsCount > 1 ? "border-r-[1.5px]" : ""
                      }`}
                      onClick={() => acceptWorkitem(note, selectedRowIds)}
                    >
                      <AcceptIcon />
                    </span>
                  </ColorToolTip>
                )}

                {hasPermissionWorklog("", "Reject", "Approvals") &&
                  selectedRowsCount === 1 && (
                    <ColorToolTip title="Reject" arrow>
                      <span
                        className="pl-2 pr-2 pt-1 cursor-pointer border-l-[1.5px] border-gray-300"
                        onClick={() => setisRejectOpen(true)}
                      >
                        <RejectIcon />
                      </span>
                    </ColorToolTip>
                  )}

                {hasPermissionWorklog("", "Approve", "Approvals") &&
                  selectedRowsCount === 1 && (
                    <ColorToolTip title="Accept with Note" arrow>
                      <span
                        className="pl-2 pr-2 pt-1 cursor-pointer border-l-[1.5px] border-gray-300"
                        onClick={() => setisAcceptOpen(true)}
                      >
                        <AcceptNote />
                      </span>
                    </ColorToolTip>
                  )}

                {hasPermissionWorklog("", "ErrorLog", "Approvals") &&
                  // hasPermissionWorklog("Task/SubTask", "Save", "WorkLogs") &&
                  selectedRowsCount === 1 && (
                    <ColorToolTip title="Error logs" arrow>
                      <span
                        onClick={settingSelectedId}
                        className="pl-2 pr-2 pt-1 cursor-pointer border-l-[1.5px] border-gray-300"
                      >
                        <ErrorLogs />
                      </span>
                    </ColorToolTip>
                  )}

                {selectedRowsCount === 1 && (
                  <ColorToolTip title="Edit" arrow>
                    <span
                      className="pl-2 pr-2 pt-1 text-slatyGrey cursor-pointer border-l-[1.5px] border-gray-300"
                      onClick={() => setisEditOpen(true)}
                    >
                      <EditIcon />
                    </span>
                  </ColorToolTip>
                )}
              </div>

              <div className="flex right-0 justify-end pr-3 pt-1 w-[60%]">
                <span className="text-gray-400 italic text-[14px] pl-2">
                  shift+click to select, esc to deselect all
                </span>
              </div>
            </div>
          </Card>
        </div>
      )}

      <Dialog open={stopReviewTimer}>
        <div className="p-2">
          <DialogTitle
            sx={{ fontSize: 18, paddingRight: 16, paddingBottom: 1 }}
          >
            Stop Task
          </DialogTitle>
          <hr className="mx-5" />
          <DialogContent>
            <DialogContentText>
              <div className="mr-20 mb-8">Are you sure you want to stop?</div>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              color="error"
              variant="outlined"
              onClick={() => {
                setStopReviewTimer(false);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              className="!bg-secondary"
              autoFocus
              onClick={() => {
                handleReviewTimer(3, isRunning, submissionId, workitemTimeId);
                setStopReviewTimer(false);
              }}
            >
              Yes, Stop
            </Button>
          </DialogActions>
        </div>
      </Dialog>

      {/* Filter Dialog Box */}
      <EditDialog
        onOpen={isEditOpen}
        onClose={closeModal}
        onSelectWorkItemId={selectedRowId}
        onReviewerDataFetch={getReviewList}
        onClearSelection={handleClearSelection}
      />

      <AcceptDiloag
        onOpen={isAcceptOpen}
        onClose={closeModal}
        acceptWorkitem={acceptWorkitem}
        selectedWorkItemIds={selectedRowIds}
      />

      <RejectDialog
        onOpen={isRejectOpen}
        onClose={closeModal}
        rejectWorkItem={rejectWorkitem}
        selectedWorkItemIds={selectedRowIds}
      />
    </div>
  );
};

export default Datatable;
