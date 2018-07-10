import React from 'react';
import { convertDate } from '../../utils/date-converter';

export class PostInfo extends React.Component {

    constructor(props) {
        super(props);
        this.timeSincePost = '';
    }

    componentWillMount() {
        this.timeSincePost = convertDate(this.props.created);
    }

    handleSubredditClick() {
        this.props.handleSubredditChange(this.props.postSubreddit);
    }

    handleCommentsClick() {
        this.props.generateComments(this.props.postId);
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
                    <span className={`domain domain-${this.props.theme}`}>({this.props.domain})</span>
                </p>
                <div>
                    {this.props.stickied && <p className='pinned'>pinned</p>}
                    {this.props.spoiler && <p className='spoilers' style={spoilerMargin}>spoilers</p>}
                    {this.props.over_18 && <p className='nsfw' style={nsfwMargin}>nsfw</p>}
                </div>
                <div className='info-container'>
                    <p className={`posted posted-${this.props.theme}`}><b>Posted: </b>{this.timeSincePost}</p>
                    <p className={`author author-${this.props.theme}`}><b>By: </b><a href={this.props.authorLink} className={`author-link author-link-${this.props.theme}`} target='_blank'>{this.props.author}</a></p>
                    {(this.props.passedSubreddit === 'all') && <p className={`subreddit subreddit-${this.props.theme}`}><b>To: </b></p>}
                    {(this.props.passedSubreddit === 'all') && <p className='subreddit-link' onClick={() => this.handleSubredditClick()}>/r/{this.props.postSubreddit}</p>}
                    {
                        this.props.isFromComments
                        ? <p className={`comments-comments comments-comments-${this.props.theme}`}>Comments ({this.props.num_comments})</p>
                        : <p onClick={() => this.handleCommentsClick()} className={`comments comments-${this.props.theme}`}>Comments ({this.props.num_comments})</p>

                    }
                </div>
                <div className='info-container'>
                </div>
            </div>
        )
    }
}
