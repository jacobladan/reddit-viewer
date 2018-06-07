import React from 'react';

export class PostInfo extends React.Component {
    render() {
        return (
            <div className='post-info'>
                <div className='title-container'>
                    <a href={this.props.link} className='post-title'>{this.props.title}</a>
                </div>
                <p className='author'><b>Author: </b><a href={this.props.authorLink} className='author-link' target='_blank'>{this.props.author}</a></p>
                <p className='domain'><b>Domain: </b>{this.props.domain}</p>
                <p className='created'><b>Posted: </b>{this.props.created}</p>
                {this.props.stickied && <p className='pinned'>pinned</p>}
            </div>
        )
    }
}