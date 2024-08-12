import React, { createContext } from "react";
import { useState } from "react";
import AlertBox from "./AlertBox";
const AlertContext = createContext();
export { AlertContext };

const AlertState = (props) => {
  const [alert, setAlert] = useState({ message: "", visibile: false });

  const showAlert = (message) => {
    setAlert({ message, visibile: true });
  };

  const hideAlert = () => {
    setAlert({ message: "", visibile: false });
  };
  return (
    <AlertContext.Provider value={{ showAlert }}>
      {props.children}
      {alert.visibile && (
        <AlertBox message={alert.message} onClose={hideAlert} />
      )}
    </AlertContext.Provider>
  );
};

export default AlertState;
