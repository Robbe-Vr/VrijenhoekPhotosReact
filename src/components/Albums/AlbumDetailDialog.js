import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import { Button, Checkbox, Grid, Typography, Dialog, DialogContent } from "@material-ui/core";
import { DetailDialog } from "../Global/DetailDialog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTimes, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useAccount } from "../../api/account";
import { UserInputComponent } from "../Global/UserInputComponent";
import { useNotifications } from "../Global/NotificationContext";

const useStyles = makeStyles((theme) => ({
    
}));

function AlbumDetailDialog({ item, Api, show, onClose, fromGroupId, fromGroupOwnerId }) {
    const classes = useStyles();

    const { success, warning, error } = useNotifications();

    const { id } = useAccount();

    const [renaming, setRenaming] = useState(false);
    const [renamingNewName, setRenamingNewName] = useState(item?.Name || '');

    const rename = (newName) => {
        var renamedAlbum = { ...item };
        renamedAlbum.Name = newName;

        Api.UpdateAlbum(renamedAlbum).then((res) => {
            if (res instanceof String || typeof res == 'string') {
                error('Failed to rename album!');
            }
            else if (res.status && res.status != 200) {
                if (res.detail) {
                    error(`Sorry! ${res.detail}`);
                }
                else error(`Failed to rename album!`);
                console.log(`Failed to rename album!`, res);
            }
            else {
                success('Album has been renamed to: ' + newName);
                item.Name = newName;
                setRenaming(false);
            }
        });
    };

    const [showPhotos, setShowPhotos] = useState(false);
    const [showGroups, setShowGroups] = useState(false);

    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const deleteAlbum = () => {
        Api.RemoveAlbum(item).then((res) => {
            if (res instanceof String || typeof res == 'string') {
                error(`Failed to remove album ${item.Name}!`);
            }
            else if (res.status && res.status != 200) {
                if (res.detail) {
                    error(`Sorry! ${res.detail}`);
                }
                else error(`Failed to remove album ${item.Name}!`);
                console.log(`Failed to remove album ${item.Name}!`, res);
            }
            else {
                success(`Album ${item.Name} has been removed!`);

                setShowDeleteDialog(false);

                onClose();
            }
        });
    };

    const [showRemoveDialog, setShowRemoveDialog] = useState(false);

    const removeFromGroup = () => {
        Api.RemoveAlbumFromGroup(item.Id, fromGroupId).then((res) => {
            if (res instanceof String || typeof res == 'string') {
                error(`Failed to remove album ${item.Name} from group!`);
            }
            else if (res.status && res.status != 200) {
                if (res.detail) {
                    error(`Sorry! ${res.detail}`);
                }
                else error(`Failed to remove album ${item.Name} from group!`);
                console.log(`Failed to remove album ${item.Name} from group!`, res);
            }
            else {
                success(`Album ${item.Name} has been removed from this group!`);

                setShowRemoveDialog(false);

                onClose();
            }
        });
    };

    let dateStr = item?.CreationDate.toLocaleString('nl');

    return (
        <>
            <DetailDialog show={show} title={(item.Name || onClose({}, 'invalid item'))  + ' details'} onClose={onClose}>
                <Grid style={{ width: '100%', height: '20%', padding: '5px' }}>
                    <Typography variant="h7">created by <i>{item.User.Name}</i> at: {dateStr}</Typography>
                </Grid>
                <Grid style={{ width: '100%', height: '20%', padding: '5px' }}>
                    <Grid style={{ width: '40%', height: '100%', display: 'inline-block', verticalAlign: 'middle' }}>
                        <UserInputComponent name="Name" defaultValue={renamingNewName} disabled={!renaming}
                            value={renamingNewName}
                            onChange={(value) => setRenamingNewName(value)}
                            style={{ height: '100%', color: 'white', backgroundColor: '#333' }}
                        />
                    </Grid>
                    {renaming ?
                        <Button variant="outlined" color="primary"
                            style={{ marginLeft: '10px', display: 'inline-block', textTransform: 'none', verticalAlign: 'middle' }}
                            onClick={() => { setRenaming(false); setRenamingNewName(item?.Name || ''); }}
                        >
                            Cancel <FontAwesomeIcon icon={faTimes} style={{ marginLeft: '5px' }} />
                        </Button>
                    : <></>}
                    <Button variant="outlined"
                        style={{ backgroundColor: '#FD2', textTransform: 'none', marginLeft: '10px' }}
                        onClick={() => { renaming ? rename(renamingNewName) : setRenaming(true); }}
                    >
                        Rename <FontAwesomeIcon icon={faPen} style={{ marginLeft: '5px' }} />
                    </Button>
                </Grid>
                <Grid style={{ width: '100%', height: '20%', padding: '5px' }}>
                    Photos: {item.Photos?.length || 0}
                    <Button variant="outlined"
                        style={{ color: '#2DF', borderColor: '#2DF', marginLeft: '10px', textTransform: 'none' }}
                        onClick={() => setShowPhotos(true)}
                    >
                        List Photos
                    </Button>
                </Grid>
                <Grid style={{ width: '100%', height: '20%', padding: '5px' }}>
                    Groups: {item.Groups?.length || 0}
                    <Button variant="outlined"
                        style={{ color: '#2DF', borderColor: '#2DF', marginLeft: '10px', textTransform: 'none' }}
                        onClick={() => setShowGroups(true)}
                    >
                        List Groups
                    </Button>
                </Grid>
                <Grid style={{ width: '100%', height: '20%', padding: '5px' }}>
                    {fromGroupId && (item.User.Id == id || fromGroupOwnerId == id) ?
                        <>
                            <Button variant="outlined"
                                style={{ color: '#FD2', borderColor: '#FD2', marginLeft: '10px', textTransform: 'none' }}
                                onClick={() => setShowRemoveDialog(true)}
                            >
                                Remove from Group
                            </Button>
                        </>
                    : <></>}
                    {item.User.Id == id ?
                        <>
                            <Button variant="outlined"
                                style={{ color: '#F24', borderColor: '#F24', marginLeft: '10px', textTransform: 'none' }}
                                onClick={() => setShowDeleteDialog(true)}
                            >
                                Delete Album
                            </Button>
                        </>
                    : <></>}
                </Grid>
            </DetailDialog>
            <Dialog open={showPhotos} onClose={(e, reason) => setShowPhotos(false)} style={{ backgroundColor: '#222' }} >
                <DialogContent style={{ backgroundColor: '#222', color: 'white' }}>
                    <Grid style={{ width: '100%', height: '100%', overflowY: 'auto' }}>
                        <i>Photos: {item.Photos?.length || 0}</i><br />
                        {Array.isArray(item.Photos) ? item.Photos.map((photo) => {
                            return (
                                <Grid style={{ width: '100%', paddingLeft: '5px', borderBottom: 'solid 1px #2DF' }}>
                                    <Typography variant="h6">{photo.Name}</Typography>
                                </Grid>
                            );
                        }) : <></>}
                    </Grid>
                </DialogContent>
            </Dialog>
            <Dialog open={showGroups} onClose={(e, reason) => setShowGroups(false)} style={{ backgroundColor: '#222' }} >
                <DialogContent style={{ backgroundColor: '#222', color: 'white' }}>
                    <Grid style={{ width: '100%', height: '100%', overflowY: 'auto' }}>
                        <Button component={Link} to={"/albums/" + item.Id}
                            style={{ color: '#2DF', textTransform: 'none' }}
                        >
                            View Album
                        </Button>
                        <i>Groups: {item.Groups?.length || 0}</i><br />
                        {Array.isArray(item.Groups) ? item.Groups.map((group) => {
                            return (
                                <Grid style={{ width: '100%', paddingLeft: '5px', borderBottom: 'solid 1px #2DF' }}>
                                    <Typography variant="h6">{group.Name}</Typography>
                                    <Button component={Link} to={"/groups/" + group.Id}
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
                            onClick={() => { deleteAlbum(); }}
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
            <Dialog open={showRemoveDialog} onClose={(e, reason) => setShowDeleteDialog(false)} style={{ backgroundColor: '#222' }} >
                <DialogContent style={{ backgroundColor: '#222', color: 'white' }}>
                    <Grid style={{ width: '100%', height: '100%', overflowY: 'auto' }}>
                        Are you sure you want to remove <i>{item.Name}</i> from this group?<br />
                        <br />
                        <Button variant="outlined"
                            style={{ color: '#F24', borderColor: '#F24', marginLeft: '10px', textTransform: 'none' }}
                            onClick={() => { removeFromGroup(); }}
                        >
                            Remove from Group<FontAwesomeIcon icon={faTrash} style={{ marginLeft: '5px' }} />
                        </Button>
                        <Button variant="outlined"
                            style={{ color: '#2DF', borderColor: '#2DF', marginLeft: '10px', textTransform: 'none' }}
                            onClick={() => setShowRemoveDialog(false)}
                        >
                            Cancel
                        </Button>
                    </Grid>
                </DialogContent>
            </Dialog>
        </>
    );
};

export { AlbumDetailDialog };