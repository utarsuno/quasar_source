#!/usr/bin/env bash

source /quasar_source/scripts/_pre_process/utilities_general.sh

print_dashed_line_with_text "Building nexus_courier"

cd /quasar_source/generated_output/third_party_libraries/uWebSocketsv0_14_8/src;

WEBSOCKET=/quasar_source/generated_output/third_party_libraries/uWebSocketsv0_14_8/
RABBITMQ=/quasar_source/generated_output/third_party_libraries/AMQP_CPP_3_1_0/

Q_WEBSOCKET=/quasar_source/applications/nexus_courier/courier_websocket/
Q_RABBITMQ=/quasar_source/applications/nexus_courier/courier_rabbitmq/
Q_NEXUS=/quasar_source/applications/nexus_courier/

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
    ${Q_WEBSOCKET}message_instance.cpp \
    ${Q_WEBSOCKET}session_instance.cpp \
    ${Q_WEBSOCKET}user_instance.cpp \
    ${Q_WEBSOCKET}courier_websocket.cpp \
    ${Q_RABBITMQ}courier_rabbitmq.cpp \
    -o /quasar_source/generated_output/nexus_courier/nexus_courier \
    -lssl -lcrypto -lz -lpthread -lboost_system -s -lamqpcpp

print_dashed_line_with_text "Finished building nexus_courier!"
