import React, { useContext } from "react";
import Api from "./api";

const ApiContext = React.createContext({});

export function ApiProvider({ children }) {
    
    const API = new Api();

    var contextValue = {
        Api: API,
    };

    console.log("Loading API...");

    return (
        <ApiContext.Provider value={contextValue}>
            {children}
        </ApiContext.Provider>
    );
};

export function useAPI() {
    return useContext(ApiContext);
};