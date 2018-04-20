'use strict';

function FloatingButton(world, width, text_height, text, engage_function) {
    this.__init__(world, width, text_height, text, engage_function);
}

FloatingButton.prototype = {

    __init__: function(world, width, text_height, text, engage_function) {
        // Inherit.
        Text2D.call(this, world, width, text_height, text);
        this.override_background_color = FLOATING_TEXT_BACKGROUND_DEFAULT;
        this.set_text_property_centered(true);

        this.set_to_clickable();

        this.set_button_engage_function(engage_function);

        this.set_foreground_color(COLOR_YELLOW);
        this.initialize();

        this.has_button_state = false;
    },

    set_button_engage_function: function(engage_function) {
        if (is_defined(engage_function)) {
            this.button_engage_function = engage_function;
            this.set_engage_function(this.try_to_perform_engage_function.bind(this));
        }
    },

    add_button_state: function() {
        if (!this.has_button_state) {
            ButtonState.call(this);
            this.has_button_state = true;
        }
    },
    
    try_to_perform_engage_function: function() {
        if (this.has_button_state) {
            if (this.enabled()) {
                this.button_engage_function();
            }
        } else {
            this.button_engage_function();
        }
    },

    /* __  ___      ___  ___     __                  __   ___  __
      /__`  |   /\   |  |__     /  ` |__|  /\  |\ | / _` |__  /__`
      .__/  |  /~~\  |  |___    \__, |  | /~~\ | \| \__> |___ .__/ */
    state_change_look_at: function(being_looked_at) {
        if (being_looked_at) {
            //this.set_background_color(BACKGROUND_COLOR_FOCUS, true);
            MANAGER_RENDERER.outline_glow.set_hover_object(this.object3D);
        } else {
            //this.set_background_color(this.default_background_color, true);
            MANAGER_RENDERER.outline_glow.remove_hover_object(this.object3D);
        }
    }
};