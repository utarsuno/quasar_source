'use strict'

function EntityEditor2(entity, position, look_at, scene) {
    this.__init__(entity, position, look_at, scene)
}

EntityEditor2.prototype = {

    close_button: null,

    entity      : null,
    position    : null,
    look_at     : null,

    interactive_wall: null,

    edit_entity: function() {
        if (this.edit_entity_button_click !== null && this.edit_entity_button_click !== undefined) {
            // TODO : pass the modified entity data here
            this.edit_entity_button_click('TODO : pass the modified entity data here.')
        }
    },

    edit_entity_button_click: null,

    set_edit_entity_button_click: function(f) {
        this.button_click = f
    },

    __init__: function(entity, position, look_at, scene) {

        this.entity = entity

        this.interactive_wall = new InteractiveWall(600, 800, position, look_at, scene)

        if (this.entity !== null) {
            this.interactive_wall.add_title('Modify : ' + this.entity.get_name())
            var key_values = get_key_value_list_from_json_dictionary(this.entity.get_properties())
            for (var i = 0; i < key_values.length; i++) {
                this.interactive_wall.add_input_row(key_values[i][0], key_values[i][1])
            }
        }
        this.interactive_wall.add_title('Create New Entity')

        // TODO : Have this button be 'disabled' greyed-out until any saveable changes are made.
        this.interactive_wall.add_input_button('save modifications', this.edit_entity.bind(this))
    },

    toggle_visibility: function() {
        this.interactive_wall.toggle_visibility()
    },

    set_to_invisible: function() {
        this.interactive_wall.set_to_invisible()
    },

    set_to_visible: function() {
        this.interactive_wall.set_to_visible()
    },

    is_visible: function() {
        return this.interactive_wall.is_visible
    }
}


