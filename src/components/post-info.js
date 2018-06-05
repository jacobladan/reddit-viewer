import React from 'react';

export class PostInfo extends React.Component {
    render() {
        return (
            <div className='post-info'>
                <a href={this.props.link} className='post-title'>{this.props.title}</a>
                <p className='author'><b>Author: </b><a href={this.props.authorLink} className='author-link' target='_blank'>{this.props.author}</a></p>
                <p className='points'><b>Points: </b>{this.props.score}</p>
                <p className='created'><b>Created: </b>{this.props.created}</p>
            </div>
        )
    }
}