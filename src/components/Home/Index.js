import React, { useEffect, useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import { Button, CircularProgress, Grid, Typography } from "@material-ui/core";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowAltCircleLeft, faArrowAltCircleRight, faCheck, faChevronDown, faChevronUp, faImages, faSearch, faTimes, faUpload, } from "@fortawesome/free-solid-svg-icons";

import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useNotifications } from "../Global/NotificationContext";
import { PhotoContainer } from "./PhotoContainer";
import { UserSelectInputComponent } from "../Global/UserSelectInputComponent";
import SlideShow from "../Global/SlideShow";
import ImageDisplay from "../Global/ImageDisplay";
import { Pagination } from "../Global/Pagination";
import { PhotoDetailDialog } from "./PhotoDetailDialog";
import { UserInputComponent } from "../Global/UserInputComponent";


const useStyles = makeStyles(() => ({
    form: {
        width: '95%',
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

export default function HomePage({ setTitle, Api, renderMobile }) {
    useEffect(() => {
        setTitle && setTitle("Photos");
    });

    const classes = useStyles();

    const { error, warning, success } = useNotifications();

    const history = useHistory();

    const [loaded, setLoaded] = useState(false);

    const [nameFilter, setNameFilter] = useState('');

    const [sorting, setSorting] = useState(2);

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
        Api.GetUsersPhotosCount(nameFilter).then((res) => {
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
                setPhotoCount(res);
            }
        });
    }, [Api, nameFilter]);

    const [photos, setPhotos] = useState([]);

    useEffect(() => {
        Api.GetUsersPhotos(page, rpp, nameFilter, sorting).then((res) => {
            if (res instanceof String || typeof res == 'string') {
                error('Failed to load photos!');
            }
            else if (res.status && res.status != 200) {
                if (res.detail) {
                    error(`Sorry! ${res.detail}`);
                }
                else error(`Failed to load photos!`);
                console.log('Failed to load photos!', res);
            }
            else {
                setPhotos(res);
            }

            setLoaded(true);
        }).catch(() => { setLoaded(true); });
    }, [Api, page, rpp, nameFilter, sorting]);

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

    const selectAll = () => {
        var ids = [];
        photos.forEach((photo) =>
        {
            ids.push(photo.Id);
        });

        setCheckedItems(ids);
    };

    useEffect(() => {
        setCheckedItems([]);
    }, [page]);

    const [toggleSlideShow, setToggleSlideShow] = useState(false);

    const [availableAlbums, setAvailableAlbums] = useState([]);
    useEffect(() => {
        Api.GetUsersAlbums().then((res) => {
            if (res instanceof String || typeof res == 'string') {
                warning('Unable to load available albums!');
            }
            else if (res.status && res.status != 200) {
                if (res.detail) {
                    error(`Sorry! ${res.detail}`);
                }
                else error(`Unable to load available albums!`);
                console.log('Unable to load available albums!', res);
            }
            else {
                setAvailableAlbums(res);
            }
        });
    }, [Api]);

    const [selectedAlbum, setSelectedAlbum] = useState(0);

    const addToAlbum = (albumId, photoId) => {
        Api.AddPhotoToAlbum(photoId, albumId).then((res) => {
            if (res instanceof String || typeof res == 'string') {
                error('Failed to add photo to album!');
            }
            else if (res.status && res.status != 200) {
                if (res.detail) {
                    error(`Sorry! ${res.detail}`);
                }
                else error(`Failed to add photo to album!`);
                console.log(`Failed to add photo to album!`, res);
            }
            else {
                success('Photo is added to your album.');
            }
        });
    }

    useEffect(() => {
        if (selectedAlbum == 0) return;

        checkedItems.forEach(photoId => {
            addToAlbum(selectedAlbum, photoId);
        });

        setSelectedAlbum(0);
    }, [selectedAlbum]);

    const uploadPhoto = () => {
        history.push('/upload');
    };

    const [filterTabOpen, setFilterTabOpen] = useState(false);

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
        <div className={classes.form} style={{ height: '100%', overflowY: 'auto' }}>
            <Grid style={{ width: '100%', minHeight: renderMobile ? filterTabOpen ? '100%' : '20%' : '25%', maxHeight: renderMobile ? filterTabOpen ? '100%' : '20%' : '50%', overflow: 'auto', boxShadow: 'inset 0px -7px 5px rgba(0 0 0 / 30%), inset 0px 7px 5px rgba(0 0 0 / 30%)', padding: '20px', border: 'solid 1px white', borderRadius: '1rem', overflowY: 'hidden' }}>
                {renderMobile ?
                    filterTabOpen ?
                    <>
                        <Grid style={{ display: 'inline-block', width: '25%', height: '90%' }}>
                            <Button variant="outlined" style={{ color: 'white', borderColor: 'white', backgroundColor: '#22AABB', textTransform: 'none', display: 'block', margin: '5px'  }}
                                onClick={() => { uploadPhoto(); }}
                            >
                                <Typography variant="h7"><FontAwesomeIcon icon={faUpload} style={{ marginRight: '5px' }} />Add Photo</Typography>
                            </Button>
                            <Button variant="outlined" style={{ color: 'white', borderColor: 'white', backgroundColor: '#22AABB', textTransform: 'none', display: 'block', margin: '5px' }}
                                onClick={() => { setToggleSlideShow(true); }}
                            >
                                <Typography variant="h7"><FontAwesomeIcon icon={faImages} style={{ marginRight: '5px' }} />Slide Show</Typography>
                            </Button>
                        </Grid>
                        <Grid style={{ display: 'inline-block', width: '35%', height: '90%' }}>
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
                        <Button variant="outlined" style={{ color: 'white', borderColor: 'white', backgroundColor: '#22AABB', textTransform: 'none', display: 'block', margin: '5px'  }}
                            onClick={() => { uploadPhoto(); }}
                        >
                            <Typography variant="h7"><FontAwesomeIcon icon={faUpload} style={{ marginRight: '5px' }} />Add Photo</Typography>
                        </Button>
                        <Button variant="outlined" style={{ color: 'white', borderColor: 'white', backgroundColor: '#22AABB', textTransform: 'none', display: 'block', margin: '5px' }}
                            onClick={() => { setToggleSlideShow(true); }}
                        >
                            <Typography variant="h7"><FontAwesomeIcon icon={faImages} style={{ marginRight: '5px' }} />Slide Show</Typography>
                        </Button>
                    </Grid>
                    <Grid style={{ display: 'inline-block', width: '35%', height: '100%' }}>
                        <Grid style={{ width: '25%', display: 'inline-block', color: 'white', paddingRight: '10px' }}>
                            <Button variant="outlined"
                                onClick={() => toggleCheckboxes()}
                                style={{ backgroundColor: showCheckbox ? '#DD4422' : '#22DD44', textTransform: 'none', width: '100%', margin: '5px' }}
                            >
                                {showCheckbox ? <><FontAwesomeIcon icon={faTimes} style={{ marginRight: '5px' }} />Hide</> : <><FontAwesomeIcon icon={faCheck} style={{ marginRight: '5px' }} />Show</>} Checkboxes
                            </Button>
                            {showCheckbox ?
                                <Button variant="outlined"
                                    onClick={() => selectAll()}
                                    style={{ backgroundColor: '#2DF', textTransform: 'none', width: '100%', margin: '5px' }}
                                >
                                    Select All
                                </Button>
                                : <></>
                            }
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
            <Grid style={{ width: '100%', height: '100%', overflow: 'auto', boxShadow: 'inset 0px -7px 5px rgba(0 0 0 / 30%), inset 0px 7px 5px rgba(0 0 0 / 30%)', padding: '20px', marginBottom: '10px', marginTop: '10px', overflowY: 'auto' }}>
                <Pagination page={page} maxPages={maxPages} onChangePage={(newPage) => setPage(newPage)} rpp={rpp} count={photoCount} onChangeRpp={(newRpp) => setRpp(newRpp)} />
                {!Array.isArray(photos) || photos.length < 1 ? <Typography style={{ color: 'white' }}>You do not have any photos.</Typography> :
                    photos.map((photo, index) => {
                        return (
                            <>
                                <PhotoContainer
                                    item={photo}
                                    Api={Api}
                                    showCheckbox={showCheckbox}
                                    checkedItems={checkedItems}
                                    onChecked={(photoWithData, checkedState) => {
                                        checked(photo, checkedState);
                                    }}
                                    onContext={(photoWithData) => {
                                        contextMenu(photo);
                                    }}
                                    onClick={(photoWithData) => {
                                        selectPhoto(photoWithData);
                                    }}
                                />
                                <PhotoDetailDialog show={detailDialogId == photo.Id} item={photo} Api={Api} onClose={(e, reason) => { if (reason == 'invalid item') { warning('Unable to load photo!') } setDetailDialogId(0); }}
                                    onDeleted={(deletedItem) =>
                                        {
                                            var newPhotos = [...photos];

                                            let index = newPhotos.indexOf(deletedItem) || newPhotos.findIndex(x => x.Id == deletedItem.Id);
                                            
                                            if (index > -1)
                                            {
                                                newPhotos.splice(index, 1);

                                                setPhotos(newPhotos);

                                                let newPhotoCount = photoCount - 1;
                                                setPhotoCount(newPhotoCount);

                                                let pages = parseInt(res / rpp);
                                                if (res % rpp > 0) pages++;
                                                setMaxPages(pages);
                                            }

                                            setDetailDialogId(0);
                                        }}
                                />
                            </>
                        );
                    })
                }
                <Pagination page={page} maxPages={maxPages} onChangePage={(newPage) => setPage(newPage)} rpp={rpp} count={photoCount} onChangeRpp={(newRpp) => setRpp(newRpp)} />
            </Grid>

            <SlideShow photos={photos} active={toggleSlideShow} onClose={() => { setToggleSlideShow(false); }} Api={Api} />
            
            <ImageDisplay onClose={() => { setSelectedPhoto({ open: false }) }} selectedPhoto={selectedPhoto} Api={Api} />
        </div>
    );
};