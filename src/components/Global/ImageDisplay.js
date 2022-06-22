import axios from "axios";

import { faArrowAltCircleLeft, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, CircularProgress, Dialog, DialogContent, DialogTitle, Grid, Typography } from "@material-ui/core";

import { UserInputComponent } from "./UserInputComponent";
import { Video as VideoHost } from "./Video";
import { Image } from "./Image";

import React, { useEffect, useState } from "react";
import { useNotifications } from "./NotificationContext";

export default function ImageDisplay({ onClose, selectedPhoto, Api }) {

    const { error, warning, success } = useNotifications();

    const [loaded, setLoaded] = useState(false);

    const [source, setSource] = useState(null);

    const [cancelToken, setCancelToken] = useState(null);

    useEffect(() => {
        if (!selectedPhoto.open) {
            setSource(null);
            setLoaded(false);

            if (cancelToken) {
                cancelToken?.cancel();
            }

            setCancelToken(null);

            return;
        }

        if (!selectedPhoto.Id) {
            setLoaded(true);
            return;
        }

        if (cancelToken) {
            cancelToken?.cancel();
        }

        if (selectedPhoto.IsVideo) {
            setSource(
                    Api.GetContentStreamUrl(selectedPhoto.Id)
                );

            setLoaded(true);
        }
        else
        {
            var cancel = axios.CancelToken.source();

            setCancelToken(cancel);

            Api.GetImage(selectedPhoto.Id, cancel).then((imgData) => {
                if (imgData instanceof String || typeof imgData == 'string') {
                    warning(`Failed to load image: '${selectedPhoto.Name}'`);
                }
                else if (imgData.status && imgData.status != 200) {
                    error(`Failed to load image: '${selectedPhoto.Name}'! ${imgData.title}`);
                    console.log(`Failed to load image: '${selectedPhoto.Name}'!`, imgData);
                }
                else {
                    if (!imgData || !imgData.type || !imgData.base64)
                    {
                        setSource(Api.GetContentStreamUrl(selectedPhoto.Id));
                    }
                    else {
                        setSource(`data:${imgData.type};base64,${imgData.base64}`);
                    }
                }

                setLoaded(true);

                setCancelToken(null);
            });
        }
    }, [Api, selectedPhoto]);

    return (
        <>
            <Dialog key="image-info-dialog" open={selectedPhoto.open} maxWidth={false}
                style={{ width: window.innerWidth, height: window.innerHeight - 50, backgroundColor: '#222222', margin: 'auto', overflow: 'hidden' }}
                onClose={(e, reason) => { onClose(); setSource(null); }}
            >
                <DialogContent style={{ width: window.innerWidth * 0.8, height: window.innerHeight * 0.85, backgroundColor: '#222222', color: 'white', margin: 'auto' }}>
                    {!loaded ?
                        <Grid style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
                            Loading...<br /><CircularProgress />
                        </Grid>
                        :
                        <>
                        {source ?
                            <Grid style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
                                <Grid container direction="row" style={{ maxHeight: '95%' }}>
                                {selectedPhoto.IsVideo ?
                                    <VideoHost
                                        id="selected-video"
                                        onEnded={(e) => {
                                            //e.target.load();
                                        }}
                                        onError={(err) => {
                                            console.log(err);
                                        }}
                                        loop
                                        autoplay
                                        controls
                                        maxHeight={window.innerHeight * 0.75}
                                        maxWidth={window.innerWidth  * 0.7}
                                        autoWidth
                                        source={source}
                                    />
                                    :
                                    <Image
                                        maxHeight={window.innerHeight * 0.75}
                                        maxWidth={window.innerWidth  * 0.7}
                                        source={source}
                                    />
                                }
                                </Grid>
                            </Grid>
                            : 
                            <Grid style={{ color: 'white', margin: 'auto', width: '100%' }}>
                                No photo selected.
                            </Grid>
                        }
                        </>
                    }
                </DialogContent>
            </Dialog>
        </>
    );
}