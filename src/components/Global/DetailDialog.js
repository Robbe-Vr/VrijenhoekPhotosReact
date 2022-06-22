import React, { useEffect, useRef, useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import { Button, Checkbox, Grid, Typography, Dialog, DialogTitle, DialogContent } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    
}));

function DetailDialog({ children, title, show, onClose }) {
    const classes = useStyles();

    return (
        <Dialog open={show} maxWidth="xl" fullWidth onClose={(e, reason) => onClose(e, reason)} style={{ backgroundColor: '#222' }} >
            <DialogTitle style={{ backgroundColor: '#222', color: 'white' }}>{title}</DialogTitle>
            <DialogContent style={{ backgroundColor: '#222', color: 'white' }}>
                <Grid style={{ width: '100%', height: '100%', overflowY: 'auto' }}>
                    {children}
                </Grid>
            </DialogContent>
        </Dialog>
    );
};

export { DetailDialog };