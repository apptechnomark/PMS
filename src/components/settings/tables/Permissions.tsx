/* eslint-disable react/jsx-key */
"use client";

import React, { useEffect, useState } from "react";
import { CheckBox, DataTable, Loader, Toast } from "next-ts-lib";
import "next-ts-lib/dist/index.css";
import axios from "axios";

interface Action {
  IsChecked: boolean;
}

const Permissions = ({
  onOpen,
  permissionValue,
  sendDataToParent,
  expanded,
  loading,
  getOrgDetailsFunction,
  canEdit,
  canDelete,
}: any) => {
  const [data, setData] = useState<any>([]);
  const [isAction, setIsAction] = useState<string>("");

  useEffect(() => {
    if (permissionValue > 0) {
      getData();
    }
  }, [permissionValue]);

  const getLargestArray = (arr: any) => {
    let index = 0;
    let arrLength = arr && arr[index]?.ActionList.length;
    arr?.forEach((a: any, i: number) => {
      if (a.ActionList.length > arrLength) {
        arrLength = a?.ActionList.length;
        index = i;
      }
    });
    return arr && arr[index]?.ActionList;
  };

  const handleCheckboxChange = (
    parentId: number,
    childIndex: number | undefined,
    actionIndex: number
  ) => {
    const updatedData = data.map((parent: any, parentIdx: number) => {
      if (parentIdx === parentId) {
        if (childIndex !== undefined) {
          return {
            ...parent,
            Children: parent.Children.map((child: any, childIdx: number) => {
              if (childIdx === childIndex) {
                return {
                  ...child,
                  ActionList: child.ActionList.map(
                    (action: any, actionIdx: number) => {
                      if (actionIdx === actionIndex) {
                        return {
                          ...action,
                          IsChecked: !action.IsChecked,
                        };
                      }
                      return action;
                    }
                  ),
                };
              }
              return child;
            }),
          };
        } else {
          return {
            ...parent,
            ActionList: parent.ActionList.map(
              (action: any, actionIdx: number) => {
                if (actionIdx === actionIndex) {
                  return {
                    ...action,
                    IsChecked: !action.IsChecked,
                  };
                }
                return action;
              }
            ),
          };
        }
      }
      return parent;
    });

    setData(updatedData);
    sendDataToParent(updatedData);
  };

  const getCheckbox = (
    actionList: any,
    parentId: number,
    childIndex?: number | 0
  ) => {
    return actionList
      ?.sort((a: any, b: any) => b.ActionName.localeCompare(a.ActionName))
      .map((action: any, index: number) => {
        const uniqueId =
          childIndex === undefined
            ? parentId.toString() +
              action.ActionName +
              action.ActionId.toString()
            : parentId.toString() +
              action.ActionName +
              childIndex +
              action.ActionId.toString();

        return (
          <CheckBox
            key={uniqueId}
            label={action.ActionName}
            type="checkbox"
            id={uniqueId}
            checked={action.IsChecked}
            onChange={() => handleCheckboxChange(parentId, childIndex, index)}
          />
        );
      });
  };

  function generateColumns(data: any) {
    const largestChildArray = getLargestArray(data);
    const columns = [
      { header: "", accessor: "Name", sortable: false },
      ...(largestChildArray
        ? largestChildArray.map((child: any, index: number) => ({
            header: "",
            accessor: index,
            sortable: false,
          }))
        : []),
    ];

    return columns;
  }

  let tableData: any[] = data.map((i: any) => {
    const isViewChecked = i.ActionList;
    const Id = i.Sequence - 1;

    return {
      ...i,
      ...getCheckbox(isViewChecked, Id),

      details:
        i.Children.length > 0 ? (
          <div className="ml-12">
            <DataTable
              columns={[
                { header: "", accessor: "name", sortable: false },
                ...getLargestArray(i?.Children).map(
                  (child: any, index: number) =>
                    new Object({ header: "", accessor: index, sortable: false })
                ),
              ]}
              data={i.Children.map(
                ({ Name, ActionList, ...more }: any, index: number) =>
                  new Object({
                    name: Name,
                    ...getCheckbox(ActionList, Id, index),
                  })
              )}
            />
          </div>
        ) : (
          ""
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
          getOrgDetailsFunction();
          if (Array.isArray(responseData) && responseData.length > 0) {
            const actionNames = responseData.map((item) => {
              if (
                item.ActionList &&
                Array.isArray(item.ActionList) &&
                item.ActionList.length > 0
              ) {
                return item.ActionList[0].ActionName;
              }
              return null;
            });
            const isAction = actionNames.find(
              (actionName) => actionName !== null
            );
            setIsAction(isAction);
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
    <>
      {loading && (
        <div className="flex items-center justify-center min-h-screen">
          <Loader />
        </div>
      )}
      {data.length <= 0 ? (
        <p className="flex justify-center items-center py-[17px] text-[14px]">
          Currently there is no record, you may
          <a
            onClick={onOpen}
            className={`text-primary underline ml-1 mr-1 ${
              onOpen !== undefined ? "cursor-pointer" : "cursor-not-allowed"
            }`}
          >
            Create Role
          </a>
          to continue
        </p>
      ) : (
        <div
          className={`${
            tableData.length === 0 ? "!h-full" : "!h-[80vh] !w-full"
          }`}
        >
          {data.length > 0 && (
            <DataTable
              expandable
              columns={generateColumns(data)}
              data={tableData}
              isExpanded={expanded}
            />
          )}
        </div>
      )}
    </>
  );
};

export default Permissions;