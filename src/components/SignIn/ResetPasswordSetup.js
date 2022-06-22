import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import { Button, Grid, Typography } from "@material-ui/core";

import { UserInputComponent } from "../Global/UserInputComponent";

import { useAccount } from "../../api/account";

const useStyles = makeStyles((theme) => ({
    paper: {
        width: "100%",
        height: '100%',
        padding: "50px",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        color: 'white',
    },
    txt: { textAlign: "center" },
    errorTxt: { textAlign: "center", color: "#ff0000" },
    form: {
        marginTop: '25px',
        height: '80%',
    }
}));

export default function ResetPasswordSetupPage({ setTitle, onSuccess, Api }) {
    useEffect(() => {
        setTitle && setTitle("Reset Password Setup");
    });

    const [errorMsgs, setErrorMsgs] = useState([]);

    const [userName, setUserName] = useState("");

    async function sendResetPasswordEmail() {

        Api.SendResetPasswordEmail(userName).then((res) => {
            if (res instanceof String || typeof res == 'string') {
                
                setErrorMsgs(["Unable to reset password! Try again later!"]);
            }
            else if (res.status == 401) {

                setErrorMsgs(["No user found by given name or email!"]);
            }
            else if (res.data?.result == true) {

                setErrorMsgs(["Email has been send to '" + res.data.email + "'!"]);
            }
            else {

                setErrorMsgs(["Failed to send email! Try again later!"]);
            }
        });
    };

    const classes = useStyles();

    return (
        <div className={classes.paper}>
            <div className={classes.form}>
                <Typography className={classes.txt} variant="h2">
                    Reset Password Setup
                </Typography>

                {
                    errorMsgs.length > 0 ? (
                        <div className={classes.errorTxt}>
                            <ul>
                                {
                                    errorMsgs.map((error, key) =>
                                        (<li>{error}</li>)
                                    )
                                }
                            </ul>
                        </div>
                    ) : <div></div>
                }
                
                <Grid style={{ height: '40%', color: '#22DDFF', marginTop: '25px' }}>
                    <UserInputComponent name="UserName Or Email" onChange={(value) => { setUserName(value); }} style={{ color: '#22DDFF', borderColor: '#22DDFF' }} inputProps={{ style: { backgroundColor: '#444', borderColor: '#22DDFF' } }} />
                </Grid>

                <Grid
                    container
                    direction="row"
                >
                    <Button
                        style={{ color: '#22DDFF', borderColor: '#22DDFF', textTransform: 'none', margin: 'auto' }}
                        variant="outlined"
                        className={classes.txt}
                        onClick={async () => { sendResetPasswordEmail(); }}
                    >
                        Send Email
                    </Button>
                </Grid>

                <Grid
                    container
                    direction="row"
                >
                    <Button to="/signin/login" variant="outlined"
                        style={{ color: '#22DDFF', borderColor: '#22DDFF', textTransform: 'none', margin: 'auto', marginTop: '10px' }}
                        className={classes.txt}
                        component={Link}
                    >
                        Go Back to Login
                    </Button>
                </Grid>
            </div>
        </div>
    );
};