import React, { useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import { Grid, TextField } from "@material-ui/core";

import { Thumbnail } from "./Thumbnail";

const useStyles = makeStyles((theme) => ({
    inputBox: {
        
    },
}));

function ImageInputComponent({ variant = "outlined", defaultValue, onChange, isAsync = false }) {
    const [value, setValue] = useState(defaultValue);

    if (!value && defaultValue) {
        setValue(defaultValue);
    }
    
    const classes = useStyles();

    return (
        <Grid container direction="row" style={{ justifyContent: 'center' }}>
            <Grid style={{ display: 'flex', justifyContent: 'center' }}>
                <Grid item xs={9} style={{ marginRight: '5px', display: 'flex', justifyContent: 'center' }}>
                    <TextField
                        className={classes.inputBox}
                        variant={variant}
                        id="Image"
                        label="Image"
                        value={value}
                        type="text"
                        onChange={isAsync ? async (e) => {
                            setValue(e.target.value);
                            await onChange(e.target.value);
                        } : (e) => {
                            setValue(e.target.value);
                            onChange(e.target.value);
                        }}
                    />
                </Grid>
                <Grid item xs={3} style={{ display: 'flex', justifyContent: 'center', verticalAlign: 'center' }}>
                    <Thumbnail source={value} size={50}/>
                </Grid>
            </Grid>
        </Grid>
    );
};

export { ImageInputComponent };