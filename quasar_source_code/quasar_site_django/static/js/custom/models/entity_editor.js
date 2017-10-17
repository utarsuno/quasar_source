'use strict'

function EntityTaskCreator(name, position, look_at, scene) {
    this.__init__(name, position, look_at, scene)
}

function EntityEditor(entity, position, look_at, scene) {
    this.__init__(entity, position, look_at, scene)
}

EntityTaskCreator.prototype = {

    name: null,

    close_button: null,
    entity      : null,

    interactive_wall: null,

    create_entity: function() {
        if (this.button_click !== null) {
            this.button_click({
                'name': this.interactive_wall.get_input_row_text('name'),
                'importance': this.interactive_wall.get_input_row_text('importance'),
                'difficulty': this.interactive_wall.get_input_row_text('difficulty'),
                'time needed': this.interactive_wall.get_input_row_text('time needed'),
                'due date': this.interactive_wall.get_input_row_text('due date')
            })
        }
    },

    button_click: null,

    set_create_entity_button_click: function(f) {
        this.button_click = f
    },

    __init__: function(name, position, look_at, scene) {

        this.name = name
        this.interactive_wall = new InteractiveWall(400, 300, position, look_at, scene)

        this.interactive_wall.add_title(this.name)

        this.interactive_wall.add_input_row('name')
        this.interactive_wall.add_input_row('importance')
        this.interactive_wall.add_input_row('difficulty')
        this.interactive_wall.add_input_row('time needed')
        this.interactive_wall.add_input_row('due date')

        this.interactive_wall.add_input_button('create', this.create_entity.bind(this))
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


EntityEditor.prototype = {

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

    __init__: function(entity, position, look_at_normal, scene) {

        this.entity = entity

        this.interactive_wall = new InteractiveWall(600, 800, position, look_at_normal, scene)

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


