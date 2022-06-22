import React, { useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import { Drawer } from "@material-ui/core";

import { faImage, faPhotoVideo, faUpload, faUsers } from "@fortawesome/free-solid-svg-icons";

import DrawerItem from "./MobileDrawerItem";

const drawerHeight = 100;

const useStyles = makeStyles((theme) => ({
    drawer: {
        height: drawerHeight,
        flexShrink: 0,
        position: 'absolute',
        zIndex: 1,
        overflow: 'hidden',
    },
    drawerPaper: {
        borderTop: 'solid 3px #22DDFF',
        boxShadow: '0px 0px 0px 1px rgba(0, 0, 0, 0.12), 0px 0px 0px 2px rgba(0, 0, 0, 0.14), 0px 0px 0px 2px rgba(0, 0, 0, 0.20)',
        transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
        backgroundColor: '#222222',
        height: drawerHeight,
        width: '100%',
        overflow: 'hidden',
    },
    chevron: {
        display: "flex",
        justifyContent: "flex-end",
        flex: 1,
    },
}));

function MobileAppDrawer({ rights }) {
    const classes = useStyles();

    return (
        <Drawer
            className={classes.drawer}
            variant="persistent"
            anchor="bottom"
            open={true}
            classes={{
                paper: classes.drawerPaper,
            }}
        >
            <div style={{ width: window.innerWidth, height: drawerHeight, display: 'block', overflow: 'hidden', position: 'absolute' }}>
                <div style={{ display: 'inline-block', width: window.innerWidth, overflow: 'hidden', verticalAlign: 'top', paddingTop: '10px', paddingBottom: '5px' }}>
                    <div style={{ height: drawerHeight - 2, overflow: 'hidden', marginLeft: '10px' }}>
                        <DrawerItem width={(window.innerWidth - 20) * 0.5} height={(drawerHeight - 22) * 0.5} icon={faUpload} link="/upload" text="Upload" />
                        <DrawerItem width={(window.innerWidth - 20) * 0.5} height={(drawerHeight - 22) * 0.5} icon={faImage} link="/home/index" text="My Photos" />
                        <DrawerItem width={(window.innerWidth - 20) * 0.5} height={(drawerHeight - 22) * 0.5} icon={faPhotoVideo} link="/albums/index" text="Albums" />
                        <DrawerItem width={(window.innerWidth - 20) * 0.5} height={(drawerHeight - 22) * 0.5} icon={faUsers} link="/groups/index" text="Groups" />
                    </div>
                    : <></>
                </div>
            </div>
        </Drawer>
    );
};

export { MobileAppDrawer, drawerHeight };