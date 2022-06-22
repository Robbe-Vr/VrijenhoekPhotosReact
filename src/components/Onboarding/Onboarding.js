import React, { useState, useEffect } from "react";
import { Switch, Route, useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

import Register from "../SignIn/Register";
import LogIn from "../SignIn/LogIn";
import { WelcomePage } from "./WelcomePage";

import { form as formstyles } from "./common-styles";
import ResetPasswordSetupPage from "../SignIn/ResetPasswordSetup";
import ResetPasswordPage from "../SignIn/ResetPassword";

const useStyles = makeStyles(() => ({
    root: {
        height: "80%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
    },
    form: formstyles,
    txt: { textAlign: "center" },
    continue: {
        marginTop: "20px",
        width: "20%",
    },

}));

function Onboarding({ setTitle, Api }) {
    const classes = useStyles();
    const history = useHistory();

    const handleConnectionSuccess = () => {
        history.push("/home");
    };

    return (
        <div className={classes.root}>
            <Switch>
                <Route path="/signin/register">
                    <div className={classes.form}>
                        <Register setTitle={setTitle} onSuccess={handleConnectionSuccess} Api={Api} />
                    </div>
                </Route>
                <Route path="/signin/login">
                    <div className={classes.form}>
                        <LogIn setTitle={setTitle} onSuccess={handleConnectionSuccess} Api={Api} />
                    </div>
                </Route>
                <Route exact path={["/account/resetpasswordsetup"]}>
                    <div className={classes.form}>
                        <ResetPasswordSetupPage
                            Api={Api} setTitle={setTitle}
                        />
                    </div>
                </Route>
                <Route exact path={["/account/resetpassword"]}>
                    <div className={classes.form}>
                        <ResetPasswordPage
                            Api={Api} setTitle={setTitle}
                        />
                    </div>
                </Route>
                
                <Route>
                    <WelcomePage />
                </Route>
            </Switch>
        </div>
    );
};

export { Onboarding };