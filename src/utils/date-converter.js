export function convertDate(time) {
    let timeNow = Math.round(Date.now() / 1000);
    let timeDif = (timeNow - (time)) / 60;
    let timeSincePost;
    // console.log(this.props.title + ': ' + timeDif)
    if (timeDif >= 2 && timeDif <= 60) {
        // Between 2 minutes and an hour
        timeSincePost = Math.floor(timeDif) + ' minutes ago';
    } else if (timeDif > 60 && timeDif < 120) {
        // One hour
        timeSincePost = ' an hour ago';
    } else if (timeDif >= 120 && timeDif <= 1440) {
        // Betwen 2 hours and one day
        timeSincePost = Math.floor((timeDif) / 60) + ' hours ago';
    } else if (timeDif > 1440 && timeDif <= 2880) {
        // One day
        timeSincePost = ' one day ago';
    } else if (timeDif > 2880 && timeDif <= 43800) {
        // Between 2 days and one month
        timeSincePost = Math.floor((timeDif) / (60 * 24)) + ' days ago';
    } else if (timeDif > 43800 && timeDif <= 87600) {
        // One month
        timeSincePost = ' one month ago';
    } else if (timeDif > 87600 && timeDif <= 525600) {
        // Between 2 months and a year
        timeSincePost = Math.floor((timeDif) / (60 * 24 * 30)) + ' months ago';
    } else if (timeDif > 525600 && timeDif <= 1036800) {
        // One year
        timeSincePost = ' one year ago';
    } else if (timeDif > 1036800) {
        // Over one year
        timeSincePost = Math.floor((timeDif) / (60 * 24 * 30 * 12)) + ' years ago';
    } else {
        // Less than a minute
        timeSincePost = 'now';
    }
    return timeSincePost;
}