import React from 'react';

export class EmbeddedVideo extends React.Component {
    render() {
        return <div style={{textAlign: 'center'}}>{this.props.html}</div>
    }
}