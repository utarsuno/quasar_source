// Used for JS minification.
let lib_browserify = require('./../../applications/asset_server/js/node_modules/browserify');
// File utilities.
//let lib_file = require('./utilities_file.js');

//let PATH = require('./../../libraries/front_end');

//['./../../libraries/front_end/hello_world.js']
let bowserify      = new lib_browserify();

//console.log(b);

//console.log(lib_browserify);
//console.log(lib_browserify.prototype);

//console.log(bowserify);

//bowserify.add('/quasar_source/libraries/front_end/hello_world.js');
//bowserify.bundle().pipe(process.stdout);


let test = function(path) {
    // './../../libraries/front_end/hello_world.js'
    //bowserify.add(path);
    bowserify.add('../../../libraries/front_end/hello_world.js');
    let b = bowserify.bundle();
    //console.log(b);
    console.log('H a l l o ?');
};

module.exports = {
    'test': test,
};


/*
let minify = function(css) {
    return lib_csso.minify(css).css;
};

let _minify_css_file = function(path) {
    return new Promise(function (resolve, reject) {
        let promise = lib_file.get_contents_promise(path);
        promise.then(function(file_contents) {
            resolve(minify(file_contents));
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
    'minify'         : minify,
    'minify_css_file': minify_css_file
};

 */


