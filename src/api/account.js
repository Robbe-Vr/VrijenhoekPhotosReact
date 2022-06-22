import React, { useState, useEffect, useContext } from "react";
import User from "../models/User";

import Api from "./api";

const R_TOKEN_LS = "vrijenhoekphotos_data1";
const A_TOKEN_LS = "vrijenhoekphotos_data2";
const ACCOUNT_LS = "vrijenhoekphotos_data3";

const AccountContext = React.createContext({});

export function Authenticate({ children }) {

    const API = new Api();

    const [account, setAccount] = useState({});
    const [accessToken, setAccessToken] = useState("");
    const [refreshToken, setRefreshToken] = useState("");
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {

        if (!API)
        {
            console.log("Api undefined!");
            return;
        }

        async function checkLogin() {

            var localAccStr = localStorage.getItem(ACCOUNT_LS);
            var localAccessToken = localStorage.getItem(A_TOKEN_LS);
            var localRefreshToken = localStorage.getItem(R_TOKEN_LS);
            var localAcc = {};

            try
            {
                localAcc = JSON.parse(localAccStr);
            }
            catch (e)
            {
                console.log(e);
            }

            if (!account?.Id && localAcc) {
                setAccount(localAcc);
                setLoaded(true);
                return;
            }

            if (!localAcc) {
                console.log("No local account found.");

                setLoaded(true);
                return;

            } else if (!accessToken || accessToken.length !== 45 || !refreshToken || refreshToken.length !== 58) {
                if (localAccessToken && localAccessToken.length === 45) {
                    setAccessToken(localAccessToken);
                }
                else
                {
                    console.log('User not authenticated.');
                }

                if (localRefreshToken && localRefreshToken.length === 58) {
                    setRefreshToken(localRefreshToken);
                }
                else
                {
                    console.log('User not authenticated.');
                }

                setLoaded(true);
                return;

            } else {
                const tokenValidation = await API.ValidateAccessToken({ [API.AccessTokenHeaderName]: accessToken });

                if (tokenValidation.result === "Success.") {
                    console.log("Token validated.");
                    setLoaded(true);
                    return;

                } else {
                    console.log("Token invalid. Refreshing...");

                    const newAuthInfo = await API.RefreshAccessToken({ [API.RefreshTokenName]: refreshToken });

                    if (newAuthInfo !== "Error" && newAuthInfo.success === true) {
                        console.log("New token received.");

                        setAccessToken(newAuthInfo.accessToken);
                        localStorage.setItem(A_TOKEN_LS, newAuthInfo.accessToken);

                        var refreshedAcc = {
                            ...account,
                            Id: newAuthInfo.id,
                            UserName: newAuthInfo.userName,
                            Rights: newAuthInfo.rights,
                        };

                        localStorage.setItem(ACCOUNT_LS, JSON.stringify(refreshedAcc));
                        setAccount(refreshedAcc);

                        setLoaded(true);
                        return;
                    }
                    else {
                        localStorage.removeItem(A_TOKEN_LS);
                        localStorage.removeItem(ACCOUNT_LS);
                        setAccount({});

                        setLoaded(true);
                        return;
                    }
                }
            };
        };

        checkLogin();
    }, [account, accessToken, API, loaded]);

    const setData = (authInfo) => {
        setRefreshToken(authInfo.refreshToken);
        localStorage.setItem(R_TOKEN_LS, authInfo.refreshToken);

        setAccessToken(authInfo.accessToken);
        localStorage.setItem(A_TOKEN_LS, authInfo.accessToken);

        var acc = {
            Id: authInfo.id,
            UserName: authInfo.userName,
            Rights: authInfo.rights,
        };

        setAccount(acc);
        localStorage.setItem(ACCOUNT_LS, JSON.stringify(acc));

        return { result: true };
    };
    	
    const logIn = async (name, password, Api) => {
        var response = await Api.Login({ UserName: name, Password: password });

        if (response.data?.success)
        {
            return setData(response.data);
        }
        else return response.data?.error ?? "No data recieved.";
    };

    const register = async (email, name, password, Api) => {
        var response = await Api.Register({ Email: email, UserName: name, Password: password, ConfirmPassword: password, CreationDate: new Date() });

        if (response.data?.success)
        {
            return setData(response.data);
        }
        else return response.data?.error ?? "No data recieved.";
    };

    const logOut = () => {
        API.Logout();

        localStorage.removeItem(ACCOUNT_LS);
        localStorage.removeItem(A_TOKEN_LS);
        setAccount({});
    };

    var contextValue = {
        loaded: loaded,
        registered: account?.Id && accessToken ? true : false,
        id: account?.Id,
        name: account?.UserName,
        rights: account?.Rights,
        logIn,
        register,
        logOut,
    };

    return (
        <AccountContext.Provider value={contextValue}>
            {children}
        </AccountContext.Provider>
    );
};

export function useAccount() {
    return useContext(AccountContext);
};

/*************************/
/* Local Login Functions */
/*************************/
export async function CreateAccount(username, password, updateByLogIn, api) {

    const newUser = await createUserObject(api.Custom, username, password);

    var res = await api.Register(newUser);

    if (res === 'Error') { return false; }

    updateByLogIn(newUser);

    return true;
};

async function createUserObject(username = '', password) {
    return new User(
        '',
        username,
        password,
        false,
        null,
        null,
        null,
        new Date(),
    );
};