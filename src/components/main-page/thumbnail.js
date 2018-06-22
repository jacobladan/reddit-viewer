import React from 'react';

export class Thumbnail extends React.Component {

    render() {
        let aClasses = `thumbnail ${this.props.aClass}`;
        let imgClasses = `thumbnail-img ${this.props.imgClass}`;
        let nsfwBlur;
        if (this.props.over_18) { nsfwBlur={filter: 'blur(5px)'} }
        return (
            <a href={this.props.href} className={aClasses} target='_blank'>
                <img 
                    src={this.props.src} 
                    alt="thumbnail" 
                    className={imgClasses} 
                    onError={(e) => {e.target.src="https://www.reddit.com/static/self_default2.png"}}
                    style={nsfwBlur}/>
            </a>
        )
    }
}