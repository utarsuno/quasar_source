'use strict';

$_QE.prototype.FeatureText = function(text) {
    if (is_defined(text)) {
        this.text = text;
    } else {
        this.text = '';
    }
    this.update_needed_for_text = false;

    /*___  ___     ___     __   __   ___  __       ___    __        __
       |  |__  \_/  |     /  \ |__) |__  |__)  /\   |  | /  \ |\ | /__`
       |  |___ / \  |     \__/ |    |___ |  \ /~~\  |  | \__/ | \| .__/ */
    this.update_text = function(text) {
        if (this.text !== text) {
            if (is_defined(this.value_pre_changed_function)) {
                this.value_pre_changed_function(text);
            }
            this.text = text;
            if (is_defined(this.value_post_changed_function)) {
                this.value_post_changed_function(text);
            }
            this.update_needed_for_text = true;

            if (is_defined(this._element)) {
                this._element.innerHTML = this.text;
            }
        }
    };

    this.clear = function() {
        this.update_text('');
    };

    this._add_character = function(character) {
        this.update_text(this.get_text() + character);
    };

    this._pop_character = function() {
        let t = this.get_text();
        this.update_text(t.slice(0, -1));
    };

    this.parse_text = function(text) {
        let i;
        for (i = 0; i < text.length; i++) {
            this._add_character(text.charAt(i));
        }
    };

    this.mobile_add_character = function(key) {
        this._add_character(key);
        //MANAGER_AUDIO.play_typing_sound();
    };

    this.mobile_delete_character = function() {
        if (this.get_text().length > 0) {
            this._pop_character();
            //MANAGER_AUDIO.play_typing_sound();
        }
    };

    /*__   ___ ___ ___  ___  __   __
     / _` |__   |   |  |__  |__) /__`
     \__> |___  |   |  |___ |  \ .__/ */
    this.get_text_length_without_whitespaces = function() {
        return this.text.replace(' ', '').replace('\t', '').length;
    };

    this.get_text_as_value = function() {
        return parseInt(this.get_text());
    };

    this.get_text = function() {
        return this.text;
    };

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