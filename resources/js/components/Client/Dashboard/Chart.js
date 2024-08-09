import React, { Component } from "react";
import { useTheme } from "@mui/material/styles";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import Title from "./Common/Title";

class Chart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
        };
    }

    componentDidMount() {
        let data = [
            this.createData("00:00", 0),
            this.createData("03:00", 300),
            this.createData("06:00", 600),
            this.createData("09:00", 800),
            this.createData("12:00", 1500),
            this.createData("15:00", 2000),
            this.createData("18:00", 2400),
            this.createData("21:00", 2400),
            this.createData("24:00", undefined),
        ];
        this.setState({ data: data });
    }

    createData(time, amount) {
        return { time, amount };
    }

    render() {
        return (
            <React.Fragment>
                <Title>Today</Title>
                <ResponsiveContainer>
                    <LineChart
                        data={this.state.data}
                        margin={{
                            top: 16,
                            right: 16,
                            bottom: 0,
                            left: 24,
                        }}
                    >
                        <XAxis dataKey="time" />
                        <YAxis>
                            <Label
                                angle={270}
                                position="left"
                                style={{
                                    textAnchor: "middle",
                                }}
                            >
                                Sales ($)
                            </Label>
                        </YAxis>
                        <Line
                            isAnimationActive={false}
                            type="monotone"
                            dataKey="amount"
                            dot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </React.Fragment>
        );
    }
}
export default Chart;
