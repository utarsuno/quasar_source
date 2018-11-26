'use strict';

$_QE.prototype.CanvasRendererIcon = function() {};

Object.assign(
    $_QE.prototype.CanvasRendererIcon.prototype,
    $_QE.prototype.CanvasRenderer.prototype,
    {
        render: function() {
            this._clear_canvas();
            this.context.drawImage(this._image_icons, this._current_icon * 64, 0, 64, 64, 0, 0, this.width, this.height);
        },
    }
);

