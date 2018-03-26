'use strict';

function TextAbstraction(text) {

    this.bold = false;
    this.centered = false;

    this.text         = text;
    this.text_changed = false;

    this.update_text = function(text) {
        if (this.get_text() !== text) {
            if (is_defined(this.value_pre_changed_function)) {
                this.value_pre_changed_function(text);
            }
            this.text = text;
            if (is_defined(this.value_post_changed_function)) {
                this.value_post_changed_function(text);
            }
            this.text_changed = true;
            this.refresh();
        }
    };

    this.clear = function() {
        this.update_text('');
    };

    this._add_character = function(character) {
        this.update_text(this.get_text() + character);
    };

    this._pop_character = function() {
        var t = this.get_text();
        this.update_text(t.slice(0, -1));
    };

    this.parse_text = function(text) {
        for (var i = 0; i < text.length; i++) {
            this._add_character(text.charAt(i));
        }
    };

    this.parse_keycode = function(event) {
        var keycode = event.keyCode;

        if (keycode === KEY_CODE_DELETE) {
            if (this.get_text().length > 0) {
                this._pop_character();
                MANAGER_AUDIO.play_typing_sound();
            }
        } else if (event.key.length === 1) {
            this._add_character(event.key);
            MANAGER_AUDIO.play_typing_sound();
        }
    };

    /*__   ___ ___ ___  ___  __   __
     / _` |__   |   |  |__  |__) /__`
     \__> |___  |   |  |___ |  \ .__/ */
    this.get_text_as_value = function() {
        return parseInt(this.get_text());
    };

    this.get_text = function() {
        return this.text;
    };
}