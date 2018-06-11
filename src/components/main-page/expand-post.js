import React from 'react';

export class ExpandedPost extends React.Component {
    render() {
        return <button className='expand-post-button' onClick={this.props.onClick}>EXPAND</button>;
    }
}