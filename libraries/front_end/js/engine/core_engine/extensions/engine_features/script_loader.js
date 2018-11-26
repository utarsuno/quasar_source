'use strict';

Object.assign(
    $_QE.prototype,
    {
        // https://humanwhocodes.com/blog/2009/07/28/the-best-way-to-load-external-javascript/
        load_script: function(url, callback){
            let script  = document.createElement('script');
            script.type = 'text/javascript';
            if (callback != null) {
                script.onload = function () {
                    callback();
                };
            }
            script.src = url;
            document.getElementsByTagName('head')[0].appendChild(script);
        },
    }
);
