import React from "react";
import { Link } from "react-router-dom";

import { makeStyles } from  "@material-ui/core/styles";
import { Button, Typography } from "@material-ui/core";

const useStyles = makeStyles(() => ({
    form: {
        margin: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        color: 'white',
    },
    txt: { textAlign: "center" },
    continue: {
        marginTop: "20px",
        width: "20%",
        color: '#22DDFF',
        textTransform: 'none',
    },
}));

function WelcomePage() {
    const classes = useStyles();

    return (
        <div className={classes.form}>
            <Typography className={classes.txt} variant="h1">
                Welcome!
            </Typography>
            <Typography className={classes.txt} variant="h6">
                to Vrijenhoek Photos!
            </Typography>
            <Button
                className={classes.continue}
                component={Link}
                style={{  }}
                to={"/signin/register"}
            >
                <Typography className={classes.txt} variant="h6">
                    Register
                </Typography>
            </Button>
            <Typography className={classes.txt}>
                <br />
                Already have an account?
                <br />
                <Button
                    style={{ color: '#22DDFF', textTransform: 'none' }}
                    component={Link}
                    to="/signin/login"
                >
                    Log in here
                </Button>
            </Typography>
        </div>
    );
};

export { WelcomePage }