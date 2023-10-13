/* eslint-disable react/jsx-key */
import React, { useEffect, useRef, useState } from "react";
import ChevronDownIcon from "@/assets/icons/ChevronDownIcon";
import TaskIcon from "@/assets/icons/TaskIcon";
import HistoryIcon from "@/assets/icons/HistoryIcon";
import BellIcon from "@/assets/icons/BellIcon";
import ClockIcon from "@/assets/icons/ClockIcon";
import CheckListIcon from "../../assets/icons/CheckListIcon";
import CommentsIcon from "../../assets/icons/CommentsIcon";
import FileIcon from "../../assets/icons/worklogs/FileIcon";
import SendIcon from "../../assets/icons/worklogs/SendIcon";
import AddIcon from "../../assets/icons/worklogs/AddIcon";
import RemoveIcon from "../../assets/icons/worklogs/RemoveIcon";
import ThreeDotIcon from "../../assets/icons/worklogs/ThreeDotIcon";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Autocomplete,
  Avatar,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import axios from "axios";
import { useRouter } from "next/navigation";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { hasPermissionWorklog } from "@/utils/commonFunction";

const EditDrawer = ({ onOpen, onClose, onEdit, onDataFetch, onHasId }: any) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const [inputTypeReview, setInputTypeReview] = useState("text");
  const [inputTypePreperation, setInputTypePreperation] = useState("text");

  const [taskDrawer, setTaskDrawer] = useState(true);
  const [subTaskDrawer, setSubTaskDrawer] = useState(true);
  const [recurringDrawer, setRecurringDrawer] = useState(true);
  const [manualTimeDrawer, setManualTimeDrawer] = useState(true);
  const [reminderDrawer, setReminderDrawer] = useState(true);
  const [checkListDrawer, setCheckListDrawer] = useState(true);
  const [commentsDrawer, setCommentsDrawer] = useState(true);
  const [logsDrawer, setLogsDrawer] = useState(true);
  const [reasonDrawer, setReasonDrawer] = useState(true);
  const [reviewerErrDrawer, setReviewerErrDrawer] = useState(true);

  // Task
  const [clientName, setClientName] = useState<string | number>(0);
  const [typeOfWork, setTypeOfWork] = useState<string | number>(0);
  const [projectName, setProjectName] = useState<string | number>(0);
  const [processName, setProcessName] = useState<string | number>(0);
  const [subProcess, setSubProcess] = useState<string | number>(0);
  const [status, setStatus] = useState<string | number>(0);
  const [description, setDescription] = useState<string>("");
  const [priority, setPriority] = useState<string | number>(0);
  const [quantity, setQuantity] = useState<any>("");
  const [receiverDate, setReceiverDate] = useState<any>("");
  const [dueDate, setDueDate] = useState<any>("");
  const [assignee, setAssignee] = useState<string | number>(0);
  const [reviewer, setReviewer] = useState<string | number>(0);
  const [dateOfReview, setDateOfReview] = useState<string>("");
  const [dateOfPreperation, setDateOfPreperation] = useState<string>("");
  const [assigneeDisable, setAssigneeDisable] = useState(true);

  // Selected Taxation
  const [typeOfReturn, setTypeOfReturn] = useState<string | number>(0);
  const [returnYear, setReturnYear] = useState<string | number>(0);
  const [complexity, setComplexity] = useState<string | number>("");
  const [countYear, setCountYear] = useState<string | number>(0);
  const [noOfPages, setNoOfPages] = useState("");

  // Sub-Task
  const [subTaskFields, setSubTaskFields] = useState([
    {
      SubtaskId: 0,
      Title: "",
      Description: "",
    },
  ]);

  // Recurring
  const [recurringStartDate, setRecurringStartDate] = useState("");
  const [recurringEndDate, setRecurringEndDate] = useState("");
  const [recurringTime, setRecurringTime] = useState<any>(1);
  const [recurringMonth, setRecurringMonth] = useState<any>(0);

  // ErrorLog
  const [errorLogData, setErrorLogData] = useState([]);

  // Reminder
  const [reminderDate, setReminderDate] = useState("");
  const [reminderTime, setReminderTime] = useState<any>(0);
  const [reminderNotification, setReminderNotification] = useState<any>([]);
  const [reminderCheckboxValue, setReminderCheckboxValue] = useState<any>(1);

  // CheclkList
  const [checkListData, setCheckListData] = useState([]);
  const [itemStates, setItemStates] = useState<any>({});

  // Comments
  const [commentSelect, setCommentSelect] = useState<number | string>(1);

  // Reviewer note
  const [reviewerNote, setReviewerNoteData] = useState([]);

  // Manuals
  const [manualFields, setManualFields] = useState([
    {
      AssigneeId: 0,
      Id: 0,
      inputDate: "",
      startTime: "",
      endTime: "",
      totalTime: "",
      manualDesc: "",
    },
  ]);

  // Comments
  const [commentData, setCommentData] = useState([]);

  // Dropdowns
  const [clientDropdownData, setClientDropdownData] = useState([]);
  const [workTypeDropdownData, setWorkTypeDropdownData] = useState([]);
  const [projectDropdownData, setProjectDropdownData] = useState([]);
  const [processDropdownData, setProcessDropdownData] = useState([]);
  const [subProcessDropdownData, setSubProcessDropdownData] = useState([]);
  const [statusDropdownData, setStatusDropdownData] = useState([]);
  const [assigneeDropdownData, setAssigneeDropdownData] = useState<any>([]);
  const [reviewerDropdownData, setReviewerDropdownData] = useState([]);
  const [cCDropdownData, setCCDropdownData] = useState<any>([]);

  const [selectedDays, setSelectedDays] = useState<any>([]);
  const [isManual, setIsManual] = useState(null);

  const toggleColor = (index: any) => {
    if (selectedDays.includes(index)) {
      setSelectedDays(
        selectedDays.filter((dayIndex: any) => dayIndex !== index)
      );
    } else {
      setSelectedDays([...selectedDays, index]);
    }
  };

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const months = [
    { label: "1", value: 1 },
    { label: "2", value: 2 },
    { label: "3", value: 3 },
    { label: "4", value: 4 },
    { label: "5", value: 5 },
    { label: "6", value: 6 },
    { label: "7", value: 7 },
    { label: "8", value: 8 },
    { label: "9", value: 9 },
    { label: "10", value: 10 },
    { label: "11", value: 11 },
    { label: "12", value: 12 },
    { label: "13", value: 13 },
    { label: "14", value: 14 },
    { label: "15", value: 15 },
    { label: "16", value: 16 },
    { label: "17", value: 17 },
    { label: "18", value: 18 },
    { label: "19", value: 19 },
    { label: "20", value: 20 },
    { label: "21", value: 21 },
    { label: "22", value: 22 },
    { label: "23", value: 23 },
    { label: "24", value: 24 },
    { label: "25", value: 25 },
    { label: "26", value: 26 },
    { label: "27", value: 27 },
    { label: "28", value: 28 },
    { label: "29", value: 29 },
    { label: "Last Day of Month", value: -1 },
  ];

  const Hours = [
    { label: "1", value: 1 },
    { label: "2", value: 2 },
    { label: "3", value: 3 },
    { label: "4", value: 4 },
    { label: "5", value: 5 },
    { label: "6", value: 6 },
    { label: "7", value: 7 },
    { label: "8", value: 8 },
    { label: "9", value: 9 },
    { label: "10", value: 10 },
    { label: "11", value: 11 },
    { label: "12", value: 12 },
    { label: "13", value: 13 },
    { label: "14", value: 14 },
    { label: "15", value: 15 },
    { label: "16", value: 16 },
    { label: "17", value: 17 },
    { label: "18", value: 18 },
    { label: "19", value: 19 },
    { label: "20", value: 20 },
    { label: "21", value: 21 },
    { label: "22", value: 22 },
    { label: "23", value: 23 },
    { label: "24", value: 24 },
  ];

  let Task = [
    hasPermissionWorklog("Task/SubTask", "View", "WorkLogs") && "TASK",
    hasPermissionWorklog("Task/SubTask", "View", "WorkLogs") && "SUB-TASK",
    hasPermissionWorklog("CheckList", "View", "WorkLogs") && "CHECKLIST",
    hasPermissionWorklog("Comment", "View", "WorkLogs") && "COMMENTS",
    hasPermissionWorklog("Reccuring", "View", "WorkLogs") && "RECURRING",
    (isManual === true || isManual === null) && "MANUAL TIME",
    hasPermissionWorklog("Reminder", "View", "WorkLogs") && "REMINDER",
    hasPermissionWorklog("ErrorLog", "View", "WorkLogs") && "ERROR LOGS",
    "REVIEWER'S NOTE",
    "LOGS",
  ];

  useEffect(() => {
    scrollToPanel(7);
  }, [onEdit]);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
    scrollToPanel(index);
  };

  const scrollToPanel = (index: number) => {
    const panel = document.getElementById(`tabpanel-${index}`);
    if (panel) {
      panel.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleMultiSelect = (e: React.SyntheticEvent, value: any) => {
    if (value !== undefined) {
      setReminderNotification(value);
    } else {
      setReminderNotification([]);
    }
  };

  const handleMultiSelectMonth = (e: React.SyntheticEvent, value: any) => {
    if (value !== undefined) {
      setRecurringMonth(value);
    } else {
      setRecurringMonth([]);
    }
  };

  // OnEdit get data
  const getWorklogData = async () => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.post(
        `${process.env.worklog_api_url}/workitem/subtask/getbyworkitem`,
        {
          WorkitemId: onEdit,
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
          const data = await response.data.ResponseData;
          setSubTaskFields(
            data.length <= 0
              ? [
                  {
                    SubTaskId: 0,
                    Title: "",
                    Description: "",
                  },
                ]
              : data
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
          toast.error("Please try again.");
        } else {
          toast.error(data);
        }
      }
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        router.push("/login");
        localStorage.clear();
      }
    }
  };

  const getRecurringData = async () => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.post(
        `${process.env.worklog_api_url}/workitem/recurring/getbyworkitem`,
        {
          WorkitemId: onEdit,
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
          const data = await response.data.ResponseData;
          setRecurringStartDate(data.length <= 0 ? "" : data.StartDate);
          setRecurringEndDate(data.length <= 0 ? "" : data.EndDate);
          setRecurringTime(data.length <= 0 ? 0 : data.Type);
          data.Type === 2
            ? setSelectedDays(data.Triggers)
            : data.Type === 3
            ? setRecurringMonth(
                data.Triggers.map((trigger: any) =>
                  months.find((month) => month.value === trigger)
                ).filter(Boolean)
              )
            : [];
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
          toast.error("Please try again.");
        } else {
          toast.error(data);
        }
      }
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        router.push("/login");
        localStorage.clear();
      }
    }
  };

  const getManualData = async () => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.post(
        `${process.env.worklog_api_url}/workitem/timelog/getManuallogByWorkitem`,
        {
          WorkitemId: onEdit,
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
          const data = await response.data.ResponseData;
          const getTimeDifference = (startTime: any, endTime: any) => {
            const [s, e] = startTime.split(":").map(Number);
            const [t, r] = endTime.split(":").map(Number);
            const d = t * 60 + r - s * 60 - e;
            return `${String(Math.floor(d / 60)).padStart(2, "0")}:${String(
              d % 60
            ).padStart(2, "0")}`;
          };
          setManualFields(
            data.length <= 0
              ? [
                  {
                    AssigneeId: 0,
                    Id: 0,
                    inputDate: "",
                    startTime: "",
                    endTime: "",
                    totalTime: "",
                    manualDesc: "",
                  },
                ]
              : data.map(
                  (i: any) =>
                    new Object({
                      AssigneeId: i.AssigneeId,
                      Id: i.Id,
                      inputDate: i.Date,
                      startTime: i.StartTime,
                      endTime: i.EndTime,
                      totalTime: getTimeDifference(i.StartTime, i.EndTime),
                      manualDesc: i.Comment,
                    })
                )
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
          toast.error("Please try again.");
        } else {
          toast.error(data);
        }
      }
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        router.push("/login");
        localStorage.clear();
      }
    }
  };

  const getReminderData = async () => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.post(
        `${process.env.worklog_api_url}/workitem/reminder/getbyworkitem`,
        {
          WorkitemId: onEdit,
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
          const data = await response.data.ResponseData;
          setReminderCheckboxValue(data.ReminderType);
          setReminderDate(data.ReminderDate);
          setReminderTime(data.ReminderTime);
          setReminderNotification(
            data.ReminderUserIds.map((reminderUserId: any) =>
              assigneeDropdownData.find(
                (assignee: { value: any }) => assignee.value === reminderUserId
              )
            ).filter(Boolean)
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
          toast.error("Please try again.");
        } else {
          toast.error(data);
        }
      }
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        router.push("/login");
        localStorage.clear();
      }
    }
  };

  const getCommentData = async (type: any) => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.post(
        `${process.env.worklog_api_url}/workitem/comment/getByWorkitem`,
        {
          WorkitemId: onEdit,
          type: type,
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
          setCommentData(response.data.ResponseData);
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
          toast.error("Please try again.");
        } else {
          toast.error(data);
        }
      }
    } catch (error: any) {
      if (error.response && error.response?.status === 401) {
        router.push("/login");
        localStorage.clear();
      }
    }
  };

  const getErrorLogData = async () => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.post(
        `${process.env.worklog_api_url}/workitem/errorlog/getByWorkitem`,
        {
          WorkitemId: onEdit,
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
          response.data.ResponseData.length <= 0
            ? setErrorLogFields([
                {
                  SubmitedBy: "",
                  SubmitedOn: "",
                  ErrorLogId: 0,
                  ErrorType: 0,
                  RootCause: 0,
                  Priority: 0,
                  ErrorCount: 0,
                  NatureOfError: 0,
                  CC: [],
                  Remark: "",
                  Attachments: "",
                  // [
                  //   {
                  //     AttachmentId: 0,
                  //     UserFileName: "Attachment300.txt",
                  //     SystemFileName: "Attachment3_system.txt",
                  //     AttachmentPath: "/path/to/attachment300.txt",
                  //   },
                  // ],
                  isSolved: false,
                },
              ])
            : setErrorLogFields(
                response.data.ResponseData.map(
                  (i: any) =>
                    new Object({
                      SubmitedBy: i.SubmitedBy,
                      SubmitedOn: i.SubmitedOn,
                      ErrorLogId: i.ErrorLogId,
                      ErrorType: i.ErrorType,
                      RootCause: i.RootCause,
                      Priority: i.Priority,
                      ErrorCount: i.ErrorCount,
                      NatureOfError: i.NatureOfError,
                      CC: i.CC.map((i: any) =>
                        cCDropdownData.find(
                          (j: { value: any }) => j.value === i
                        )
                      ).filter(Boolean),
                      Remark: i.Remark,
                      Attachments: "",
                      // [
                      //   {
                      //     AttachmentId: 0,
                      //     UserFileName: "Attachment300.txt",
                      //     SystemFileName: "Attachment3_system.txt",
                      //     AttachmentPath: "/path/to/attachment300.txt",
                      //   },
                      // ],
                      isSolved: i.IsSolved,
                    })
                )
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
          toast.error("Please try again.");
        } else {
          toast.error(data);
        }
      }
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        router.push("/login");
        localStorage.clear();
      }
    }
  };

  const getReviewerNoteData = async () => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.post(
        `${process.env.worklog_api_url}/workitem/approval/getreviewernotelist`,
        {
          WorkitemId: onEdit,
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
          setReviewerNoteData(response.data.ResponseData);
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
          toast.error("Please try again.");
        } else {
          toast.error(data);
        }
      }
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        router.push("/login");
        localStorage.clear();
      }
    }
  };

  const getCheckListData = async () => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.post(
        `${process.env.worklog_api_url}/workitem/checklist/getbyworkitem`,
        {
          WorkitemId: onEdit,
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
          setCheckListData(
            response.data.ResponseData === (null || [])
              ? []
              : response.data.ResponseData
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
          toast.error("Please try again.");
        } else {
          toast.error(data);
        }
      }
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        router.push("/login");
        localStorage.clear();
      }
    }
  };

  useEffect(() => {
    if (onEdit > 0) {
      const getEditData = async () => {
        const token = await localStorage.getItem("token");
        const Org_Token = await localStorage.getItem("Org_Token");
        try {
          const response = await axios.post(
            `${process.env.worklog_api_url}/workitem/getbyid`,
            {
              WorkitemId: onEdit,
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
              const data = await response.data.ResponseData;
              setIsManual(data.IsManual);
              setClientName(data.ClientId);
              setTypeOfWork(data.WorkTypeId);
              setProjectName(data.ProjectId);
              setProcessName(data.ProcessId);
              setSubProcess(data.SubProcessId);
              setStatus(data.StatusId);
              setPriority(data.Priority);
              setQuantity(data.Quantity);
              setDescription(data.Description);
              setReceiverDate(data.ReceiverDate);
              setDueDate(data.DueDate);
              setDateOfReview(data.ReviewerDate);
              setDateOfPreperation(data.PreparationDate);
              setAssignee(data.AssignedId);
              setReviewer(data.ReviewerId);
              setTypeOfReturn(data.TypeOfReturnId);
              setReturnYear(
                data.TypeOfReturnId === 0
                  ? null
                  : data.TaxCustomFields.ReturnYear
              );
              setComplexity(
                data.TypeOfReturnId === 0
                  ? null
                  : data.TaxCustomFields.Complexity
              );
              setCountYear(
                data.TypeOfReturnId === 0
                  ? null
                  : data.TaxCustomFields.CountYear
              );
              setNoOfPages(
                data.TypeOfReturnId === 0
                  ? null
                  : data.TaxCustomFields.NoOfPages
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
              toast.error("Please try again.");
            } else {
              toast.error(data);
            }
          }
        } catch (error: any) {
          if (error.response && error.response.status === 401) {
            router.push("/login");
            localStorage.clear();
          }
        }
      };

      // Call the function here
      getEditData();
      getWorklogData();
      getRecurringData();
      getManualData();
      getReminderData();
      getCheckListData();
      getCommentData(1);
      getReviewerNoteData();
    }
  }, [onEdit]);

  useEffect(() => {
    assigneeDropdownData.length > 0 && getErrorLogData();
  }, [assigneeDropdownData]);

  // Error Logs
  const [errorLogFields, setErrorLogFields] = useState([
    {
      SubmitedBy: "",
      SubmitedOn: "",
      ErrorLogId: 0,
      ErrorType: 0,
      RootCause: 0,
      Priority: 0,
      ErrorCount: 0,
      NatureOfError: 0,
      CC: [],
      Remark: "",
      Attachments: "",
      // [
      //   {
      //     AttachmentId: 0,
      //     UserFileName: "Attachment300.txt",
      //     SystemFileName: "Attachment3_system.txt",
      //     AttachmentPath: "/path/to/attachment300.txt",
      //   },
      // ],
      isSolved: false,
    },
  ]);
  const [errorTypeErr, setErrorTypeErr] = useState([false]);
  const [rootCauseErr, setRootCauseErr] = useState([false]);
  const [errorLogPriorityErr, setErrorLogPriorityErr] = useState([false]);
  const [errorCountErr, setErrorCountErr] = useState([false]);
  const [natureOfErr, setNatureOfErr] = useState([false]);
  const [ccErr, setCCErr] = useState([false]);
  const [remarkErr, setRemarkErr] = useState([false]);
  const [attachmentsErr, setAttachmentsErr] = useState([false]);
  const [deletedErrorLog, setDeletedErrorLog] = useState<any>([]);

  const addErrorLogField = () => {
    setErrorLogFields([
      ...errorLogFields,
      {
        SubmitedBy: "",
        SubmitedOn: "",
        ErrorLogId: 0,
        ErrorType: 0,
        RootCause: 0,
        Priority: 0,
        ErrorCount: 0,
        NatureOfError: 0,
        CC: [],
        Remark: "",
        Attachments: "",
        // [
        //   {
        //     AttachmentId: 0,
        //     UserFileName: "Attachment300.txt",
        //     SystemFileName: "Attachment3_system.txt",
        //     AttachmentPath: "/path/to/attachment300.txt",
        //   },
        // ],
        isSolved: false,
      },
    ]);
    setErrorTypeErr([...errorTypeErr, false]);
    setRootCauseErr([...rootCauseErr, false]);
    setErrorLogPriorityErr([...errorLogPriorityErr, false]);
    setErrorCountErr([...errorCountErr, false]);
    setNatureOfErr([...natureOfErr, false]);
    setCCErr([...ccErr, false]);
    setRemarkErr([...remarkErr, false]);
    setAttachmentsErr([...attachmentsErr, false]);
  };

  const removeErrorLogField = (index: number) => {
    setDeletedErrorLog([...deletedErrorLog, errorLogFields[index].ErrorLogId]);

    const newErrorLogFields = [...errorLogFields];
    newErrorLogFields.splice(index, 1);
    setErrorLogFields(newErrorLogFields);

    const newErrorTypeErrors = [...errorTypeErr];
    newErrorTypeErrors.splice(index, 1);
    setErrorTypeErr(newErrorTypeErrors);

    const newRootCauseErrors = [...rootCauseErr];
    newRootCauseErrors.splice(index, 1);
    setRootCauseErr(newRootCauseErrors);

    const newPriorityErrors = [...errorLogPriorityErr];
    newPriorityErrors.splice(index, 1);
    setErrorLogPriorityErr(newPriorityErrors);

    const newErrorCountErrors = [...errorCountErr];
    newErrorCountErrors.splice(index, 1);
    setErrorCountErr(newErrorCountErrors);

    const newNatureOfErrErrors = [...natureOfErr];
    newNatureOfErrErrors.splice(index, 1);
    setNatureOfErr(newNatureOfErrErrors);

    const newCCErrors = [...ccErr];
    newCCErrors.splice(index, 1);
    setCCErr(newCCErrors);

    const newRemarkErrors = [...remarkErr];
    newRemarkErrors.splice(index, 1);
    setRemarkErr(newRemarkErrors);

    const newAttachmentErrors = [...attachmentsErr];
    newAttachmentErrors.splice(index, 1);
    setAttachmentsErr(newAttachmentErrors);
  };

  const handleErrorTypeChange = (e: any, index: number) => {
    const newFields = [...errorLogFields];
    newFields[index].ErrorType = e.target.value;
    setErrorLogFields(newFields);

    const newErrors = [...errorTypeErr];
    newErrors[index] = e.target.value === 0;
    setErrorTypeErr(newErrors);
  };

  const handleRootCauseChange = (e: any, index: number) => {
    const newFields = [...errorLogFields];
    newFields[index].RootCause = e.target.value;
    setErrorLogFields(newFields);

    const newErrors = [...rootCauseErr];
    newErrors[index] = e.target.value === 0;
    setRootCauseErr(newErrors);
  };

  const handleNatureOfErrorChange = (e: any, index: number) => {
    const newFields = [...errorLogFields];
    newFields[index].NatureOfError = e.target.value;
    setErrorLogFields(newFields);

    const newErrors = [...natureOfErr];
    newErrors[index] = e.target.value === 0;
    setNatureOfErr(newErrors);
  };

  const handlePriorityChange = (e: any, index: number) => {
    const newFields = [...errorLogFields];
    newFields[index].Priority = e.target.value;
    setErrorLogFields(newFields);

    const newErrors = [...errorLogPriorityErr];
    newErrors[index] = e.target.value === 0;
    setErrorLogPriorityErr(newErrors);
  };

  const handleErrorCountChange = (e: any, index: number) => {
    const newFields = [...errorLogFields];
    newFields[index].ErrorCount = e.target.value;
    setErrorLogFields(newFields);

    const newErrors = [...errorCountErr];
    newErrors[index] =
      e.target.value < 0 || e.target.value.toString().length > 4;
    setErrorCountErr(newErrors);
  };

  const handleCCChange = (newValue: any, index: any) => {
    const newFields = [...errorLogFields];
    newFields[index].CC = newValue;
    setErrorLogFields(newFields);

    const newErrors = [...ccErr];
    newErrors[index] = newValue.length === 0;
    setCCErr(newErrors);
  };

  const handleRemarksChange = (e: any, index: number) => {
    const newFields = [...errorLogFields];
    newFields[index].Remark = e.target.value;
    setErrorLogFields(newFields);

    const newErrors = [...remarkErr];
    newErrors[index] = e.target.value.trim().length <= 0;
    setRemarkErr(newErrors);
  };

  const handleAttachmentsChange = (e: any, index: number) => {
    const newFields = [...errorLogFields];
    newFields[index].Attachments = e.target.value;
    setErrorLogFields(newFields);

    const newErrors = [...attachmentsErr];
    newErrors[index] = e.target.value.trim().length <= 0;
    setAttachmentsErr(newErrors);
  };

  const handleSubmitErrorLog = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    let hasErrorLogErrors = false;
    const newErrorTypeErrors = errorLogFields.map(
      (field) => field.ErrorType === 0
    );
    setErrorTypeErr(newErrorTypeErrors);
    const newRootCauseErrors = errorLogFields.map(
      (field) => field.RootCause === 0
    );
    setRootCauseErr(newRootCauseErrors);
    const newNatureOfErrors = errorLogFields.map(
      (field) => field.NatureOfError === 0
    );
    setNatureOfErr(newNatureOfErrors);
    const newPriorityErrors = errorLogFields.map(
      (field) => field.Priority === 0
    );
    setErrorLogPriorityErr(newPriorityErrors);
    const newErrorCountErrors = errorLogFields.map(
      (field) => field.ErrorCount < 0 || field.ErrorCount > 9999
    );
    setErrorCountErr(newErrorCountErrors);
    const newCCErrors = errorLogFields.map((field) => field.CC.length <= 0);
    setCCErr(newCCErrors);
    const newRemarkErrors = errorLogFields.map(
      (field) =>
        field.Remark.trim().length < 5 || field.Remark.trim().length > 500
    );
    setRemarkErr(newRemarkErrors);
    // const newAttachmentsErrors = errorLogFields.map(
    //   (field) => field.Attachments.length === 0
    // );
    // setAttachmentsErr(newAttachmentsErrors);

    hasErrorLogErrors =
      newErrorTypeErrors.some((error) => error) ||
      newRootCauseErrors.some((error) => error) ||
      newNatureOfErrors.some((error) => error) ||
      newPriorityErrors.some((error) => error) ||
      newErrorCountErrors.some((error) => error) ||
      newCCErrors.some((error) => error) ||
      newRemarkErrors.some((error) => error);
    // ||
    // newAttachmentsErrors.some((error) => error);

    if (!hasErrorLogErrors) {
      const token = await localStorage.getItem("token");
      const Org_Token = await localStorage.getItem("Org_Token");
      try {
        const response = await axios.post(
          `${process.env.worklog_api_url}/workitem/errorlog/saveByworkitem`,
          {
            WorkItemId: onEdit,
            Errors: errorLogFields.map(
              (i: any) =>
                new Object({
                  ErrorLogId: i.ErrorLogId,
                  ErrorType: i.ErrorType,
                  RootCause: i.RootCause,
                  Priority: i.Priority,
                  ErrorCount: i.ErrorCount,
                  NatureOfError: i.NatureOfError,
                  CC: i.CC.map((j: any) => j.value),
                  Remark: i.Remark,
                  Attachments: null,
                  // [
                  //   {
                  //     AttachmentId: 0,
                  //     UserFileName: "Attachment300.txt",
                  //     SystemFileName: "Attachment3_system.txt",
                  //     AttachmentPath: "/path/to/attachment300.txt",
                  //   },
                  // ],
                })
            ),
            SubmissionId: onHasId,
            DeletedErrorlogIds: deletedErrorLog,
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
            toast.success(`Error logged successfully.`);
            setDeletedErrorLog([]);
            getErrorLogData();
            onDataFetch();
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
            toast.error("Failed Please try again.");
          } else {
            toast.error(data);
          }
        }
      } catch (error: any) {
        if (error.response?.status === 401) {
          router.push("/login");
          localStorage.clear();
        }
      }
    }
  };

  // API CALLS dropdown data
  const getData = async (api: any) => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      let response: any;
      if (api === "/WorkType/GetDropdown") {
        response = await axios.post(
          `${process.env.pms_api_url}${api}`,
          {
            clientId: 0,
          },
          {
            headers: {
              Authorization: `bearer ${token}`,
              org_token: `${Org_Token}`,
            },
          }
        );
      } else if (api === "/project/getdropdown") {
        response = await axios.post(
          `${process.env.pms_api_url}${api}`,
          {
            clientId: clientName,
          },
          {
            headers: {
              Authorization: `bearer ${token}`,
              org_token: `${Org_Token}`,
            },
          }
        );
      } else if (api === "/Process/GetDropdownByClient") {
        response = await axios.post(
          `${process.env.pms_api_url}${api}`,
          {
            clientId: clientName,
          },
          {
            headers: {
              Authorization: `bearer ${token}`,
              org_token: `${Org_Token}`,
            },
          }
        );
      } else if ("/client/getdropdownforgroup") {
        response = await axios.get(`${process.env.pms_api_url}${api}`, {
          headers: {
            Authorization: `bearer ${token}`,
            org_token: `${Org_Token}`,
          },
        });
      } else if ("/status/GetDropdown") {
        response = await axios.get(`${process.env.pms_api_url}${api}`, {
          headers: {
            Authorization: `bearer ${token}`,
            org_token: `${Org_Token}`,
          },
        });
      }

      if (response.status === 200) {
        if (response.data.ResponseStatus === "Success") {
          if (api === "/client/getdropdownforgroup") {
            setClientDropdownData(response.data.ResponseData);
            getData("/WorkType/GetDropdown");
          }
          if (api === "/WorkType/GetDropdown") {
            setWorkTypeDropdownData(response.data.ResponseData);
            getData("/project/getdropdown");
          }
          if (api === "/project/getdropdown") {
            setProjectDropdownData(response.data.ResponseData.List);
            getData("/Process/GetDropdownByClient");
          }
          if (api === "/Process/GetDropdownByClient") {
            setProcessDropdownData(response.data.ResponseData);
            getData("/status/GetDropdown");
          }
          if (api === "/status/GetDropdown") {
            setStatusDropdownData(response.data.ResponseData);
          }
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
          toast.error("Please try again.");
        } else {
          toast.error(data);
        }
      }
    } catch (error: any) {
      if (error.response.status === 401) {
        router.push("/login");
        localStorage.clear();
      }
    }
  };

  const getUserDetails = async () => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      };
      const response = await axios.get(
        `${process.env.api_url}/auth/getuserdetails`,
        { headers: headers }
      );
      if (response.status === 200) {
        setAssigneeDisable(response.data.ResponseData.IsHaveManageAssignee);
      }
    } catch (error: any) {
      if (error.response.status === 401) {
        router.push("/login");
        localStorage.clear();
      }
    }
  };

  const toggleGeneralOpen = (index: any) => {
    setItemStates((prevStates: any) => ({
      ...prevStates,
      [index]: !prevStates[index],
    }));
  };

  const getCCData = async () => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      let response = await axios.get(
        `${process.env.api_url}/user/getdropdown`,
        {
          headers: {
            Authorization: `bearer ${token}`,
            org_token: `${Org_Token}`,
          },
        }
      );

      if (response.status === 200) {
        if (response.data.ResponseStatus === "Success") {
          setCCDropdownData(response.data.ResponseData);
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
          toast.error("Please try again.");
        } else {
          toast.error(data);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getUserDetails();
    onOpen && getData("/client/getdropdownforgroup");
    onOpen && getCCData();
  }, [clientName, onOpen]);

  useEffect(() => {
    const getData = async () => {
      const token = await localStorage.getItem("token");
      const Org_Token = await localStorage.getItem("Org_Token");
      try {
        let response = await axios.post(
          `${process.env.pms_api_url}/Process/GetDropdownByClient`,
          {
            clientId: clientName,
            processId: processName,
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
            setSubProcessDropdownData(response.data.ResponseData);
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
            toast.error("Please try again.");
          } else {
            toast.error(data);
          }
        }
      } catch (error: any) {
        if (error.response.status === 401) {
          router.push("/login");
          localStorage.clear();
        }
      }
    };
    processName !== 0 && getData();
  }, [processName]);

  useEffect(() => {
    const getData = async (api: any) => {
      const token = await localStorage.getItem("token");
      const Org_Token = await localStorage.getItem("Org_Token");
      try {
        let response = await axios.post(
          `${process.env.api_url}${api}`,
          {
            ClientId: clientName,
            WorktypeId: typeOfWork,
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
            if (api === "/user/GetAssigneeUserDropdown") {
              setAssigneeDropdownData(response.data.ResponseData);
            }
            if (api === "/user/GetReviewerDropdown") {
              setReviewerDropdownData(response.data.ResponseData);
            }
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
            toast.error("Please try again.");
          } else {
            toast.error(data);
          }
        }
      } catch (error: any) {
        if (error.response.status === 401) {
          router.push("/login");
          localStorage.clear();
        }
      }
    };
    typeOfWork !== 0 && getData("/user/GetAssigneeUserDropdown");
    typeOfWork !== 0 && getData("/user/GetReviewerDropdown");
  }, [typeOfWork]);

  const handleClose = () => {
    setClientName(0);
    setTypeOfWork(0);
    setProjectName(0);
    setProcessName(0);
    setSubProcess(0);
    setStatus(0);
    setDescription("");
    setPriority(0);
    setQuantity("");
    setReceiverDate("");
    setDueDate("");
    setAssignee(0);
    setReviewer(0);
    setDateOfReview("");
    setDateOfPreperation("");
    setAssigneeDisable(true);

    // Taxation selected
    setTypeOfReturn(0);
    setReturnYear(0);
    setComplexity(0);
    setCountYear(0);
    setNoOfPages("");

    // Sub-Task
    setSubTaskFields([
      {
        SubtaskId: 0,
        Title: "",
        Description: "",
      },
    ]);

    // Checklist
    setCheckListData([]);
    setItemStates({});

    // Recurring
    setRecurringStartDate("");
    setRecurringEndDate("");
    setRecurringTime(1);
    setRecurringMonth(0);

    // Manual
    setManualFields([
      {
        AssigneeId: 0,
        Id: 0,
        inputDate: "",
        startTime: "",
        endTime: "",
        totalTime: "",
        manualDesc: "",
      },
    ]);

    // Reminder
    setReminderCheckboxValue(1);
    setReminderDate("");
    setReminderTime(0);
    setReminderNotification(0);

    // Error Logs
    setErrorLogData([]);

    // Comments
    setCommentData([]);

    // Reviewer note
    setReviewerNoteData([]);

    // Error Logs
    setErrorLogFields([
      {
        SubmitedBy: "",
        SubmitedOn: "",
        ErrorLogId: 0,
        ErrorType: 0,
        RootCause: 0,
        Priority: 0,
        ErrorCount: 0,
        NatureOfError: 0,
        CC: [],
        Remark: "",
        Attachments: "",
        // [
        //   {
        //     AttachmentId: 0,
        //     UserFileName: "Attachment300.txt",
        //     SystemFileName: "Attachment3_system.txt",
        //     AttachmentPath: "/path/to/attachment300.txt",
        //   },
        // ],
        isSolved: false,
      },
    ]);
    setErrorTypeErr([false]);
    setRootCauseErr([false]);
    setErrorLogPriorityErr([false]);
    setErrorCountErr([false]);
    setNatureOfErr([false]);
    setCCErr([false]);
    setRemarkErr([false]);
    setAttachmentsErr([false]);
    setDeletedErrorLog([]);

    onClose();
  };

  return (
    <>
      <div
        className={`fixed top-0 right-0 z-30 h-screen overflow-y-auto w-[1300px] border border-lightSilver bg-pureWhite transform  ${
          onOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="sticky top-0 !h-[9%] bg-whiteSmoke border-b z-30 border-lightSilver">
          <div className="flex p-[6px] justify-between items-center">
            <div className="flex items-center py-[6.5px] pl-[5px]">
              {Task.map((task) => task)
                .filter((i: any) => i !== false)
                .map((task: any, index: number) => (
                  <div
                    key={index}
                    className={`py-2 px-3 text-[15px] ${
                      index !== Task.length - 1 &&
                      "border-r border-r-lightSilver"
                    } cursor-pointer font-semibold hover:text-[#0592C6] text-slatyGrey`}
                    onClick={() => handleTabClick(index)}
                  >
                    {task}
                  </div>
                ))}
            </div>
            <Tooltip title="Close" placement="left" arrow>
              <IconButton className="mr-[10px]" onClick={handleClose}>
                <Close />
              </IconButton>
            </Tooltip>
          </div>
        </div>
        <div className="overflow-y-scroll !h-[91%]">
          <form>
            {hasPermissionWorklog("Task/SubTask", "View", "WorkLogs") && (
              <div className="pt-1" id="tabpanel-0">
                <div className="py-[10px] px-8 flex items-center justify-between font-medium border-dashed border-b border-lightSilver">
                  <span className="flex items-center">
                    <TaskIcon />
                    <span className="ml-[21px]">Task</span>
                  </span>
                  <span
                    className={`cursor-pointer ${
                      taskDrawer ? "rotate-180" : ""
                    }`}
                    onClick={() => setTaskDrawer(!taskDrawer)}
                  >
                    <ChevronDownIcon />
                  </span>
                </div>
                {taskDrawer && (
                  <>
                    <div className="mt-[10px] pl-6">
                      <FormControl
                        variant="standard"
                        sx={{ mx: 0.75, minWidth: 300 }}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          Client Name
                          <span className="text-defaultRed">&nbsp;*</span>
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={clientName === 0 ? "" : clientName}
                          readOnly
                        >
                          {clientDropdownData.map((i: any, index: number) => (
                            <MenuItem value={i.value} key={index}>
                              {i.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <FormControl
                        variant="standard"
                        sx={{ mx: 0.75, minWidth: 300 }}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          Type of Work
                          <span className="text-defaultRed">&nbsp;*</span>
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={typeOfWork === 0 ? "" : typeOfWork}
                          readOnly
                        >
                          {workTypeDropdownData.map((i: any, index: number) => (
                            <MenuItem value={i.value} key={index}>
                              {i.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <FormControl
                        variant="standard"
                        sx={{ mx: 0.75, minWidth: 300 }}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          Project Name
                          <span className="text-defaultRed">&nbsp;*</span>
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={projectName === 0 ? "" : projectName}
                          readOnly
                        >
                          {projectDropdownData.map((i: any, index: number) => (
                            <MenuItem value={i.value} key={index}>
                              {i.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <FormControl
                        variant="standard"
                        sx={{ mx: 0.75, minWidth: 300 }}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          Process Name
                          <span className="text-defaultRed">&nbsp;*</span>
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={processName === 0 ? "" : processName}
                          readOnly
                        >
                          {processDropdownData.map((i: any, index: number) => (
                            <MenuItem value={i.Id} key={index}>
                              {i.Name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                    <div className="mt-[10px] pl-6">
                      <FormControl
                        variant="standard"
                        sx={{ mx: 0.75, minWidth: 300 }}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          Sub Process
                          <span className="text-defaultRed">&nbsp;*</span>
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={subProcess === 0 ? "" : subProcess}
                          readOnly
                        >
                          {subProcessDropdownData.map(
                            (i: any, index: number) => (
                              <MenuItem value={i.Id}>{i.Name}</MenuItem>
                            )
                          )}
                        </Select>
                      </FormControl>
                      <FormControl
                        variant="standard"
                        sx={{ mx: 0.75, minWidth: 300 }}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          Status
                          <span className="text-defaultRed">&nbsp;*</span>
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={status === 0 ? "" : status}
                          readOnly
                        >
                          {statusDropdownData.map((i: any, index: number) => (
                            <MenuItem value={i.value} key={index}>
                              {i.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <TextField
                        label={
                          <span>
                            Description
                            <span className="!text-defaultRed">&nbsp;*</span>
                          </span>
                        }
                        fullWidth
                        className="pt-1"
                        value={
                          description?.trim().length <= 0 ? "" : description
                        }
                        InputProps={{ readOnly: true }}
                        inputProps={{ readOnly: true }}
                        margin="normal"
                        variant="standard"
                        sx={{ mx: 0.75, maxWidth: 300, mt: 0 }}
                      />
                      <FormControl
                        variant="standard"
                        sx={{ mx: 0.75, minWidth: 300 }}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          Priority
                          <span className="text-defaultRed">&nbsp;*</span>
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={priority === 0 ? "" : priority}
                          readOnly
                        >
                          <MenuItem value={1}>High</MenuItem>
                          <MenuItem value={2}>Medium</MenuItem>
                          <MenuItem value={3}>Low</MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                    <div className="mt-[-12px] pl-6">
                      <TextField
                        label={
                          <span>
                            Estimated Time
                            <span className="!text-defaultRed">&nbsp;*</span>
                          </span>
                        }
                        fullWidth
                        value={
                          subProcess !== 0
                            ? subProcessDropdownData.map((i: any) =>
                                subProcess === i.Id
                                  ? (() => {
                                      const timeInSeconds = i.EstimatedHour;
                                      const hours = Math.floor(
                                        timeInSeconds / 3600
                                      );
                                      const minutes = Math.floor(
                                        (timeInSeconds % 3600) / 60
                                      );
                                      const seconds = Math.floor(
                                        timeInSeconds % 60
                                      );
                                      const formattedHours = hours
                                        .toString()
                                        .padStart(2, "0");
                                      const formattedMinutes = minutes
                                        .toString()
                                        .padStart(2, "0");
                                      const formattedSeconds = seconds
                                        .toString()
                                        .padStart(2, "0");

                                      return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
                                    })()
                                  : null
                              )
                            : ""
                        }
                        InputProps={{ readOnly: true }}
                        inputProps={{ readOnly: true }}
                        margin="normal"
                        variant="standard"
                        sx={{ mx: 0.75, maxWidth: 300 }}
                      />
                      <TextField
                        label={
                          <span>
                            Quantity
                            <span className="!text-defaultRed">&nbsp;*</span>
                          </span>
                        }
                        type="number"
                        fullWidth
                        value={quantity}
                        InputProps={{ readOnly: true }}
                        inputProps={{ readOnly: true }}
                        margin="normal"
                        variant="standard"
                        sx={{ mx: 0.75, maxWidth: 300 }}
                      />
                      <TextField
                        label={
                          <span>
                            Standard Time
                            <span className="!text-defaultRed">&nbsp;*</span>
                          </span>
                        }
                        fullWidth
                        value={
                          subProcess !== 0
                            ? subProcessDropdownData.map((i: any) =>
                                subProcess === i.Id
                                  ? (() => {
                                      const timeInSeconds =
                                        i.EstimatedHour * quantity;
                                      const hours = Math.floor(
                                        timeInSeconds / 3600
                                      );
                                      const minutes = Math.floor(
                                        (timeInSeconds % 3600) / 60
                                      );
                                      const seconds = Math.floor(
                                        timeInSeconds % 60
                                      );
                                      const formattedHours = hours
                                        .toString()
                                        .padStart(2, "0");
                                      const formattedMinutes = minutes
                                        .toString()
                                        .padStart(2, "0");
                                      const formattedSeconds = seconds
                                        .toString()
                                        .padStart(2, "0");

                                      return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
                                    })()
                                  : null
                              )
                            : ""
                        }
                        InputProps={{ readOnly: true }}
                        inputProps={{ readOnly: true }}
                        margin="normal"
                        variant="standard"
                        sx={{ mx: 0.75, maxWidth: 300 }}
                      />
                      <div
                        className={`inline-flex mt-[12px] mb-[8px] mx-[6px] muiDatepickerCustomizer w-full max-w-[300px]`}
                      >
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            label={
                              <span>
                                Received Date
                                <span className="!text-defaultRed">
                                  &nbsp;*
                                </span>
                              </span>
                            }
                            value={
                              receiverDate === "" ? null : dayjs(receiverDate)
                            }
                            readOnly
                          />
                        </LocalizationProvider>
                      </div>
                    </div>
                    <div className="mt-[2px] pl-6">
                      <div
                        className={`inline-flex mt-[-1px] mb-[8px] mx-[6px] muiDatepickerCustomizer w-full max-w-[300px]`}
                      >
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            label={
                              <span>
                                Due Date
                                <span className="!text-defaultRed">
                                  &nbsp;*
                                </span>
                              </span>
                            }
                            value={dueDate === "" ? null : dayjs(dueDate)}
                            minDate={dayjs(receiverDate)}
                            readOnly
                          />
                        </LocalizationProvider>
                      </div>
                      <FormControl
                        variant="standard"
                        sx={{ mx: 0.75, minWidth: 300 }}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          Assignee
                          <span className="text-defaultRed">&nbsp;*</span>
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={assignee === 0 ? "" : assignee}
                          readOnly
                        >
                          {assigneeDropdownData.map((i: any, index: number) => (
                            <MenuItem value={i.value} key={index}>
                              {i.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <FormControl
                        variant="standard"
                        sx={{ mx: 0.75, minWidth: 300 }}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          Reviewer
                          <span className="text-defaultRed">&nbsp;*</span>
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={reviewer === 0 ? "" : reviewer}
                          readOnly
                        >
                          {reviewerDropdownData.map((i: any, index: number) => (
                            <MenuItem value={i.value} key={index}>
                              {i.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      {typeOfWork !== 3 ? (
                        <>
                          {onEdit > 0 && (
                            <TextField
                              label={
                                <span>
                                  Date of Preperation
                                  <span className="!text-defaultRed">
                                    &nbsp;*
                                  </span>
                                </span>
                              }
                              type={inputTypePreperation}
                              disabled
                              fullWidth
                              value={dateOfPreperation}
                              InputProps={{ readOnly: true }}
                              inputProps={{ readOnly: true }}
                              onFocus={() => setInputTypePreperation("date")}
                              onBlur={(e: any) => {
                                setInputTypePreperation("text");
                              }}
                              margin="normal"
                              variant="standard"
                              sx={{ mx: 0.75, maxWidth: 300, my: 0 }}
                            />
                          )}
                        </>
                      ) : (
                        <FormControl
                          variant="standard"
                          sx={{ mx: 0.75, minWidth: 300 }}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            Type of Return
                            <span className="text-defaultRed">&nbsp;*</span>
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={typeOfReturn === 0 ? "" : typeOfReturn}
                            readOnly
                          >
                            <MenuItem value={1}>Form1060</MenuItem>
                            <MenuItem value={2}>Form1040</MenuItem>
                            <MenuItem value={3}>Form1040B</MenuItem>
                          </Select>
                        </FormControl>
                      )}
                    </div>
                    <div className="mt-[10px] pl-6">
                      {typeOfWork !== 3 ? (
                        <>
                          {onEdit > 0 && (
                            <TextField
                              label={
                                <span>
                                  Date of Review
                                  <span className="!text-defaultRed">
                                    &nbsp;*
                                  </span>
                                </span>
                              }
                              disabled
                              type={inputTypeReview}
                              fullWidth
                              value={dateOfReview}
                              InputProps={{ readOnly: true }}
                              inputProps={{ readOnly: true }}
                              margin="normal"
                              variant="standard"
                              sx={{ mx: 0.75, maxWidth: 300, my: 0 }}
                            />
                          )}
                        </>
                      ) : (
                        <>
                          <FormControl
                            variant="standard"
                            sx={{ mx: 0.75, minWidth: 300 }}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              Return Year
                              <span className="text-defaultRed">&nbsp;*</span>
                            </InputLabel>
                            <Select
                              labelId="demo-simple-select-standard-label"
                              id="demo-simple-select-standard"
                              value={returnYear === 0 ? "" : returnYear}
                              readOnly
                            >
                              <MenuItem value={10}>Ten</MenuItem>
                              <MenuItem value={20}>Twenty</MenuItem>
                              <MenuItem value={30}>Thirty</MenuItem>
                            </Select>
                          </FormControl>
                          <FormControl
                            variant="standard"
                            sx={{ mx: 0.75, minWidth: 300 }}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              Complexity
                              <span className="text-defaultRed">&nbsp;*</span>
                            </InputLabel>
                            <Select
                              labelId="demo-simple-select-standard-label"
                              id="demo-simple-select-standard"
                              value={complexity === 0 ? "" : complexity}
                              readOnly
                            >
                              <MenuItem value={"Ten"}>Ten</MenuItem>
                              <MenuItem value={"Twenty"}>Twenty</MenuItem>
                              <MenuItem value={"Thirty"}>Thirty</MenuItem>
                            </Select>
                          </FormControl>
                          <FormControl
                            variant="standard"
                            sx={{ mx: 0.75, minWidth: 300 }}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              Current Year
                              <span className="text-defaultRed">&nbsp;*</span>
                            </InputLabel>
                            <Select
                              labelId="demo-simple-select-standard-label"
                              id="demo-simple-select-standard"
                              value={countYear === 0 ? "" : countYear}
                              readOnly
                            >
                              <MenuItem value={10}>Ten</MenuItem>
                              <MenuItem value={20}>Twenty</MenuItem>
                              <MenuItem value={30}>Thirty</MenuItem>
                            </Select>
                          </FormControl>
                          <TextField
                            label="No of Pages"
                            fullWidth
                            value={noOfPages}
                            InputProps={{ readOnly: true }}
                            inputProps={{ readOnly: true }}
                            margin="normal"
                            variant="standard"
                            sx={{ mx: 0.75, maxWidth: 300, my: 0 }}
                          />
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}

            {hasPermissionWorklog("Task/SubTask", "View", "WorkLogs") && (
              <div className="mt-14" id="tabpanel-1">
                <div className="py-[10px] px-8 flex items-center justify-between font-medium border-dashed border-b border-lightSilver">
                  <span className="flex items-center">
                    <TaskIcon />
                    <span className="ml-[21px]">Sub-Task</span>
                  </span>
                  <span
                    className={`cursor-pointer ${
                      subTaskDrawer ? "rotate-180" : ""
                    }`}
                    onClick={() => setSubTaskDrawer(!subTaskDrawer)}
                  >
                    <ChevronDownIcon />
                  </span>
                </div>
                {subTaskDrawer && (
                  <div className="mt-3 pl-6">
                    {subTaskFields.map((field, index) => (
                      <div className="w-[100%]" key={index}>
                        <TextField
                          label={
                            <span>
                              Task Name
                              <span className="!text-defaultRed">&nbsp;*</span>
                            </span>
                          }
                          fullWidth
                          value={field.Title}
                          InputProps={{ readOnly: true }}
                          inputProps={{ readOnly: true }}
                          margin="normal"
                          variant="standard"
                          sx={{ mx: 0.75, maxWidth: 300, mt: 0 }}
                        />
                        <TextField
                          label={
                            <span>
                              Description
                              <span className="!text-defaultRed">&nbsp;*</span>
                            </span>
                          }
                          fullWidth
                          value={field.Description}
                          InputProps={{ readOnly: true }}
                          inputProps={{ readOnly: true }}
                          margin="normal"
                          variant="standard"
                          sx={{ mx: 0.75, maxWidth: 300, mt: 0 }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {hasPermissionWorklog("CheckList", "View", "WorkLogs") && (
              <div className="mt-14" id="tabpanel-2">
                <div className="py-[10px] px-8 flex items-center justify-between font-medium border-dashed border-b border-lightSilver">
                  <span className="flex items-center">
                    <CheckListIcon />
                    <span className="ml-[21px]">Checklist</span>
                  </span>
                  <span
                    className={`cursor-pointer ${
                      checkListDrawer ? "rotate-180" : ""
                    }`}
                    onClick={() => setCheckListDrawer(!checkListDrawer)}
                  >
                    <ChevronDownIcon />
                  </span>
                </div>
                <div className="pl-12 mt-5">
                  {checkListDrawer &&
                    checkListData?.length > 0 &&
                    checkListData.map((i: any, index: number) => (
                      <div className="mt-3">
                        <span className="flex items-center">
                          <span onClick={() => toggleGeneralOpen(index)}>
                            {itemStates[index] ? <RemoveIcon /> : <AddIcon />}
                          </span>
                          <span className="text-large font-semibold mr-6">
                            {i.Category}
                          </span>
                          <ThreeDotIcon />
                        </span>
                        {itemStates[index] && (
                          <FormGroup className="ml-8 mt-2">
                            {i.Activities.map((j: any, index: number) => (
                              <FormControlLabel
                                control={
                                  <Checkbox checked={j.IsCheck} disabled />
                                }
                                label={j.Title}
                              />
                            ))}
                          </FormGroup>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            )}

            {hasPermissionWorklog("Comment", "View", "WorkLogs") && (
              <div className="mt-14" id="tabpanel-3">
                <div className="py-[10px] px-8 flex items-center justify-between font-medium border-dashed border-b border-lightSilver">
                  <span className="flex items-center">
                    <CommentsIcon />
                    <span className="ml-[21px]">Comments</span>
                    <FormControl
                      variant="standard"
                      sx={{ mx: 0.75, minWidth: 100, ml: 5 }}
                    >
                      <Select
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={commentSelect}
                        onChange={(e) => {
                          setCommentSelect(e.target.value),
                            getCommentData(e.target.value);
                        }}
                      >
                        <MenuItem value={1}>Internal</MenuItem>
                        <MenuItem value={2}>External</MenuItem>
                      </Select>
                    </FormControl>
                  </span>
                  <span
                    className={`cursor-pointer ${
                      commentsDrawer ? "rotate-180" : ""
                    }`}
                    onClick={() => setCommentsDrawer(!commentsDrawer)}
                  >
                    <ChevronDownIcon />
                  </span>
                </div>
                <div className="my-5 px-16">
                  <div className="flex flex-col gap-4">
                    {commentsDrawer &&
                      commentData.length > 0 &&
                      commentData.map((i: any, index: number) => (
                        <div className="flex gap-4">
                          {i.UserName.length > 0 ? (
                            <Avatar>
                              {i.UserName.split(" ")
                                .map((word: any) =>
                                  word.charAt(0).toUpperCase()
                                )
                                .join("")}
                            </Avatar>
                          ) : (
                            <Avatar sx={{ width: 32, height: 32 }} />
                          )}
                          <div>
                            <Typography>{i.UserName}</Typography>
                            <Typography>
                              {i.SubmitedDate}, {i.SubmitedTime}
                            </Typography>
                            <div className="flex items-center justify-center">
                              {i.Message.split(" ").map(
                                (i: any, index: number) => {
                                  if (i.startsWith("@")) {
                                    return (
                                      <span
                                        className="text-secondary"
                                        key={index}
                                      >
                                        &nbsp;
                                        {i.split("[")[1]}
                                        &nbsp;
                                      </span>
                                    );
                                  } else if (i.includes("]")) {
                                    return (
                                      <span
                                        className="text-secondary"
                                        key={index}
                                      >
                                        {i.split("]")[0]}
                                        &nbsp;
                                      </span>
                                    );
                                  } else {
                                    return i;
                                  }
                                }
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {hasPermissionWorklog("Reccuring", "View", "WorkLogs") && (
              <div className="mt-14" id="tabpanel-4">
                <div className="py-[10px] px-8 flex items-center justify-between font-medium border-dashed border-b border-lightSilver">
                  <span className="flex items-center">
                    <HistoryIcon />
                    <span className="ml-[21px]">Recurring</span>
                  </span>

                  <span
                    className={`cursor-pointer ${
                      recurringDrawer ? "rotate-180" : ""
                    }`}
                    onClick={() => setRecurringDrawer(!recurringDrawer)}
                  >
                    <ChevronDownIcon />
                  </span>
                </div>
                {recurringDrawer && (
                  <>
                    <div className="mt-0 pl-6">
                      <div
                        className={`inline-flex mt-[12px] mb-[8px] mx-[6px] muiDatepickerCustomizer w-full max-w-[300px]`}
                      >
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            label={
                              <span>
                                Start Date
                                <span className="!text-defaultRed">
                                  &nbsp;*
                                </span>
                              </span>
                            }
                            maxDate={dayjs(recurringEndDate)}
                            value={
                              recurringStartDate === ""
                                ? null
                                : dayjs(recurringStartDate)
                            }
                            readOnly
                          />
                        </LocalizationProvider>
                      </div>
                      <div
                        className={`inline-flex mt-[12px] mb-[8px] mx-[6px] muiDatepickerCustomizer w-full max-w-[300px]`}
                      >
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            label={
                              <span>
                                End Date
                                <span className="!text-defaultRed">
                                  &nbsp;*
                                </span>
                              </span>
                            }
                            minDate={dayjs(recurringStartDate)}
                            value={
                              recurringEndDate === ""
                                ? null
                                : dayjs(recurringEndDate)
                            }
                            readOnly
                          />
                        </LocalizationProvider>
                      </div>
                    </div>
                    <div className="mt-0 pl-6">
                      <FormControl
                        variant="standard"
                        sx={{ mx: 0.75, minWidth: 145 }}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          {recurringTime === 1 ? (
                            <span>
                              Day
                              <span className="text-defaultRed">&nbsp;*</span>
                            </span>
                          ) : recurringTime === 2 ? (
                            <span>
                              Week
                              <span className="text-defaultRed">&nbsp;*</span>
                            </span>
                          ) : (
                            <span>
                              Month
                              <span className="text-defaultRed">&nbsp;*</span>
                            </span>
                          )}
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={recurringTime === 0 ? "" : recurringTime}
                          readOnly
                        >
                          <MenuItem value={1}>Day</MenuItem>
                          <MenuItem value={2}>Week</MenuItem>
                          <MenuItem value={3}>Month</MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                    {recurringTime === 2 && (
                      <div className="pl-4 m-2 flex">
                        {days.map((day, index) => (
                          <div
                            key={index}
                            className={`px-3 py-1 rounded-[50%] m-[5px] ${
                              selectedDays.includes(index)
                                ? "text-pureWhite bg-secondary"
                                : "text-slatyGrey"
                            }`}
                            onClick={() => toggleColor(index)}
                          >
                            {day[0]}
                          </div>
                        ))}
                      </div>
                    )}
                    {recurringTime === 3 && (
                      <div className="mt-[10px] pl-6">
                        <Autocomplete
                          multiple
                          limitTags={2}
                          id="checkboxes-tags-demo"
                          options={Array.isArray(months) ? months : []}
                          value={
                            Array.isArray(recurringMonth) ? recurringMonth : []
                          }
                          getOptionLabel={(option) => option.label}
                          disableCloseOnSelect
                          onChange={handleMultiSelectMonth}
                          style={{ width: 500 }}
                          readOnly
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label={
                                <span>
                                  Month
                                  <span className="text-defaultRed">
                                    &nbsp;*
                                  </span>
                                </span>
                              }
                              placeholder="Please Select..."
                              variant="standard"
                            />
                          )}
                          sx={{ mx: 0.75, maxWidth: 350, mt: 2 }}
                        />
                      </div>
                    )}
                    <span
                      className={`flex flex-col items-start ${
                        recurringTime === 3 && "mt-2"
                      }`}
                    >
                      <span className="text-darkCharcoal ml-8 text-[14px]">
                        {recurringTime === 1
                          ? "Occurs every day"
                          : recurringTime === 2
                          ? `Occurs every ${selectedDays
                              .sort()
                              .map((day: any) => " " + days[day])} ${
                              selectedDays.length <= 0 && "day"
                            } starting from today`
                          : recurringTime === 3 &&
                            "Occurs every month starting from today"}
                      </span>
                    </span>
                  </>
                )}
              </div>
            )}

            {(isManual === true || isManual === null) && (
              <div className="mt-14" id="tabpanel-5">
                <div className="py-[10px] px-8 flex items-center justify-between font-medium border-dashed border-b border-lightSilver">
                  <span className="flex items-center">
                    <ClockIcon />
                    <span className="ml-[21px]">Manual Time</span>
                  </span>
                  <span
                    className={`cursor-pointer ${
                      manualTimeDrawer ? "rotate-180" : ""
                    }`}
                    onClick={() => setManualTimeDrawer(!manualTimeDrawer)}
                  >
                    <ChevronDownIcon />
                  </span>
                </div>
                {manualTimeDrawer && (
                  <>
                    <div className="-mt-2 pl-6">
                      {manualFields.map((field, index) => (
                        <div key={index}>
                          <div
                            className={`inline-flex mt-[12px] mb-[8px] mx-[6px] muiDatepickerCustomizer w-full max-w-[230px]`}
                          >
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DatePicker
                                label={
                                  <span>
                                    Date
                                    <span className="!text-defaultRed">
                                      &nbsp;*
                                    </span>
                                  </span>
                                }
                                value={
                                  field.inputDate === ""
                                    ? null
                                    : dayjs(field.inputDate)
                                }
                                readOnly
                              />
                            </LocalizationProvider>
                          </div>
                          <TextField
                            label={
                              <span>
                                Start Time
                                <span className="!text-defaultRed">
                                  &nbsp;*
                                </span>
                              </span>
                            }
                            placeholder="00:00:00"
                            fullWidth
                            value={field.startTime}
                            InputProps={{ readOnly: true }}
                            inputProps={{ readOnly: true }}
                            margin="normal"
                            variant="standard"
                            sx={{ mx: 0.75, maxWidth: 230 }}
                          />
                          <TextField
                            label={
                              <span>
                                End Time
                                <span className="!text-defaultRed">
                                  &nbsp;*
                                </span>
                              </span>
                            }
                            placeholder="00:00:00"
                            fullWidth
                            value={field.endTime}
                            InputProps={{ readOnly: true }}
                            inputProps={{ readOnly: true }}
                            margin="normal"
                            variant="standard"
                            sx={{ mx: 0.75, maxWidth: 230 }}
                          />
                          <TextField
                            label={
                              <span>
                                Total Time
                                <span className="!text-defaultRed">
                                  &nbsp;*
                                </span>
                              </span>
                            }
                            type={
                              field.startTime && field.endTime !== ""
                                ? "time"
                                : "text"
                            }
                            InputProps={{ readOnly: true }}
                            inputProps={{ readOnly: true }}
                            fullWidth
                            value={field.totalTime}
                            margin="normal"
                            variant="standard"
                            sx={{ mx: 0.75, maxWidth: 230 }}
                          />
                          <TextField
                            label={
                              <span>
                                Description
                                <span className="!text-defaultRed">
                                  &nbsp;*
                                </span>
                              </span>
                            }
                            className="mt-4"
                            fullWidth
                            value={field.manualDesc}
                            InputProps={{ readOnly: true }}
                            inputProps={{ readOnly: true }}
                            margin="normal"
                            variant="standard"
                            sx={{ mx: 0.75, maxWidth: 230, mt: 2 }}
                          />
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {hasPermissionWorklog("Reminder", "View", "WorkLogs") && (
              <div className="my-14" id="tabpanel-6">
                <div className="py-[10px] px-8 flex items-center justify-between font-medium border-dashed border-b border-lightSilver">
                  <span className="flex items-center">
                    <BellIcon />
                    <span className="ml-[21px]">Reminder</span>
                  </span>
                  <span
                    className={`cursor-pointer ${
                      reminderDrawer ? "rotate-180" : ""
                    }`}
                    onClick={() => setReminderDrawer(!reminderDrawer)}
                  >
                    <ChevronDownIcon />
                  </span>
                </div>
                {reminderDrawer && (
                  <>
                    <div className="mt-2 pl-6">
                      <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        defaultValue={reminderCheckboxValue}
                        name="radio-buttons-group"
                        row={true}
                        className="ml-2 gap-10"
                      >
                        <FormControlLabel
                          value={1}
                          control={<Radio />}
                          label="Due Date"
                          disabled
                        />
                        <FormControlLabel
                          value={2}
                          control={<Radio />}
                          label="Specific Date"
                          disabled
                        />
                        <FormControlLabel
                          value={3}
                          control={<Radio />}
                          label="Daily"
                          disabled
                        />
                        <FormControlLabel
                          value={4}
                          control={<Radio />}
                          label="Days Before Due Date"
                          disabled
                        />
                      </RadioGroup>
                    </div>
                    <div className="pl-6 flex">
                      {reminderCheckboxValue === 2 && onEdit === 0 && (
                        <div
                          className={`inline-flex mt-[0px] mb-[8px] mx-[6px] muiDatepickerCustomizer w-full max-w-[300px]`}
                        >
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              label={
                                <span>
                                  Date
                                  <span className="!text-defaultRed">
                                    &nbsp;*
                                  </span>
                                </span>
                              }
                              value={
                                reminderDate === "" ? null : dayjs(reminderDate)
                              }
                              readOnly
                            />
                          </LocalizationProvider>
                        </div>
                      )}

                      {reminderCheckboxValue === 2 && onEdit > 0 && (
                        <div className="inline-flex mt-[0px] mb-[8px] mx-[6px] muiDatepickerCustomizer w-full max-w-[300px]">
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              label={
                                <span>
                                  Date
                                  <span className="!text-defaultRed">
                                    &nbsp;*
                                  </span>
                                </span>
                              }
                              value={
                                reminderDate === "" ? null : dayjs(reminderDate)
                              }
                              readOnly
                            />
                          </LocalizationProvider>
                        </div>
                      )}

                      <FormControl
                        variant="standard"
                        sx={{ mx: 0.75, minWidth: 100 }}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          Hour
                          <span className="text-defaultRed">&nbsp;*</span>
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={reminderTime === 0 ? "" : reminderTime}
                          readOnly
                        >
                          {Hours.map((i: any, index: number) => (
                            <MenuItem value={i.value} key={index}>
                              {i.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <Autocomplete
                        multiple
                        limitTags={2}
                        id="checkboxes-tags-demo"
                        options={
                          Array.isArray(assigneeDropdownData)
                            ? assigneeDropdownData
                            : []
                        }
                        value={
                          Array.isArray(reminderNotification)
                            ? reminderNotification
                            : []
                        }
                        getOptionLabel={(option) => option.label}
                        disableCloseOnSelect
                        onChange={handleMultiSelect}
                        style={{ width: 500 }}
                        readOnly
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label={
                              <span>
                                Notify user Associated with the task
                                <span className="text-defaultRed">&nbsp;*</span>
                              </span>
                            }
                            variant="standard"
                          />
                        )}
                        sx={{ mx: 0.75, maxWidth: 380, mt: 0.3 }}
                      />
                    </div>
                  </>
                )}
              </div>
            )}

            {hasPermissionWorklog("ErrorLog", "View", "WorkLogs") && (
              <div className="mt-14" id="tabpanel-7">
                <div className="py-[10px] px-8 flex items-center justify-between font-medium border-dashed border-b border-lightSilver">
                  <span className="flex items-center">
                    <TaskIcon />
                    <span className="ml-[21px]">Error Logs</span>
                  </span>
                  <span className="flex items-center">
                    {hasPermissionWorklog("ErrorLog", "Save", "WorkLogs") &&
                      onEdit > 0 && (
                        <Button
                          variant="contained"
                          className="rounded-[4px] !h-[36px] mr-6 !bg-secondary"
                          onClick={handleSubmitErrorLog}
                        >
                          Update
                        </Button>
                      )}
                    <span
                      className={`cursor-pointer ${
                        reviewerErrDrawer ? "rotate-180" : ""
                      }`}
                      onClick={() => setReviewerErrDrawer(!reviewerErrDrawer)}
                    >
                      <ChevronDownIcon />
                    </span>
                  </span>
                </div>
                {reviewerErrDrawer && (
                  <>
                    <div className="mt-3 pl-6">
                      {errorLogFields.map((field, index) => (
                        <div className="w-[100%] mt-4" key={index}>
                          {field.SubmitedBy.length > 0 && (
                            <div className="ml-1 mt-8 mb-3">
                              <span className="font-bold">Correction By</span>
                              <span className="ml-3 mr-10 text-[14px]">
                                {field.SubmitedBy}
                              </span>
                              <span className="font-bold">Reviewer Date</span>
                              <span className="ml-3">{field.SubmitedOn}</span>
                            </div>
                          )}
                          <FormControl
                            variant="standard"
                            sx={{ mx: 0.75, minWidth: 230 }}
                            error={errorTypeErr[index]}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              Error Type
                              <span className="text-defaultRed">&nbsp;*</span>
                            </InputLabel>
                            <Select
                              labelId="demo-simple-select-standard-label"
                              id="demo-simple-select-standard"
                              disabled={
                                (!hasPermissionWorklog(
                                  "ErrorLog",
                                  "Save",
                                  "WorkLogs"
                                ) &&
                                  hasPermissionWorklog(
                                    "ErrorLog",
                                    "Delete",
                                    "WorkLogs"
                                  )) ||
                                field.isSolved
                              }
                              value={
                                field.ErrorType === 0 ? "" : field.ErrorType
                              }
                              onChange={(e) => handleErrorTypeChange(e, index)}
                              onBlur={(e: any) => {
                                if (e.target.value > 0) {
                                  const newErrorTypeErrors = [...errorTypeErr];
                                  newErrorTypeErrors[index] = false;
                                  setErrorTypeErr(newErrorTypeErrors);
                                }
                              }}
                            >
                              <MenuItem value={1}>Internal</MenuItem>
                              <MenuItem value={2}>External</MenuItem>
                            </Select>
                            {errorTypeErr[index] && (
                              <FormHelperText>
                                This is a required field.
                              </FormHelperText>
                            )}
                          </FormControl>
                          <FormControl
                            variant="standard"
                            sx={{ mx: 0.75, minWidth: 230 }}
                            error={rootCauseErr[index]}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              Root Cause
                              <span className="text-defaultRed">&nbsp;*</span>
                            </InputLabel>
                            <Select
                              labelId="demo-simple-select-standard-label"
                              id="demo-simple-select-standard"
                              disabled={
                                (!hasPermissionWorklog(
                                  "ErrorLog",
                                  "Save",
                                  "WorkLogs"
                                ) &&
                                  hasPermissionWorklog(
                                    "ErrorLog",
                                    "Delete",
                                    "WorkLogs"
                                  )) ||
                                field.isSolved
                              }
                              value={
                                field.RootCause === 0 ? "" : field.RootCause
                              }
                              onChange={(e) => handleRootCauseChange(e, index)}
                              onBlur={(e: any) => {
                                if (e.target.value > 0) {
                                  const newRootCauseErrors = [...rootCauseErr];
                                  newRootCauseErrors[index] = false;
                                  setRootCauseErr(newRootCauseErrors);
                                }
                              }}
                            >
                              <MenuItem value={1}>Procedural</MenuItem>
                              <MenuItem value={2}>DataEntry</MenuItem>
                            </Select>
                            {rootCauseErr[index] && (
                              <FormHelperText>
                                This is a required field.
                              </FormHelperText>
                            )}
                          </FormControl>
                          <FormControl
                            variant="standard"
                            sx={{ mx: 0.75, minWidth: 250 }}
                            error={natureOfErr[index]}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              Nature of Error
                              <span className="text-defaultRed">&nbsp;*</span>
                            </InputLabel>
                            <Select
                              labelId="demo-simple-select-standard-label"
                              id="demo-simple-select-standard"
                              disabled={
                                (!hasPermissionWorklog(
                                  "ErrorLog",
                                  "Save",
                                  "WorkLogs"
                                ) &&
                                  hasPermissionWorklog(
                                    "ErrorLog",
                                    "Delete",
                                    "WorkLogs"
                                  )) ||
                                field.isSolved
                              }
                              value={
                                field.NatureOfError === 0
                                  ? ""
                                  : field.NatureOfError
                              }
                              onChange={(e) =>
                                handleNatureOfErrorChange(e, index)
                              }
                              onBlur={(e: any) => {
                                if (e.target.value > 0) {
                                  const newNatureOfErrorErrors = [
                                    ...natureOfErr,
                                  ];
                                  newNatureOfErrorErrors[index] = false;
                                  setNatureOfErr(newNatureOfErrorErrors);
                                }
                              }}
                            >
                              <MenuItem value={1}>
                                Memo/Decriprion Not Updated
                              </MenuItem>
                              <MenuItem value={2}>
                                Forget To Enter Vendor/PayeeName
                              </MenuItem>
                              <MenuItem value={3}>
                                Wrong Categorization Incorrect GST/Sales Tex
                              </MenuItem>
                              <MenuItem value={4}>
                                Deleted Reconciled Transaction
                              </MenuItem>
                              <MenuItem value={5}>
                                File/Report Not Updated Correctly
                              </MenuItem>
                              <MenuItem value={6}>TAT Missed</MenuItem>
                              <MenuItem value={7}>
                                ABC Not Prepared Correctly
                              </MenuItem>
                              <MenuItem value={8}>
                                OSI Not Prepared Correctly
                              </MenuItem>
                              <MenuItem value={9}>
                                Review Check List Not Prepared
                              </MenuItem>
                            </Select>
                            {natureOfErr[index] && (
                              <FormHelperText>
                                This is a required field.
                              </FormHelperText>
                            )}
                          </FormControl>
                          <FormControl
                            variant="standard"
                            sx={{ mx: 0.75, minWidth: 230 }}
                            error={errorLogPriorityErr[index]}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              Priority
                              <span className="text-defaultRed">&nbsp;*</span>
                            </InputLabel>
                            <Select
                              labelId="demo-simple-select-standard-label"
                              id="demo-simple-select-standard"
                              disabled={
                                (!hasPermissionWorklog(
                                  "ErrorLog",
                                  "Save",
                                  "WorkLogs"
                                ) &&
                                  hasPermissionWorklog(
                                    "ErrorLog",
                                    "Delete",
                                    "WorkLogs"
                                  )) ||
                                field.isSolved
                              }
                              value={field.Priority === 0 ? "" : field.Priority}
                              onChange={(e) => handlePriorityChange(e, index)}
                              onBlur={(e: any) => {
                                if (e.target.value > 0) {
                                  const newPriorityErrors = [
                                    ...errorLogPriorityErr,
                                  ];
                                  newPriorityErrors[index] = false;
                                  setErrorLogPriorityErr(newPriorityErrors);
                                }
                              }}
                            >
                              <MenuItem value={1}>High</MenuItem>
                              <MenuItem value={2}>Medium</MenuItem>
                              <MenuItem value={3}>Low</MenuItem>
                            </Select>
                            {errorLogPriorityErr[index] && (
                              <FormHelperText>
                                This is a required field.
                              </FormHelperText>
                            )}
                          </FormControl>
                          <TextField
                            label={
                              <span>
                                Error Count
                                <span className="text-defaultRed">&nbsp;*</span>
                              </span>
                            }
                            type="number"
                            fullWidth
                            disabled={
                              (!hasPermissionWorklog(
                                "ErrorLog",
                                "Save",
                                "WorkLogs"
                              ) &&
                                hasPermissionWorklog(
                                  "ErrorLog",
                                  "Delete",
                                  "WorkLogs"
                                )) ||
                              field.isSolved
                            }
                            value={
                              field.ErrorCount === 0 ? "" : field.ErrorCount
                            }
                            onChange={(e) => handleErrorCountChange(e, index)}
                            onBlur={(e: any) => {
                              if (e.target.value.length > 0) {
                                const newErrorCountErrors = [...errorCountErr];
                                newErrorCountErrors[index] = false;
                                setErrorCountErr(newErrorCountErrors);
                              }
                            }}
                            error={errorCountErr[index]}
                            helperText={
                              errorCountErr[index] && field.ErrorCount < 0
                                ? "Add valid number."
                                : errorCountErr[index] &&
                                  field.ErrorCount.toString().length > 4
                                ? "Maximum 4 numbers allowed."
                                : errorCountErr[index]
                                ? "This is a required field."
                                : ""
                            }
                            margin="normal"
                            variant="standard"
                            sx={{ mx: 0.75, maxWidth: 180, mt: 0 }}
                          />
                          <div className="flex !ml-0">
                            <Autocomplete
                              multiple
                              limitTags={2}
                              id="checkboxes-tags-demo"
                              options={
                                Array.isArray(cCDropdownData)
                                  ? cCDropdownData
                                  : []
                              }
                              disabled={
                                (!hasPermissionWorklog(
                                  "ErrorLog",
                                  "Save",
                                  "WorkLogs"
                                ) &&
                                  hasPermissionWorklog(
                                    "ErrorLog",
                                    "Delete",
                                    "WorkLogs"
                                  )) ||
                                field.isSolved
                              }
                              value={field.CC}
                              onChange={(e, newValue) =>
                                handleCCChange(newValue, index)
                              }
                              style={{ width: 500 }}
                              renderInput={(params) => (
                                <TextField
                                  label={
                                    <span>
                                      cc
                                      <span className="text-defaultRed">
                                        &nbsp;*
                                      </span>
                                    </span>
                                  }
                                  {...params}
                                  variant="standard"
                                  error={ccErr[index]}
                                  helperText={
                                    ccErr[index]
                                      ? "This is a required field."
                                      : ""
                                  }
                                />
                              )}
                              sx={{ mx: 0.75, maxWidth: 230, mt: 1 }}
                            />
                            <TextField
                              label={
                                <span>
                                  Remarks
                                  <span className="text-defaultRed">
                                    &nbsp;*
                                  </span>
                                </span>
                              }
                              fullWidth
                              disabled={
                                (!hasPermissionWorklog(
                                  "ErrorLog",
                                  "Save",
                                  "WorkLogs"
                                ) &&
                                  hasPermissionWorklog(
                                    "ErrorLog",
                                    "Delete",
                                    "WorkLogs"
                                  )) ||
                                field.isSolved
                              }
                              value={
                                field.Remark.trim().length === 0
                                  ? ""
                                  : field.Remark
                              }
                              onChange={(e) => handleRemarksChange(e, index)}
                              onBlur={(e: any) => {
                                if (e.target.value.length > 0) {
                                  const newRemarkErrors = [...remarkErr];
                                  newRemarkErrors[index] = false;
                                  setRemarkErr(newRemarkErrors);
                                }
                              }}
                              error={remarkErr[index]}
                              helperText={
                                remarkErr[index] &&
                                field.Remark.length > 0 &&
                                field.Remark.length < 5
                                  ? "Minumum 5 characters required."
                                  : remarkErr[index] &&
                                    field.Remark.length > 500
                                  ? "Maximum 500 characters allowed."
                                  : remarkErr[index]
                                  ? "This is a required field."
                                  : ""
                              }
                              margin="normal"
                              variant="standard"
                              sx={{ mx: 0.75, maxWidth: 492, mt: 1, mr: 2 }}
                            />
                            {/* <TextField
                              label={
                                <span>
                                  Attachments
                                  <span className="text-defaultRed">
                                    &nbsp;*
                                  </span>
                                </span>
                              }
                              fullWidth
                              disabled={
                                !hasPermissionWorklog(
                                  "ErrorLog",
                                  "Save",
                                  "WorkLogs"
                                ) &&
                                hasPermissionWorklog(
                                  "ErrorLog",
                                  "Delete",
                                  "WorkLogs"
                                )
                              }
                              value={
                                field.Attachments.trim().length === 0
                                  ? ""
                                  : field.Attachments
                              }
                              onChange={(e) =>
                                handleAttachmentsChange(e, index)
                              }
                              onBlur={(e: any) => {
                                if (e.target.value.length > 0) {
                                  const newAttachmentErrors = [
                                    ...attachmentsErr,
                                  ];
                                  newAttachmentErrors[index] = false;
                                  setAttachmentsErr(newAttachmentErrors);
                                }
                              }}
                              error={attachmentsErr[index]}
                              helperText={
                                attachmentsErr[index]
                                  ? "This is a required field."
                                  : ""
                              }
                              margin="normal"
                              variant="standard"
                              sx={{ mx: 0.75, maxWidth: 475, mt: 1 }}
                            /> */}
                            {field.isSolved && (
                              <FormGroup>
                                <FormControlLabel
                                  className="mt-5"
                                  control={
                                    <Checkbox checked={field.isSolved} />
                                  }
                                  label="Is Resolved"
                                />
                              </FormGroup>
                            )}
                            {index === 0 ? (
                              <span
                                className="cursor-pointer"
                                onClick={
                                  hasPermissionWorklog(
                                    "ErrorLog",
                                    "Save",
                                    "WorkLogs"
                                  )
                                    ? addErrorLogField
                                    : undefined
                                }
                              >
                                <svg
                                  className="MuiSvgIcon-root !w-[24px] !h-[24px] !mt-[24px] mx-[10px] MuiSvgIcon-fontSizeMedium css-i4bv87-MuiSvgIcon-root"
                                  focusable="false"
                                  aria-hidden="true"
                                  viewBox="0 0 24 24"
                                  data-testid="AddIcon"
                                >
                                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path>
                                </svg>
                              </span>
                            ) : (
                              <span
                                className="cursor-pointer"
                                onClick={
                                  hasPermissionWorklog(
                                    "ErrorLog",
                                    "Delete",
                                    "WorkLogs"
                                  ) ||
                                  hasPermissionWorklog(
                                    "ErrorLog",
                                    "Save",
                                    "WorkLogs"
                                  )
                                    ? () => removeErrorLogField(index)
                                    : undefined
                                }
                              >
                                <svg
                                  className="MuiSvgIcon-root !w-[24px] !h-[24px] !mt-[24px] mx-[10px] MuiSvgIcon-fontSizeMedium css-i4bv87-MuiSvgIcon-root"
                                  focusable="false"
                                  aria-hidden="true"
                                  viewBox="0 0 24 24"
                                  data-testid="RemoveIcon"
                                >
                                  <path d="M19 13H5v-2h14v2z"></path>
                                </svg>
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            <div className="my-14" id="tabpanel-8">
              <div className="py-[10px] px-8 flex items-center justify-between font-medium border-dashed border-b border-lightSilver">
                <span className="flex items-center">
                  <HistoryIcon />
                  <span className="ml-[21px]">Reviewer&apos;s Note</span>
                </span>
                <span
                  className={`cursor-pointer ${
                    reasonDrawer ? "rotate-180" : ""
                  }`}
                  onClick={() => setReasonDrawer(!reasonDrawer)}
                >
                  <ChevronDownIcon />
                </span>
              </div>
              {reasonDrawer &&
                reviewerNote.length > 0 &&
                reviewerNote.map((i: any, index: number) => (
                  <div className="mt-5 pl-[70px] text-sm">
                    <span className="font-semibold">{i.ReviewedDate}</span>
                    {i.Details.map((j: any, index: number) => (
                      <div className="flex gap-3 mt-4">
                        <span className="mt-2">{index + 1}</span>
                        {j.ReviewerName.length > 0 ? (
                          <Tooltip title={j.ReviewerName} placement="top" arrow>
                            <Avatar>
                              {j.ReviewerName.split(" ")
                                .map((word: any) =>
                                  word.charAt(0).toUpperCase()
                                )
                                .join("")}
                            </Avatar>
                          </Tooltip>
                        ) : (
                          <Tooltip title={j.ReviewerName} placement="top" arrow>
                            <Avatar sx={{ width: 32, height: 32 }} />
                          </Tooltip>
                        )}
                        <div className="flex flex-col items-start">
                          <span>{j.Comment}</span>
                          <span>{j.Status}</span>
                          <span>
                            at&nbsp;
                            {new Date(
                              j.ReviewedDateTime + "Z"
                            ).toLocaleTimeString("en-US", {
                              hour: "numeric",
                              minute: "numeric",
                              hour12: true,
                              timeZone: "Asia/Kolkata",
                            })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
            </div>

            {/* Logs */}
            {/* <div className="mt-14" id="tabpanel-9">
              <div className="py-[10px] px-8 flex items-center justify-between font-medium border-dashed border-b border-lightSilver">
                <span className="flex items-center">
                  <HistoryIcon />
                  <span className="ml-[21px]">Logs</span>
                </span>
                <span
                  className={`cursor-pointer ${logsDrawer ? "rotate-180" : ""}`}
                  onClick={() => setLogsDrawer(!logsDrawer)}
                >
                  <ChevronDownIcon />
                </span>
              </div>
              {logsDrawer && (
                <div className="mt-5 pl-[70px] text-sm">
                  <span className="font-semibold">13/06/2023</span>
                  <div className="flex gap-3 mt-4">
                    <span className="mt-2">1</span>
                    <Avatar
                      alt="Remy Sharp"
                      src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAIgAiAMBEQACEQEDEQH/xAAcAAABBQEBAQAAAAAAAAAAAAAAAQIEBQcDBgj/xAA9EAABAwIDBAYGCAYDAAAAAAABAAIDBBEFBhIhMUFRByJhcYGRFBUjMlKhE0JykqKxwdFDYnOCsuEXMzX/xAAaAQEAAwEBAQAAAAAAAAAAAAAAAQMEBQIG/8QAKhEBAAICAQQBAgUFAAAAAAAAAAECAxEEEiExQVEzcRQiMkJhBRNSgaH/2gAMAwEAAhEDEQA/AGLrOGEAgEAgRAIEJQNQIVAQok0qAhKJNUBCUDSUDUFgvbyEAgECIBAhKBpQIVAQokhKgNJRJqgISgaSgRA0lQLFWPIQCBEAgQlBxqKiKnZqlcB2cT4Lza8U8vdMdrzqqrlxl5NoIgBzebrLbkz6hsrw4/dLh61qr39n93/a8fibrPwmN1jxh4PtYmu+ybL1HJn3Dxbh1/bKbBWQ1GxjrO+F2wq+mSt/DNfDennw7KxUQlQGkoGoEJUBpKJWaseAgRAIGkoK7Fa409oYv+wi5PwhZ8+bp/LXy1cbBF/zW8KNxc5xc5xcTxJusPny6MREdoIiQgEALggg2I4oLjD6v6ZgjkPtGjf8S24cnVHdzeRiiltx4lLJVzOagQlQGkok1QLVWvBEAgQlA1B5isk+kq5nni471zMk7tMuxijppEPV5eyFU4lTNqsQnNJFI3VGxrLvI5m+wLJfkRWdR3a6YJtG5UOP4FXYFVGGsZeNzrRTtHUkHYefYraZK38K70mk91YvbwEAgfES2QWNlZinVoUciu8cramqRINDzZ/5rbEubMO5K9INJUJNUBpKC2VrwECEoGqAIIGVMMbieaoqeVuqFkjpZAeIab28TYLj8i3RFne49erphsy5jpOdRBFUwuhqImSxPFnMe0EHwUxMx3hExE9peUxHo8weqJdSvnoz8MbtTfJ23yIV9eRaPPdTbj1nwrf+M26//WOn+ht/yXv8V/Dx+G/lZUvR3g8UDmTyVM8jhskL9OnuA/W68Tybz4e449dd2bYpQPwvFZ6GQhzoJNOofWG8HxBBW7Dbq1Zhz11W0SZuW9yU2nqNfVkPW5816iUadiiDSUCKBbq54ISgaoCFAAFxDWi5JsAo3rumI3Onp8qZbqcEzFVy1BY+OWnvHIwbAS8Xb3jZ5r5/kZq5I3Hy+k4+Kceon4exWVrCAQCAQZ5mXK1djOZsQqqbQyKOKM6n/wAR4Z7o8ht7VswZq4612xcjDbJ1a+Hhl2XBKglQT6uq/fwPNSh2RBpKC4JVzwaoCIEJRIY8xyNeN7XBw8F5mNxMJrOpiWrxSNmjZLGbse0OB7Cvl5r0zMS+sraLREwcoeggEAgEEfEallFQVFXKbMhjc8nuC90r12ise1eS8UpNp9MLG5fRPmAgEEiKa/VcdvPmpQ6k2RC4VrwQoEKJNKgISiXq8n428SxYXOAWEH6J99rbC+nu3rl87jRqcsf7dXgcqdxhnx6exXJdkIBAIBBm2fsxzVFTPg8DQynheBJIHXMpsDbsAPnZdbh8eKxGSfLi87k2tM4o8R/14xb3OCAQCDvHJfY7fzUoXqtVkKJISoDSUSaoD6eofTVEU8R68bg4eC83rF6zWfb1S00tFo9NVpKiOrpYqiL3JWBw8V81es1tNZ9PqaXi9YtHt2Xl7CAQQ8Xr48LwyorZbaYmEgfE7gPE2CsxY5yXise1WbLGKk2liUsj5pZJZTeSRxe48yTc/Mr6GIiI1D5mZmZ3PmTEAgEAgEHoyVcrISoDSUSaoCEoGkoNMysdWX6LsYR8yvn+X9ez6ThfQqtVmaggEHjuk9xGDUrQTZ1SLi+/qlb/AOn/AFJ+znf1L6cfdmi6zihAIBAIBB6Eq1WQlEmoEJUBpKCDVVzWBzYTd3F3AKjJmivarVi402728NvZQx0NNBFTRhkAjbpA7tv7ri8mJ6+qfbucaYinTHoLO0BAIKjOlBFU5QxGeojaTAwSQuI2tcDvHhs8Vt4kWrPUxcuKXiKyxlrrrqUyxb7uPkwzTv6KrFIQCAQCD0BKteDUHOaVsQBJ2ncFXfJFI3KzHjtknUIrq0/VZ5lUTyPiGqvE+Zcn1Mjgdtu5VzmvK2vGxx6VxGppB4qpe+jMsVQxLLWG1L7OMtMwv+1ax+d1ExE9pTEzE7h2nw8bTC638rllvxv8WinI9WQ2RPfMYmjrjeL7lnjHaba00TesV6k+nw9jTeU6zy4LVTjxH6u7NfkTP6Xm+ler9FydPEDZ1RLHE372o/JpWlnYgz3296b1O0TETGpSNIVsZrQonjUkmjkV7jP8wrni/EmkWKurMTG4ZbVms6kilAQXyteCE2BJ3BRMp8quaQySFx8Oxc+9uq23VxY/7dYgxeFhr9jT3IIqDaOh/EPSctSUbnXfRzOaB/K7rD56vJBBz/jrqmu9W0shENOfauaban23dwv59y14Meo6pb+NiiI6p9vItkka7Ux72u5hxBV+oa9Q0To+x6Sujkw+sldJNENccjjcubyJ5j9Vlz44r3hz+Tiiv5oea6asQ1VeG4a12yNjp5B2nqt/J3ms7KzVvvBBLQCBrhsVuK2p0z8inVXfw5rUwBBekqx4R6t+mE23nYqs1tUaOPTqv9kBYXSCBHi7SEEZzQPrA9yD2/RDiXoeZpKN5AZWwlu/e9vWb8tSDTMzYVh0uEV88tJAJWwPeJWxgPBAve+9W47W6oja7Fe0XiIlkhOy/DiAtzptxpIKeGJvosUccZAIEbQBbwXNmZ9uPMzM92AZ2xP1tmnEalpvG2Uwx/ZZ1QfGxPioQp42tJF3DuQSEAgE2OR3rdWdxEuVevTaYIpeV2SrHhDrXXe1vIXWTkTuYhv4lfyzKMs7WECOF2kc0ERBJw2sfh2I0tdFfXTzNlAHGxvbx3IN8zPVRy5Sq6mF2qOanBYRxDrfurMUbvC3DG8kMk4Le6rT6rHPV/R960LvaNpGtYech6g/EufeNWmHIyxq8wwbv2leHg5gu4BBKQCAQMfvWrDO66YOVXV9mK1nXKseFfO7VK49qwZZ3eXVwxrHEGKtaEAgjzNs+/AoOaDTMIxj03ovfTPfeakmbTm/w6g5vy2f2q3B+uF/GjeSHnVudN0zLjZkyth2DMdtZNJJKOwe4PxHyWLPGrubyo1keRVLO6wDbq8kHdAIBA1+5XYZ7s3KjdIlzWlhf//Z"
                    />
                    <div className="flex flex-col items-start">
                      <span>{splittedText}</span>
                      <span>Accepted Reason</span>
                      <span>at 04:47 pm</span>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <span className="mt-2">2</span>
                    <Avatar />
                    <div className="flex flex-col items-start">
                      <span>{splittedText}</span>
                      <span>Accepted Reason</span>
                      <span>at 04:47 pm</span>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <span className="mt-2">3</span>
                    <Avatar />
                    <div className="flex flex-col items-start">
                      <span>{splittedText}</span>
                      <span>Accepted Reason</span>
                      <span>at 04:47 pm</span>
                    </div>
                  </div>
                </div>
              )}
            </div> */}
          </form>
        </div>
      </div>
    </>
  );
};

export default EditDrawer;
