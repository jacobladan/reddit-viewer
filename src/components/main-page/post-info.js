import React from 'react';

export class PostInfo extends React.Component {

    handleClick() {
        this.props.handleSubredditChange(this.props.postSubreddit);
    }

    render() {
        // Work around to add second class based on props
        let titleClass = `post-title ${this.props.titleClass}`;
        // Adds space between spoiler and sticked tag if both are present
        let spoilerMargin, nsfwMargin, nsfw = false;
        if (this.props.stickied) { spoilerMargin = {marginLeft: '1%'}; }
        if (this.props.stickied) { nsfwMargin = {marginLeft: '1%'}; }
        if (this.props.over_18) { nsfw = true; }
        
        return (
            <div className='post-info'>
                <div className='title-container'>
                    <a href={'https://reddit.com' + this.props.permaLink} className={titleClass} target='_blank'>{this.props.title}</a>
                </div>
                <div>
                    {this.props.stickied && <p className='pinned'>pinned</p>}
                    {this.props.spoiler && <p className='spoilers' style={spoilerMargin}>spoilers</p>}
                    {nsfw && <p className='nsfw' style={nsfwMargin}>nsfw</p>}
                </div>
                <div className='info-container'>
                    <p className='author'><b>Author: </b><a href={this.props.authorLink} className='author-link' target='_blank'>{this.props.author}</a></p>
                    <p className='domain'><b>Domain: </b>{this.props.domain}</p>
                </div>
                <div className='info-container'>
                    <p className='posted'><b>Posted: </b>{this.props.created}</p>
                    {
                        (this.props.passedSubreddit === 'all') && 
                        <div className='subreddit-container'>
                            <p className='subreddit'><b>Subreddit: </b></p>
                            <p className='subreddit-link' onClick={() => this.handleClick()}>/r/{this.props.postSubreddit}</p>
                        </div>
                    }
                </div>
            </div>
        )
    }
}
        // <a className='comments-link' href={'https://reddit.com' + this.props.permaLink} target='_blank'>comments</a>