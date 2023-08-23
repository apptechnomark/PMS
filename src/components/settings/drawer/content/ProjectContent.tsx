/* eslint-disable react/display-name */
import DeleteModal from "@/components/common/DeleteModal";
import axios from "axios";
import { Button, Loader, Select, Text, Toast } from "next-ts-lib";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";

export interface ProjectContentRef {
  clearAllData: () => void;
}

const ProjectContent = forwardRef<
  ProjectContentRef,
  {
    tab: string;
    onEdit: boolean;
    onClose: () => void;
    projectData: any;
    onDataFetch: any;
    onValuesChange: any;
  }
>(({ tab, onEdit, onClose, projectData, onDataFetch, onValuesChange }, ref) => {
  const [textFieldOpen, setTextFieldOpen] = useState(false);
  const [addMoreClicked, setAddMoreClicked] = useState(false);

  const [client, setClient] = useState(0);
  const [clientError, setClientError] = useState(false);
  const [clientHasError, setClientHasError] = useState(false);
  const [clientDrpdown, setClientDrpdown] = useState([]);
  const [project, setProject] = useState(0);
  const [projectError, setProjectError] = useState(false);
  const [projectHasError, setProjectHasError] = useState(false);
  const [projectDrpdown, setProjectDrpdown] = useState([]);
  const [subProject, setSubProject] = useState("");

  // const [addProjectName, setAddProjectName] = useState("");
  // const [addProjectNameError, setAddProjectNameError] = useState(false);
  // const [addProjectNameHasError, setAddProjectNameHasError] = useState(false);

  const [subProjectId, setSubProjectId] = useState(null);

  const [projectLabel, setProjectLabel] = useState("");
  const [projectValue, setProjectValue] = useState(0);

  const [loader, setLoader] = useState(false);

  useEffect(() => {
    const getData = async () => {
      const token = await localStorage.getItem("token");
      const Org_Token = await localStorage.getItem("Org_Token");
      try {
        let response = await axios.get(
          `${process.env.pms_api_url}/client/getdropdown`,
          {
            headers: {
              Authorization: `bearer ${token}`,
              org_token: `${Org_Token}`,
            },
          }
        );

        if (response.status === 200) {
          if (response.data.ResponseStatus === "Success") {
            setClientDrpdown(response.data.ResponseData);
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

    getData();
  }, []);

  useEffect(() => {
    if (onEdit) {
      const getData = async () => {
        const token = await localStorage.getItem("token");
        const Org_Token = await localStorage.getItem("Org_Token");
        try {
          const response = await axios.post(
            `${process.env.pms_api_url}/project/getbyid`,
            {
              ProjectId: onEdit,
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
              const data = await response.data.ResponseData;
              setClient(data.ClientId);
              setProjectValue(data.ProjectId);
              setSubProject(data.SubProjectName);
              setSubProjectId(data.SubProjectId);
              setClientError(true);
              setProjectError(true);
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

      getData();
    } else {
      setClient(0);
      setClientError(false);
      setClientHasError(false);
      setProjectValue(0);
      setProjectError(false);
      setProjectHasError(false);
      setSubProject("");
      setTextFieldOpen(false);
      // setAddProjectName("");
      // setAddProjectNameError(false);
      // setAddProjectNameHasError(false);
      setSubProjectId(null);
    }
    setDataTrue();
    clearAllFields();
  }, [onEdit, onClose]);

  useEffect(() => {
    const getData = async () => {
      const token = await localStorage.getItem("token");
      const Org_Token = await localStorage.getItem("Org_Token");
      try {
        let response = await axios.post(
          `${process.env.pms_api_url}/project/getdropdown`,
          {
            ClientId: client,
            SelectAll: true,
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
            setProjectDrpdown(response.data.ResponseData.List);
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

    getData();
  }, [client]);

  const setDataTrue = () => {
    setClientHasError(true);
    setProjectHasError(true);
    // setAddProjectNameHasError(true);
  };

  const clearAllFields = () => {
    setClient(0);
    setClientError(false);
    setClientHasError(false);
    setProjectValue(0);
    setProjectError(false);
    setProjectHasError(false);
    setSubProject("");
    setTextFieldOpen(false);
    setProjectLabel("");
    // setAddProjectName("");
    // setAddProjectNameError(false);
    // setAddProjectNameHasError(false);
    // setSelectedRowId(null);
  };

  const clearAllData = async () => {
    onClose();
    await setDataTrue();
    await clearAllFields();
  };

  useImperativeHandle(ref, () => ({
    clearAllData,
  }));

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    client <= 0 && setClientHasError(true);
    project <= 0 && setProjectHasError(true);

    if (clientError && projectError) {
      setLoader(true);
      const token = await localStorage.getItem("token");
      const Org_Token = await localStorage.getItem("Org_Token");
      try {
        let response = await axios.post(
          `${process.env.pms_api_url}/project/savesubproject`,
          {
            SubProjectId: subProjectId,
            SubProjectName: subProject,
            ProjectId: projectValue,
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
              `Project ${onEdit ? "Updated" : "created"} successfully.`
            );
            await setDataTrue();
            await clearAllFields();
            await onDataFetch();
            setLoader(false);
            {
              !addMoreClicked && onClose();
            }
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

  const handleAddProject = async () => {
    client <= 0 && setClientHasError(true);

    if (clientError && projectLabel.length > 0) {
      const token = await localStorage.getItem("token");
      const Org_Token = await localStorage.getItem("Org_Token");
      try {
        let response = await axios.post(
          `${process.env.pms_api_url}/project/saveproject`,
          {
            ClientId: client,
            ProjectId: projectValue !== 0 ? projectValue : null,
            ProjectName: projectLabel,
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
              `Project ${
                projectValue !== 0 ? "Updated" : "created"
              } successfully.`
            );
            onDataFetch();
            clearAllData();
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
    }
  };

  const handleAddNewProject = (editing: boolean) => {
    if (editing) {
      handleAddProject();
    } else {
      handleAddProject();
    }
  };

  const handleValueChange = (isDeleteOpen: any, selectedRowId: boolean) => {
    onValuesChange(isDeleteOpen, selectedRowId);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex gap-[20px] flex-col p-[20px] max-h-[78.5vh]">
        <Select
          label="Client Name"
          id="client_name"
          validate
          errorClass="!-mt-4"
          placeholder="Select Client Name"
          defaultValue={client === 0 ? "" : client}
          onSelect={() => {}}
          options={clientDrpdown}
          hasError={clientHasError}
          getValue={(e) => setClient(e)}
          getError={(e) => setClientError(e)}
        />
        {!onEdit ? (
          <Select
            label="Project Name"
            id="project_name"
            errorClass="!-mt-4"
            placeholder="Select Project Name"
            validate
            defaultValue={projectValue === 0 ? "" : projectValue}
            onSelect={() => {}}
            options={projectDrpdown}
            hasError={projectHasError}
            getValue={(e) => setProjectValue(e)}
            getError={(e) => setProjectError(e)}
            addDynamicForm
            addDynamicForm_Icons_Edit
            addDynamicForm_Icons_Delete
            addDynamicForm_Label="Project Name"
            addDynamicForm_Placeholder="Project Name"
            onChangeText={(value, label) => {
              setProjectValue(value);
              setProjectLabel(label);
            }}
            onClickButton={handleAddNewProject}
            onDeleteButton={(e) => {
              handleValueChange(e, true);
            }}
          />
        ) : (
          <Select
            label="Project Name"
            id="project_name"
            errorClass="!-mt-4"
            validate
            defaultValue={projectValue}
            onSelect={() => {}}
            options={projectDrpdown}
            hasError={projectHasError}
            getValue={(e) => setProject(e)}
            getError={(e) => setProjectError(e)}
          />
        )}
        {!textFieldOpen && (
          <Text
            label="Sub-project Name"
            placeholder="Enter Sub-Project Name"
            value={subProject}
            getValue={(e) => setSubProject(e)}
            getError={(e) => {}}
          />
        )}
      </div>

      <div className="flex justify-end fixed w-full bottom-0 gap-[20px] px-[20px] py-[15px] bg-pureWhite border-t border-lightSilver">
        {onEdit ? (
          <Button
            variant="btn-outline-primary"
            className="rounded-[4px] !h-[36px]"
            onClick={clearAllData}
          >
            Cancel
          </Button>
        ) : (
          <Button
            type="submit"
            variant="btn-outline-primary"
            className="rounded-[4px] !h-[36px]"
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
            {onEdit ? "Save" : `Create ${tab === "Permissions" ? "Role" : tab}`}
          </Button>
        )}
      </div>
    </form>
  );
});

export default ProjectContent;
