import customAxiosRequest from "src/utils/axiosRequest";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { setValueToLs } from "src/utils/localstorage";
import {
  KEY_FOR_STORING_TOKEN,
  KEY_FOR_STORING_USER_DETAILS,
} from "src/constant/Misc";
import { useDispatch } from "react-redux";
import { userEmail } from "src/redux/auth/userSlice";

const useRegisterQuery = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (payload) => {
      return customAxiosRequest("/register", "post", payload);
    },
    onSuccess: ({ token, user }) => {
      navigate("/"); // Navigate to the home page
      setValueToLs(KEY_FOR_STORING_TOKEN, token);
      setValueToLs(KEY_FOR_STORING_USER_DETAILS, user);
      dispatch(userEmail(user.email));
    },
    onError: (error) => {
      console.log("error block", error);
      toast.error("error");
    },
  });
};

export default useRegisterQuery;
