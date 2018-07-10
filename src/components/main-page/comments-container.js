import React from 'react';
import { Comments } from './comments';
import { PostAPI } from '../../api/subreddit-api';
import { GridLoader } from 'react-spinners';
import { PostInfo } from './post-info';
import { Thumbnail } from './thumbnail';
import { Points } from './points';
import { convertDate } from '../../utils/date-converter';
import { Animated } from "react-animated-css";
import ReactHtmlParser from 'react-html-parser';
import '../../styles/comments.css';


let decodeHTML = function (html) {
	var txt = document.createElement('textarea');
	txt.innerHTML = html;
	return txt.value;
};

export class CommentsContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            comments: [],
            fetchInProgress: true,
        };
        this.comments = React.createRef();
        this.postInfo = {};
    }

    generateComments(subreddit, id) {
        const fetch = new PostAPI(subreddit, id);
        this.setState({fetchInProgress: true, isCommentsExpanded: true});
        fetch.then(data => {
            let previewUrl, postInfo = data[0].data.children[0].data;
            // console.log(postInfo);
            if (typeof(postInfo.preview) !== 'undefined'){
                if (data[0].thumbnail === 'self') {
                    previewUrl = postInfo.preview.images[0].source.url;
                } 
                else {
                    previewUrl = postInfo.thumbnail;
                }
            } else { 
                previewUrl = 'default'; 
            }
            let authorLink = 'https://www.reddit.com/user/' + postInfo.author;
            this.postInfo = {
                url: postInfo.url,
                previewUrl: previewUrl,
                over_18: postInfo.over_18,
                title: decodeHTML(postInfo.title),
                authorLink: authorLink,
                author: postInfo.author,
                domain: postInfo.domain,
                created_utc: postInfo.created_utc,
                stickied: postInfo.stickied,
                spoiler: postInfo.spoiler,
                subreddit: postInfo.subreddit,
                passedSubreddit: 'all',
                permaLink: postInfo.permalink,
                num_comments: postInfo.num_comments,
                id: postInfo.id,
                score: postInfo.score,
            }
            let comments = data[1].data.children.map(comment => {
                console.log(comment.data);
                if (typeof(comment.data.body_html) !== 'undefined') {
                    let commentBody = ReactHtmlParser(decodeHTML(comment.data.body_html));
                    return (
                        <div key={comment.data.id} className={`parent-comment parent-comment-${this.props.theme}`}>
                            <div className={`comment-info-container comment-info-container-${this.props.theme}`}>
                            <p className='comment-date'><b>Posted:</b> {convertDate(comment.data.created_utc)}</p>
                            <p className='comment-author'><b>By:</b> <a className={`comment-author-link comment-author-link-${this.props.theme}`} href={comment.data.authorLink} target='_blank'>{comment.data.author}</a></p>
                            <p className='comment-points'><b>Points:</b> {comment.data.score}</p>
                            </div>
                            {commentBody}
                        </div>
                    ); 
                } else {
                    return null;
                }
            });
            this.setState({comments: comments, fetchInProgress: false});
        });
    }

    render() {
        // Fix comment links to subreddits 
        return (
            <div className={`comments-expanded-container comments-expanded-container-${this.props.theme}`} style={this.props.display}>
                {
                    this.state.fetchInProgress
                    ?<div className='comments-loader-container'><GridLoader loading={true} color={"#44def3"} /></div>
                    :<Animated animationIn='fadeIn' isVisible={true} className='animation-styles'>
                        <div>
                            <Thumbnail href={this.postInfo.url} src={this.postInfo.previewUrl} over_18={this.postInfo.over_18}/>
                            <PostInfo 
                            link={this.postInfo.url} 
                            title={decodeHTML(this.postInfo.title)}
                            authorLink={this.postInfo.authorLink}
                            author={this.postInfo.author} 
                            domain={this.postInfo.domain}
                            created={this.postInfo.created_utc}
                            stickied={this.postInfo.stickied}
                            spoiler={this.postInfo.spoiler}
                            postSubreddit={this.postInfo.subreddit}
                            passedSubreddit={this.postInfo.passedSubreddit}
                            permaLink={this.postInfo.permalink}
                            over_18={this.postInfo.over_18}
                            num_comments={this.postInfo.num_comments}
                            postId={this.postInfo.id}
                            theme={this.props.theme}
                            isFromComments={true}
                            handleSubredditChange={this.props.handleSubredditChange}/>
                            <Points theme={this.props.theme} points={this.postInfo.score}/>
                            <Comments ref={this.comments} comments={this.state.comments}/>
                        </div> 
                    </Animated>
                }
            </div>
        );
    }
}