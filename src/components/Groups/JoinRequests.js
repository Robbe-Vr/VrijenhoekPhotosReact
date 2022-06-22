import React, { useEffect, useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Button, Divider, Grid, Typography } from "@material-ui/core";
import { UserInputComponent } from "../Global/UserInputComponent";

import { faAngleDown, faAngleUp, faArrowAltCircleLeft, faArrowAltCircleRight, faBan, faCheck, faImages, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SelfLoadingThumbnail } from "../Global/SelfLoadingThumbnail";
import { useNotifications } from "../Global/NotificationContext";
import AddUserMenu from "./AddUserMenu";
import { Pagination } from "../Global/Pagination";

const useStyles = makeStyles((theme) => ({
    
}));

export default function ManageJoinRequestsPage({ Api, setTitle, renderMobile }) {
    const classes = useStyles();

    useEffect(() => {
        setTitle && setTitle('Manage Join Requests');
    });

    const { error, warning, success } = useNotifications();

    const [addUserContextData, setAddUserContextData] = useState({ open: false, groupId: 0 });
    const openAddUserMenu = (groupId) => {
        setAddUserContextData({ open: true, groupId: groupId });
    };

    const closeAddUserMenu = () => {
        setAddUserContextData({ open: false, groupId: 0 });
    };

    const [loaded, setLoaded] = useState(false);

    const [filterName, setFilterName] = useState('');

    const [selectedGroup, setSelectedGroup] = useState({});

    const toggleSelectGroup = (group) => {
        if (selectedGroup.Id == group.Id) {
            setSelectedGroup({});
        }
        else setSelectedGroup(group);
    };

    const [ownedGroupsPage, setOwnedGroupsPage] = useState(1);
    const [ownedGroupsMaxPages, setOwnedGroupsMaxPages] = useState(1);
    const [ownedGroupsCount, setOwnedGroupsCount] = useState(0);

    const [ownedGroupsRpp, setOwnedGroupsRpp] = useState(10);

    useEffect(() => {
        Api.GetUsersOwnedGroupsCount(filterName).then((res) => {
            if (res instanceof String || typeof res == 'string') {
                warning('Failed to get count of owned groups!');
            }
            else if (res.status && res.status != 200) {
                if (res.detail) {
                    warning(`Sorry! ${res.detail}`);
                }
                else warning(`Failed to get count of owned groups!`);
                console.log('Failed to get count of owned groups!', res);
            }
            else {
                let pages = parseInt(res / 10);
                if (res % 10 > 0) pages++;

                setOwnedGroupsMaxPages(pages);
                setOwnedGroupsCount(res);
            }
        });
    }, [Api, filterName]);

    const [groups, setGroups] = useState([]);

    useEffect(() => {
        Api.GetUsersOwnedGroups(ownedGroupsPage).then((res) => {
            if (res instanceof String || typeof res == 'string') {
                error('Failed to load owned groups!')
            }
            else if (res.status && res.status != 200) {
                if (res.detail) {
                    error(`Sorry! ${res.detail}`);
                }
                else error(`Failed to load owned groups!`);
                console.log(`Failed to load owned groups!`, res);
            }
            else {
                setGroups(res);
            }

            setLoaded(true);
        });
    }, [Api, ownedGroupsPage]);

    const acceptRequest = (groupId, userId) => {
        Api.AcceptJoinRequest(groupId, userId).then((res) => {
            if (res instanceof String || typeof res == 'string') {
                error('Failed to accept request!')
            }
            else if (res.status && res.status != 200) {
                if (res.detail) {
                    error(`Sorry! ${res.detail}`);
                }
                else error(`Failed to accept request!`);
                console.log(`Failed to accept request!`, res);
            }
            else {
                if (res.data.result) {
                    success(res.data.special || "Request has been accepted!");
                }
                else {
                    warning('Sorry! ' + res.data.message);
                }
            }
        });
    };

    const declineRequest = (groupId, userId) => {
        Api.DeclineJoinRequest(groupId, userId).then((res) => {
            if (res instanceof String || typeof res == 'string') {
                error('Failed to decline request!')
            }
            else if (res.status && res.status != 200) {
                if (res.detail) {
                    error(`Sorry! ${res.detail}`);
                }
                else error(`Failed to decline request!`);
                console.log(`Failed to decline request!`, res);
            }
            else {
                if (res.data.result) {
                    success(res.data.special || "Request has been declined!");
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
                Join Requests for your Groups
                <Divider style={{ width: '100%', backgroundColor: '#2DF' }}></Divider>
            </Grid>
            <Grid style={{ width: '100%', minHeight: '50%', padding: '20px', color: 'white' }}>
                <Grid style={{ width: '100%', minHeight: '50%', maxHeight: '90%', overflow: 'auto', borderBottom: 'solid 1px #2DF', boxShadow: 'inset 0px -7px 5px rgba(0 0 0 / 30%), inset 0px 7px 5px rgba(0 0 0 / 30%)', padding: '20px' }}>
                    <Pagination page={ownedGroupsPage} maxPages={ownedGroupsMaxPages} onChangePage={(newPage) => setOwnedGroupsPage(newPage)} rpp={ownedGroupsRpp} count={ownedGroupsCount} onChangeRpp={(newRpp) => setOwnedGroupsRpp(newRpp)} />
                    {!Array.isArray(groups) ? <></> :
                        groups.map((group) => {
                            return (
                                <Grid key={group.Id} style={{ width: '100%', marginBottom: '10px', display: 'block', padding: '10px', border: 'solid 1px #2DF', borderRadius: '0.5rem' }}>
                                    <Grid style={{ display: 'inline-block', minWidth: '20%', paddingLeft: '10px' }}>
                                        {group.IconPhoto && group.IconPhoto.Id > 0 ?
                                            <SelfLoadingThumbnail source={group.IconPhoto.Id} size={150} />
                                            :
                                            <FontAwesomeIcon icon={faImages} size="3x" />
                                        }
                                    </Grid>
                                    <Grid style={{ display: 'inline-block', minWidth: '20%', paddingLeft: '10px' }} title={group.Name}>
                                        {group.Name}
                                    </Grid>
                                    <Grid style={{ display: 'inline-block', minWidth: '15%', paddingLeft: '10px' }} title={group.Creator.Name || 'Unknown'}>
                                        <i>Owned by:<br />{group.Creator.Name || 'Unknown'}</i>
                                    </Grid>
                                    <Grid style={{ display: 'inline-block', minWidth: '10%', paddingLeft: '10px' }}>
                                        <Button style={{ color: '#2FD', textTransform: 'none' }} title="expand"
                                            onClick={() => { toggleSelectGroup(group); }}
                                        >
                                            {selectedGroup.Id == group.Id ? 'Hide' : 'Show'} pending invites <FontAwesomeIcon icon={selectedGroup.Id == group.Id ? faAngleUp : faAngleDown} style={{ marginLeft: '5px' }} />
                                        </Button>
                                    </Grid>
                                    <Grid style={{ display: 'inline-block', minWidth: '10%', paddingLeft: '10px' }}>
                                        <Button variant="outlined"
                                            style={{ backgroundColor: '#2FD', textTransform: 'none' }}
                                            onClick={() => { openAddUserMenu(group.Id); }}
                                        >
                                            Add User <FontAwesomeIcon icon={faUser} style={{ marginLeft: '5px' }} />
                                        </Button>
                                    </Grid>
                                    {selectedGroup.Id == group.Id ?
                                        <Grid style={{ display: 'inline-block', width: '100%', borderTop: 'solid 1px #2DF', marginTop: '10px', paddingTop: '5px' }}>
                                            {Array.isArray(selectedGroup.RequestingUsers) && selectedGroup.RequestingUsers.length > 0 ? selectedGroup.RequestingUsers.map((user) => {
                                                return (
                                                    <Grid key={`request-${user.Id}`} style={{ padding: '10px' }}>
                                                        <Grid style={{ display: 'inline-block', minWidth: '50%' }} title={user.Name || 'Unknown'}>
                                                            <i>{user.Name || '<Unknown user>'}</i> wants to join this group!
                                                        </Grid>
                                                        <Grid style={{ display: 'inline-block', minWidth: '25%' }}>
                                                            <Button style={{ color: '#2F4', textTransform: 'none' }} title="accept request"
                                                                onClick={() => { acceptRequest(selectedGroup.Id, user.Id); }}
                                                            >
                                                                Accept <FontAwesomeIcon icon={faCheck} style={{ marginLeft: '5px' }} />
                                                            </Button>
                                                        </Grid>
                                                        <Grid style={{ display: 'inline-block', minWidth: '25%' }}>
                                                            <Button style={{ color: '#F24', textTransform: 'none' }} title="decline request"
                                                                onClick={() => { declineRequest(selectedGroup.Id, user.Id); }}
                                                            >
                                                                Decline <FontAwesomeIcon icon={faBan} style={{ marginLeft: '5px' }} />
                                                            </Button>
                                                        </Grid>
                                                    </Grid>
                                                );
                                            })
                                            : <>No join requests for this group.</>}
                                        </Grid>
                                        : <></>
                                    }
                                </Grid>
                            );
                        })
                    }
                    <Pagination page={ownedGroupsPage} maxPages={ownedGroupsMaxPages} onChangePage={(newPage) => setOwnedGroupsPage(newPage)} rpp={ownedGroupsRpp} count={ownedGroupsCount} onChangeRpp={(newRpp) => setOwnedGroupsRpp(newRpp)} />
                </Grid>
            </Grid>

            <AddUserMenu Api={Api} open={addUserContextData.open} groupId={addUserContextData.groupId} onClose={closeAddUserMenu} />
        </div>
    );
}