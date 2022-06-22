import React, { useEffect, useState } from "react";

import CircularProgress from "@material-ui/core/CircularProgress";
import { Button, Dialog, DialogContent, Divider, Grid, Typography } from "@material-ui/core";
import { UserInputComponent } from "../Global/UserInputComponent";
import { useNotifications } from "../Global/NotificationContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowAltCircleLeft, faCheckCircle, faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useAccount } from "../../api/account";

export default function AddUserMenu({ Api, open, groupId, onClose }) {
    const { warning, success, info } = useNotifications();

    const { id } = useAccount();

    const [checkData, setCheckData] = useState({ validUserFound: false, validUserId: 0 });

    const [enteredUserName, setEnteredUserName] = useState("");

    useEffect(() => {
        if (enteredUserName.length <= 2) return;

        setLoading(true);
        Api.FindUser(enteredUserName).then((res) => {
            if (res instanceof String || typeof res == 'string') {
                setCheckData({ validUserFound: false, validUserId: 0 });
            }
            else if (res.status && res.status != 200) {
                setCheckData({ validUserFound: false, validUserId: 0 });
            }
            else {
                setCheckData({ validUserFound: res.data.result, validUserId: res.data.id });
            }

            setLoading(false);
        });
    }, [Api, enteredUserName]);

    const addUserToGroup = () => {
        Api.InviteToJoinGroup(groupId, checkData.validUserId).then((res) => {
            if (res instanceof String || typeof res == 'string') {
                warning('Failed to send group invite!');
            }
            else if (res.status && res.status != 200) {
                if (res.detail) {
                    warning(`Sorry! ${res.detail}`);
                }
                else warning(`Failed to send group invite!`);
                console.log('Failed to send group invite!', res);
            }
            else {
                success("Group invite has been send to " + enteredUserName);
            }
        });
    };

    const [loading, setLoading] = useState(false);

    return (
        <>
            <Dialog open={open} style={{ margin: 'auto' }} onClose={(e, reason) => { onClose(e, reason); }}>
                <DialogContent style={{ backgroundColor: '#333', margin: 'auto', color: 'white', padding: '15px' }}>
                    Find a user by typing in their username or email address and check whether this user exists.<br />
                    <br />
                    Lookup a user by their username or email address:
                    <UserInputComponent
                        defaultValue={enteredUserName}
                        value={enteredUserName}
                        onChange={(value) => setEnteredUserName(value)}
                        name="Username or email"
                    />
                    <br />
                    {loading ?
                        <CircularProgress />
                        :
                        <>{checkData.validUserFound ?
                            <Grid style={{ color: 'forestgreen' }}><FontAwesomeIcon icon={faCheckCircle} style={{ marginRight: '10px' }} /> User found!</Grid>
                            :
                            <Grid style={{ color: 'red' }}><FontAwesomeIcon icon={faTimes} style={{ marginRight: '10px' }} /> No user found!</Grid>}
                        </>}
                    <br />
                    <br />
                    <Button variant="outlined"
                        style={{ backgroundColor: '#22DDFF', textTransform: 'none', marginRight: '10px' }}
                        onClick={() => {
                            onClose();
                        }}
                    >
                        Cancel <FontAwesomeIcon icon={faArrowAltCircleLeft} style={{ marginLeft: '5px' }} />
                    </Button>
                    <Button variant="outlined"
                        style={{ backgroundColor: '#22FF44', textTransform: 'none' }}
                        onClick={() => {
                            if (checkData.validUserFound) {
                                if (checkData.validUserId == id) {
                                    info("Trying to add yourself to your own group?");
                                }
                                else {
                                    addUserToGroup();
                                }
                            }
                            else {
                                warning("Cannot add a non-existent user!");
                            }
                        }}
                    >
                        Add <FontAwesomeIcon icon={faPlus} style={{ marginLeft: '5px' }} />
                    </Button>
                </DialogContent>
            </Dialog>
        </>
    );
}