'use strict';

function PostHelper(url) {
    this.__init__(url);
}

PostHelper.prototype = {

    // States.
    waiting_on_reply: null,
    //url: null,

    __init__: function(url) {
        this.url = url;
    },

    perform_post: function(post_data, callback) {
        var self = this;
        this.waiting_on_reply = true;
        // DELETE_FOR_PROD_START
        l('Performing a post with the following data for the url : {' + self.url + '}');
        l(post_data);
        // DELETE_FOR_PROD_END


        // From : https://stackoverflow.com/questions/9713058/send-post-data-using-xmlhttprequest
        const http = new XMLHttpRequest();
        http.open('POST', this.url, true);
        http.setRequestHeader('Content-type', 'application/json');
        http.send(JSON.stringify(post_data));

        http.onload = function() {
            l('POST onload response :');
            l(http.responseText);
            l(http);
            self.waiting_on_reply = false;
        };


        /*
        $.post(self.url, post_data, function(data, status) {
            if (status === 'success') {
                callback(data);
            } else {
                GUI_TYPING_INTERFACE.add_server_message('POST failed for ' + self.url);
                callback(status);
            }
            self.waiting_on_reply = false;
        });
        */
    }
};