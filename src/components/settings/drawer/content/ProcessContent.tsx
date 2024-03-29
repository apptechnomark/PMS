/* eslint-disable react/display-name */
/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Select, Text } from "next-ts-lib";
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
import { toast } from "react-toastify";

export interface ProcessContentRef {
  ProcessDataValue: () => void;
}

const ProcessContent = forwardRef<
  ProcessContentRef,
  {
    tab: any;
    onEdit: boolean;
    onOpen: boolean;
    onClose: any;
    processData: any;
    onDataFetch(): any;
    onChangeLoader: any;
  }
>(({ onEdit, onOpen, onClose, onDataFetch, onChangeLoader }, ref) => {
  const token = localStorage.getItem("token");
  const org_token = localStorage.getItem("Org_Token");
  const [data, setData] = useState([]);

  const [selectValue, setSelectValue] = useState(0);
  const [selectvalueErr, setSelectValueErr] = useState(false);
  const [selectvalueHasErr, setSelectValueHasErr] = useState(false);
  const [subProcessName, setSubProcessName] = useState("");
  const [subProcessNameError, setSubProcessNameError] = useState(false);
  const [subProcessNameHasError, setSubProcessNameHasError] = useState(false);
  const [returnType, setReturnType] = useState(0);
  const [returnTypeError, setReturnTypeError] = useState(false);
  const [returnTypeHasError, setReturnTypeHasError] = useState(false);
  const returnTypeDrpdown = [
    {
      label: "None",
      value: 3,
    },
    {
      label: "Individual Return",
      value: 1,
    },
    {
      label: "Business Return",
      value: 2,
    },
  ];
  const [estTime, setEstTime] = useState<any>("");
  const [estTimeError, setEstTimeError] = useState(false);
  const [estTimeHasError, setEstTimeHasError] = useState(false);
  const [productive, setProductive] = useState<boolean>(true);
  const [billable, setBillable] = useState<boolean>(true);
  const [activityHasError, setActivityHasError] = useState<boolean>(false);
  const [activityError, setActivityError] = useState<boolean>(false);
  const [activity, setActivity] = useState<string[]>([]);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [processId, setProcessId] = useState();
  const [textValue, setTextValue] = useState("");
  const [textName, setTextName] = useState("");
  const [estErrMsg, setEstErrMsg] = useState("");
  const [convertedSec, setConvertedSec] = useState<number>(0);
  const [type, setType] = useState<string>("text");

  const handleDelete = (ProcessId: any) => {
    setProcessId(ProcessId);
    setIsDeleteOpen(true);
  };

  const handleEstTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = event.target.value;
    newValue = newValue.replace(/\D/g, "");
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

    let totalSeconds = 0;

    if (formattedValue) {
      const timeComponents = formattedValue.split(":");
      const hours = parseInt(timeComponents[0]);
      const minutes = parseInt(timeComponents[1]);
      const seconds = parseInt(timeComponents[2]);
      totalSeconds = hours * 3600 + minutes * 60 + seconds;
    }
    setConvertedSec(totalSeconds);
    setEstTime(formattedValue);
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
      const isValidInput = /^[a-zA-Z0-9\s,]*$/.test(value);

      if (isValidInput && value.trim().length <= 50) {
        const updatedInputList = [...inputList];
        updatedInputList[index].activityName = value.trim();
        setInputList(updatedInputList);

        const updatedActivity = [...activity];
        updatedActivity[index] = value;
        setActivity(updatedActivity);
      } else {
        setActivityHasError(true);
      }
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

  function secondsToHHMMSS(seconds: any) {
    const hours = Math.floor(seconds / 3600);
    const remainingSeconds = seconds % 3600;
    const minutes = Math.floor(remainingSeconds / 60);
    const remainingSecondsFinal = remainingSeconds % 60;

    const hoursStr = hours.toString().padStart(2, "0");
    const minsStr = minutes.toString().padStart(2, "0");
    const secsStr = remainingSecondsFinal.toString().padStart(2, "0");

    return `${hoursStr}:${minsStr}:${secsStr}`;
  }

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
            setSelectValueHasErr(true);
            setSubProcessName(response.data.ResponseData.Name);
            setSubProcessNameHasError(true);
            setReturnType(
              response.data.ResponseData.ReturnType === null
                ? 0
                : response.data.ResponseData.ReturnType === 0
                ? 3
                : response.data.ResponseData.ReturnType
            );
            setReturnTypeHasError(true);
            const estTimeConverted = secondsToHHMMSS(
              response.data.ResponseData.EstimatedHour
            );
            setEstTime(estTimeConverted);
            setEstTimeHasError(true);
            setActivity(response.data.ResponseData.ActivityList);
            setProductive(response.data.ResponseData.IsProductive);
            setBillable(response.data.ResponseData.IsBillable);
          } else {
            const data = response.data.Message;
            if (data === null) {
              toast.error("Please try again later.");
            } else {
              toast.error(data);
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

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
            toast.error("Please try again later.");
          } else {
            toast.error(data);
          }
        }
      } else {
        const data = response.data.Message;
        if (data === null) {
          toast.error("Add failed. Please try again.");
        } else {
          toast.error(data);
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
            toast.success(
              `${editing ? "" : "New"} Process ${
                editing ? "Updated" : "added"
              }  successfully.`
            );
            await onDataFetch();
          } else {
            const data = response.data.Message;
            if (data === null) {
              toast.error("Please try again later.");
            } else {
              toast.error(data);
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
            await onDataFetch();
            getDropdownData();
            toast.success(
              `${onEdit ? "" : "New"} Process ${
                onEdit ? "Updated" : "added"
              }  successfully.`
            );
          } else {
            const data = response.data.Message;
            if (data === null) {
              toast.error("Please try again later.");
            } else {
              toast.error(data);
            }
          }
          getDropdownData();
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const setHasTrue = () => {
    setSelectValueErr(true);
    setSubProcessNameError(true);
    setReturnTypeError(true);
    setEstTimeError(true);
    setActivityError(true);
  };

  const clearData = () => {
    setSubProcessName("");
    setReturnType(0);
    setEstTime("");
    setSelectValue(0);
    setInputList([]);
    setSelectValueErr(false);
    setSelectValueHasErr(false);
    setSubProcessNameError(false);
    setSubProcessNameHasError(false);
    setReturnTypeError(false);
    setReturnTypeHasError(false);
    setEstTimeError(false);
    setEstTimeHasError(false);
    setActivity([]);
    setActivityError(false);
    setActivityHasError(false);
  };

  const ProcessDataValue = async () => {
    await setHasTrue();
    await clearData();
  };

  useImperativeHandle(ref, () => ({
    ProcessDataValue,
  }));

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    selectValue <= 0 && setSelectValueErr(true);
    const [hours, minutes, seconds] = estTime.split(":");
    const estTimeTotalSeconds =
      parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds);
    subProcessName.trim().length <= 0 && setSubProcessNameError(true);
    returnType <= 0 && setReturnTypeError(true);
    estTime.length < 8 && setEstTimeError(true);
    if (
      selectValue > 0 &&
      subProcessName.length > 0 &&
      returnType > 0 &&
      estTime !== "00:00:00" &&
      estTime !== "" &&
      estTime.length >= 8 &&
      estTimeTotalSeconds > 0 &&
      selectvalueHasErr &&
      subProcessNameHasError &&
      returnTypeHasError &&
      estTimeHasError
    ) {
      onChangeLoader(true);
      try {
        const prams = {
          ProcessId: onEdit || 0,
          Name: subProcessName.trim(),
          ReturnTypeId: returnType === 3 ? 0 : returnType,
          ActivityList: activity
            .map((i: any) => (i.trim().length > 0 ? i.trim() : false))
            .filter((j: any) => j !== false),
          EstimatedHour: estTimeTotalSeconds,
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
            closeDrawer();
            ProcessDataValue();
            onDataFetch();
            onChangeLoader(false);
            toast.success(
              `${onEdit ? "" : "New"} Process ${
                onEdit ? "Updated" : "added"
              }  successfully.`
            );
          } else {
            onChangeLoader(false);
            const data = response.data.Message;
            if (data === null) {
              toast.error("Please try again later.");
            } else {
              toast.error(data);
            }
          }
        }
      } catch (error) {
        onChangeLoader(false);
        console.error(error);
      }
    }
    if (estTime === "00:00:00") {
      setEstErrMsg("Estimated Time cannot be 00:00:00");
    }
    if (estTime.length < 8) {
      setEstErrMsg("Estimated Time must be in HH:MM:SS");
    }
  };

  const addMoreSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    selectValue <= 0 && setSelectValueErr(true);
    const [hours, minutes, seconds] = estTime.split(":");
    const estTimeTotalSeconds =
      parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds);
    subProcessName.trim().length <= 0 && setSubProcessNameError(true);
    returnType <= 0 && setReturnTypeError(true);
    estTimeTotalSeconds === 0 && setEstTimeError(true);

    if (
      selectValue > 0 &&
      subProcessName.length > 0 &&
      returnType > 0 &&
      estTime !== "00:00:00" &&
      estTime !== "" &&
      estTime.length >= 8 &&
      estTimeTotalSeconds > 0 &&
      selectvalueHasErr &&
      subProcessNameHasError &&
      returnTypeHasError &&
      estTimeHasError
    ) {
      onChangeLoader(true);
      try {
        const prams = {
          ProcessId: onEdit || 0,
          Name: subProcessName,
          ReturnTypeId: returnType === 3 ? 0 : returnType,
          ActivityList: activity,
          EstimatedHour: estTimeTotalSeconds,
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
            onChangeLoader(false);
            toast.success(
              `${onEdit ? "" : "New"} Process ${
                onEdit ? "Updated" : "added"
              }  successfully.`
            );
          } else {
            onChangeLoader(false);
            const data = response.data.Message;
            if (data === null) {
              toast.error("Please try again later.");
            } else {
              toast.error(data);
            }
          }
        }
      } catch (error) {
        onChangeLoader(false);
        console.error(error);
      }
    }
    if (estTime === "00:00:00") {
      setEstErrMsg("Estimated Time cannot be 00:00:00");
    }
    if (estTime.length < 8) {
      setEstErrMsg("Estimated Time must be in HH:MM:SS");
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
          setIsDeleteOpen(false);
          toast.success("Process has been deleted successfully!");
        } else {
          const data = response.data.Message;
          if (data === null) {
            toast.error("Please try again later.");
          } else {
            toast.error(data);
          }
        }
        getDropdownData();
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    onOpen && getDropdownData();
    if (!onEdit) {
      setActivity([]);
    } else {
      fetchEditData();
    }
  }, [onEdit, onOpen]);

  const closeDrawer = () => {
    setActivity([]);
    setProductive(true);
    setBillable(true);
    setEstTimeError(false);
    setEstTimeHasError(false);
    setEstErrMsg("");
    setEstTime("");
    onClose();
  };

  const closeModal = () => {
    setIsDeleteOpen(false);
  };

  const handleBillableChange = (value: any) => {
    const isBillable = value === "billable";
    setBillable(isBillable);
  };

  const handleProductiveChange = (id: any) => {
    if (id === "p1") {
      setProductive(true);
    } else {
      setProductive(false);
      setBillable(false);
    }
  };

  const handleSubProcesChange = (value: any) => {
    if (value.length <= 50) {
      setSubProcessNameError(false);
      setSubProcessName(value);
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
              value > 0 && setSelectValueErr(false);
            }}
            addDynamicForm
            addDynamicForm_Placeholder="Enter Process"
            addDynamicForm_MaxLength={50}
            addDynamicForm_Icons_Edit={onEdit}
            addDynamicForm_Icons_Delete={onEdit}
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
            noSpecialCharRegex={/[^a-zA-Z0-9-_\s]/}
            value={subProcessName}
            hasError={subProcessNameError}
            getValue={(value: any) => handleSubProcesChange(value)}
            getError={(e: any) => setSubProcessNameHasError(e)}
          />
        </div>
        <div className="flex flex-col px-[20px] mt-4">
          <Select
            label="Return Type"
            id="return_type"
            validate
            placeholder="Select Return Type"
            defaultValue={returnType === 0 ? "" : returnType}
            onSelect={() => {}}
            options={returnTypeDrpdown}
            hasError={returnTypeError}
            getValue={(e) => {
              setReturnType(e);
              e > 0 && setReturnTypeError(false);
            }}
            getError={(e) => setReturnTypeHasError(e)}
          />
        </div>
        <div className="flex flex-col px-[20px] py-[20px]">
          <Text
            validate
            getValue={(value: any) => setEstTime(value)}
            onChange={handleEstTimeChange}
            getError={(e: any) => setEstTimeHasError(e)}
            errorMessage={estErrMsg}
            hasError={estTimeError}
            value={estTime === 0 ? "" : estTime}
            type={type}
            min={0}
            max={23}
            label="Estimated Time (HH:MM:SS)"
            placeholder="00:00:00"
            className="[appearance:number] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none &::-moz-time-text: { display: none; }"
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
        <span className="flex items-center pr-[20px] pl-[20px] pb-[20px]">
          <div className="mr-[100px] checkboxRadio">
            <input
              type="checkbox"
              id="p1"
              name="group1"
              checked={productive}
              onChange={() => handleProductiveChange("p1")}
              value="productive"
            />
            <span>Productive</span>
          </div>
          <div className="checkboxRadio">
            <input
              type="checkbox"
              id="non_p1"
              name="group1"
              checked={!productive}
              onChange={() => handleProductiveChange("non_p1")}
              value="non_productive"
            />
            <span>Non-Productive</span>
          </div>
        </span>
        <span className="flex items-center pr-[20px] pl-[20px] pb-[20px]">
          <div className="mr-[128px] checkboxRadio">
            <input
              type="checkbox"
              id="billable"
              name="group2"
              onChange={() => handleBillableChange("billable")}
              disabled={!productive}
              checked={billable}
              value="billable"
            />
            <span>Billable</span>
          </div>
          <div className="checkboxRadio">
            <input
              type="checkbox"
              onChange={() => handleBillableChange("non_billable")}
              disabled={!productive}
              checked={!billable}
              value="non_billable"
              name="group2"
              id="non_billable"
            />
            <span>Non-Billable</span>
          </div>
        </span>

        {/* Footer */}
        <div className="flex justify-end fixed w-full bottom-0 gap-[20px] px-[20px] py-[15px] bg-pureWhite border-t border-lightSilver">
          <>
            {onEdit ? (
              <Button
                variant="btn-outline-primary"
                className="rounded-[4px] !h-[36px] !uppercase"
                onClick={() => {
                  ProcessDataValue();
                  onClose();
                }}
              >
                Cancel
              </Button>
            ) : (
              <Button
                variant="btn-outline-primary"
                className="rounded-[4px] !h-[36px] !uppercase"
                onClick={addMoreSubmit}
              >
                Add More
              </Button>
            )}
            <Button
              variant="btn-primary"
              className="rounded-[4px] !h-[36px] !uppercase"
              onClick={handleSubmit}
            >
              {onEdit ? "Save" : "Create Process"}
            </Button>
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
