import React from 'react';
import { PostAPI } from '../../api/subreddit-api';
import { GridLoader } from 'react-spinners';
import { PostInfo } from './post-info';
import { Thumbnail } from './thumbnail';
import { Points } from './points';
import { convertDate } from '../../utils/date-converter';
import { Animated } from "react-animated-css";
import ReactHtmlParser from 'react-html-parser';
import { Comment } from './comment';
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
            // console.log(data)
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
                return this.generateParentComments(comment);
            });
            this.setState({comments: comments, fetchInProgress: false});
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
            // console.log(comment.data);
            // If it's a comment
            if (comment.kind === 't1') {
                // If it has replies
                if (comment.data.replies !== '') {
                    // If the replies have been populated and aren't just IDs
                    if (comment.data.replies.data.children.length > 0) {
                        childComments = this.generateChildComments(comment);
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

    generateChildComments(comment) {
        let childCommentInfo = {};
        let childComments = [];
        let grandChildComments = [];
        for (let i = 0; i < comment.data.replies.data.children.length; i++) {
            // As long as it is a reply and not a list of IDs
            if (comment.data.replies.data.children[i].kind !== 'more'){
                let data = comment.data.replies.data.children[i].data;
                childCommentInfo = {
                    created_utc: convertDate(data.created_utc),
                    author: ' ' + data.author,
                    authorLink: 'https://www.reddit.com/user/' + data.author,
                    score: data.score_hidden ? '[hidden]' : data.score,
                    body: ReactHtmlParser(decodeHTML(data.body_html))
                };
                if (comment.data.replies.data.children[i].data.replies !== '') {
                    // If the replies have been populated and aren't just IDs
                    // console.log(comment.data.replies.data.children[i].data.replies.data.children.length);
                    if (comment.data.replies.data.children[i].data.replies.data.children.length > 0) {
                        grandChildComments = this.generateGrandChildComments(comment.data.replies.data.children[i]);
                    }
                }
                childComments[i] = <Comment 
                                    commentInfo={childCommentInfo} 
                                    theme={this.props.theme} 
                                    key={data.id}
                                    children={grandChildComments}
                                    isChild={true}/>;
            }
        }
        return childComments;
    }

    generateGrandChildComments(comment) {
        let childCommentInfo = {};
        let childComments = [];
        for (let i = 0; i < comment.data.replies.data.children.length; i++) {
            // As long as it is a reply and not a list of IDs
            if (comment.data.replies.data.children[i].kind !== 'more'){
                let data = comment.data.replies.data.children[i].data;
                childCommentInfo = {
                    created_utc: convertDate(data.created_utc),
                    author: ' ' + data.author,
                    authorLink: 'https://www.reddit.com/user/' + data.author,
                    score: data.score_hidden ? '[hidden]' : data.score,
                    body: ReactHtmlParser(decodeHTML(data.body_html))
                };
                
                childComments[i] = <Comment 
                                    commentInfo={childCommentInfo} 
                                    theme={this.props.theme} 
                                    key={data.id}
                                    isGrandChild={true}/>;
            }
        }
        return childComments;
    }

    render() {
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
                            <div className='post-comments-container'>{this.state.comments}</div>
                        </div> 
                    </Animated>
                }
            </div>
        );
    }
}