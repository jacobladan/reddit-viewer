import React from 'react';

export class Thumbnail extends React.Component {

    render() {
        return (
            <a href={this.props.href} className='thumbnail'>
                <img src={this.props.src} alt="thumbnail" className='thumbnail-img' />
            </a>
        )
    }
}