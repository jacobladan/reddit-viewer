import React from 'react';

export class TopFilter extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: ''
        };
    }

    handleChange(e) {
        let value = e.target.value;
        this.props.handleSortByChange(value);
        this.setState({value: value});
    }

    render() {
        if (this.props.isTopSelected) {
            return (
                <select className={`top-sort top-sort-${this.props.theme}`} onChange={(e) => this.handleChange(e)} value={this.props.sortBy}>
                    <option value="hour">Past Hour</option>
                    <option value="day">Past 24 Hours</option>
                    <option value="week">Past Week</option>
                    <option value="month">Past Month</option>
                    <option value="year">Past Year</option>
                    <option value="all">All Time</option>
                </select>
            );
        } else {
            return null;
        }
    }
}