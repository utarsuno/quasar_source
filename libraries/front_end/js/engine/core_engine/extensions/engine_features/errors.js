'use strict';

Object.assign($_QE.prototype, {

    _log_history: {
        'errors_fatal': [],
        'errors'      : [],
        'warnings'    : [],
        'output'      : []
    },

    fatal_error: function(message, js_stack_trace=null) {
        this._log_history['errors'].push([message, js_stack_trace]);
        if (js_stack_trace != null) {
            l('------------------------------');
            l(js_stack_trace);
        }
        l('------------------------------');
        l(message);
        l('------------------------------');
        QE.hud_chat.add_message_error(message);
        this.pause_menu_show_error('Error ' + EMOJI_ERROR, message);
        throw {
            name   : 'CustomException',
            message: message
        };
    },

    log_error: function(message, data) {
        this._log_history['errors'].push([message, data]);
        w('Error: ' + message);
        QE.hud_chat.add_message_error(message);
        this._print_error_ending(data);
    },

    log_warning: function(message, data) {
        this._log_history['warnings'].push([message, data]);
        w('Warning: ' + message);
        QE.hud_chat.add_message_warning(message);
        this._print_error_ending(data);
    },

    //

    _print_error_ending: function(data) {
        l(data);
        l('-----------------------------------------');
    },

});
