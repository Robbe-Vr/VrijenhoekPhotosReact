import React, { useEffect, useRef, useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import { Button, Checkbox, CircularProgress, Grid, Typography } from "@material-ui/core";
import { useNotifications } from "./NotificationContext";
import { Thumbnail } from "./Thumbnail";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";

const useStyles = makeStyles((theme) => ({
    
}));

function ContainerImageLoader({ photo, Api, contentData, isIconPhoto = false }) {
    const classes = useStyles();

    const { warning } = useNotifications();

    const [size, setSize] = useState(100);
    const ref = useRef(null);
    useEffect(() => {
        let newSize = ref.current ? ref.current.offsetWidth - 20 : 100;
        if (newSize > 200) {
            newSize = 200;
        }
        setSize(newSize);
    });

    const [loaded, setLoaded] = useState(false);
    const [photoData, setPhotoData] = useState({ photo: photo });

    const setContent = (content) => {
        setPhotoData(content);
        contentData && contentData(content);
    };

    useEffect(() => {
        if (photo?.Id) {
            setPhotoData(photoData => { return { ...photoData, photo: photo }; })

            Api.GetThumbnail(photo.Id).then((thumbnailData) => {
                if (thumbnailData instanceof String || typeof thumbnailData == 'string') {
                    warning(`Failed to load image: '${photo.Name}'`);
                }
                else if (thumbnailData.status && thumbnailData.status != 200) {
                    error(`Failed to load image: '${photo.Name}'! ${thumbnailData.title}`);
                    console.log(`Failed to load image: '${photo.Name}'!`, thumbnailData);
                }
                else {
                    if (!thumbnailData || !thumbnailData.type || !thumbnailData.base64) {
                        setContent(photoData => { return { ...photoData, thumbnailUrl: null }; });
                    } else {
                        setContent(photoData => { return { ...photoData, thumbnailUrl: `data:${thumbnailData.type};base64,${thumbnailData.base64}` }; });
                    }
                }

                setLoaded(true);
            });

        } else {
            setContent({
                photo: photo,
                thumbnailUrl: false,
            });
            setLoaded(true);
        }
    }, [Api])

    if (!loaded) {
        return (
            <Grid style={{ width: '100%', borderTop: 'solid 1px white', padding: '10px', margin: 'auto' }}>
                <CircularProgress size={25} style={{ margin: 'auto', marginTop: '10%', verticalAlign: 'middle', color: '#22DDFF' }} />
            </Grid>
        );
    }

    return (
        <Grid ref={ref} style={{ width: '100%', borderTop: 'solid 1px white', padding: '10px' }}>
            {photoData.thumbnailUrl ?
                <Thumbnail source={photoData.thumbnailUrl} onError={(e) => { console.log('Error on thumbnail!', e); }} size={size} />
                :
                <FontAwesomeIcon icon={faImage} size="3x" />
            }
        </Grid>
    );
};

export { ContainerImageLoader };