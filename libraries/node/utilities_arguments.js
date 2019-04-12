let _script_arguments = [];

let Argument = function(position, value) {
    this.position = position;
    this.value    = value;
};

let get_argument_by_position = function(position) {
    if (position >= _script_arguments.length) {
        throw new Error('Script did not have an argument at position{' + position + '}');
    }
    return _script_arguments[position].value;
};

// Process the arguments passed into this script instance.
process.argv.forEach(function (val, index, array) {
    if (index > 1) {
        _script_arguments.push(new Argument(index - 2, val));
    }
});

module.exports = {
    'get_argument_by_position': get_argument_by_position
};
