// Used for CSS minification.
let lib_csso = require('./../../applications/asset_server/js/node_modules/csso');
// File utilities.
let lib_file = require('./utils_file.js');

let minify_css = function(css) {
    return lib_csso.minify(css).css;
};

let _minify_css_file = function(path) {
    return new Promise(function (resolve, reject) {
        let promise = lib_file.get_contents_promise(path);
        promise.then(function(file_contents) {
            resolve(minify_css(file_contents));
        }).catch(function(error) {
            reject(error);
        });
    });
};

let minify_css_file = function(path_css_file, path_output_file=null) {
    if (path_output_file === null) {
        return _minify_css_file(path_css_file);
    }
    let p = _minify_css_file(path_css_file);
    p.then(function(value) {
        lib_file.save_contents(path_output_file, value);
    }).catch(function(error) {
        console.log('TODO: Error{' + error + '}');
    });

};

module.exports = {
    'minify'     : minify_css,
    'minify_file': minify_css_file
};
