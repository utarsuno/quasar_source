// Used for CSS minification.
let lib_csso = require('./../../applications/asset_server/js/node_modules/csso');
// File utilities.
let lib_file = require('./utilities_file.js');

let minify = function(css) {
    return lib_csso.minify(css).css;
};

let minify_css_file = function(path_css_file) {
    return new Promise(function (resolve, reject) {
        let promise = lib_file.get_contents_promise(path_css_file);
        promise.then(function(file_contents) {
            resolve(minify(file_contents));
        }).catch(function(error) {
            reject(error);
        });
    });
};

module.exports = {
    'minify'         : minify,
    'minify_css_file': minify_css_file
};


