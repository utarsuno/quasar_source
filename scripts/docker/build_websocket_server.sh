#!/usr/bin/env bash

source /quasar/scripts/utilities/script_utilities.sh

print_dashed_line_with_text "Building websocket server"


cd /quasar/generated_output/third_party_libraries/AMQP_CPP_3_1_0;

make
make install


cd /quasar/generated_output/third_party_libraries/uWebSocketsv0_14_8/src;
# WORKS
#g++ -std=c++11 -O3 -I /quasar/generated_output/third_party_libraries/uWebSocketsv0_14_8/src -shared -fPIC -pie Extensions.cpp Group.cpp Networking.cpp Hub.cpp Node.cpp WebSocket.cpp HTTPSocket.cpp Socket.cpp Epoll.cpp /quasar/applications/nexus/websockets/universal_defines.cpp /quasar/applications/nexus/websockets/client_instance.cpp /quasar/applications/nexus/websockets/server_logic.cpp /quasar/applications/nexus/websockets/websocket_server.cpp -o /quasar/generated_output/websocket_server/websocket_server -lssl -lcrypto -lz -lpthread -lboost_system -s

#g++ -std=c++11 -O3 -I /quasar/generated_output/third_party_libraries/uWebSocketsv0_14_8/src -I /quasar/generated_output/third_party_libraries/AMQP_CPP_3_1_0/include -I /quasar/applications/nexus/rabbitmq -shared -fPIC -pie Extensions.cpp Group.cpp Networking.cpp Hub.cpp Node.cpp WebSocket.cpp HTTPSocket.cpp Socket.cpp Epoll.cpp /quasar/applications/nexus/websockets/universal_defines.cpp /quasar/applications/nexus/websockets/client_instance.cpp /quasar/applications/nexus/websockets/server_logic.cpp /quasar/applications/nexus/websockets/websocket_server.cpp /quasar/generated_output/third_party_libraries/AMQP_CPP_3_1_0/include/amqpcpp.h /quasar/applications/nexus/rabbitmq/test.cpp -o /quasar/generated_output/websocket_server/websocket_server -lssl -lcrypto -lz -lpthread -lboost_system -s -lamqpcpp

#/usr/lib/

WEBSOCKET=/quasar/generated_output/third_party_libraries/uWebSocketsv0_14_8/
RABBITMQ=/quasar/generated_output/third_party_libraries/AMQP_CPP_3_1_0/
Q_WEBSOCKET=/quasar/applications/nexus_courier/courier_websocket/
Q_RABBITMQ=/quasar/applications/nexus_courier/courier_rabbitmq

g++ -std=c++11 -O3 -I /usr/lib/ -I ${WEBSOCKET}src -I ${RABBITMQ}include -I ${Q_RABBITMQ} -shared -fPIC -pie Extensions.cpp Group.cpp Networking.cpp Hub.cpp Node.cpp WebSocket.cpp HTTPSocket.cpp Socket.cpp Epoll.cpp ${Q_WEBSOCKET}universal_defines.cpp ${Q_WEBSOCKET}client_instance.cpp ${Q_WEBSOCKET}server_logic.cpp ${Q_WEBSOCKET}websocket_server.cpp ${RABBITMQ}include/amqpcpp.h ${Q_RABBITMQ}/test.cpp -o /quasar/generated_output/websocket_server/websocket_server -lssl -lcrypto -lz -lpthread -lboost_system -s -lamqpcpp


cp /usr/lib/libamqpcpp.so.3.1 /quasar/generated_output/libamqpcpp.so.3.1

#sleep 10000m


# THIS WORKS!
#g++ -std=c++14 -O3 -I /quasar/generated_output/third_party_libraries/AMQP_CPP_3_1_0/include /quasar/generated_output/third_party_libraries/AMQP_CPP_3_1_0/include/amqpcpp.h /quasar/applications/nexus/rabbitmq/test.cpp -o /quasar/generated_output/websocket_server/TEST_FILE_TEST -lamqpcpp -lpthread

print_dashed_line_with_text "Finished!"
