import React, { useEffect, useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import { Button, Grid, Typography } from "@material-ui/core";
import { faArrowAltCircleLeft, faArrowAltCircleRight, faImage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { UserSelectInputComponent } from "./UserSelectInputComponent";

const useStyles = makeStyles((theme) => ({
    
}));

function Pagination({ page, maxPages, rpp, count, onChangePage, onChangeRpp }) {
    const classes = useStyles();

    const nextPage = () => {
        let next = page + 1;
        if (next > maxPages) {
            next = 1;
        }
        onChangePage(next);
    };
    const previousPage = () => {
        let prev = page - 1;
        if (prev <= 0) {
            prev = maxPages;
        }
        onChangePage(prev);
    };

    const updatePage = (newPage) => {
        if (newPage > 0 && page != newPage) {
            onChangePage(newPage);
        }
    };
    const updateRpp = (newRpp) => {
        if (newRpp > 0 && rpp != newRpp) {
            onChangeRpp(newRpp);
        }
    };

    return (
        <>
            <Grid style={{ display: 'flex', justifyContent: 'center', color: '#2DF', margin: "auto", marginBottom: '10px' }}>
                <Grid style={{ marginRight: '5px', verticalAlign: 'middle' }}>results per page</Grid>
                    <Button
                        style={{ color: rpp == 10 ? '#222' : '#2DF', backgroundColor: rpp == 10 ? '#2DF' : '' }}
                        onClick={() => updateRpp(10)}
                    >
                        10
                    </Button>
                    <Button
                        style={{ color: rpp == 25 ? '#222' : '#2DF', backgroundColor: rpp == 25? '#2DF' : '' }}
                        onClick={() => updateRpp(25)}
                    >
                        25
                    </Button>
                    <Button
                        style={{ color: rpp == 50 ? '#222' : '#2DF', backgroundColor: rpp == 50 ? '#2DF' : '' }}
                        onClick={() => updateRpp(50)}
                    >
                        50
                    </Button>
                    <Button
                        style={{ color: rpp == 100 ? '#222' : '#2DF', backgroundColor: rpp == 100 ? '#2DF' : '' }}
                        onClick={() => updateRpp(100)}
                    >
                        100
                    </Button>
                <Grid style={{ marginLeft: '5px' }}>({count} results)</Grid>
            </Grid>
            <Grid style={{ display: 'flex', justifyContent: 'center', color: '#2DF', margin: "auto", marginBottom: '10px' }}>
                <Button variant="outlined"
                    style={{ borderColor: '#2DF', marginRight: '10px' }}
                    onClick={() => previousPage()}
                >
                    <FontAwesomeIcon icon={faArrowAltCircleLeft} style={{ color: '#2DF' }} />
                </Button>
                <Grid style={{ display: 'inline-block' }}>
                    <Button variant="outlined"
                        style={{ borderColor: '#2DF', color: page == 1 ? '#222' : '#2DF', backgroundColor: page == 1 ? '#2DF' : '#222', marginLeft: '2px', marginRight: '2px', textTransform: 'none' }}
                        onClick={() => { updatePage(1); }}
                    >
                        1
                    </Button>
                    {page > 3 ? <>...</> : <></>}
                    <Button variant="outlined"
                        style={{
                            borderColor: '#2DF',
                            color: page == (page == 1 || page == 2 ? 2 : page == maxPages || page == maxPages - 1 ? maxPages - 3 : page - 1) ? '#222' : '#2DF',
                            backgroundColor: page == (page == 1 || page == 2 ? 2 : page == maxPages || page == maxPages - 1 ? maxPages - 3 : page - 1) ? '#2DF' : '#222',
                            marginLeft: '2px', marginRight: '2px', textTransform: 'none'
                        }}
                        onClick={() => { updatePage(page == 1 || page == 2 ? 2 : page == maxPages || page == maxPages - 1 ? maxPages - 3 : page - 1); }}
                    >
                        {page == 1 || page == 2 ? 2 : page == maxPages || page == maxPages - 1 ? maxPages - 3 : page - 1}
                    </Button>
                    <Button variant="outlined"
                        style={{
                            borderColor: '#2DF',
                            color: page == (page == 1 || page == 2 ? 3 : page == maxPages || page == maxPages - 1 ? maxPages - 2 : page) ? '#222' : '#2DF',
                            backgroundColor: page == (page == 1 || page == 2 ? 3 : page == maxPages || page == maxPages - 1 ? maxPages - 2 : page) ? '#2DF' : '#222',
                            marginLeft: '2px', marginRight: '2px', textTransform: 'none'
                        }}
                        onClick={() => { updatePage(page == 1 || page == 2 ? 3 : page == maxPages || page == maxPages - 1 ? maxPages - 2 : page); }}
                    >
                        {page == 1 || page == 2 ? 3 : page == maxPages || page == maxPages - 1 ? maxPages - 2 : page}
                    </Button>
                    <Button variant="outlined"
                        style={{
                            borderColor: '#2DF',
                            color: page == (page == 1 || page == 2 ? 4 : page == maxPages || page == maxPages - 1 ? maxPages - 1 : page + 1) ? '#222' : '#2DF',
                            backgroundColor: page == (page == 1 || page == 2 ? 4 : page == maxPages || page == maxPages - 1 ? maxPages - 1 : page + 1) ? '#2DF' : '#222',
                            marginLeft: '2px', marginRight: '2px', textTransform: 'none'
                        }}
                        onClick={() => { updatePage(page == 1 || page == 2 ? 4 : page == maxPages || page == maxPages - 1 ? maxPages - 1 : page + 1); }}
                    >
                        {page == 1 || page == 2 ? 4 : page == maxPages || page == maxPages - 1 ? maxPages - 1 : page + 1}
                    </Button>
                    {page < maxPages - 2 ? <>...</> : <></>}
                    <Button variant="outlined"
                        style={{ borderColor: '#2DF', color: page == maxPages ? '#222' : '#2DF', backgroundColor: page == maxPages ? '#2DF' : '#222', marginLeft: '2px', marginRight: '2px', textTransform: 'none' }}
                        onClick={() => { updatePage(maxPages); }}
                    >
                        {maxPages}
                    </Button>
                </Grid>
                <Button variant="outlined"
                    style={{ borderColor: '#2DF', marginLeft: '10px' }}
                    onClick={() => nextPage()}
                >
                    <FontAwesomeIcon icon={faArrowAltCircleRight} style={{ color: '#2DF' }} />
                </Button>
            </Grid>
        </>
    );
};

export { Pagination };