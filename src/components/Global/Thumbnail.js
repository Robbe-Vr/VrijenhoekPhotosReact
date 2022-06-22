import React, { useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";

const useStyles = makeStyles((theme) => ({
    inputBox: {
        marginBottom: theme.spacing(3),
    },
}));

function Thumbnail({ source, size = 256, onEnded, onError }) {
    const classes = useStyles();

    const [error, setError] = useState(null);

    return (
        <Grid
            style={{ border: 'solid 1px white', width: ((size + 2) + "px").toString(), maxWidth: ((size + 2) + "px").toString(), height: ((size + 2) + "px").toString(), maxHeight: ((size + 2) + "px").toString(), margin: 'auto' }}
            className={classes.inputBox}
        >
            {error ?
                <FontAwesomeIcon icon={faImage} /> :
                <img
                    onEnded={onEnded}
                    onError={(err) => {
                        setError(true);
                        onError && onError(err);
                    }}
                    alt=""
                    src={source}
                    width={(size + "px").toString()}
                    height={(size + "px").toString()}
                />
            }
        </Grid>
    );
};

export { Thumbnail };