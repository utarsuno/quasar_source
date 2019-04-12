// File utilities.
let lib_fs = require('fs');

let verify_path_is_file = function(path) {
    let is_file = lib_fs.lstatSync(path).isFile();
    if (!is_file) {
        throw new Error('Path{' + path + '} is not a file path!');
    }
};

let save_contents = function(path, contents) {
    lib_fs.writeFile(path, contents, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });
};

let get_contents_promise = function(path) {
    verify_path_is_file(path);

    return new Promise(function (resolve, reject) {
        lib_fs.readFile(path, function (err, data) {
            if (err) {
                reject(err);
            }
            resolve(data.toString());
        });
    });
};

module.exports = {
    'get_contents_promise': get_contents_promise,
    'save_contents'       : save_contents
};


