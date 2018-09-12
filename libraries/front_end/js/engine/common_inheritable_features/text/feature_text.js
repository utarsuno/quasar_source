'use strict';

$_QE.prototype.FeatureText = function(text) {

    if (is_defined(text)) {
        this.text = text;
    } else {
        this.text = '';
    }

    // TODO: Rename this (or remove).
    //this.update_needed_for_text = false;

    /*___  ___     ___     __   __   ___  __       ___    __        __
       |  |__  \_/  |     /  \ |__) |__  |__)  /\   |  | /  \ |\ | /__`
       |  |___ / \  |     \__/ |    |___ |  \ /~~\  |  | \__/ | \| .__/ */
    this.update_text = function(text) {
        if (this.text !== text) {
            //if (is_defined(this.value_pre_changed_function)) {
            if (this.value_pre_changed_function != null) {
                this.value_pre_changed_function(text);
            }
            this.text = text;
            //if (is_defined(this.value_post_changed_function)) {
            if (this.value_post_changed_function != null) {
                this.value_post_changed_function(text);
            }
            //this.update_needed_for_text = true;

            // TODO: move this?
            if (is_defined(this._element)) {
                this._element.innerHTML = this.text;
            }
        }
    };

    this.clear = function() {
        this.update_text('');
    };

    this.add_character = function(character) {
        this.update_text(this.get_text() + character);
    };

    this.pop_character = function() {
        if (this.text.length > 0) {
            this.update_text(this.text.slice(0, -1));
        }
    };

    this.on_paste_event = function(text) {
        this.update_text(this.text + text);
        //this.text += text;
        //this.update_needed_for_text = true;
    };

    this.parse_text = function(text) {
        let i;
        for (i = 0; i < text.length; i++) {
            this.add_character(text.charAt(i));
        }
    };

    /*__   ___ ___ ___  ___  __   __
     / _` |__   |   |  |__  |__) /__`
     \__> |___  |   |  |___ |  \ .__/ */
    this.get_text_length_without_whitespaces = function() {
        return this.text.replace(' ', '').replace('\t', '').length;
    };

    this.get_text = function() {
        return this.text;
    };

    this.get_text_and_clear = function() {
        let t = this.text;
        this.clear();
        return t;
    };

    // TODO: Remove this function.
    this.get_display_text = function() {
        if (this._is_password) {
            let t = '';
            for (let c = 0; c < this.text.length; c++) {
                t += '*';
            }
            return t;
        }
        return this.text;
    };
};