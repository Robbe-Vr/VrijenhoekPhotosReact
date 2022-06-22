import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import { Button, CircularProgress, Divider, Grid, Typography } from "@material-ui/core";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowAltCircleLeft, faArrowAltCircleRight, faPlus } from "@fortawesome/free-solid-svg-icons";
import { UserInputComponent } from "../Global/UserInputComponent";
import { useNotifications } from "../Global/NotificationContext";
import Group from "../../models/Group";
import User from "../../models/User";
import Album from "../../models/Album";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { GroupContainer } from "./GroupContainer";
import { Pagination } from "../Global/Pagination";
import { GroupDetailDialog } from "./GroupDetailDialog";


const useStyles = makeStyles(() => ({
    form: {
        width: '100%',
        height: '100%',
        margin: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    txt: { textAlign: "center" },
    continue: {
        marginTop: "20px",
        width: "20%",
    },
}));

export default function GroupsPage({ setTitle, Api, renderMobile }) {
    useEffect(() => {
        setTitle && setTitle("Groups");
    });

    const classes = useStyles();

    const history = useHistory();

    const { error, warning, success } = useNotifications();

    const [loaded, setLoaded] = useState(false);

    const [ownedGroupsPage, setOwnedGroupsPage] = useState(1);
    const [ownedGroupsMaxPages, setOwnedGroupsMaxPages] = useState(1);
    const [ownedGroupsCount, setOwnedGroupsCount] = useState(0);

    const [ownedGroupsRpp, setOwnedGroupsRpp] = useState(10);

    useEffect(() => {
        let pages = parseInt(ownedGroupsCount / ownedGroupsRpp);
        if (ownedGroupsCount % ownedGroupsRpp > 0) pages++;

        setOwnedGroupsMaxPages(pages);
    },[ownedGroupsRpp, ownedGroupsCount]);

    useEffect(() => {
        Api.GetUsersOwnedGroupsCount().then((res) => {
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
    }, [Api]);

    const [groups, setGroups] = useState([]);

    useEffect(() => {
        Api.GetUsersOwnedGroups(ownedGroupsPage, ownedGroupsRpp).then((res) => {
            if (res instanceof String || typeof res == 'string') {
                error('Failed to load your groups!')
            }
            else if (res.status && res.status != 200) {
                if (res.detail) {
                    error(`Sorry! ${res.detail}`);
                }
                else error(`Failed to load your groups!`);
                console.log(`Failed to load your groups!`, res);
            }
            else {
                setGroups(res);
            }

            setLoaded(true);
        });
    }, [Api, ownedGroupsPage, ownedGroupsRpp]);

    const [joinedGroupsPage, setJoinedGroupsPage] = useState(1);
    const [joinedGroupsMaxPages, setJoinedGroupsMaxPages] = useState(1);
    const [joinedGroupsCount, setJoinedGroupsCount] = useState(0);

    const [joinedGroupsRpp, setJoinedGroupsRpp] = useState(10);

    useEffect(() => {
        let pages = parseInt(joinedGroupsCount / joinedGroupsRpp);
        if (joinedGroupsCount % joinedGroupsRpp > 0) pages++;

        setJoinedGroupsMaxPages(pages);
    },[joinedGroupsRpp, joinedGroupsCount]);

    useEffect(() => {
        Api.GetUsersJoinedGroupsCount().then((res) => {
            if (res instanceof String || typeof res == 'string') {
                warning('Failed to get count of joined groups!');
            }
            else if (res.status && res.status != 200) {
                if (res.detail) {
                    warning(`Sorry! ${res.detail}`);
                }
                else warning(`Failed to get count of joined groups!`);
                console.log('Failed to get count of joined groups!', res);
            }
            else {
                let pages = parseInt(res / 10);
                if (res % 10 > 0) pages++;

                setJoinedGroupsMaxPages(pages);
                setJoinedGroupsCount(res);
            }
        });
    }, [Api]);

    const [joinedGroups, setJoinedGroups] = useState([]);

    useEffect(() => {
        Api.GetUsersJoinedGroups(joinedGroupsPage, joinedGroupsRpp).then((res) => {
            if (res instanceof String || typeof res == 'string') {
                warning('Failed to load joined groups!')
            }
            else if (res.status && res.status != 200) {
                if (res.detail) {
                    warning(`Sorry! ${res.detail}`);
                }
                else warning(`Failed to load joined groups!`);
                console.log(`Failed to load joined groups!`, res);
            }
            else {
                setJoinedGroups(res);
            }

            setLoaded(true);
        });
    }, [Api, joinedGroupsPage, joinedGroupsRpp]);

    const [newGroupName, setNewGroupName] = useState("");

    const createNewGroup = () => {
        Api.CreateGroup(newGroupName).then((res) => {
            if (res instanceof String || typeof res == 'string') {
                error("Failed to create group!");
            }
            else if (res.status && res.status != 200) {
                if (res.detail) {
                    error(`Sorry! ${res.detail}`);
                }
                else error(`Failed to create group!`);
                console.log(`Failed to create group!`, res);
            }
            else {
                success("Group was created!");
                var item = res.data;
                var newGroup =
                    new Group(item.id, item.groupName, item.creationDate, item.IconPhoto,
                        new User(item.creator.id, item.creator.userName, item.creator.isAdmin, [], [], [], item.creator.creationDate),
                        Array.isArray(item.albums) ? item.albums.map(album =>
                            new Album(album.id, album.name, album.creationDate,
                                new Photo(album.iconPhoto.id, album.iconPhoto.name, album.iconPhoto.creationDate, album.iconPhoto.isVideo, album.iconPhoto.type, [],
                                    new User(album.iconPhoto.user.id, album.iconPhoto.user.userName, album.iconPhoto.user.isAdmin, [], [], [], album.iconPhoto.user.creationDate)
                                ),
                                [], [],
                                new User(album.user.id, album.user.userName, album.user.isAdmin, [], [], [], album.user.creationDate)
                            )
                        )
                        : [],
                        Array.isArray(group.users) ? group.users.map((user) => {
                            return new User(user.id, user.userName, user.isAdmin, [], [], [], user.creationDate);
                        }) : []
                    );
                var moddedGroup = { ...newGroup, photo: newGroup.IconPhoto }

                var newGroups = [...groups];
                newGroups.push(moddedGroup);
                setGroups(newGroups);
            }
        });
    }

    const selectGroup = (group) => {
        history.push('/groups/' + group.Id);
    }

    const [detailDialogId, setDetailDialogId] = useState(0);

    const contextMenu = (group) => {
        setDetailDialogId(group.Id || 0);
    };

    if (!loaded) {
        return (
            <div className={classes.form} style={{ height: window.innerHeight * 0.8 }}>
                <Grid style={{ color: 'white', height: '100%', margin: 'auto', verticalAlign: 'middle' }}>
                    <Typography variant="h6">Loading groups...</Typography>
                    <CircularProgress size={75} style={{ marginTop: '10%', verticalAlign: 'middle', color: '#22DDFF' }} />
                </Grid>
            </div>
        );
    }

    return (
        <div className={classes.form} style={{ height: '100%', overflowY: 'auto' }}>
            <Grid style={{ width: '100%', minHeight: '25%', maxHeight: '50%', overflow: 'auto', boxShadow: 'inset 0px -7px 5px rgba(0 0 0 / 30%), inset 0px 7px 5px rgba(0 0 0 / 30%)', padding: '20px', border: 'solid 1px white', borderRadius: '1rem', overflowY: 'hidden' }}>
                <Grid style={{ display: 'inline-block', width: renderMobile ? '100%' : '50%', height: '100%' }}>
                    <Grid style={{ width: renderMobile ? '100%' : '60%', minHeight: '20%', display: 'inline-block', padding: '10px' }}>
                        <UserInputComponent
                            style={{ color: 'white', borderColor: 'white' }}
                            inputProps={{
                                style: {
                                    color: 'white', backgroundColor: '#555555',
                                }
                            }}
                            name="Group Name"
                            onChange={(value) => { setNewGroupName(value); }}
                        />
                    </Grid>
                    <Button variant="outlined" style={{ color: 'white', borderColor: 'white', backgroundColor: '#22AABB', textTransform: 'none', display: 'inline-block', margin: '5px', verticalAlign: 'middle' }}
                        onClick={() => { createNewGroup(); }}
                    >
                        <Typography variant="h7"><FontAwesomeIcon icon={faPlus} style={{ marginRight: '5px' }} />Create Group</Typography>
                    </Button>
                </Grid>
            </Grid>
            <Grid style={{ width: '100%', color: '#2DF', margin: "auto", marginTop: '10px', marginBottom: '0px' }}>
                Your Groups
                <Divider  style={{ width: '100%', backgroundColor: '#2DF' }}></Divider>
            </Grid>
            <Grid style={{ width: '100%', minHeight: '25%', maxHeight: '50%', overflow: 'auto', borderBottom: 'solid 1px #2DF', boxShadow: 'inset 0px -7px 5px rgba(0 0 0 / 30%), inset 0px 7px 5px rgba(0 0 0 / 30%)', paddingTop: '20px', paddingLeft: '20px' }}>
                <Pagination page={ownedGroupsPage} maxPages={ownedGroupsMaxPages} onChange={(newPage) => setOwnedGroupsPage(newPage)} rpp={ownedGroupsRpp} count={ownedGroupsCount} onChangeRpp={(newRpp) => setOwnedGroupsRpp(newRpp)} />
                {!Array.isArray(groups) || groups.length < 1 ? <Typography style={{ color: 'white' }}>You do not own any groups.</Typography> :
                    groups.map((group, index) => {
                        var item = {
                            ...group,
                            Id: group.IconPhoto?.Id,
                        };

                        return (
                            <>
                                <GroupContainer
                                    item={item}
                                    Api={Api}
                                    onContext={() => {
                                        contextMenu(group);
                                    }}
                                    onClick={() => {
                                        selectGroup(group);
                                    }}
                                />
                                <GroupDetailDialog show={detailDialogId == group.Id} item={group} Api={Api} onClose={(e, reason) => { if (reason == 'invalid item') { warning('Unable to load group!') } setDetailDialogId(0); }} />
                            </>
                        );
                    })
                }
                <Pagination page={ownedGroupsPage} maxPages={ownedGroupsMaxPages} onChangePage={(newPage) => setOwnedGroupsPage(newPage)} rpp={ownedGroupsRpp} count={ownedGroupsCount} onChangeRpp={(newRpp) => setOwnedGroupsRpp(newRpp)} />
            </Grid>
            <Grid style={{ width: '100%', color: '#2DF', margin: "auto", marginTop: '10px', marginBottom: '0px' }}>
                Joined Groups
                <Divider style={{ width: '100%', backgroundColor: '#2DF' }}></Divider>
            </Grid>
            <Grid style={{ width: '100%', minHeight: '25%', maxHeight: '50%', overflow: 'auto', borderBottom: 'solid 1px #2DF', boxShadow: 'inset 0px -7px 5px rgba(0 0 0 / 30%), inset 0px 7px 5px rgba(0 0 0 / 30%)', paddingTop: '20px', paddingLeft: '20px' }}>
                <Pagination page={joinedGroupsPage} maxPages={joinedGroupsMaxPages} onChangePage={(newPage) => setJoinedGroupsPage(newPage)} rpp={joinedGroupsRpp} count={joinedGroupsCount} onChangeRpp={(newRpp) => setJoinedGroupsRpp(newRpp)} />
                {!Array.isArray(joinedGroups) || joinedGroups.length < 1 ? <Typography style={{ color: 'white' }}>You have not joined any groups.</Typography> :
                    joinedGroups.map((group, index) => {
                        var item = {
                            ...group,
                            Id: group.IconPhoto?.Id,
                        };

                        return (
                            <>
                                <GroupContainer
                                    item={item}
                                    Api={Api}
                                    onContext={() => {
                                        contextMenu(group);
                                    }}
                                    onClick={() => {
                                        selectGroup(group);
                                    }}
                                />
                                <GroupDetailDialog show={detailDialogId == group.Id} item={group} Api={Api} onClose={(e, reason) => { if (reason == 'invalid item') { warning('Unable to load group!') } setDetailDialogId(0); }} />
                            </>
                        );
                    })
                }
                <Pagination page={joinedGroupsPage} maxPages={joinedGroupsMaxPages} onChangePage={(newPage) => setJoinedGroupsPage(newPage)} rpp={joinedGroupsRpp} count={joinedGroupsCount} onChangeRpp={(newRpp) => setJoinedGroupsRpp(newRpp)} />
            </Grid>
        </div>
    );
};