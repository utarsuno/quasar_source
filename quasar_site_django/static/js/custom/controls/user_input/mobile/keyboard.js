'use strict';

function MobileKeyboard() {

    this.mobile_keyboard_visible = false;

    this.load_mobile_keyboard = function() {
        this.mobile_text_input = document.getElementById('mobile_keyboard_div');

        // Load all the individual buttons.
        this._create_and_bind_keyboard_button('a');
        this._create_and_bind_keyboard_button('b');
        this._create_and_bind_keyboard_button('c');
        this._create_and_bind_keyboard_button('d');
        this._create_and_bind_keyboard_button('e');
        this._create_and_bind_keyboard_button('f');
        this._create_and_bind_keyboard_button('g');
        this._create_and_bind_keyboard_button('h');
        this._create_and_bind_keyboard_button('i');
        this._create_and_bind_keyboard_button('j');
        this._create_and_bind_keyboard_button('k');
        this._create_and_bind_keyboard_button('l');
        this._create_and_bind_keyboard_button('m');
        this._create_and_bind_keyboard_button('n');
        this._create_and_bind_keyboard_button('o');
        this._create_and_bind_keyboard_button('p');
        this._create_and_bind_keyboard_button('q');
        this._create_and_bind_keyboard_button('r');
        this._create_and_bind_keyboard_button('s');
        this._create_and_bind_keyboard_button('t');
        this._create_and_bind_keyboard_button('u');
        this._create_and_bind_keyboard_button('v');
        this._create_and_bind_keyboard_button('w');
        this._create_and_bind_keyboard_button('x');
        this._create_and_bind_keyboard_button('y');
        this._create_and_bind_keyboard_button('z');
        this._create_and_bind_keyboard_button('space');
    };

    this._create_and_bind_keyboard_button = function(key) {
        var keyboard_button = document.getElementById('mobile_button_' + key);
        if (key === 'space') {
            key = ' ';
        }
        keyboard_button.addEventListener('click', this._keyboard_button_pressed.bind(this, key));
    };

    this._keyboard_button_pressed = function(key, event) {
        l('The following key was just pressed!');
        l(key);
        l(event);
    };

    this.trigger_mobile_keyboard = function() {
        l('Trying to open mobile keyboard!');
        this.mobile_text_input.style.visibility = VISIBLE;
        this.mobile_keyboard_visible = true;
    };

    this.hide_mobile_keyboard = function() {
        l('Trying to hide the mobile keyboard!');
        this.mobile_text_input.style.visibility = NOT_VISIBLE;
        this.mobile_keyboard_visible = false;
    };

}