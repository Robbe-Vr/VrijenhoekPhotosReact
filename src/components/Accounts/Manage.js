import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Button, Divider, Grid, Typography } from "@material-ui/core";
import { UserInputComponent } from "../Global/UserInputComponent";

import { faArrowAltCircleLeft, faArrowAltCircleRight, faImages } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SelfLoadingThumbnail } from "../Global/SelfLoadingThumbnail";
import { useNotifications } from "../Global/NotificationContext";

const useStyles = makeStyles((theme) => ({
    
}));

export default function ManagePage({ Api, setTitle, renderMobile, userName, rights }) {
    const classes = useStyles();

    useEffect(() => {
        setTitle && setTitle('Manage Account');
    });

    const { warning } = useNotifications();

    const [changeUserName, setChangeUserName] = useState(false);
    const [newUserName, setNewUserName] = useState(userName);

    const updateUserName = () => {
        Api.UpdateUserName(newUserName).then((res) => {

        });
    };

    const toggleChangeUserName = () => {
        if (!changeUserName) {
            setChangeUserName(true);
        } else {
            setNewUserName(userName);
            setChangeUserName(false);
        }
    };
    
    return (
        <div className={classes.form} style={{ height: window.innerHeight * 0.8 }}>
            <Grid style={{ width: '100%', minHeight: '50%', padding: '20px', color: 'white' }}>
                {rights == 100 ? 
                    <Grid style={{ width: '100%', color: '#2DF', margin: "auto", marginTop: '10px', marginBottom: '20px', padding: '10px', border: 'solid 1px #2DF', borderRadius: '1rem' }}>
                        <i>admin</i><br />
                        <Button variant="outlined"
                            component={Link} to="/acccount/index"
                            style={{ textTransform: 'none', backgroundColor: changeUserName ? 'darkorange' : 'darkorange', margin: '10px' }}
                        >
                            Manage Accounts
                        </Button>
                    </Grid>
                : <></>}
                <Grid style={{ width: '100%', color: '#2DF', margin: "auto", marginTop: '10px', marginBottom: '0px' }}>
                    <Button variant="outlined"
                        style={{ textTransform: 'none', backgroundColor: changeUserName ? 'darkorange' : 'darkorange' }}
                        onClick={() => toggleChangeUserName()}
                    >
                        {changeUserName ? 'Cancel Updating' : 'Update' } UserName
                    </Button>
                </Grid>
                <Grid style={{ width: renderMobile ? '100%' : '60%', height: '20%', display: 'block', padding: '10px' }}>
                    {changeUserName ? 'Change ' : ''}Username
                    <UserInputComponent
                        disabled={!changeUserName}
                        style={{ color: 'white', borderColor: 'white' }}
                        defaultValue={userName}
                        value={newUserName}
                        inputProps={{
                            style: {
                                color: 'white', backgroundColor: '#555555', borderColor: '#2DF'
                            }
                        }}
                        name="name"
                        onChange={(value) => { setNewUserName(value); }}
                    />
                </Grid>
                {changeUserName ?
                    <Grid style={{ width: '100%', color: '#2DF', margin: "auto", marginTop: '10px', marginBottom: '0px' }}>
                        <Button variant="outlined"
                            style={{ textTransform: 'none', backgroundColor: 'darkorange' }}
                            onClick={() => updateUserName()}
                        >
                            Update UserName
                        </Button>
                    </Grid>
                    : <></>
                }
                <Grid style={{ width: '100%', color: '#2DF', margin: "auto", marginTop: '10px', marginBottom: '0px' }}>
                    <Button variant="outlined" component={Link} to="/account/manage/join-requests"
                        style={{ textTransform: 'none', borderColor: '#2DF', backgroundColor: '#444', color: '#2DF' }}
                    >
                        Manage Groups
                    </Button>
                </Grid>
                <Grid style={{ width: '100%', color: '#2DF', margin: "auto", marginTop: '10px', marginBottom: '0px' }}>
                    <Button variant="outlined" component={Link} to="/account/join-group"
                        style={{ textTransform: 'none', borderColor: '#2DF', backgroundColor: '#444', color: '#2DF' }}
                    >
                        Join Group
                    </Button>
                </Grid>
            </Grid>
        </div>
    );
}