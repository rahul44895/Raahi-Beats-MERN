import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const { createContext } = require("react");

const AuthenticationContext = createContext();
export { AuthenticationContext };

const AuthenticationState = (props) => {
  const navigate = useNavigate();
  // const host = process.env.REACT_APP_HOST;
  const host = 'http://localhost:8001/api';

  // SIGNUP
  const signup = async (credentials) => {
    try {
      const formData = new FormData();
      Object.entries(credentials).forEach(([key, value]) => {
        formData.append(key, value);
      });
      const response = await fetch(`${host}/user/signup`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      const data = await response.json();

      if (response.ok) {
        Object.entries(data.user).forEach(([key, value]) => {
          let date = new Date();
          date.setTime(date.getTime() + 1 * 60 * 60 * 1000);
          Cookies.set(key, value, { expires: date });
        });
        alert(data.message + " " + data.user.username);
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
      const response = await fetch(`${host}/user/login`, {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await response.json();
      console.log(data);
      if (response.status === 200) {
        Object.entries(data.user).forEach(([key, value]) => {
          let date = new Date();
          date.setTime(date.getTime() + 1 * 60 * 60 * 1000);
          Cookies.set(key, value, { expires: date });
        });
        alert(data.message + " " + data.user.username);
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
      const response = await fetch(`${host}/user/logout`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await response.json();

      if (response.status === 200) {
        alert(data.message);
        let cookies = Cookies.get();
        console.log(cookies);
        for (const cookie in cookies) {
          Cookies.remove(cookie);
        }
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
