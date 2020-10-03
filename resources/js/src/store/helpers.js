var moment = require("moment");
export default {
    cutText(text, length) {
        if (text.split(' ').length > 1) {
            var string = text.substring(0, length)
            var splitText = string.split(' ')
            splitText.pop()
            return splitText.join(' ') + '...'
        } else {
            return text
        }
    },
    formatDate(date) {
        return moment(date).format('YYYY-MM-DD HH:mm:ss')
    },
    formatDuration(d) {
        const arr = d.split(':')
        return arr[0] + 'h' + arr[1] + 'm'
    },
    capitalizeFirstLetter(string) {
        if (string) {
            return string.charAt(0).toUpperCase() + string.slice(1)
        }
    }
}