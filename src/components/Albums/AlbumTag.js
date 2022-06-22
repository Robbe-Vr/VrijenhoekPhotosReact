import React, { useEffect, useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    
}));

function AlbumTag({ tagId, text, color, onDoubleClick }) {
    const classes = useStyles();

    return (
        <Button variant="outlined"
            onDoubleClick={() => onDoubleClick(tagId)}
            style={{ color: color, border: 'solid 1px #2DF', borderRadius: '1rem', textTransform: 'none' }}
        >
            {text}
        </Button>
    );
};

export { AlbumTag };