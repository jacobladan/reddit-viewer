import React from 'react';

export class EmbeddedImage extends React.Component {
    render() {
        return <div style={{textAlign: 'center'}}><img src={this.props.src} alt="body" style={{maxWidth: '800px'}}/></div>;
    }
}