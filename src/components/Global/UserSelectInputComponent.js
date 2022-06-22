import React, { useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import { Grid, Select, MenuItem, styled } from "@material-ui/core";

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

function UserSelectInputComponent({ name, variant = "outlined", defaultValue = '', options, style, onChange, isAsync, isError = false }) {
    const [value, setValue] = useState(defaultValue);

    if (!value && defaultValue) {
        setValue(defaultValue);
    }
    
    return (
        <Grid style={{ width: style?.width || '100%', height: style?.height || '100%' }}>
            <DarkModeSelect
                style={{ color: isError ? 'red' : '', ...style, width: '100%', height: '100%' }}
                variant={variant}
                id={name}
                label={name}
                value={value}
                onChange={isAsync ? 
                async (e) => {
                    setValue(e.target.value);
                    await onChange(e.target.value);
                }
                :
                (e) => {
                    setValue(e.target.value);
                    onChange(e.target.value);
                }}
            > 
            {
                options.map(option =>
                    <MenuItem style={{ backgroundColor: style?.backgroundColor || '', color: style?.color || 'white' }} key={option.id ?? options.name + '-' + option.value} value={option.value} selected={option.value === defaultValue}>{option.name}</MenuItem>
                )
            }
            </DarkModeSelect>
        </Grid>
    );
};

export { UserSelectInputComponent };