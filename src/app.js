import React, { useEffect, useRef, useState } from "react";
import "./app.css";

import { makeStyles } from "@material-ui/core/styles";

import { BrowserRouter as Router, Link, useParams } from "react-router-dom";

import { Redirect, Route, Switch } from "react-router-dom";

import { CircularProgress, Box, Grid, Button, IconButton, Typography, Toolbar, CssBaseline, AppBar, Dialog, DialogTitle, DialogContent } from "@material-ui/core";
import clsx from "clsx";

import { Authenticate, useAccount } from "./api/account";

import { Onboarding } from "./components/Onboarding/Onboarding";
import MainContent from "./MainContent";
import { AppDrawer, drawerWidth } from "./components/Drawer/AppDrawer";
import { MobileAppDrawer, drawerHeight } from "./components/Drawer/MobileAppDrawer";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog, faFolder, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { useAPI, ApiProvider } from "./api/api-context";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { NotificationProvider } from "./components/Global/NotificationContext";

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        height: "100%",
    },
    appBar: {
        backgroundColor: '#222222',
        color: 'white',
        borderBottom: 'solid 1px #22DDFF',
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px])`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    hide: {
        display: "none",
    },
    title: {
        flexGrow: 1,
    },
    content: {
        flexGrow: 2,
        padding: theme.spacing(3),
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
    logoutButton: {
        color: 'white',
        margin: '1px',
        height: '70%',
        width: '45%',
        fontSize: 'smaller',
        textTransform: 'none',
    },
    manageButton: {
        color: 'white',
        margin: '1px',
        height: '70%',
        width: '50%',
        fontSize: 'smaller',
        textTransform: 'none',
    }
}));

export default function App() {
    return (
        <>
            <Authenticate>
                <ApiProvider>
                    <NotificationProvider>
                        <Router>
                            <Switch>
                                <Route path={["/home", "/"]}>
                                    <AppShell />
                                </Route>
                            </Switch>
                        </Router>
                    </NotificationProvider>
                </ApiProvider>
            </Authenticate>
        </>
    );
};

function AppShell() {
    const { id, name, rights, registered, loaded, logOut } = useAccount();
    const [title, setTitle] = useState("");
    const [open, setOpen] = useState(true);

    useEffect(() => {
        window.top.document.title = title
    }, [title]);

    const classes = useStyles();

    const { Api } = useAPI();

    const history = useHistory();

    const breakpoint = 800;
    const [renderMobile, setRenderMobile] = useState(window.innerWidth < breakpoint);
    const [width, setWidth] = useState(window.innerWidth);
    useEffect(() => {
        function onResize() {
            var mobileScreenSize = window.innerWidth < breakpoint;

            //console.log(`Resize: Screen width of ${window.innerWidth}px and height of ${window.innerHeight}px, thus rendering ${mobileScreenSize ? "mobile" : "default"} layout.`);

            setRenderMobile(mobileScreenSize);
            setWidth(window.innerWidth);
        };

        window.addEventListener('resize', () => onResize());
        window.addEventListener('loaded', () => onResize());

        return () => {
            window.removeEventListener('resize', () => onResize());
            window.removeEventListener('loaded', () => onResize());
        };
    }, [breakpoint]);

    if (!loaded) {
        return <></>;
    }

    if (!registered) {
        return <Onboarding setTitle={setTitle} Api={Api} renderMobile={renderMobile} />;
    }

    return (
        <>
            <CssBaseline />
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                })}
            >
                <Toolbar style={{ marginLeft: !renderMobile && open ? drawerWidth : 0, width: 'calc(100% - ' + (!renderMobile && open ? drawerWidth : 0) + ')', display: 'flex' }}>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={() => setOpen(!open)}
                        edge="start"
                        className={clsx(classes.menuButton)}
                    >
                        <FontAwesomeIcon icon={faFolder} />
                    </IconButton>
                    <Grid style={{ minWidth: '10%', overflow: 'hidden', wordWrap: '' }}>
                        <Link style={{ textDecoration: 'none' }} to="/home">
                            <Button style={{ color: 'white', textTransform: 'none' }}>
                                <Typography variant="h6" noWrap className={classes.title}>{title}</Typography>
                            </Button>
                        </Link>
                    </Grid>
                    <Grid style={{ paddingLeft: '5px', marginLeft: 'auto', marginRight: 0 }}>
                        <Grid style={{ marginLeft: 'auto', marginRight: 0 }}>
                            <Typography variant="subtitle2" noWrap className={classes.title} style={{ borderBottom: 'solid 1px white', marginLeft: 'auto', marginRight: 0 }}>
                                Welcome {name}
                            </Typography>
                            <Grid style={{ right: '0px' }}>
                                <Button
                                    className={classes.manageButton}
                                    onClick={() => { history.push('/account/manage'); }}
                                >
                                    <FontAwesomeIcon icon={faCog} style={{ marginRight: '5px' }}/> settings
                                </Button>
                                <Button
                                    className={classes.logoutButton}
                                    onClick={() => { logOut(); history.push('/signin/login'); }}
                                >
                                    <FontAwesomeIcon icon={faSignOutAlt} style={{ marginRight: '5px' }}/> logout
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
            {renderMobile ?
                <MobileAppDrawer
                    open={open}
                    onOpen={setOpen}
                    setTitle={setTitle}
                    isRegistered={registered}
                    rights={rights}
                />
                :
                <AppDrawer
                    open={open}
                    onOpen={setOpen}
                    setTitle={setTitle}
                    isRegistered={registered}
                    rights={rights}
                />
            }

            <MainContent
                windowWidth={width}
                renderMobile={renderMobile}
                setTitle={setTitle}
                Api={Api}
                userName={name}
                rights={rights}
                drawerOpen={open}
            />
        </>
    );
};