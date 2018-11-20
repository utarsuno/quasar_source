'use strict';

$_QE.prototype.HUDElement = function() {};
Object.assign(
    $_QE.prototype.HUDElement.prototype,
    $_QE.prototype.FeatureSize.prototype,
    $_QE.prototype.FeatureColor.prototype,
    $_QE.prototype.DomCanvasExternal.prototype,
    {
        initialize_hud_element: function(number_of_visible_rows, width, font, canvas_id) {
            this.initialize_dom_canvas(canvas_id);
            this.initialize_renderer_text(font, number_of_visible_rows, width);
        },
    }
);


$_QE.prototype.HUDTextLines = function() {};
Object.assign(
    $_QE.prototype.HUDTextLines.prototype,
    $_QE.prototype.HUDElement.prototype,
    $_QE.prototype.CanvasRenderingTextLines.prototype
);

