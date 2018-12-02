'use strict';

$_QE.prototype.HUDDebug = function() {};

Object.assign(
    $_QE.prototype.HUDDebug.prototype,
    $_QE.prototype.HUDTextLines.prototype,
    {
        _cache_debug_ints     : new Uint32Array(1 + 3 + 2),
        _cache_debug_floats   : new Float32Array(6),
        _cache_player_position: new THREE.Vector3(0, 0, 0),
        _cache_player_normal  : new THREE.Vector3(0, 0, 0),

        __init__: function(engine) {
            this.engine                   = engine;
            this._reference_performance   = window.performance;
            this._reference_player        = this.engine.player;

            this.__init__hud_element({
                ARG_NUMBER_OF_ROWS  : 5,
                ARG_WIDTH           : 400,
                ARG_DOM_ELEMENT_ID  : GLOBAL_ID_HUD_DEBUG,
                ARG_COLOR_FOREGROUND: QE.COLOR_RGB_GREEN_LIGHT
            });

            return this;
        },

        set_current_frame_count: function(current_frame_count) {
            this._hud_int(0, current_frame_count, 0, 4);
        },

        content_update: function() {
            // Engine.
            if (this._hud_int(1, this.engine.renderer.info.memory.geometries, 0) ||
                this._hud_int(2, this.engine.renderer.info.memory.textures, 0) ||
                this._hud_int(3, this.engine.renderer.info.programs.length, 0)
            ) {
                this.rows[3].set_text(
                    'g: ' + this._cache_debug_ints[1].toString() +
                    ', t: ' + this._cache_debug_ints[2].toString() +
                    ', s: ' + this._cache_debug_ints[3].toString()
                );
            }

            // Memory.
            if (this._hud_int(4, this._reference_performance.memory.usedJSHeapSize, 10486) ||
                    this._hud_int(5, this._reference_performance.memory.totalJSHeapSize, 10486)
            ) {
                let a = this._cache_debug_ints[4];
                let b = this._cache_debug_ints[5];
                this.rows[2].set_text(
                    '[' + (a / 1048576).toFixed(2).toString() + '/' +
                    (b / 1048576).toFixed(2).toString() + ']'
                );
            }

            // Position.
            this._reference_player.get_position(this._cache_player_position);
            if (this._hud_float(0, this._cache_player_position.x, 0.01) ||
                this._hud_float(1, this._cache_player_position.y, 0.01) ||
                this._hud_float(2, this._cache_player_position.z, 0.01)
            ) {
                this.rows[1].set_text(
                    '(' + this._cache_debug_floats[0].toFixed(2).toString() + ', ' +
                        this._cache_debug_floats[1].toFixed(2).toString() + ', ' +
                        this._cache_debug_floats[2].toFixed(2).toString() + ')'
                );
            }

            // Normal.
            this._reference_player.get_normal(this._cache_player_normal);
            if (this._hud_float(3, this._cache_player_normal.x, 0.01) ||
                this._hud_float(4, this._cache_player_normal.y, 0.01) ||
                this._hud_float(5, this._cache_player_normal.z, 0.01)
            ) {
                this.rows[0].set_text(
                    '(' + this._cache_debug_floats[3].toFixed(2).toString() + ', ' +
                        this._cache_debug_floats[4].toFixed(2).toString() + ', ' +
                        this._cache_debug_floats[5].toFixed(2).toString() + ')'
                );
            }
        },

        _hud_int: function(position, value, min_delta, row) {
            if (min_delta == 0) {
                if (this._cache_debug_ints[position] != value) {
                    this._cache_debug_ints[position] = value;
                    if (row != null) {
                        this.rows[row].set_text(value.toString());
                    }
                    return true;
                }
            } else if (Math.abs(this._cache_debug_ints[position] - value) >= min_delta) {
                this._cache_debug_ints[position] = value;
                if (row != null) {
                    this.rows[row].set_text(value.toString());
                }
                return true;
            }
            return false;
        },

        _hud_float: function(position, value, min_delta, row) {
            if (Math.abs(this._cache_debug_floats[position] - value) >= min_delta) {
                this._cache_debug_floats[position] = value;
                if (row != null) {
                    this.rows[row].set_text(value.toFixed(2).toString());
                }
                return true;
            }
            return false;
        },
    }
);
