import React, { useEffect, useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import { Grid, styled, TextField } from "@material-ui/core";

const DarkModeTextField = styled(TextField)({
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

function UserInputComponent({ name, variant = "outlined", type = 'text', multiple = false, inputProps, defaultValue, value, disabled, onChange, isAsync = false, onEnter, submitIsAsync = false, isError = false, style = {} }) {
    const [controlValue, setValue] = useState(defaultValue ?? value);

    if (!controlValue && defaultValue) {
        setValue(defaultValue);
    }

    useEffect(() => {
        setValue(value);
    }, [value]);

    useEffect(() => {
        setValue(defaultValue);
    }, [defaultValue]);
    
    if (type === 'number') {
        if (inputProps.step && inputProps.step === 1.00 && value % 1 !== 0) {
            var correction = parseInt((parseFloat(value) + 0.50).toString()).toString();
            if (correction === 0) {
                correction = 1;
            }

            setValue(correction);
            onChange(correction);
        }
    }

    return (
        <Grid style={{ width: style?.width || '100%', height: style?.height || '100%' }}>
            <DarkModeTextField
                style={{ color: isError ? 'red': '', ...style, width: 'auto', height: 'auto' }}
                disabled={disabled}
                variant={variant}
                id={name}
                label={name}
                value={value}
                type={type}
                multiple={multiple}
                inputProps={{
                    ...inputProps,
                }}
                onChange={isAsync ? async (e) => {
                    setValue(e.target.value);
                    await onChange(type === 'file' ? e.target.files : e.target.value);
                } : 
                (e) => {
                    setValue(e.target.value);
                    onChange(type === 'file' ? e.target.files : e.target.value);
                }}
                onKeyDown={submitIsAsync ?
                async (e) => {
                    if (e.keyCode == 13) {
                        await onEnter ?? onEnter();
                    }
                } : (e) => {
                    if (e.keyCode == 13) {
                        onEnter ?? onEnter();
                    }
                }}
            />
        </Grid>
    );
};

export { UserInputComponent };