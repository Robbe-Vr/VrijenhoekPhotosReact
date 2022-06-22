import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import { Button, CircularProgress, Grid, Typography } from "@material-ui/core";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faChevronDown, faChevronUp, faImages, faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { PhotoContainer } from "../Home/PhotoContainer";
import SlideShow from "../Global/SlideShow";
import ImageDisplay from "../Global/ImageDisplay";
import { useNotifications } from "../Global/NotificationContext";
import { PhotoDetailDialog } from "../Home/PhotoDetailDialog";
import { UserSelectInputComponent } from "../Global/UserSelectInputComponent";
import { UserInputComponent } from "../Global/UserInputComponent";
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

export default function AlbumShowcase({ setTitle, Api, renderMobile }) {
    const { albumId } = useParams();

    const classes = useStyles();

    const { success, warning, error } = useNotifications();

    const [loaded, setLoaded] = useState(false);

    const [album, setAlbum] = useState({});

    useEffect(() => {
        setTitle && setTitle("Album: " + album?.Name || "Unknown");
    }, [setTitle, album]);

    useEffect(() => {
        Api.GetAlbum(albumId).then((res) => {
            if (res instanceof String || typeof res == 'string') {
                error('Failed to load album!');
            }
            else if (res.status && res.status != 200) {
                if (res.detail) {
                    error(`Sorry! ${res.detail}`);
                }
                else error(`Failed to load album!`);
                console.log(`Failed to load album!`, res);
            }
            else {
                setAlbum(res);
            }

            setLoaded(true);
        }).catch(() => { setLoaded(true); });
    }, [Api, albumId]);

    const [nameFilter, setNameFilter] = useState('');

    const [sorting, setSorting] = useState(2);

    const [photos, setPhotos] = useState([]);

    const [page, setPage] = useState(1);
    const [maxPages, setMaxPages] = useState(1);
    const [photoCount, setPhotoCount] = useState(0);

    const [rpp, setRpp] = useState(10);

    useEffect(() => {
        let pages = parseInt(photoCount / rpp);
        if (photoCount % rpp > 0) pages++;

        setMaxPages(pages);
    },[rpp, photoCount]);

    useEffect(() => {
        Api.GetPhotosFromAlbum(albumId, page, rpp, nameFilter, sorting).then((res) => {
            if (res instanceof String || typeof res == 'string') {
                error('Failed to load photos!');
            }
            else if (res.status && res.status != 200) {
                error(`Failed to load photos! ${res.detail}`);
                console.log(`Failed to load photos!`, res);
            }
            else {
                setPhotos(res);
            }

            setLoaded(true);
        }).catch(() => { setLoaded(true); });
    }, [Api, albumId, page, rpp, nameFilter, sorting]);

    useEffect(() => {
        Api.GetPhotosFromAlbumCount(albumId, nameFilter).then((res) => {
            if (res instanceof String || typeof res == 'string') {
                warning('Failed to get count of photos!');
            }
            else if (res.status && res.status != 200) {
                if (res.detail) {
                    warning(`Sorry! ${res.detail}`);
                }
                else warning(`Failed to get count of photos!`);
                console.log('Failed to get count of photos!', res);
            }
            else {
                let pages = parseInt(res / rpp);
                if (res % rpp > 0) pages++;

                setMaxPages(pages);
                setPhotoCount(res);
            }
        });
    }, [Api, albumId, nameFilter]);

    const [selectedPhoto, setSelectedPhoto] = useState({ open: false });

    const selectPhoto = (photo) => {
        setSelectedPhoto({
            ...photo,
            open: true,
        });
    };

    const [detailDialogId, setDetailDialogId] = useState(0);

    const contextMenu = (photo) => {
        setDetailDialogId(photo.Id || 0);
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

    const checked = (photo, isChecked) => {
        if (isChecked) {
            var newCheckedItems = [...checkedItems];
            newCheckedItems.push(photo.Id);
            setCheckedItems(newCheckedItems);
        } else {
            var newCheckedItems = [...checkedItems];
            var index
            if ((index = newCheckedItems.indexOf(photo.Id)) > -1) {
                newCheckedItems.splice(index, 1);

                setCheckedItems(newCheckedItems);
            }
        }
    }

    const [filterTabOpen, setFilterTabOpen] = useState(false);

    const [toggleSlideShow, setToggleSlideShow] = useState(false);

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
            {renderMobile ?
                    filterTabOpen ?
                    <>
                        <Grid style={{ display: 'inline-block', width: '25%', height: '90%' }}>
                            <Button variant="outlined" style={{ color: 'white', borderColor: 'white', backgroundColor: '#22AABB', textTransform: 'none', display: 'block', margin: '5px' }}
                                onClick={() => { setToggleSlideShow(true); }}
                            >
                                <Typography variant="h7"><FontAwesomeIcon icon={faImages} style={{ marginRight: '5px' }} />Slide Show</Typography>
                            </Button>
                        </Grid>
                        <Grid style={{ display: 'inline-block', width: '35%', height: '90%' }}>
                            <Grid style={{ width: '50%', display: 'inline-block', margin: '5px', color: 'white' }}>
                                <Button variant="outlined"
                                    onClick={() => toggleCheckboxes()}
                                    style={{ backgroundColor: showCheckbox ? '#DD4422' : '#22DD44', textTransform: 'none' }}
                                >
                                    {showCheckbox ? <><FontAwesomeIcon icon={faTimes} style={{ marginRight: '5px' }} />Hide</> : <><FontAwesomeIcon icon={faCheck} style={{ marginRight: '5px' }} />Show</>} Checkboxes
                                </Button>
                            </Grid>
                            {showAddSelectionButton > 0 ?
                                <Grid style={{ width: '50%', display: 'inline-block', margin: '5px', color: 'white' }}>
                                    Add selection to album:
                                    <UserSelectInputComponent name="Add to album"
                                        style={{ backgroundColor: '#4466FF' }}
                                        options={Array.isArray(availableAlbums) ? availableAlbums.map(album => {
                                            return {
                                                id: album.id,
                                                name: album.Name,
                                                value: album.Id,
                                            };
                                        }) : []}
                                        value={selectedAlbum}
                                        onChange={(value) => {
                                            if (value == 0) return;
                                            setSelectedAlbum(value);
                                        }}
                                    />
                                </Grid>
                            : <></>}
                        </Grid>
                        <Grid style={{ display: 'inline-block', width: '30%', height: '90%', verticalAlign: 'top' }}>
                            <Grid style={{ height: '50%' }}>
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
                    <Grid style={{ display: 'inline-block', width: '25%', height: '100%' }}>
                        <Button variant="outlined" style={{ color: 'white', borderColor: 'white', backgroundColor: '#22AABB', textTransform: 'none', display: 'block', margin: '5px' }}
                            onClick={() => { setToggleSlideShow(true); }}
                        >
                            <Typography variant="h7"><FontAwesomeIcon icon={faImages} style={{ marginRight: '5px' }} />Slide Show</Typography>
                        </Button>
                    </Grid>
                    <Grid style={{ display: 'inline-block', width: '35%', height: '100%' }}>
                        <Grid style={{ width: '50%', display: 'inline-block', margin: '5px', color: 'white' }}>
                            <Button variant="outlined"
                                onClick={() => toggleCheckboxes()}
                                style={{ backgroundColor: showCheckbox ? '#DD4422' : '#22DD44', textTransform: 'none' }}
                            >
                                {showCheckbox ? <><FontAwesomeIcon icon={faTimes} style={{ marginRight: '5px' }} />Hide</> : <><FontAwesomeIcon icon={faCheck} style={{ marginRight: '5px' }} />Show</>} Checkboxes
                            </Button>
                        </Grid>
                        {showAddSelectionButton > 0 ?
                            <Grid style={{ width: '50%', display: 'inline-block', margin: '5px', color: 'white' }}>
                                Add selection to album:
                                <UserSelectInputComponent name="Add to album"
                                    style={{ backgroundColor: '#4466FF' }}
                                    options={Array.isArray(availableAlbums) ? availableAlbums.map(album => {
                                        return {
                                            id: album.id,
                                            name: album.Name,
                                            value: album.Id,
                                        };
                                    }) : []}
                                    value={selectedAlbum}
                                    onChange={(value) => {
                                        if (value == 0) return;
                                        setSelectedAlbum(value);
                                    }}
                                />
                            </Grid>
                        : <></>}
                    </Grid>
                    <Grid style={{ display: 'inline-block', width: '30%', height: '100%', verticalAlign: 'top' }}>
                        <Grid style={{ height: '50%' }}>
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
            <Grid style={{ width: '100%', minHeight: '50%', maxHeight: '100%', overflow: 'auto', borderBottom: 'solid 1px #2DF', boxShadow: 'inset 0px -7px 5px rgba(0 0 0 / 30%), inset 0px 7px 5px rgba(0 0 0 / 30%)', marginTop: '10px', paddingTop: '20px', paddingLeft: '20px' }}>
                <Pagination page={page} maxPages={maxPages} onChangePage={(newPage) => setPage(newPage)} rpp={rpp} count={photoCount} onChangeRpp={(newRpp) => setRpp(newRpp)} />
                {!Array.isArray(photos) || photos.length < 1 ? <>No photos in this album.</> :
                    photos.map((photo, index) => {
                        return (
                            <>
                                <PhotoContainer
                                    item={photo}
                                    Api={Api}
                                    contentData
                                    showCheckbox={showCheckbox}
                                    onChecked={(sendPhoto, checkedState) => {
                                        checked(photo, checkedState);
                                    }}
                                    onContext={() => {
                                        contextMenu(photo);
                                    }}
                                    onClick={(photo) => {
                                        selectPhoto(photo);
                                    }}
                                />
                                <PhotoDetailDialog show={detailDialogId == photo.Id} item={photo} fromAlbumId={album.Id} fromAlbumOwnerId={album.User?.Id || 0} Api={Api} onClose={(e, reason) => { if (reason == 'invalid item') { warning('Unable to load photo!') } setDetailDialogId(0); }} />
                            </>
                        );
                    })
                }
                <Pagination page={page} maxPages={maxPages} onChangePage={(newPage) => setPage(newPage)} rpp={rpp} count={photoCount} onChangeRpp={(newRpp) => setRpp(newRpp)} />
            </Grid>

            <SlideShow photos={photos || []} active={toggleSlideShow} onClose={() => { setToggleSlideShow(false); }} Api={Api} />

            <ImageDisplay selectedPhoto={selectedPhoto} onClose={() => { setSelectedPhoto({ open: false }) }} Api={Api} />
        </div>
    );
};