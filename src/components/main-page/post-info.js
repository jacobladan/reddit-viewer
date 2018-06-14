import React from 'react';

export class PostInfo extends React.Component {
    render() {
        // Work around to add second class based on props
        let titleClass = `post-title ${this.props.titleClass}`;
        // Adds space between spoiler and sticked tag if both are present
        let spoilerMargin;
        if (this.props.stickied) { spoilerMargin = {marginLeft: '1%'};}
        return (
            <div className='post-info'>
                <div className='title-container'>
                    <a href={this.props.link} className={titleClass}>{this.props.title}</a>
                </div>
                <div>
                    {this.props.stickied && <p className='pinned'>pinned</p>}
                    {this.props.spoiler && <p className='spoilers' style={spoilerMargin}>spoilers</p>}
                </div>
                <p className='author'><b>Author: </b><a href={this.props.authorLink} className='author-link' target='_blank'>{this.props.author}</a></p>
                <p className='domain'><b>Domain: </b>{this.props.domain}</p>
                <p className='created'><b>Posted: </b>{this.props.created}</p>
                {
                    (this.props.passedSubreddit === 'all') && 
                    <div className='subreddit-container'>
                        <p className='subreddit'><b>Subreddit: </b></p>
                        <p className='subreddit-link'>/r/{this.props.postSubreddit}</p>
                    </div>
                }
            </div>
        )
    }
}