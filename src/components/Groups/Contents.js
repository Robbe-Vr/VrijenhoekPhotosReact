import React, { useEffect, useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import { Button, CircularProgress, Grid, Typography } from "@material-ui/core";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faImages, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";
import { AlbumContainer } from "../Albums/AlbumContainer";
import { useNotifications } from "../Global/NotificationContext";
import { AlbumDetailDialog } from "../Albums/AlbumDetailDialog";
import { Pagination } from "../Global/Pagination";


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

export default function GroupContents({ setTitle, Api, renderMobile }) {
    const { groupId } = useParams();

    const { success, warning, error } = useNotifications();

    const classes = useStyles();

    const history = useHistory();

    const [loaded, setLoaded] = useState(false);

    const [group, setGroup] = useState({});

    useEffect(() => {
        setTitle && setTitle("Group: " + group.Name || (loaded ? "Unknown" : "loading..."));
    }, [setTitle, group]);

    useEffect(() => {
        Api.GetGroup(groupId).then((res) => {
            if (res instanceof String || typeof res == 'string') {
                error('Failed to load group!');
            }
            else if (res.status && res.status != 200) {
                error(`Failed to load group! ${res.detail}`);
                console.log(`Failed to load group!`, res);
            }
            else {
                setGroup(res);
            }
        }).catch(() => { });
    }, [Api, groupId]);

    const [nameFilter, setNameFilter] = useState('');

    const [sorting, setSorting] = useState(2);

    const [albums, setAlbums] = useState([]);

    const [page, setPage] = useState(1);
    const [maxPages, setMaxPages] = useState(1);
    const [albumCount, setAlbumCount] = useState(0);

    const [rpp, setRpp] = useState(10);

    useEffect(() => {
        let pages = parseInt(albumCount / rpp);
        if (albumCount % rpp > 0) pages++;

        setMaxPages(pages);
    },[rpp, albumCount]);

    useEffect(() => {
        Api.GetAlbumsFromGroup(groupId, page, rpp, nameFilter, sorting).then((res) => {
            if (res instanceof String || typeof res == 'string') {
                error('Failed to load group!');
            }
            else if (res.status && res.status != 200) {
                error(`Failed to load group! ${res.detail}`);
                console.log(`Failed to load group!`, res);
            }
            else {
                setAlbums(res);
            }

            setLoaded(true);
        }).catch(() => { setLoaded(true); });
    }, [Api, groupId, page, rpp, nameFilter, sorting]);

    useEffect(() => {
        Api.GetAlbumsFromGroupCount(groupId, nameFilter).then((res) => {
            if (res instanceof String || typeof res == 'string') {
                warning('Failed to get count of albums!');
            }
            else if (res.status && res.status != 200) {
                if (res.detail) {
                    warning(`Sorry! ${res.detail}`);
                }
                else warning(`Failed to get count of albums!`);
                console.log('Failed to get count of albums!', res);
            }
            else {
                let pages = parseInt(res / rpp);
                if (res % rpp > 0) pages++;

                setMaxPages(pages);
                setAlbumCount(res);
            }
        });
    }, [Api, groupId, nameFilter]);

    const selectAlbum = (album) => {
        history.push('/albums/' + album.Id);
    };

    const [detailDialogId, setDetailDialogId] = useState(0);

    const contextMenu = (album) => {
        setDetailDialogId(album.Id || 0);
    };

    const [showCheckbox, setShowCheckbox] = useState(false);
    const [checkedItems, setCheckedItems] = useState([]);
    const [showAddSelectionButton, setShowAddSelectionButton] = useState(false);
    const toggleCheckboxes = () => {
        if (showCheckbox) {
            setCheckedItems([]);
        }

        setShowCheckbox(!showCheckbox);
    }

    useEffect(() => {
        setShowAddSelectionButton(checkedItems.length > 0);
    }, [checkedItems, showCheckbox]);

    const checked = (album, isChecked) => {
        if (isChecked) {
            var newCheckedItems = [...checkedItems];
            newCheckedItems.push(album.Id);
            setCheckedItems(newCheckedItems);
        } else {
            var newCheckedItems = [...checkedItems];
            var index
            if ((index = newCheckedItems.indexOf(album.Id)) > -1) {
                newCheckedItems.splice(index, 1);

                setCheckedItems(newCheckedItems);
            }
        }
    }

    if (!loaded) {
        return (
            <div className={classes.form} style={{ height: window.innerHeight * 0.8 }}>
                <Grid style={{ color: 'white', height: '100%', margin: 'auto', verticalAlign: 'middle' }}>
                    <Typography variant="h6">Loading pictures...</Typography>
                    <CircularProgress size={75} style={{ marginTop: '10%', verticalAlign: 'middle', color: '#22DDFF' }} />
                </Grid>
            </div>
        );
    }

    return (
        <div className={classes.form} style={{ height: window.innerHeight * 0.6 }}>
            <Grid style={{ width: '100%', minHeight: '10%', padding: '20px', border: 'solid 1px white', borderRadius: '1rem', overflowY: 'hidden' }}>
                <Grid style={{ display: 'inline-block', width: '50%', height: '100%' }}>
                    <Grid style={{ width: '50%', display: 'inline-block', margin: '5px', color: 'white' }}>
                        <Button variant="outlined"
                            onClick={() => toggleCheckboxes()}
                            style={{ backgroundColor: showCheckbox ? '#DD4422' : '#22DD44' }}
                        >
                            {showCheckbox ? <><FontAwesomeIcon icon={faTimes} style={{ marginRight: '5px' }} />Hide</> : <><FontAwesomeIcon icon={faCheck} style={{ marginRight: '5px' }} />Show</>} Checkboxes
                        </Button>
                    </Grid>
                    {showAddSelectionButton > 0 ?
                        <Grid style={{ width: '50%', display: 'inline-block', margin: '5px', color: 'white' }}>
                            
                        </Grid>
                    : <></>}
                </Grid>
            </Grid>
            <Grid style={{ width: '100%', minHeight: '50%', maxHeight: '90%', overflow: 'auto', borderBottom: 'solid 1px #2DF', boxShadow: 'inset 0px -7px 5px rgba(0 0 0 / 30%), inset 0px 7px 5px rgba(0 0 0 / 30%)', marginTop: '10px', paddingTop: '20px', paddingLeft: '20px' }}>
                <Pagination page={page} maxPages={maxPages} onChangePage={(newPage) => setPage(newPage)} rpp={rpp} count={albumCount} onChangeRpp={(newRpp) => setRpp(newRpp)} />
                {!Array.isArray(albums) ? <>No albums in this group.</> :
                    albums.map((album, index) => {
                        var item = {
                            ...album,
                            Id: album.IconPhoto?.Id || album.Photos[0]?.Id,
                        };

                        return (
                            <>
                                <AlbumContainer
                                    item={item}
                                    Api={Api}
                                    showCheckbox={showCheckbox}
                                    onChecked={(albumWithPhotoData, checkedState) => {
                                        checked(album, checkedState);
                                    }}
                                    onContext={() => {
                                        contextMenu(album);
                                    }}
                                    onClick={() => {
                                        selectAlbum(album);
                                    }}
                                />
                                <AlbumDetailDialog show={detailDialogId == album.Id} item={album} fromGroupId={group?.Id} fromGroupOwnerId={group.Creator?.Id} Api={Api} onClose={(e, reason) => { if (reason == 'invalid item') { warning('Unable to load album!') } setDetailDialogId(0); }} />
                            </>
                        );
                    })
                }
                <Pagination page={page} maxPages={maxPages} onChangePage={(newPage) => setPage(newPage)} rpp={rpp} count={albumCount} onChangeRpp={(newRpp) => setRpp(newRpp)} />
            </Grid>
        </div>
    );
};