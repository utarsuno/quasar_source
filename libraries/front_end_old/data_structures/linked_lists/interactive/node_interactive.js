$_QE.prototype.LLNodeInteractive = function(object) {
    this._object           = object;
    this._interactive_next = null;
    this._interactive_prev = null;
};

Object.assign(
    $_QE.prototype.LLNodeInteractive.prototype,
    $_QE.prototype.LLNode.prototype,
    {
        set_interactive_next: function(node) {
            this._interactive_next = node;
            node._interactive_prev = this;
        },

        set_interactive_previous: function(node) {
            this._interactive_prev = node;
            node._interactive_next = this;
        },

        set_interactive_prev_and_next: function(node_prev, node_next) {
            node_prev._interactive_next = this;
            this._interactive_prev      = node_prev;
            node_next._interactive_prev = this;
            this._interactive_next      = node_next;
        },

    }
);
