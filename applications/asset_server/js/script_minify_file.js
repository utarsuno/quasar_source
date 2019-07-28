let lib_css  = require('../../../libraries/node/minifier_css.js'); // CSS minification.
let lib_html = require('../../../libraries/node/minifier_html');   // HTML minification.
let lib_args = require('../../../libraries/node/utils_args.js');   // Script argument parsing.

const ARG_INPUT_FILE  = '-i';
const ARG_OUTPUT_FILE = '-o';

let script_args = lib_args.get_args_handler();
script_args.add_required_arguments(
    [
        [ARG_INPUT_FILE , 'The input file.', true],
        [ARG_OUTPUT_FILE, 'The path to the output file.', true]
    ]
);

let input_file_path = script_args.get_value(ARG_INPUT_FILE);
let minifier_to_use = null;
if (input_file_path.includes('.css')) {
    minifier_to_use = lib_css;
} else if (input_file_path.includes('.html')) {
    minifier_to_use = lib_html;
} else {
    throw new Error('Unable to determine minifier to use for path{' + input_file_path + '}');
}

minifier_to_use.minify_file(
    script_args.get_value(ARG_INPUT_FILE),
    script_args.get_value(ARG_OUTPUT_FILE)
);
