import React, { createContext, useCallback, useMemo } from "react";
import { useState } from "react";
import AlertBox from "./AlertBox";
const AlertContext = createContext();
export { AlertContext };

const AlertState = (props) => {
  const [alert, setAlert] = useState({ message: "", visibile: false });

  const showAlert = useCallback((message) => {
    setAlert({ message, visibile: true });
  }, []);

  const hideAlert = useCallback(() => {
    setAlert({ message: "", visibile: false });
  }, []);

  const value = useMemo(() => ({ showAlert }), [showAlert]);

  return (
    <AlertContext.Provider value={value}>
      {props.children}
      {alert.visibile && (
        <AlertBox message={alert.message} onClose={hideAlert} />
      )}
    </AlertContext.Provider>
  );
};

export default AlertState;
