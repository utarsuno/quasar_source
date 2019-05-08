'use strict';

Object.assign(
    $_QE.prototype.FloatingElement.prototype,
    {
        _parse_arguments_engine: function(args) {
            this.set_geometry_type(args[ARG_CACHE_GEOMETRY] !== null && args[ARG_CACHE_GEOMETRY], args[ARG_GEOMETRY_TYPE]);
            this.set_material_type(args[ARG_CACHE_MATERIAL] !== null && args[ARG_CACHE_MATERIAL], args[ARG_MATERIAL_TYPE]);
            if (args[ARG_MESH_TYPE] !== null) {
                this.set_mesh_type(args[ARG_CACHE_MESH] !== null && args[ARG_CACHE_MESH], args[ARG_MESH_TYPE], args[ARG_ON_MESH_CREATED]);
            } else {
                this.set_mesh_type(args[ARG_CACHE_MESH] !== null && args[ARG_CACHE_MESH], FEATURE_MESH_TYPE_DEFAULT, args[ARG_ON_MESH_CREATED]);
            }
        },

        _create_engine_objects: function() {
            this.create_material();
            this.create_geometry();
            this.create_mesh();
        },
    }
);
