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
    add_button_for_sub_menu: function(animated_menu) {
        var row = this.parent_menu._add_button_for_sub_menu(animated_menu);
        var button = row.get_element();
        this.rows.push(row);
        animated_menu.parent_menu = this;
        this.parent_menu.child_menus.push(animated_menu);
        //animated_menu.create(world, button);
        animated_menu.menu.set_attachment_horizontal_offset(150, null);
        animated_menu.menu.attach_to(button);
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

    switch_to_new_world: function (old_world, new_world) {
        this.menu.switch_worlds(old_world, new_world);
        for (var s = 0; s < this.sections.length; s++) {
            var current_section = this.sections[s];
            for (var r = 0; r < current_section.rows.length; r++) {
                var current_row = current_section.rows[r];
                for (var e = 0; e < current_row.elements.length; e++) {
                    current_row.elements[e].switch_worlds(old_world, new_world);

                    // Also switch all the attachments of each element.
                    var attachments = current_row.elements[e].attachments;
                    for (var a = 0; a < attachments.length; a++) {
                        attachments[a].switch_worlds(old_world, new_world);
                    }
                }
            }
        }
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
        menu_to_display.menu.display_self_and_all_child_attachments_recursively();
        //menu_to_display.menu.hide_all_child_menus();
    },

    hide_all_child_menus: function() {
        for (var m = 0; m < this.child_menus.length; m++) {
            this.child_menus[m].menu.force_hide_self_and_all_child_attachments_recursively();
        }
    },

    create: function(world) {
        if (!is_defined(this.menu_name)) {
            var temp_position = new THREE.Vector3(0, 0, 0);
            var temp_normal = new THREE.Vector3(0, 0, 0);
            this.menu = new FloatingWall(this.menu_width, 100, temp_position, temp_normal, world);
            this.menu.set_attachment_horizontal_offset(-30, null);
            this.menu.set_attachment_vertical_offset(-30, null);
            this.menu.set_attachment_depth_offset(300);
        } else {
            this.menu = new FloatingWall(this.menu_width, 100, null, null, world);
        }
        this.menu.set_to_singleton();
        this.menu.make_base_wall_invisible();
        this.menu.force_hide_self_and_all_child_attachments_recursively();
    },

    _add_button_for_sub_menu: function(animated_menu) {
        return this._add_button(animated_menu.menu_name, animated_menu.menu_icon, this.hide_all_sibling_menus_and_display_self.bind(this, animated_menu));
    },

    _add_button: function(button_name, icon, button_action) {
        var row = this.menu.add_row(null);
        var button = row.add_button([0, 1, false], this.text_height, button_name, button_action);
        button.set_to_singleton();
        var i = button.add_icon_left(icon);
        i.set_to_singleton();
        return row;
    },

    _add_text: function(text) {
        var row = this.menu.add_row(null);
        var t = row.add_text_2D([0, 1, false], this.text_height, text);
        t.set_to_singleton();
        return row;
    },

    add_section: function(section_name) {
        var section = new MenuSection(section_name, this);
        this.sections.push(section);
        return section;
    }

};