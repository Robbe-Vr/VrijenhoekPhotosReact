import React, { useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import { Grid, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    
}));

function Video({ id, source, type = "video/mp4", codecs, maxWidth, maxHeight, autoHeight = false, autoWidth = false, autoplay = false, muted = false, controls = false, loop = false, onEnded, onError }) {
    const classes = useStyles();

    const [error, setError] = useState(null);

    return (
        <Grid
            style={{ border: 'solid 1px white', width: maxWidth ? `${maxWidth}px` : '', height: maxHeight ? `${maxHeight}px` : '', margin: 'auto', overflow: 'hidden', padding: '1px' }}
        >
            <video
                id={id}
                alt=""
                onEnded={onEnded}
                controls={controls}
                autoPlay={autoplay}
                muted={muted}
                loop={loop}
                height={maxHeight ? parseInt(maxHeight) - 2 : ''}
                width={maxWidth ? parseInt(maxWidth) - 2 : ''}
                style={{ objectFit: 'contain', height: autoHeight ? '' : '100%', width: autoWidth ? '' : '100%' }}
                onError={(err) => {
                    if (err.isPersistent())
                        err.persist();

                    setError(err.currentTarget.error?.message ? err.currentTarget.error.message : "Error occured while loading video!");
                    onError && onError(err);
                }}
                onErrorCapture={(err) => {
                    if (err.isPersistent())
                        err.persist();

                    setError(err.currentTarget.error?.message ? err.currentTarget.error.message : "Error occured while loading video!");
                    onError && onError(err);
                }}
            >
                <source
                    onError={(err) => {
                        if (err.isPersistent())
                            err.persist();

                        setError(err.currentTarget.error?.message ? err.currentTarget.error.message : "Error occured while loading video!");
                        onError && onError(err);
                    }}
                    onErrorCapture={(err) => {
                        if (err.isPersistent())
                            err.persist();

                        setError(err.currentTarget.error?.message ? err.currentTarget.error.message : "Error occured while loading video!");
                        onError && onError(err);
                    }}
                    src={source} type={type + (codecs ? `; ${codecs}` : '')}></source>
                    {error ? <Typography variant="h2">{error}</Typography> : <></>}
            </video>
        </Grid>
    );
};

export { Video };