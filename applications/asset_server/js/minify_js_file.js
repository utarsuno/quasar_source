let PATH = require('../../../libraries/front_end/hello_world');

console.log(PATH);

let lib_js = require('../../../libraries/node/minifier_js');          // JS minification.
//let lib_args = require('../../../libraries/node/utilities_arguments.js'); // Script argument parsing.


lib_js.test(PATH);