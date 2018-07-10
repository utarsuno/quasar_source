'use strict';

const ICON_ADMIN      = 0;  // #pre-process_global_constant
const ICON_ARROW      = 1;  // #pre-process_global_constant
const ICON_CALENDER   = 2;  // #pre-process_global_constant
const ICON_CHECKMARK  = 3;  // #pre-process_global_constant
const ICON_CLICK      = 4;  // #pre-process_global_constant
const ICON_CROSS      = 5;  // #pre-process_global_constant
const ICON_CURSOR     = 6;  // #pre-process_global_constant
const ICON_DELETE     = 7;  // #pre-process_global_constant
const ICON_DISABLED   = 8;  // #pre-process_global_constant
const ICON_DRAG       = 9;  // #pre-process_global_constant
const ICON_EXIT       = 10; // #pre-process_global_constant
const ICON_EXPAND     = 11; // #pre-process_global_constant
const ICON_FOLDER     = 12; // #pre-process_global_constant
const ICON_GEARS      = 13; // #pre-process_global_constant
const ICON_HOME       = 14; // #pre-process_global_constant
const ICON_HORIZONTAL = 15; // #pre-process_global_constant
const ICON_LOCKED     = 16; // #pre-process_global_constant
const ICON_PICTURE    = 17; // #pre-process_global_constant
const ICON_PLANET     = 18; // #pre-process_global_constant
const ICON_TELEPORT   = 19; // #pre-process_global_constant
const ICON_TEXT       = 20; // #pre-process_global_constant
const ICON_UNLOCKED   = 21; // #pre-process_global_constant
const ICON_VERTICAL   = 22; // #pre-process_global_constant
const ICON_VIDEO      = 23; // #pre-process_global_constant
const ICON_WARNING    = 24; // #pre-process_global_constant
const ICON_WRENCH     = 25; // #pre-process_global_constant
const ICON_WRITING    = 26; // #pre-process_global_constant

$_QE.prototype.SpritesheetManager = function() {
    this.get_icon_material = function(icon) {
        //this._shader_material = QE.manager_shaders.get_shader_material_abstraction(ASSET_SHADER_MATERIAL_SPRITESHEET);
        this._shader_material = QE.manager_shaders.get_asset(ASSET_SHADER_MATERIAL_SPRITESHEET);
        let m = this._shader_material.get_material(icon);
        m.transparent = true;
        m.needsUpdate = true;
        return m;
    };

    this.load_icon_sprite_sheet = function() {
        //this.texture = QE.manager_textures.get_texture(ASSET_TEXUTRE_SPRITESHEET_ICONS);
        this.texture = QE.manager_textures.get_asset(ASSET_TEXUTRE_SPRITESHEET_ICONS);
        this.texture.magFilter = THREE.NearestFilter;
        this.texture.minFilter = THREE.NearestFilter;
        this.texture.needsUpdate = true;
    };
};

/*
ManagerManager.prototype.set_spritesheet_manager = function() {
    function SpriteSheetManager() {
        this.__init__();
    }

    SpriteSheetManager.prototype = {
        __init__: function() {
        },

        get_icon_material: function(icon) {
            this._shader_material = MANAGER_SHADER.get_shader_material_abstraction(SHADER_MATERIAL_SPRITESHEET);
            let m = this._shader_material.get_material(icon);
            m.transparent = true;
            m.needsUpdate = true;
            return m;
        },

        load_icon_sprite_sheet: function() {
            this.texture = MANAGER_TEXTURE.get_texture(SPRITESHEET_ICONS);

            this.texture.magFilter = THREE.NearestFilter;
            this.texture.minFilter = THREE.NearestFilter;
            this.texture.needsUpdate = true;
        }
    };

    this.spritesheet_manager = new SpriteSheetManager();
};
    */