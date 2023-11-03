import React, { useEffect, useState } from "react";
// material imports
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import {
  DialogTitle,
  FormControl,
  IconButton,
  MenuItem,
  Select,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import axios from "axios";
import { toast } from "react-toastify";
import Datatable_SummaryList from "../datatable/Datatable_SummaryList";

interface SummaryListProps {
  onOpen: boolean;
  onClose: () => void;
  onSelectedWorkType: number;
  onSelectedProjectIds: number[];
  onSelectedSummaryStatus: string;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const Dialog_SummaryList: React.FC<SummaryListProps> = ({
  onOpen,
  onClose,
  onSelectedWorkType,
  onSelectedProjectIds,
  onSelectedSummaryStatus,
}) => {
  const [allTaskList, setAllTaskList] = useState<string[] | any>([]);
  const [taskStatusName, setTaskStatusName] = useState<string>("");
  const [data, setData] = useState([]);

  const handleClose = () => {
    onClose();
    setTaskStatusName("");
  };

  // API for Project Status list
  useEffect(() => {
    const getSummaryData = async () => {
      const token = await localStorage.getItem("token");
      const Org_Token = await localStorage.getItem("Org_Token");
      try {
        const response = await axios.post(
          `${process.env.report_api_url}/clientdashboard/summarylist`,
          {
            TypeOfWork: onSelectedWorkType === 0 ? null : onSelectedWorkType,
            ProjectIds: onSelectedProjectIds ? onSelectedProjectIds : [],
            Key: onSelectedSummaryStatus,
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
            setData(response.data.ResponseData);
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

    getSummaryData();
  }, [onSelectedWorkType, onSelectedSummaryStatus, onSelectedProjectIds]);

  return (
    <div>
      <Dialog
        fullWidth
        open={onOpen}
        TransitionComponent={Transition}
        keepMounted
        maxWidth="xl"
        onClose={handleClose}
      >
        <DialogTitle className="flex justify-between p-5 bg-whiteSmoke">
          <span className="font-semibold text-lg">Task Status</span>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent className="flex flex-col gap-5 mt-[10px]">
          <div className="flex justify-end items-center">
            <FormControl sx={{ mx: 0.75, minWidth: 220, marginTop: 1 }}>
              <Select
                labelId="Project Staus"
                id="Project Staus"
                value={
                  taskStatusName ? taskStatusName : onSelectedSummaryStatus
                }
                onChange={(e) => setTaskStatusName(e.target.value)}
                sx={{ height: "36px" }}
              >
                {allTaskList.map((i: any, index: number) => (
                  <MenuItem value={i.name} key={index}>
                    {i.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <Datatable_SummaryList currSummaryListData={data} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dialog_SummaryList;