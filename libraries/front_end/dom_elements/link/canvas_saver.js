'use strict';

$_QE.prototype.CanvasSaver = function() {
    this.__init__internal_link();
};

Object.assign(
    $_QE.prototype.CanvasSaver.prototype,
    $_QE.prototype.DomElement.prototype,
    {
        // Solution from : https://stackoverflow.com/questions/10673122/how-to-save-canvas-as-an-image-with-canvas-todataurl
        download_canvas: function(canvas, file_name) {
            this._element.setAttribute('download', file_name + '.png');
            // The second replace prevents a DOM 18 exception.
            this._element.setAttribute('href'    , canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream'));
            this._element.click();
        },
    }
);

