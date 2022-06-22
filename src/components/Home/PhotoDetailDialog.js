import React, { useEffect, useRef, useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import { Button, Checkbox, Grid, Typography, Dialog, DialogContent } from "@material-ui/core";
import { DetailDialog } from "../Global/DetailDialog";
import { faPen, faTimes, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useNotifications } from "../Global/NotificationContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { UserInputComponent } from "../Global/UserInputComponent";
import { useAccount } from "../../api/account";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    
}));

function PhotoDetailDialog({ item, Api, show, onClose, fromAlbumId, fromAlbumOwnerId, onDeleted }) {
    const classes = useStyles();

    const { id } = useAccount();

    const { error, success } = useNotifications();

    const [renaming, setRenaming] = useState(false);
    const [renamingNewName, setRenamingNewName] = useState(item?.Name || '');

    const rename = (newName) => {
        var renamedPhoto = { ...item };
        renamedPhoto.Name = newName;

        Api.UpdatePhoto(renamedPhoto).then((res) => {
            if (res instanceof String || typeof res == 'string') {
                error('Failed to rename photo!');
            }
            else if (res.status && res.status != 200) {
                if (res.detail) {
                    error(`Sorry! ${res.detail}`);
                }
                else error(`Failed to rename photo!`);
                console.log(`Failed to rename photo!`, res);
            }
            else {
                success('Photo has been renamed to: ' + newName);
                item.Name = newName;
                setRenaming(false);
            }
        });
    };

    const [showAlbums, setShowAlbums] = useState(false);

    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const deletePhoto = () => {
        Api.RemovePhoto(item).then((res) => {
            if (res instanceof String || typeof res == 'string') {
                error(`Failed to remove photo ${item.Name}!`);
            }
            else if (res.status && res.status != 200) {
                if (res.detail) {
                    error(`Sorry! ${res.detail}`);
                }
                else error(`Failed to remove photo ${item.Name}!`);
                console.log(`Failed to remove photo ${item.Name}!`, res);
            }
            else {
                success(`Photo ${item.Name} has been removed!`);
                setShowDeleteDialog(false);

                onDeleted(item);
            }
        });
    };

    const [showRemoveDialog, setShowRemoveDialog] = useState(false);

    const removeFromAlbum = () => {
        Api.RemovePhotoFromAlbum(item.Id, fromAlbumId).then((res) => {
            if (res instanceof String || typeof res == 'string') {
                error(`Failed to remove photo ${item.Name} from album!`);
            }
            else if (res.status && res.status != 200) {
                if (res.detail) {
                    error(`Sorry! ${res.detail}`);
                }
                else error(`Failed to remove photo ${item.Name} from album!`);
                console.log(`Failed to remove photo ${item.Name} from album!`, res);
            }
            else {
                success(`Photo ${item.Name} has been removed from this album!`);

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
                    <Typography variant="h7">created by <i>{item.User.Name}</i> at {dateStr}</Typography>
                </Grid>
                <Grid style={{ width: '100%', height: '20%', padding: '5px' }}>
                    
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
                    Albums: {item.Albums?.length || 0}
                    <Button variant="outlined"
                        style={{ color: '#2DF', borderColor: '#2DF', marginLeft: '10px', textTransform: 'none' }}
                        onClick={() => setShowAlbums(true)}
                    >
                        List Albums
                    </Button>
                </Grid>
                <Grid style={{ width: '100%', height: '20%', padding: '5px' }}>
                    {fromAlbumId && (item.User.Id == id || fromAlbumOwnerId == id) ?
                        <>
                            <Button variant="outlined"
                                style={{ color: '#FD2', borderColor: '#FD2', marginLeft: '10px', textTransform: 'none' }}
                                onClick={() => setShowRemoveDialog(true)}
                            >
                                Remove from Album
                            </Button>
                        </>
                    : <></>}
                    {item.User.Id == id ?
                        <>
                            <Button variant="outlined"
                                style={{ color: '#F24', borderColor: '#F24', marginLeft: '10px', textTransform: 'none' }}
                                onClick={() => setShowDeleteDialog(true)}
                            >
                                Delete Photo
                            </Button>
                        </>
                    : <></>}
                </Grid>
            </DetailDialog>
            <Dialog open={showAlbums} onClose={(e, reason) => setShowAlbums(false)} style={{ backgroundColor: '#222' }} >
                <DialogContent style={{ backgroundColor: '#222', color: 'white' }}>
                    <Grid style={{ width: '100%', height: '100%', overflowY: 'auto' }}>
                        <i>Albums: {item.Albums?.length || 0}</i><br />
                        {Array.isArray(item.Albums) ? item.Albums.map((album) => {
                            return (
                                <Grid style={{ width: '90%', paddingLeft: '5px', borderBottom: 'solid 1px #2DF' }}>
                                    <Grid style={{ width: '50%', display: 'inline-block' }}>
                                        <Typography variant="h6">{album.Name}</Typography>
                                    </Grid>
                                    <Grid style={{ width: '50%', display: 'inline-block' }}>
                                        <Button component={Link} to={"/albums/" + album.Id}
                                            style={{ color: '#2DF', textTransform: 'none' }}
                                        >
                                            show
                                        </Button>
                                    </Grid>
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
                            onClick={() => deletePhoto()}
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
                            onClick={() => removeFromAlbum()}
                        >
                            Remove from Album<FontAwesomeIcon icon={faTrash} style={{ marginLeft: '5px' }} />
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

export { PhotoDetailDialog };