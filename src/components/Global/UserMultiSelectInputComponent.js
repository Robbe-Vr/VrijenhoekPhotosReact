import React, { useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import { Grid, Select, MenuItem, InputLabel } from "@material-ui/core";

const DarkModeSelect = styled(Select)({
    color: 'white',
    backgroundColor: '#444',
    borderColor: 'white',
    borderRadius: '0.25rem',
    '& label': {
        color: 'white'
    },
    '& input': {
        color: 'white',
        borderColor: 'white'
    },
});

function UserMultiSelectInputComponent({ name, variant = "outlined", defaultValues = [], options, onChange, style, isError = false }) {
    const [values, setValues] = useState(defaultValues);

    if ((!values || values.length < 1) && (defaultValues && defaultValues.length > 0)) {
        setValues(defaultValues);
    }
    
    const overrideOnChange = (value) => {
        setValues(value);
        onChange(value);
    };

    return (
        <Grid style={{ width: style?.width || '100%', height: style?.height || '100%' }}>
            <InputLabel id={name}/>
            <DarkModeSelect
                style={{ color: isError ? 'red' : '', ...style, width: '100%', height: '100%' }}
                multiple={true}
                variant={variant}
                id={name}
                label={name}
                value={values}
                onChange={(e) => {
                    overrideOnChange(e.target.value);
                }}
            > 
            {
                options.map(option =>
                    <MenuItem style={{ backgroundColor: style?.backgroundColor || '', color: style?.color || '' }} key={name + "-" + option.name} id={name + "-" + option.name} value={option.value} selected={values.indexOf(option.value) > -1}>{option.name}</MenuItem>
                )
            }
            </DarkModeSelect>
        </Grid>
    );
};

export { UserMultiSelectInputComponent };