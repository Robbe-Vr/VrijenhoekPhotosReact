import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { useAccount } from "../../api/account";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Checkbox, Grid, Typography, Dialog, DialogContent } from "@material-ui/core";
import { DetailDialog } from "../Global/DetailDialog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const useStyles = makeStyles((theme) => ({
    
}));

function GroupDetailDialog({ item, Api, show, onClose }) {
    const classes = useStyles();

    const { id } = useAccount();

    const [showUsers, setShowUsers] = useState(false);
    const [showAlbums, setShowAlbums] = useState(false);

    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const deleteGroup = () => {
        Api.RemoveGroup(item).then((res) => {

        });
    };

    let dateStr = item?.CreationDate.toLocaleString('nl');

    return (
        <>
            <DetailDialog show={show} title={(item.Name || onClose({}, 'invalid item'))  + ' details'} onClose={onClose}>
                <Grid style={{ width: '100%', height: '20%', padding: '5px' }}>
                    <Typography variant="h7">created by <i>{item.Creator.Name}</i> at: {dateStr}</Typography>
                </Grid>
                <Grid style={{ width: '100%', height: '20%', padding: '5px' }}>
                    Users: {item.Users?.length || 0}
                    <Button variant="outlined"
                        style={{ color: '#2DF', borderColor: '#2DF', marginLeft: '10px', textTransform: 'none' }}
                        onClick={() => setShowUsers(true)}
                    >
                        List Users
                    </Button>
                </Grid>
                <Grid style={{ width: '100%', height: '20%', padding: '5px' }}>
                    Albums: {item.Albums?.length || 0}
                    <Button variant="outlined"
                        style={{ color: '#2DF', borderColor: '#2DF', marginLeft: '10px', textTransform: 'none' }}
                        onClick={() => setShowAlbums(true)}
                    >
                        List Albums
                    </Button>
                </Grid>
                <Grid style={{ width: '100%', height: '20%', padding: '5px' }}>
                    {item.Creator.Id == id ?
                        <>
                            <Button variant="outlined" component={Link} to={"/account/manage/join-requests"}
                                style={{ color: '#2DF', borderColor: '#2DF', textTransform: 'none' }}
                            >
                                Manage
                            </Button>
                            <Button variant="outlined"
                                style={{ color: '#F24', borderColor: '#F24', marginLeft: '10px', textTransform: 'none' }}
                                onClick={() => setShowDeleteDialog(true)}
                            >
                                Delete Group
                            </Button>
                        </>
                    : <></>}
                </Grid>
            </DetailDialog>
            <Dialog open={showUsers} onClose={(e, reason) => setShowUsers(false)} style={{ backgroundColor: '#222' }} >
                <DialogContent style={{ backgroundColor: '#222', color: 'white' }}>
                    <Grid style={{ width: '100%', height: '100%', overflowY: 'auto' }}>
                        <i>Owner:</i><br />
                        <Grid style={{ width: '100%', paddingLeft: '5px' }}>
                            <Typography variant="h6">{item.Creator.Name}</Typography>
                        </Grid>
                        <i>Users: {item.Users?.length || 0}</i><br />
                        {Array.isArray(item.Users) ? item.Users.map((user) => {
                            return (
                                <Grid style={{ width: '100%', paddingLeft: '5px', borderBottom: 'solid 1px #2DF' }}>
                                    <Typography variant="h6">{user.Name}</Typography>
                                </Grid>
                            );
                        }) : <></>}
                    </Grid>
                </DialogContent>
            </Dialog>
            <Dialog open={showAlbums} onClose={(e, reason) => setShowAlbums(false)} style={{ backgroundColor: '#222' }} >
                <DialogContent style={{ backgroundColor: '#222', color: 'white' }}>
                    <Grid style={{ width: '100%', height: '100%', overflowY: 'auto' }}>
                        <i>Albums: {item.Albums?.length || 0}</i><br />
                        {Array.isArray(item.Albums) ? item.Albums.map((album) => {
                            return (
                                <Grid style={{ width: '100%', paddingLeft: '5px', borderBottom: 'solid 1px #2DF' }}>
                                    <Typography variant="h6">{album.Name}</Typography>
                                    <Button component={Link} to={"/albums/" + album.Id}
                                        style={{ color: '#2DF', textTransform: 'none' }}
                                    >
                                        show
                                    </Button>
                                </Grid>
                            );
                        }) : <></>}
                    </Grid>
                </DialogContent>
            </Dialog>
            <Dialog open={showDeleteDialog} onClose={(e, reason) => setShowDeleteDialog(false)} style={{ backgroundColor: '#222' }} >
                <DialogContent style={{ backgroundColor: '#222', color: 'white' }}>
                    <Grid style={{ width: '100%', height: '100%', overflowY: 'auto' }}>
                        Are you sure you want to delete <i>{item.Name}</i>?<br />
                        <br />
                        <Button variant="outlined"
                            style={{ color: '#F24', borderColor: '#F24', marginLeft: '10px', textTransform: 'none' }}
                            onClick={() => { deleteGroup(); }}
                        >
                            Delete <FontAwesomeIcon icon={faTrash} style={{ marginLeft: '5px' }} />
                        </Button>
                        <Button variant="outlined"
                            style={{ color: '#2DF', borderColor: '#2DF', marginLeft: '10px', textTransform: 'none' }}
                            onClick={() => setShowDeleteDialog(false)}
                        >
                            Cancel
                        </Button>
                    </Grid>
                </DialogContent>
            </Dialog>
        </>
    );
};

export { GroupDetailDialog };