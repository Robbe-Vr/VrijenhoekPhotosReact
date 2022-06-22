import { faArrowAltCircleLeft, faArrowAltCircleRight, faClock, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, CircularProgress, Dialog, Grid, Slider, Typography } from "@material-ui/core";

import { Video as VideoHost } from "./Video";
import { Image } from "./Image";

import React, { useEffect, useState } from "react";
import { useNotifications } from "./NotificationContext";

export default function SlideShow({ photos, active = false, Api, onClose }) {

    const { warning } = useNotifications();

    useEffect(() => {
        if (active)
            startSlideShow();
        else if (slideShow.show)
            stopSlideShow();
    }, [active]);

    const [slideShow, setSlideShow] = useState({ show: false });
    const [slideShowPhoto, setSlideShowPhoto] = useState({ index: 0 });
    const [slideShowInterval, setSlideShowInterval] = useState(3);
    const [slideShowLoading, setSlideShowLoading] = useState(false);

    const startSlideShow = (list) => {
        let index = slideShowPhoto.index;
        list = Array.isArray(list) ? list : [...photos];

        setSlideShowLoading(true);

        Api.GetImage(list[index].Id).then((imgData) => {
            if (imgData instanceof String || typeof imgData == 'string') {
                
                warning(`Failed to load image: '${list[index].Name}'`);
            
                setSlideShowPhoto({ photo: { photo: list[index], contentUrl: '' }, index });
            }
            else if (imgData.status && imgData.status != 200) {
                error(`Failed to load image: '${list[index].Name}'! ${imgData.title}`);
                console.log(`Failed to load image: '${list[index].Name}'!`, res);
            }
            else {

                if (!imgData || !imgData.type || !imgData.base64)
                {
                    setSlideShowPhoto({ photo: { photo: list[index], contentUrl: !imgData?.base64 ? imgData.base64 : '' }, index });
                }
                else {
                    setSlideShowPhoto({ photo: { photo: list[index], contentUrl: `data:${imgData.type};base64,${imgData.base64}` }, index });
                }
            }

            setSlideShow({
                show: true,
                photoList: list,
            });
            setSlideShowLoading(false);
        });
    };

    useEffect(() => {
        if (slideShow.show && !slideShowLoading && !slideShowPhoto.photo.photo.IsVideo) {

            var timerHandle = setTimeout(() => {

                let index = slideShowPhoto.index + 1;
                if (index >= slideShow.photoList.length)
                    index = 0;

                setSlideShowLoading(true);

                Api.GetImage(slideShow.photoList[index].Id).then((imgData) => {
                    if (imgData instanceof String || typeof imgData == 'string') {

                        warning(`Failed loading image: '${slideShow.photoList[index].Name}'`);
                    
                        setSlideShowPhoto({ photo: { photo: slideShow.photoList[index], contentUrl: '' }, index });
                        setSlideShowLoading(false);
                    }
                    else {

                        if (!imgData || !imgData.type || !imgData.base64)
                        {
                            setSlideShowPhoto({ photo: { photo: slideShow.photoList[index], contentUrl: !imgData?.base64 ? imgData.base64 : '' }, index });
                        }
                        else {
                            setSlideShowPhoto({ photo: { photo: slideShow.photoList[index], contentUrl: `data:${imgData.type};base64,${imgData.base64}` }, index });
                        }
                    }
                    setSlideShowLoading(false);
                });

            }, slideShowInterval * 1000);

            return () => clearTimeout(timerHandle);
        }
    }, [slideShowInterval, slideShow, slideShowPhoto, slideShowLoading, Api]);

    const stopSlideShow = () => {
        setSlideShowLoading(false);
        setSlideShow({
            show: false,
        });
        setSlideShowPhoto({
            index: 0,
        });
    };

    return (
        <Dialog key="slideshow-dialog" fullScreen={true} open={slideShow.show} maxWidth={false}
            style={{ backgroundColor: '#222222', margin: 'auto' }}
            onClose={(e, reason) => { onClose(); }}
        >
            <Grid container direction="row" style={{ width: '100%', height: '100%', backgroundColor: '#222222', display: 'inline-block', padding: '10px' }}>
                <Grid direction="row" style={{ margin: 'auto', width: '100%', height: '20%', display: 'inline-block' }}>
                    <Button variant="outlined" style={{ color: 'white', borderColor: 'white', backgroundColor: '#226677', textTransform: 'none', margin: 'auto', marginBottom: '5px' }}
                        onClick={() => { onClose(); }}
                    >
                        <Typography variant="h5"><FontAwesomeIcon icon={faTimesCircle} style={{ marginRight: '5px' }} />Stop Slide Show</Typography>
                    </Button>
                    <Grid style={{ width: '30%', display: 'block', margin: '5px', color: 'white' }}>
                        Slide Show Interval:
                        <Slider min={1} max={60} step={1} style={{ color: '#22DDFF' }} defaultValue={5} onChange={(e, value) => setSlideShowInterval(value)} />
                    </Grid>
                    <Grid style={{ width: '30%', display: 'block', margin: '5px', color: 'white' }}>
                        <Typography variant="h5"><FontAwesomeIcon icon={faClock} style={{ marginRight: '5px' }} />{slideShowInterval} seconds</Typography>
                    </Grid>
                </Grid>
                {slideShowPhoto.photo?.photo && slideShowPhoto.photo?.contentUrl ?
                    <>
                        <Grid container direction="row" style={{ width: '100%', height: '70%', display: 'inline-block', overflow: 'hidden' }}>
                            <Grid container direction="column" style={{ width: '20%', height: '100%', display: 'inline-block', verticalAlign: 'top' }}>
                                <Button variant="outlined"
                                    style={{ height: '100%', width: '100%', color: 'white', backgroundColor: '#226677' }}
                                    onClick={() => {
                                        let index = slideShowPhoto.index - 1;
                                        if (index < 0)
                                            index = slideShow.photoList.length - 1;
                                        setSlideShowPhoto({ photo: slideShow.photoList[index], index });
                                    }}
                                >
                                    <FontAwesomeIcon icon={faArrowAltCircleLeft} size="8x" />
                                </Button>
                            </Grid>
                            <Grid container direction="column" style={{ width: '60%', padding: '20px', height: '100%', display: 'inline-block' }}>
                                <Grid container direction="row" style={{ margin: 'auto', minWidth: '90%', minHeight: '50%', verticalAlign: 'middle' }} >
                                {slideShowLoading ?
                                    <Grid style={{ width: '100%', height: '100%' }}>
                                        <CircularProgress size={100} style={{ margin: 'auto', verticalAlign: 'middle', color: '#22DDFF' }} />
                                    </Grid>
                                :
                                slideShowPhoto.photo?.photo.IsVideo ?
                                    <VideoHost
                                        onEnded={() => {
                                            let index = slideShowPhoto.index + 1;
                                            if (index > slideShow.photoList.length - 1)
                                                index = 0;

                                            setSlideShowLoading(true);
                                            
                                            Api.GetImage(slideShow.photoList[index].Id).then((imgData) => {
                                                if (!imgData || !imgData.type || !imgData.base64)
                                                {
                                                    setSlideShowPhoto({ photo: { photo: slideShow.photoList[index], contentUrl: !imgData?.base64 ? imgData.base64 : '' }, index });
                                                }
                                                else {
                                                    setSlideShowPhoto({ photo: { photo: slideShow.photoList[index], contentUrl: `data:${imgData.type};base64,${imgData.base64}` }, index });
                                                }
                                                setSlideShowLoading(false);
                                            }).catch((err) => {
                                                warning(`Failed loading image: '${photo.Name}'`);
                                                
                                                setSlideShowPhoto({ photo: { photo: slideShow.photoList[index], contentUrl: '' }, index });
                                                setSlideShowLoading(false);
                                            });
                                        }}
                                        onError={(err) => {
                                            console.log(err);

                                            let index = slideShowPhoto.index + 1;
                                            if (index > slideShow.photoList.length - 1)
                                                index = 0;

                                            setSlideShowLoading(true);
                                            
                                            Api.GetImage(slideShow.photoList[index].Id).then((imgData) => {
                                                if (!imgData || !imgData.type || !imgData.base64)
                                                {
                                                    setSlideShowPhoto({ photo: { photo: slideShow.photoList[index], contentUrl: !imgData?.base64 ? imgData.base64 : '' }, index });
                                                }
                                                else {
                                                    setSlideShowPhoto({ photo: { photo: slideShow.photoList[index], contentUrl: `data:${imgData.type};base64,${imgData.base64}` }, index });
                                                }
                                                setSlideShowLoading(false);
                                            }).catch((err) => {
                                                warning(`Failed loading image: '${slideShow.photo.Name}'`);
                                                
                                                setSlideShowPhoto({ photo: { photo: slideShow.photoList[index], contentUrl: '' }, index });
                                                setSlideShowLoading(false);
                                            });
                                        }}
                                        controls
                                        autoplay
                                        maxHeight={window.innerHeight * 0.55}
                                        maxWidth={window.innerWidth  * 0.55}
                                        autoWidth
                                        source={slideShowPhoto.photo.contentUrl}
                                    />
                                    :
                                    <Image
                                        onError={() => {
                                            console.log(err);

                                            let index = slideShowPhoto.index + 1;
                                            if (index >= slideShow.photoList.length - 1)
                                                index = 0;

                                            setSlideShowLoading(true);
                                            
                                            Api.GetImage(slideShow.photoList[index].Id).then((imgData) => {
                                                if (!imgData || !imgData.type || !imgData.base64)
                                                {
                                                    setSlideShowPhoto({ photo: { photo: slideShow.photoList[index], contentUrl: !imgData?.base64 ? imgData.base64 : '' }, index });
                                                }
                                                else {
                                                    setSlideShowPhoto({ photo: { photo: slideShow.photoList[index], contentUrl: `data:${imgData.type};base64,${imgData.base64}` }, index });
                                                }
                                                setSlideShowLoading(false);
                                            }).catch((err) => {
                                                warning(`Failed loading image: '${photo.Name}'`);
                                                
                                                setSlideShowPhoto({ photo: { photo: slideShow.photoList[index], contentUrl: '' }, index });
                                                setSlideShowLoading(false);
                                            });
                                        }}
                                        maxHeight={window.innerHeight * 0.55}
                                        maxWidth={window.innerWidth  * 0.55}
                                        autoWidth
                                        source={slideShowPhoto.photo.contentUrl}
                                    />
                                }
                                </Grid>
                            </Grid>
                            <Grid container direction="column" style={{ width: '20%', height: '100%', display: 'inline-block', verticalAlign: 'top' }}>
                                <Button variant="outlined"
                                    style={{ height: '100%', width: '100%', color: 'white', backgroundColor: '#226677' }}
                                    onClick={() => {
                                        let index = slideShowPhoto.index + 1;
                                        if (index >= slideShow.photoList.length)
                                            index = 0;
                                        
                                        setSlideShowLoading(true);

                                        Api.GetImage(slideShow.photoList[index].Id).then((imgData) => {
                                            if (!imgData || !imgData.type || !imgData.base64)
                                            {
                                                setSlideShowPhoto({ photo: { photo: slideShow.photoList[index], contentUrl: !imgData?.base64 ? imgData.base64 : '' }, index });
                                            }
                                            else {
                                                setSlideShowPhoto({ photo: { photo: slideShow.photoList[index], contentUrl: `data:${imgData.type};base64,${imgData.base64}` }, index });
                                            }
                                            setSlideShowLoading(false);
                                        }).catch((err) => {
                                            warning(`Failed loading image: '${photo.Name}'`);
                                            
                                            setSlideShowPhoto({ photo: { photo: slideShow.photoList[index], contentUrl: '' }, index });
                                            setSlideShowLoading(false);
                                        });;
                                    }}
                                >
                                    <FontAwesomeIcon icon={faArrowAltCircleRight} size="8x" />
                                </Button>
                            </Grid>
                        </Grid>
                        <Grid container direction="row" style={{ width: '100%', height: '10%', display: 'inline-block' }}>
                            <Typography style={{ margin: 'auto', color: 'white' }}>Name: {slideShowLoading ? `loading${slideShowPhoto.photo?.photo?.IsVideo ? ' video' : ' image'}...` : slideShowPhoto.photo?.photo?.Name}</Typography>
                        </Grid>
                    </>
                    : <Grid container direction="row" style={{ color: 'white', width: '100%', margin: 'auto', display: 'flex' }}>No photo.</Grid>
                }
            </Grid>
        </Dialog>
    );
}