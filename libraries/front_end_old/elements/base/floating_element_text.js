$_QE.prototype.FloatingElementText = function() {};

Object.assign(
    $_QE.prototype.FloatingElementText.prototype,
    $_QE.prototype.FloatingElementColor.prototype,
    $_QE.prototype.FeatureText.prototype,
    {
        _parse_arguments_text: function(args) {
            if (args[ARG_TEXT] != null) {
                this.text = args[ARG_TEXT];
            }
            if (args[ARG_ALIGNMENT_TEXT] != null) {
                this.set_text_alignment(args[ARG_ALIGNMENT_TEXT]);
            }
        },
    }
);


