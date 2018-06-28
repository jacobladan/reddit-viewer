import React from 'react';

export class EmbeddedVideo extends React.Component {
    render() {
        return <div className='embedded-video'>{this.props.html}</div>;
    }
}