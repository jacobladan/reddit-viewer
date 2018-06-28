import React from 'react';

export class EmbeddedImage extends React.Component {
    render() {
        return (
            <div style={{textAlign: 'center'}}>
                <img src={this.props.src} className='embedded-image' alt="body" />
            </div>
        );
    }
}