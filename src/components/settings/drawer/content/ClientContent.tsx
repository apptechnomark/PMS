/* eslint-disable react/display-name */
import {
  Button,
  CheckBox,
  MultiSelectChip,
  Select,
  Tel,
  Text,
  Email,
  Toast,
  Textarea,
  Loader,
} from "next-ts-lib";
import React, {
  useImperativeHandle,
  forwardRef,
  useEffect,
  useState,
} from "react";
import axios from "axios";
import ChevronDownIcon from "@/assets/icons/ChevronDownIcon";

export interface ClientContentRef {
  clearAllData: () => void;
}

const ClientContent = forwardRef<
  ClientContentRef,
  {
    tab: string;
    onEdit: boolean;
    onClose: () => void;
    clientData: any;
    onDataFetch: any;
    onOpen: boolean;
  }
>(({ tab, onEdit, onClose, clientData, onOpen, onDataFetch }, ref) => {
  // const [workType, setWorkType] = useState<any>([]);
  const [billingTypeData, setBillingTypeData] = useState([]);
  const [layoutTypeData, setLayoutTypeData] = useState([]);
  const [groupTypeData, setGroupTypeData] = useState([]);
  const [addMoreClicked, setAddMoreClicked] = useState(false);

  const [Id, setId] = useState(0);
  const [accountingId, setAccountingId] = useState(0);
  const [auditId, setAuditId] = useState(0);
  const [clientName, setClientName] = useState("");
  const [clientError, setClientError] = useState(false);
  const [clientNameHasError, setClientNameHasError] = useState(false);
  const [address, setAddress] = useState("");
  const [addressError, setAddressError] = useState(false);
  const [addressHasError, setAddressHasError] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [emailHasError, setEmailHasError] = useState(false);
  const [tel, setTel] = useState("");
  const [telError, settelError] = useState(false);

  const [accounting, setAccounting] = useState(false);
  const [audit, setAudit] = useState(false);
  const [isAccountingOpen, setIsAccountingOpen] = useState(false);
  const [isAuditOpen, setIsAuditOpen] = useState(false);

  // Getting WorkType's Data
  const [workTypeData, setWorkTypeData] = useState<any>([]);
  const [workTypeAccData, setWorkTypeAccData] = useState<any>([]);
  const [workTypeAuditData, setWorkTypeAuditData] = useState<any>([]);

  const [accBillingType, setAccBillingType] = useState(0);
  const [accBillingErr, setAccBillingErr] = useState(false);
  const [accBillingHasErr, setAccBillingHasErr] = useState(false);
  const [accGroup, setAccGroup] = useState([]);
  const [accGroupErr, setAccGroupErr] = useState(false);
  const [accGroupHasErr, setAccGroupHasErr] = useState(false);
  const [accLayout, setAccLayout] = useState(0);
  const [accLayoutErr, setAccLayoutErr] = useState(false);
  const [accLayoutHasErr, setAccLayoutHasErr] = useState(false);
  const [accContHrs, setAccContHrs] = useState<any>(0);
  const [accContHrsErr, setAccContHrsErr] = useState(false);
  const [accContHrsHasErr, setAccContHrsHasErr] = useState(false);
  const [accContHrsErrMsg, setAccContHrsErrMsg] = useState("");
  const [accActualHrs, setAccActHrs] = useState<any>(0);
  const [accActualHrsErr, setAccActHrsErr] = useState(false);
  const [accActualHrsHasErr, setAccActHrsHasErr] = useState(false);
  const [accActualHrsErrMsg, setAccActualHrsErrMsg] = useState("");
  const [accHasError, setAccHasError] = useState(false);

  const [auditBillingType, setAuditBillingType] = useState(0);
  const [auditBillingErr, setAuditBillingErr] = useState(false);
  const [auditBillingHasErr, setAuditBillingHasErr] = useState(false);
  const [auditGroup, setAuditGroup] = useState([]);
  const [auditGroupErr, setAuditGroupErr] = useState(false);
  const [auditGroupHasErr, setAuditGroupHasErr] = useState(false);
  const [auditLayout, setAuditLayout] = useState(0);
  const [auditLayoutErr, setAuditLayoutErr] = useState(false);
  const [auditLayoutHasErr, setAuditLayoutHasErr] = useState(false);
  const [auditContHrs, setAuditContHrs] = useState<any>(0);
  const [auditContHrsErr, setAuditContHrsErr] = useState(false);
  const [auditContHrsHasErr, setAuditContHrsHasErr] = useState(false);
  const [auditContHrsErrMsg, setAuditContHrsErrMsg] = useState("");
  const [auditActualHrs, setAuditActHrs] = useState<any>(0);
  const [auditActualHrsErr, setAuditActHrsErr] = useState(false);
  const [auditActualHrsErrMsg, setAuditActualHrsErrMsg] = useState("");
  const [auditActualHrsHasErr, setAuditActHrsHasErr] = useState(false);
  const [auditHasError, setAuditHasError] = useState(false);

  const [loader, setLoader] = useState(false);

  const toggleAccountingAccordion = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsAccountingOpen((prevIsOpen) => !prevIsOpen);
    setAccounting(e.target.checked);
    // setIsAuditOpen(false);
    // setIsTaxationOpen(false);
  };

  const toggleAuditAccordion = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsAuditOpen((prevIsOpen) => !prevIsOpen);
    setAudit(e.target.checked);
    // setIsAccountingOpen(false);
    // setIsTaxationOpen(false);
  };

  useEffect(() => {
    if (clientData && onEdit) {
      const getClientById = async () => {
        const token = await localStorage.getItem("token");
        const Org_Token = await localStorage.getItem("Org_Token");
        try {
          const response = await axios.post(
            `${process.env.pms_api_url}/client/GetById`,
            {
              clientId: onEdit || 0,
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
              setClientName(response.data.ResponseData.Name);
              setClientNameHasError(true);
              setAddress(response.data.ResponseData.Address);
              setAddressHasError(true);
              setEmail(response.data.ResponseData.Email);
              setEmailHasError(true);
              setTel(response.data.ResponseData.ContactNo);
              setId(response.data.ResponseData.Id);
              setWorkTypeData(response.data.ResponseData.WorkTypes);
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

      getClientById();
    }
    setErrorTrue();
    clearClientData();
  }, [clientData, onEdit, onOpen]);

  const settingWorkTypeData = () => {
    workTypeData.map((i: any) => {
      if (i.WorkTypeId === 1) {
        setAccountingId(i.ClientWorkTypeId);
        setAccounting(true);
        setIsAccountingOpen(true);
        setAccBillingType(i.BillingTypeId);
        setAccGroup(i.GroupIds);
        setAccLayout(i.LayoutId);
        setAccContHrs(i.ContractHrs);
        setAccActHrs(i.InternalHrs);
        setAccContHrsHasErr(true);
        setAccActHrsHasErr(true);
        setAccBillingHasErr(true);
        setAccGroupHasErr(true);
        setAccLayoutHasErr(true);
      }

      if (i.WorkTypeId === 2) {
        setAuditId(i.ClientWorkTypeId);
        setAudit(true);
        setIsAuditOpen(true);
        setAuditBillingType(i.BillingTypeId);
        setAuditGroup(i.GroupIds);
        setAuditLayout(i.LayoutId);
        setAuditContHrs(i.ContractHrs);
        setAuditActHrs(i.InternalHrs);
        setAuditContHrsHasErr(true);
        setAuditActHrsHasErr(true);
        setAuditBillingHasErr(true);
        setAuditGroupHasErr(true);
        setAuditLayoutHasErr(true);
      }
    });
  };

  useEffect(() => {
    workTypeData.length > 0 && settingWorkTypeData();
  }, [workTypeData]);

  const handleAccContHrs = (e: any) => {
    if (e.length <= 5) {
      // setAccContHrsErr(false);
      setAccContHrs(e);
    }
  };

  const handleAccActualHrs = (e: any) => {
    if (e.length <= 5) {
      // setAccActHrsErr(false);
      setAccActHrs(e);
    }
  };

  const handleAuditContHrs = (e: any) => {
    if (e.length <= 5) {
      // setAuditContHrsErr(false);
      setAuditContHrs(e);
    }
  };

  const handleAuditActHrs = (e: any) => {
    if (e.length <= 5) {
      // setAuditActHrsErr(false);
      setAuditActHrs(e);
    }
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    clientName.trim().length <= 0 && setClientError(true);
    address.trim().length <= 0 && setAddressError(true);
    email.trim().length <= 0 && setEmailError(true);

    if (accounting) {
      if (accBillingType <= 0) {
        setAccBillingErr(true);
      }
      if (accGroup.length === 0) {
        setAccGroupErr(true);
      }
      if (accLayout <= 0) {
        setAccLayoutErr(true);
      }

      if (accContHrs < 0) {
        setAccContHrsErr(true);
        setAccContHrsErrMsg("Contracted Hours must be greater than 0.");
      } else if (
        accContHrs === "0" ||
        accContHrs === "00" ||
        accContHrs === "000" ||
        accContHrs === "0000" ||
        accContHrs === "00000" ||
        accContHrs === "-0" ||
        accContHrs === "-00" ||
        accContHrs === "-000" ||
        accContHrs === "-0000" ||
        accContHrs === "-00000" 
      ) {
        setAccContHrsErr(true);
        setAccContHrsErrMsg(`Contracted Hours should not be ${accContHrs}.`);
        return false;
      } else if (
        accContHrs.toString().includes(".") ||
        accContHrs.toString().includes(",")
      ) {
        setAccContHrsErr(true);
        setAccContHrsErrMsg("Contracted Hours must be a valid value.");
        return false;
      }

      if (accActualHrs < 0) {
        setAccActHrsErr(true);
        setAccActualHrsErrMsg("Internal Hours must be greater than 0.");
        return false;
      } else if (Number(accActualHrs) >= Number(accContHrs)) {
        setAccActHrsErr(true);
        setAccActualHrsErrMsg(
          "Internal Hours should be less than or equal to contracted hours."
        );
        return false;
      } else if (
        accActualHrs === "0" ||
        accActualHrs === "00" ||
        accActualHrs === "000" ||
        accActualHrs === "0000" ||
        accActualHrs === "00000"||
        accContHrs === "-0" ||
        accContHrs === "-00" ||
        accContHrs === "-000" ||
        accContHrs === "-0000" ||
        accContHrs === "-00000" 
      ) {
        setAccActHrsErr(true);
        setAccActualHrsErrMsg(`Internal Hours should not be ${accActualHrs}.`);
        return false;
      } else if (
        accActualHrs.toString().includes(".") ||
        accActualHrs.toString().includes(",")
      ) {
        setAccActHrsErr(true);
        setAccActualHrsErrMsg("Internal Hours must be a valid value.");
        return false;
      }
    }

    if (audit) {
      if (auditBillingType <= 0) {
        setAuditBillingErr(true);
      }
      if (auditGroup.length === 0) {
        setAuditGroupErr(true);
      }
      if (auditLayout <= 0) {
        setAuditLayoutErr(true);
      }

      if (auditContHrs < 0) {
        setAuditContHrsErr(true);
        setAuditContHrsErrMsg("Contracted Hours must be greater than 0.");
        return false;
      } else if (
        auditContHrs === "0" ||
        auditContHrs === "00" ||
        auditContHrs === "000" ||
        auditContHrs === "0000" ||
        auditContHrs === "00000" ||
        auditContHrs === "-0" ||
        auditContHrs === "-00" ||
        auditContHrs === "-000" ||
        auditContHrs === "-0000" ||
        auditContHrs === "-00000" 
      ) {
        setAuditContHrsErr(true);
        setAuditContHrsErrMsg(
          `Contracted Hours should not be ${auditContHrs}.`
        );
        return false;
      } else if (
        auditContHrs.toString().includes(".") ||
        auditContHrs.toString().includes(",")
      ) {
        setAuditContHrsErr(true);
        setAuditContHrsErrMsg("Contracted Hours must be a valid value.");
        return false;
      }

      if (auditActualHrs < 0) {
        setAuditActHrsErr(true);
        setAuditActualHrsErrMsg("Internal Hours must be greater than 0.");
        return false;
      } else if (Number(auditActualHrs) > Number(auditContHrs)) {
        setAuditActHrsErr(true);
        setAuditActualHrsErrMsg(
          "Internal Hours should be less than or equal to contracted hours."
        );
        return false;
      } else if (
        auditActualHrs === "0" ||
        auditActualHrs === "00" ||
        auditActualHrs === "000" ||
        auditActualHrs === "0000" ||
        auditActualHrs === "00000" ||
        auditContHrs === "-0" ||
        auditContHrs === "-00" ||
        auditContHrs === "-000" ||
        auditContHrs === "-0000" ||
        auditContHrs === "-00000" 
      ) {
        setAuditActHrsErr(true);
        setAuditActualHrsErrMsg(
          `Internal Hours should not be ${auditActualHrs}.`
        );
        return false;
      } else if (
        auditActualHrs.toString().includes(".") ||
        auditActualHrs.toString().includes(",")
      ) {
        setAuditActHrsErr(true);
        setAuditActualHrsErrMsg("Internal Hours must be a valid value.");
        return false;
      }
    }

    const accHasError =
      accounting &&
      accContHrsHasErr &&
      accActualHrsHasErr &&
      accBillingHasErr &&
      accGroupHasErr &&
      accLayoutHasErr;

    const auditHasError =
      audit &&
      auditActualHrsHasErr &&
      auditContHrsHasErr &&
      auditBillingHasErr &&
      auditGroupHasErr &&
      auditLayoutHasErr;

    if (accounting && accHasError) {
      workTypeAccData.push({
        ClientWorkTypeId: accountingId,
        workTypeId: 1,
        billingTypeId: accBillingType,
        groupIds: accGroup,
        layoutId: accLayout,
        internalHrs: accActualHrs,
        contractHrs: accContHrs,
      });
    }

    if (audit && auditHasError) {
      workTypeAuditData.push({
        ClientWorkTypeId: auditId,
        WorkTypeId: 2,
        BillingTypeId: auditBillingType,
        GroupIds: auditGroup,
        LayoutId: auditLayout,
        InternalHrs: auditActualHrs,
        ContractHrs: auditContHrs,
      });
    }

    if (
      emailHasError &&
      clientNameHasError &&
      addressHasError &&
      (accHasError || auditHasError)
    ) {
      saveClient();
    } else if (
      emailHasError &&
      clientNameHasError &&
      addressHasError &&
      !accounting &&
      !audit
    ) {
      Toast.error("Please Select at least one work type.");
    }
  };

  const setErrorTrue = () => {
    setClientError(true);
    setAddressError(true);
    setEmailError(true);
    settelError(true);
    setAccBillingErr(true);
    setAccGroupErr(true);
    setAccLayoutErr(true);
    setAccContHrsErr(true);
    setAccActHrsErr(true);
    setAccActualHrsErrMsg("");
    setAccContHrsErrMsg("");

    setAuditBillingErr(true);
    setAuditGroupErr(true);
    setAuditLayoutErr(true);
    setAuditContHrsErr(true);
    setAuditActHrsErr(true);
    setAuditActualHrsErrMsg("");
    setAuditContHrsErrMsg("");
  };

  const clearClientData = () => {
    setId(0);
    setClientName("");
    setClientError(false);
    setClientNameHasError(false);
    setAddress("");
    setAddressError(false);
    setAddressHasError(false);
    setEmail("");
    setEmailError(false);
    settelError(false);
    setEmailHasError(false);
    setTel("");

    setAccountingId(0);
    setAccounting(false);
    setIsAccountingOpen(false);
    setAccBillingType(0);
    setAccBillingErr(false);
    setAccBillingHasErr(false);
    setAccGroup([]);
    setAccGroupErr(false);
    setAccGroupHasErr(false);
    setAccLayout(0);
    setAccLayoutErr(false);
    setAccLayoutHasErr(false);
    setAccContHrs(0);
    setAccContHrsErr(false);
    setAccContHrsHasErr(false);
    setAccActHrs(0);
    setAccActHrsErr(false);
    setAccActualHrsErrMsg("");
    setAccContHrsErrMsg("");
    setAccActHrsHasErr(false);

    setAuditId(0);
    setAudit(false);
    setIsAuditOpen(false);
    setAuditBillingType(0);
    setAuditBillingErr(false);
    setAuditBillingHasErr(false);
    setAuditGroup([]);
    setAuditGroupErr(false);
    setAuditGroupHasErr(false);
    setAuditLayout(0);
    setAuditLayoutErr(false);
    setAuditLayoutHasErr(false);
    setAuditContHrs(0);
    setAuditContHrsErr(false);
    setAuditContHrsHasErr(false);
    setAuditActHrs(0);
    setAuditActHrsErr(false);
    setAuditActualHrsErrMsg("");
    setAuditContHrsErrMsg("");
    setAuditActHrsHasErr(false);
  };

  const saveClient = async () => {
    setLoader(true);
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");

    try {
      const response = await axios.post(
        `${process.env.pms_api_url}/client/save`,
        {
          id: Id || 0,
          name: clientName,
          email: email,
          contactNo: tel,
          address: address,
          isActive: true,

          WorkTypes:
            accounting && audit
              ? [
                  accounting && workTypeAccData[workTypeAccData.length - 1],
                  audit && workTypeAuditData[workTypeAuditData.length - 1],
                ]
              : accounting
              ? [workTypeAccData[workTypeAccData.length - 1]]
              : audit && [workTypeAuditData[workTypeAuditData.length - 1]],
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
          Toast.success(
            `Client ${onEdit ? "Updated" : "created"} successfully.`
          );
          setErrorTrue();
          clearClientData();
          onDataFetch();
          setLoader(false);
          {
            !addMoreClicked && onClose();
          }
        } else {
          setLoader(false);
          onClose();
          const data = response.data.Message;
          if (data === null) {
            Toast.error("Please try again later.");
          } else {
            Toast.error(data);
          }
        }
      } else {
        setLoader(false);
        onClose();
        const data = response.data.Message;
        if (data === null) {
          Toast.error("Failed Please try again.");
        } else {
          Toast.error(data);
        }
      }
    } catch (error) {
      setLoader(false);
      console.error(error);
    }
  };

  const clearAllData = async () => {
    await setErrorTrue();
    await clearClientData();
    onClose();
  };

  useImperativeHandle(ref, () => ({
    clearAllData,
  }));

  // Getting WorkTypes
  useEffect(() => {
    if (onOpen) {
      // getWorkTypes();
      getBillingTypes();
      getLayoutTypes();
      getGroupTypes();
    }
  }, [onOpen]);

  // const getWorkTypes = async () => {
  //   const token = await localStorage.getItem("token");
  //   const Org_Token = await localStorage.getItem("Org_Token");
  //   try {
  //     const response = await axios.get(
  //       `${process.env.pms_api_url}/WorkType/GetDropdown`,
  //       {
  //         headers: {
  //           Authorization: `bearer ${token}`,
  //           org_token: `${Org_Token}`,
  //         },
  //       }
  //     );

  //     if (response.status === 200) {
  //       if (response.data.ResponseStatus === "Success") {
  //         setWorkType(response.data.ResponseData);
  //       }
  //     } else {
  //       const data = response.data.Message;
  //       if (data === null) {
  //         Toast.error("Failed Please try again.");
  //       } else {
  //         Toast.error(data);
  //       }
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const getBillingTypes = async () => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.get(
        `${process.env.pms_api_url}/BillingType/GetDropdown`,
        {
          headers: {
            Authorization: `bearer ${token}`,
            org_token: `${Org_Token}`,
          },
        }
      );

      if (response.status === 200) {
        if (response.data.ResponseStatus === "Success") {
          setBillingTypeData(response.data.ResponseData);
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

  const getLayoutTypes = async () => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.get(
        `${process.env.pms_api_url}/Layout/GetDropdown`,
        {
          headers: {
            Authorization: `bearer ${token}`,
            org_token: `${Org_Token}`,
          },
        }
      );

      if (response.status === 200) {
        if (response.data.ResponseStatus === "Success") {
          setLayoutTypeData(response.data.ResponseData);
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

  const getGroupTypes = async () => {
    const token = await localStorage.getItem("token");
    const Org_Token = await localStorage.getItem("Org_Token");
    try {
      const response = await axios.get(
        `${process.env.pms_api_url}/group/getdropdown`,
        {
          headers: {
            Authorization: `bearer ${token}`,
            org_token: `${Org_Token}`,
          },
        }
      );

      if (response.status === 200) {
        if (response.data.ResponseStatus === "Success") {
          setGroupTypeData(response.data.ResponseData);
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

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="flex gap-[20px] flex-col p-[20px] max-h-[78.5vh] overflow-y-auto">
          <Text
            label="Client Name"
            placeholder="Enter Client Name"
            validate
            value={clientName}
            getValue={(e) => setClientName(e)}
            getError={(e) => setClientNameHasError(e)}
            hasError={clientError}
            autoComplete="off"
            minChar={5}
            maxChar={50}
          />
          <Textarea
            label="Address"
            placeholder="Enter Address"
            validate
            value={address}
            getValue={(e) => setAddress(e)}
            getError={(e) => setAddressHasError(e)}
            hasError={addressError}
            autoComplete="off"
            maxChar={300}
            rows={1}
          />
          <Email
            label="Email"
            type="email"
            placeholder="Enter Email ID"
            validate
            value={email}
            getValue={(e) => setEmail(e)}
            getError={(e) => setEmailHasError(e)}
            hasError={emailError}
            autoComplete="off"
            minChar={5}
            maxChar={100}
          />
          <Tel
            value={tel}
            getValue={(e) => {
              setTel(e.slice(4).replace(/\s/g, ""));
            }}
            hasError={telError}
            placeholder="Enter Mobile No."
            label="Mobile Number"
            maxLength={14}
            getError={() => {}}
          />

          {/* Accounting Section */}
          <div>
            <label
              className={`flex items-center justify-between cursor-pointer`}
              htmlFor="Accounting"
            >
              <span className="flex items-center">
                <CheckBox
                  checked={accounting}
                  id="Accounting"
                  label="Accounting"
                  onChange={toggleAccountingAccordion}
                />
              </span>
              {isAccountingOpen ? (
                <span
                  className={`transition-transform duration-300 transform rotate-180`}
                >
                  <ChevronDownIcon />
                </span>
              ) : (
                <span
                  className={`transition-transform duration-300 transform rotate-0`}
                >
                  <ChevronDownIcon />
                </span>
              )}
            </label>
            <div
              className={`${
                isAccountingOpen
                  ? "max-h-[430px] transition-all duration-700 pt-[10px]"
                  : "max-h-0 transition-all duration-700"
              } overflow-hidden`}
            >
              <div className="flex flex-col gap-[17px] pl-[34px]">
                <Select
                  id="billing_type"
                  label="Billing Type"
                  defaultValue={accBillingType}
                  options={billingTypeData}
                  onSelect={() => {}}
                  getValue={(e) => setAccBillingType(e)}
                  getError={(e) => setAccBillingHasErr(e)}
                  hasError={accBillingErr}
                  validate
                  errorClass="!-mt-[15px]"
                  search
                />
                <MultiSelectChip
                  type="checkbox"
                  id="group"
                  label="Group"
                  defaultValue={accGroup}
                  options={groupTypeData}
                  onSelect={() => {}}
                  getValue={(e) => setAccGroup(e)}
                  getError={(e) => setAccGroupHasErr(e)}
                  hasError={accGroupErr}
                  validate
                  errorClass="!-mt-[15px]"
                />
                <Select
                  id="layout"
                  label="Layout"
                  defaultValue={accLayout}
                  options={layoutTypeData}
                  onSelect={() => {}}
                  getValue={(e) => setAccLayout(e)}
                  getError={(e) => setAccLayoutHasErr(e)}
                  hasError={accLayoutErr}
                  validate
                  errorClass="!-mt-[15px]"
                />
                <Text
                  className="[appearance:number] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  type="number"
                  label="Contracted Hours"
                  placeholder="Enter Total Contracted Hours"
                  validate
                  maxLength={5}
                  maxChar={5}
                  value={accContHrs === 0 ? "" : accContHrs}
                  getValue={(e) => handleAccContHrs(e)}
                  getError={(e) => setAccContHrsHasErr(e)}
                  hasError={accContHrsErr}
                  errorMessage={accContHrsErrMsg}
                  noText
                  
                  onWheel={(e) => e.currentTarget.blur()}
                />
                <Text
                  className="[appearance:number] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  type="number"
                  label="Internal Hours"
                  placeholder="Enter Total Internal Hours"
                  validate
                  maxLength={5}
                  value={accActualHrs === 0 ? "" : accActualHrs}
                  getValue={(e) => handleAccActualHrs(e)}
                  getError={(e) => setAccActHrsHasErr(e)}
                  hasError={accActualHrsErr}
                  errorMessage={accActualHrsErrMsg}
                  noText
                  onWheel={(e) => e.currentTarget.blur()}
                />
              </div>
            </div>
          </div>

          {/* Audit Section */}
          <div>
            <label
              className={`flex items-center justify-between cursor-pointer`}
              htmlFor="Audit"
            >
              <span className="flex items-center">
                <CheckBox
                  checked={audit}
                  id="Audit"
                  label="Audit"
                  onChange={toggleAuditAccordion}
                />
              </span>
              {isAuditOpen ? (
                <span
                  className={`transition-transform duration-300 transform rotate-180`}
                >
                  <ChevronDownIcon />
                </span>
              ) : (
                <span
                  className={`transition-transform duration-300 transform rotate-0`}
                >
                  <ChevronDownIcon />
                </span>
              )}
            </label>
            <div
              className={`${
                isAuditOpen
                  ? "max-h-[430px] transition-all duration-700 pt-[10px]"
                  : "max-h-0 transition-all duration-700"
              } overflow-hidden`}
            >
              <div className="flex flex-col gap-[17px] pl-[34px]">
                <Select
                  id="billing_type"
                  label="Billing Type"
                  defaultValue={auditBillingType}
                  options={billingTypeData}
                  onSelect={() => {}}
                  getValue={(e) => setAuditBillingType(e)}
                  getError={(e) => setAuditBillingHasErr(e)}
                  hasError={auditBillingErr}
                  validate
                  errorClass="!-mt-[15px]"
                />
                <MultiSelectChip
                  type="checkbox"
                  id="Group"
                  label="Group"
                  defaultValue={auditGroup}
                  options={groupTypeData}
                  onSelect={() => {}}
                  getValue={(e) => setAuditGroup(e)}
                  getError={(e) => setAuditGroupHasErr(e)}
                  hasError={auditGroupErr}
                  validate
                  errorClass="!-mt-[15px]"
                />
                <Select
                  id="Layout"
                  label="Layout"
                  defaultValue={auditLayout}
                  options={layoutTypeData}
                  onSelect={() => {}}
                  getValue={(e) => setAuditLayout(e)}
                  getError={(e) => setAuditLayoutHasErr(e)}
                  hasError={auditLayoutErr}
                  validate
                  errorClass="!-mt-[15px]"
                />
                <Text
                  className="[appearance:number] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  type="number"
                  label="Contracted Hours"
                  placeholder="Enter Total Contracted Hours"
                  validate
                  maxLength={5}
                  value={auditContHrs === 0 ? "" : auditContHrs}
                  getValue={(e) => handleAuditContHrs(e)}
                  getError={(e) => setAuditContHrsHasErr(e)}
                  hasError={auditContHrsErr}
                  errorMessage={auditContHrsErrMsg}
                  noText
                  onWheel={(e) => e.currentTarget.blur()}
                />
                <Text
                  className="[appearance:number] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  type="number"
                  label="Internal Hours"
                  placeholder="Enter Total Internal Hours"
                  validate
                  maxLength={5}
                  value={auditActualHrs === 0 ? "" : auditActualHrs}
                  getValue={(e) => handleAuditActHrs(e)}
                  getError={(e) => setAuditActHrsHasErr(e)}
                  hasError={auditActualHrsErr}
                  errorMessage={auditActualHrsErrMsg}
                  noText
                  onWheel={(e) => e.currentTarget.blur()}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end fixed w-full bottom-0 gap-[20px] px-[20px] py-[15px] bg-pureWhite border-t border-lightSilver">
          {onEdit ? (
            <Button
              variant="btn-outline-primary"
              className="rounded-[4px] !h-[36px]"
              onClick={() => {
                clearAllData();
              }}
            >
              Cancel
            </Button>
          ) : (
            <Button
              variant="btn-outline-primary"
              className="rounded-[4px] !h-[36px]"
              type="submit"
              onClick={() => setAddMoreClicked(true)}
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
            >
              {onEdit
                ? "Save"
                : `Create ${tab === "Permissions" ? "Role" : tab}`}
            </Button>
          )}
        </div>
      </form>
    </>
  );
});

export default ClientContent;
