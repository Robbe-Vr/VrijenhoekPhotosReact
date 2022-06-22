import React, { useEffect, useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import { Button, Checkbox, CircularProgress, Grid, Typography } from "@material-ui/core";
import { ContainerImageLoader } from "../Global/ContainerImageLoader";

const useStyles = makeStyles((theme) => ({
    
}));

function GroupContainer({ item, Api, onClick, onContext, onChecked, showCheckbox }) {
    const classes = useStyles();

    const [checked, setChecked] = useState(false);
    const changeChecked = (photo, state) => {
        onChecked(photo, state);
        setChecked(state);
    }

    useEffect(() => {
        if (!showCheckbox) {
            setChecked(false);
        }
    }, [showCheckbox]);

    let dateStr = item?.CreationDate.toLocaleString('nl');

    return (
        <Button key={'thumbnail-' + item?.Id}
            style={{ minWidth: '15%', maxWidth: '30%', marginRight: '20px', marginBottom: '20px', display: 'inline-block', border: 'solid 1px white', borderRadius: '1rem', backgroundColor: checked ? '#4466DD' : '', textTransform: 'none' }}
            onClick={(e) => { if (!e.target.id.startsWith('checkbox')) { onClick && onClick(item); } }}
            onContextMenu={(e) => { e.preventDefault(); onContext && onContext(item); }}
        >
            <Grid style={{ width: '100%', height: '100%', padding: '5px', margin: 'auto', color: 'white' }}>
                {showCheckbox ?
                    <Grid style={{ width: '25%', display: 'inline-block' }}>
                        <Checkbox checked={checked} onChange={(e) => changeChecked(item, e.target.checked)} id={"checkbox-" + item?.Id} />
                    </Grid>
                    : <></>}
                <Grid style={{ width: showCheckbox ? '75%' : '100%', display: 'inline-block' }}>
                    <Typography title={item?.Name} style={{ overflow: 'hidden', wordWrap: 'break-word' }}>{item?.Name}</Typography>
                </Grid>
                <ContainerImageLoader photo={item} Api={Api} isIconPhoto={true} />
            </Grid>
        </Button>
    );
};

export { GroupContainer };