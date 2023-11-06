import axios from "axios";
import { toast } from "react-toastify";
import React, { useEffect, useState } from "react";
import {
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
import { Transition } from "./Transition/Transition";
import DeleteDialog from "@/components/common/workloags/DeleteDialog";

// filter type
import { FilterType } from "./types/ReportsFilterType";

// filter type enum
import { billingReport } from "../Enum/Filtertype";

//filter body for client
import { billingreport_InitialFilter } from "@/utils/reports/getFilters";

// dropdown api
import {
  getClientData,
  getProjectData,
  getUserData,
} from "./api/getDropDownData";

//icons
import SearchIcon from "@/assets/icons/SearchIcon";
import { Delete, Edit } from "@mui/icons-material";

const BillingReportFilter = ({
  isFiltering,
  sendFilterToPage,
  onDialogClose,
}: FilterType) => {
  const [clientName, setClientName] = useState<number | string>(0);
  const [projectName, setProjectName] = useState<number | string>(0);
  const [assignee, setAssignee] = useState<number | string>(0);
  const [reviewer, setReviewer] = useState<number | string>(0);
  const [typeOfReturn, setTypeOfReturn] = useState<number | string>(0);
  const [noOfPages, setNoOfPages] = useState<number | string>("");

  const [clientDropdown, setClientDropdown] = useState<any[]>([]);
  const [projectDropdown, setProjectDropdown] = useState<any[]>([]);
  const [assigneeDropdown, setAssigneeDropdown] = useState<any[]>([]);
  const [reviewerDropdown, setReviewerDropdown] = useState<any[]>([]);
  const [typeOfReturnDropdown, setTypeOfReturnDropdown] = useState<any[]>([
    {
      label: "Form1060",
      value: 1,
    },
    {
      label: "Form1040",
      value: 2,
    },
    {
      label: "Form1040B",
      value: 3,
    },
  ]);

  const [filterName, setFilterName] = useState<string>("");
  const [saveFilter, setSaveFilter] = useState<boolean>(false);
  const [anyFieldSelected, setAnyFieldSelected] = useState(false);
  const [currentFilterId, setCurrentFilterId] = useState<any>();
  const [savedFilters, setSavedFilters] = useState<any[]>([]);
  const [defaultFilter, setDefaultFilter] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [resetting, setResetting] = useState<boolean>(false);

  const [anchorElFilter, setAnchorElFilter] =
    useState<HTMLButtonElement | null>(null);

  const openFilter = Boolean(anchorElFilter);
  const idFilter = openFilter ? "simple-popover" : undefined;

  const handleSearchChange = (e: any) => {
    setSearchValue(e.target.value);
  };

  const handleNoOfPageChange = (e: any) => {
    if (/^\d+$/.test(e.target.value.trim())) {
      setNoOfPages(e.target.value);
    } else {
      return;
    }
  };

  const handleResetAll = () => {
    setClientName(0);
    setProjectName(0);
    setAssignee(0);
    setReviewer(0);
    setTypeOfReturn(0);
    setNoOfPages("");
    setResetting(true);

    sendFilterToPage({
      ...billingreport_InitialFilter,
      clients: [],
      projects: [],
      assigneeId: null,
      reviewerId: null,
      typeofReturnId: null,
      numberOfPages: null,
    });
  };

  const handleClose = () => {
    setResetting(false);
    setFilterName("");
    onDialogClose(false);
    setDefaultFilter(false);

    setClientName(0);
    setProjectName(0);
    setAssignee(0);
    setReviewer(0);
    setTypeOfReturn(0);
    setNoOfPages("");
  };

  const handleFilterApply = () => {
    sendFilterToPage({
      ...billingreport_InitialFilter,
      clients: clientName !== 0 ? [clientName] : [],
      projects: projectName !== 0 ? [projectName] : [],
      assigneeId: assignee !== 0 ? assignee : null,
      reviewerId: reviewer !== 0 ? reviewer : null,
      typeofReturnId: typeOfReturn !== 0 ? typeOfReturn : null,
      numberOfPages: noOfPages.toString().trim().length > 0 ? noOfPages : null,
    });

    onDialogClose(false);
  };

  const handleSavedFilterApply = (index: number) => {
    if (Number.isInteger(index)) {
      if (index !== undefined) {
        sendFilterToPage({
          ...billingreport_InitialFilter,
          clients: savedFilters[index].AppliedFilter.clients,
          projects: savedFilters[index].AppliedFilter.projects,
          assigneeId: savedFilters[index].AppliedFilter.assigneeId,
          reviewerId: savedFilters[index].AppliedFilter.reviewerId,
          typeofReturnId: savedFilters[index].AppliedFilter.typeofReturnId,
          numberOfPages: savedFilters[index].AppliedFilter.numberOfPages,
        });
      }
    }

    onDialogClose(false);
  };

  const handleSaveFilter = async () => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.post(
        `${process.env.worklog_api_url}/filter/savefilter`,
        {
          filterId: currentFilterId ? currentFilterId : null,
          name: filterName,
          AppliedFilter: {
            clients: clientName !== 0 ? [clientName] : [],
            projects: projectName !== 0 ? [projectName] : [],
            assigneeId: assignee !== 0 ? assignee : null,
            reviewerId: reviewer !== 0 ? reviewer : null,
            typeofReturnId: typeOfReturn !== 0 ? typeOfReturn : null,
            numberOfPages:
              noOfPages.toString().trim().length > 0 ? noOfPages : null,
          },
          type: billingReport,
        },
        {
          headers: {
            Authorization: `bearer ${token}`,
            org_token: `${Org_Token}`,
          },
        }
      );

      if (response.status === 200) {
        if (response.data.ResponseStatus.toLowerCase() === "success") {
          toast.success("Filter has been successully saved.");
          getFilterList();
          setSaveFilter(false);
          onDialogClose(false);
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
    getFilterList();
  }, []);

  useEffect(() => {
    const isAnyFieldSelected =
      clientName !== 0 ||
      projectName !== 0 ||
      assignee !== 0 ||
      reviewer !== 0 ||
      typeOfReturn !== 0 ||
      noOfPages.toString().trim().length > 0;

    setAnyFieldSelected(isAnyFieldSelected);
    setSaveFilter(false);
    setResetting(false);
  }, [clientName, projectName, assignee, reviewer, typeOfReturn, noOfPages]);

  useEffect(() => {
    // handleFilterApply();
    const filterDropdowns = async () => {
      setClientDropdown(await getClientData());
      setProjectDropdown(await getProjectData(clientName));
      setAssigneeDropdown(await getUserData());
      setReviewerDropdown(await getUserData());
    };
    filterDropdowns();

    if (parseInt(clientName.toString()) > 0 || resetting) {
      onDialogClose(true);
    }
  }, [clientName]);

  const getFilterList = async () => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.post(
        `${process.env.worklog_api_url}/filter/getfilterlist`,
        {
          type: billingReport,
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
          setSavedFilters(response.data.ResponseData);
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

  const handleSavedFilterEdit = (index: number) => {
    setClientName(savedFilters[index].AppliedFilter.clients[0]);
    setProjectName(savedFilters[index].AppliedFilter.projects[0]);
    setAssignee(savedFilters[index].AppliedFilter.assigneeId);
    setReviewer(savedFilters[index].AppliedFilter.reviewerId);
    setTypeOfReturn(savedFilters[index].AppliedFilter.typeofReturnId);
    setNoOfPages(savedFilters[index].AppliedFilter.numberOfPages);

    setCurrentFilterId(savedFilters[index].FilterId);
    setFilterName(savedFilters[index].Name);
    setDefaultFilter(true);
    setSaveFilter(true);
  };

  const handleSavedFilterDelete = async () => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.post(
        `${process.env.worklog_api_url}/filter/delete`,
        {
          filterId: currentFilterId,
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
          toast.success("Filter has been deleted successfully.");
          getFilterList();
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

  return (
    <>
      {savedFilters.length > 0 && !defaultFilter ? (
        <Popover
          id={idFilter}
          open={isFiltering}
          anchorEl={anchorElFilter}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 130,
            horizontal: 1290,
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <div className="flex flex-col py-2 w-[200px] ">
            <span
              className="p-2 cursor-pointer hover:bg-lightGray"
              onClick={() => {
                setDefaultFilter(true);
                setCurrentFilterId(0);
              }}
            >
              Default Filter
            </span>
            <hr className="text-lightSilver mt-2" />

            <span className="py-3 px-2 relative">
              <InputBase
                className="border-b border-b-slatyGrey"
                placeholder="Search saved filters"
                inputProps={{ "aria-label": "search" }}
                value={searchValue}
                onChange={handleSearchChange}
                sx={{ fontSize: 14 }}
              />
              <span className="absolute top-4 right-3 text-slatyGrey">
                <SearchIcon />
              </span>
            </span>
            {savedFilters.map((i: any, index: number) => {
              return (
                <>
                  <div
                    key={index}
                    className="group px-2 cursor-pointer bg-whiteSmoke hover:bg-lightSilver flex justify-between items-center h-9"
                  >
                    <span
                      className="pl-1"
                      onClick={() => {
                        setCurrentFilterId(i.FilterId);
                        onDialogClose(false);
                        handleSavedFilterApply(index);
                        // setFilterApplied(true);
                      }}
                    >
                      {i.Name}
                    </span>
                    <span className="flex gap-[10px] pr-[10px]">
                      <span onClick={() => handleSavedFilterEdit(index)}>
                        <Tooltip title="Edit" placement="top" arrow>
                          <Edit className="hidden group-hover:inline-block w-5 h-5 ml-2 text-slatyGrey fill-current" />
                        </Tooltip>
                      </span>
                      <span
                        onClick={() => {
                          setIsDeleting(true);
                          setCurrentFilterId(i.FilterId);
                        }}
                      >
                        <Tooltip title="Delete" placement="top" arrow>
                          <Delete className="hidden group-hover:inline-block w-5 h-5 ml-2 text-slatyGrey fill-current" />
                        </Tooltip>
                      </span>
                    </span>
                  </div>
                </>
              );
            })}
            <hr className="text-lightSilver mt-2" />
            <Button onClick={handleResetAll} className="mt-2" color="error">
              clear all
            </Button>
          </div>
        </Popover>
      ) : (
        <Dialog
          open={isFiltering}
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
                <FormControl
                  variant="standard"
                  sx={{ mx: 0.75, minWidth: 200 }}
                >
                  <InputLabel id="clientName">Client Name</InputLabel>
                  <Select
                    labelId="clientName"
                    id="clientName"
                    value={clientName === 0 ? "" : clientName}
                    onChange={(e) => setClientName(e.target.value)}
                  >
                    {clientDropdown.map((i: any, index: number) => (
                      <MenuItem value={i.value} key={index}>
                        {i.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl
                  variant="standard"
                  sx={{ mx: 0.75, minWidth: 200 }}
                >
                  <InputLabel id="projectName">Project Name</InputLabel>
                  <Select
                    labelId="projectName"
                    id="projectName"
                    value={projectName === 0 ? "" : projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                  >
                    {projectDropdown.map((i: any, index: number) => (
                      <MenuItem value={i.value} key={index}>
                        {i.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl
                  variant="standard"
                  sx={{ mx: 0.75, minWidth: 200 }}
                >
                  <InputLabel id="assignee">Prepared/Assignee</InputLabel>
                  <Select
                    labelId="assignee"
                    id="assignee"
                    value={assignee === 0 ? "" : assignee}
                    onChange={(e) => setAssignee(e.target.value)}
                  >
                    {assigneeDropdown.map((i: any, index: number) => (
                      <MenuItem value={i.value} key={index}>
                        {i.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div className="flex gap-[20px]">
                <FormControl
                  variant="standard"
                  sx={{ mx: 0.75, minWidth: 200 }}
                >
                  <InputLabel id="reviewer">Reviewer</InputLabel>
                  <Select
                    labelId="reviewer"
                    id="reviewer"
                    value={reviewer === 0 ? "" : reviewer}
                    onChange={(e) => setReviewer(e.target.value)}
                  >
                    {reviewerDropdown.map((i: any, index: number) => (
                      <MenuItem value={i.value} key={index}>
                        {i.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl
                  variant="standard"
                  sx={{ mx: 0.75, minWidth: 200 }}
                >
                  <InputLabel id="typeOfReturn">Type of Return</InputLabel>
                  <Select
                    labelId="typeOfReturn"
                    id="typeOfReturn"
                    value={typeOfReturn === 0 ? "" : typeOfReturn}
                    onChange={(e) => setTypeOfReturn(e.target.value)}
                  >
                    {typeOfReturnDropdown.map((i: any, index: number) => (
                      <MenuItem value={i.value} key={index}>
                        {i.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl
                  variant="standard"
                  sx={{ mt: 0.35, mx: 0.75, minWidth: 200 }}
                >
                  {/* <InputLabel id="department">Department</InputLabel> */}
                  {/* <Select
                    labelId="department"
                    id="department"
                    value={dept === 0 ? "" : dept}
                    onChange={(e) => setDept(e.target.value)}
                  >
                    {deptDropdown.map((i: any, index: number) => (
                      <MenuItem value={i.value} key={index}>
                        {i.label}
                      </MenuItem>
                    ))}
                  </Select> */}
                  <TextField
                    id="noOfPages"
                    label="Number of Pages"
                    variant="standard"
                    value={noOfPages}
                    onChange={handleNoOfPageChange}
                  />
                </FormControl>
              </div>
            </div>
          </DialogContent>
          <DialogActions className="border-t border-t-lightSilver p-[20px] gap-[10px] h-[64px]">
            {!saveFilter ? (
              <>
                <Button
                  variant="contained"
                  color="info"
                  className={`${anyFieldSelected && "!bg-secondary"}`}
                  disabled={!anyFieldSelected}
                  onClick={handleFilterApply}
                >
                  Apply Filter
                </Button>

                <Button
                  variant="contained"
                  color="info"
                  className={`${anyFieldSelected && "!bg-secondary"}`}
                  onClick={() => setSaveFilter(true)}
                  disabled={!anyFieldSelected}
                >
                  Save Filter
                </Button>
              </>
            ) : (
              <>
                <FormControl
                  variant="standard"
                  sx={{ marginRight: 3, minWidth: 400 }}
                >
                  <TextField
                    placeholder="Enter Filter Name"
                    fullWidth
                    required
                    variant="standard"
                    value={filterName}
                    onChange={(e) => setFilterName(e.target.value)}
                  />
                </FormControl>
                <Button
                  variant="contained"
                  color="info"
                  onClick={handleSaveFilter}
                  className={`${
                    filterName.length === 0 ? "" : "!bg-secondary"
                  }`}
                  disabled={filterName.length === 0}
                >
                  Save & Apply
                </Button>
              </>
            )}

            <Button variant="outlined" color="info" onClick={handleClose}>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      )}

      <DeleteDialog
        isOpen={isDeleting}
        onClose={() => setIsDeleting(false)}
        onActionClick={handleSavedFilterDelete}
        Title={"Delete Filter"}
        firstContent={"Are you sure you want to delete this saved filter?"}
        secondContent={
          "If you delete this, you will permanently loose this saved filter and selected fields."
        }
      />
    </>
  );
};

export default BillingReportFilter;