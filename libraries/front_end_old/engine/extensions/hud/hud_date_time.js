$_QE.prototype.HUDDateTime = function() {};

Object.assign(
    $_QE.prototype.HUDDateTime.prototype,
    $_QE.prototype.HUDTextLines.prototype,
    {
        __init__: function(engine) {
            this.engine = engine;

            this.__init__hud_element({
                ARG_NUMBER_OF_ROWS  : 2,
                ARG_WIDTH           : 400,
                ARG_DOM_ELEMENT_ID  : GLOBAL_ID_DATE_TIME,
                ARG_COLOR_FOREGROUND: QE.COLOR_RGB_GREEN_LIGHT
            });

            this.rows[0].set_text_alignment(TEXT_ALIGNMENT_END);
            this.rows[1].set_text_alignment(TEXT_ALIGNMENT_END);

            // TODO: Eventually have this be updating.
            this.rows[1].set_text(this.engine.get_current_date_header());
            this.rows[0].set_text(this.engine.get_current_time_header());

            return this;
        },

        content_update: function() {
            this.engine.refresh_time();
            this.rows[0].set_text(this.engine.get_current_time_header(), QE.COLOR_RGB_GREEN_LIGHT);
        },

    }

);

