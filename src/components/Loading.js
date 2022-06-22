import React, { Fragment } from "react";
import { useAccount } from "../API/index";

import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles((theme) => ({
    container: {
        display: "flex",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
    },
}));

export const Loading = ({ children }) => {
    const classes = useStyles();
    
    const { loaded: accountLoaded } = useAccount();

    let loaded = accountLoaded;

    if (!loaded) {
        return (
            <div className={classes.container}>
                <CircularProgress />
            </div>
        );
    }

    return <Fragment>{children}</Fragment>;
}