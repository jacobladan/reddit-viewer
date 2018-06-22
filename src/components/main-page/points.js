import React from 'react';

export class Points extends React.Component {
    render() {
        let points;
        if (this.props.points >= 10000) {
            points = (this.props.points / 1000).toFixed(2) + 'k';
        } else {
            points = this.props.points;
        }
        return (
            <div className='points-container'>
                <p className='points-label'>POINTS</p>
                <p className='points'>{points}</p>
            </div>
        );
    }
}