import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { AlertContext } from "../Alert/AlertState";

const { createContext, useContext } = require("react");

const AuthenticationContext = createContext();
export { AuthenticationContext };

const AuthenticationState = (props) => {
  const { showAlert } = useContext(AlertContext);

  const navigate = useNavigate();
  const host = process.env.REACT_APP_HOST;

  // SIGNUP
  const signup = async (credentials) => {
    try {
      const formData = new FormData();
      Object.entries(credentials).forEach(([key, value]) => {
        formData.append(key, value);
      });
      const response = await fetch(`${host}/users/signup`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        showAlert(data.message);
        window.dispatchEvent(new Event("cookies"));
        navigate("/");
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert("Some error occured while loading the page.");
      console.log(error);
    }
  };

  // LOGIN
  const login = async (credentials) => {
    const { email, password } = credentials;
    try {
      const response = await fetch(`${host}/users/login`, {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await response.json();
      if (data.success) {
        showAlert(data.message);
        window.dispatchEvent(new Event("cookies"));
        navigate("/");
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred");
    }
  };
  // Logout
  const logout = async () => {
    try {
      const response = await fetch(`${host}/users/logout`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await response.json();

      if (response.status === 200) {
        showAlert(data.message);
        window.dispatchEvent(new Event("cookies"));
        navigate("/login");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred");
    }
  };

  return (
    <AuthenticationContext.Provider value={{ signup, login, logout }}>
      {props.children}
    </AuthenticationContext.Provider>
  );
};
export default AuthenticationState;
