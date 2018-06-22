export class SubredditAPI {
    constructor(subreddit, direction, id, filter, sortBy) {
        try {
            if (direction === 'after') {
                return fetch(`https://www.reddit.com/r/${subreddit}/${filter}.json?limit=15&t=${sortBy}&after=t3_${id}`).then(this.handleErrors)
                .then(results => {
                    return results.json();
                }).catch(() => {
                    console.log('Failed to fetch posts.');
                });
            } else if (direction === 'before') {
                return fetch(`https://www.reddit.com/r/${subreddit}/${filter}.json?limit=15&t=${sortBy}&before=t3_${id}`).then(this.handleErrors)
                .then(results => {
                    return results.json();
                }).catch(() => {
                    console.log('Failed to fetch posts.');
                });
            } else {
                return fetch(`https://www.reddit.com/r/${subreddit}/${filter}.json?limit=15&t=${sortBy}`).then(this.handleErrors)
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
    constructor(subreddit, id) {
        try {
            return fetch(`https://www.reddit.com/r/${subreddit}/comments/${id}.json`).then(this.handleErrors)
            .then(results => {
                return results.json();
            }).catch(() => {
                console.log('Failed to fetch posts.');
            });
        } catch(e) {
            console.log('Could not fetch posts.')
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
        try {
           return fetch(`https://www.reddit.com/subreddits/search.json?q=${subreddit}&limit=10`).then(this.handleErrors)
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