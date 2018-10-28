'use strict';




$_QE.prototype.FloatingButton = function(world, width, text_height, text, engage_function, cacheable) {
    // Inherit.
    $_QE.prototype.Text2D.call(this, world, width, text_height, text, cacheable);
    this.override_background_color = FLOATING_TEXT_BACKGROUND_DEFAULT;
    this.set_text_property_centered(true);
    this.set_text_property_bold(true);

    this.set_to_clickable();

    this.set_button_engage_function(engage_function);

    this.set_foreground_color(QE.COLOR_YELLOW);
    this.initialize();

    this.has_button_state = false;

    this.set_button_engage_function = function(engage_function) {
        if (engage_function != null) {
            this.button_engage_function = engage_function;
            this.set_engage_function(this.try_to_perform_engage_function.bind(this));
        }
    };

    this.add_button_state = function() {
        if (!this.has_button_state) {
            ButtonState.call(this);
            this.has_button_state = true;
        }
    };

    this.try_to_perform_engage_function = function() {
        if (this.has_button_state) {
            if (this.enabled()) {
                this.button_engage_function();
            }
        } else {
            this.button_engage_function();
        }
    };

};
