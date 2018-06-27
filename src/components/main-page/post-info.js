import React from 'react';

export class PostInfo extends React.Component {

    constructor(props) {
        super(props);
        this.timeSincePost = 0;
    }

    componentWillMount() {
        let timeNow = Math.round(Date.now() / 1000);
        let timeDif = (timeNow - (this.props.created)) / 60;
        // console.log(this.props.title + ': ' + timeDif)
        if (timeDif >= 2 && timeDif <= 60) {
            // Between 2 minutes and an hour
            this.timeSincePost = Math.floor(timeDif) + ' minutes ago';
        } else if (timeDif > 60 && timeDif < 120) {
            // One hour
            this.timeSincePost = ' an hour ago';
        } else if (timeDif >= 120 && timeDif <= 1440) {
            // Betwen 2 hours and one day
            this.timeSincePost = Math.floor((timeDif) / 60) + ' hours ago';
        } else if (timeDif > 1440 && timeDif <= 2880) {
            // One day
            this.timeSincePost = ' one day ago';
        } else if (timeDif > 2880 && timeDif <= 43800) {
            // Between 2 days and one month
            this.timeSincePost = Math.floor((timeDif) / (60 * 24)) + ' days ago';
        } else if (timeDif > 43800 && timeDif <= 87600) {
            // One month
            this.timeSincePost = ' one month ago';
        } else if (timeDif > 87600 && timeDif <= 525600) {
            // Between 2 months and a year
            this.timeSincePost = Math.floor((timeDif) / (60 * 24 * 30)) + ' months ago';
        } else if (timeDif > 525600 && timeDif <= 1036800) {
            // One year
            this.timeSincePost = ' one year ago';
        } else if (timeDif > 1036800) {
            // Over one year
            this.timeSincePost = Math.floor((timeDif) / (60 * 24 * 30 * 12)) + ' years ago';
        } else {
            // Less than a minute
            this.timeSincePost = 'now';
        }
    }

    handleSubredditClick() {
        this.props.handleSubredditChange(this.props.postSubreddit);
    }

    handleCommentsClick() {
        console.log('clicked')
    }
    
    render() {
        // Work around to add second class based on props
        let titleClass = `post-title ${this.props.titleClass}`;
        // Adds space between spoiler and sticked tag if both are present
        let spoilerMargin, nsfwMargin;
        if (this.props.stickied) { spoilerMargin = {marginLeft: '1%'}; }
        if (this.props.stickied) { nsfwMargin = {marginLeft: '1%'}; }
        
        return (
            <div className='post-info'>
                <p className='title-container'>
                    <a href={this.props.link} className={titleClass} target='_blank'>{this.props.title}</a>
                    <span className='domain'>({this.props.domain})</span>
                </p>
                <div>
                    {this.props.stickied && <p className='pinned'>pinned</p>}
                    {this.props.spoiler && <p className='spoilers' style={spoilerMargin}>spoilers</p>}
                    {this.props.over_18 && <p className='nsfw' style={nsfwMargin}>nsfw</p>}
                </div>
                <div className='info-container'>
                    <p className='posted'><b>Posted: </b>{this.timeSincePost}</p>
                    <p className='author'><b>By: </b><a href={this.props.authorLink} className='author-link' target='_blank'>{this.props.author}</a></p>
                    {(this.props.passedSubreddit === 'all') && <p className='subreddit'><b>To: </b></p>}
                    {(this.props.passedSubreddit === 'all') && <p className='subreddit-link' onClick={() => this.handleSubredditClick()}>/r/{this.props.postSubreddit}</p>}
                    <a href={'https://reddit.com' + this.props.permaLink} target='_blank' className='comments'>Comments ({this.props.num_comments})</a>
                </div>
                <div className='info-container'>
                </div>
            </div>
        )
    }
}
// <p className='comments' onClick={() => this.handleCommentsClick()}>Comments ({this.props.num_comments})</p>
// {
//     (this.props.passedSubreddit === 'all') && 
//     <div className='subreddit-container'>
//         <p className='subreddit'><b>To: </b></p>
//         <span className='subreddit-link' onClick={() => this.handleSubredditClick()}>/r/{this.props.postSubreddit}</span>
//     </div>
// }
