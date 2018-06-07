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
                    <option value="&t=hour">Past Hour</option>
                    <option value="&t=day">Past 24 Hours</option>
                    <option value="&t=week">Past Week</option>
                    <option value="&t=month">Past Month</option>
                    <option value="&t=year">Past Year</option>
                    <option value="&t=all">All Time</option>
                </select>
            );
        } else {
            return null;
        }
    }
}