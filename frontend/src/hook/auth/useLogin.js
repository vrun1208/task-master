import { useNavigate } from "react-router-dom";
import { getValueFromLS } from "src/utils/localstorage";
import useLoginQuery from "src/hook/useLoginQuery";
import { KEY_FOR_STORING_TOKEN } from "src/constant/Misc";
import { useState, useEffect } from "react";
import { loginSchema } from "src/constant/validation";

const useLogin = () => {
  const navigate = useNavigate();
  const token = getValueFromLS(KEY_FOR_STORING_TOKEN);
  const { mutate, isLoading } = useLoginQuery();
  const [formValues, setFormValues] = useState({});
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  useEffect(() => {
    // because we are
    if (token) {
      navigate("/");
    }
  }, [token]);

  const initialValues = {
    email: "",
    password: "",
    timeZone,
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (!formValues) return;
      if (event.key === "Enter") {
        event.preventDefault(); // Prevent form default submission behavior

        // Validate the values using the schema
        try {
          loginSchema.validateSync(formValues);
          mutate(formValues);
        } catch (error) {
          console.log(error);
        }
      }
    };

    // Attach the event listener
    window.addEventListener("keydown", handleKeyPress);

    // Detach the event listener when the component unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [formValues]);

  const handleSubmit = (values) => {
    mutate(values);
  };

  return {
    handleSubmit,
    setFormValues,
    initialValues,
    isLoading,
  };
};

export default useLogin;
