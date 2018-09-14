#!/usr/bin/env bash

source /quasar/scripts/utilities/script_utilities.sh

print_dashed_line_with_text "Building nexus_courier"


cd /quasar/generated_output/third_party_libraries/AMQP_CPP_3_1_0;
make
make install

cd /quasar/generated_output/third_party_libraries/uWebSocketsv0_14_8/src;

#g++ -std=c++11 -O3 -I /quasar/generated_output/third_party_libraries/uWebSocketsv0_14_8/src -shared -fPIC -pie Extensions.cpp Group.cpp Networking.cpp Hub.cpp Node.cpp WebSocket.cpp HTTPSocket.cpp Socket.cpp Epoll.cpp /quasar/applications/nexus/websockets/universal_defines.cpp /quasar/applications/nexus/websockets/client_instance.cpp /quasar/applications/nexus/websockets/server_logic.cpp /quasar/applications/nexus/websockets/websocket_server.cpp -o /quasar/generated_output/websocket_server/websocket_server -lssl -lcrypto -lz -lpthread -lboost_system -s
#g++ -std=c++11 -O3 -I /quasar/generated_output/third_party_libraries/uWebSocketsv0_14_8/src -I /quasar/generated_output/third_party_libraries/AMQP_CPP_3_1_0/include -I /quasar/applications/nexus/rabbitmq -shared -fPIC -pie Extensions.cpp Group.cpp Networking.cpp Hub.cpp Node.cpp WebSocket.cpp HTTPSocket.cpp Socket.cpp Epoll.cpp /quasar/applications/nexus/websockets/universal_defines.cpp /quasar/applications/nexus/websockets/client_instance.cpp /quasar/applications/nexus/websockets/server_logic.cpp /quasar/applications/nexus/websockets/websocket_server.cpp /quasar/generated_output/third_party_libraries/AMQP_CPP_3_1_0/include/amqpcpp.h /quasar/applications/nexus/rabbitmq/test.cpp -o /quasar/generated_output/websocket_server/websocket_server -lssl -lcrypto -lz -lpthread -lboost_system -s -lamqpcpp


WEBSOCKET=/quasar/generated_output/third_party_libraries/uWebSocketsv0_14_8/
RABBITMQ=/quasar/generated_output/third_party_libraries/AMQP_CPP_3_1_0/

Q_WEBSOCKET=/quasar/applications/nexus_courier/courier_websocket/
Q_RABBITMQ=/quasar/applications/nexus_courier/courier_rabbitmq/
Q_NEXUS=/quasar/applications/nexus_courier/

#TODO: Try using a newer version of C++

g++ -std=c++11 \
    -O3 \
    -I /usr/lib/ \
    -I ${WEBSOCKET}src \
    -I ${RABBITMQ}include \
    -I ${Q_NEXUS} \
    -I ${Q_RABBITMQ} \
    -I ${Q_WEBSOCKET} \
    -shared -fPIC -pie \
    Extensions.cpp Group.cpp Networking.cpp Hub.cpp Node.cpp WebSocket.cpp HTTPSocket.cpp Socket.cpp Epoll.cpp \
    ${Q_NEXUS}nexus_courier.cpp \
    ${Q_WEBSOCKET}client_instance.cpp \
    ${Q_WEBSOCKET}courier_websocket.cpp \
    ${Q_RABBITMQ}courier_rabbitmq.cpp \
    -o /quasar/generated_output/nexus_courier/nexus_courier \
    -lssl -lcrypto -lz -lpthread -lboost_system -s -lamqpcpp


#    ${RABBITMQ}include/amqpcpp.h \

print_dashed_line_with_text "Finished!"
