export class RedditAPI {
    constructor(direction, id, filter) {
        if(filter === 'top') {
            return fetch(`https://www.reddit.com/r/heroesofthestorm/top.json?limit=15&sort=top&t=all&after=t3_${id}`).then(results => {
                return results.json();
            });
        }
        if (direction === 'after') {
            return fetch(`https://www.reddit.com/r/heroesofthestorm/${filter}.json?limit=15&after=t3_${id}`).then(results => {
                return results.json();
            });
        } else if (direction === 'before') {
            return fetch(`https://www.reddit.com/r/heroesofthestorm/${filter}.json?limit=15&before=t3_${id}`).then(results => {
                return results.json();
            });
        } else {
            return fetch(`https://www.reddit.com/r/heroesofthestorm/${filter}.json?limit=15`).then(results => {
                return results.json();
            })
        }
    }
}
