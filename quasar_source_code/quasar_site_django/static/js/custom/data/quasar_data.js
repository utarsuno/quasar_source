'use strict';

// TODO just reference the actual code files later on
const POST_URL_GET_ALL_DATA = '/get_all_data';
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

    perform_get: function(callback) {
        var self = this;
        this.waiting_on_reply = true;
        // DELETE_FOR_PROD_START
        console.log('Performing a GET with the following data for the url : {' + self.url + '}');
        //l(JSON.stringify(post_data));
        // DELETE_FOR_PROD_END


        // From : https://stackoverflow.com/questions/9713058/send-post-data-using-xmlhttprequest
        const http = new XMLHttpRequest();
        http.open('GET', this.url, true);
        //http.send(JSON.stringify(post_data));
        http.send(null);

        http.onload = function() {
            //console.log('POST onload response :');
            //console.log(http);
            //console.log(http.responseText);
            // if (xhr.readyState == 4 && xhr.status == 200) {

            callback(http.responseText);
            self.waiting_on_reply = false;
        };
    }
};

// Currently just used for debugging server side information and state.
function GlobalPostCall(url, text_area_element) {
    this.__init__(url, text_area_element);
}

GlobalPostCall.prototype = {
    default_callback: function(data) {
        //console.log('The callback got this data back');
        //console.log(data);
        //console.log(arguments);

        var lines = data.split('\n');
        for (var i = 0; i < lines.length; i++) {
            text_area_element.innerHTML = text_area_element.innerHTML + lines[i] + '\n';
        }
    },
    __init__: function(url, text_area_element) {
        this.post_call = new PostHelper(url);
        this.text_area_element = text_area_element;
    },
    perform_call: function() {
        this.text_area_element.innerHTML = '';
        this.post_call.perform_get(this.default_callback.bind(this));
    }
};


var text_area_element = document.getElementById('custom_text_area');

var post_call_get_all_data = new GlobalPostCall(POST_URL_GET_ALL_DATA, text_area_element);
var post_call_get_all_server_cache = new GlobalPostCall(POST_URL_GET_ALL_SERVER_CACHE, text_area_element);

var display_all_button = document.getElementById('display_all_button');
display_all_button.onclick = function() {
    post_call_get_all_data.perform_call();
};