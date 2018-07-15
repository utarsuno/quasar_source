'use strict';

$_QE.prototype.FeatureTextLines = function(max_rows) {

    this.max_rows = max_rows;
    this.rows = [];

    this.add_row = function(content) {
        this.rows.unshift(new $_QE.prototype.FeatureTextLine(content, null));
        //this.rows.push(new $_QE.prototype.CanvasTextRow(content, null, this));
        this.update_needed_for_text = true;
    };

};