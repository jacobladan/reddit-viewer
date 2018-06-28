import React from 'react';

export class EmbeddedLink extends React.Component {
    render() {
        return (
            <div style={{textAlign: 'center'}}>
                <video autoPlay loop style={{maxHeight: '600px', maxWidth: '600px'}}>
                    <source src={this.props.src} type='video/mp4'/>
                </video>
            </div>
        );
    }
}