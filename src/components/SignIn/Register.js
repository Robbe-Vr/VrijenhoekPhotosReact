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

export default function RegisterPage({ setTitle, onSuccess, Api }) {
    useEffect(() => {
        setTitle && setTitle("Register");
    });

    const { register} = useAccount();

    const [errorMsgs, setErrorMsgs] = useState([]);

    const [email, setEmail] = useState("");
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const validateEmail = (email) => {
        return email.length > 0 &&
            String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    const validateUserName = (userName) => {
        return userName.length > 1 &&
            String(userName).match(/[a-zA-Z0-9.,_+-=]{2,64}/g)?.length == 1;
    };

    async function Register(email, username, password, confirmpassword) {
        const newErrorMsgs = [];

        if (password !== confirmpassword) {
            newErrorMsgs.push('Passwords are not equal!');
        }
        if (!validateEmail(email)) {
            newErrorMsgs.push('Invalid email address!');
        }
        if (!validateUserName(userName)) {
            newErrorMsgs.push('Invalid username! usernames must be between 2 and 64 characters long and cannot contain any symbols besides the following: \'.,_-+=\'.');
        }

        if (newErrorMsgs.length > 0) {
            setErrorMsgs(newErrorMsgs);
        }
        else {
            var result = register(email, username, password, Api);
            
            if (result instanceof String || typeof result == 'string') {
                if (result == 'No data recieved.')
                    result = 'Servers offline. Please try again later.';

                newErrorMsgs.push(result);
                setErrorMsgs(newErrorMsgs);
            }
            else if (result.status && result.status != 200) {
                error(`Failed to register! ${result.title}`);
                console.log('Failed to register!', result);
    
                newErrorMsgs.push(result.detail);
                setErrorMsgs(newErrorMsgs);
            }
            else if (result.result == true) {
                onSuccess();
            }
            else {
                newErrorMsgs.push('Failed to register!');
                setErrorMsgs(newErrorMsgs);
            }
        }
    };

    useEffect(() => {
        setErrorMsgs([]);
    }, [email, userName, password, confirmPassword]);

    const classes = useStyles();

    return (
        <div className={classes.paper}>
            <div className={classes.form}>
                <Typography className={classes.txt} variant="h2">
                    Register
                </Typography>

                {
                    errorMsgs.length > 0 ? (
                        <div className={classes.errorTxt}>
                            <ul>
                                {
                                    errorMsgs.map((error, key) =>
                                        (<li key={key}>{error}</li>)
                                    )
                                }
                            </ul>
                        </div>
                    ) : <div></div>
                }
                
                <Grid style={{ height: '20%', color: '#22DDFF', marginTop: '25px'  }}>
                    <UserInputComponent name="Email" onChange={(value) => { setEmail(value); }} style={{ borderColor: 'white', color: 'white' }} />
                </Grid>
                <Grid style={{ height: '20%', color: '#22DDFF' }}>
                    <UserInputComponent name="UserName" onChange={(value) => { setUserName(value); }} />
                </Grid>
                <Grid style={{ height: '20%', color: '#22DDFF' }}>
                    <UserInputComponent name="Password" type="password" onChange={(value) => { setPassword(value); }} onEnter={async () => { await Register(userName, password, confirmPassword); }} />
                </Grid>
                <Grid style={{ height: '20%', color: '#22DDFF' }}>
                    <UserInputComponent name="ConfirmPassword" type="password" onChange={(value) => { setConfirmPassword(value); }} onEnter={async () => { await Register(userName, password, confirmPassword); }} />
                </Grid>

                <Grid
                    container
                    direction="row"
                >
                    <Button
                        style={{ color: '#22DDFF', textTransform: 'none', margin: 'auto', borderColor: '#22DDFF' }}
                        variant="outlined"
                        className={classes.txt}
                        onClick={async () => { await Register(email, userName, password, confirmPassword); }}
                    >
                        Register
                    </Button>
                </Grid>
                
                <Typography
                    variant="subtitle2"
                    className={classes.txt}
                >
                    <br />
                    Already have an account?
                    <br />
                    <Button to="/signin/login"
                        style={{ color: '#22DDFF', textTransform: 'none', margin: 'auto' }}
                        className={classes.txt}
                        component={Link}
                    >
                        Login here
                    </Button>
                </Typography>
            </div>
        </div>
    );
};