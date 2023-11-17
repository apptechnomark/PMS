import axios from "axios";
import { toast } from "react-toastify";
import React, { useEffect, useState } from "react";
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputBase,
  InputLabel,
  MenuItem,
  Popover,
  Select,
  TextField,
  Tooltip,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { Transition } from "./Transition/Transition";
import DeleteDialog from "@/components/common/workloags/DeleteDialog";

// filter type
import { FilterType } from "./types/ReportsFilterType";

// filter type enum
import { audit } from "../Enum/Filtertype";

//filter body for audit
import { audit_InitialFilter } from "@/utils/reports/getFilters";

// dropdown api
import {
  getBillingTypeData,
  getClientData,
  getDeptData,
  getProjectData,
  getWorkTypeData,
} from "./api/getDropDownData";

//icons
import SearchIcon from "@/assets/icons/SearchIcon";
import { Edit, Delete } from "@mui/icons-material";

const AuditFilter = () => {
  return <div>AuditFilter</div>;
};

export default AuditFilter;
