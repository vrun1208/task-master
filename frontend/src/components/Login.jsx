import { useState } from "react";
import axiosRequest from "../utils/axiosRequest";

const Login = () => {
  const [userValue, setUserValue] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (event) => {
    console.log(event.target.name, event.target.value);
    setUserValue({
      ...userValue,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (userValue.password !== userValue.confirmPassword) {
      window.alert("password should be matched with confrim password");
      return;
    }
    console.log(userValue);
    axiosRequest({ method: "post", url: "/register", data: userValue });
  };

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <input
          name="email"
          type="email"
          value={userValue.email}
          onChange={handleChange}
          required={true}
        />
        <input
          name="password"
          type="password"
          value={userValue.password}
          onChange={handleChange}
          required={true}
        />
        <input
          name="confirmPassword"
          type="password"
          value={userValue.confirmPassword}
          onChange={handleChange}
          required={true}
        />
        <button type="submit"> submit </button>
      </form>
    </div>
  );
};

export default Login;
