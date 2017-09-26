'use strict'

function PostHelper(url) {
    this.__init__(url)
}

PostHelper.prototype = {
    // States.
    message_being_sent: null,
    waiting_on_reply:   null,

    url: null,

    __init__: function(url) {
        this.url = url
    },

    perform_post: function(post_data, callback) {
        $.post(this.url, post_data, function(data, status) {
            if (status === 'success') {
                callback(data)
            } else {
                callback(status)
            }
        })
    }
}