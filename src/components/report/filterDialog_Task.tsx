/* eslint-disable react-hooks/rules-of-hooks */
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Slide,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import axios from "axios";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface FilterModalProps {
  onOpen: boolean;
  onClose: () => void;
  currentFilterData?: any;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const initialFilter = {
  ProjectIdsForFilter: [],
  WorkType: null,
  Priority: null,
  StartDate: null,
  EndDate: null,
};

const filterDialog_Task: React.FC<FilterModalProps> = ({
  onOpen,
  onClose,
  currentFilterData,
}) => {
  const [anyFieldSelected, setAnyFieldSelected] = useState<any>(false);
  const [currSelectedFields, setCurrSelectedFileds] = useState<any | any[]>([]);
  const [projectDropdownData, setProjectDropdownData] = useState([]);
  const [typeOfWork, setTypeOfWork] = useState<null | number>(0);
  const [typeOfWorkDropdownData, setTypeOfWorkDropdownData] = useState([]);
  const [dueDate, setDueDate] = useState<null | string>(null);
  const [startDate, setStartDate] = useState<null | string>(null);
  const [endDate, setEndDate] = useState<null | string>(null);

  const [project, setProject] = useState<null | number>(0);
  const [priority, setPriority] = useState<null | number>(0);

  const handleClose = () => {
    handleResetAll();
    onClose();
  };

  const handleResetAll = () => {
    setProject(0);
    setTypeOfWork(0);
    setPriority(0);
    setDueDate(null);
    setStartDate(null);
    setEndDate(null);
    currentFilterData(initialFilter);
  };

  // Check if any field is selected
  useEffect(() => {
    const isAnyFieldSelected =
      project !== 0 ||
      typeOfWork !== 0 ||
      priority !== 0 ||
      dueDate !== null ||
      startDate !== null ||
      endDate !== null;

    setAnyFieldSelected(isAnyFieldSelected);
  }, [project, typeOfWork, priority, dueDate, startDate, endDate]);

  useEffect(() => {
    const selectedFields = {
      ProjectIdsForFilter: project === 0 ? [] : [project] || null,
      WorkType: typeOfWork || null,
      Priority: priority || null,
      DueDate:
        dueDate !== null
          ? new Date(new Date(dueDate).getTime() + 24 * 60 * 60 * 1000)
              .toISOString()
              .split("T")[0]
          : null,
      StartDate:
        startDate !== null
          ? new Date(new Date(startDate).getTime() + 24 * 60 * 60 * 1000)
              .toISOString()
              .split("T")[0]
          : null,
      EndDate:
        endDate !== null
          ? new Date(new Date(endDate).getTime() + 24 * 60 * 60 * 1000)
              .toISOString()
              .split("T")[0]
          : null,
    };
    setCurrSelectedFileds(selectedFields);
  }, [project, typeOfWork, priority, dueDate, startDate, endDate]);

  const sendFilterToPage = () => {
    currentFilterData(currSelectedFields);
    onClose();
  };

  const getProjectData = async () => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    const clientId = await localStorage.getItem("clientId");
    try {
      const response = await axios.post(
        `${process.env.pms_api_url}/project/getdropdown`,
        {
          clientId: clientId,
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
          setProjectDropdownData(response.data.ResponseData.List);
          getWorkTypeData();
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

  const getWorkTypeData = async () => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    const clientId = await localStorage.getItem("clientId");
    try {
      const response = await axios.post(
        `${process.env.pms_api_url}/WorkType/GetDropdown`,
        {
          clientId: clientId,
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
          setTypeOfWorkDropdownData(response.data.ResponseData);
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
    onOpen && getProjectData();
  }, [onOpen]);

  const isWeekend = (date: any) => {
    const day = date.day();
    return day === 6 || day === 0;
  };

  return (
    <div>
      <Dialog
        open={onOpen}
        TransitionComponent={Transition}
        keepMounted
        maxWidth="md"
        onClose={handleClose}
      >
        <DialogTitle className="h-[64px] p-[20px] flex items-center justify-between border-b border-b-lightSilver">
          <span className="text-lg font-medium">Filter</span>
          <Button color="error" onClick={handleResetAll}>
            Reset all
          </Button>
        </DialogTitle>
        <DialogContent>
          <div className="flex flex-col gap-[20px] pt-[15px]">
            <div className="flex gap-[20px]">
              <FormControl variant="standard" sx={{ mx: 0.75, minWidth: 210 }}>
                <InputLabel id="project">Project</InputLabel>
                <Select
                  labelId="project"
                  id="project"
                  value={project === 0 ? "" : project}
                  onChange={(e: any) => setProject(e.target.value)}
                >
                  {projectDropdownData.map((i: any, index: number) => (
                    <MenuItem value={i.value} key={index}>
                      {i.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl variant="standard" sx={{ mx: 0.75, minWidth: 210 }}>
                <InputLabel id="workTypes-label">Types of Work</InputLabel>
                <Select
                  labelId="workTypes-label"
                  id="workTypes-select"
                  value={typeOfWork === 0 ? "" : typeOfWork}
                  onChange={(e: any) => setTypeOfWork(e.target.value)}
                >
                  {typeOfWorkDropdownData.map((i: any, index: number) => (
                    <MenuItem value={i.value} key={index}>
                      {i.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl variant="standard" sx={{ mx: 0.75, minWidth: 210 }}>
                <InputLabel id="priority">Priority</InputLabel>
                <Select
                  labelId="priority"
                  id="priority"
                  value={priority === 0 ? "" : priority}
                  onChange={(e: any) => setPriority(e.target.value)}
                >
                  <MenuItem value={1}>High</MenuItem>
                  <MenuItem value={2}>Medium</MenuItem>
                  <MenuItem value={3}>Low</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div className="flex gap-[20px]">
              {/* <div
                className={`inline-flex mx-[6px] muiDatepickerCustomizer w-[200px] max-w-[300px]`}
              >
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label={<span>Due Date</span>}
                    shouldDisableDate={isWeekend}
                    maxDate={dayjs(Date.now())}
                    value={dueDate === null ? null : dayjs(dueDate)}
                    onChange={(newDate: any) => {
                      setDueDate(newDate.$d);
                    }}
                    slotProps={{
                      textField: {
                        readOnly: true,
                      } as Record<string, any>,
                    }}
                  />
                </LocalizationProvider>
              </div> */}
              <div className="inline-flex mb-[8px] mx-[6px] muiDatepickerCustomizer w-full max-w-[210px]">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="From"
                    shouldDisableDate={isWeekend}
                    maxDate={dayjs(Date.now())}
                    value={startDate === null ? null : dayjs(startDate)}
                    onChange={(newDate: any) => setStartDate(newDate.$d)}
                    slotProps={{
                      textField: {
                        readOnly: true,
                      } as Record<string, any>,
                    }}
                  />
                </LocalizationProvider>
              </div>

              <div className="inline-flex mb-[8px] mx-[6px] muiDatepickerCustomizer w-full max-w-[210px]">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="To"
                    shouldDisableDate={isWeekend}
                    maxDate={dayjs(Date.now())}
                    value={endDate === null ? null : dayjs(endDate)}
                    onChange={(newDate: any) => setEndDate(newDate.$d)}
                    slotProps={{
                      textField: {
                        readOnly: true,
                      } as Record<string, any>,
                    }}
                  />
                </LocalizationProvider>
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions className="border-t border-t-lightSilver p-[20px] gap-[10px] h-[64px]">
          <Button
            variant="contained"
            color="info"
            className={`${anyFieldSelected && "!bg-secondary"}`}
            disabled={!anyFieldSelected}
            onClick={sendFilterToPage}
          >
            Apply Filter
          </Button>

          <Button variant="outlined" color="info" onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default filterDialog_Task;