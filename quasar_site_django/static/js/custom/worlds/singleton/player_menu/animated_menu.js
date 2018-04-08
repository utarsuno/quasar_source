'use strict';

function MenuSection(name, parent_menu) {
    this.__init__(name, parent_menu);
}

MenuSection.prototype = {
    __init__: function(name, parent_menu) {
        this.section_name = name;
        this.parent_menu  = parent_menu;
        this.rows         = [];
        if (is_defined(this.section_name)) {
            this.rows.push(this.parent_menu._add_text(this.section_name));
        }
    },
    add_button: function(button_name, icon, button_action) {
        this.rows.push(this.parent_menu._add_button(button_name, icon, button_action));
    },
    add_button_for_sub_menu: function(animated_menu, world) {
        var row = this.parent_menu._add_button_for_sub_menu(animated_menu);
        var button = row.get_element();
        this.rows.push(row);
        animated_menu.parent_menu = this;
        this.parent_menu.child_menus.push(animated_menu);
        animated_menu.create(world, button);
    }
};

function AnimatedMenu(name, icon) {
    this.__init__(name, icon);
}

AnimatedMenu.prototype = {

    __init__: function(name, icon) {
        this.menu_name = name;
        this.menu_icon = icon;

        // Parent/child menus.
        this.parent_menu = null;
        this.child_menus = [];

        // Menu sections.
        this.sections = [];

        // Constants.
        this.text_height = 16;
        this.menu_width  = 120;
    },

    hide: function() {
        this.menu.hide_self_and_all_child_attachments_recursively();
        this.hide_all_child_menus();
    },

    show: function() {
        this.menu.display_self_and_all_child_attachments_recursively();
        this.menu.refresh_position_and_look_at();
    },

    hide_all_sibling_menus_and_display_self: function(menu_to_display) {
        this.hide_all_child_menus();
        menu_to_display.menu.force_display_self_and_all_child_attachments_recursively();
        menu_to_display.menu.refresh_position_and_look_at();
    },

    hide_all_child_menus: function() {
        for (var m = 0; m < this.child_menus.length; m++) {
            this.child_menus[m].menu.force_hide_self_and_all_child_attachments_recursively();
        }
    },

    create: function(world, button_to_attach_off_of) {
        if (!is_defined(button_to_attach_off_of)) {
            var temp_position = new THREE.Vector3(0, 0, 0);
            var temp_normal = new THREE.Vector3(0, 0, 0);
            this.menu = new FloatingWall(this.menu_width, 100, temp_position, temp_normal, world);
            this.menu.set_attachment_horizontal_offset(-30, null);
            this.menu.set_attachment_vertical_offset(-30, null);
            this.menu.set_attachment_depth_offset(300);
        } else {
            this.menu.set_attachment_horizontal_offset(0, 0);
            this.menu.set_attachment_vertical_offset(150, 0);
            this.menu.set_attachment_depth_offset(0);
            button_to_attach_off_of.add_attachment(this.menu);
            //this.menu = button_to_attach_off_of.add_floating_wall_attachment(this.menu_width, 200, [150, null], null, null, false);
        }
        this.menu.make_base_wall_invisible();
        //this.menu.hide_self_and_all_child_attachments_recursively();
        this.menu.force_hide_self_and_all_child_attachments_recursively();
    },

    _add_button_for_sub_menu: function(animated_menu) {
        return this._add_button(animated_menu.menu_name, animated_menu.menu_icon, this.hide_all_sibling_menus_and_display_self.bind(this, this));
    },

    _add_button: function(button_name, icon, button_action) {
        var row = this.menu.add_row(null);
        var button = row.add_button([0, 1, false], this.text_height, button_name, button_action);
        button.add_icon_left(icon);
        return row;
    },

    _add_text: function(text) {
        var row = this.menu.add_row(null);
        row.add_text_2D([0, 1, false], this.text_height, text);
        return row;
    },

    add_section: function(section_name) {
        var section = new MenuSection(section_name, this);
        this.sections.push(section);
        return section;
    }

};