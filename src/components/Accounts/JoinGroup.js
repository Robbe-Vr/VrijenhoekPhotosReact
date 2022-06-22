import React, { useEffect, useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Button, Divider, Grid, Typography } from "@material-ui/core";
import { UserInputComponent } from "../Global/UserInputComponent";

import { faArrowAltCircleLeft, faArrowAltCircleRight, faBan, faCheck, faImages } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SelfLoadingThumbnail } from "../Global/SelfLoadingThumbnail";
import { useNotifications } from "../Global/NotificationContext";

const useStyles = makeStyles((theme) => ({
    
}));

export default function JoinGroupPage({ Api, setTitle, renderMobile }) {
    const classes = useStyles();

    useEffect(() => {
        setTitle && setTitle('Manage Account');
    });

    const { error, warning, success } = useNotifications();
    
    const [loaded, setLoaded] = useState(false);

    const [pendingInvites, setPendingInvites] = useState([]);

    useEffect(() => {
        Api.GetGroupInvites().then((res) => {
            if (res instanceof String || typeof res == 'string') {
                warning('Failed to get group invites!');
            }
            else if (res.status && res.status != 200) {
                if (res.detail) {
                    warning(`Sorry! ${res.detail}`);
                }
                else warning(`Failed to get group invites!`);
                console.log('Failed to get group invites!', res);
            }
            else {
                setPendingInvites(res);
            }
        });
    }, [Api]);

    const [filterName, setFilterName] = useState('');

    const [seekedGroupsPage, setSeekedGroupsPage] = useState(1);
    const [seekedGroupsMaxPages, setSeekedGroupsMaxPages] = useState(1);
    const [seekedGroupsCount, setSeekedGroupsCount] = useState(0);

    useEffect(() => {
        Api.GetSeekGroupsCount(filterName).then((res) => {
            if (res instanceof String || typeof res == 'string') {
                warning('Failed to get count of seeked groups!');
            }
            else if (res.status && res.status != 200) {
                if (res.detail) {
                    warning(`Sorry! ${res.detail}`);
                }
                else warning(`Failed to get count of seeked groups!`);
                console.log('Failed to get count of seeked groups!', res);
            }
            else {
                let pages = parseInt(res / 10);
                if (res % 10 > 0) pages++;

                setSeekedGroupsMaxPages(pages);
                setSeekedGroupsCount(res);
            }
        });
    }, [Api, filterName]);

    const nextSeekedGroupsPage = () => {
        let next = seekedGroupsPage + 1;
        if (next > seekedGroupsMaxPages) {
            next = 1;
        }
        setSeekedGroupsPage(next);
    };
    const previousSeekedGroupsPage = () => {
        let prev = seekedGroupsPage - 1;
        if (prev <= 0) {
            prev = seekedGroupsMaxPages;
        }
        setSeekedGroupsPage(prev);
    };

    const [groups, setGroups] = useState([]);

    useEffect(() => {
        Api.SeekGroups(filterName, seekedGroupsPage).then((res) => {
            if (res instanceof String || typeof res == 'string') {
                error('Failed to load seeked groups!')
            }
            else if (res.status && res.status != 200) {
                if (res.detail) {
                    error(`Sorry! ${res.detail}`);
                }
                else error('Failed to load seeked groups!')
                console.log(`Failed to load seeked groups!`, res);
            }
            else {
                setGroups(res);
            }

            setLoaded(true);
        });
    }, [Api, seekedGroupsPage, filterName]);

    const requestToJoinGroup = (groupId) => {
        Api.RequestToJoinGroup(groupId).then((res) => {
            if (res instanceof String || typeof res == 'string') {
                warning('Could not send request to join group!')
            }
            else if (res.status && res.status != 200) {
                if (res.detail) {
                    warning(`Sorry! ${res.detail}`);
                }
                else warning(`Could not send request to join group!`);
                console.log(`Could not send request to join group!`, res);
            }
            else if (res.data.message instanceof String || typeof res.data.message == 'string')
            {
                warning(res.data.message);
            }
            else {
                success('Request to join group sent!');
            }
        });
    };

    const acceptInvite = (groupId) => {
        Api.AcceptInvite(groupId).then((res) => {
            if (res instanceof String || typeof res == 'string') {
                error('Failed to accept invite!')
            }
            else if (res.status && res.status != 200) {
                if (res.detail) {
                    error(`Sorry! ${res.detail}`);
                }
                else error(`Failed to accept invite!`);
                console.log(`Failed to accept invite!`, res);
            }
            else {
                if (res.data.result) {
                    success(res.data.special || "Invite has been accepted!");
                }
                else {
                    warning('Sorry! ' + res.data.message);
                }
            }
        });
    };

    const declineInvite = (groupId) => {
        Api.DeclineInvite(groupId).then((res) => {
            if (res instanceof String || typeof res == 'string') {
                error('Failed to decline invite!')
            }
            else if (res.status && res.status != 200) {
                if (res.detail) {
                    error(`Sorry! ${res.detail}`);
                }
                else error(`Failed to decline invite!`);
                console.log(`Failed to decline invite!`, res);
            }
            else {
                if (res.data.result) {
                    success(res.data.special || "Invite has been declined!");
                }
                else {
                    warning('Sorry! ' + res.data.message);
                }
            }
        });
    };

    if (!loaded) {
        return (
            <div className={classes.container}>
                <CircularProgress />
            </div>
        );
    }

    return (
        <div className={classes.form} style={{ height: window.innerHeight * 0.8 }}>
            <Grid style={{ width: '100%', color: '#2DF', margin: "auto", marginTop: '10px', marginBottom: '0px' }}>
                Pending Group Invites
                <Divider style={{ width: '100%', backgroundColor: '#2DF' }}></Divider>
            </Grid>
            <Grid style={{ width: '100%', minHeight: '10%', maxHeight: '60%', padding: '20px', color: 'white' }}>
                <Grid style={{ width: '100%', border: 'solid 1px #2DF', borderRadius: '0.5rem', overflowY: 'auto' }}>
                    {Array.isArray(pendingInvites) && pendingInvites.length > 0 ?
                        pendingInvites.map((group) => {
                            return (
                                <Grid style={{ borderBottom: 'solid 1px #2DF', borderRadius: '0.5rem', margin: '5px', padding: '5px' }}>
                                    <Grid key={group.Id} style={{ width: renderMobile ? '100%' : '60%', marginBottom: '10px', display: 'block', padding: '10px', border: 'solid 1px #2DF', borderRadius: '1rem' }}>
                                        <Grid style={{ display: 'inline-block', width: '15%' }}>
                                            {group.IconPhoto && group.IconPhoto.Id > 0 ?
                                                <SelfLoadingThumbnail source={group.IconPhoto.Id} size={150} />
                                                :
                                                <FontAwesomeIcon icon={faImages} size="3x" />
                                            }
                                        </Grid>
                                        <Grid style={{ display: 'inline-block', width: '15%' }}>
                                            {group.Name}
                                        </Grid>
                                        <Grid style={{ display: 'inline-block', width: '30%' }}>
                                            <i>Owned by:</i><br />
                                            {group.Creator.Name}
                                        </Grid>
                                        <Grid style={{ display: 'inline-block', minWidth: '20%' }}>
                                            <Button style={{ color: '#2F4', textTransform: 'none' }} title="expand"
                                                onClick={() => { acceptInvite(group.Id); }}
                                            >
                                                Accept <FontAwesomeIcon icon={faCheck} style={{ marginLeft: '5px' }} />
                                            </Button>
                                        </Grid>
                                        <Grid style={{ display: 'inline-block', minWidth: '20%' }}>
                                            <Button style={{ color: '#F24', textTransform: 'none' }} title="expand"
                                                onClick={() => { declineInvite(group.Id); }}
                                            >
                                                Decline <FontAwesomeIcon icon={faBan} style={{ marginLeft: '5px' }} />
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            );
                        })
                        : <Grid style={{ margin: '5px', padding: '5px' }}>No pending invites.</Grid>
                    }
                </Grid>
            </Grid>
            <Grid style={{ width: '100%', color: '#2DF', margin: "auto", marginTop: '10px', marginBottom: '0px' }}>
                Request to Join a Group
                <Divider style={{ width: '100%', backgroundColor: '#2DF' }}></Divider>
            </Grid>
            <Grid style={{ width: '100%', minHeight: '45%', padding: '20px', color: 'white' }}>
                <Grid style={{ width: renderMobile ? '100%' : '60%', height: '20%', display: 'block', padding: '10px' }}>
                    Find a Group:
                    <UserInputComponent
                        style={{ color: 'white', borderColor: 'white' }}
                        inputProps={{
                            style: {
                                color: 'white', backgroundColor: '#555555', borderColor: '#2DF'
                            }
                        }}
                        value={filterName}
                        name="group name"
                        onChange={(value) => { setFilterName(value); }}
                    />
                </Grid>
                <Grid style={{ width: '100%', color: '#2DF', margin: "auto", marginTop: '10px', marginBottom: '0px' }}>
                    Found results
                    <Divider style={{ width: '100%', backgroundColor: '#2DF' }}></Divider>
                </Grid>
                <Grid style={{ display: 'flex', color: '#2DF', margin: "auto", marginTop: '10px', marginBottom: '0px' }}>
                    <Button variant="outlined"
                        style={{ borderColor: '#2DF', marginRight: '15px' }}
                        onClick={() => previousSeekedGroupsPage()}
                    >
                        <FontAwesomeIcon icon={faArrowAltCircleLeft} style={{ color: '#2DF' }} />
                    </Button>
                    <Grid style={{ display: 'inline-block' }}>
                        page {seekedGroupsPage} of {seekedGroupsMaxPages} pages ({seekedGroupsCount} groups)
                    </Grid>
                    <Button variant="outlined"
                        style={{ borderColor: '#2DF', marginLeft: '15px' }}
                        onClick={() => nextSeekedGroupsPage()}
                    >
                        <FontAwesomeIcon icon={faArrowAltCircleRight} style={{ color: '#2DF' }} />
                    </Button>
                </Grid>
                {!Array.isArray(groups) ? <></> :
                    groups.map((group) => {
                        return (
                            <Grid style={{ width: '100%', padding: '5px', paddingTop: '10px' }}>
                                <Grid key={group.Id} style={{ width: renderMobile ? '100%' : '60%', marginBottom: '10px', display: 'block', padding: '10px', border: 'solid 1px #2DF', borderRadius: '1rem' }}>
                                    <Grid style={{ display: 'inline-block', width: '15%' }}>
                                        {group.IconPhoto && group.IconPhoto.Id > 0 ?
                                            <SelfLoadingThumbnail source={group.IconPhoto.Id} size={150} />
                                            :
                                            <FontAwesomeIcon icon={faImages} size="3x" />
                                        }
                                    </Grid>
                                    <Grid style={{ display: 'inline-block', width: '15%' }}>
                                        {group.Name}
                                    </Grid>
                                    <Grid style={{ display: 'inline-block', width: '30%' }}>
                                        <i>Owned by:</i><br />
                                        {group.Creator.Name}
                                    </Grid>
                                    <Grid style={{ display: 'inline-block', width: '40%' }}>
                                        <Button
                                            style={{ color: '#2DF', textTransform: 'none' }}
                                            onClick={() => { requestToJoinGroup(group.Id); }}
                                        >
                                            Request to Join
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        );
                    })
                }
            </Grid>
        </div>
    );
}