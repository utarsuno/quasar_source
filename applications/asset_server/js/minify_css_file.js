// Used for CSS minification.
let lib_css  = require('../../../libraries/node/minifier_css.js');
// Used for script argument parsing.
let lib_args = require('../../../libraries/node/utilities_arguments.js');
// File utilities.
let lib_file = require('./../../../libraries/node/utilities_file');

let path_css_file        = lib_args.get_argument_by_position(0);
let path_output_file     = lib_args.get_argument_by_position(1);
let promise_minified_css = lib_css.minify_css_file(path_css_file);

promise_minified_css.then(function(value) {
    lib_file.save_contents(path_output_file, value);
});

