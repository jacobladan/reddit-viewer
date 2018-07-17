import React from 'react';
import ReactHtmlParser from 'react-html-parser';
import SadFace from '../../images/sad-face.svg';
import { PostAPI } from '../../api/subreddit-api';
import { GridLoader } from 'react-spinners';
import { PostInfo } from './post-info';
import { Thumbnail } from './thumbnail';
import { Points } from './points';
import { convertDate } from '../../utils/date-converter';
import { Animated } from "react-animated-css";
import { Comment } from './comment';
import { CommentsFilter } from './comments-filter';
import '../../styles/comments.css';



let decodeHTML = (html) => {
	var txt = document.createElement('textarea');
	txt.innerHTML = html;
	return txt.value;
};

export class CommentsContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            subreddit: '',
            id: '',
            filter: 'top',
            comments: [],
            fetchInProgress: true,
            noComments: false,
        };
        this.handleFilterChange = this.handleFilterChange.bind(this);
        this.comments = React.createRef();
        this.commentsFilter = React.createRef();
        this.postInfo = {};
    }

    generateComments(subreddit, id, filter) {
        const fetch = new PostAPI(subreddit, id, filter);
        this.setState({subreddit: subreddit, id: id, filter: filter, fetchInProgress: true, noCommentsExpanded: true, noComments: false});
        fetch.then(data => {
            let previewUrl, postInfo = data[0].data.children[0].data;
            // console.log(postInfo);
            console.log(data)
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
            if (data[1].data.children.length === 0) {
                this.setState({comments: [], fetchInProgress: false, noComments: true});
            } else {
                let comments = data[1].data.children.map(comment => {
                    return this.generateParentComments(comment);
                });
                this.setState({comments: comments, fetchInProgress: false});
            }
        });
    }

    generateParentComments(comment) {
        if (typeof(comment.data.body_html) !== 'undefined') {
            let childComments = [];
            let parentCommentInfo = {
                created_utc: convertDate(comment.data.created_utc),
                author: ' ' + comment.data.author,
                authorLink: 'https://www.reddit.com/user/' + comment.data.author,
                score: comment.data.score_hidden ? '[hidden]' : comment.data.score,
                body: ReactHtmlParser(decodeHTML(comment.data.body_html))
            };
            // If it's a comment
            if (comment.kind === 't1') {
                // If it has replies
                if (comment.data.replies !== '') {
                    // If the replies have been populated and aren't just IDs
                    if (comment.data.replies.data.children.length > 0) {
                        childComments = this.generateChildComments(comment, true);
                    }
                }
            }
            return (
                <div key={comment.data.id} id='commentContainer'>
                    <Comment commentInfo={parentCommentInfo} 
                            theme={this.props.theme} 
                            children={childComments}
                            isParent={true}/>
                </div>
            ); 
        } else {
            return null;
        }
    }

    // Recurring function for generating children, grandchildren, great grandchildren...etc.
    generateChildComments(comment, colour) {
        let childCommentInfo = {};
        let childComments = [];
        colour = !colour;
        // For every child in the calling parent comment
        for (let i = 0; i < comment.data.replies.data.children.length; i++) {
            // If the reply list is populated with comments and not just a list of IDs
            if (comment.data.replies.data.children[i].kind !== 'more'){
                // Initializing grandChildCommments here as it was not clearing up above from previous comments
                let grandChildComments = [];
                let data = comment.data.replies.data.children[i].data;
                childCommentInfo = {
                    created_utc: convertDate(data.created_utc),
                    author: ' ' + data.author,
                    authorLink: 'https://www.reddit.com/user/' + data.author,
                    score: data.score_hidden ? '[hidden]' : data.score,
                    body: ReactHtmlParser(decodeHTML(data.body_html))
                };
                // Checking if the comment has children that need to be populated
                if (data.replies !== '') {
                    // If the reply list is populated with comments and not just a list of IDs
                    if (data.replies.data.children.length > 0) {
                        grandChildComments = this.generateChildComments(comment.data.replies.data.children[i], colour);
                    }
                }
                childComments[i] = <Comment 
                                    commentInfo={childCommentInfo} 
                                    theme={this.props.theme} 
                                    key={data.id}
                                    children={grandChildComments}
                                    colour={colour}/>;
            }
        }
        return childComments;
    }

    handleFilterChange(filter) {
        this.generateComments(this.state.subreddit, this.state.id, filter);
    }

    render() {
        if (this.state.noComments) {
            return (
                <div className={`comments-expanded-container comments-expanded-container-${this.props.theme}`} style={this.props.display}>
                {
                    this.state.fetchInProgress
                    ?<div className='comments-loader-container'><GridLoader loading={true} color={"#44def3"} /></div>
                    :<Animated animationIn='fadeIn' isVisible={true} className='animation-styles'>
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
                        <Points theme={this.props.theme} points={this.postInfo.score} />
                        <div className={`no-comments-container no-comments-container-${this.props.theme}`}>
                            <img src={SadFace} alt='sad face' className='sad-face-img'/>
                            <p className='no-comments-message'>No Comments...</p>
                        </div>
                    </Animated>
                }
                </div>
            );
        } else {
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
                                <Points theme={this.props.theme} points={this.postInfo.score} />
                                <CommentsFilter theme={this.props.theme} 
                                                handleFilterChange={this.handleFilterChange}
                                                filter={this.state.filter}/>
                                <div className='post-comments-container'>{this.state.comments}</div>
                            </div> 
                        </Animated>
                    }
                </div>
            );
        }
    }
}

