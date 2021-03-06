$_NL.prototype.FloatingTerminal = function(args) {
    args[ARG_WIDTH] = 1024 * 4;
    this.__init__floating_terminal(args);
};

Object.assign(
    $_NL.prototype.FloatingTerminal.prototype,
    $_QE.prototype.DomCanvasTexture.prototype,
    $_QE.prototype.WallFloating.prototype,
    $_QE.prototype.CanvasRenderingTextLines.prototype,
    $_QE.prototype.FeatureText.prototype,
    {
        constructor: $_NL.prototype.FloatingTerminal,

        add_message: function(message) {
            if (message.includes('\n') || message.includes('\r\n')) {
                let ml = message.split(/\r?\n/);
                let m;
                for (m = 0; m < ml.length; m++) {
                    this.shift_rows_up();
                    this.set_bottom_row(ml[m]);
                }
            } else {
                this.shift_rows_up();
                this.set_bottom_row(message);
            }
        },

        _on_enter_event: function() {
            //if (this.get_text_length_without_whitespaces() != 0) {
            this.shift_rows_up();
            this.clear();
            // const COLOR_CANVAS_TEAL   = 'rgb(167,248,255,0.75)'; // #USED TO BE: pre-process_global_constant
            //this.add_text_line_to_bottom(this.get_text_and_clear(), COLOR_CANVAS_TEAL);
            //}
        },

        //__init__floating_terminal: function(width, number_of_rows, font) {
        __init__floating_terminal: function(args) {
            this.text = args[ARG_TEXT];

            this.__init__floating_rows();

            this.flag_set_on(EFLAG_IS_MOUSE_MOVABLE);
            this.flag_set_on(EFLAG_IS_MOUSE_SCALABLE);

            this.set_foreground_color(QE.COLOR_RGB_GREEN_LIGHT, 0.85);
            //this.set_foreground_color(QE.COLOR_RGB_GREEN_LIGHT, 0.5);
            //const COLOR_CANVAS_GRAY   = 'rgb(41,41,41,0.45)';    // #USED TO BE: pre-process_global_constant
            this.set_background_color('rgb(41,41,41,0.45)');

            //this.__init__canvas_texture(number_of_rows, width, font);
            this.__init__canvas_texture(args);

            $_QE.prototype.FeatureTyping.call(this, this._on_enter_event.bind(this));
            this.flag_set_on(EFLAG_IS_DOUBLE_CLICK_REQUIRED_FOR_ENGAGING);
            // TODO: ensure input not receiving unless engaged!

            //this._render_needed = true;
            //this.update();

            this._parse_arguments_on_constructor_end_floating_element(args);
            return this;
        },

        create: function() {
            this.create_wall_mesh(FEATURE_MATERIAL_CANVAS_FANCY);

            this.add_title_bar(this.text, ASSET_ICON_TERMINAL);

            this._default_row = this.create_row_interactive(0.5);

            //
            this.add_message('              \'`--._,dd###pp=""\'');
            this.add_message('          _o/"`\'\'  \'\',, dMF9MMMMMHo_');
            this.add_message('       .o&#\'        `"MbHMMMMMMMMMMMHo.');
            this.add_message('     .o"" \'         vodM*$&&HMMMMMMMMMM?.');
            this.add_message('    ,\'              $M&ood,~\'`(&##MMMMMMH\\');
            this.add_message('   /               ,MMMMMMM#b?#bobMMMMHMMML');
            this.add_message('  &              ?MMMMMMMMMMMMMMMMM7MMM$R*Hk');
            this.add_message(' ?$.            :MMMMMMMMMMMMMMMMMMM/HMMM|`*L');
            this.add_message('|               |MMMMMMMMMMMMMMMMMMMMbMH\'   T,');
            this.add_message('$H#:            `*MMMMMMMMMMMMMMMMMMMMb#}\'  `?');
            this.add_message(']MMH#             ""*""""*#MMMMMMMMMMMMM\'    -');
            this.add_message('MMMMMb_                   |MMMMMMMMMMMP\'     :');
            this.add_message('HMMMMMMMHo                 `MMMMMMMMMT       .');
            this.add_message('?MMMMMMMMP                  9MMMMMMMM}       -');
            this.add_message('-?MMMMMMM                  |MMMMMMMMM?,d-    ');
            this.add_message(' :|MMMMMM-                 `MMMMMMMT .M|.   :');
            this.add_message('  .9MMM[                    &MMMMM*\' `\'    .');
            this.add_message('   :9MMk                    `MMM#"        -');
            this.add_message('     &M}                     `          .-');
            this.add_message('      `&.                             .');
            this.add_message('        `~,   .                     ./');
            this.add_message('            . _                  .-');
            this.add_message('              \'`--._,dd###pp=""\'');
            //

            let self = this;
            this.set_value_post_changed_event(function(t) {
                self.rows[0].set_text(t);
            });

            // TODO: Temporary solution.
            //this.mesh.renderOrder = 1;
        },
    }
);

