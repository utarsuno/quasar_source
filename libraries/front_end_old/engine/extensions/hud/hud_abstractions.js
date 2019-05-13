$_QE.prototype.HUDElement = function() {};
Object.assign(
    $_QE.prototype.HUDElement.prototype,
    $_QE.prototype.DomCanvas.prototype,
    $_QE.prototype.FeatureSize.prototype,
    $_QE.prototype.FeatureColor.prototype,
    {
        __init__hud_element: function(args) {
            args[ARG_FONT] = QE.FONT_ARIAL_12;
            this.set_foreground_color(args[ARG_COLOR_FOREGROUND]);
            this.__init__external_canvas(args[ARG_DOM_ELEMENT_ID]);
            this.__init__renderer_text(args);
        },
    }
);


$_QE.prototype.HUDTextLines = function() {};
Object.assign(
    $_QE.prototype.HUDTextLines.prototype,
    $_QE.prototype.HUDElement.prototype,
    $_QE.prototype.CanvasRenderingTextLines.prototype
);

