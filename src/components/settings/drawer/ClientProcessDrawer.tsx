import EditIcon from "@/assets/icons/EditIcon";
import axios from "axios";
import {
  Button,
  CheckBox,
  Close,
  DataTable,
  Select,
  Text,
  Toast,
  Tooltip,
} from "next-ts-lib";
import React, { useEffect, useState } from "react";

const ClientProcessDrawer = ({
  onOpen,
  onClose,
  selectedRowId,
  onDataFetch,
}: any) => {
  const [clientProcessData, setClientProcessData] = useState([]);
  const [thisclientProcess, setThisClientProcess] = useState([]);
  const [stndrdTime, setStndrdTime] = useState<any>([]);
  const [stndrdTimeErr, setStndrdTimeErr] = useState(false);
  const [stndrdTimeHasErr, setStndrdTimeHasErr] = useState(false);
  const [processType, setProcessType] = useState<any>([]);
  const [processTypeErr, setProcessTypeErr] = useState<any>(false);
  const [processTypeHasErr, setProcessTypeHasErr] = useState<any>(false);
  const [billableType, setBillableType] = useState<any>([]);
  const [billableTypeErr, setBillableTypeErr] = useState<any>(false);
  const [billableTypeHasErr, setBillableTypeHasErr] = useState<any>(false);
  const [rowId, setRowId] = useState<number | null>(null);

  const [selectedRowsData, setSelectedRowsData] = useState<any[]>([]);

  const headers = [
    { header: "", accessor: "Check", sortable: false },
    { header: "PROCESS", accessor: "Process", sortable: true },
    { header: "SUB-PROCESS", accessor: "SubProcess", sortable: true },
    { header: "STANDARD HRS", accessor: "EstimatedHour", sortable: true },
    { header: "PROCESS TYPE", accessor: "IsProductive", sortable: true },
    { header: "BILL TYPE", accessor: "IsBillable", sortable: true },
    { header: "ACTIONS", accessor: "actions", sortable: false },
  ];

  const handleClose = () => {
    setSelectedRowsData([]);
    onClose();
    setRowId(null);
  };

  const handleSubmit = () => {
    const updatedStndrdTime = { ...stndrdTime };
    const updatedProcessType = { ...processType };
    const updatedBillableType = { ...billableType };

    let hasErrors = false;

    clientProcessData.forEach((item: any) => {
      if (updatedStndrdTime[item.Id].length <= 0) {
        setStndrdTimeErr(true);
        hasErrors = true;
        Toast.error("Standard time is required.");
      }

      if (
        updatedProcessType[item.Id] !== true &&
        updatedProcessType[item.Id] !== false
      ) {
        setProcessTypeErr(true);
        hasErrors = true;
        Toast.error("Process type is required.");
      }

      if (
        updatedBillableType[item.Id] !== true &&
        updatedBillableType[item.Id] !== false
      ) {
        setBillableTypeErr(true);
        hasErrors = true;
        Toast.error("Billable type is required.");
      }
    });

    if (hasErrors) {
      return; // Exit early if there are errors
    }

    if (selectedRowsData.length === 0) {
      Toast.error("Please select a Process.");
      return;
    }

    const editedData = selectedRowsData.map((item: any) => ({
      Id: item.Id,
      EstimatedHour: stndrdTime[item.Id],
      IsProductive: processType[item.Id],
      IsBillable: billableType[item.Id],
    }));

    setSelectedRowsData(editedData);

    saveProcess();
  };

  const saveProcess = async () => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");

    try {
      const response = await axios.post(
        `${process.env.pms_api_url}/client/SaveClientProcess`,
        {
          clientId: selectedRowId,
          Processes: selectedRowsData,
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
          Toast.success("Process updated successfully.");
          handleClose();
          onDataFetch();
        } else {
          handleClose();
          const data = response.data.Message;
          if (data === null) {
            Toast.error("Please try again later.");
          } else {
            Toast.error(data);
          }
        }
      } else {
        handleClose();
        const data = response.data.Message;
        if (data === null) {
          Toast.error("Failed Please try again.");
        } else {
          Toast.error(data);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getProcessByClient = async () => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");

    try {
      const response = await axios.post(
        `${process.env.pms_api_url}/client/GetClientProcess`,
        {
          clientId: selectedRowId || 0,
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
          setClientProcessData(response.data.ResponseData);
          const stndrdTimeData: any = {};
          const processTypeData: any = {};
          const billableTypeData: any = {};
          const isClientProcess: any = {};
          response.data.ResponseData.forEach((item: any) => {
            stndrdTimeData[item.Id] = item.EstimatedHour;
            processTypeData[item.Id] = item.IsProductive;
            billableTypeData[item.Id] = item.IsBillable;
            isClientProcess[item.Id] = item.IsClientProcess;
          });
          setStndrdTime(stndrdTimeData);
          setProcessType(processTypeData);
          setBillableType(billableTypeData);
          setThisClientProcess(isClientProcess);
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
          Toast.error("Failed Please try again.");
        } else {
          Toast.error(data);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const clearClientProcessData = () => {
    setStndrdTimeErr(false);
    setStndrdTimeHasErr(false);
    setBillableTypeErr(false);
    setBillableTypeHasErr(false);
    setProcessTypeErr(false);
    setProcessTypeHasErr(false);

    handleClose();
  };

  useEffect(() => {
    if (selectedRowId && onOpen) {
      getProcessByClient();
    }
  }, [selectedRowId, onOpen]);

  const handleActionValue = (id: any) => {
    setRowId(id);
  };

  const handleAddProcessData = (id: any) => {
    const existingIndex = selectedRowsData.findIndex(
      (data: any) => data.id === id
    );

    if (thisclientProcess[id]) {
      // If thisclientProcess is true, set isActive to false
      const rowData = {
        id: id,
        estimatedHour: stndrdTime[id] || 0,
        isProductive: processType[id] || false,
        isBillable: billableType[id] || false,
        isActive: false, // Set isActive to false
      };

      setThisClientProcess((prevClientProcess: any) => ({
        ...prevClientProcess,
        [id]: false,
      }));

      if (existingIndex !== -1) {
        const updatedSelectedRowsData = selectedRowsData.filter(
          (data: any) => data.id !== id
        );
        setSelectedRowsData(updatedSelectedRowsData);
      } else {
        setSelectedRowsData([...selectedRowsData, rowData]);
      }
    } else {
      // If thisclientProcess is false, set isActive to true
      const rowData = {
        id: id,
        estimatedHour: stndrdTime[id] || 0,
        isProductive: processType[id] || false,
        isBillable: billableType[id] || false,
        isActive: true, 
      };

      setThisClientProcess((prevClientProcess: any) => ({
        ...prevClientProcess,
        [id]: true,
      }));

      if (existingIndex !== -1) {
        const updatedSelectedRowsData = selectedRowsData.filter(
          (data: any) => data.id !== id
        );
        setSelectedRowsData(updatedSelectedRowsData);
      } else {
        setSelectedRowsData([...selectedRowsData, rowData]);
      }
    }
  };

  // Setting Table Data
  const table_Data = clientProcessData.map(
    (d: any) =>
      new Object({
        ...d,
        Check: (
          <div>
            <CheckBox
              id={d.Id}
              checked={
                thisclientProcess[d.Id]
                // || selectedRowsData.some((data) => data.id === d.Id)
              }
              onChange={() => handleAddProcessData(d.Id)}
            />
          </div>
        ),

        EstimatedHour: (
          <Text
            value={stndrdTime[d.Id] || ""}
            getValue={(e) => setStndrdTime({ ...stndrdTime, [d.Id]: e })}
            getError={(e) => setStndrdTimeHasErr(e)}
            validate
            noText
            noSpecialChar
            disabled={rowId !== d.Id}
          />
        ),
        IsProductive: (
          <Select
            defaultValue={processType[d.Id]}
            id={`processType-${d.Id}`}
            options={[
              { label: "Productive", value: true },
              { label: "Non-Productive", value: false },
            ]}
            getValue={(e) => setProcessType({ ...processType, [d.Id]: e })}
            getError={(e) => setProcessTypeHasErr(e)}
            // hasError={processTypeErr}
            validate
            disabled={rowId !== d.Id}
          />
        ),
        IsBillable: (
          <Select
            defaultValue={billableType[d.Id]}
            id={`billableType-${d.Id}`}
            options={[
              { label: "Billable", value: true },
              { label: "Non-Billable", value: false },
            ]}
            getValue={(e) => setBillableType({ ...billableType, [d.Id]: e })}
            getError={(e) => setBillableTypeHasErr(e)}
            // hasError={billableTypeErr}
            validate
            disabled={rowId !== d.Id}
          />
        ),
        actions: (
          <div
            onClick={() => handleActionValue(d.Id)}
            className="cursor-pointer w-[66px] flex justify-center transition-transform transform-gpu hover:scale-105 active:scale-95"
          >
            <Tooltip position={"right"} content="Edit">
              <span className="h-6 w-6">
                <EditIcon />
              </span>
            </Tooltip>
          </div>
        ),
      })
  );

  return (
    <div
      className={`fixed right-0 top-0 z-30 h-screen overflow-y-auto w-[80vw] border border-lightSilver bg-pureWhite transform  ${
        onOpen ? "translate-x-0" : "translate-x-full"
      } transition-transform duration-300 ease-in-out`}
    >
      <div className="flex p-[20px] justify-between items-center bg-whiteSmoke border-b border-lightSilver">
        <span className="text-pureBlack text-lg font-medium">Edit Process</span>
        <span onClick={clearClientProcessData}>
          <Close variant="medium" />
        </span>
      </div>

      {table_Data.length > 0 && (
        <div className="px-2 py-2 h-[81vh] max-h-[78.5vh] overflow-y-auto">
          <DataTable columns={headers} data={table_Data} />
        </div>
      )}

      <div className="flex justify-start fixed w-full bottom-0 gap-[20px] px-[20px] py-[15px] bg-pureWhite border-t border-lightSilver">
        <Button
          type="submit"
          variant="btn-primary"
          className="rounded-[4px] !h-[36px]"
          onClick={() => {
            handleSubmit();
          }}
          disabled={selectedRowsData.length === 0}
        >
          Update Process
        </Button>
        <Button
          onClick={clearClientProcessData}
          variant="btn-error"
          className="rounded-[4px] !h-[36px]"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default ClientProcessDrawer;
