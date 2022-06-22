import React, { useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import { Grid, Typography } from "@material-ui/core";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const useStyles = makeStyles((theme) => ({
    
}));

function Image({ source, maxWidth, maxHeight, autoHeight = false, autoWidth = false, onEnded, onError }) {
    const classes = useStyles();

    const [error, setError] = useState(null);

    return (
        <Grid
            style={{ border: 'solid 1px white', width: `${maxWidth}px`, height: `${maxHeight}px`, margin: 'auto', overflow: 'hidden', padding: '1px' }}
        >
            {error ? <FontAwesomeIcon icon={faImage} /> :
                <img
                    onEnded={onEnded}
                    onError={(err) => {
                        setError(true);
                        onError && onError(err);
                    }}
                    alt=""
                    height={maxHeight - 2 || ''}
                    width={maxWidth - 2 || ''}
                    style={{ objectFit: 'contain', height: autoHeight ? '' : '100%', width: autoWidth ? '' : '100%' }}
                    src={source}
                />
            }
        </Grid>
    );
};

export { Image };