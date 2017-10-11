'use strict'

function EntityEditor(name, position, look_at, scene) {
    this.__init__(name, position, look_at, scene)
}

// TODO : For now this will just be the task editor, abstract it later.
EntityEditor.prototype = {

    name: null,

    close_button: null,
    entity      : null,

    interactive_wall: null,

    // TODO : Temp.
    all_entities: null,

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

        this.all_entities = []

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