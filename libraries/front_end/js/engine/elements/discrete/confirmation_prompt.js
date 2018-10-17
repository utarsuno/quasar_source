'use strict';

$_QE.prototype.ConfirmationPrompt = function(parent_button) {
    this.set_colors(QE.COLOR_GREEN, COLOR_CANVAS_GRAY);
    $_QE.prototype.WallFloating.call(this, false, 256, 128);

    l('Created ConfirmationPrompt!');
    this._event_function = this.get_response.bind(this);
    l(this._event_function);
    this.parent_button = parent_button;
};

Object.assign($_QE.prototype.ConfirmationPrompt.prototype, $_QE.prototype.FeatureColor.prototype, {

    wall_created: false,

    get_response: function() {
        this.open();
    },

    open: function() {
        l('OPENED CONFIRMATION PROMPT!');
        if (!this.get_flag(EFLAG_CREATED)) {
            this._create();
        }
    },

    create: function() {
        l('Create called!');
        this.create_wall_mesh();
        this.set_flag(EFLAG_CREATED, true);
        this.add_title_bar('TEST', ASSET_ICON_WARNING);
    },

    _create: function() {
        l('CREATED CONFIRMATION PROMPT!');
        this.parent_button.add_attachment(this, true, true);
        this.add_to_world(this.parent_button.world, false, false, true);
    },
});