//const path = require('/quasar_source/libraries/front_end/hello_world.js');

module.exports = {
    entry: '/quasar_source/libraries/front_end/hello_world.js',
    output: {
        filename: 'nl.js',
        path: '/quasar_source/var/nexus_local/'
    },
    mode: 'production',
    resolve: {
        extensions: ['.js'],
        modules: ['/quasar_source/applications/asset_server/js', 'node_modules'],
        alias: {
        }
    }
};

//plugins: [
//    new webpack.ProvidePlugin({
//        'THREE': 'three'
//    })
//]
