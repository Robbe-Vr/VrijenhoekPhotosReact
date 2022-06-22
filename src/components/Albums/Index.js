import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import { Button, CircularProgress, Grid, Typography, Divider } from "@material-ui/core";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faPlus, faTimes, faArrowAltCircleLeft, faArrowAltCircleRight, faChevronDown, faChevronUp, faSearch } from "@fortawesome/free-solid-svg-icons";

import Album from "../../models/Album";
import { UserInputComponent } from "../Global/UserInputComponent";
import { useNotifications } from "../Global/NotificationContext";
import { PhotoContainer } from "../Home/PhotoContainer";
import { UserSelectInputComponent } from "../Global/UserSelectInputComponent";
import { AlbumContainer } from "./AlbumContainer";
import { Pagination } from "../Global/Pagination";
import { AlbumDetailDialog } from "./AlbumDetailDialog";


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

export default function AlbumsPage({ setTitle, Api, renderMobile }) {
    useEffect(() => {
        setTitle && setTitle("Albums");
    });

    const classes = useStyles();

    const history = useHistory();

    const { error, warning, success } = useNotifications();

    const [loaded, setLoaded] = useState(false);

    const [nameFilter, setNameFilter] = useState('');

    const [sorting, setSorting] = useState(2);

    const [ownedAlbumsPage, setOwnedAlbumsPage] = useState(1);
    const [ownedAlbumsMaxPages, setOwnedAlbumsMaxPages] = useState(1);
    const [ownedAlbumsCount, setOwnedAlbumsCount] = useState(0);

    const [ownedAlbumsRpp, setOwnedAlbumsRpp] = useState(10);

    useEffect(() => {
        let pages = parseInt(ownedAlbumsCount / ownedAlbumsRpp);
        if (ownedAlbumsCount % ownedAlbumsRpp > 0) pages++;

        setOwnedAlbumsMaxPages(pages);
    },[ownedAlbumsRpp, ownedAlbumsCount]);

    useEffect(() => {
        Api.GetUsersOwnedAlbumsCount(nameFilter).then((res) => {
            if (res instanceof String || typeof res == 'string') {
                warning('Failed to get count of owned albums!');
            }
            else if (res.status && res.status != 200) {
                if (res.detail) {
                    warning(`Sorry! ${res.detail}`);
                }
                else warning(`Failed to get count of owned albums!`);
                console.log('Failed to get count of owned albums!', res);
            }
            else {
                let pages = parseInt(res / 10);
                if (res % 10 > 0) pages++;

                setOwnedAlbumsMaxPages(pages);
                setOwnedAlbumsCount(res);
            }
        });
    }, [Api, nameFilter]);

    const [albums, setAlbums] = useState([]);

    useEffect(() => {
        Api.GetUsersOwnedAlbums(ownedAlbumsPage, ownedAlbumsRpp, nameFilter, sorting).then((res) => {
            if (res instanceof String || typeof res == 'string') {
                error('Failed to load albums!');
            }
            else if (res.status && res.status != 200) {
                if (res.detail) {
                    error(`Sorry! ${res.detail}`);
                }
                else error(`Failed to load albums!`);
                console.log('Failed to load albums!', res);
            }
            else {
                setAlbums(res);
            }
            setLoaded(true);
        });
    }, [Api, ownedAlbumsPage, ownedAlbumsRpp, nameFilter, sorting]);

    const [otherAlbumsPage, setOtherAlbumsPage] = useState(1);
    const [otherAlbumsMaxPages, setOtherAlbumsMaxPages] = useState(1);
    const [otherAlbumsCount, setOtherAlbumsCount] = useState(0);

    const [otherAlbumsRpp, setOtherAlbumsRpp] = useState(10);

    useEffect(() => {
        let pages = parseInt(otherAlbumsCount / otherAlbumsRpp);
        if (otherAlbumsCount % otherAlbumsRpp > 0) pages++;

        setOtherAlbumsMaxPages(pages);
    },[otherAlbumsRpp, otherAlbumsCount]);

    useEffect(() => {
        Api.GetUsersJoinedAlbumsCount(nameFilter).then((res) => {
            if (res instanceof String || typeof res == 'string') {
                warning('Failed to get count of others albums!');
            }
            else if (res.status && res.status != 200) {
                if (res.detail) {
                    warning(`Sorry! ${res.detail}`);
                }
                else warning(`Failed to get count of others albums!`);
                console.log('Failed to get count of others albums!', res);
            }
            else {
                let pages = parseInt(res / 10);
                if (res % 10 > 0) pages++;

                setOtherAlbumsMaxPages(pages);
                setOtherAlbumsCount(res);
            }
        });
    }, [Api, nameFilter]);

    const [otherAlbums, setOtherAlbums] = useState([]);

    useEffect(() => {
        Api.GetUsersJoinedAlbums(otherAlbumsPage, otherAlbumsRpp, nameFilter, sorting).then((res) => {
            if (res instanceof String || typeof res == 'string') {
                warning('Failed to load others albums!');
            }
            else if (res.status && res.status != 200) {
                if (res.detail) {
                    warning(`Sorry! ${res.detail}`);
                }
                else warning(`Failed to load others albums!`);
                console.log('Failed to load others albums!', res);
            }
            else {
                setOtherAlbums(res);
            }
            setLoaded(true);
        });
    }, [Api, otherAlbumsPage, otherAlbumsRpp, nameFilter, sorting]);

    const [newAlbumName, setNewAlbumName] = useState("");

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

    const [availableGroups, setAvailableGroups] = useState([]);
    useEffect(() => {
        Api.GetUsersGroups().then((res) => {
            if (res instanceof String || typeof res == 'string') {
                warning('Unable to load available groups!');
            }
            else if (res.status && res.status != 200) {
                if (res.detail) {
                    error(`Sorry! ${res.detail}`);
                }
                else error(`Failed to load available groups!`);
                console.log(`Failed to load available groups!`, res);
            }
            else {
                setAvailableGroups(res);
            }
        });
    }, [Api]);

    const addToGroup = (groupId, albumId) => {
        Api.AddAlbumToGroup(groupId, albumId).then((res) => {
            if (res instanceof String || typeof res == 'string') {
                error('Failed to add album to group!');
            }
            else if (res.status != 200) {
                if (res.detail) {
                    error(`Sorry! ${res.detail}`);
                }
                else error(`Failed to add album to group!`);
                console.log(`Failed to add album to group!`, res);
            }
            else {
                success('Album is added to your group.');
            }
            setShowCheckbox(false);
            setCheckedItems([]);
        });
    }

    const createNewAlbum = () => {
        Api.CreateAlbum(newAlbumName).then((res) => {
            if (res instanceof String || typeof res == 'string') {
                error("Failed to create album!");
            }
            else if (res.status != 200) {
                if (res.detail) {
                    error(`Sorry! ${res.detail}`);
                }
                else error(`Failed to create album!`);
                console.log(`Failed to create album!`, res);
            }
            else {
                success("Album was created!");
                var item = res.data;
                var newAlbum = new Album(item.id, item.name, item.photos, item.groups, item.user);
                var moddedAlbum = { ...newAlbum, photo: newAlbum.IconPhoto }

                var newAlbums = [...albums];
                newAlbums.push(moddedAlbum);
                setAlbums(newAlbums);
            }
        });
    }

    const selectAlbum = (album) => {
        history.push('/albums/' + album.Id);
    }

    const [detailDialogId, setDetailDialogId] = useState(0);

    const contextMenu = (album) => {
        setDetailDialogId(album.Id || 0);
    };

    const [filterTabOpen, setFilterTabOpen] = useState(false);

    if (!loaded) {
        return (
            <div className={classes.form} style={{ height: window.innerHeight * 0.8 }}>
                <Grid style={{ color: 'white', height: '100%', margin: 'auto', verticalAlign: 'middle' }}>
                    <Typography variant="h6">Loading albums...</Typography>
                    <CircularProgress size={75} style={{ marginTop: '10%', verticalAlign: 'middle', color: '#22DDFF' }} />
                </Grid>
            </div>
        );
    }

    return (
        <div className={classes.form} style={{ height: '100%', overflowY: 'auto' }}>
            <Grid style={{ width: '100%', minHeight: renderMobile ? filterTabOpen ? '100%' : '20%' : '25%', maxHeight: renderMobile ? filterTabOpen ? '100%' : '20%' : '50%', overflow: 'auto', boxShadow: 'inset 0px -7px 5px rgba(0 0 0 / 30%), inset 0px 7px 5px rgba(0 0 0 / 30%)', padding: '20px', border: 'solid 1px white', borderRadius: '1rem', overflowY: 'hidden' }}>
                {renderMobile ?
                    filterTabOpen ?
                    <>
                        <Grid style={{ display: 'inline-block', width: '50%', height: '90%' }}>
                            <Grid style={{ width: renderMobile ? '100%' : '60%', height: '20%', display: 'inline-block', padding: '10px' }}>
                                <UserInputComponent
                                    style={{ color: 'white', borderColor: 'white', height: '90%' }}
                                    inputProps={{
                                        style: {
                                            color: 'white', backgroundColor: '#555555',
                                        }
                                    }}
                                    name="Album Name"
                                    onChange={(value) => { setNewAlbumName(value); }}
                                />
                            </Grid>
                            <Button variant="outlined" style={{ color: 'white', borderColor: 'white', backgroundColor: '#22AABB', textTransform: 'none', display: 'inline-block', margin: '5px', verticalAlign: 'middle' }}
                                onClick={() => { createNewAlbum(); }}
                            >
                                <Typography variant="h7"><FontAwesomeIcon icon={faPlus} style={{ marginRight: '5px' }} />Create Album</Typography>
                            </Button>
                        </Grid>
                        <Grid style={{ display: 'inline-block', width: '30%', height: '90%' }}>
                            <Grid style={{ width: '25%', display: 'inline-block', padding: '5px', color: 'white' }}>
                                <Button variant="outlined"
                                    onClick={() => toggleCheckboxes()}
                                    style={{ backgroundColor: showCheckbox ? '#DD4422' : '#22DD44', textTransform: 'none' }}
                                >
                                    {showCheckbox ? <><FontAwesomeIcon icon={faTimes} style={{ marginRight: '5px' }} />Hide</> : <><FontAwesomeIcon icon={faCheck} style={{ marginRight: '5px' }} />Show</>} Checkboxes
                                </Button>
                            </Grid>
                            {showAddSelectionButton > 0 ?
                                <Grid style={{ width: '50%', display: 'inline-block', padding: '5px', color: 'white' }}>
                                    Add selection to group:
                                    <UserSelectInputComponent name="Add to group"
                                        style={{ backgroundColor: '#4466FF' }}
                                        options={Array.isArray(availableGroups) ? availableGroups.map(group => {
                                            return {
                                                id: group.Id,
                                                name: group.Name,
                                                value: group.Id,
                                            };
                                        }) : []}
                                        onChange={(value) => {
                                            checkedItems.forEach(albumId => {
                                                addToGroup(value, albumId);
                                            });
                                        }}
                                    />
                                </Grid>
                            : <></>}
                        </Grid>
                        <Grid style={{ display: 'inline-block', width: '30%', height: '90%', verticalAlign: 'top' }}>
                            <Grid style={{ height: '50%' }}>
                                <Grid style={{ display: 'inline-block', width: '10%', height: '100%'}}>
                                    <FontAwesomeIcon icon={faSearch} size={renderMobile ? '1x' : "2x"} style={{ color: 'white' }} />
                                </Grid>
                                <Grid style={{ display: 'inline-block', width: '90%', height: '100%', verticalAlign: 'top' }}>
                                    <UserInputComponent name="Search" onChange={(value) => { setNameFilter(value); }} />
                                </Grid>
                            </Grid>
                            <Grid style={{ height: '50%' }}>
                                <Grid style={{ display: 'inline-block', width: '100%', height: '100%', verticalAlign: 'top' }}>
                                    <UserSelectInputComponent name="Sort"
                                        style={{ backgroundColor: '#444', '& label': { color: 'white' } }}
                                        onChange={(value) => { setSorting(value); }}
                                        value={sorting}
                                        defaultValue={sorting}
                                        options={[
                                            { id: 'Alphabet', name: 'Alphabet', value: 0 },
                                            { id: 'Inverted_Alphabet', name: 'Inverted Alphabet', value: 1 },
                                            { id: 'Newest_Oldest', name: 'Newest -> Oldest', value: 2 },
                                            { id: 'Oldest_Newest', name: 'Oldest -> Newest', value: 3 },
                                        ]}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Button
                            style={{ display: 'inline-block', width: '100%', height: '10%' }}
                            onClick={() => setFilterTabOpen(false)}
                        >
                            <FontAwesomeIcon icon={faChevronUp} style={{ color: 'white' }} />
                        </Button>
                    </>
                    :
                    <Button
                        style={{ display: 'inline-block', width: '100%', height: '100%' }}
                        onClick={() => setFilterTabOpen(true)}
                    >
                        <FontAwesomeIcon icon={faChevronDown} style={{ color: 'white' }} />
                    </Button>
                :
                    <>
                        <Grid style={{ display: 'inline-block', width: '25%', height: '100%', verticalAlign: 'middle' }}>
                            <Grid style={{ height: '100%', display: 'inline-block', marginLeft: '10px' }}>
                                <UserInputComponent
                                    style={{ color: 'white', borderColor: 'white', height: '100%', width: '100%' }}
                                    inputProps={{
                                        style: {
                                            color: 'white', backgroundColor: '#555555',
                                        }
                                    }}
                                    name="Album Name"
                                    onChange={(value) => { setNewAlbumName(value); }}
                                />
                            </Grid>
                            <Button variant="outlined" style={{ height: '100%', color: 'white', borderColor: 'white', backgroundColor: '#22AABB', textTransform: 'none', display: 'inline-block', marginLeft: '10px', verticalAlign: 'middle' }}
                                onClick={() => { createNewAlbum(); }}
                            >
                                <Typography variant="h7"><FontAwesomeIcon icon={faPlus} style={{ marginRight: '5px' }} />Create Album</Typography>
                            </Button>
                        </Grid>
                        <Grid style={{ display: 'inline-block', width: '30%', height: '100%' }}>
                            <Grid style={{ width: '25%', display: 'inline-block', margin: '5px', color: 'white' }}>
                                <Button variant="outlined"
                                    onClick={() => toggleCheckboxes()}
                                    style={{ backgroundColor: showCheckbox ? '#DD4422' : '#22DD44', textTransform: 'none' }}
                                >
                                    {showCheckbox ? <><FontAwesomeIcon icon={faTimes} style={{ marginRight: '5px' }} />Hide</> : <><FontAwesomeIcon icon={faCheck} style={{ marginRight: '5px' }} />Show</>} Checkboxes
                                </Button>
                            </Grid>
                            {showAddSelectionButton > 0 ?
                                <Grid style={{ width: '50%', display: 'inline-block', margin: '5px', color: 'white' }}>
                                    Add selection to group:
                                    <UserSelectInputComponent name="Add to group"
                                        style={{ backgroundColor: '#4466FF' }}
                                        options={Array.isArray(availableGroups) ? availableGroups.map(group => {
                                            return {
                                                id: group.Id,
                                                name: group.Name,
                                                value: group.Id,
                                            };
                                        }) : []}
                                        onChange={(value) => {
                                            checkedItems.forEach(albumId => {
                                                addToGroup(value, albumId);
                                            });
                                        }}
                                    />
                                </Grid>
                            : <></>}
                        </Grid>
                        <Grid style={{ display: 'inline-block', width: '30%', height: '90%', verticalAlign: 'top' }}>
                            <Grid style={{ height: '50%', paddingBottom: '5px' }}>
                                <Grid style={{ display: 'inline-block', width: '10%', height: '100%'}}>
                                    <FontAwesomeIcon icon={faSearch} size="2x" style={{ color: 'white' }} />
                                </Grid>
                                <Grid style={{ display: 'inline-block', width: '90%', height: '100%', verticalAlign: 'top' }}>
                                    <UserInputComponent name="Search" onChange={(value) => { setNameFilter(value); }} />
                                </Grid>
                            </Grid>
                            <Grid style={{ height: '50%' }}>
                                <Grid style={{ display: 'inline-block', width: '100%', height: '100%', verticalAlign: 'top' }}>
                                    <UserSelectInputComponent name="Sort"
                                        style={{ backgroundColor: '#444', '& label': { color: 'white' } }}
                                        onChange={(value) => { setSorting(value); }}
                                        value={sorting}
                                        defaultValue={sorting}
                                        options={[
                                            { id: 'Alphabet', name: 'Alphabet', value: 0 },
                                            { id: 'Inverted_Alphabet', name: 'Inverted Alphabet', value: 1 },
                                            { id: 'Newest_Oldest', name: 'Newest -> Oldest', value: 2 },
                                            { id: 'Oldest_Newest', name: 'Oldest -> Newest', value: 3 },
                                        ]}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </>
            }
            </Grid>
            <Grid style={{ width: '100%', color: '#2DF', margin: "auto", marginTop: '10px' }}>
                Your Albums
                <Divider style={{ width: '100%', backgroundColor: '#2DF' }}></Divider>
            </Grid>
            <Grid style={{ width: '100%', minHeight: '45%', overflow: 'auto', borderBottom: 'solid 1px #2DF', boxShadow: 'inset 0px -7px 5px rgba(0 0 0 / 30%), inset 0px 7px 5px rgba(0 0 0 / 30%)', paddingTop: '20px', paddingLeft: '20px' }}>
                <Pagination page={ownedAlbumsPage} maxPages={ownedAlbumsMaxPages} onChangePage={(newPage) => setOwnedAlbumsPage(newPage)} rpp={ownedAlbumsRpp} count={ownedAlbumsCount} onChangeRpp={(newRpp) => setOwnedAlbumsRpp(newRpp)} />
                {!Array.isArray(albums) || albums.length < 1 ? <Typography style={{ color: 'white' }}>You do not have any albums.</Typography> :
                    albums.map((album, index) => {
                        var item = {
                            ...album,
                            AlbumId: album.Id,
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
                                    onContext={(albumWithPhotoData) => {
                                        contextMenu(album);
                                    }}
                                    onClick={(albumWithPhotoData) => {
                                        selectAlbum(album);
                                    }}
                                />
                                <AlbumDetailDialog show={detailDialogId == album.Id} item={album} Api={Api} onClose={(e, reason) => { if (reason == 'invalid item') { warning('Unable to load album!') } setDetailDialogId(0); }} />
                            </>
                        );
                    })
                }
                <Pagination page={ownedAlbumsPage} maxPages={ownedAlbumsMaxPages} onChangePage={(newPage) => setOwnedAlbumsPage(newPage)} rpp={ownedAlbumsRpp} count={ownedAlbumsCount} onChangeRpp={(newRpp) => setOwnedAlbumsRpp(newRpp)} />
            </Grid>
            <Grid style={{ width: '100%', color: '#2DF', margin: "auto", marginTop: '10px', marginBottom: '10px' }}>
                Other Albums From Your Groups
                <Divider style={{ width: '100%', backgroundColor: '#2DF' }}></Divider>
            </Grid>
            <Grid style={{ width: '100%', minHeight: '45%', overflow: 'auto', paddingTop: '20px', borderBottom: 'solid 1px #2DF', boxShadow: 'inset 0px -7px 5px rgba(0 0 0 / 30%), inset 0px 7px 5px rgba(0 0 0 / 30%)', paddingLeft: '20px' }}>
                <Pagination page={otherAlbumsPage} maxPages={otherAlbumsMaxPages} onChangePage={(newPage) => setOtherAlbumsPage(newPage)} rpp={otherAlbumsRpp} count={otherAlbumsCount} onChangeRpp={(newRpp) => setOtherAlbumsRpp(newRpp)} />
                {!Array.isArray(otherAlbums) || otherAlbums.length < 1 ? <Typography style={{ color: 'white' }}>No albums found in your groups.</Typography> :
                    otherAlbums.map((album, index) => {
                        var item = {
                            ...album,
                            AlbumId: album.Id,
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
                                <AlbumDetailDialog show={detailDialogId == album.Id} item={album} Api={Api} onClose={(e, reason) => { if (reason == 'invalid item') { warning('Unable to load album!') } setDetailDialogId(0); }} />
                            </>
                        );
                    })
                }
                <Pagination page={otherAlbumsPage} maxPages={otherAlbumsMaxPages} onChangePage={(newPage) => setOtherAlbumsPage(newPage)} rpp={otherAlbumsRpp} count={otherAlbumsCount} onChangeRpp={(newRpp) => setOtherAlbumsRpp(newRpp)} />
            </Grid>
        </div>
    );
};