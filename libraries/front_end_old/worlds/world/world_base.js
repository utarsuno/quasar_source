'use strict';

$_QE.prototype.World = function() {};

Object.assign($_QE.prototype.World.prototype, {

    handle_image_upload: function(file_data, file_name) {
        l('File uploaded!');
        l(file_name);

        let image = document.createElement('img');
        image.src = file_data;
        //l(image);
        let self = this;
        image.onload = function() {
            let fp = new $_QE.prototype.FloatingPicture(image);
            l(image.width);
            l(image.height);
            l(image.name);

            self.create_and_add_element_to_root(fp);
            self.player.set_object_in_front_of(fp, 1000);
        };
    },

    _load_world_if_needed: function() {
        if (!this._is_loaded) {
            this._load();
            this._is_loaded = true;
        }
    },

    init_world: function(world_name, world_icon, engine) {
        this._is_loaded                 = false;

        this.world_name                 = world_name;
        this.world_icon                 = world_icon;
        this.engine                     = engine;
        this.player                     = this.engine.player;
        this.scene                      = new THREE.Scene();
        this.currently_looked_at_object = null;

        this.__init__world_feature_interactive();
        this.__init__world_feature_root();
        this.__init__world_feature_tab_target();
        this.__init__world_feature_state();
        this.__init__world_feature_elements_css();

        // TODO: dynamic
        //this.engine.manager_world.player_menu.register_world(this);
    },

    _refresh_element: function(element) {
        if (element.flag_is_on(EFLAG_IS_ROOT)) {
            element.re_cache_normal();
        }
        element.refresh();
    },

    create_and_add_element_to_root: function(element) {
        element.world = this;
        this.add_element_root(element);

        this.add_element(element, true);

        this._refresh_element(element);
    },

    add_element: function(element, create=false, trigger_event=false) {
        if (element.flag_is_on(EFLAG_IS_IN_WORLD)) {
            QE.warning('Element already in world?', element);
        }

        element.world = this;

        if (create) {
            this.create_element(element);
        }

        element.flag_set_on(EFLAG_IS_IN_WORLD);
        this.check_if_element_needs_interactive(element);
        this.check_if_element_needs_root(element);
        this.check_if_element_needs_css(element);
        this.scene.add(element.get_object());

        //if (trigger_event) {
        //element.trigger_event(ELEMENT_EVENT_ON_WORLD_ENTER);
        //}
    },

    add_object_to_scene: function(object) {
        this.scene.add(object);
    },

    remove_object_from_scene: function(object) {
        this.scene.remove(object);
    },

    /*__   ___  __   __        __   __   ___     __        ___                 __
     |__) |__  /__` /  \ |  | |__) /  ` |__     /  ` |    |__   /\  |\ | |  | |__)
     |  \ |___ .__/ \__/ \__/ |  \ \__, |___    \__, |___ |___ /~~\ | \| \__/ |    */
    _remove_element: function(element) {
        this.scene.remove(element.get_object());
        //element.trigger_event(ELEMENT_EVENT_ON_WORLD_EXIT);
        element.flag_set_off(EFLAG_IS_IN_WORLD);
        element.world = null;
    },

    remove_element: function(element) {
        if (element.flag_is_on(EFLAG_IS_IN_WORLD)) {
            if (element.world !== null) {
                element.world._remove_element(element);
            } else {
                element.flag_set_off(EFLAG_IS_IN_WORLD);
                QE.warning('Element had in_world flag as true but world variable was null.', element);
            }
        }
    },

});
