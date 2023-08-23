"use client";

import React, { useEffect, useState } from "react";
import { CheckBox, DataTable, Toast } from "next-ts-lib";
import "next-ts-lib/dist/index.css";
import axios from "axios";
import { log } from "console";

const Permissions = ({ onOpen, permissionValue, sendDataToParent }: any) => {
  const [data, setData] = useState<any>([]);
  const [isAction, setIsAction] = useState<string>("")

  const columns = [
    { header: "NAME", accessor: "Name", sortable: false },
    { header: "", accessor: "IsView", sortable: false },
    {}, {}
  ]


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

  const getCheckbox = (list:any) => {
  }
console.log(data[0]?.Children)
  // getCheckbox()
  let tableData: any[] = data.map((i: any) => {
    const isViewChecked = i.IsView;


    return {
      ...i,
      IsView: (
        <>
          <CheckBox
            id={`view_${i.Id}`}
            checked={isViewChecked}
            onChange={(e) => {
              handlePermissionChange(i.Id, isAction, e.target.checked);
            }}

          />
          <label className="ml-2">{isAction}</label>
        </>
      ),

      details: i.Children.length > 0 && (
        <div className="ml-12">

          <DataTable
            columns={[{ header: "Name", accessor: "name", sortable: false }, ...getLargestArray(i?.Children).map((child:any) => new Object({ header: child.ActionName, accessor: child.ActionName, sortable: false }))]}
            data={i.Children.map(({Name,ActionList,...more}: any, index: number) => new Object({name:Name}))}
          />
        </div>
      ),
    };
  });

  console.log("data", data[1]?.Children);


  const handleDetailPermissionChange = (
    parentId: number,
    childId: number,
    permissionType: string,
    checked: boolean
  ) => {
    const newData = data.map((item: any) =>
      item.Id === parentId
        ? {
          ...item,
          Children: item.Children.map((i: any) => {
            return i.Id === childId
              ? { ...i, [permissionType]: checked }
              : { ...i };
          }),
        }
        : item
    );
    setData(newData);
    sendDataToParent(newData);
  };

  const handlePermissionChange = (
    id: number,
    field: string,
    value: boolean
  ) => {
    const newData = data.map((item: any) =>
      item.Id === id ? { ...item, [field]: value } : item
    );
    setData(newData);
    sendDataToParent(newData);
  };

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
        <DataTable expandable columns={columns} data={tableData} />
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
