import React, { Component } from "react";
import PropTypes from "prop-types";
import Typography from "@mui/material/Typography";

class Title extends Component {
    constructor(props) {
        super(props);
        this.state = {
            children: props.children,
        };
    }

    render() {
        return (
            <Typography
                component="h2"
                variant="h6"
                color="primary"
                gutterBottom
            >
                {this.state.children}
            </Typography>
        );
    }
}

Title.propTypes = {
    children: PropTypes.node,
};

export default Title;
