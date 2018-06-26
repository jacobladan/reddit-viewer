import React from 'react';
import DefaultThumbnail from '../../images/default-thumbnail.png';

export class Thumbnail extends React.Component {

    render() {
        let nsfwBlur, src;
        if (this.props.over_18) { nsfwBlur = {filter: 'blur(5px)'} }
        if (this.props.src === 'default') { src = DefaultThumbnail }
        else { src = this.props.src }
        return (
            <a href={this.props.href} className='thumbnail' target='_blank'>
                <img 
                    src={src} 
                    alt="thumbnail" 
                    className='thumbnail-img'
                    onError={DefaultThumbnail}
                    style={nsfwBlur}
                />
            </a>
        )
    }
}
