const numPosts = 25;
export const defaultSubreddit = 'all';

export class SubredditAPI {
    constructor(subreddit, direction, id, filter, sortBy) {
        try {
            if (direction === 'after') {
                return fetch(`https://www.reddit.com/r/${subreddit}/${filter}.json?limit=${numPosts}&t=${sortBy}&after=t3_${id}`).then(this.handleErrors)
                .then(results => {
                    return results.json();
                }).catch(() => {
                    console.log('Failed to fetch posts.');
                });
            } else if (direction === 'before') {
                return fetch(`https://www.reddit.com/r/${subreddit}/${filter}.json?limit=${numPosts}&t=${sortBy}&before=t3_${id}`).then(this.handleErrors)
                .then(results => {
                    return results.json();
                }).catch(() => {
                    console.log('Failed to fetch posts.');
                });
            } else {
                return fetch(`https://www.reddit.com/r/${subreddit}/${filter}.json?limit=${numPosts}&t=${sortBy}`).then(this.handleErrors)
                .then(results => {
                    return results.json();
                }).catch(() => {
                    console.log('Failed to fetch posts.');
                });
            }
        } catch (e) {
            console.log('Could not fetch posts.');
        }

    }

    handleErrors(response) {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response;
    }
}

export class PostAPI {
    // &sort=
    constructor(subreddit, id) {
        let url = `https://www.reddit.com/r/${subreddit}/comments/${id}.json`;
        try {
            return fetch(url).then(this.handleErrors)
            .then(results => {
                caches.open('post-cache').then(cache => {
                    cache.add(url);
                    // cache.keys().then(function(cachedRequests) { 
                    //     console.log(cachedRequests); // [Request, Request]
                    // });
                })
                return results.json();
            }).catch(() => {
                console.log('Failed to fetch posts.');
            });
        } catch(e) {
            console.log('Failed to fetch posts.');
        }
    }
    handleErrors(response) {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response;
    }
}

export class SubredditSearchAPI {
    constructor(subreddit) {
        let url = `https://www.reddit.com/subreddits/search.json?q=${subreddit}&limit=10`;
        try {
           return fetch(url).then(this.handleErrors)
           .then(results => {
               return results.json();
           }).catch(() => {
               console.log('Failed to fetch subreddits');
           });
        } catch(e) {
            console.log('Could not fetch subreddits');
        }
    }

    handleErrors(response) {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response;
    }
}