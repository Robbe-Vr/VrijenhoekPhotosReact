import React, { useEffect, useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";

const useStyles = makeStyles((theme) => ({
    inputBox: {
        marginBottom: theme.spacing(3),
    },
}));

function SelfLoadingThumbnail({ Api, size = 256, photoId, onEnded, onError }) {
    const classes = useStyles();

    const [loaded, setLoaded] = useState(false);
    const [loadError, setLoadError] = useState(null);

    const [contentUrl, setContentUrl] = useState(null);

    useEffect(() => {
        Api.GetThumbnail(photoId).then((thumbnailData) => {
            if (thumbnailData instanceof String || typeof res == 'string') {
                warning(`Failed to load image: '${photo.Name}'`);
            }
            else if (thumbnailData.status && thumbnailData.status != 200) {
                error(`Failed to load image: '${photo.Name}'! ${thumbnailData.title}`);
                console.log(`Failed to load image: '${photo.Name}'!`, res);
            }
            else {
                if (!thumbnailData || !thumbnailData.type || !thumbnailData.base64) {
                    setContentUrl(!thumbnailData?.base64 ? thumbnailData.base64 : null);
                } else {
                    setContentUrl(`data:${thumbnailData.type};base64,${thumbnailData.base64}`);
                }
            }
        });
    }, [Api, photoId]);

    return (
        <Grid
            style={{ border: 'solid 1px white', width: ((size + 2) + "px").toString(), maxWidth: ((size + 2) + "px").toString(), height: ((size + 2) + "px").toString(), maxHeight: ((size + 2) + "px").toString(), margin: 'auto' }}
            className={classes.inputBox}
        >
            {loaded ?
                <CircularProgress /> :
                <>{loadError ?
                    <FontAwesomeIcon icon={faImage} /> :
                    <img
                        onEnded={onEnded}
                        onError={(err) => {
                            setError(true);
                            onError && onError(err);
                        }}
                        alt=""
                        src={contentUrl}
                        width={(size + "px").toString()}
                        height={(size + "px").toString()}
                    />
                }</>
            }
        </Grid>
    );
};

export { SelfLoadingThumbnail };