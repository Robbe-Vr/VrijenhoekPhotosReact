import React from "react";
import { Link } from "react-router-dom";

import { Button } from "@material-ui/core";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function DrawerItem(props) {
    return (
        <div style={{ display: 'inline-block', width: props.width, height: props.height, margin: 'auto', padding: '3px' }}>
            <Link to={props.link} style={{ textDecoration: 'none' }}>
                <Button variant="outlined" style={{ backgroundColor: 'white', width: props.width - 10, height: props.height - 10, overflow: 'hidden', wordWrap: 'ellipsis', textTransform: 'none' }}>
                    <FontAwesomeIcon icon={props.icon} style={{ marginRight: '5px' }}/>
                    {props.text}
                </Button>
            </Link>
        </div>
    );
};