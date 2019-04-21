let ScriptArgument = function(name, description, requires_value, required) {
    this.name           = name;
    this.description    = description;
    this.requires_value = requires_value;
    this.required       = required;
    this.value          = null;
};

let ScriptArguments = function() {
    this.arguments        = {};
    this.script_arguments = [];
    this.num_script_args  = 0;

    this.get_value = function(argument_name) {
        if (!(argument_name in this.arguments)) {
            throw new Error('ScriptArguments does not have an argument named{' + argument_name + '}');
        }
        return this.arguments[argument_name].value;
    };

    this.add_script_argument = function(arg) {
        this.script_arguments.push(arg);
        ++this.num_script_args;
    };

    this.add_required_argument = function(data) {
        let arg_name = data[0];
        this.arguments[arg_name] = new ScriptArgument(arg_name, data[1], data[2], true);
        if (!this.is_required_argument_provided_to_script(arg_name)) {
            throw new Error('The required argument{' + arg_name + '} was not provided to this script execution!');
        }
    };

    this.is_required_argument_provided_to_script = function(argument_key) {
        let a;
        let arg;
        for (a = 0; a < this.num_script_args; a++) {
            arg = this.script_arguments[a];
            if (argument_key === arg) {
                let arg_obj = this.arguments[argument_key];
                if (arg_obj.requires_value) {
                    // TODO: Handle exception if no value was provided to an argument placed last which required a value.
                    arg_obj.value = this.script_arguments[a + 1];
                }
                return true;
            }
        }
        return false;
    };

    this.add_required_arguments = function(required_arguments) {
        let a;
        let number_of_arguments = required_arguments.length;
        for (a = 0; a < number_of_arguments; a++) {
            this.add_required_argument(required_arguments[a]);
        }
    };
};

// Process the arguments passed into this script instance.
let _script_args = new ScriptArguments();

process.argv.forEach(function (val, index, array) {
    if (index > 1) {
        _script_args.add_script_argument(val);
    }
});
//if (expected_arguments_defined && number_of_arguments_passed !== _script_arguments.length) {
//    throw new Error('Not all required arguments passed in!');
//}

let get_args_handler = function() {
    return _script_args;
};

module.exports = {
    'get_args_handler': get_args_handler,
};
