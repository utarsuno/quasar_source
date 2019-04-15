<?php
namespace Deployer;

require 'recipe/common.php';

set('allow_anonymous_stats', false);

set('path_base'        , '/quasar_source/libraries/php');
set('cd_to_base'       , 'cd /quasar_source/libraries/php;');
set('path_php_unit'    , './vendor/bin/simple-phpunit');
set('path_php_unit_xml', './phpunit.xml');
set('path_composer'    , './composer.phar');


set('path_websocket', '/quasar_source/generated_output/third_party_libraries/uWebSocketsv0_14_8/');
set('path_rabbitmq', '/quasar_source/generated_output/third_party_libraries/AMQP_CPP_3_1_0/');
set('path_q_websocket', '/quasar_source/applications/nexus_courier/courier_websocket/');
set('path_q_rabbitmq', '/quasar_source/applications/nexus_courier/courier_rabbitmq/');
set('path_q_nexus', '/quasar_source/applications/nexus_courier/');


task('build_nexus_courier', function() {
    $path_nexus         = get('path_q_nexus');
    $path_websocket     = get('path_q_websocket');
    $path_rabbitmq      = get('path_q_rabbitmq');
    $path_websocket_lib = get('path_websocket');
    $path_rabbitmq_lib  = get('path_rabbitmq');

    // Compiling with -lamqpcpp won't without the following.
    runLocally("cd ${path_rabbitmq_lib}; make; make install");

    // Create the Nexus Courier executable.
    runLocally(
        "cd ${path_websocket_lib}src/;
        g++ -std=c++11 \
        -O3 \
        -I /usr/lib/ \
        -I ${path_websocket_lib}src \
        -I ${path_rabbitmq_lib}include \
        -I ${path_nexus} \
        -I ${path_rabbitmq} \
        -I ${path_websocket} \
        -shared -fPIC -pie \
        Extensions.cpp Group.cpp Networking.cpp Hub.cpp Node.cpp WebSocket.cpp HTTPSocket.cpp Socket.cpp Epoll.cpp \
        ${path_nexus}nexus_courier.cpp \
        ${path_websocket}message_instance.cpp \
        ${path_websocket}session_instance.cpp \
        ${path_websocket}user_instance.cpp \
        ${path_websocket}courier_websocket.cpp \
        ${path_rabbitmq}courier_rabbitmq.cpp \
        -o /quasar_source/var/nexus_courier \
        -lssl -lcrypto -lz -lpthread -lboost_system -s -lamqpcpp"
    );
})->desc('Builds the Nexus Courier C++ project.');

task('run_health_check', function() {
    $composer = get('cd_to_base') . ' ' . get('path_composer');
    runLocally("$composer self-update --clean-backups");
    runLocally("$composer validate");
    runLocally("$composer diagnose");
    runLocally("$composer check-platform-reqs");
})->desc('Checks for any errors in the project.');

task('full_build', function() {
    $composer      = get('cd_to_base') . ' ' . get('path_composer');
    $args_composer = '--no-progress --no-interaction --optimize-autoloader --no-dev --profile --verbose';
    runLocally("$composer update $args_composer");
    runLocally("$composer install $args_composer");
})->desc('Fully updates and builds this project.');

task('run_all_tests', function() {
    $_run                  = get('cd_to_base');
    $path_php_unit         = get('path_php_unit');
    $path_php_unit_configs = get('path_php_unit_xml');
    run("$_run php $path_php_unit -c $path_php_unit_configs");
})->desc('Run all PHP unit tests.');




/*
TODOs: Docker related builds and operations

echo "Removing un-used networks."
echo 'y' | docker network prune

echo "Removing un-used volumes."
echo 'y' | docker volume prine

echo "Removing un-used images."
echo 'y' | docker image prine

echo "Removing stopped containers."
docker ps -aq --no-trunc -f status=exited | xargs docker rm
 */



// Project name
//set('application', 'my_project');

// Project repository
//set('repository', 'https://github.com/utarsuno/quasar_source');

// [Optional] Allocate tty for git clone. Default value is false.
//set('git_tty', true);

// Shared files/dirs between deploys 
//set('shared_files', []);
//set('shared_dirs', []);

// Writable dirs by web server 
//set('writable_dirs', []);

// Hosts

//host('project.com')
//    ->set('deploy_path', '~/{{application}}');


// Tasks

/*
task('deploy', [
    'deploy:info',
    'deploy:prepare',
    'deploy:lock',
    'deploy:release',
    'deploy:update_code',
    'deploy:shared',
    'deploy:writable',
    'deploy:vendors',
    'deploy:clear_paths',
    'deploy:symlink',
    'deploy:unlock',
    'cleanup',
    'success'
]);
*/

// [Optional] If deploy fails automatically unlock.
//after('deploy:failed', 'deploy:unlock');
