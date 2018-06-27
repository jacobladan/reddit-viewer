import React from 'react';

export class EmbeddedImage extends React.Component {
    render() {
        return <div style={{textAlign: 'center'}}>
            <img src={this.props.src} alt="body" style={{maxHeight: '300px', maxWidth: '300px'}}/>
        </div>;
    }
}