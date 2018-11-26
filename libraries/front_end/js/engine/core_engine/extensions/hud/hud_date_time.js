'use strict';

$_QE.prototype.HUDDateTime = function() {};

Object.assign(
    $_QE.prototype.HUDDateTime.prototype,
    $_QE.prototype.HUDTextLines.prototype,
    {
        __init__: function(engine) {
            this.engine = engine;

            this.set_foreground_color(QE.COLOR_RGB_GREEN_LIGHT);

            this.initialize_hud_element(2, 400, QE.FONT_ARIAL_12, GLOBAL_ID_DATE_TIME);

            this.rows[0].set_text_alignment(TEXT_ALIGNMENT_END);
            this.rows[1].set_text_alignment(TEXT_ALIGNMENT_END);

            // TODO: Eventually have this be updating.
            this.rows[1].set_text(this.engine.manager_time.get_current_date_header());

            this._time = new $_QE.prototype.DisplayDateTime(this.rows[0]);

            return this;
        },

        refresh: function() {
            this.engine.manager_time.refresh();
            this._time.set(this.engine.manager_time.get_current_time_header());
            //this.rows[0].set_text(this.engine.manager_time.get_current_time_header());
        },

    }

);

