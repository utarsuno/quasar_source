'use strict';

$_QE.prototype.FeatureTextLine = function(typeable) {

    this.segments       = [];
    this.colors         = [];

    this.segments_by_color = {};

    this.segments_by_color[QE.COLOR_CANVAS_GREEN] = [];
    this.segments_by_color[QE.COLOR_CANVAS_YELLOW] = [];
    this.segments_by_color[QE.COLOR_CANVAS_TEAL] = [];
    this.segments_by_color[QE.COLOR_CANVAS_GRAY] = [];

    this.update_needed_for_line = true;

    this.set_content = function(content, color) {
        this.segments = [content];
        this.colors   = [color];
        this.segments_by_color[color] = [content];
        this.update_needed_for_line = true;
    };

    this._add_text = function(content, color) {
        this.segments.push(content);
        this.colors.push(color);

        this.segments_by_color[color].push(content);
    };

    this.add_text_to_line = function(content, color) {
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
    };

    this.get_segments_for_color = function(c) {
        return this.segments_by_color[c];
    };

    this.calculate_segment_offsets = function() {
        let c;
        l('CALCULATE SEGMENT!');
        for (c = 0; c < this.colors.length; c++) {
            if (this.colors[c] === $_QE.prototype.COLOR_CANVAS_GREEN) {
                l('CALCULATE SEGMENT!');


            }
        }
    };

    if (typeable) {
        $_QE.prototype.FeatureTyping.call(this);
    }
};