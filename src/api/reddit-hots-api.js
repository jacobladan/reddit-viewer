export class RedditAPI {
    constructor(direction, id) {
        if (direction === 'after') {
            return fetch(`https://www.reddit.com/r/heroesofthestorm.json?limit=15&after=t3_${id}`).then(results => {
                return results.json();
            });
        } else if (direction === 'before') {
            return fetch(`https://www.reddit.com/r/heroesofthestorm.json?limit=15&before=t3_${id}`).then(results => {
                return results.json();
            });
        } else {
            return fetch(`https://www.reddit.com/r/heroesofthestorm.json?limit=15`).then(results => {
                return results.json();
            })
        }
    }
}
