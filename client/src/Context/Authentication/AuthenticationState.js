import { useNavigate } from "react-router-dom";
import { AlertContext } from "../Alert/AlertState";

const { createContext, useCallback, useContext, useMemo } = require("react");

const AuthenticationContext = createContext();
export { AuthenticationContext };

const AuthenticationState = (props) => {
  const { showAlert } = useContext(AlertContext);

  const navigate = useNavigate();
  const host = process.env.REACT_APP_HOST;

  // SIGNUP
  const signup = useCallback(async (credentials) => {
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
        const redirectPath = localStorage.getItem("redirectPath") || "/";
        navigate(redirectPath);
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert("Some error occured while loading the page.");
      console.log(error);
    }
  }, [host, showAlert, navigate]);

  // LOGIN
  const login = useCallback(async (credentials) => {
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
        const redirectPath = localStorage.getItem("redirectPath") || "/";
        navigate(redirectPath);
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred");
    }
  }, [host, showAlert, navigate]);
  // Logout
  const logout = useCallback(async () => {
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
  }, [host, showAlert, navigate]);

  const value = useMemo(
    () => ({ signup, login, logout }),
    [signup, login, logout]
  );

  return (
    <AuthenticationContext.Provider value={value}>
      {props.children}
    </AuthenticationContext.Provider>
  );
};
export default AuthenticationState;
