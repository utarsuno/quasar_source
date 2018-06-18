'use strict';

$_QE.prototype.DomElement = function(id_name, element) {
    if (id_name === null) {
        this.element = element;
    } else {
        this.element = document.getElementById(id_name);
    }
    this._current_text = null;
    // Default.
    this.display_style = 'block';

    this.prepend_child_element = function(element_id) {
        return this._add_child_element(true, element_id);
    };

    this.append_child_element = function(element_id) {
        return this._add_child_element(false, element_id);
    };

    this.append_to_document_body = function() {
        document.body.appendChild(this.element);
    };

    this.add_class = function(class_name) {
        this.element.classList.add(class_name);
    };

    this.prepend_break = function() {
        let node = document.createElement('br');
        this.element.prepend(node);
    };

    this.add_break_element = function() {
        let node = document.createElement('br');
        this.element.appendChild(node);
    };

    this._add_child_element = function(prepend, element_id) {
        let node = document.createElement('div');
        node.id = element_id;
        if (prepend) {
            this.element.prepend(node);
        } else {
            this.element.appendChild(node);
        }
        return new $_QE.prototype.DomElement(element_id);
    };

    this.get_element = function() {
        return this.element;
    };

    this.get_text = function() {
        return this._current_text;
        //return this.element.innerHTML;
    };

    this.clear = function() {
        this.set_text('');
    };

    this._get_offset = function(o) {
        if (o === 0) {
            return 0;
        }
        return o + 'px';
    };

    this.set_id = function(_id) {
        this.element.id = _id;
    };

    this.set_text = function(text) {
        if (this._current_text !== text) {
            this.element.innerHTML = text;
            this._current_text = text;
        }
    };

    this.set_position_to_absolute = function() {
        this.element.style.position = 'absolute';
    };

    this.set_left_offset = function(o) {
        this.element.style.left = this._get_offset(o);
    };

    this.set_top_offset = function(o) {
        this.element.style.top = this._get_offset(o);
    };

    this.set_color = function(color) {
        this.element.style.color = color;
    };

    this.set_display_style = function(style) {
        this.display_style = style;
    };

    this.hide = function() {
        this.element.style.display = 'none';
        this.hidden = true;
    };

    this.show = function() {
        this.element.style.display = this.display_style;
        this.hidden = false;
    };

    this.is_hidden = function() {
        return this.hidden;
    };

    this.make_invisible = function() {
        this.element.style.visibility = 'hidden';
        this.visible = false;
    };

    this.make_visible = function() {
        this.element.style.visibility = 'visible';
        this.visible = true;
    };

    this.is_visible = function() {
        return this.visible;
    };
};

/*
function DomElement(id_name, element) {
    this.__init__(id_name, element);
}

DomElement.prototype = {

    __init__: function(id_name, element) {
        if (id_name === null) {
            this.element = element;
        } else {
            this.element = document.getElementById(id_name);
        }
        this._current_text = null;
        // Default.
        this.display_style = 'block';
    },

    prepend_child_element: function(element_id) {
        return this._add_child_element(true, element_id);
    },

    append_child_element: function(element_id) {
        return this._add_child_element(false, element_id);
    },

    add_class: function(class_name) {
        this.element.classList.add(class_name);
    },

    prepend_break: function() {
        let node = document.createElement('br');
        this.element.prepend(node);
    },

    add_break_element: function() {
        let node = document.createElement('br');
        this.element.appendChild(node);
    },

    _add_child_element: function(prepend, element_id) {
        let node = document.createElement('div');
        node.id = element_id;
        if (prepend) {
            this.element.prepend(node);
        } else {
            this.element.appendChild(node);
        }
        return new DomElement(element_id);
    },

    get_element: function() {
        return this.element;
    },

    get_text: function() {
        return this._current_text;
        //return this.element.innerHTML;
    },

    clear: function() {
        this.set_text('');
    },

    _get_offset: function(o) {
        if (o === 0) {
            return 0;
        }
        return o + 'px';
    },

    set_id: function(_id) {
        this.element.id = _id;
    },

    set_text: function(text) {
        if (this._current_text !== text) {
            this.element.innerHTML = text;
            this._current_text = text;
        }
    },

    set_position_to_absolute: function() {
        this.element.style.position = 'absolute';
    },

    set_left_offset: function(o) {
        this.element.style.left = this._get_offset(o);
    },

    set_top_offset: function(o) {
        this.element.style.top = this._get_offset(o);
    },

    set_color: function(color) {
        this.element.style.color = color;
    },

    set_display_style: function(style) {
        this.display_style = style;
    },

    hide: function() {
        this.element.style.display = 'none';
        this.hidden = true;
    },

    show: function() {
        this.element.style.display = this.display_style;
        this.hidden = false;
    },

    is_hidden: function() {
        return this.hidden;
    },

    make_invisible: function() {
        this.element.style.visibility = 'hidden';
        this.visible = false;
    },

    make_visible: function() {
        this.element.style.visibility = 'visible';
        this.visible = true;
    },

    is_visible: function() {
        return this.visible;
    }
};
    */