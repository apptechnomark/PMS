/* eslint-disable react/display-name */
/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { Button, Loader, MultiSelectChip, Text, Toast } from "next-ts-lib";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";

export interface GroupContentRef {
  groupDataValue: () => void;
}

const GroupContent = forwardRef<
  GroupContentRef,
  {
    tab: any;
    onEdit: boolean;
    onClose: () => void;
    onDataFetch: any;
    orgData: any;
    groupData: any;
  }
>(({ tab, orgData, groupData, onEdit, onClose, onDataFetch }, ref) => {
  const [data, setData] = useState([]);
  const [name, setName] = useState("");
  const [nameErr, setNameErr] = useState(false);
  const [nameHasError, setNameHasError] = useState(false);
  const [selectValue, setSelectValue] = useState([]);
  const [selectvalueErr, setSelectValueErr] = useState(false);
  const [selectvalueHasErr, setSelectValueHasErr] = useState(false);
  const [loader, setLoader] = useState(false);

  const token = localStorage.getItem("token");
  const org_token = localStorage.getItem("Org_Token");
  const fetchEditData = async () => {
    if (onEdit) {
      try {
        const response = await axios.post(
          `${process.env.pms_api_url}/group/getbyid`,
          { groupId: onEdit || 0 },
          {
            headers: {
              Authorization: `bearer ${token}`,
              org_token: org_token,
            },
          }
        );

        if (response.status === 200) {
          let groupuserIds = response.data.ResponseData.GroupUserIds;

          if (response.data.ResponseStatus === "Success") {
            setName(response.data.ResponseData.Name);
            if (!groupuserIds) {
              groupuserIds = null;
            } else {
              setSelectValue(response.data.ResponseData.GroupUserIds);
            }
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
      setName("");
      setSelectValue([]);
    }
  };

  useEffect(() => {
    // Call the async function
    fetchEditData();
    // Fetch dropdown data unconditionally
    getDropdownData();

    setNameErr(false);
    setNameHasError(false);
    setSelectValueErr(false);
    setSelectValueHasErr(false);
  }, [onEdit]);

  // For drop down fetch data in api
  const getDropdownData = async () => {
    try {
      const response = await axios.get(
        `${process.env.api_url}/user/getdropdown`,
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

  // For Error Handling
  const groupDataValue = async () => {
    const setHasTrue = () => {
      setNameErr(true);
      setSelectValueErr(true);
    };
    const clearData = () => {
      setName("");
      setSelectValue([]);
      setNameErr(false);
      setSelectValueErr(false);
      setNameHasError(false);
      setSelectValueHasErr(false);
    };
    await setHasTrue();
    await clearData();
  };

  useImperativeHandle(ref, () => ({
    groupDataValue,
  }));

  // For create Group
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    name.trim().length <= 0 && setNameErr(true);
    const validName = /^[a-zA-Z0-9 ]+$/.test(name);

    if (!validName) {
      setNameErr(true);
      return;
    }
    if (!(name.trim().length <= 0)) {
      setLoader(true);
      try {
        const prams = {
          id: onEdit || 0,
          name: name,
          groupUserIds: selectValue,
        };
        const response = await axios.post(
          `${process.env.pms_api_url}/group/save`,
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
            onDataFetch();
            setLoader(false);
            onClose();
            groupDataValue();
            Toast.success(
              `${onEdit ? "" : "New"} Group ${
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
        } else {
          setLoader(false);
          const data = response.data.Message;
          if (data === null) {
            Toast.error("Please try again.");
          } else {
            Toast.error(data);
          }
        }
      } catch (error) {
        setLoader(false);
        console.error(error);
      }
    }
  };

  // AddMore data Submit
  const addMoreSubmit = async (e: any) => {
    e.preventDefault();
    name.trim().length <= 0 && setNameErr(true);
    if (!(name.trim().length <= 0)) {
      try {
        const prams = {
          id: onEdit || 0,
          name: name,
          groupUserIds: selectValue,
        };
        const response = await axios.post(
          `${process.env.pms_api_url}/group/save`,
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
            Toast.success(
              `${onEdit ? "" : "New"} Group ${
                onEdit ? "Updated" : "added"
              }  successfully.`
            );
            onDataFetch();
            groupDataValue();
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
      setName("");
      setSelectValue([]);
    }
  };

  const handleGroupChange = (value: any) => {
    if (value.length <= 20) {
      setNameErr(false);
      setName(value);
    }
  };

  return (
    <>
      <div className="flex gap-[20px] flex-col p-[20px]">
        <Text
          getValue={(value: any) => handleGroupChange(value)}
          validate
          label="Group Name"
          placeholder="Add group Name"
          hasError={nameErr}
          value={name}
          // noSpecialChar
          getError={(e) => setNameHasError(e)}
        />
        <MultiSelectChip
          errorClass="!-mt-4"
          label="User"
          id="user"
          onSelect={(value: any) => {
            setSelectValue(value);
          }}
          options={data}
          defaultValue={selectValue}
          getError={(e: any) => {
            setSelectValueHasErr(e);
          }}
          type="checkbox"
          hasError={selectvalueErr}
          getValue={(value: any) => {
            setSelectValue(value);
          }}
        />
      </div>

      <div className="flex justify-end fixed w-full bottom-0 gap-[20px] px-[20px] py-[15px] bg-pureWhite border-t border-lightSilver">
        <>
          {onEdit ? (
            <Button
              variant="btn-outline-primary"
              className="rounded-[4px] !h-[36px]"
              onClick={groupDataValue}
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
              type="submit"
              onClick={handleSubmit}
            >
              {onEdit ? "Save" : "Create Group"}
            </Button>
          )}
        </>
      </div>
    </>
  );
});

export default GroupContent;
