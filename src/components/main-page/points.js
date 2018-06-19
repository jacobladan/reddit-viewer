import React from 'react';

export class Points extends React.Component {
    render() {
        return (
            <div className='points-container'>
                <p className='points-label'>POINTS</p>
                <p className='points'>{this.props.points}</p>
            </div>
        );
    }
}