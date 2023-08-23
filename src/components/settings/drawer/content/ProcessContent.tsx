/* eslint-disable react/display-name */
/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Loader, Radio, Select, Text, Toast } from "next-ts-lib";
import React, {
  useState,
  forwardRef,
  useEffect,
  useImperativeHandle,
} from "react";

import PlusIcon from "@/assets/icons/PlusIcon";
import MinusIcon from "@/assets/icons/MinusIcon";
import axios from "axios";
import DeleteModal from "@/components/common/DeleteModal";

export interface ProcessContentRef {
  ProcessDataValue: () => void;
}

const ProcessContent = forwardRef<
  ProcessContentRef,
  {
    tab: any;
    onEdit: boolean;
    onClose: any;
    processData: any;
    onDataFetch(): any;
  }
>(({ tab, processData, onEdit, onClose, onDataFetch }, ref) => {
  // For token and org_token
  const token = localStorage.getItem("token");
  const org_token = localStorage.getItem("Org_Token");
  const [isTextFieldOpen, setIsTextFieldOpen] = useState(false);
  const [data, setData] = useState([]);

  // select Dropdown State
  const [selectValue, setSelectValue] = useState(0);
  const [selectvalueErr, setSelectValueErr] = useState(false);
  const [selectvalueHasErr, setSelectValueHasErr] = useState(false);
  // Sub-process state

  const [subProcessName, setSubProcessName] = useState("");
  const [subProcessNameError, setSubProcessNameError] = useState(false);
  const [subProcessNameHasError, setSubProcessNameHasError] = useState(false);
  const [estTime, setEstTime] = useState("");
  const [estTimeError, setEstTimeError] = useState(false);
  const [estTimeHasError, setEstTimeHasError] = useState(false);
  const [productive, setProductive] = useState<boolean>(true);
  const [billable, setBillable] = useState<boolean>(false);
  const [activityHasError, setActivityHasError] = useState<boolean>(false);
  const [activityError, setActivityError] = useState<boolean>(false);
  const [activity, setActivity] = useState<string[]>([""]);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [processId, setProcessId] = useState();
  const [textValue, setTextValue] = useState("");
  const [textName, setTextName] = useState("");

  const [defaultProductive, setDefaultProductive] = useState(false);
  const [loader, setLoader] = useState(false);

  const handleDelete = (ProcessId: any) => {
    setProcessId(ProcessId);
    setIsDeleteOpen(true);
  };

  const handleEstTimeChange = (value: any) => {
    if (value.length <= 3) {
      setEstTimeError(false);
      setEstTime(value);
    }
  };

  const initialInputList = activity.map((activityName) => ({
    activityName: activityName,
  }));

  const [inputList, setInputList] =
    useState<{ activityName: string }[]>(initialInputList);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.target) {
      const { value } = e.target;
      const updatedInputList = [...inputList];
      updatedInputList[index].activityName = value;
      setInputList(updatedInputList);

      const updatedActivity = [...activity];
      updatedActivity[index] = value;
      setActivity(updatedActivity);
    }
  };

  const handleAddClick = () => {
    const newInputList = [...inputList, { activityName: "" }];
    setInputList(newInputList);
  };

  const handleRemoveClick = (index: number) => {
    const updatedInputList = [...inputList];
    updatedInputList.splice(index, 1);
    setInputList(updatedInputList);

    const updatedActivity = [...activity];
    updatedActivity.splice(index, 1);
    setActivity(updatedActivity);
  };

  useEffect(() => {
    const initialInputList = activity.map((activityName) => ({
      activityName: activityName,
    }));
    setInputList(initialInputList);
  }, [activity]);

  // onEdit fetch data with id
  const fetchEditData = async () => {
    if (onEdit) {
      try {
        const response = await axios.post(
          `${process.env.pms_api_url}/process/GetById`,
          { ProcessId: onEdit },
          {
            headers: {
              Authorization: `bearer ${token}`,
              org_token: org_token,
            },
          }
        );

        if (response.status === 200) {
          if (response.data.ResponseStatus === "Success") {
            setSelectValue(response.data.ResponseData.ParentId);
            setSubProcessName(response.data.ResponseData.Name);
            setEstTime(response.data.ResponseData.EstimatedHour);
            setActivity(response.data.ResponseData.ActivityList);
            setProductive(response.data.ResponseData.IsProductive);
            setBillable(response.data.ResponseData.IsBillable);
          } else {
            const data = response.data.Message;
            if (data === null) {
              Toast.error("Please try again later.");
            } else {
              Toast.error(data);
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      setDefaultProductive(true);
      setProductive(true);
      setBillable(false);
    }
  };

  // Get dropdown data from api
  const getDropdownData = async () => {
    try {
      const response = await axios.get(
        `${process.env.pms_api_url}/Process/GetDropdown`,
        {
          headers: {
            Authorization: `bearer ${token}`,
            org_token: org_token,
          },
        }
      );

      if (response.status === 200) {
        if (response.data.ResponseStatus === "Success") {
          setData(response.data.ResponseData);
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
          Toast.error("Add failed. Please try again.");
        } else {
          Toast.error(data);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleFormButtonClick = async (editing: boolean) => {
    if (editing) {
      try {
        const prams = {
          name: textName,
          ProcessId: textValue,
        };
        const response = await axios.post(
          `${process.env.pms_api_url}/process/SaveParentProcess`,
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
            ProcessDataValue();
            onDataFetch();
            onClose();
            Toast.success(
              `${editing ? "" : "New"} Process ${
                editing ? "Updated" : "added"
              }  successfully.`
            );
          } else {
            const data = response.data.Message;
            if (data === null) {
              Toast.error("Please try again later.");
            } else {
              Toast.error(data);
            }
          }
          getDropdownData();
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        const prams = {
          name: textName,
        };
        const response = await axios.post(
          `${process.env.pms_api_url}/process/SaveParentProcess`,
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
            ProcessDataValue();
            onDataFetch();
            onClose();
            Toast.success(
              `${onEdit ? "" : "New"} Process ${
                onEdit ? "Updated" : "added"
              }  successfully.`
            );
          } else {
            const data = response.data.Message;
            if (data === null) {
              Toast.error("Please try again later.");
            } else {
              Toast.error(data);
            }
          }
          getDropdownData();
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const ProcessDataValue = async () => {
    const setHasTrue = () => {
      // For process Dropdown
      setSelectValueErr(true);

      // For sub-process
      setSubProcessNameError(true);

      setEstTimeError(true);

      setActivityError(true);
    };
    const clearData = () => {
      setSubProcessName("");
      setEstTime("");
      setSelectValue(0);

      setInputList([]);

      // For processDropdown
      setSelectValueErr(false);
      setSelectValueHasErr(false);

      // For sub-process
      setSubProcessNameError(false);
      setSubProcessNameHasError(false);

      // for Est Time
      setEstTimeError(false);
      setEstTimeHasError(false);

      setActivityError(false);
      setActivityHasError(false);
    };
    await setHasTrue();
    await clearData();
  };

  useImperativeHandle(ref, () => ({
    ProcessDataValue,
  }));

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    selectValue <= 0 && setSelectValueErr(true);
    subProcessName.trim().length <= 0 && setSubProcessNameError(true);
    (activity[0]?.trim().length <= 0 || activity[0] === undefined) &&
      setActivityError(true);
    estTime !== undefined &&
      estTime.toString().trim().length <= 0 &&
      setEstTimeError(true);
    if (
      !(selectValue <= 0) &&
      !(subProcessName.length <= 0) &&
      !(estTime.toString().trim().length <= 0) &&
      !(activity[0]?.trim().length <= 0 || activity[0] === undefined)
    ) {
      setLoader(true);
      try {
        const prams = {
          ProcessId: onEdit || 0,
          Name: subProcessName,
          ActivityList: activity,
          EstimatedHour: estTime,
          IsProductive: productive,
          IsBillable: billable,
          ParentId: selectValue,
        };
        const token = await localStorage.getItem("token");
        const response = await axios.post(
          `${process.env.pms_api_url}/process/Save`,
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
            onClose();
            ProcessDataValue();
            onDataFetch();
            setLoader(false);
            Toast.success(
              `${onEdit ? "" : "New"} Process ${
                onEdit ? "Updated" : "added"
              }  successfully.`
            );
          } else {
            setLoader(false);
            const data = response.data.Message;
            if (data === null) {
              Toast.error("Please try again later.");
            } else {
              Toast.error(data);
            }
          }
        }
      } catch (error) {
        setLoader(false);
        console.error(error);
      }
    }
  };

  const addMoreSubmit = async (e: { preventDefault: () => void }) => {
    selectValue <= 0 && setSelectValueErr(true);
    subProcessName.trim().length <= 0 && setSubProcessNameError(true);
    (activity[0]?.trim().length <= 0 || activity[0] === undefined) &&
      setActivityError(true);
    estTime !== undefined &&
      estTime.toString().trim().length <= 0 &&
      setEstTimeError(true);
    if (
      !(selectValue <= 0) &&
      !(subProcessName.trim().length <= 0) &&
      !(estTime.toString().trim().length <= 0) &&
      !(activity[0]?.trim().length <= 0 || activity[0] === undefined)
    ) {
      try {
        const prams = {
          ProcessId: 0,
          Name: subProcessName,
          ActivityList: activity,
          EstimatedHour: estTime,
          IsProductive: productive,
          IsBillable: billable,
          ParentId: selectValue,
        };
        const token = await localStorage.getItem("token");
        const response = await axios.post(
          `${process.env.pms_api_url}/process/Save`,
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
            ProcessDataValue();
            onDataFetch();
            Toast.success(
              `${onEdit ? "" : "New"} Process ${
                onEdit ? "Updated" : "added"
              }  successfully.`
            );
          } else {
            const data = response.data.Message;
            if (data === null) {
              Toast.error("Please try again later.");
            } else {
              Toast.error(data);
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  if (inputList.length === 0) {
    setInputList([{ activityName: "" }]);
  }

  const deleteProcess = async () => {
    try {
      const prams = {
        ProcessId: processId,
      };
      const response = await axios.post(
        `${process.env.pms_api_url}/process/Delete`,
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
          ProcessDataValue();
          onDataFetch();
          onClose();
          setIsDeleteOpen(false);
          Toast.success("Process deleted successfully..!!");
        } else {
          const data = response.data.Message;
          if (data === null) {
            Toast.error("Please try again later.");
          } else {
            Toast.error(data);
          }
        }
        getDropdownData();
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // Make sure to fetch data first, then update states
    fetchEditData();
    getDropdownData();
    if (!onEdit) {
      setActivity([]);
    }
  }, [onEdit]);

  useEffect(() => {
    setActivity([]);
    setProductive(false);
    setBillable(false);
  }, [onClose]);

  const closeModal = () => {
    setIsDeleteOpen(false);
  };

  const handleBillableChange = (value: any) => {
    const isBillable = value === "billable";
    setBillable(isBillable);
  };

  const handleProductiveChange = (e: any) => {
    if (e.target.checked && e.target.id === "p1" && defaultProductive) {
      setDefaultProductive(true);
      setProductive(true);
    }
    if (e.target.checked && e.target.id === "non_p1") {
      setProductive(false);
      setBillable(false);
    }
  };

  return (
    <>
      <form className="max-h-[78vh] overflow-y-auto">
        <div className="flex flex-col p-[20px]">
          <Select
            label="Process"
            validate
            id="process"
            defaultValue={selectValue}
            getError={(e: any) => {
              setSelectValueHasErr(e);
            }}
            options={data}
            hasError={selectvalueErr}
            getValue={(value: any) => {
              setSelectValue(value);
            }}
            addDynamicForm
            addDynamicForm_Placeholder="Enter Process"
            addDynamicForm_Icons_Edit
            addDynamicForm_Icons_Delete
            addDynamicForm_Label="Process"
            onChangeText={(value: any, label: any) => {
              setTextValue(value);
              setTextName(label);
            }}
            onClickButton={handleFormButtonClick}
            onDeleteButton={(e: any) => handleDelete(e)}
          />
        </div>

        <div className="flex flex-col px-[20px]">
          <Text
            label="Sub-Process"
            placeholder="Enter Sub-Process"
            validate
            value={subProcessName}
            hasError={subProcessNameError}
            getValue={(value: any) => setSubProcessName(value)}
            getError={(e: any) => setSubProcessNameHasError(e)}
          />
        </div>
        <div className="flex flex-col px-[20px] py-[20px]">
          <Text
            validate
            getValue={(value: any) => handleEstTimeChange(value)}
            getError={(e: any) => setEstTimeHasError(e)}
            hasError={estTimeError}
            value={estTime}
            maxLength={7}
            type="number"
            label="Estimated Time"
            placeholder="Enter Estimated Time"
            className="[appearance:number] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>

        <div className="flex flex-col px-[20px]">
          {inputList.map((inputItem, i) => (
            <>
              <span key={`input-${i}`} className="flex items-center pb-[20px]">
                <span className="w-full">
                  <Text
                    type="text"
                    label="Activities"
                    validate
                    placeholder={"Enter Activities"}
                    value={inputItem.activityName}
                    getValue={(e: any) => handleInputChange(e, i)}
                    onChange={(e: any) => handleInputChange(e, i)}
                    getError={(e: any) => setActivityHasError(e)}
                    hasError={activityError}
                  />
                </span>
                <div className="btn-box">
                  {i === 0 ? (
                    <span className="cursor-pointer" onClick={handleAddClick}>
                      <PlusIcon />
                    </span>
                  ) : (
                    <span
                      className="cursor-pointer"
                      onClick={() => handleRemoveClick(i)}
                    >
                      <MinusIcon />
                    </span>
                  )}
                </div>
              </span>
            </>
          ))}
        </div>
        <span className="flex items-center pr-[20px] pl-[10px] pb-[20px]">
          <Radio
            id="p1"
            name="group1"
            label="Productive"
            defaultChecked={defaultProductive}
            onChange={handleProductiveChange}
            value="productive"
          />
          <Radio
            id="non_p1"
            name="group1"
            label="Non-Productive"
            defaultChecked={!defaultProductive}
            onChange={handleProductiveChange}
            value="non_productive"
          />
        </span>
        <span className="flex items-center pr-[20px] pl-[10px] pb-[20px]">
          <Radio
            id="billable"
            label="Billable"
            name="group2"
            onChange={() => handleBillableChange("billable")}
            disabled={!productive}
            checked={billable}
            value="billable"
          />
          <Radio
            label="Non-Billable"
            onChange={() => handleBillableChange("non_billable")}
            disabled={!productive}
            checked={!billable}
            value="non_billable"
            name="group2"
            id="non_billable"
          />
        </span>

        {/* Footer */}
        <div className="flex justify-end fixed w-full bottom-0 gap-[20px] px-[20px] py-[15px] bg-pureWhite border-t border-lightSilver">
          <>
            {onEdit ? (
              <Button
                variant="btn-outline-primary"
                className="rounded-[4px] !h-[36px]"
                onClick={onClose}
              >
                Cancel
              </Button>
            ) : (
              <Button
                variant="btn-outline-primary"
                className="rounded-[4px] !h-[36px]"
                onClick={addMoreSubmit}
              >
                Add More
              </Button>
            )}
            {loader ? (
              <span className="-mt-1">
                <Loader size="sm" />
              </span>
            ) : (
              <Button
                variant="btn-primary"
                className="rounded-[4px] !h-[36px]"
                onClick={handleSubmit}
              >
                {onEdit ? "Save" : "Create Process"}
              </Button>
            )}
          </>
        </div>
      </form>
      {isDeleteOpen && (
        <DeleteModal
          isOpen={isDeleteOpen}
          onClose={closeModal}
          title="Delete Process"
          actionText="Yes"
          onActionClick={deleteProcess}
        >
          Are you sure you want to delete Process? <br /> If you delete Process,
          you will permanently lose Process and Process related data.
        </DeleteModal>
      )}
    </>
  );
});

export default ProcessContent;
