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
import { Close, Save } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import { useRouter } from "next/navigation";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { MentionsInput, Mention } from "react-mentions";
import mentionsInputStyle from "./mentionsInputStyle";
import { hasPermissionWorklog } from "@/utils/commonFunction";

const EditDrawer = ({
  onOpen,
  onClose,
  onEdit,
  onDataFetch,
  onRecurring,
  onComment,
}: any) => {
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

  const [workItemId, setWorkItemId] = useState(0);

  // Task
  const [clientName, setClientName] = useState<any>(0);
  const [clientNameErr, setClientNameErr] = useState(false);
  const [typeOfWork, setTypeOfWork] = useState<string | number>(0);
  const [typeOfWorkErr, setTypeOfWorkErr] = useState(false);
  const [projectName, setProjectName] = useState<any>(0);
  const [projectNameErr, setProjectNameErr] = useState(false);
  const [processName, setProcessName] = useState<any>(0);
  const [processNameErr, setProcessNameErr] = useState(false);
  const [subProcess, setSubProcess] = useState<any>(0);
  const [subProcessErr, setSubProcessErr] = useState(false);
  const [status, setStatus] = useState<any>(0);
  const [statusErr, setStatusErr] = useState(false);
  const [description, setDescription] = useState<string>("");
  const [descriptionErr, setDescriptionErr] = useState(false);
  const [priority, setPriority] = useState<string | number>(0);
  const [priorityErr, setPriorityErr] = useState(false);
  const [estTime, setEstTime] = useState<string>("");
  const [estTimeErr, setEstTimeErr] = useState(false);
  const [quantity, setQuantity] = useState<any>("");
  const [quantityErr, setQuantityErr] = useState(false);
  const [stdTime, setStdTime] = useState<string>("");
  const [stdTimeErr, setStdTimeErr] = useState(false);
  const [receiverDate, setReceiverDate] = useState<any>("");
  const [receiverDateErr, setReceiverDateErr] = useState(false);
  const [dueDate, setDueDate] = useState<any>("");
  const [dueDateErr, setDueDateErr] = useState(false);
  const [assignee, setAssignee] = useState<any>([]);
  const [assigneeErr, setAssigneeErr] = useState(false);
  const [reviewer, setReviewer] = useState<any>([]);
  const [reviewerErr, setReviewerErr] = useState(false);
  const [dateOfReview, setDateOfReview] = useState<string>("");
  const [dateOfPreperation, setDateOfPreperation] = useState<string>("");
  const [assigneeDisable, setAssigneeDisable] = useState<any>(true);
  const [estTimeData, setEstTimeData] = useState([]);
  const [userId, setUserId] = useState(0);

  // Selected Taxation
  const [typeOfReturn, setTypeOfReturn] = useState<string | number>(0);
  const [typeOfReturnErr, setTypeOfReturnErr] = useState(false);
  const [returnYear, setReturnYear] = useState<string | number>(0);
  const [returnYearErr, setReturnYearErr] = useState(false);
  const [complexity, setComplexity] = useState<string | number>(0);
  const [complexityErr, setComplexityErr] = useState(false);
  const [countYear, setCountYear] = useState<string | number>(0);
  const [countYearErr, setCountYearErr] = useState(false);
  const [noOfPages, setNoOfPages] = useState<any>(0);
  const [noOfPagesErr, setNoOfPagesErr] = useState(false);

  // Sub-Task
  const [subTaskSwitch, setSubTaskSwitch] = useState(false);
  const [subTaskFields, setSubTaskFields] = useState([
    {
      SubtaskId: 0,
      Title: "",
      Description: "",
    },
  ]);
  const [taskNameErr, setTaskNameErr] = useState([false]);
  const [subTaskDescriptionErr, setSubTaskDescriptionErr] = useState([false]);
  const [deletedSubTask, setDeletedSubTask] = useState<any>([]);

  const addTaskField = () => {
    setSubTaskFields([
      ...subTaskFields,
      {
        SubtaskId: 0,
        Title: "",
        Description: "",
      },
    ]);
    setTaskNameErr([...taskNameErr, false]),
      setSubTaskDescriptionErr([...subTaskDescriptionErr, false]);
  };

  const removeTaskField = (index: number) => {
    setDeletedSubTask([...deletedSubTask, subTaskFields[index].SubtaskId]);

    const newTaskFields = [...subTaskFields];
    newTaskFields.splice(index, 1);
    setSubTaskFields(newTaskFields);

    const newTaskErrors = [...taskNameErr];
    newTaskErrors.splice(index, 1);
    setTaskNameErr(newTaskErrors);

    const newSubTaskDescriptionErrors = [...subTaskDescriptionErr];
    newSubTaskDescriptionErrors.splice(index, 1);
    setSubTaskDescriptionErr(newSubTaskDescriptionErrors);
  };

  const handleSubTaskChange = (e: any, index: number) => {
    const newTaskFields = [...subTaskFields];
    newTaskFields[index].Title = e.target.value;
    setSubTaskFields(newTaskFields);

    const newTaskErrors = [...taskNameErr];
    newTaskErrors[index] = e.target.value.trim().length === 0;
    setTaskNameErr(newTaskErrors);
  };

  const handleSubTaskDescriptionChange = (e: any, index: number) => {
    const newTaskFields = [...subTaskFields];
    newTaskFields[index].Description = e.target.value;
    setSubTaskFields(newTaskFields);

    const newSubTaskDescErrors = [...subTaskDescriptionErr];
    newSubTaskDescErrors[index] = e.target.value.trim().length === 0;
    setSubTaskDescriptionErr(newSubTaskDescErrors);
  };

  // Recurring
  const [recurringSwitch, setRecurringSwitch] = useState(false);
  const [recurringStartDate, setRecurringStartDate] = useState("");
  const [recurringStartDateErr, setRecurringStartDateErr] = useState(false);
  const [recurringEndDate, setRecurringEndDate] = useState("");
  const [recurringEndDateErr, setRecurringEndDateErr] = useState(false);
  const [recurringTime, setRecurringTime] = useState<any>(1);
  const [recurringMonth, setRecurringMonth] = useState<any>(0);
  const [recurringMonthErr, setRecurringMonthErr] = useState(false);
  const [recurringWeekErr, setRecurringWeekErr] = useState(false);

  // Manula
  const [manualSwitch, setManualSwitch] = useState(false);
  const [deletedManualTime, setDeletedManualTime] = useState<any>([]);

  // ErrorLog
  const [errorLogData, setErrorLogData] = useState([]);

  const [isManual, setIsManual] = useState<any>(null);

  // Reminder
  const [reminderSwitch, setReminderSwitch] = useState(false);
  const [reminderDate, setReminderDate] = useState("");
  const [reminderDateErr, setReminderDateErr] = useState(false);
  const [reminderTime, setReminderTime] = useState<any>(0);
  const [reminderTimeErr, setReminderTimeErr] = useState(false);
  const [reminderNotification, setReminderNotification] = useState<any>([]);
  const [reminderNotificationErr, setReminderNotificationErr] = useState(false);

  const [reminderCheckboxValue, setReminderCheckboxValue] = useState<any>(1);
  const [reminderId, setReminderId] = useState(0);

  // CheclkList
  const [generalOpen, setGeneralOpen] = useState(true);
  const [addChecklistField, setAddChecklistField] = useState(false);
  const [checkListName, setCheckListName] = useState("");
  const [checkListNameError, setCheckListNameError] = useState(false);
  const [checkListData, setCheckListData] = useState([]);
  const [itemStates, setItemStates] = useState<any>({});

  // Comments
  const [commentSelect, setCommentSelect] = useState<number | string>(1);

  // Dropdowns
  const [clientDropdownData, setClientDropdownData] = useState([]);
  const [workTypeDropdownData, setWorkTypeDropdownData] = useState([]);
  const [projectDropdownData, setProjectDropdownData] = useState([]);
  const [processDropdownData, setProcessDropdownData] = useState([]);
  const [subProcessDropdownData, setSubProcessDropdownData] = useState([]);
  const [statusDropdownData, setStatusDropdownData] = useState<any>([]);
  const [statusDropdownDataUse, setStatusDropdownDataUse] = useState([]);
  const [assigneeDropdownData, setAssigneeDropdownData] = useState<any>([]);
  const [reviewerDropdownData, setReviewerDropdownData] = useState([]);
  const [cCDropdownData, setCCDropdownData] = useState<any>([]);

  const [selectedDays, setSelectedDays] = useState<any>([]);

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

  const currentYear = new Date().getFullYear();
  const Years = [];

  for (let year = 2010; year <= currentYear; year++) {
    Years.push({ label: String(year), value: year });
  }

  useEffect(() => {
    onRecurring && scrollToPanel(4);
    onComment && scrollToPanel(3);
  }, [onOpen, onComment, onRecurring]);

  let Task;
  {
    onEdit > 0
      ? (Task = [
          hasPermissionWorklog("Task/SubTask", "View", "WorkLogs") && "TASK",
          hasPermissionWorklog("Task/SubTask", "View", "WorkLogs") &&
            "SUB-TASK",
          hasPermissionWorklog("CheckList", "View", "WorkLogs") && "CHECKLIST",
          hasPermissionWorklog("Comment", "View", "WorkLogs") && "COMMENTS",
          hasPermissionWorklog("Reccuring", "View", "WorkLogs") && "RECURRING",
          (isManual === true || isManual === null) && "MANUAL TIME",
          hasPermissionWorklog("Reminder", "View", "WorkLogs") && "REMINDER",
          hasPermissionWorklog("ErrorLog", "View", "WorkLogs") && "ERROR LOGS",
          "REVIEWER'S NOTE",
          "LOGS",
        ])
      : (Task = [
          hasPermissionWorklog("Task/SubTask", "View", "WorkLogs") && "TASK",
          hasPermissionWorklog("Task/SubTask", "View", "WorkLogs") &&
            "SUB-TASK",
          hasPermissionWorklog("Reccuring", "View", "WorkLogs") && "RECURRING",
          "MANUAL TIME",
          hasPermissionWorklog("Reminder", "View", "WorkLogs") && "REMINDER",
        ]);
  }

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
  const [inputDateErrors, setInputDateErrors] = useState([false]);
  const [startTimeErrors, setStartTimeErrors] = useState([false]);
  const [endTimeErrors, setEndTimeErrors] = useState([false]);
  const [manualDescErrors, setManualDescErrors] = useState([false]);
  const [inputTypeDate, setInputTypeDate] = useState(["text"]);
  const [inputTypeStartTime, setInputTypeStartTime] = useState(["text"]);
  const [inputTypeEndTime, setInputTypeEndTime] = useState(["text"]);

  const addManulaField = () => {
    setManualFields([
      ...manualFields,
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
    setInputDateErrors([...inputDateErrors, false]),
      setStartTimeErrors([...startTimeErrors, false]);
    setEndTimeErrors([...endTimeErrors, false]);
    setManualDescErrors([...manualDescErrors, false]);
    setInputTypeDate([...inputTypeDate, "text"]);
    setInputTypeStartTime([...inputTypeStartTime, "text"]);
    setInputTypeEndTime([...inputTypeEndTime, "text"]);
  };

  const removePhoneField = (index: number) => {
    setDeletedManualTime([...deletedManualTime, manualFields[index].Id]);

    const newManualFields = [...manualFields];
    newManualFields.splice(index, 1);
    setManualFields(newManualFields);

    const newInputDateErrors = [...inputDateErrors];
    newInputDateErrors.splice(index, 1);
    setInputDateErrors(newInputDateErrors);

    const newStartTimeErrors = [...startTimeErrors];
    newStartTimeErrors.splice(index, 1);
    setStartTimeErrors(newStartTimeErrors);

    const newEndTimeErrors = [...endTimeErrors];
    newEndTimeErrors.splice(index, 1);
    setEndTimeErrors(newEndTimeErrors);

    const newManualDescErrors = [...manualDescErrors];
    newManualDescErrors.splice(index, 1);
    setManualDescErrors(newManualDescErrors);

    const newManualDate = [...inputTypeDate];
    newManualDate.splice(index, 1);
    setInputTypeDate(newManualDate);
  };

  const handleInputDateChange = (e: any, index: number) => {
    const newManualFields = [...manualFields];
    newManualFields[index].inputDate = e;
    setManualFields(newManualFields);

    const newInputDateErrors = [...inputDateErrors];
    newInputDateErrors[index] = e.length === 0;
    setInputDateErrors(newInputDateErrors);
  };

  const handleEstTimeChange = (e: any) => {
    let newValue = e.target.value;
    newValue = newValue.replace(/[^0-9]/g, "");
    if (newValue.length > 8) {
      return;
    }

    let formattedValue = "";
    if (newValue.length >= 1) {
      const hours = parseInt(newValue.slice(0, 2));
      if (hours >= 0 && hours <= 23) {
        formattedValue = newValue.slice(0, 2);
      } else {
        formattedValue = "23";
      }
    }

    if (newValue.length >= 3) {
      const minutes = parseInt(newValue.slice(2, 4));
      if (minutes >= 0 && minutes <= 59) {
        formattedValue += ":" + newValue.slice(2, 4);
      } else {
        formattedValue += ":59";
      }
    }

    if (newValue.length >= 5) {
      const seconds = parseInt(newValue.slice(4, 6));
      if (seconds >= 0 && seconds <= 59) {
        formattedValue += ":" + newValue.slice(4, 6);
      } else {
        formattedValue += ":59";
      }
    }
    return formattedValue;
  };

  const handleStartTimeChange = (e: any, index: number) => {
    const newManualFields: any = [...manualFields];
    newManualFields[index].startTime = handleEstTimeChange(e);
    setManualFields(newManualFields);

    const startDate = newManualFields[index].startTime;
    const endDate = newManualFields[index].endTime;
    if (startDate && endDate) {
      const startTime = newManualFields[index].startTime;
      const endTime = newManualFields[index].endTime;
      if (startTime && endTime) {
        const startTimeArray = startTime.split(":");
        const endTimeArray = endTime.split(":");

        const startSeconds =
          parseInt(startTimeArray[0]) * 3600 +
          parseInt(startTimeArray[1]) * 60 +
          parseInt(startTimeArray[2]);
        const endSeconds =
          parseInt(endTimeArray[0]) * 3600 +
          parseInt(endTimeArray[1]) * 60 +
          parseInt(endTimeArray[2]);
        const totalSeconds = endSeconds - startSeconds;

        if (totalSeconds >= 0) {
          const totalHours = Math.floor(totalSeconds / 3600);
          const totalMinutes = Math.floor((totalSeconds % 3600) / 60);
          const totalSecondsRemaining = totalSeconds % 60;
          const formattedTotalTime = `${totalHours
            .toString()
            .padStart(2, "0")}:${totalMinutes
            .toString()
            .padStart(2, "0")}:${totalSecondsRemaining
            .toString()
            .padStart(2, "0")}`;

          newManualFields[index].totalTime = formattedTotalTime;
          setManualFields(newManualFields);
        }
      }
    }
  };

  const handleEndTimeChange = (e: any, index: number) => {
    const newManualFields: any = [...manualFields];
    newManualFields[index].endTime = handleEstTimeChange(e);
    setManualFields(newManualFields);

    const startDate = newManualFields[index].startTime;
    const endDate = newManualFields[index].endTime;
    if (startDate && endDate) {
      const startTime = newManualFields[index].startTime;
      const endTime = newManualFields[index].endTime;
      if (startTime && endTime) {
        const startTimeArray = startTime.split(":");
        const endTimeArray = endTime.split(":");

        const startSeconds =
          parseInt(startTimeArray[0]) * 3600 +
          parseInt(startTimeArray[1]) * 60 +
          parseInt(startTimeArray[2]);
        const endSeconds =
          parseInt(endTimeArray[0]) * 3600 +
          parseInt(endTimeArray[1]) * 60 +
          parseInt(endTimeArray[2]);
        const totalSeconds = endSeconds - startSeconds;

        if (totalSeconds >= 0) {
          const totalHours = Math.floor(totalSeconds / 3600);
          const totalMinutes = Math.floor((totalSeconds % 3600) / 60);
          const totalSecondsRemaining = totalSeconds % 60;
          const formattedTotalTime = `${totalHours
            .toString()
            .padStart(2, "0")}:${totalMinutes
            .toString()
            .padStart(2, "0")}:${totalSecondsRemaining
            .toString()
            .padStart(2, "0")}`;

          newManualFields[index].totalTime = formattedTotalTime;
          setManualFields(newManualFields);
        }
      }
    }
  };

  const handleManualDescChange = (e: any, index: number) => {
    const newManualFields = [...manualFields];
    newManualFields[index].manualDesc = e.target.value;
    setManualFields(newManualFields);

    const newManualDescErrors = [...manualDescErrors];
    newManualDescErrors[index] = e.target.value.trim().length === 0;
    setManualDescErrors(newManualDescErrors);
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    const validateField = (value: any) => {
      if (
        value === 0 ||
        value === "" ||
        value === null ||
        (Array.isArray(value) && value.length === 0)
      ) {
        return true;
      }
      return false;
    };

    const fieldValidations = {
      clientName: validateField(clientName),
      typeOfWork: validateField(typeOfWork),
      projectName: validateField(projectName),
      processName: validateField(processName),
      subProcess: validateField(subProcess),
      // status: validateField(status),
      description: validateField(description),
      priority: validateField(priority),
      quantity: validateField(quantity),
      receiverDate: validateField(receiverDate),
      dueDate: validateField(dueDate),
      assignee: assigneeDisable && validateField(assignee),
      reviewer: validateField(reviewer),
      typeOfReturn: typeOfWork === 3 && validateField(typeOfReturn),
      returnYear: typeOfWork === 3 && validateField(returnYear),
      complexity: typeOfWork === 3 && validateField(complexity),
      countYear: typeOfWork === 3 && validateField(countYear),
      noOfPages: typeOfWork === 3 && validateField(noOfPages),
      recurringStartDate: recurringSwitch && validateField(recurringStartDate),
      recurringEndDate: recurringSwitch && validateField(recurringEndDate),
      recurringMonth:
        recurringSwitch && recurringTime === 3 && validateField(recurringMonth),
      selectedDays:
        recurringSwitch && recurringTime === 2 && validateField(selectedDays),
      reminderTime: reminderSwitch && validateField(reminderTime),
      reminderNotification:
        reminderSwitch && validateField(reminderNotification),
      reminderDate:
        reminderSwitch &&
        reminderCheckboxValue === 2 &&
        validateField(reminderDate),
    };

    setClientNameErr(fieldValidations.clientName);
    setTypeOfWorkErr(fieldValidations.typeOfWork);
    setProjectNameErr(fieldValidations.projectName);
    setProcessNameErr(fieldValidations.processName);
    setSubProcessErr(fieldValidations.subProcess);
    // setStatusErr(fieldValidations.status);
    setDescriptionErr(fieldValidations.description);
    setPriorityErr(fieldValidations.priority);
    setQuantityErr(fieldValidations.quantity);
    setReceiverDateErr(fieldValidations.receiverDate);
    setDueDateErr(fieldValidations.dueDate);
    assigneeDisable && setAssigneeErr(fieldValidations.assignee);
    setReviewerErr(fieldValidations.reviewer);
    typeOfWork === 3 && setTypeOfReturnErr(fieldValidations.typeOfReturn);
    typeOfWork === 3 && setReturnYearErr(fieldValidations.returnYear);
    typeOfWork === 3 && setComplexityErr(fieldValidations.complexity);
    typeOfWork === 3 && setCountYearErr(fieldValidations.countYear);
    // typeOfWork === 3 && setNoOfPagesErr(fieldValidations.noOfPages);
    onEdit === 0 &&
      recurringSwitch &&
      setRecurringStartDateErr(fieldValidations.recurringStartDate);
    onEdit === 0 &&
      recurringSwitch &&
      setRecurringEndDateErr(fieldValidations.recurringEndDate);
    onEdit === 0 &&
      recurringSwitch &&
      recurringTime === 3 &&
      setRecurringMonthErr(fieldValidations.recurringMonth);
    onEdit === 0 &&
      recurringSwitch &&
      recurringTime === 2 &&
      setRecurringWeekErr(fieldValidations.selectedDays);
    onEdit === 0 &&
      reminderSwitch &&
      setReminderTimeErr(fieldValidations.reminderTime);
    onEdit === 0 &&
      reminderSwitch &&
      setReminderNotificationErr(fieldValidations.reminderNotification);
    onEdit === 0 &&
      reminderSwitch &&
      reminderCheckboxValue === 2 &&
      setReminderDateErr(fieldValidations.reminderDate);

    onEdit === 0 &&
      receiverDate.length > 0 &&
      dueDate.length > 0 &&
      setDueDateErr(dayjs(receiverDate) > dayjs(dueDate));
    setDescriptionErr(
      description.trim().length < 5 || description.trim().length > 500
    );
    setQuantityErr(
      quantity.length <= 0 ||
        quantity.length > 4 ||
        quantity <= 0 ||
        quantity.toString().includes(".")
    );
    setNoOfPagesErr(
      (typeOfWork === 3 && noOfPages.toString().length <= 0) ||
        (typeOfWork === 3 && noOfPages.toString().length > 4) ||
        (typeOfWork === 3 && noOfPages <= 0)
    );

    const hasErrors = Object.values(fieldValidations).some((error) => error);

    const fieldValidationsEdit = {
      clientName: validateField(clientName),
      typeOfWork: validateField(typeOfWork),
      projectName: validateField(projectName),
      processName: validateField(processName),
      subProcess: validateField(subProcess),
      status: validateField(status),
      description: validateField(description),
      priority: validateField(priority),
      quantity: validateField(quantity),
      receiverDate: validateField(receiverDate),
      dueDate: validateField(dueDate),
      assignee: validateField(assignee),
      reviewer: validateField(reviewer),
      typeOfReturn: typeOfWork === 3 && validateField(typeOfReturn),
      returnYear: typeOfWork === 3 && validateField(returnYear),
      complexity: typeOfWork === 3 && validateField(complexity),
      countYear: typeOfWork === 3 && validateField(countYear),
      noOfPages: typeOfWork === 3 && validateField(noOfPages),
    };

    const hasEditErrors = Object.values(fieldValidationsEdit).some(
      (error) => error
    );

    // Sub-Task
    let hasSubErrors = false;
    const newTaskErrors = subTaskFields.map(
      (field) =>
        (onEdit === 0 && subTaskSwitch && field.Title.trim().length < 5) ||
        (onEdit === 0 && subTaskSwitch && field.Title.trim().length > 500)
    );
    subTaskSwitch && setTaskNameErr(newTaskErrors);
    const newSubTaskDescErrors = subTaskFields.map(
      (field) =>
        (onEdit === 0 &&
          subTaskSwitch &&
          field.Description.trim().length < 5) ||
        (onEdit === 0 && subTaskSwitch && field.Description.trim().length > 500)
    );
    subTaskSwitch && setSubTaskDescriptionErr(newSubTaskDescErrors);
    hasSubErrors =
      newTaskErrors.some((error) => error) ||
      newSubTaskDescErrors.some((error) => error);

    // Maual
    let hasManualErrors = false;
    const newInputDateErrors = manualFields.map(
      (field) => onEdit === 0 && manualSwitch && field.inputDate === ""
    );
    manualSwitch && setInputDateErrors(newInputDateErrors);
    const newStartTimeErrors = manualFields.map(
      (field) =>
        onEdit === 0 && manualSwitch && field.startTime.trim().length === 0
    );
    manualSwitch && setStartTimeErrors(newStartTimeErrors);
    const newEndTimeErrors = manualFields.map(
      (field) =>
        (onEdit === 0 && manualSwitch && field.endTime.trim().length === 0) ||
        (onEdit === 0 && manualSwitch && field.endTime <= field.startTime)
    );
    manualSwitch && setEndTimeErrors(newEndTimeErrors);
    const newManualDescErrors = manualFields.map(
      (field) =>
        (onEdit === 0 && manualSwitch && field.manualDesc.trim().length < 5) ||
        (onEdit === 0 && manualSwitch && field.manualDesc.trim().length > 500)
    );
    manualSwitch && setManualDescErrors(newManualDescErrors);
    hasManualErrors =
      newInputDateErrors.some((error) => error) ||
      newStartTimeErrors.some((error) => error) ||
      newEndTimeErrors.some((error) => error) ||
      newManualDescErrors.some((error) => error);

    const data = {
      WorkItemId: onEdit > 0 ? onEdit : 0,
      ClientId: clientName,
      WorkTypeId: typeOfWork,
      ProjectId: projectName,
      ProcessId: processName,
      SubProcessId: subProcess,
      StatusId: status,
      Priority: priority,
      Quantity: quantity,
      Description: description.trim(),
      ReceiverDate: dayjs(receiverDate).format("YYYY/MM/DD"),
      DueDate: dayjs(dueDate).format("YYYY/MM/DD"),
      AssignedId: assignee,
      ReviewerId: reviewer,
      TypeOfReturnId: typeOfReturn === 0 ? null : typeOfReturn,
      TaxCustomFields:
        typeOfReturn === 0
          ? null
          : {
              ReturnYear: returnYear,
              Complexity: complexity,
              CountYear: countYear,
              NoOfPages: noOfPages,
            },
      ManualTimeList:
        onEdit > 0
          ? null
          : manualSwitch
          ? manualFields.map(
              (i: any) =>
                new Object({
                  Date: i.inputDate,
                  startTime:
                    dayjs(i.inputDate).format("YYYY/MM/DD") + " " + i.startTime,
                  endTime:
                    dayjs(i.inputDate).format("YYYY/MM/DD") + " " + i.endTime,
                  comment: i.manualDesc,
                })
            )
          : null,
      SubTaskList:
        onEdit > 0
          ? null
          : subTaskSwitch
          ? subTaskFields.map(
              (i: any) =>
                new Object({
                  SubtaskId: i.SubtaskId,
                  Title: i.Title.trim(),
                  Description: i.Description.trim(),
                })
            )
          : null,
      RecurringObj:
        onEdit > 0
          ? null
          : recurringSwitch
          ? {
              Type: recurringTime,
              IsActive: true,
              StartDate: dayjs(recurringStartDate).format("YYYY/MM/DD"),
              EndDate: dayjs(recurringEndDate).format("YYYY/MM/DD"),
              triggerIdList:
                recurringTime === 1
                  ? []
                  : recurringTime === 2
                  ? selectedDays
                  : recurringMonth.map((i: any) => i.value),
            }
          : null,
      ReminderObj:
        onEdit > 0
          ? null
          : reminderSwitch
          ? {
              Type: reminderCheckboxValue,
              IsActive: true,
              ReminderDate: reminderDate.length > 0 ? reminderDate : null,
              ReminderTime: reminderTime,
              ReminderUserList: reminderNotification.map((i: any) => i.value),
            }
          : null,
    };

    const saveWorklog = async () => {
      const token = await localStorage.getItem("token");
      const Org_Token = await localStorage.getItem("Org_Token");
      try {
        const response = await axios.post(
          `${process.env.worklog_api_url}/workitem/saveworkitem`,
          data,
          {
            headers: {
              Authorization: `bearer ${token}`,
              org_token: `${Org_Token}`,
            },
          }
        );

        if (response.status === 200) {
          if (response.data.ResponseStatus === "Success") {
            toast.success(
              `Worklog ${onEdit > 0 ? "Updated" : "created"} successfully.`
            );
            onEdit > 0 && getEditData();
            onEdit > 0 && typeOfWork === 3 && getCheckListData();
            onEdit === 0 && onClose();
            onEdit === 0 && handleClose();
          } else {
            const data = response.data.Message;
            onEdit > 0 && getEditData();
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
    };

    if (
      onEdit === 0 &&
      typeOfWork !== 3 &&
      !hasErrors &&
      !hasSubErrors &&
      !hasManualErrors &&
      !dueDateErr &&
      description.trim().length > 4 &&
      description.trim().length < 500 &&
      !descriptionErr &&
      !quantityErr &&
      quantity > 0 &&
      quantity < 10000 &&
      !quantity.includes(".")
    ) {
      saveWorklog();
    }

    if (
      onEdit === 0 &&
      typeOfWork === 3 &&
      !hasErrors &&
      !hasSubErrors &&
      !hasManualErrors &&
      !dueDateErr &&
      description.trim().length > 4 &&
      description.trim().length < 500 &&
      !descriptionErr &&
      !quantityErr &&
      quantity > 0 &&
      quantity < 10000 &&
      !quantity.includes(".") &&
      !noOfPagesErr &&
      noOfPages > 0 &&
      noOfPages < 10000
    ) {
      saveWorklog();
    }

    if (
      (onEdit > 0 && status === 7) ||
      (onEdit > 0 && status === 8) ||
      (onEdit > 0 && status === 9)
    ) {
      toast.warning(
        "Cannot change task for status 'Accept,' 'Reject,' or 'Accept with Notes'."
      );
      getEditData();
    } else if (
      onEdit > 0 &&
      status !== 7 &&
      status !== 8 &&
      status !== 9 &&
      typeOfWork !== 3 &&
      !hasEditErrors &&
      !descriptionErr &&
      description.trim().length > 4 &&
      description.trim().length < 500 &&
      !dueDateErr &&
      quantity > 0 &&
      quantity < 10000 &&
      !quantityErr &&
      !quantity.toString().includes(".")
    ) {
      saveWorklog();
    } else if (
      onEdit > 0 &&
      status !== 7 &&
      status !== 8 &&
      status !== 9 &&
      typeOfWork === 3 &&
      !hasEditErrors &&
      !descriptionErr &&
      description.trim().length > 4 &&
      description.trim().length < 500 &&
      !dueDateErr &&
      quantity > 0 &&
      quantity < 10000 &&
      !quantityErr &&
      !quantity.toString().includes(".") &&
      !noOfPagesErr &&
      noOfPages > 0 &&
      noOfPages < 10000
    ) {
      saveWorklog();
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

  const fileInputRef = useRef<HTMLInputElement>(null);

  // OnEdit
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
          setSubTaskSwitch(
            data.length <= 0
              ? !hasPermissionWorklog("Task/SubTask", "save", "WorkLogs") &&
                  false
              : hasPermissionWorklog("Task/SubTask", "save", "WorkLogs") && true
          );
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
      if (error.response && error.response?.status === 401) {
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
          setRecurringSwitch(
            data.length <= 0
              ? !hasPermissionWorklog("Reccuring", "save", "WorkLogs") && false
              : hasPermissionWorklog("Reccuring", "save", "WorkLogs") && true
          );
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
      if (error.response && error.response?.status === 401) {
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
          setManualSwitch(data.length <= 0 ? false : true);
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
      if (error.response && error.response?.status === 401) {
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
          setReminderId(data.ReminderId);
          setReminderSwitch(
            data === null
              ? !hasPermissionWorklog("Reminder", "save", "WorkLogs") && false
              : hasPermissionWorklog("Reminder", "save", "WorkLogs") && true
          );
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
      if (error.response && error.response?.status === 401) {
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
          setErrorLogData(response.data.ResponseData);
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
      if (error.response && error.response?.status === 401) {
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
      if (error.response && error.response?.status === 401) {
        router.push("/login");
        localStorage.clear();
      }
    }
  };

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
          data.StatusId === 2 && data.IsManual === true
            ? setStatusDropdownDataUse(
                statusDropdownData
                  .map((i: any) =>
                    i.Type === "OnHoldFromClient" ||
                    i.Type === "WithDraw" ||
                    i.Type === "Stop" ||
                    i.value === data.StatusId
                      ? i
                      : ""
                  )
                  .filter((i: any) => i !== "")
              )
            : data.StatusId === 2
            ? setStatusDropdownDataUse(
                statusDropdownData
                  .map((i: any) =>
                    i.Type === "OnHoldFromClient" ||
                    i.Type === "WithDraw" ||
                    i.value === data.StatusId
                      ? i
                      : ""
                  )
                  .filter((i: any) => i !== "")
              )
            : setStatusDropdownDataUse(
                statusDropdownData
                  .map((i: any) =>
                    i.Type === "OnHoldFromClient" ||
                    i.Type === "WithDraw" ||
                    i.value === data.StatusId
                      ? i
                      : ""
                  )
                  .filter((i: any) => i !== "")
              );
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
            data.TypeOfReturnId === 0 ? null : data.TaxCustomFields.ReturnYear
          );
          setComplexity(
            data.TypeOfReturnId === 0 ? null : data.TaxCustomFields.Complexity
          );
          setCountYear(
            data.TypeOfReturnId === 0 ? null : data.TaxCustomFields.CountYear
          );
          setNoOfPages(
            data.TypeOfReturnId === 0 ? null : data.TaxCustomFields.NoOfPages
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
      if (error.response && error.response?.status === 401) {
        router.push("/login");
        localStorage.clear();
      }
    }
  };

  const onEditData = () => {
    if (onEdit > 0) {
      getEditData();
      getWorklogData();
      getRecurringData();
      getManualData();
      getCheckListData();
      getCommentData(1);
      getReminderData();
      getReviewerNoteData();
    }
  };

  useEffect(() => {
    onEdit > 0 && assigneeDropdownData.length > 0 && getErrorLogData();
  }, [assigneeDropdownData]);

  // Edit Update Button Click
  const handleSubmitSubTask = async () => {
    if (status === 7 || status === 8 || status === 9) {
      toast.warning(
        "Cannot change task for status 'Accept,' 'Reject,' or 'Accept with Notes'."
      );
      getWorklogData();
    } else {
      let hasSubErrors = false;
      const newTaskErrors = subTaskFields.map(
        (field) =>
          (subTaskSwitch && field.Title.trim().length < 5) ||
          (subTaskSwitch && field.Title.trim().length > 500)
      );
      subTaskSwitch && setTaskNameErr(newTaskErrors);
      const newSubTaskDescErrors = subTaskFields.map(
        (field) =>
          (subTaskSwitch && field.Description.trim().length < 5) ||
          (subTaskSwitch && field.Description.trim().length > 500)
      );
      subTaskSwitch && setSubTaskDescriptionErr(newSubTaskDescErrors);
      hasSubErrors =
        newTaskErrors.some((error) => error) ||
        newSubTaskDescErrors.some((error) => error);

      if (!hasSubErrors) {
        const token = await localStorage.getItem("token");
        const Org_Token = await localStorage.getItem("Org_Token");
        try {
          const response = await axios.post(
            `${process.env.worklog_api_url}/workitem/subtask/savebyworkitem`,
            {
              workitemId: onEdit,
              subtasks: subTaskSwitch
                ? subTaskFields.map(
                    (i: any) =>
                      new Object({
                        SubtaskId: i.SubtaskId,
                        Title: i.Title.trim(),
                        Description: i.Description.trim(),
                      })
                  )
                : null,
              deletedWorkitemSubtaskIds: deletedSubTask,
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
              toast.success(`Sub Task Updated successfully.`);
              setDeletedSubTask([]);
              setSubTaskFields([
                {
                  SubtaskId: 0,
                  Title: "",
                  Description: "",
                },
              ]);
              getWorklogData();
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
    }
  };

  const handleSubmitRecurring = async () => {
    const validateField = (value: any) => {
      if (
        value === 0 ||
        value === "" ||
        value === null ||
        (Array.isArray(value) && value.length === 0)
      ) {
        return true;
      }
      return false;
    };

    const fieldValidations = {
      recurringStartDate: recurringSwitch && validateField(recurringStartDate),
      recurringEndDate: recurringSwitch && validateField(recurringEndDate),
      recurringMonth:
        recurringSwitch && recurringTime === 3 && validateField(recurringMonth),
      selectedDays:
        recurringSwitch && recurringTime === 2 && validateField(selectedDays),
    };

    recurringSwitch &&
      setRecurringStartDateErr(fieldValidations.recurringStartDate);
    recurringSwitch &&
      setRecurringEndDateErr(fieldValidations.recurringEndDate);
    recurringSwitch &&
      recurringTime === 3 &&
      setRecurringMonthErr(fieldValidations.recurringMonth);
    recurringSwitch &&
      recurringTime === 2 &&
      setRecurringWeekErr(fieldValidations.selectedDays);

    const hasErrors = Object.values(fieldValidations).some((error) => error);

    if (!hasErrors) {
      const token = await localStorage.getItem("token");
      const Org_Token = await localStorage.getItem("Org_Token");
      try {
        const response = await axios.post(
          `${process.env.worklog_api_url}/workitem/recurring/savebyworkitem`,
          {
            WorkitemId: onEdit,
            Type: recurringTime,
            StartDate: dayjs(recurringStartDate).format("YYYY/MM/DD"),
            EndDate: dayjs(recurringEndDate).format("YYYY/MM/DD"),
            Triggers:
              recurringTime === 1
                ? []
                : recurringTime === 2
                ? selectedDays
                : recurringMonth.map((i: any) => i.value),
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
            toast.success(`Recurring Updated successfully.`);
            setDeletedSubTask([]);
            getRecurringData();
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

  const handleSubmitManual = async () => {
    const local: any = await localStorage.getItem("UserId");
    if (assignee === parseInt(local)) {
      let hasManualErrors = false;
      const newInputDateErrors = manualFields.map(
        (field) => manualSwitch && field.inputDate === ""
      );
      manualSwitch && setInputDateErrors(newInputDateErrors);
      const newStartTimeErrors = manualFields.map(
        (field) => manualSwitch && field.startTime.trim().length === 0
      );
      manualSwitch && setStartTimeErrors(newStartTimeErrors);
      const newEndTimeErrors = manualFields.map(
        (field) =>
          (manualSwitch && field.endTime.trim().length === 0) ||
          (manualSwitch && field.endTime <= field.startTime)
      );
      manualSwitch && setEndTimeErrors(newEndTimeErrors);
      const newManualDescErrors = manualFields.map(
        (field) =>
          (manualSwitch && field.manualDesc.trim().length < 5) ||
          (manualSwitch && field.manualDesc.trim().length > 500)
      );
      manualSwitch && setManualDescErrors(newManualDescErrors);
      hasManualErrors =
        newInputDateErrors.some((error) => error) ||
        newStartTimeErrors.some((error) => error) ||
        newEndTimeErrors.some((error) => error) ||
        newManualDescErrors.some((error) => error);

      if (!hasManualErrors) {
        const token = await localStorage.getItem("token");
        const Org_Token = await localStorage.getItem("Org_Token");
        try {
          const response = await axios.post(
            `${process.env.worklog_api_url}/workitem/timelog/saveManuallogByworkitem`,
            {
              workItemId: onEdit,
              timelogs: manualFields.map(
                (i: any) =>
                  new Object({
                    id: i.Id,
                    startTime:
                      dayjs(i.inputDate).format("YYYY/MM/DD") +
                      " " +
                      i.startTime,
                    endTime:
                      dayjs(i.inputDate).format("YYYY/MM/DD") + " " + i.endTime,
                    assigneeId: i.AssigneeId === 0 ? assignee : i.AssigneeId,
                    comment: i.manualDesc,
                  })
              ),
              deletedTimelogIds: deletedManualTime,
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
              toast.success(`Manual Time Updated successfully.`);
              setDeletedManualTime([]);
              getEditData();
              getManualData();
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
    } else {
      toast.warning("Only Assingnee can Edit Manual time.");
      getManualData();
    }
  };

  const handleSubmitReminder = async () => {
    if (status === 7 || status === 8 || status === 9) {
      toast.warning(
        "Cannot change task for status 'Accept,' 'Reject,' or 'Accept with Notes'."
      );
      getReminderData();
    } else {
      const validateField = (value: any) => {
        if (
          value === 0 ||
          value === "" ||
          value === null ||
          (Array.isArray(value) && value.length === 0)
        ) {
          return true;
        }
        return false;
      };

      const fieldValidations = {
        reminderTime: reminderSwitch && validateField(reminderTime),
        reminderNotification:
          reminderSwitch && validateField(reminderNotification),
        reminderDate:
          reminderSwitch &&
          reminderCheckboxValue === 2 &&
          validateField(reminderDate),
      };

      reminderSwitch && setReminderTimeErr(fieldValidations.reminderTime);
      reminderSwitch &&
        setReminderNotificationErr(fieldValidations.reminderNotification);
      reminderSwitch &&
        reminderCheckboxValue === 2 &&
        setReminderDateErr(fieldValidations.reminderDate);

      const hasErrors = Object.values(fieldValidations).some((error) => error);

      if (!hasErrors) {
        const token = await localStorage.getItem("token");
        const Org_Token = await localStorage.getItem("Org_Token");
        try {
          const response = await axios.post(
            `${process.env.worklog_api_url}/workitem/reminder/savebyworkitem`,
            {
              ReminderId: reminderId,
              ReminderType: reminderCheckboxValue,
              WorkitemId: onEdit,
              ReminderDate:
                reminderCheckboxValue === 2
                  ? dayjs(reminderDate).format("YYYY/MM/DD")
                  : null,
              ReminderTime: reminderTime,
              ReminderUserIds: reminderNotification.map((i: any) => i.value),
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
              toast.success(`Reminder Updated successfully.`);
              getReminderData();
              setReminderId(0);
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
    }
  };

  // API CALLS
  const getData = async (api: any) => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      let response: any;
      if (api === "/WorkType/GetDropdown") {
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
            getData("/status/GetDropdown");
            // onEdit > 0 && onEditData();
            clientName > 0 && getData("/WorkType/GetDropdown");
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
            setProcessDropdownData(
              response.data.ResponseData.map(
                (i: any) => new Object({ label: i.Name, value: i.Id })
              )
            );
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
      if (error.response?.status === 401) {
        router.push("/login");
        localStorage.clear();
      }
    }
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
    getData("/status/GetDropdown");
    getCCData();
    onEditData();
  }, [onEdit]);

  // Add Checklist
  const toggleGeneralOpen = (index: any) => {
    setItemStates((prevStates: any) => ({
      ...prevStates,
      [index]: !prevStates[index],
    }));
  };

  const toggleAddChecklistField = (index: any) => {
    setItemStates((prevStates: any) => ({
      ...prevStates,
      [`addChecklistField_${index}`]: !prevStates[`addChecklistField_${index}`],
    }));
  };

  const handleSaveCheckListName = async (Category: any, index: number) => {
    if (status === 7 || status === 8 || status === 9) {
      toast.warning(
        "Cannot change task for status 'Accept,' 'Reject,' or 'Accept with Notes'."
      );
      getCheckListData();
    } else {
      setCheckListNameError(
        checkListName.trim().length < 5 || checkListName.trim().length > 500
      );

      if (
        !checkListNameError &&
        checkListName.trim().length > 4 &&
        checkListName.trim().length < 500
      ) {
        const token = await localStorage.getItem("token");
        const Org_Token = await localStorage.getItem("Org_Token");
        try {
          const response = await axios.post(
            `${process.env.worklog_api_url}/workitem/checklist/createbyworkitem`,
            {
              workItemId: onEdit,
              category: Category,
              title: checkListName,
              isCheck: true,
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
              toast.success(`Checklist created successfully.`);
              setCheckListName("");
              getCheckListData();
              toggleAddChecklistField(index);
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
    }
  };

  const handleChangeChecklist = async (
    Category: any,
    IsCheck: any,
    Title: any
  ) => {
    if (status === 7 || status === 8 || status === 9) {
      toast.warning(
        "Cannot change task for status 'Accept,' 'Reject,' or 'Accept with Notes'."
      );
      getCheckListData();
    } else {
      const token = await localStorage.getItem("token");
      const Org_Token = await localStorage.getItem("Org_Token");
      try {
        const response = await axios.post(
          `${process.env.worklog_api_url}/workitem/checklist/savebyworkitem`,
          {
            workItemId: onEdit,
            category: Category,
            title: Title,
            isCheck: IsCheck,
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
            toast.success(`CheckList Updated successfully.`);
            getCheckListData();
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

  const getUserDetails = async () => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");

    try {
      const response = await axios.get(
        `${process.env.api_url}/auth/getuserdetails`,
        {
          headers: {
            Authorization: `bearer ${token}`,
            org_token: `${Org_Token}`,
          },
        }
      );

      if (response.status === 200) {
        if (response.data.ResponseStatus === "Success") {
          setAssigneeDisable(response.data.ResponseData.IsHaveManageAssignee);
          setUserId(response.data.ResponseData.UserId);
          !response.data.ResponseData.IsHaveManageAssignee &&
            setAssignee(response.data.ResponseData.UserId);
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
    } catch (error: any) {
      if (error.response?.status === 401) {
        router.push("/login");
        localStorage.clear();
      }
    }
  };

  useEffect(() => {
    onOpen && getUserDetails();
    onOpen && getData("/client/getdropdownforgroup");
  }, [clientName, onOpen]);

  useEffect(() => {
    onEdit === 0 &&
      setStatus(
        statusDropdownData
          .map((i: any) => (i.Type === "NotStarted" ? i.value : undefined))
          .filter((i: any) => i !== undefined)[0]
      );
  }, [statusDropdownData]);

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
            setEstTimeData(response.data.ResponseData);
            setSubProcessDropdownData(
              response.data.ResponseData.map(
                (i: any) => new Object({ label: i.Name, value: i.Id })
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
        if (error.response?.status === 401) {
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
        if (error.response?.status === 401) {
          router.push("/login");
          localStorage.clear();
        }
      }
    };
    typeOfWork !== 0 && getData("/user/GetAssigneeUserDropdown");
    typeOfWork !== 0 && getData("/user/GetReviewerDropdown");
  }, [typeOfWork]);

  // Comments
  const [commentData, setCommentData] = useState([]);
  const [value, setValue] = useState("");
  const [valueError, setValueError] = useState(false);
  const [valueEdit, setValueEdit] = useState("");
  const [valueEditError, setValueEditError] = useState(false);
  const [mention, setMention] = useState<any>([]);
  let commentAttachment: any = [];
  const [editingCommentIndex, setEditingCommentIndex] = useState(-1);

  const users = assigneeDropdownData.map(
    (i: any) =>
      new Object({
        id: i.value,
        display: i.label,
      })
  );

  const handleEditClick = (index: any, message: any) => {
    setEditingCommentIndex(index);
    setValueEdit(message);
  };

  const handleSaveClick = async (e: any, i: any, type: any) => {
    e.preventDefault();
    setValueEditError(
      valueEdit.trim().length < 5 || valueEdit.trim().length > 500
    );

    if (
      valueEdit.trim().length > 5 &&
      valueEdit.trim().length < 500 &&
      !valueEditError
    ) {
      const token = await localStorage.getItem("token");
      const Org_Token = await localStorage.getItem("Org_Token");
      try {
        const response = await axios.post(
          `${process.env.worklog_api_url}/workitem/comment/saveByworkitem`,
          {
            workitemId: onEdit,
            CommentId: i.CommentId,
            Message: valueEdit,
            TaggedUsers: mention,
            Attachment: i.Attachment,
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
            toast.success(`Comment updated successfully.`);
            setMention([]);
            setValueEdit("");
            getCommentData(1);
            setEditingCommentIndex(-1);
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

  const handleCommentChange = (e: any) => {
    setMention(
      e
        .split("(")
        .map((i: any, index: number) => {
          if (i.includes(")")) {
            return parseInt(i.split(")")[0]);
          }
        })
        .filter((i: any) => i !== undefined)
    );
    setValueError(false);
  };

  const handleFileChange = (e: any) => {
    const selectedFiles = e.target.files;

    if (selectedFiles) {
      for (let i = 0; i < selectedFiles.length; i++) {
        const selectedFile = selectedFiles[i];
        const fileName = selectedFile.name;
        const fileExtension = fileName.split(".").pop();
        let newFileName;

        const uuidv4 = () => {
          return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
            /[xy]/g,
            function (c) {
              const r = (Math.random() * 16) | 0,
                v = c == "x" ? r : (r & 0x3) | 0x8;

              return v.toString(16);
            }
          );
        };

        if (!fileName.toLowerCase().includes(".")) {
          newFileName = `${uuidv4().slice(0, 32)}.txt`;
        } else {
          newFileName = `${uuidv4().slice(0, 32)}.${fileExtension}`;
        }

        const filePath = URL.createObjectURL(selectedFile).slice(5);
        const fileObject = {
          AttachmentId: 0,
          SystemFileName: newFileName,
          UserFileName: fileName,
          AttachmentPath: filePath,
        };
        commentAttachment.push(fileObject);
      }
    }
  };

  const handleSubmitComment = async (
    e: { preventDefault: () => void },
    type: any
  ) => {
    e.preventDefault();
    setValueError(value.trim().length < 5 || value.trim().length > 500);

    if (value.trim().length > 5 && value.trim().length < 500 && !valueError) {
      const token = await localStorage.getItem("token");
      const Org_Token = await localStorage.getItem("Org_Token");
      try {
        const response = await axios.post(
          `${process.env.worklog_api_url}/workitem/comment/saveByworkitem`,
          {
            workitemId: onEdit,
            CommentId: 0,
            Message: value,
            TaggedUsers: mention,
            Attachment: commentAttachment.length > 0 ? commentAttachment : [],
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
            toast.success(`Comment sent successfully.`);
            setMention([]);
            commentAttachment = [];
            setValueEdit("");
            setValue("");
            getCommentData(1);
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

  const extractText = (inputString: any) => {
    const regex = /@\[([^\]]+)\]\([^)]+\)|\[([^\]]+)\]|[^@\[\]]+/g;
    const matches = [];
    let match;
    while ((match = regex.exec(inputString)) !== null) {
      matches.push(match[1] || match[2] || match[0]);
    }
    return matches;
  };

  const handleCheckboxChange = async (
    onEdit: any,
    errorLogId: any,
    checked: any
  ) => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.post(
        `${process.env.worklog_api_url}/workitem/errorlog/SolveByworkitem`,
        {
          WorkItemId: onEdit,
          ErrorLogId: errorLogId,
          IsSolved: checked,
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
          toast.success(
            `${checked ? "Error log Resolved." : "Error log changed."}`
          );
          getErrorLogData();
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
    } catch (error) {
      console.error(error);
    }
  };

  const handleClose = () => {
    setUserId(0);
    setWorkItemId(0);
    setClientName(0);
    setClientNameErr(false);
    setTypeOfWork(0);
    setTypeOfWorkErr(false);
    setProjectName(0);
    setProjectNameErr(false);
    setProcessName(0);
    setProcessNameErr(false);
    setSubProcess(0);
    setSubProcessErr(false);
    setStatus(0);
    setStatusErr(false);
    setDescription("");
    setDescriptionErr(false);
    setPriority(0);
    setPriorityErr(false);
    setEstTime("");
    setEstTimeErr(false);
    setQuantity("");
    setQuantityErr(false);
    setStdTime("");
    setStdTimeErr(false);
    setReceiverDate("");
    setReceiverDateErr(false);
    setDueDate("");
    setDueDateErr(false);
    setAssignee(0);
    setAssigneeErr(false);
    setAssigneeDisable(true);
    setReviewer(0);
    setReviewerErr(false);
    setDateOfReview("");
    setDateOfPreperation("");
    setAssigneeDisable(true);
    setEstTimeData([]);

    // Taxation selected
    setTypeOfReturn(0);
    setTypeOfReturnErr(false);
    setReturnYear(0);
    setReturnYearErr(false);
    setComplexity(0);
    setComplexityErr(false);
    setCountYear(0);
    setCountYearErr(false);
    setNoOfPages(0);
    setNoOfPagesErr(false);

    // Sub-Task
    setSubTaskSwitch(false);
    setSubTaskFields([
      {
        SubtaskId: 0,
        Title: "",
        Description: "",
      },
    ]);
    setTaskNameErr([false]);
    setSubTaskDescriptionErr([false]);

    // Recurring
    setRecurringSwitch(false);
    setRecurringStartDate("");
    setRecurringStartDateErr(false);
    setRecurringEndDate("");
    setRecurringEndDateErr(false);
    setRecurringTime(1);
    setRecurringMonth(0);
    setRecurringMonthErr(false);

    // Manual
    setIsManual(null);
    setManualSwitch(false);
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
    setInputDateErrors([false]);
    setStartTimeErrors([false]);
    setEndTimeErrors([false]);
    setManualDescErrors([false]);
    setDeletedManualTime([]);

    // Reminder
    setReminderSwitch(false);
    setReminderCheckboxValue(1);
    setReminderDate("");
    setReminderDateErr(false);
    setReminderTime(0);
    setReminderTimeErr(false);
    setReminderNotification(0);
    setReminderNotificationErr(false);
    setReminderId(0);

    // checklist
    setAddChecklistField(false);
    setCheckListName("");
    setCheckListNameError(false);
    setCheckListData([]);
    setItemStates({});

    // Error Logs
    setErrorLogData([]);

    // Comments
    setCommentData([]);
    setValue("");
    setValueError(false);
    setValueEdit("");
    setValueEditError(false);
    setMention([]);
    commentAttachment = [];
    setEditingCommentIndex(-1);
    setCommentSelect(1);

    // Reviewer note
    setReviewerNoteData([]);

    // Dropdown

    setClientDropdownData([]);
    setWorkTypeDropdownData([]);
    setProjectDropdownData([]);
    setProcessDropdownData([]);
    setSubProcessDropdownData([]);
    setStatusDropdownDataUse([]);
    setAssigneeDropdownData([]);
    setReviewerDropdownData([]);

    // Others
    scrollToPanel(0);
    onDataFetch();

    if (typeof window !== "undefined") {
      const pathname = window.location.href.includes("=");
      if (pathname) {
        onClose();
        router.push("/worklogs");
      } else {
        onClose();
      }
    }
  };

  // const isWeekend = (date: any) => {
  //   const day = date.day();
  //   return day === 6 || day === 0;
  // };

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
          <form onSubmit={handleSubmit}>
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
                    <div className="mt-[10px] pl-6 flex">
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={clientDropdownData}
                        value={
                          clientDropdownData.find(
                            (i: any) => i.value === clientName
                          ) || null
                        }
                        onChange={(e, value: any) => {
                          value && setClientName(value.value);
                          setTypeOfWork(0);
                          setTypeOfWorkErr(false);
                          setProjectName(0);
                          setProjectNameErr(false);
                          setProcessName(0);
                          setProcessNameErr(false);
                          setSubProcess(0);
                          setSubProcessErr(false);
                          setDescription("");
                          setDescriptionErr(false);
                          setPriority(0);
                          setPriorityErr(false);
                          setQuantity("");
                          setQuantityErr(false);
                          setReceiverDate("");
                          setReceiverDateErr(false);
                          setDueDate("");
                          setDueDateErr(false);
                          assigneeDisable && setAssignee(0);
                          assigneeDisable && setAssigneeErr(false);
                          setReviewer(0);
                          setReviewerErr(false);
                        }}
                        sx={{ width: 300, mt: 0.4, ml: 0.8 }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="standard"
                            label={
                              <span>
                                Client Name
                                <span className="text-defaultRed">&nbsp;*</span>
                              </span>
                            }
                            error={clientNameErr}
                            onBlur={(e) => {
                              if (clientName > 0) {
                                setClientNameErr(false);
                              }
                            }}
                            helperText={
                              clientNameErr ? "This is a required field." : ""
                            }
                          />
                        )}
                      />
                      <FormControl
                        variant="standard"
                        sx={{ mx: 0.75, minWidth: 300, ml: 1.5 }}
                        error={typeOfWorkErr}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          Type of Work
                          <span className="text-defaultRed">&nbsp;*</span>
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={typeOfWork === 0 ? "" : typeOfWork}
                          onChange={(e) => {
                            setProjectName(0);
                            setProjectNameErr(false);
                            setProcessName(0);
                            setProcessNameErr(false);
                            setSubProcess(0);
                            setSubProcessErr(false);
                            setDescription("");
                            setDescriptionErr(false);
                            setPriority(0);
                            setPriorityErr(false);
                            setQuantity("");
                            setQuantityErr(false);
                            setReceiverDate("");
                            setReceiverDateErr(false);
                            setDueDate("");
                            setDueDateErr(false);
                            assigneeDisable && setAssignee(0);
                            assigneeDisable && setAssigneeErr(false);
                            setReviewer(0);
                            setReviewerErr(false);
                            setTypeOfWork(e.target.value);
                            setDateOfReview("");
                            setDateOfPreperation("");
                            setTypeOfReturn(0);
                            setReturnYear(0);
                            setComplexity(0);
                            setCountYear(0);
                            setNoOfPages(0);
                          }}
                          onBlur={(e: any) => {
                            if (e.target.value > 0) {
                              setTypeOfWorkErr(false);
                            }
                          }}
                        >
                          {workTypeDropdownData.map((i: any, index: number) => (
                            <MenuItem value={i.value} key={index}>
                              {i.label}
                            </MenuItem>
                          ))}
                        </Select>
                        {typeOfWorkErr && (
                          <FormHelperText>
                            This is a required field.
                          </FormHelperText>
                        )}
                      </FormControl>
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={projectDropdownData}
                        value={
                          projectDropdownData.find(
                            (i: any) => i.value === projectName
                          ) || null
                        }
                        onChange={(e, value: any) => {
                          value && setProjectName(value.value);
                        }}
                        sx={{ width: 300, mt: 0.4, ml: 0.8 }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="standard"
                            label={
                              <span>
                                Project Name
                                <span className="text-defaultRed">&nbsp;*</span>
                              </span>
                            }
                            error={projectNameErr}
                            onBlur={(e) => {
                              if (projectName > 0) {
                                setProjectNameErr(false);
                              }
                            }}
                            helperText={
                              projectNameErr ? "This is a required field." : ""
                            }
                          />
                        )}
                      />
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={processDropdownData}
                        value={
                          processDropdownData.find(
                            (i: any) => i.value === processName
                          ) || null
                        }
                        onChange={(e, value: any) => {
                          value && setProcessName(value.value);
                        }}
                        sx={{ width: 300, mt: 0.4, ml: 1.5 }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="standard"
                            label={
                              <span>
                                Process Name
                                <span className="text-defaultRed">&nbsp;*</span>
                              </span>
                            }
                            error={processNameErr}
                            onBlur={(e) => {
                              if (processName > 0) {
                                setProcessNameErr(false);
                              }
                            }}
                            helperText={
                              processNameErr ? "This is a required field." : ""
                            }
                          />
                        )}
                      />
                    </div>
                    <div className="mt-[10px] pl-6 flex">
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={subProcessDropdownData}
                        value={
                          subProcessDropdownData.find(
                            (i: any) => i.value === subProcess
                          ) || null
                        }
                        onChange={(e, value: any) => {
                          value && setSubProcess(value.value);
                        }}
                        sx={{ width: 300, mt: 0.4, ml: 0.8 }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="standard"
                            label={
                              <span>
                                Sub Process
                                <span className="text-defaultRed">&nbsp;*</span>
                              </span>
                            }
                            error={subProcessErr}
                            onBlur={(e) => {
                              if (subProcess > 0) {
                                setSubProcessErr(false);
                              }
                            }}
                            helperText={
                              subProcessErr ? "This is a required field." : ""
                            }
                          />
                        )}
                      />
                      <Autocomplete
                        id="combo-box-demo"
                        options={
                          onEdit === 0
                            ? statusDropdownData
                            : statusDropdownDataUse
                        }
                        disabled={
                          onEdit === 0 ||
                          status === 7 ||
                          status === 8 ||
                          status === 9
                        }
                        value={
                          onEdit === 0 && manualSwitch
                            ? statusDropdownData.find(
                                (i: any) => i.value === status
                              ) || null
                            : onEdit === 0
                            ? statusDropdownData.find(
                                (i: any) => i.value === status
                              ) || null
                            : statusDropdownDataUse.find(
                                (i: any) => i.value === status
                              ) || null
                        }
                        onChange={(e, value: any) => {
                          value && setStatus(value.value);
                        }}
                        sx={{ width: 300, mt: 0.4, ml: 1.5 }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="standard"
                            label={
                              <span>
                                Status
                                <span className="text-defaultRed">&nbsp;*</span>
                              </span>
                            }
                            error={statusErr}
                            onBlur={(e) => {
                              if (subProcess > 0) {
                                setStatusErr(false);
                              }
                            }}
                            helperText={
                              statusErr ? "This is a required field." : ""
                            }
                          />
                        )}
                      />
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
                        onChange={(e) => {
                          setDescription(e.target.value);
                          setDescriptionErr(false);
                        }}
                        onBlur={(e: any) => {
                          if (e.target.value.trim().length > 5) {
                            setDescriptionErr(false);
                          }
                          if (
                            e.target.value.trim().length > 5 &&
                            e.target.value.trim().length < 500
                          ) {
                            setDescriptionErr(false);
                          }
                        }}
                        error={descriptionErr}
                        helperText={
                          descriptionErr &&
                          description?.trim().length > 0 &&
                          description?.trim().length < 5
                            ? "Minimum 5 characters required."
                            : descriptionErr && description?.trim().length > 500
                            ? "Maximum 500 characters allowed."
                            : descriptionErr
                            ? "This is a required field."
                            : ""
                        }
                        margin="normal"
                        variant="standard"
                        sx={{ mx: 0.75, maxWidth: 300, mt: -0.2, ml: 1.5 }}
                      />
                      <FormControl
                        variant="standard"
                        sx={{ mx: 0.75, minWidth: 300 }}
                        error={priorityErr}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          Priority
                          <span className="text-defaultRed">&nbsp;*</span>
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={priority === 0 ? "" : priority}
                          onChange={(e) => setPriority(e.target.value)}
                          onBlur={(e: any) => {
                            if (e.target.value > 0) {
                              setPriorityErr(false);
                            }
                          }}
                        >
                          <MenuItem value={1}>High</MenuItem>
                          <MenuItem value={2}>Medium</MenuItem>
                          <MenuItem value={3}>Low</MenuItem>
                        </Select>
                        {priorityErr && (
                          <FormHelperText>
                            This is a required field.
                          </FormHelperText>
                        )}
                      </FormControl>
                    </div>
                    <div className="mt-[-12px] pl-6">
                      <TextField
                        label="Estimated Time"
                        disabled
                        fullWidth
                        value={
                          subProcess > 0
                            ? (estTimeData as any[])
                                .map((i) => {
                                  const hours = Math.floor(
                                    i.EstimatedHour / 3600
                                  );
                                  const minutes = Math.floor(
                                    (i.EstimatedHour % 3600) / 60
                                  );
                                  const remainingSeconds = i.EstimatedHour % 60;
                                  const formattedHours = hours
                                    .toString()
                                    .padStart(2, "0");
                                  const formattedMinutes = minutes
                                    .toString()
                                    .padStart(2, "0");
                                  const formattedSeconds = remainingSeconds
                                    .toString()
                                    .padStart(2, "0");
                                  return subProcess === i.Id
                                    ? `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
                                    : null;
                                })
                                .filter((i) => i !== null)
                            : ""
                        }
                        onBlur={(e: any) => {
                          if (e.target.value.trim().length > 0) {
                            setEstTimeErr(false);
                          }
                        }}
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
                        onFocus={(e) =>
                          e.target.addEventListener(
                            "wheel",
                            function (e) {
                              e.preventDefault();
                            },
                            { passive: false }
                          )
                        }
                        type="number"
                        fullWidth
                        value={quantity}
                        onChange={(e) => {
                          setQuantity(e.target.value);
                          setQuantityErr(false);
                        }}
                        onBlur={(e: any) => {
                          if (
                            e.target.value.trim().length > 0 &&
                            e.target.value.trim().length < 5 &&
                            !e.target.value.trim().includes(".")
                          ) {
                            setQuantityErr(false);
                          }
                        }}
                        error={quantityErr}
                        helperText={
                          quantityErr && quantity.toString().includes(".")
                            ? "Only intiger value allowed."
                            : quantityErr && quantity === ""
                            ? "This is a required field."
                            : quantityErr && quantity <= 0
                            ? "Enter valid number."
                            : quantityErr && quantity.length > 4
                            ? "Maximum 4 numbers allowed."
                            : ""
                        }
                        margin="normal"
                        variant="standard"
                        sx={{ mx: 0.75, maxWidth: 300 }}
                      />
                      <TextField
                        label="Standard Time"
                        fullWidth
                        value={
                          subProcess > 0
                            ? (estTimeData as any[])
                                .map((i) => {
                                  const hours = Math.floor(
                                    (i.EstimatedHour * quantity) / 3600
                                  );
                                  const minutes = Math.floor(
                                    ((i.EstimatedHour * quantity) % 3600) / 60
                                  );
                                  const remainingSeconds =
                                    (i.EstimatedHour * quantity) % 60;
                                  const formattedHours = hours
                                    .toString()
                                    .padStart(2, "0");
                                  const formattedMinutes = minutes
                                    .toString()
                                    .padStart(2, "0");
                                  const formattedSeconds = remainingSeconds
                                    .toString()
                                    .padStart(2, "0");
                                  return subProcess === i.Id
                                    ? `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
                                    : null;
                                })
                                .filter((i) => i !== null)
                            : ""
                        }
                        disabled
                        margin="normal"
                        variant="standard"
                        sx={{ mx: 0.75, maxWidth: 300 }}
                      />
                      <div
                        className={`inline-flex mt-[12px] mb-[8px] mx-[6px] muiDatepickerCustomizer w-full max-w-[300px] ${
                          receiverDateErr ? "datepickerError" : ""
                        }`}
                      >
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            label={
                              <span>
                                Receiver Date
                                <span className="!text-defaultRed">
                                  &nbsp;*
                                </span>
                              </span>
                            }
                            onError={() => setReceiverDateErr(false)}
                            value={
                              receiverDate === "" ? null : dayjs(receiverDate)
                            }
                            // shouldDisableDate={isWeekend}
                            maxDate={dayjs(dueDate).subtract(2, "day")}
                            onChange={(newDate: any) => {
                              setReceiverDate(newDate.$d);
                              setReceiverDateErr(false);
                              const selectedDate = dayjs(newDate.$d);
                              let nextDate: any = selectedDate;
                              if (
                                selectedDate.day() === 6 ||
                                selectedDate.day() === 0
                              ) {
                                nextDate = nextDate.add(2, "day");
                              } else if (selectedDate.day() === 5) {
                                nextDate = nextDate.add(3, "day");
                              } else {
                                nextDate = dayjs(newDate.$d)
                                  .add(2, "day")
                                  .toDate();
                              }
                              setDueDate(nextDate);
                            }}
                            slotProps={{
                              textField: {
                                helperText: receiverDateErr
                                  ? "This is a required field."
                                  : "",
                                readOnly: true,
                              } as Record<string, any>,
                            }}
                          />
                        </LocalizationProvider>
                      </div>
                    </div>
                    <div className="mt-[2px] pl-6 flex items-center">
                      <div
                        className={`inline-flex mt-[-1px] mb-[8px] mx-[6px] muiDatepickerCustomizer w-full max-w-[300px] ${
                          dueDateErr ? "datepickerError" : ""
                        }`}
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
                            onError={() => setDueDateErr(false)}
                            value={dueDate === "" ? null : dayjs(dueDate)}
                            minDate={dayjs(receiverDate).add(2, "day")}
                            onChange={(newDate: any) => {
                              setDueDate(newDate.$d);
                              setDueDateErr(false);
                            }}
                            slotProps={{
                              textField: {
                                helperText:
                                  dueDateErr && dueDate < receiverDate
                                    ? "Due Date must be grater than Receiver Date"
                                    : dueDateErr
                                    ? "This is a required field."
                                    : "",
                                readOnly: true,
                              } as Record<string, any>,
                            }}
                          />
                        </LocalizationProvider>
                      </div>
                      {/* {assigneeDisable && ( */}
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={assigneeDropdownData}
                        disabled={!assigneeDisable}
                        value={
                          assigneeDropdownData.find(
                            (i: any) => i.value === assignee
                          ) || null
                        }
                        onChange={(e, value: any) => {
                          value && setAssignee(value.value);
                        }}
                        sx={{ width: 300, mt: -0.5, ml: 0.8 }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="standard"
                            label={
                              <span>
                                Assignee
                                <span className="text-defaultRed">&nbsp;*</span>
                              </span>
                            }
                            error={assigneeErr}
                            onBlur={(e) => {
                              if (assignee > 0) {
                                setAssigneeErr(false);
                              }
                            }}
                            helperText={
                              assigneeErr ? "This is a required field." : ""
                            }
                          />
                        )}
                      />
                      {/* )} */}
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={reviewerDropdownData}
                        value={
                          reviewerDropdownData.find(
                            (i: any) => i.value === reviewer
                          ) || null
                        }
                        onChange={(e, value: any) => {
                          value && setReviewer(value.value);
                        }}
                        sx={{ width: 300, mt: -0.5, ml: 1.5 }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="standard"
                            label={
                              <span>
                                Reviewer
                                <span className="text-defaultRed">&nbsp;*</span>
                              </span>
                            }
                            error={reviewerErr}
                            onBlur={(e) => {
                              if (reviewer > 0) {
                                setReviewerErr(false);
                              }
                            }}
                            helperText={
                              reviewerErr ? "This is a required field." : ""
                            }
                          />
                        )}
                      />
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
                              onChange={(e) =>
                                setDateOfPreperation(e.target.value)
                              }
                              onFocus={() => setInputTypePreperation("date")}
                              onBlur={(e: any) => {
                                setInputTypePreperation("text");
                              }}
                              margin="normal"
                              variant="standard"
                              sx={{ mx: 0.75, maxWidth: 300, mt: 0.3, ml: 1.5 }}
                            />
                          )}
                        </>
                      ) : (
                        <FormControl
                          variant="standard"
                          sx={{ mx: 0.75, minWidth: 300, mt: -0.9, ml: 1.5 }}
                          error={typeOfReturnErr}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            Type of Return
                            <span className="text-defaultRed">&nbsp;*</span>
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={typeOfReturn === 0 ? "" : typeOfReturn}
                            onChange={(e) => setTypeOfReturn(e.target.value)}
                            onBlur={(e: any) => {
                              if (e.target.value > 0) {
                                setTypeOfReturnErr(false);
                              }
                            }}
                          >
                            <MenuItem value={1}>Form 1040</MenuItem>
                            <MenuItem value={2}>Form 1065</MenuItem>
                            <MenuItem value={3}>Form 1120S</MenuItem>
                          </Select>
                          {typeOfReturnErr && (
                            <FormHelperText>
                              This is a required field.
                            </FormHelperText>
                          )}
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
                              onChange={(e) => setDateOfReview(e.target.value)}
                              onFocus={() => setInputTypeReview("date")}
                              onBlur={(e: any) => {
                                setInputTypeReview("text");
                              }}
                              margin="normal"
                              variant="standard"
                              sx={{ mx: 0.75, maxWidth: 300, mt: -0.4 }}
                            />
                          )}
                        </>
                      ) : (
                        <>
                          <FormControl
                            variant="standard"
                            sx={{ mx: 0.75, minWidth: 300, mt: -0.28 }}
                            error={returnYearErr}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              Return Year
                              <span className="text-defaultRed">&nbsp;*</span>
                            </InputLabel>
                            <Select
                              labelId="demo-simple-select-standard-label"
                              id="demo-simple-select-standard"
                              value={returnYear === 0 ? "" : returnYear}
                              onChange={(e) => setReturnYear(e.target.value)}
                              onBlur={(e: any) => {
                                if (e.target.value > 0) {
                                  setReturnYearErr(false);
                                }
                              }}
                            >
                              {Years.map((i: any, index: number) => (
                                <MenuItem value={i.value} key={index}>
                                  {i.label}
                                </MenuItem>
                              ))}
                            </Select>
                            {returnYearErr && (
                              <FormHelperText>
                                This is a required field.
                              </FormHelperText>
                            )}
                          </FormControl>
                          <FormControl
                            variant="standard"
                            sx={{ mx: 0.75, minWidth: 300, mt: -0.28 }}
                            error={complexityErr}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              Complexity
                              <span className="text-defaultRed">&nbsp;*</span>
                            </InputLabel>
                            <Select
                              labelId="demo-simple-select-standard-label"
                              id="demo-simple-select-standard"
                              value={complexity === 0 ? "" : complexity}
                              onChange={(e) => setComplexity(e.target.value)}
                              onBlur={(e: any) => {
                                if (e.target.value > 0) {
                                  setComplexityErr(false);
                                }
                              }}
                            >
                              <MenuItem value={1}>Moderate</MenuItem>
                              <MenuItem value={2}>Intermediate</MenuItem>
                              <MenuItem value={3}>Complex</MenuItem>
                            </Select>
                            {complexityErr && (
                              <FormHelperText>
                                This is a required field.
                              </FormHelperText>
                            )}
                          </FormControl>
                          <FormControl
                            variant="standard"
                            sx={{ mx: 0.75, minWidth: 300, mt: -0.28 }}
                            error={countYearErr}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              Count Year
                              <span className="text-defaultRed">&nbsp;*</span>
                            </InputLabel>
                            <Select
                              labelId="demo-simple-select-standard-label"
                              id="demo-simple-select-standard"
                              value={countYear === 0 ? "" : countYear}
                              onChange={(e) => setCountYear(e.target.value)}
                              onBlur={(e: any) => {
                                if (e.target.value > 0) {
                                  setCountYearErr(false);
                                }
                              }}
                            >
                              {Years.map((i: any, index: number) => (
                                <MenuItem value={i.value} key={index}>
                                  {i.label}
                                </MenuItem>
                              ))}
                            </Select>
                            {countYearErr && (
                              <FormHelperText>
                                This is a required field.
                              </FormHelperText>
                            )}
                          </FormControl>
                          <TextField
                            label={
                              <span>
                                No of Pages
                                <span className="!text-defaultRed">
                                  &nbsp;*
                                </span>
                              </span>
                            }
                            type="number"
                            fullWidth
                            value={noOfPages === 0 ? "" : noOfPages}
                            onChange={(e) => {
                              setNoOfPages(e.target.value);
                              setNoOfPagesErr(false);
                            }}
                            onBlur={(e: any) => {
                              if (
                                e.target.value.trim().length > 0 &&
                                e.target.value.trim().length < 5
                              ) {
                                setNoOfPagesErr(false);
                              }
                            }}
                            error={noOfPagesErr}
                            helperText={
                              noOfPagesErr && noOfPages < 0
                                ? "Add valid number."
                                : noOfPagesErr && noOfPages.length > 4
                                ? "Maximum 4 numbers allowed."
                                : noOfPagesErr
                                ? "This is a required field."
                                : ""
                            }
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
                  <span className="flex items-center">
                    {onEdit > 0 && subTaskSwitch && (
                      <Button
                        variant="contained"
                        className="rounded-[4px] !h-[36px] mr-6 !bg-secondary"
                        onClick={handleSubmitSubTask}
                      >
                        Update
                      </Button>
                    )}
                    {hasPermissionWorklog(
                      "Task/SubTask",
                      "Save",
                      "WorkLogs"
                    ) ? (
                      <Switch
                        checked={subTaskSwitch}
                        onChange={(e) => {
                          setSubTaskSwitch(e.target.checked);
                          onEdit === 0 &&
                            setSubTaskFields([
                              {
                                SubtaskId: 0,
                                Title: "",
                                Description: "",
                              },
                            ]);
                          onEdit === 0 && setTaskNameErr([false]);
                          onEdit === 0 && setSubTaskDescriptionErr([false]);
                          onEdit === 0 && setDeletedSubTask([]);
                        }}
                      />
                    ) : (
                      <></>
                    )}
                    <span
                      className={`cursor-pointer ${
                        subTaskDrawer ? "rotate-180" : ""
                      }`}
                      onClick={() => setSubTaskDrawer(!subTaskDrawer)}
                    >
                      <ChevronDownIcon />
                    </span>
                  </span>
                </div>
                {subTaskDrawer && (
                  <div className="mt-3 pl-6">
                    {subTaskFields.map((field, index) => (
                      <div className="w-[100%] flex" key={index}>
                        <TextField
                          label={
                            <span>
                              Task Name
                              <span className="!text-defaultRed">&nbsp;*</span>
                            </span>
                          }
                          fullWidth
                          disabled={!subTaskSwitch}
                          value={field.Title}
                          onChange={(e) => handleSubTaskChange(e, index)}
                          onBlur={(e: any) => {
                            if (e.target.value.trim().length > 0) {
                              const newTaskNameErrors = [...taskNameErr];
                              newTaskNameErrors[index] = false;
                              setTaskNameErr(newTaskNameErrors);
                            }
                          }}
                          error={taskNameErr[index]}
                          helperText={
                            taskNameErr[index] &&
                            field.Title.length > 0 &&
                            field.Title.length < 5
                              ? "Minumum 5 characters required."
                              : taskNameErr[index] && field.Title.length > 500
                              ? "Maximum 500 characters allowed."
                              : taskNameErr[index]
                              ? "This is a required field."
                              : ""
                          }
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
                          disabled={!subTaskSwitch}
                          value={field.Description}
                          onChange={(e) =>
                            handleSubTaskDescriptionChange(e, index)
                          }
                          onBlur={(e: any) => {
                            if (e.target.value.trim().length > 0) {
                              const newSubTaskDescErrors = [
                                ...subTaskDescriptionErr,
                              ];
                              newSubTaskDescErrors[index] = false;
                              setSubTaskDescriptionErr(newSubTaskDescErrors);
                            }
                          }}
                          error={subTaskDescriptionErr[index]}
                          helperText={
                            subTaskDescriptionErr[index] &&
                            field.Description.length > 0 &&
                            field.Description.length < 5
                              ? "Minumum 5 characters required."
                              : subTaskDescriptionErr[index] &&
                                field.Description.length > 500
                              ? "Maximum 500 characters allowed."
                              : subTaskDescriptionErr[index]
                              ? "This is a required field."
                              : ""
                          }
                          margin="normal"
                          variant="standard"
                          sx={{ mx: 0.75, maxWidth: 300, mt: 0 }}
                        />
                        {index === 0 ? (
                          <span
                            className="cursor-pointer"
                            onClick={addTaskField}
                          >
                            <svg
                              className="MuiSvgIcon-root !w-[24px] !h-[24px] !mt-[24px]  mx-[10px] MuiSvgIcon-fontSizeMedium css-i4bv87-MuiSvgIcon-root"
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
                            onClick={() => removeTaskField(index)}
                          >
                            <svg
                              className="MuiSvgIcon-root !w-[24px] !h-[24px] !mt-[24px]  mx-[10px] MuiSvgIcon-fontSizeMedium css-i4bv87-MuiSvgIcon-root"
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
                    ))}
                  </div>
                )}
              </div>
            )}

            {onEdit > 0 &&
              hasPermissionWorklog("CheckList", "View", "WorkLogs") && (
                <div className="mt-14" id={`${onEdit > 0 && "tabpanel-2"}`}>
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
                            {/* <ThreeDotIcon /> */}
                          </span>
                          {itemStates[index] && (
                            <FormGroup className="ml-8 mt-2">
                              {i.Activities.map((j: any, index: number) => (
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={j.IsCheck}
                                      onChange={(e) =>
                                        hasPermissionWorklog(
                                          "CheckList",
                                          "save",
                                          "WorkLogs"
                                        ) &&
                                        handleChangeChecklist(
                                          i.Category,
                                          e.target.checked,
                                          j.Title
                                        )
                                      }
                                    />
                                  }
                                  label={j.Title}
                                />
                              ))}
                            </FormGroup>
                          )}
                          {hasPermissionWorklog(
                            "CheckList",
                            "save",
                            "WorkLogs"
                          ) &&
                            itemStates[index] &&
                            !itemStates[`addChecklistField_${index}`] && (
                              <span
                                className="flex items-center gap-3 ml-8 cursor-pointer text-[#6E6D7A]"
                                onClick={() => toggleAddChecklistField(index)}
                              >
                                <AddIcon /> Add new checklist item
                              </span>
                            )}
                          {itemStates[index] &&
                            itemStates[`addChecklistField_${index}`] && (
                              <>
                                <TextField
                                  label={
                                    <span>
                                      Add Name
                                      <span className="text-defaultRed">
                                        &nbsp;*
                                      </span>
                                    </span>
                                  }
                                  fullWidth
                                  className="ml-8"
                                  value={
                                    checkListName?.trim().length <= 0
                                      ? ""
                                      : checkListName
                                  }
                                  onChange={(e) => {
                                    setCheckListName(e.target.value);
                                    setCheckListNameError(false);
                                  }}
                                  onBlur={(e: any) => {
                                    if (e.target.value.trim().length > 5) {
                                      setCheckListNameError(false);
                                    }
                                    if (
                                      e.target.value.trim().length > 5 &&
                                      e.target.value.trim().length < 500
                                    ) {
                                      setCheckListNameError(false);
                                    }
                                  }}
                                  error={checkListNameError}
                                  helperText={
                                    checkListNameError &&
                                    checkListName.trim().length > 0 &&
                                    checkListName.trim().length < 5
                                      ? "Minimum 5 characters required."
                                      : checkListNameError &&
                                        checkListName.trim().length > 500
                                      ? "Maximum 500 characters allowed."
                                      : checkListNameError
                                      ? "This is a required field."
                                      : ""
                                  }
                                  margin="normal"
                                  variant="standard"
                                  sx={{ mx: 0.75, maxWidth: 300, mt: 0 }}
                                />
                                <Button
                                  type="button"
                                  variant="contained"
                                  className="rounded-[4px] !h-[36px] mr-6 !bg-secondary mt-2"
                                  onClick={() =>
                                    handleSaveCheckListName(i.Category, index)
                                  }
                                >
                                  <span className="flex items-center justify-center gap-[10px] px-[5px]">
                                    Save
                                  </span>
                                </Button>
                              </>
                            )}
                        </div>
                      ))}
                  </div>
                </div>
              )}

            {onEdit > 0 &&
              hasPermissionWorklog("Comment", "View", "WorkLogs") && (
                <div className="mt-14" id={`${onEdit > 0 && "tabpanel-3"}`}>
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
                                {i.SubmitedDate},&nbsp;
                                {new Date(
                                  `1970-01-01T${i.SubmitedTime}:00Z`
                                ).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </Typography>
                              <div className="flex items-center gap-2">
                                {editingCommentIndex === index ? (
                                  <div className="flex items-center gap-2">
                                    <MentionsInput
                                      style={mentionsInputStyle}
                                      className="!w-[100%] textareaOutlineNoneEdit"
                                      value={valueEdit}
                                      onChange={(e) => {
                                        setValueEdit(e.target.value);
                                        setValueEditError(false);
                                        handleCommentChange(e.target.value);
                                      }}
                                      placeholder="Type a nex message OR type @ if you want to mention anyone in the message."
                                    >
                                      <Mention
                                        data={users}
                                        style={{ backgroundColor: "#cee4e5" }}
                                        trigger="@"
                                      />
                                    </MentionsInput>
                                    {valueEditError &&
                                    valueEdit.trim().length > 1 &&
                                    valueEdit.trim().length < 5 ? (
                                      <span className="text-defaultRed text-[14px]">
                                        Minimum 5 characters required.
                                      </span>
                                    ) : valueEditError &&
                                      valueEdit.trim().length > 500 ? (
                                      <span className="text-defaultRed text-[14px]">
                                        Maximum 500 characters allowed.
                                      </span>
                                    ) : (
                                      valueEditError && (
                                        <span className="text-defaultRed text-[14px]">
                                          This is a required field.
                                        </span>
                                      )
                                    )}
                                    <button
                                      type="button"
                                      className="!bg-secondary text-white border rounded-md px-[4px]"
                                      onClick={(e) =>
                                        handleSaveClick(e, i, commentSelect)
                                      }
                                    >
                                      <Save className="w-4 h-4" />
                                    </button>
                                  </div>
                                ) : (
                                  <>
                                    <span className="hidden"></span>
                                    <div className="flex items-start">
                                      {extractText(i.Message).map((i: any) => {
                                        const assignee =
                                          assigneeDropdownData.map(
                                            (j: any) => j.label
                                          );
                                        return assignee.includes(i) ? (
                                          <span
                                            className="text-secondary"
                                            key={index}
                                          >
                                            &nbsp; {i} &nbsp;
                                          </span>
                                        ) : (
                                          i
                                        );
                                      })}
                                    </div>
                                    {userId === i.UserId &&
                                      hasPermissionWorklog(
                                        "Comment",
                                        "save",
                                        "WorkLogs"
                                      ) && (
                                        <button
                                          type="button"
                                          className="flex items-start !bg-secondary text-white border rounded-md p-[4px]"
                                          onClick={() =>
                                            handleEditClick(index, i.Message)
                                          }
                                        >
                                          <EditIcon className="h-4 w-4" />
                                        </button>
                                      )}
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                  {commentsDrawer &&
                    hasPermissionWorklog("Comment", "save", "WorkLogs") && (
                      <>
                        <div className="border border-slatyGrey gap-2 py-2 rounded-lg my-2 ml-16 mr-8 flex items-center justify-center">
                          <MentionsInput
                            style={mentionsInputStyle}
                            className="!w-[92%] textareaOutlineNone"
                            value={value}
                            onChange={(e) => {
                              setValue(e.target.value);
                              setValueError(false);
                              handleCommentChange(e.target.value);
                            }}
                            placeholder="Type a nex message OR type @ if you want to mention anyone in the message."
                          >
                            <Mention
                              data={users}
                              style={{ backgroundColor: "#cee4e5" }}
                              trigger="@"
                            />
                          </MentionsInput>
                          <span
                            className="text-white cursor-pointer"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <FileIcon />
                            <input
                              type="file"
                              ref={fileInputRef}
                              multiple
                              className="input-field hidden"
                              onChange={(e) => handleFileChange(e)}
                            />
                          </span>
                          <button
                            type="button"
                            className="!bg-secondary text-white p-[6px] rounded-md cursor-pointer mr-2"
                            onClick={(e) =>
                              handleSubmitComment(e, commentSelect)
                            }
                          >
                            <SendIcon />
                          </button>
                        </div>
                        {valueError &&
                        value.trim().length > 1 &&
                        value.trim().length < 5 ? (
                          <span className="text-defaultRed text-[14px] ml-20">
                            Minimum 5 characters required.
                          </span>
                        ) : valueError && value.trim().length > 500 ? (
                          <span className="text-defaultRed text-[14px] ml-20">
                            Maximum 500 characters allowed.
                          </span>
                        ) : (
                          valueError && (
                            <span className="text-defaultRed text-[14px] ml-20">
                              This is a required field.
                            </span>
                          )
                        )}
                      </>
                    )}
                </div>
              )}

            {hasPermissionWorklog("Reccuring", "View", "WorkLogs") && (
              <div
                className="mt-14"
                id={`${onEdit > 0 ? "tabpanel-4" : "tabpanel-2"}`}
              >
                <div className="py-[10px] px-8 flex items-center justify-between font-medium border-dashed border-b border-lightSilver">
                  <span className="flex items-center">
                    <HistoryIcon />
                    <span className="ml-[21px]">Recurring</span>
                  </span>
                  <span className="flex items-center">
                    {onEdit > 0 && recurringSwitch && (
                      <Button
                        variant="contained"
                        className="rounded-[4px] !h-[36px] mr-6 !bg-secondary"
                        onClick={handleSubmitRecurring}
                      >
                        Update
                      </Button>
                    )}
                    {hasPermissionWorklog("Reccuring", "Save", "WorkLogs") ? (
                      <Switch
                        checked={recurringSwitch}
                        onChange={(e) => {
                          setRecurringSwitch(e.target.checked);
                          setRecurringStartDate("");
                          setRecurringStartDateErr(false);
                          setRecurringEndDate("");
                          setRecurringEndDateErr(false);
                          setRecurringTime(1);
                        }}
                      />
                    ) : (
                      <></>
                    )}
                    <span
                      className={`cursor-pointer ${
                        recurringDrawer ? "rotate-180" : ""
                      }`}
                      onClick={() => setRecurringDrawer(!recurringDrawer)}
                    >
                      <ChevronDownIcon />
                    </span>
                  </span>
                </div>
                {recurringDrawer && (
                  <>
                    <div className="mt-0 pl-6">
                      <div
                        className={`inline-flex mt-[12px] mb-[8px] mx-[6px] muiDatepickerCustomizer w-full max-w-[300px] ${
                          recurringStartDateErr ? "datepickerError" : ""
                        }`}
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
                            disabled={!recurringSwitch}
                            onError={() => setRecurringStartDateErr(false)}
                            maxDate={dayjs(recurringEndDate)}
                            value={
                              recurringStartDate === ""
                                ? null
                                : dayjs(recurringStartDate)
                            }
                            onChange={(newDate: any) => {
                              setRecurringStartDate(newDate.$d);
                              setRecurringStartDateErr(false);
                            }}
                            slotProps={{
                              textField: {
                                helperText: recurringStartDateErr
                                  ? "This is a required field."
                                  : "",
                                readOnly: true,
                              } as Record<string, any>,
                            }}
                          />
                        </LocalizationProvider>
                      </div>
                      <div
                        className={`inline-flex mt-[12px] mb-[8px] mx-[6px] muiDatepickerCustomizer w-full max-w-[300px] ${
                          recurringEndDateErr ? "datepickerError" : ""
                        }`}
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
                            disabled={!recurringSwitch}
                            onError={() => setRecurringEndDateErr(false)}
                            value={
                              recurringEndDate === ""
                                ? null
                                : dayjs(recurringEndDate)
                            }
                            onChange={(newDate: any) => {
                              setRecurringEndDate(newDate.$d);
                              setRecurringEndDateErr(false);
                            }}
                            slotProps={{
                              textField: {
                                helperText: recurringEndDateErr
                                  ? "This is a required field."
                                  : "",
                                readOnly: true,
                              } as Record<string, any>,
                            }}
                          />
                        </LocalizationProvider>
                      </div>
                    </div>
                    <div className="mt-0 pl-6">
                      <FormControl
                        variant="standard"
                        sx={{ mx: 0.75, minWidth: 145 }}
                        disabled={!recurringSwitch}
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
                          onChange={(e) => {
                            setRecurringTime(e.target.value);
                            setRecurringMonth(0);
                            setSelectedDays([]);
                            setRecurringWeekErr(false);
                          }}
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
                              error={recurringMonthErr}
                              onBlur={(e) => {
                                if (recurringMonth.length > 0) {
                                  setRecurringMonthErr(false);
                                }
                              }}
                              helperText={
                                recurringMonthErr
                                  ? "This is a required field."
                                  : ""
                              }
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
                      {recurringWeekErr && (
                        <span className="text-defaultRed ml-8 text-sm p-0">
                          Please Select day.
                        </span>
                      )}
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
              <div
                className="mt-14"
                id={`${onEdit > 0 ? "tabpanel-5" : "tabpanel-3"}`}
              >
                <div className="py-[10px] px-8 flex items-center justify-between font-medium border-dashed border-b border-lightSilver">
                  <span className="flex items-center">
                    <ClockIcon />
                    <span className="ml-[21px]">Manual Time</span>
                  </span>
                  <span className="flex items-center">
                    {onEdit > 0 && manualSwitch && (
                      <Button
                        variant="contained"
                        className="rounded-[4px] !h-[36px] mr-6 !bg-secondary"
                        onClick={handleSubmitManual}
                      >
                        Update
                      </Button>
                    )}
                    <Switch
                      checked={manualSwitch}
                      onChange={(e) => {
                        setManualSwitch(e.target.checked);
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
                        setInputDateErrors([false]);
                        setStartTimeErrors([false]);
                        setEndTimeErrors([false]);
                        setManualDescErrors([false]);
                        setInputTypeDate(["text"]);
                        e.target.checked === true
                          ? setStatus(
                              statusDropdownData
                                .map((i: any) =>
                                  i.Type === "InProgress" ? i.value : undefined
                                )
                                .filter((i: any) => i !== undefined)[0]
                            )
                          : setStatus(
                              statusDropdownData
                                .map((i: any) =>
                                  i.Type === "NotStarted" ? i.value : undefined
                                )
                                .filter((i: any) => i !== undefined)[0]
                            );
                      }}
                    />
                    <span
                      className={`cursor-pointer ${
                        manualTimeDrawer ? "rotate-180" : ""
                      }`}
                      onClick={() => setManualTimeDrawer(!manualTimeDrawer)}
                    >
                      <ChevronDownIcon />
                    </span>
                  </span>
                </div>
                {manualTimeDrawer && (
                  <>
                    <div className="-mt-2 pl-6">
                      {manualFields.map((field, index) => (
                        <div key={index} className="flex items-center">
                          <div
                            className={`inline-flex mt-[12px] mb-[8px] mx-[6px] muiDatepickerCustomizer w-full max-w-[230px] ${
                              inputDateErrors[index] ? "datepickerError" : ""
                            }`}
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
                                minDate={dayjs(recurringStartDate)}
                                maxDate={dayjs(new Date())}
                                disabled={!manualSwitch}
                                onError={() => {
                                  if (
                                    field.inputDate[index]?.trim().length > 0
                                  ) {
                                    const newInputDateErrors = [
                                      ...inputDateErrors,
                                    ];
                                    newInputDateErrors[index] = false;
                                    setInputDateErrors(newInputDateErrors);
                                  }
                                }}
                                value={
                                  field.inputDate === ""
                                    ? null
                                    : dayjs(field.inputDate)
                                }
                                onChange={(newDate: any) => {
                                  handleInputDateChange(newDate.$d, index);
                                }}
                                slotProps={{
                                  textField: {
                                    helperText: inputDateErrors[index]
                                      ? "This is a required field."
                                      : "",
                                    readOnly: true,
                                  } as Record<string, any>,
                                }}
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
                            disabled={!manualSwitch}
                            fullWidth
                            value={field.startTime}
                            onChange={(e) => handleStartTimeChange(e, index)}
                            onBlur={(e: any) => {
                              if (e.target.value.trim().length > 0) {
                                const newStartTimeErrors = [...startTimeErrors];
                                newStartTimeErrors[index] = false;
                                setStartTimeErrors(newStartTimeErrors);
                              }
                            }}
                            error={startTimeErrors[index]}
                            helperText={
                              startTimeErrors[index]
                                ? "This is a required field"
                                : ""
                            }
                            margin="normal"
                            variant="standard"
                            sx={{ mx: 0.75, maxWidth: 225 }}
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
                            disabled={!manualSwitch}
                            fullWidth
                            value={field.endTime}
                            onChange={(e) => handleEndTimeChange(e, index)}
                            onBlur={(e: any) => {
                              if (
                                e.target.value.trim().length > 0 &&
                                field.endTime > field.startTime
                              ) {
                                const newEndTimeErrors = [...endTimeErrors];
                                newEndTimeErrors[index] = false;
                                setEndTimeErrors(newEndTimeErrors);
                              }
                            }}
                            error={endTimeErrors[index]}
                            helperText={
                              endTimeErrors[index] &&
                              field.endTime <= field.startTime
                                ? "End time must be grater than start time"
                                : endTimeErrors[index] && field.endTime === ""
                                ? "This is a required field"
                                : ""
                            }
                            margin="normal"
                            variant="standard"
                            sx={{ mx: 0.75, maxWidth: 225 }}
                          />
                          <TextField
                            label="Total Time"
                            disabled
                            fullWidth
                            value={field.totalTime}
                            margin="normal"
                            variant="standard"
                            sx={{ mx: 0.75, maxWidth: 225 }}
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
                            disabled={!manualSwitch}
                            fullWidth
                            value={field.manualDesc}
                            onChange={(e) => handleManualDescChange(e, index)}
                            onBlur={(e: any) => {
                              if (e.target.value.trim().length > 0) {
                                const newManualDescErrors = [
                                  ...manualDescErrors,
                                ];
                                newManualDescErrors[index] = false;
                                setManualDescErrors(newManualDescErrors);
                              }
                            }}
                            error={manualDescErrors[index]}
                            helperText={
                              manualDescErrors[index] &&
                              field.manualDesc.length > 0 &&
                              field.manualDesc.length < 5
                                ? "Minumum 5 characters required."
                                : manualDescErrors[index] &&
                                  field.manualDesc.length > 500
                                ? "Maximum 500 characters allowed."
                                : manualDescErrors[index]
                                ? "This is a required field."
                                : ""
                            }
                            margin="normal"
                            variant="standard"
                            sx={{ mx: 0.75, maxWidth: 230, mt: 2 }}
                          />
                          {index === 0
                            ? manualSwitch && (
                                <span
                                  className="cursor-pointer"
                                  onClick={addManulaField}
                                >
                                  <svg
                                    className="MuiSvgIcon-root !w-[24px] !h-[24px] !mt-[24px]  mx-[10px] MuiSvgIcon-fontSizeMedium css-i4bv87-MuiSvgIcon-root"
                                    focusable="false"
                                    aria-hidden="true"
                                    viewBox="0 0 24 24"
                                    data-testid="AddIcon"
                                  >
                                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path>
                                  </svg>
                                </span>
                              )
                            : manualSwitch && (
                                <span
                                  className="cursor-pointer"
                                  onClick={() => removePhoneField(index)}
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
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {hasPermissionWorklog("Reminder", "View", "WorkLogs") && (
              <div
                className="my-14"
                id={`${onEdit > 0 ? "tabpanel-6" : "tabpanel-4"}`}
              >
                <div className="py-[10px] px-8 flex items-center justify-between font-medium border-dashed border-b border-lightSilver">
                  <span className="flex items-center">
                    <BellIcon />
                    <span className="ml-[21px]">Reminder</span>
                  </span>
                  <span className="flex items-center">
                    {onEdit > 0 && reminderSwitch && (
                      <Button
                        variant="contained"
                        className="rounded-[4px] !h-[36px] mr-6 !bg-secondary"
                        onClick={handleSubmitReminder}
                      >
                        Update
                      </Button>
                    )}
                    {hasPermissionWorklog("Reminder", "Save", "WorkLogs") ? (
                      <Switch
                        checked={reminderSwitch}
                        onChange={(e) => {
                          setReminderSwitch(e.target.checked);
                          setReminderDate("");
                          setReminderDateErr(false);
                          setReminderTime(0);
                          setReminderTimeErr(false);
                          setReminderNotification(0);
                          setReminderNotificationErr(false);
                        }}
                      />
                    ) : (
                      <></>
                    )}
                    <span
                      className={`cursor-pointer ${
                        reminderDrawer ? "rotate-180" : ""
                      }`}
                      onClick={() => setReminderDrawer(!reminderDrawer)}
                    >
                      <ChevronDownIcon />
                    </span>
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
                        onChange={(e) => {
                          setReminderCheckboxValue(parseInt(e.target.value));
                          onEdit === 0 && setReminderDate("");
                          setReminderDateErr(false);
                          onEdit === 0 && setReminderTime(0);
                          setReminderTimeErr(false);
                          onEdit === 0 && setReminderNotification(0);
                          setReminderNotificationErr(false);
                        }}
                      >
                        <FormControlLabel
                          disabled={!reminderSwitch}
                          value={1}
                          control={<Radio />}
                          label="Due Date"
                        />
                        <FormControlLabel
                          disabled={!reminderSwitch}
                          value={2}
                          control={<Radio />}
                          label="Specific Date"
                        />
                        <FormControlLabel
                          disabled={!reminderSwitch}
                          value={3}
                          control={<Radio />}
                          label="Daily"
                        />
                        <FormControlLabel
                          disabled={!reminderSwitch}
                          value={4}
                          control={<Radio />}
                          label="Days Before Due Date"
                        />
                      </RadioGroup>
                    </div>
                    <div className="pl-6 flex">
                      {reminderCheckboxValue === 2 && onEdit === 0 && (
                        <div
                          className={`inline-flex mt-[0px] mb-[8px] mx-[6px] muiDatepickerCustomizer w-full max-w-[300px] ${
                            reminderDateErr ? "datepickerError" : ""
                          }`}
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
                              disabled={!reminderSwitch}
                              onError={() => setReminderDateErr(false)}
                              value={
                                reminderDate === "" ? null : dayjs(reminderDate)
                              }
                              onChange={(newDate: any) => {
                                setReminderDate(newDate.$d);
                                setReminderDateErr(false);
                              }}
                              slotProps={{
                                textField: {
                                  helperText: reminderDateErr
                                    ? "This is a required field."
                                    : "",
                                  readOnly: true,
                                } as Record<string, any>,
                              }}
                            />
                          </LocalizationProvider>
                        </div>
                      )}

                      {reminderCheckboxValue === 2 && onEdit > 0 && (
                        <div
                          className={`inline-flex mt-[0px] mb-[8px] mx-[6px] muiDatepickerCustomizer w-full max-w-[300px] ${
                            reminderDateErr ? "datepickerError" : ""
                          }`}
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
                              disabled={!reminderSwitch}
                              onError={() => setReminderDateErr(false)}
                              value={
                                reminderDate === "" ? null : dayjs(reminderDate)
                              }
                              onChange={(newDate: any) => {
                                setReminderDate(newDate.$d);
                                setReminderDateErr(false);
                              }}
                              slotProps={{
                                textField: {
                                  helperText: reminderDateErr
                                    ? "This is a required field."
                                    : "",
                                  readOnly: true,
                                } as Record<string, any>,
                              }}
                            />
                          </LocalizationProvider>
                        </div>
                      )}

                      <FormControl
                        variant="standard"
                        sx={{ mx: 0.75, minWidth: 100 }}
                        error={reminderTimeErr}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          Hour
                          <span className="text-defaultRed">&nbsp;*</span>
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          disabled={!reminderSwitch}
                          value={reminderTime === 0 ? "" : reminderTime}
                          onChange={(e) => setReminderTime(e.target.value)}
                          onBlur={(e: any) => {
                            if (e.target.value > 0) {
                              setReminderTimeErr(false);
                            }
                          }}
                        >
                          {Hours.map((i: any, index: number) => (
                            <MenuItem value={i.value} key={index}>
                              {i.label}
                            </MenuItem>
                          ))}
                        </Select>
                        {reminderTimeErr && (
                          <FormHelperText>
                            This is a required field.
                          </FormHelperText>
                        )}
                      </FormControl>
                      <Autocomplete
                        multiple
                        limitTags={2}
                        id="checkboxes-tags-demo"
                        disabled={!reminderSwitch}
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
                            error={reminderNotificationErr}
                            onBlur={(e) => {
                              if (reminderNotification.length > 0) {
                                setReminderNotificationErr(false);
                              }
                            }}
                            helperText={
                              reminderNotificationErr
                                ? "This is a required field."
                                : ""
                            }
                          />
                        )}
                        sx={{ mx: 0.75, maxWidth: 380, mt: 0.3 }}
                      />
                    </div>
                  </>
                )}
              </div>
            )}

            {hasPermissionWorklog("ErrorLog", "View", "WorkLogs") &&
              onEdit > 0 && (
                <div className="mt-14" id={`${onEdit > 0 && "tabpanel-7"}`}>
                  <div className="py-[10px] px-8 flex items-center justify-between font-medium border-dashed border-b border-lightSilver">
                    <span className="flex items-center">
                      <TaskIcon />
                      <span className="ml-[21px]">Error Logs</span>
                    </span>
                    <span
                      className={`cursor-pointer ${
                        reviewerErrDrawer ? "rotate-180" : ""
                      }`}
                      onClick={() => setReviewerErrDrawer(!reviewerErrDrawer)}
                    >
                      <ChevronDownIcon />
                    </span>
                  </div>
                  {reviewerErrDrawer && (
                    <div className="mt-3 pl-6">
                      {errorLogData.length > 0 &&
                        errorLogData.map((i: any, index: number) => (
                          <>
                            <div className="ml-1 mt-8">
                              <span className="font-bold">Correction By</span>
                              <span className="ml-3 mr-10 text-[14px]">
                                {i.SubmitedBy}
                              </span>
                              <span className="font-bold">Reviewer Date</span>
                              <span className="ml-3">{i.SubmitedOn}</span>
                            </div>
                            <div
                              className="w-[100%] mt-2 text-[14px]"
                              key={index}
                            >
                              <FormControl
                                variant="standard"
                                sx={{ mx: 0.75, minWidth: 230 }}
                              >
                                <InputLabel id="demo-simple-select-standard-label">
                                  Error Type
                                  <span className="text-defaultRed">
                                    &nbsp;*
                                  </span>
                                </InputLabel>
                                <Select
                                  labelId="demo-simple-select-standard-label"
                                  id="demo-simple-select-standard"
                                  value={i.ErrorType}
                                  readOnly
                                >
                                  <MenuItem value={1}>Internal</MenuItem>
                                  <MenuItem value={2}>External</MenuItem>
                                </Select>
                              </FormControl>
                              <FormControl
                                variant="standard"
                                sx={{ mx: 0.75, minWidth: 230 }}
                              >
                                <InputLabel id="demo-simple-select-standard-label">
                                  Root Cause
                                  <span className="text-defaultRed">
                                    &nbsp;*
                                  </span>
                                </InputLabel>
                                <Select
                                  labelId="demo-simple-select-standard-label"
                                  id="demo-simple-select-standard"
                                  value={i.RootCause}
                                  readOnly
                                >
                                  <MenuItem value={1}>Procedural</MenuItem>
                                  <MenuItem value={2}>DataEntry</MenuItem>
                                </Select>
                              </FormControl>
                              <FormControl
                                variant="standard"
                                sx={{ mx: 0.75, minWidth: 230 }}
                              >
                                <InputLabel id="demo-simple-select-standard-label">
                                  Nature of Error
                                  <span className="text-defaultRed">
                                    &nbsp;*
                                  </span>
                                </InputLabel>
                                <Select
                                  labelId="demo-simple-select-standard-label"
                                  id="demo-simple-select-standard"
                                  value={i.NatureOfError}
                                  readOnly
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
                              </FormControl>
                              <FormControl
                                variant="standard"
                                sx={{ mx: 0.75, minWidth: 230 }}
                              >
                                <InputLabel id="demo-simple-select-standard-label">
                                  Priority
                                  <span className="text-defaultRed">
                                    &nbsp;*
                                  </span>
                                </InputLabel>
                                <Select
                                  labelId="demo-simple-select-standard-label"
                                  id="demo-simple-select-standard"
                                  value={i.Priority}
                                  readOnly
                                >
                                  <MenuItem value={1}>High</MenuItem>
                                  <MenuItem value={2}>Medium</MenuItem>
                                  <MenuItem value={3}>Low</MenuItem>
                                </Select>
                              </FormControl>
                              <TextField
                                label={
                                  <span>
                                    Error Count
                                    <span className="text-defaultRed">
                                      &nbsp;*
                                    </span>
                                  </span>
                                }
                                type="number"
                                fullWidth
                                value={i.ErrorCount}
                                margin="normal"
                                variant="standard"
                                sx={{ mx: 0.75, maxWidth: 180, mt: 0.4 }}
                                InputProps={{ readOnly: true }}
                                inputProps={{ readOnly: true }}
                              />
                              <div className="flex items-center justify-start ml-2">
                                <Autocomplete
                                  multiple
                                  limitTags={2}
                                  id="checkboxes-tags-demo"
                                  readOnly
                                  options={
                                    Array.isArray(cCDropdownData)
                                      ? cCDropdownData
                                      : []
                                  }
                                  value={cCDropdownData.filter((obj: any) =>
                                    i.CC.includes(obj.value)
                                  )}
                                  getOptionLabel={(option) => option.label}
                                  disableCloseOnSelect
                                  onChange={handleMultiSelect}
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
                                    />
                                  )}
                                  sx={{ maxWidth: 230, mt: 0.3 }}
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
                                  value={i.Remark}
                                  margin="normal"
                                  variant="standard"
                                  sx={{
                                    mx: 0.75,
                                    maxWidth: 485,
                                    mt: 1,
                                    ml: 1.5,
                                    mr: 1.5,
                                  }}
                                  InputProps={{ readOnly: true }}
                                  inputProps={{ readOnly: true }}
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
                                  value={
                                    i.Attachment.length <= 0
                                      ? "null"
                                      : i.Attachment
                                  }
                                  margin="normal"
                                  variant="standard"
                                  sx={{ mx: 0.75, maxWidth: 400, mt: 1 }}
                                  InputProps={{ readOnly: true }}
                                  inputProps={{ readOnly: true }}
                                /> */}
                                <FormGroup>
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        onChange={(e) =>
                                          handleCheckboxChange(
                                            onEdit,
                                            i.ErrorLogId,
                                            e.target.checked
                                          )
                                        }
                                        disabled={
                                          status === 4 ||
                                          status === 7 ||
                                          status === 9 ||
                                          status === 8
                                        }
                                        checked={i.IsSolved}
                                      />
                                    }
                                    label="Is Resolved"
                                  />
                                </FormGroup>
                              </div>
                            </div>
                          </>
                        ))}
                    </div>
                  )}
                </div>
              )}

            {onEdit > 0 && (
              <div className="mt-14" id={`${onEdit > 0 && "tabpanel-8"}`}>
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
                            <Tooltip
                              title={j.ReviewerName}
                              placement="top"
                              arrow
                            >
                              <Avatar>
                                {j.ReviewerName.split(" ")
                                  .map((word: any) =>
                                    word.charAt(0).toUpperCase()
                                  )
                                  .join("")}
                              </Avatar>
                            </Tooltip>
                          ) : (
                            <Tooltip
                              title={j.ReviewerName}
                              placement="top"
                              arrow
                            >
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
            )}

            {/* Logs */}
            {/* {onEdit > 0 && (
              <div className="mt-14" id={`${onEdit > 0 && "tabpanel-9"}`}>
                <div className="py-[10px] px-8 flex items-center justify-between font-medium border-dashed border-b border-lightSilver">
                  <span className="flex items-center">
                    <HistoryIcon />
                    <span className="ml-[21px]">Logs</span>
                  </span>
                  <span
                    className={`cursor-pointer ${
                      logsDrawer ? "rotate-180" : ""
                    }`}
                    onClick={() => setLogsDrawer(!logsDrawer)}
                  >
                    <ChevronDownIcon />
                  </span>
                </div>
                {logsDrawer && <div className="mt-5 pl-[70px] text-sm">
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
                </div>}
              </div>
            )} */}

            <div className="sticky bottom-0 !h-[9%] bg-whiteSmoke border-b z-30 border-lightSilver flex p-2 justify-between items-center">
              <div></div>
              <div>
                <Button
                  variant="outlined"
                  className="rounded-[4px] !h-[36px] !text-secondary"
                  onClick={handleClose}
                >
                  <span className="flex items-center justify-center gap-[10px] px-[5px]">
                    Close
                  </span>
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  className="rounded-[4px] !h-[36px] !mx-6 !bg-secondary"
                >
                  <span className="flex items-center justify-center gap-[10px] px-[5px]">
                    {onEdit > 0 ? "Save Task" : "Create Task"}
                  </span>
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditDrawer;