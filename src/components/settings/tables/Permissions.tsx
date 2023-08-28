"use client";

import React, { useEffect, useState } from "react";
import { CheckBox, DataTable, Toast } from "next-ts-lib";
import "next-ts-lib/dist/index.css";
import axios from "axios";

const Permissions = ({ onOpen, permissionValue, sendDataToParent }: any) => {
  const [data, setData] = useState<any>([]);
  const [isAction, setIsAction] = useState<string>("")
  const [checkboxStates, setCheckboxStates] = useState<{ [id: string]: boolean }>({});

  const getLargestArray = (arr: any) => {
    let index = 0;
    let arrLength = arr && arr[index]?.ActionList.length;
    arr?.forEach((a: any, i: number) => {
      if (a.ActionList.length > arrLength) {
        arrLength = a?.ActionList.length;
        index = i;
      }
    })
    return arr && arr[index]?.ActionList;
  }

  const handleCheckboxChange = (actionId: string) => {
    setCheckboxStates((prevStates) => ({
      ...prevStates,
      [actionId]: !prevStates[actionId],    }));
  };

  const getCheckbox = (actionList: any) => {
    return actionList?.sort((a: any, b: any) => b.ActionName.localeCompare(a.ActionName)).map((Name: any, index: number) => { return <CheckBox checked={Name.IsChecked} onChange={() => handleCheckboxChange(Name.Id)} id={Math.random().toString()} label={Name.ActionName} key={index} /> });
  };

  function generateColumns(data: any) {
    const largestChildArray = getLargestArray(data);
    const columns = [
      { header: "", accessor: "Name", sortable: false },
      ...(largestChildArray ? largestChildArray.map((child: any, index: number) => ({ header: "", accessor: index, sortable: false })) : [])
    ];

    return columns;
    ;
  }

  let tableData: any[] = data.map((i: any) => {
    const isViewChecked = i.ActionList;
    return {
      ...i,
      ...getCheckbox(isViewChecked),

      details: i.Children.length > 0 && (
        <div className="ml-12">

          <DataTable
            columns={[{ header: "", accessor: "name", sortable: false }, ...getLargestArray(i?.Children).map((child: any, index: number) =>
              new Object({ header: "", accessor: index, sortable: false }
              ))]}
            data={i.Children.map(({ Name, ActionList, ...more }: any, index: number) =>
              new Object({
                name: Name,
                ...getCheckbox(ActionList),
              })
            )}
          />
        </div>
      ),
    };
  });

  const getData = async () => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.post(
        `${process.env.pms_api_url}/Role/GetPermission`,
        {
          roleId: permissionValue !== 0 && permissionValue,
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
          const responseData = response.data.ResponseData;
          setData(responseData);
          if (Array.isArray(responseData) && responseData.length > 0) {
            const actionNames = responseData.map(item => {
              if (item.ActionList && Array.isArray(item.ActionList) && item.ActionList.length > 0) {
                return item.ActionList[0].ActionName;
              }
              return null;
            });
            const isAction = actionNames.find(actionName => actionName !== null);
            setIsAction(isAction)
          }

          sendDataToParent(response.data.ResponseData);
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
          Toast.error("Please try again.");
        } else {
          Toast.error(data);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (permissionValue > 0) {
      getData();
    }
  }, [permissionValue]);

  return (
    <div
      className={`${tableData.length === 0 ? "!h-full" : "!h-[80vh] !w-full"}`}
    >

      {data.length > 0 && (
        <DataTable expandable columns={generateColumns(data)} data={tableData} />
      )}
      {tableData.length === 0 && (
        <p className="flex justify-center items-center py-[17px] text-[14px]">
          Currently there is no record, you may
          <a
            onClick={onOpen}
            className=" text-primary underline cursor-pointer ml-1 mr-1"
          >
            Create Role
          </a>
          to continue
        </p>
      )}
    </div>
  );
};

export default Permissions;