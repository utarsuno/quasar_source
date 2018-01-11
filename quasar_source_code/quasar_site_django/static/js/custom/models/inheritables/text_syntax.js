'use strict';

const SUCCESS_MESSAGE = '';

function TextSyntax(syntax_checks) {

    this._required_syntax_rules = [];

    l('I GOT THIS PASSED IN!!!!');
    l(syntax_checks);

    for (var sc in syntax_checks) {
        if (syntax_checks.hasOwnProperty(sc)) {
            this._required_syntax_rules.push(sc);
        }
    }

    this.syntax_check = function() {
        var text = this.get_text();
        l('Performing syntax check on : {' + text + '}');

        l(text.length);


        for (var r = 0; r < this._required_syntax_rules.length; r++) {

            l('??');
            l(this._required_syntax_rules[r]);

            switch(this._required_syntax_rules[r]) {
            case TEXT_SYNTAX_STANDARD_LENGTH:

                l('Checking standard length!');

                if (text.length < 4) {
                    return 'Text length is below 4.';
                } else if (text.length > 32) {
                    return 'Text length is greater than 32.';
                } else {
                    return SUCCESS_MESSAGE;
                }
            case TEXT_SYNTAX_EMAIL:

                l('Checking email!');

                var valid_email = is_email_valid(text);
                if (valid_email) {
                    return SUCCESS_MESSAGE;
                } else {
                    return 'Invalid email format.';
                }
            }
        }
        return SUCCESS_MESSAGE;
    };

    /*
    // States.
    this.currently_visible = true;

    this.additional_visibility_objects = [];

    this.add_additional_visibility_object = function(child_object) {
        this.additional_visibility_objects.push(child_object);
    };

    this.is_visible = function() {
        return this.currently_visible;
    };

    this.set_to_visible = function() {
        this.currently_visible = true;
        // Thanks to : https://stackoverflow.com/questions/42609602/how-to-hide-and-show-an-object-on-scene-in-three-js
        this.object3D.visible = true;
        this.object3D.traverse (function(child) {
            if (child instanceof THREE.Mesh) {
                child.visible = true;
            }
        });
        for (var i = 0; i < this.additional_visibility_objects.length; i++) {
            this.additional_visibility_objects[i].set_to_visible();
        }
    };

    this.set_to_invisible = function() {
        this.currently_visible = false;
        // Thanks to : https://stackoverflow.com/questions/42609602/how-to-hide-and-show-an-object-on-scene-in-three-js
        this.object3D.visible = false;
        this.object3D.traverse (function(child) {
            if (child instanceof THREE.Mesh) {
                child.visible = false;
            }
        });
        for (var i = 0; i < this.additional_visibility_objects.length; i++) {
            this.additional_visibility_objects[i].set_to_invisible();
        }
    };

    this.toggle_visiblity = function() {
        this.currently_visible = !this.currently_visible;
        var local_is_visible = this.currently_visible;
        this.object3D.visible = local_is_visible;
        this.object3D.traverse(function(child) {
            if (child instanceof THREE.Mesh) {
                child.visible = local_is_visible;
            }
        });
        for (var i = 0; i < this.additional_visibility_objects.length; i++) {
            if (local_is_visible) {
                this.additional_visibility_objects[i].set_to_visible();
            } else {
                this.additional_visibility_objects[i].set_to_invisible();
            }
        }
    };*/
}

