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
        // FOR_DEV_START
        l('Performing a post with the following data for the url : {' + self.url + '}');
        l(post_data);
        //l(JSON.stringify(post_data));
        // FOR_DEV_END


        // From : https://stackoverflow.com/questions/9713058/send-post-data-using-xmlhttprequest
        const http = new XMLHttpRequest();
        http.open('POST', this.url, true);
        http.setRequestHeader('Content-type', 'application/json');
        http.send(JSON.stringify(post_data));

        http.onload = function() {
            // FOR_DEV_START
            l('POST onload response :');
            // FOR_DEV_END

            // if (xhr.readyState == 4 && xhr.status == 200) {

            callback(http.responseText);
            self.waiting_on_reply = false;
        };
    }
};
