import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  booleanDataInStore,
  isProjectNameModalOpen,
} from "../../redux/boolean/booleanSlice";

import { usePostProjectQuery, useUpdateProjectQuery } from "../useProjectQuery";
import { projectDataInStore } from "../../redux/projects/projectSlice";
import { projectRename } from "../../redux/projects/projectSlice";

const useProject = () => {
  const { is_project_name_modal_open } = useSelector(booleanDataInStore);
  const { project_rename } = useSelector(projectDataInStore);
  const [open, setOpen] = useState(is_project_name_modal_open);
  const [projectName, setProjectName] = useState("");
  const dispatch = useDispatch();
  const { mutate, isLoading } = usePostProjectQuery();
  const { mutate: updateProject } = useUpdateProjectQuery();

  useEffect(() => {
    setOpen(is_project_name_modal_open);
  }, [is_project_name_modal_open]);

  const handleClose = () => {
    dispatch(isProjectNameModalOpen(false));
    setOpen(false);
  };

  useEffect(() => {
    if (isLoading === false) {
      handleClose();
    }
  }, [isLoading]);

  useEffect(() => {
    if (project_rename) {
      setProjectName(project_rename.projectName);
    }
  }, [project_rename]);

  const handleSave = () => {
    if (projectName.trim()) {
      if (project_rename.projectId) {
        updateProject({
          name: projectName.trim(),
          _id: project_rename.projectId,
          previousName: project_rename.projectName,
        });
        setProjectName("");
        dispatch(projectRename({}));
      } else {
        mutate({ name: projectName.trim() });
        setProjectName("");
      }
    }
  };

  const handleChangeInput = (event) => {
    setProjectName(event.target.value);
  };

  return {
    handleChangeInput,
    handleSave,
    handleClose,
    isLoading,
    projectName,
    open,
  };
};

export default useProject;
