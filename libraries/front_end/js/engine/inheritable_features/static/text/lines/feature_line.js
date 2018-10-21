'use strict';

$_QE.prototype.FeatureTextLine = function() {};

Object.assign($_QE.prototype.FeatureTextLine.prototype,
    {
        segments              : [],
        colors                : [],
        // Green, yellow, teal, gray.
        segments_by_color     : {
            'rgb(157,255,113,0.75)': [],
            'rgb(242,255,102,0.75)': [],
            'rgb(167,248,255,0.75)': [],
            'rgb(41,41,41,0.45)'   : [],
        },
        update_needed_for_line: false,

        set_to_typeable: function(on_enter_callback) {
            $_QE.prototype.FeatureTyping.call(this, null, null, function() {
                self.update_needed_for_line = true;
            }, on_enter_callback);
        },

        set_content: function(content, color) {
            this.segments                 = [content];
            this.colors                   = [color];
            this.segments_by_color[color] = [content];
            this.update_needed_for_line   = true;
        },

        _add_text: function(content, color) {
            this.segments.push(content);
            this.colors.push(color);
            this.segments_by_color[color].push(content);
        },

        add_text_to_line: function(content, color) {
            if (this.colors.length > 0) {
                if (color !== this.colors[this.colors.length - 1]) {
                    this._add_text(content, color);
                } else {
                    this.segments[this.segments.length - 1] += content;
                }
            } else {
                this._add_text(content, color);
            }
            this.update_needed_for_line = true;
        },

        get_segments_for_color: function(c) {
            return this.segments_by_color[c];
        },
    }
);


/*
    this.calculate_segment_offsets = function() {
        let c;
        l('CALCULATE SEGMENT!');
        for (c = 0; c < this.colors.length; c++) {
            if (this.colors[c] === COLOR_CANVAS_GREEN) {
                l('CALCULATE SEGMENT!');
            }
        }
    };
*/