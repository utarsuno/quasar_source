'use strict';

function WorldDynamicContent() {

    this.floating_pictures = [];
    this.entity_walls      = [];
    this.videos            = [];

    this.css_scene_added = false;

    this.dynamic_content_loaded = false;

    this.prepare_for_save = function() {
        // TODO : Eventually default should be false.
        var save_needed = true;

        // For dynamic worlds.
        if (this.hasOwnProperty('world_name_changed')) {
            if (this.world_name_changed) {
                this.entity.set_property(ENTITY_PROPERTY_NAME, this.world_name);
                save_needed = true;
            }
        }

        for (var r = 0; r < this.root_attachables.length; r++) {
            this.root_attachables[r].update_values_for_entity();
        }
    };

    this.load_dynamic_content = function() {

        // Load all the entity walls. These are the base objects that have sub objects to load.
        var base_wall_entities = this.entity.get_children_of_type(ENTITY_TYPE_WALL);
        for (var w = 0 ; w < base_wall_entities.length; w++) {

            // Check the type of object to load based off the immediate child of this wall entity.
            var child_entity = base_wall_entities[w].get_child();

            if (child_entity.get_type() === ENTITY_TYPE_ENTITY_WALL) {
                this.load_entity_wall(child_entity);
            } else if (child_entity.get_type() === ENTITY_TYPE_VIDEO) {
                this.load_video_wall(child_entity);
            }else {
                // TODO :
                l('TODO : COVER LOADING FUNCTIONALITY OF THIS ENTITY CHILD TYPE!!');
            }
        }

        this.dynamic_content_loaded = true;
    };


    /*___      ___   ___
     |__  |\ |  |  |  |  \ /    |  |  /\  |    |
     |___ | \|  |  |  |   |     |/\| /~~\ |___ |___ */
    this.create_new_entity_wall = function(this_context) {
        var entity_wall = new EntityWall(this_context);
        this_context.entity_walls.push(entity_wall);
    };

    // TODO : Eventually change the naming of entity wall entities lol.
    this.load_entity_wall = function(entity_wall_entity) {
        var entity_wall = new EntityWall(this, entity_wall_entity);
        this.entity_walls.push(entity_wall);
    };

    /*       __   ___  __
     \  / | |  \ |__  /  \    |  |  /\  |    |
      \/  | |__/ |___ \__/    |/\| /~~\ |___ |___ */
    this.add_css_scene = function() {
        this.css_scene = new THREE.Scene();
    };

    this.add_video_container = function() {
        var div = document.createElement('div');
        div.classList.add('container');
        document.body.appendChild(div);
        div.appendChild(MANAGER_RENDERER.css_renderer.domElement);
    };

    this.create_new_video = function(this_context) {
        if (!this.css_scene_added) {
            this.add_css_scene();
        }

        var video_wall = new FloatingVideo(this_context);
        this_context.videos.push(video_wall);
    };

    this.load_video_wall = function(video_entity) {
        if (!this.css_scene_added) {
            this.add_css_scene();
        }

        this.add_video_container();

        var video_wall = new FloatingVideo(this, video_entity);
        this.videos.push(video_wall);
    };

}