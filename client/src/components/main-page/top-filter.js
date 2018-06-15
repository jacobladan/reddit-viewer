import React from 'react';

export class TopFilter extends React.Component {
    handleChange(e) {
        let value = e.target.value;
        this.props.handleSortByChange(value);
    }
    render() {
        if (this.props.isTopSelected) {
            return (
                <select className='top-sort' onChange={(e) => this.handleChange(e)}>
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