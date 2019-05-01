'use strict';

$_QE.prototype.FloatingIcon = function(args) {
    this._initialize_floating_icon(args);
};

Object.assign(
    $_QE.prototype.FloatingIcon.prototype,
    $_QE.prototype.FloatingElementColor.prototype,
    {
        _initialize_floating_icon: function(args) {
            this.icon_type = args[ARG_ICON];

            this.__init__floating_element();
            if (args[ARG_COLOR_FOREGROUND] == null) {
                args[ARG_COLOR_FOREGROUND] = QE.COLOR_GREEN;
            }
            this._parse_arguments_color(args);
            this.set_dimensions(args[ARG_SIZE], args[ARG_SIZE]);

            args[ARG_GEOMETRY_TYPE]  = FEATURE_GEOMETRY_TYPE_PLANE;
            args[ARG_MATERIAL_TYPE]  = FEATURE_MATERIAL_TYPE_ICON;
            args[ARG_CACHE_GEOMETRY] = true;
            args[ARG_CACHE_MATERIAL] = true;
            this._parse_arguments_engine(args);
        },

        create: function() {
            this._create_engine_objects();
            this.set_event(ELEMENT_EVENT_ON_FOREGROUND_COLOR, this.current_foreground_color_changed.bind(this));
            this.current_foreground_color_changed();
        },

        /*__   __        __   __      __   __   ___  __       ___    __        __
         /  ` /  \ |    /  \ |__)    /  \ |__) |__  |__)  /\   |  | /  \ |\ | /__`
         \__, \__/ |___ \__/ |  \    \__/ |    |___ |  \ /~~\  |  | \__/ | \| .__/ */
        current_foreground_color_changed: function() {
            this.shader_material.set_color(this.current_foreground_color);
        },

        switch_icon: function(icon) {
            if (this.icon_type !== icon) {
                this.shader_material.set_icon(icon);
                this.icon_type = icon;
            }
        },

        switch_icon_and_color: function(icon, color) {
            this.shader_material.set_color(color);
            this.switch_icon(icon);
        },
    }
);