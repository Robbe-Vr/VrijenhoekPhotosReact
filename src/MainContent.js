import React, { useState } from "react";

import { Redirect, Route, Switch } from "react-router-dom";

import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";

import { drawerWidth } from "./components/Drawer/AppDrawer";
import { drawerHeight } from "./components/Drawer/MobileAppDrawer";
import AlbumsPage from "./components/Albums/Index";
import HomePage from "./components/Home/Index";
import UploadPage from "./components/Home/Upload";
import GroupsPage from "./components/Groups/Index";
import AlbumShowcase from "./components/Albums/AlbumShowcase";
import ManagePage from "./components/Accounts/Manage";
import GroupContents from "./components/Groups/Contents";
import ManageJoinRequestsPage from "./components/Groups/JoinRequests";
import JoinGroupPage from "./components/Accounts/JoinGroup";

const useStyles = makeStyles((theme) => ({
    drawerHeader: {
        display: "flex",
        alignItems: "center",
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
        justifyContent: "flex-end",
    },
    content: {
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        padding: '25px',
        maxHeight: '100%',
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: 0,
    },
    contentShift: {
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: drawerWidth,
    },
}));

export default function MainContent({ Api, setTitle, drawerOpen, renderMobile, windowWidth, userName, rights }) {
    const classes = useStyles();

    return (
        <main
            className={clsx(classes.content, {
                [classes.contentShift]: !renderMobile && drawerOpen
            })}
        >
            <div className={classes.drawerHeader} />
            <div
                style={{
                    width: windowWidth - 50 - (!renderMobile && drawerOpen ? drawerWidth : 0),
                    overflow: 'auto',
                    marginBottom: renderMobile ? `${drawerHeight}px` : '0'
                }}
            >
                <Switch>
                    <Route exact path={["/home/index", "/home"]}>
                        <HomePage renderMobile={renderMobile}
                            Api={Api} setTitle={setTitle}
                        />
                    </Route>
                    <Route exact path={["/albums/index", "/albums"]}>
                        <AlbumsPage renderMobile={renderMobile}
                            Api={Api} setTitle={setTitle}
                        />
                    </Route>
                    <Route exact path={["/albums/:albumId"]}>
                        <AlbumShowcase renderMobile={renderMobile}
                            Api={Api} setTitle={setTitle}
                        />
                    </Route>
                    <Route exact path={["/groups/index", "/groups"]}>
                        <GroupsPage renderMobile={renderMobile}
                            Api={Api} setTitle={setTitle}
                        />
                    </Route>
                    <Route exact path={["/groups/:groupId"]}>
                        <GroupContents renderMobile={renderMobile}
                            Api={Api} setTitle={setTitle}
                        />
                    </Route>
                    <Route exact path={["/upload"]}>
                        <UploadPage renderMobile={renderMobile}
                            Api={Api} setTitle={setTitle}
                        />
                    </Route>
                    <Route exact path={["/account/manage/index", "/account/manage"]}>
                        <ManagePage renderMobile={renderMobile}
                            userName={userName} rights={rights}
                            Api={Api} setTitle={setTitle}
                        />
                    </Route>
                    <Route exact path={["/account/join-group"]}>
                        <JoinGroupPage renderMobile={renderMobile}
                            Api={Api} setTitle={setTitle}
                        />
                    </Route>
                    <Route exact path={["/account/manage/join-requests"]}>
                        <ManageJoinRequestsPage renderMobile={renderMobile}
                            Api={Api} setTitle={setTitle}
                        />
                    </Route>
                    <Redirect strict from="/" to="/home" />
                </Switch>
            </div>
        </main>
    );
};