let lib_css  = require('../../../libraries/node/minifier_css.js');        // CSS minification.
let lib_args = require('../../../libraries/node/utilities_arguments.js'); // Script argument parsing.

const ARG_INPUT_FILE  = '-i';
const ARG_OUTPUT_FILE = '-o';

let script_args = lib_args.get_args_handler();
script_args.add_required_arguments(
    [
        [ARG_INPUT_FILE , 'The input file.', true],
        [ARG_OUTPUT_FILE, 'The path to the output file.', true]
    ]
);

lib_css.minify_css_file(
    script_args.get_value(ARG_INPUT_FILE),
    script_args.get_value(ARG_OUTPUT_FILE)
);

