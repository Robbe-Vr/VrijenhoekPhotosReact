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

export default function LogInPage({ setTitle, onSuccess, Api }) {
    useEffect(() => {
        setTitle && setTitle("Log In");
    });

    const { logIn } = useAccount();

    const [errorMsgs, setErrorMsgs] = useState([]);

    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");

    async function AttemptLogIn(username, password) {
        const newErrorMsgs = [];

        var result = await logIn(username, password, Api);
        if (result instanceof String || typeof result == 'string') {
            if (result == 'No data recieved.')
                result = 'Servers offline! Please try again later.';

            newErrorMsgs.push(result);
            setErrorMsgs(newErrorMsgs);
        }
        else if (result.status && result.status != 200) {
            error(`Failed to login! ${result.title}`);
            console.log('Failed to login!', result);

            newErrorMsgs.push(result.detail);
            setErrorMsgs(newErrorMsgs);
        }
        else if (result.result == true) {
            onSuccess();
        }
        else {
            newErrorMsgs.push('Failed to login!');
            setErrorMsgs(newErrorMsgs);
        }
    };

    const classes = useStyles();

    return (
        <div className={classes.paper}>
            <div className={classes.form}>
                <Typography className={classes.txt} variant="h2">
                    Log In
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
                
                <Grid style={{ height: '20%', color: '#22DDFF', marginTop: '25px' }}>
                    <UserInputComponent name="UserName" onChange={(value) => { setUserName(value); }} style={{ color: '#22DDFF', borderColor: '#22DDFF' }} />
                </Grid>
                <Grid style={{ height: '20%', color: '#22DDFF' }}>
                    <UserInputComponent name="Password" type="password" onChange={(value) => { setPassword(value); }} style={{ color: '#22DDFF', borderColor: '#22DDFF' }} onEnter={async () => { await AttemptLogIn(userName, password); }} />
                </Grid>

                <Grid
                    container
                    direction="row"
                >
                    <Button
                        style={{ color: '#22DDFF', borderColor: '#22DDFF', textTransform: 'none', margin: 'auto' }}
                        variant="outlined"
                        className={classes.txt}
                        onClick={async () => { await AttemptLogIn(userName, password); }}
                    >
                        Log In
                    </Button>
                </Grid>

                <Typography
                    variant="subtitle2"
                    className={classes.txt}
                >
                    <br />
                    Forgot your password?
                    <br />
                    <Button to="/account/resetpasswordsetup"
                        style={{ color: '#22DDFF', textTransform: 'none', margin: 'auto' }}
                        className={classes.txt}
                        component={Link}
                    >
                        Reset your password here
                    </Button>
                </Typography>

                <Typography
                    variant="subtitle2"
                    className={classes.txt}
                >
                    <br />
                    Don't have an account yet?
                    <br />
                    <Button to="/signin/register"
                        style={{ color: '#22DDFF', textTransform: 'none', margin: 'auto' }}
                        className={classes.txt}
                        component={Link}
                    >
                        Register here
                    </Button>
                </Typography>
            </div>
        </div>
    );
};