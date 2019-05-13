$_QE.prototype.ElementSingleton = function() {};

Object.assign(
    $_QE.prototype.ElementSingleton.prototype,
    $_QE.prototype.Element.prototype,
    $_QE.prototype.Singleton.prototype,
    {
        create_singleton: function(...args) {
            this.initialize_element_data();
            this.__init__(...args);
            this._create_singleton(this);
            return this;
        },
    }
);


