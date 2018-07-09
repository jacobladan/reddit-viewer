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
            <div className={`points-container points-container-${this.props.theme}`}>
                <p className={`points-label points-label-${this.props.theme}`}>POINTS</p>
                <p className={`points points-${this.props.theme}`}>{points}</p>
            </div>
        );
    }
}