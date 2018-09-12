'use strict';

$_QE.prototype.AssetBatch = function() {
    this.layers = [[]];

    this.get_layer_needed_for_asset = function(asset) {
        let depth = 0;
        let current_asset = asset;
        // while (current_asset.depends_on != null) {
        while (is_defined(current_asset.depends_on)) {
            depth += 1;
            current_asset = current_asset.depends_on;
        }
        if (this.layers.length === depth) {
            this.layers.push([]);
        }
        return depth;
    };

    this.add_asset = function(asset) {
        let layer_needed = this.get_layer_needed_for_asset(asset);
        if (layer_needed > this.layers.length) {
            this.layers.push([asset]);
        } else {
            if (this.layers[layer_needed].indexOf(asset) !== NOT_FOUND) {
                console.log('Asset {' + asset.name + '} already added to load batch!');
            } else {
                this.layers[layer_needed].push(asset);
            }
        }
    };

    this.load_batch = function() {
        let layer_promises = [];
        let pl;
        for (pl = 0; pl < this.layers.length; pl++) {
            layer_promises.push(this.load_layer.bind(this, this.layers[pl]));
        }

        // Solution from : https://stackoverflow.com/questions/30853265/dynamic-chaining-in-javascript-promises
        return new Promise(function(resolve, reject) {
            layer_promises.reduce(function(prev, curr) {
                return prev.then(curr);
            }, Promise.resolve(1)).then(function() {
                resolve();
            }).catch(function(error) {
                reject(error);
            });
        });
    };

    this.load_layer = function(layer) {
        let a;
        let promises = [];
        for (a = 0; a < layer.length; a++) {
            promises.push(layer[a].load_asset());
        }
        return Promise.all(promises);
    };
};
