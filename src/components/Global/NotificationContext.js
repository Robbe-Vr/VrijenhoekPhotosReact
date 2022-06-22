import React, { useContext } from "react";

import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const NotificationContext = React.createContext({});

export function NotificationProvider({ children }) {
    
    const error = (message, options) => {
        toast.error(message, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            ...options,
        });
    };

    const warning = (message, options) => {
        toast.warning(message, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            ...options,
        });
    };

    const info = (message, options) => {
        toast.info(message, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            ...options,
        });
    };

    const success = (message, options) => {
        

        toast.success(message, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            ...options,
        });
    };

    var contextValue = {
        error: error,
        warning: warning,
        info: info,
        success: success,
    };
    
    return (
        <NotificationContext.Provider value={contextValue}>
            <ToastContainer />
            {children}
        </NotificationContext.Provider>
    );
};

export function useNotifications() {
    return useContext(NotificationContext);
};