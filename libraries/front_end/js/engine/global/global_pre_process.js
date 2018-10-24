'use strict';


/*
const CELL_PHONE_CARRIERS = {
    'No Value'         : '',
    'AT&T'             : 'number@txt.att.net',
    'T-Mobile'         : 'number@tmomail.net',
    'Verizon'          : 'number@vtext.com',
    'Sprint'           : 'number@pm.sprint.com',
    'Virgin Mobile'    : 'number@vmobl.com',
    'Tracfone'         : 'number@mmst5.tracfone.com',
    'Metro PCS'        : 'number@mymetropcs.com',
    'Boost Mobile'     : 'number@myboostmobile.com',
    'Cricket'          : 'number@mms.cricketwireless.net',
    'Ptel'             : 'number@ptel.com',
    'Republic Wireless': 'number@text.republicwireless.com',
    'Google Fi'        : 'number@msg.fi.google.com',
    'Suncom'           : 'number@tms.suncom.com',
    'Ting'             : 'number@message.ting.com',
    'U.S. Cellular'    : 'number@email.uscc.net',
    'Consumer Cellular': 'number@cingularme.com',
    'C-Spire'          : 'number@cspire1.com',
    'Page Plus'        : 'number@vtext.com'
};



// From : https://stackoverflow.com/questions/12623272/how-to-check-if-a-string-array-contains-one-string-in-javascript
Array.prototype.contains = function(element) {
    return this.indexOf(element) > -1;
};

function int(f) {
    return f | 0;
}

// From : https://stackoverflow.com/questions/4059147/check-if-a-variable-is-a-string-in-javascript
function is_string(value) {
    return typeof value === 'string';
}

// From : https://stackoverflow.com/questions/4775722/check-if-object-is-array
function is_list(o) {
    return Array.isArray(o);
}

function string_contains(base_string, sub_string) {
    return base_string.indexOf(sub_string) !== NOT_FOUND;
}

// TODO : Remove the 2 functions below.
// Base code from : https://stackoverflow.com/questions/30143082/how-to-get-color-value-from-gradient-by-percentage-with-javascript
var hex = function(x) {
    x = x.toString(16);
    return (x.length == 1) ? '0' + x : x;
};

function get_color_range_list(start_color, end_color, number_of_colors) {
    if (is_list(start_color)) {
        start_color = start_color[COLOR_STRING_INDEX].replace('#', '');
    } else if (start_color.includes('#')) {
        start_color = start_color.replace('#', '');
    }
    if (is_list(end_color)) {
        end_color = end_color[COLOR_STRING_INDEX].replace('#', '');
    } else if (end_color.includes('#')) {
        end_color = end_color.replace('#', '');
    }
    var colors = [];
    for (var c = 0; c < number_of_colors; c++) {
        var ratio = c / number_of_colors;
        var r = Math.ceil(parseInt(end_color.substring(0,2), 16) * ratio + parseInt(start_color.substring(0,2), 16) * (1 - ratio));
        var g = Math.ceil(parseInt(end_color.substring(2,4), 16) * ratio + parseInt(start_color.substring(2,4), 16) * (1 - ratio));
        var b = Math.ceil(parseInt(end_color.substring(4,6), 16) * ratio + parseInt(start_color.substring(4,6), 16) * (1 - ratio));
        colors.push('#' + hex(r) + hex(g) + hex(b));
    }
    return colors;
}



*/