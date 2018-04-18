'use strict';

function MobileKeyboard() {

    this.mobile_keyboard_visible = false;

    this.load_mobile_keyboard = function() {
        this.mobile_text_input = document.getElementById('mobile_keyboard_div');

        // Load all the individual buttons.
        this._create_and_bind_keyboard_button('0');
        this._create_and_bind_keyboard_button('1');
        this._create_and_bind_keyboard_button('2');
        this._create_and_bind_keyboard_button('3');
        this._create_and_bind_keyboard_button('4');
        this._create_and_bind_keyboard_button('5');
        this._create_and_bind_keyboard_button('6');
        this._create_and_bind_keyboard_button('7');
        this._create_and_bind_keyboard_button('8');
        this._create_and_bind_keyboard_button('9');
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

        this.keyboard_button_close = document.getElementById('mobile_button_exit').addEventListener('click', this._keyboard_button_close_pressed.bind(this));
        this.keyboard_button_delete = document.getElementById('mobile_button_del').addEventListener('click', this._keyboard_button_delete_pressed.bind(this));
    };

    this._create_and_bind_keyboard_button = function(key) {
        let keyboard_button = document.getElementById('mobile_button_' + key);
        if (key === 'space') {
            key = ' ';
        }
        keyboard_button.addEventListener('click', this._keyboard_button_pressed.bind(this, key));
    };

    this._keyboard_button_close_pressed = function(event) {
        MANAGER_WORLD.mobile_keyboard_close();
        event.stopPropagation();
        event.preventDefault();
        this.hide_mobile_keyboard();
    };

    this._keyboard_button_delete_pressed = function(event) {
        MANAGER_WORLD.mobile_keyboard_event_key_delete();
        event.stopPropagation();
        event.preventDefault();
    };

    this._keyboard_button_pressed = function(key, event) {
        MANAGER_WORLD.mobile_keyboard_event_key_press(key);
        event.stopPropagation();
        event.preventDefault();
    };

    this.trigger_mobile_keyboard = function() {
        this.mobile_text_input.style.visibility = VISIBLE;
        this.mobile_keyboard_visible = true;
    };

    this.hide_mobile_keyboard = function() {
        this.mobile_text_input.style.visibility = NOT_VISIBLE;
        this.mobile_keyboard_visible = false;
    };

}