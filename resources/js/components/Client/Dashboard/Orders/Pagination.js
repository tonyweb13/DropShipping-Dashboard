import React, { Component } from "react";
import { Box, Pagination } from "@mui/material";

class PaginationComponent extends Component {
    handlePageChange = (event, newPage) => {
        const { onPageChange } = this.props;
        onPageChange(newPage);
    };

    render() {
        const { totalV2, perPageV2, pageV2 } = this.props.states;
        const totalPages = parseInt(totalV2) / parseInt(perPageV2);
        // const totalPages = parseInt(0) / parseInt(perPageV2);

        return (
            <div style={{ position: "absolute" }}>
                <Pagination
                    count={parseInt(totalPages.toFixed(0))}
                    page={pageV2}
                    onChange={this.handlePageChange}
                    color="primary"
                />
            </div>
        );
    }
}

export default PaginationComponent;
