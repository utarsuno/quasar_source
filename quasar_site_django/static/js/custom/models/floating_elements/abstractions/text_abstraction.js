'use strict';

function TextAbstraction(text) {

    this.syntax_rules = [];

    this.bold = false;
    this.centered = false;

    this.text         = text;
    this.text_changed = false;

    /*__           ___              __   __   ___  __       ___    __        __
     /__` \ / |\ |  |   /\  \_/    /  \ |__) |__  |__)  /\   |  | /  \ |\ | /__`
     .__/  |  | \|  |  /~~\ / \    \__/ |    |___ |  \ /~~\  |  | \__/ | \| .__/ */
    this.add_syntax = function(text_syntax) {
        switch (text_syntax) {
        case TEXT_SYNTAX_PASSWORD:
            this.syntax_rules.push(new TextSyntaxPassword());
            break;
        }
    };

    this.syntax_check = function() {
        for (var sr = 0; sr < this.syntax_rules.length; sr++) {
            var results = this.syntax_rules[sr].does_text_pass_requirements(this.text);
            if (!results[0]) {
                return [false, results[1]];
            }
        }
        return [true, null];
    };
    /*___  ___     ___     __   __   ___  __       ___    __        __
       |  |__  \_/  |     /  \ |__) |__  |__)  /\   |  | /  \ |\ | /__`
       |  |___ / \  |     \__/ |    |___ |  \ /~~\  |  | \__/ | \| .__/ */
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
    this.is_password_text = function() {
        for (var s = 0; s < this.syntax_rules.length; s++) {
            if (this.syntax_rules[s].text_syntax_type === TEXT_SYNTAX_PASSWORD) {
                return true;
            }
        }
        return false;
    };

    this.get_text_as_value = function() {
        return parseInt(this.get_text());
    };

    this.get_text = function() {
        return this.text;
    };

    this.get_display_text = function() {
        if (this.is_password_text()) {
            var t = '';
            for (var c = 0; c < this.text.length; c++) {
                t += '*';
            }
            return t;
        }
        return this.text;
    };
}