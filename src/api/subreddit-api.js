export class SubredditAPI {
    constructor(subreddit, direction, id, filter, sortBy) {
        if (direction === 'after') {
            return fetch(`https://www.reddit.com/r/${subreddit}/${filter}.json?limit=15${sortBy}&after=t3_${id}`).then(results => {
                return results.json();
            });
        } else if (direction === 'before') {
            return fetch(`https://www.reddit.com/r/${subreddit}/${filter}.json?limit=15${sortBy}&before=t3_${id}`).then(results => {
                return results.json();
            });
        } else {
            return fetch(`https://www.reddit.com/r/${subreddit}/${filter}.json?limit=15${sortBy}`).then(results => {
                return results.json();
            })
        }
    }
}

export class PostAPI {
    constructor(subreddit, id) {
        return fetch(`https://www.reddit.com/r/${subreddit}/comments/${id}.json`).then(results => {
            return results.json();
        })
    }
}

// export class PostAPI {
//     constructor(id) {
//         return fetch('https://www.reddit.com/r/heroesofthestorm/comments/8pbl0x.json').then(results => {
//             return results.json();
//         })
//     }
// }
