import { useMutation } from "@tanstack/react-query";
import { customAxiosRequestForPost } from "src/utils/axiosRequest";
import { useNavigate } from "react-router-dom";
import { setValueToLs } from "src/utils/localstorage";
import {
  KEY_FOR_STORING_TOKEN,
  KEY_FOR_STORING_USER_DETAILS,
} from "src/constant/Misc";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { isBackDropLoaderDisplayed } from "src/redux/boolean/booleanSlice";

const useLoginQuery = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload) => {
      return customAxiosRequestForPost("/login", "post", payload);
    },
    onSuccess: ({ token, user }) => {
      navigate("/");
      setValueToLs(KEY_FOR_STORING_TOKEN, token);
      setValueToLs(KEY_FOR_STORING_USER_DETAILS, user);
    },
    onError: (error) => {
      toast.error(error?.response?.data);
      dispatch(isBackDropLoaderDisplayed(false));
    },
  });
};

export default useLoginQuery;
