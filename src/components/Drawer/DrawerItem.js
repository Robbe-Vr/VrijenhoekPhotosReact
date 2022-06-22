import React from "react";
import { Link } from "react-router-dom";

import { ListItem, ListItemText } from "@material-ui/core";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function DrawerItem(props) {
    return (
        <ListItem button component={Link} to={props.link}>
            <FontAwesomeIcon icon={props.icon} style={{ marginRight: '5px' }}/><ListItemText primary={props.text} onClick={props.onClick} />
        </ListItem>
    );
};