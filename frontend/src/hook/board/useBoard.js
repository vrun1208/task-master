import { useGetProjectQuery } from "../../hook/useProjectQuery";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useGetTaskAccordingToStatus } from "../../hook/useTaskQuery";
import { useGetColumnQuery } from "../useColumnQuery";
import { useDispatch, useSelector } from "react-redux";
import { totalStatus } from "../../redux/status/statusSlice";
import { booleanDataInStore, isBackDropLoaderDisplayed, isUpdatingTask } from "../../redux/boolean/booleanSlice";
import { useUpdateTaskQueryWithStatus, useUpdateTaskQuery } from "../../hook/useTaskQuery";
import { useBackDropLoaderContext } from "src/context/BackDropLoaderContext";

const useBoard = () => {
  const { data: columnData, isLoading } = useGetColumnQuery();
  const { data } = useGetTaskAccordingToStatus();
  const { data: projectData } = useGetProjectQuery();
  const { mutate: updateTaskWithStatus } = useUpdateTaskQueryWithStatus();
  const [isAddColBtnClicked, setIsAddColBtnClicked] = useState(false);
  const dispatch = useDispatch();
  const { is_updating_task } = useSelector(booleanDataInStore);
  const [finalTaskUpdate, setFinalTaskUpdate] = useState([]);
  const { mutate: updateTaskWithIndex } = useUpdateTaskQuery();
  const navigate = useNavigate();
  const { setValue } = useBackDropLoaderContext();

  /**
   * navigate the use to /Dashboard when user do not have any project
   */

  useEffect(() => {
    if (projectData?.projects?.length === 0) navigate("/Dashboard");
  }, [projectData]);

  /**
   * return colum data with adding tasks property
   */
  let columnDataWithTaskProperty = useMemo(() => {
    return columnData?.data?.map((item) => ({
      name: item.name,
      _id: item._id,
      tasks: [],
    }));
  }, [columnData]);

  /**
   * dispatch the action to save all the status(columns) in redux
   */
  useEffect(() => {
    const onlyColumns = columnData?.data?.map((item) => item.name);
    if (onlyColumns) {
      dispatch(totalStatus(onlyColumns));
    }
  }, [columnData, dispatch]);

  /**
   * add the task in each columns or status
   */
  let finalState = useMemo(() => {
    if (is_updating_task) {
      return finalTaskUpdate;
    }
    if (!is_updating_task) {
      return columnDataWithTaskProperty?.map((column) => ({
        ...column,
        tasks: data.flat().filter((task) => task?.status === column.name),
      }));
    }
  }, [columnDataWithTaskProperty, data, is_updating_task, finalTaskUpdate]);

  /**
   * handle dispaly column button
   */
  const handleClickOnAddColsBtn = () => {
    setIsAddColBtnClicked(true);
  };

  /**
   * handle drag end
   */
  const handleDragEnd = useCallback(
    (result) => {
      const { source, destination } = result;
      const allTasksWithColumns = finalState;
      let finalStateOfTask = [];
      console.log(destination, "destination", source, "source", Math.random());
      if (!destination) return;
      if (destination.index < 0) {
        destination.index = 0;
      }
      console.log(destination, "destination", source, "source", Math.random());

      /**
       * if task is moved into same column
       */

      if (destination.droppableId === source.droppableId) {
        // find in which row task is drag and dropped
        // Get current state and its setter for the status
        const columnWhereTaskIsDragAndDrop = finalState.filter((item) => item.name === destination.droppableId);

        // find which task is moved
        const movedTask = columnWhereTaskIsDragAndDrop[0]?.tasks[source.index];

        // for update
        const updateTaskForBE = {
          ...movedTask,
          currentIndex: destination.index,
        };

        // for local
        const updateTaskForLocal = {
          ...movedTask,
          index: destination.index,
        };

        console.log(updateTaskForBE, ":::payload", updateTaskForLocal, ":::loal");

        // now update the local state as well

        /**
         * get all the task ( task is moving from top to bottom )
         */

        if (destination.index > source.index) {
          const allTheTaskThatHavelessIndexValueOfDestinationIndex = columnWhereTaskIsDragAndDrop[0]?.tasks
            .filter((item) => item.index <= destination.index && item.index !== source.index)
            .map((item) => ({ ...item, index: item.index - 1 }));

          // other remaining tasks
          const remainingTask = columnWhereTaskIsDragAndDrop[0]?.tasks.filter(
            (item) => item.index > destination.index && item.index !== source.index
          );
          finalStateOfTask = [
            ...allTheTaskThatHavelessIndexValueOfDestinationIndex,
            ...remainingTask,
            updateTaskForLocal,
          ].sort((a, b) => a.index - b.index);

          /**
           * update the task in array as well
           */
          const updatedValues = allTasksWithColumns.map((item) => {
            if (item.name === destination.droppableId) {
              return { ...item, tasks: finalStateOfTask };
            }
            return item; // Return unchanged item for other columns
          });
          setFinalTaskUpdate(updatedValues);
        } else {
          /**
           * if task is moving from bottom to top
           */

          const allTaskToUpdate = columnWhereTaskIsDragAndDrop[0]?.tasks
            .filter((item) => item.index >= destination.index && item.index < source.index)
            .map((item) => ({ ...item, index: item.index + 1 }));

          // step - 2 find all task that have greater then index of destination
          const remaningTaskHavingIndexGreaterThanDestination = columnWhereTaskIsDragAndDrop[0]?.tasks.filter(
            (item) => item.index < destination.index
          );

          // step - 3 find all task that have less then index of source
          const remaningTaskHavingIndexLessThanDestination = columnWhereTaskIsDragAndDrop[0]?.tasks.filter(
            (item) => item.index > source.index
          );

          finalStateOfTask = [
            ...remaningTaskHavingIndexGreaterThanDestination,
            ...remaningTaskHavingIndexLessThanDestination,
            ...allTaskToUpdate,
            updateTaskForLocal,
          ].sort((a, b) => a.index - b.index);

          const updatedValues = allTasksWithColumns.map((item) => {
            if (item.name === destination.droppableId) {
              return { ...item, tasks: finalStateOfTask };
            }
            return item; // Return unchanged item for other columns
          });
          setFinalTaskUpdate(updatedValues);
        }
        dispatch(isUpdatingTask(true));
        updateTaskWithIndex(updateTaskForBE);
        dispatch(isBackDropLoaderDisplayed(true));
        setValue("updating...");
      } else {
        /**
         * Get the state where task is moved
         */
        const columnWhereTaskIsDragAndDrop = finalState?.filter((item) => item.name === destination.droppableId);

        /**
         * source tasks
         */
        const sourceOfTask = finalState.filter((item) => item.name === source.droppableId);

        // find which task is moved
        const movedTask = sourceOfTask[0]?.tasks[source.index];

        console.log(movedTask, "::::moved Task", sourceOfTask);
        // for payload
        const updateTask = {
          ...movedTask,
          status: destination.droppableId,
          currentIndex: destination.index,
          prevStatus: source.droppableId,
          prevIndex: source.index,
        };
        console.log("payload", updateTask);

        // for local
        const updateTaskInDestination = {
          ...movedTask,
          index: destination.index,
          status: destination.droppableId,
        };

        // remove the task from Active state and update the index

        const updatedIndexOfTaskInRangeOfSource = sourceOfTask[0]?.tasks
          ?.map((item) => {
            if (item.index === source.index) {
              // Skip the item with the same index as the source index
              return null; // Or return any unique value that won't be present in the actual data
            } else if (item.index > source.index) {
              return { ...item, index: item.index - 1 };
            } else {
              return item;
            }
          })
          .filter((item) => item !== null) // Filter out the skipped items directly
          .sort((a, b) => a.index - b.index);

        // add the task into destination state and update the index
        const updatedIndexOfTaskInRangeOfDestination = columnWhereTaskIsDragAndDrop[0]?.tasks?.map((item) => {
          if (item.index >= source.index) {
            return { ...item, index: item.index + 1 };
          } else {
            return item;
          }
        });

        const finalArrayWithDroppedTask = [...updatedIndexOfTaskInRangeOfDestination, updateTaskInDestination].sort(
          (a, b) => a.index - b.index
        );

        /**
         * final update
         */

        const updatedValues = allTasksWithColumns.map((item) => {
          if (item.name === destination.droppableId) {
            return { ...item, tasks: finalArrayWithDroppedTask };
          }
          if (item.name === source.droppableId) {
            return { ...item, tasks: updatedIndexOfTaskInRangeOfSource };
          }
          return item; // Return unchanged item for other columns
        });
        setFinalTaskUpdate(updatedValues);
        updateTaskWithStatus(updateTask);
        dispatch(isUpdatingTask(true));
        dispatch(isBackDropLoaderDisplayed(true));
        setValue("updating...");
      }
    },
    [finalState, updateTaskWithIndex, updateTaskWithStatus]
  );

  // console.log(finalState, ":::::::::column Data::::::::::");
  return {
    finalState,
    isAddColBtnClicked,
    handleClickOnAddColsBtn,
    setIsAddColBtnClicked,
    handleDragEnd,
    isLoading,
  };
};

export default useBoard;
