import React, { Component } from "react";
import { Typography, Link } from "@mui/material";
import Title from "./Common/Title";

class Deposits extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
        };
    }

    preventDefault(e) {
        e.preventDefault();
    }

    render() {
        return (
            <React.Fragment>
                <Title>Recent Deposits</Title>
                <Typography component="p" variant="h4">
                    $3,024.00
                </Typography>
                <Typography sx={{ flex: 1 }}>on 15 March, 2019</Typography>
                <div>
                    <Link href="#" onClick={this.preventDefault}>
                        View balance
                    </Link>
                </div>
            </React.Fragment>
        );
    }
}

export default Deposits;
