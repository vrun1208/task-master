import { useDeleteColumnName } from "../useColumnQuery";
import { useEffect } from "react";
import { useBackDropLoaderContext } from "../../context/BackDropLoaderContext";
import { useDispatch } from "react-redux";
import { isBackDropLoaderDisplayed,isBackDropLoaderDisplayedForColumns } from "../../redux/boolean/booleanSlice";

const useDeleteColumn = ({ colId }) => {
  const { mutate: deleteCols, isLoading } = useDeleteColumnName();
  const { setValue } = useBackDropLoaderContext();
  const dispatch = useDispatch();

  /**
   * show back drop loader when column is deleting
   */
  useEffect(() => {
    if (isLoading) {
      setValue("Column deleting");
      dispatch(isBackDropLoaderDisplayed(true));
      dispatch(isBackDropLoaderDisplayedForColumns(true))
    } 
    // else {
    //   setValue("");
    //   dispatch(isBackDropLoaderDisplayed(false));
    //   dispatch(isBackDropLoaderDisplayedForColumns(false))
    // }
  }, [isLoading, setValue, dispatch]);

  const deleteColumn = () => {
    deleteCols({ _id: colId });
  };

  return { deleteColumn };
};

export default useDeleteColumn;
