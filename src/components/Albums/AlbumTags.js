import React, { useEffect, useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import { Button, Checkbox, CircularProgress, Dialog, DialogContent, DialogTitle, Grid, TextField, Typography } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { AlbumTag } from "./AlbumTag";
import { useNotifications } from "../Global/NotificationContext";
import Tag from "../../models/Tag";

const useStyles = makeStyles((theme) => ({
    
}));

function AlbumTags({ itemTags, albumId, Api }) {
    const classes = useStyles();

    const { warning, success } = useNotifications();

    const [newTagName, setNewTagName] = useState("");

    const addTag = () => {
        if (newTagName.length < 2) {
            warning("Please enter a valid tag name! Current value is too short.");
        }

        Api.AddTagToAlbum(albumId, new Tag(0, newTagName, new Date())).then((res) => {
            if (res instanceof String || typeof res == 'string') {
                warning('Failed to add tag to album!')
            }
            else if (res.status && res.status != 200) {
                if (res.detail) {
                    warning(`Sorry! ${res.detail}`);
                }
                else warning(`Failed to add tag to album!`);
                console.log(`Failed to add tag to album!`, res);
            }
            else {
                success("Tag has been added to album!");

                setNewTagName("");
            }
        });
    };

    const [removeDialog, setRemoveDialog] = useState({ open: false, tagId: 0 });

    const onDoubleClickTag = (tagId) => {
        setRemoveDialog({ open: true, tagId: tagId })
    };

    const removeTag = (tagId) => {
        Api.RemoveTagFromAlbum(albumId, tagId).then((res) => {

        });
    };

    return (
        <>
            {itemTags.map((tag) => {
                return (
                    <AlbumTag id={`album${albumId}-tag`} tagId={tag.Id} text={tag.Name} color="#2FD" onDoubleClick={onDoubleClickTag} />
                );
            })}
            <Grid id={`album${albumId}-tag`} style={{ display: 'inline-block', margin: '5px', padding: '3px', border: 'solid 1px #2FD', borderRadius: '1rem', height: '100%' }}>
                <TextField id={`album${albumId}-tag`}
                    style={{ borderBottom: 'solid 1px #2DF', margin: 'auto', marginLeft: '7px', marginRight: '5px', color: 'white', width: '70%', display: 'inline-block' }}
                    placeholder="new tag"
                    value={newTagName} onChange={(e) => { setNewTagName(e.target.value); }}
                />
                <Grid id={`album${albumId}-tag`}
                    style={{ borderRadius: '1rem', backgroundColor: '#2FD', verticalAlign: 'center', margin: 'auto', marginRight: '7px', minWidth: '10%', display: 'inline-block' }}
                    onClick={() => addTag()}
                >
                    <FontAwesomeIcon id={`album${albumId}-tag`} icon={faPlus} style={{ color: 'white' }} />
                </Grid>
            </Grid>

            <Dialog open={removeDialog.open} onClose={() => setRemoveDialog({ open: false, tagId: 0 })}>
                <DialogTitle>
                    Remove tag?
                </DialogTitle>
                <DialogContent>
                    Are you sure you want to remove this tag?<br />
                    <Button variant="outlined" onClick={() => { removeTag(removeDialog.tagId); }}
                        style={{ backgroundColor: 'darkorange' }}
                    >
                        Yes
                    </Button>
                    <Button variant="outlined" onClick={() => setRemoveDialog({ open: false, tagId: 0 })}
                        style={{ backgroundColor: '#2FD' }}
                    >
                        No
                    </Button>
                </DialogContent>
            </Dialog>
        </>
    );
};

export { AlbumTags };