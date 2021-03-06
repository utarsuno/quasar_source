$_QE.prototype.FeatureText = function() {};

Object.assign(
    $_QE.prototype.FeatureText.prototype,
    {
        set_value_post_changed_event: function(f) {
            this.value_post_changed_function = f;
        },

        /*___  ___     ___     __   __   ___  __       ___    __        __
           |  |__  \_/  |     /  \ |__) |__  |__)  /\   |  | /  \ |\ | /__`
           |  |___ / \  |     \__/ |    |___ |  \ /~~\  |  | \__/ | \| .__/ */
        update_text: function(text) {
            if (this.text !== text) {
                this.text = text;
                if (this.value_post_changed_function !== null) {
                    this.value_post_changed_function(text);
                }
            }
        },

        clear: function() {
            this.update_text('');
        },

        add_character: function(character) {
            if (character === '\n' || character === '\r\n' || character === '\\n') {
                l('new line!');
            }
            this.update_text(this.text + character);
        },

        pop_character: function() {
            if (this.text.length > 0) {
                this.update_text(this.text.slice(0, -1));
            }
        },

        on_paste_event: function(text) {
            this.update_text(this.text + text);
        },

        /*__   ___ ___ ___  ___  __   __
         / _` |__   |   |  |__  |__) /__`
         \__> |___  |   |  |___ |  \ .__/ */
        get_text_length_without_whitespaces: function() {
            return this.text.replace(' ', '').replace('\t', '').length;
        },

        get_text_and_clear: function() {
            let t = this.text;
            this.clear();
            return t;
        },
    }
);
