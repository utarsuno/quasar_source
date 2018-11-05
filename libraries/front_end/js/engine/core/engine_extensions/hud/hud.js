'use strict';

$_QE.prototype.HUDElement = function() {};
Object.assign(
    $_QE.prototype.HUDElement.prototype,
    $_QE.prototype.FeatureSize.prototype,
    $_QE.prototype.FeatureColor.prototype,
    $_QE.prototype.DomCanvasExternal.prototype,
    {
        initialize_hud_element: function(number_of_visible_rows, width, font, canvas_id) {
            this.initialize_dom_canvas(canvas_id);
            this.initialize_renderer_text(font, number_of_visible_rows, width);
        },
    }
);

Object.assign($_QE.prototype,
    {
        _initialize_hud_critical: function() {
            this.pause_background = new $_QE.prototype.DomElementExternal().initialize_dom_element(GLOBAL_ID_PAUSED_BACKGROUND_FILTER);
            this.pause_menu       = new $_QE.prototype.DomElementExternal().initialize_dom_element(GLOBAL_ID_PAUSE_DISPLAY, 'table');
            this.pause_title      = new $_QE.prototype.DomTextExternal().initialize_dom_text(GLOBAL_ID_SUB_PAUSED_DISPLAY_TITLE);
            this.pause_sub_title  = new $_QE.prototype.DomTextExternal().initialize_dom_text(GLOBAL_ID_SUB_PAUSED_DISPLAY_SUB_TITLE);
        },

        _initialize_hud: function() {
            this.hud_debug     = new $_QE.prototype.HUDDebug().__init__(this);
            this.hud_chat      = new $_QE.prototype.HUDLogs().__init__(32);
            this.hud_typing    = new $_QE.prototype.HUDUserTyping().__init__(this.application);
            this.hud_date_time = new $_QE.prototype.HUDDateTime().__init__(this);

            //this._add_hud_element(this.manager_world.player_cursor);
        },

        hud_update: function() {
            this.hud_debug.content_update();
            this.hud_debug.update();
            this.hud_date_time.update();
            this.hud_typing.update();
            this.hud_chat.update();

            this.manager_world.player_cursor.update();
        },

        pause_menu_show_error: function (title, sub_title) {
            this.pause_menu_set_title_and_sub_title(title, sub_title);
            this._show_pause_menu();
        },

        pause_menu_show: function() {
            this.pause_menu_set_title_and_sub_title('Paused 😴', 'double click to resume');
            this._show_pause_menu();
        },

        pause_menu_set_sub_title: function(sub_title) {
            this.pause_sub_title.update_text(sub_title);
        },

        pause_menu_set_title_and_sub_title: function(title, sub_title) {
            this.pause_title.update_text(title);
            this.pause_sub_title.update_text(sub_title);
        },

        _show_pause_menu: function() {
            this.pause_menu.show();
            this.pause_background.show();
        },

        _hide_pause_menu: function() {
            this.pause_menu.hide();
            this.pause_background.hide();
        },
    }
);
