import React, { useEffect, useState } from "react";
// material imports
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { FormControl, InputLabel, MenuItem, TextField } from "@mui/material";
import Select from "@mui/material/Select";
import axios from "axios";
import { toast } from "react-toastify";

interface FilterModalProps {
  onOpen: boolean;
  onClose: () => void;
  onActionClick?: () => void;
  onDataFetch: () => void;
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
  ClientId: null,
  userId: null,
  ProjectId: null,
};

const FilterDialog_Approval: React.FC<FilterModalProps> = ({
  onOpen,
  onClose,
  onDataFetch,
  currentFilterData,
}) => {
  const [clientName, setClientName] = useState<number | string>(0);
  const [userName, setUser] = useState<number | string>(0);
  const [projectName, setProjectName] = useState<number | string>(0);
  const [appliedFilterData, setAppliedFilterData] = useState<any | any[]>([]);
  const [clientDropdownData, setClientDropdownData] = useState([]);
  const [userDropdownData, setUserData] = useState([]);
  const [projectDropdownData, setProjectDropdownData] = useState([]);
  const [anyFieldSelected, setAnyFieldSelected] = useState<any>(false);
  const [currSelectedFields, setCurrSelectedFileds] = useState<any | any[]>([]);

  const sendFilterToPage = () => {
    currentFilterData(currSelectedFields);
    onClose();
  };

  const handleResetAll = () => {
    setClientName(0);
    setUser(0);
    setProjectName(0);
    currentFilterData(initialFilter);
  };

  const handleClose = () => {
    handleResetAll();
    onClose();
  };

  const getClientData = async () => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.get(
        `${process.env.pms_api_url}/client/getdropdown`,
        {
          headers: {
            Authorization: `bearer ${token}`,
            org_token: `${Org_Token}`,
          },
        }
      );

      if (response.status === 200) {
        if (response.data.ResponseStatus === "Success") {
          setClientDropdownData(response.data.ResponseData);
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

  const getProjectData = async (clientName: string | number) => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.post(
        `${process.env.pms_api_url}/project/getdropdown`,
        {
          clientId: clientName ? clientName : 0,
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

  const getEmployeeData = async () => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.get(
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
          setUserData(response.data.ResponseData);
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
    if (onOpen === true) {
      getClientData();
      getEmployeeData();
    }
  }, [onOpen]);

  useEffect(() => {
    getProjectData(clientName);
  }, [clientName]);

  // Check if any field is selected
  useEffect(() => {
    const isAnyFieldSelected: any =
      clientName !== 0 || userName !== 0 || projectName !== 0;

    setAnyFieldSelected(isAnyFieldSelected);
  }, [clientName, userName, projectName]);

  // Set state values based on applied filter data
  useEffect(() => {
    if (appliedFilterData.length > 0) {
      const appliedFilter = appliedFilterData[0].AppliedFilter;

      if (appliedFilter) {
        const { ClientId, userId, ProjectId } = appliedFilter;

        setClientName(ClientId > 0 ? ClientId : "");
        setUser(userId > 0 ? userId : "");
        setProjectName(ProjectId > 0 ? ProjectId : "");
      }
    }
  }, [appliedFilterData]);

  useEffect(() => {
    const selectedFields = {
      ClientId: clientName || null,
      userId: userName || null,
      ProjectId: projectName || null,
    };
    setCurrSelectedFileds(selectedFields);
  }, [clientName, userName, projectName]);

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
              <FormControl variant="standard" sx={{ mx: 0.75, minWidth: 200 }}>
                <InputLabel id="client_Name">Client Name</InputLabel>
                <Select
                  labelId="client_Name"
                  id="client_Name"
                  value={clientName === 0 ? "" : clientName}
                  onChange={(e) => setClientName(e.target.value)}
                >
                  {clientDropdownData.map((i: any, index: number) => (
                    <MenuItem value={i.value} key={index}>
                      {i.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl variant="standard" sx={{ mx: 0.75, minWidth: 200 }}>
                <InputLabel id="employee">Employee Name</InputLabel>
                <Select
                  labelId="employee"
                  id="employee"
                  value={userName === 0 ? "" : userName}
                  onChange={(e) => setUser(e.target.value)}
                >
                  {userDropdownData.map((i: any, index: number) => (
                    <MenuItem value={i.value} key={index}>
                      {i.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl variant="standard" sx={{ mx: 0.75, minWidth: 200 }}>
                <InputLabel id="project_Name">Project Name</InputLabel>
                <Select
                  labelId="project_Name"
                  id="project_Name"
                  value={projectName === 0 ? "" : projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                >
                  {projectDropdownData.map((i: any, index: number) => (
                    <MenuItem value={i.value} key={index}>
                      {i.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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

          <Button variant="outlined" color="info" onClick={() => onClose()}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default FilterDialog_Approval;