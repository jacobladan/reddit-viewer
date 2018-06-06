import React from 'react';

export class Points extends React.Component {
    constructor(props) {
        super(props);
        this.state ={
            points: 0
        };
    }

    render() {
        return (
            <div className='points-container'>
                <p className='points-label'>Points</p>
                <p className='points'>{this.props.points}</p>
            </div>
        );
    }
}