import React, { useEffect, useRef, useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import { Button, Checkbox, Grid, Typography } from "@material-ui/core";
import { ContainerImageLoader } from "../Global/ContainerImageLoader";

const useStyles = makeStyles((theme) => ({
    
}));

function PhotoContainer({ item, checkedItems, Api, onClick, onContext, onChecked, showCheckbox }) {
    const classes = useStyles();

    const [contentData, setContentData] = useState(null);

    const [checked, setChecked] = useState(false);
    const changeChecked = (photo, state) => {
        onChecked(photo, state);
        setChecked(state);
    }

    useEffect(() => {
        if (Array.isArray(checkedItems))
        {
            setChecked(checkedItems.indexOf(item.Id) > -1);
        }
    }, [checkedItems]);

    useEffect(() => {
        setChecked(false);
    }, [item]);

    useEffect(() => {
        if (!showCheckbox) {
            setChecked(false);
        }
    }, [showCheckbox]);

    let dateStr = item?.CreationDate.toLocaleString('nl');

    return (
        <Button key={'thumbnail-' + item?.Id}
            style={{ minWidth: '18%', maxWidth: '48%', marginRight: '1%', marginLeft: '1%', marginBottom: '20px', display: 'inline-block', border: 'solid 1px white', borderRadius: '1rem', backgroundColor: checked ? '#4466DD' : '', textTransform: 'none' }}
            onClick={(e) => { if (!e.target.id.startsWith('checkbox')) { onClick && onClick({ ...item, ...contentData }); } }}
            onContextMenu={(e) => { e.preventDefault(); onContext && onContext({ ...item, ...contentData }); }}
        >
            <Grid style={{ width: '100%', height: '100%', padding: '5px', margin: 'auto', color: 'white' }}>
                {showCheckbox ?
                    <Grid style={{ width: '25%', display: 'inline-block' }}>
                        <Checkbox checked={checked} onChange={(e) => changeChecked({ ...item, ...contentData }, e.target.checked)} id={"checkbox-" + item?.Id} />
                    </Grid>
                    : <></>}
                <Grid style={{ width: showCheckbox ? '75%' : '100%', display: 'inline-block' }}>
                    <Typography title={item?.Name} style={{ overflow: 'hidden', wordWrap: 'break-word' }}>{item?.Name}</Typography>
                </Grid>
                <ContainerImageLoader Api={Api} photo={item} isIconPhoto={false} contentData={setContentData} />
            </Grid>
        </Button>
    );
};

export { PhotoContainer };