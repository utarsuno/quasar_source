/**
 * @Reference: https://www.npmjs.com/package/html-minifier
 */

// Used for HTML minification.
let lib_html = require('./../../applications/asset_server/js/node_modules/html-minifier');
// File utilities.
let lib_file = require('./utilities_file.js');

let minify = function(html) {
    return lib_html.minify(html, {
        collapseBooleanAttributes    : true,
        collapseInlineTagWhitespace  : true,
        collapseWhitespace           : true,
        decodeEntities               : true,
        html5                        : true,
        keepClosingSlash             : false,
        // test
        minifyCSS                    : true,
        //
        minifyJS                     : false,
        conservativeCollapse         : false,
        // Temporary false
        minifyURLs                   : false,
        preserveLineBreaks           : false,
        preventAttributesEscaping    : true,
        processConditionalComments   : true,
        quoteCharacter               : "'",
        removeAttributeQuotes        : true,
        removeComments               : true,
        removeEmptyAttributes        : false,
        removeEmptyElements          : false,
        removeOptionalTags           : true,
        removeRedundantAttributes    : true,
        removeScriptTypeAttributes   : true,
        removeStyleLinkTypeAttributes: true,
        sortAttributes               : true,
        sortClassName                : true,
        useShortDoctype              : true
    });
};

let _minify_html_file = function(path) {
    return new Promise(function (resolve, reject) {
        let promise = lib_file.get_contents_promise(path);
        promise.then(function(file_contents) {
            resolve(minify(file_contents));
        }).catch(function(error) {
            reject(error);
        });
    });
};

let minify_html_file = function(path_html_file, path_output_file=null) {
    if (path_output_file === null) {
        return _minify_html_file(path_html_file);
    }
    let p = _minify_html_file(path_html_file);
    p.then(function(value) {
        lib_file.save_contents(path_output_file, value);
    }).catch(function(error) {
        console.log('TODO: Error{' + error + '}');
    });
};

module.exports = {
    'minify'          : minify,
    'minify_html_file': minify_html_file
};


