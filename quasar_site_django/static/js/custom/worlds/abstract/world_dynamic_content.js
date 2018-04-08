'use strict';

function WorldDynamicContent() {

    this.floating_pictures = [];
    this.entity_groups     = [];
    this.month_view_walls  = [];

    this.number_of_videos_to_load = 0;
    this.number_of_videos_loaded  = 0;
    this.video_entities = [];
    this.videos            = [];

    this.css_scene_added = false;

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
            var child_entity_type = child_entity.get_type();

            switch (child_entity_type) {
            case ENTITY_TYPE_ENTITY_GROUP:
                this.load_entity_group(child_entity);
                break;
            case ENTITY_TYPE_VIDEO:
                this.video_entities.push(child_entity);
                this.number_of_videos_to_load += 1;
                break;
            case ENTITY_TYPE_MONTH_VIEW_WALL:
                this.load_month_view_wall(child_entity);
                break;
            default:
                l('TODO : COVER LOADING FUNCTIONALITY OF THIS CHILD ENTITY TYPE!');
                l(child_entity_type);
                break;
            }
        }

        if (this.number_of_videos_to_load > 0) {
            this.load_all_videos();
        }
    };

    /*     __       ___                 ___
     |\/| /  \ |\ |  |  |__|    \  / | |__  |  |    |  |  /\  |    |
     |  | \__/ | \|  |  |  |     \/  | |___ |/\|    |/\| /~~\ |___ |___ */
    this.create_new_month_view_wall = function(world_context) {
        var month_view_wall = new MonthView(world_context);
        world_context.month_view_walls.push(month_view_wall);
    };

    this.load_month_view_wall = function(month_view_wall_entity) {
        var month_view_wall = new MonthView(this, month_view_wall_entity);
        this.month_view_walls.push(month_view_wall);
    };

    /*___      ___   ___
     |__  |\ |  |  |  |  \ /    |  |  /\  |    |
     |___ | \|  |  |  |   |     |/\| /~~\ |___ |___ */
    this.create_new_entity_group = function(world_context) {
        var entity_wall = new EntityGroup(world_context);
        world_context.entity_groups.push(entity_wall);
    };

    this.load_entity_group = function(entity_group_entity) {
        var entity_wall = new EntityGroup(this, entity_group_entity);
        this.entity_groups.push(entity_wall);
    };

    /*       __   ___  __
     \  / | |  \ |__  /  \    |  |  /\  |    |
      \/  | |__/ |___ \__/    |/\| /~~\ |___ |___ */
    this.load_all_videos = function() {
        this.css_scene = new THREE.Scene();
        this.container = document.getElementById('video_container');
        this.container.appendChild(MANAGER_RENDERER.css_renderer.domElement);
        this.video_group = new THREE.Group();

        for (var v = 0; v < this.video_entities.length; v++) {
            this.load_video_wall(this.video_entities[v]);
        }
    };

    this.add_video_to_css_group = function(video) {
        this.video_group.add(video);
        this.number_of_videos_loaded += 1;

        if (this.number_of_videos_loaded === this.number_of_videos_to_load) {
            this.css_scene.add(this.video_group);
        }
    };

    this.create_new_video = function(world_context) {
        // TODO : Add needed functionality to this. (Such as temporarily displaying a refresh-warning).
        var video_wall = new FloatingVideo(world_context);
        world_context.videos.push(video_wall);
    };

    this.load_video_wall = function(video_entity) {
        var video_wall = new FloatingVideo(this, video_entity);
        this.videos.push(video_wall);
    };

}