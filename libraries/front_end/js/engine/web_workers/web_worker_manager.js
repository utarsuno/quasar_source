'use strict';

$_QE.prototype.WebWorkerManager = function() {

    this.create_worker = function(func) {
        let blob = new Blob(['self.onmessage = '], func.toString(),
            {type: 'text/javascript'}
        );
        let url = 5;
    };

};
