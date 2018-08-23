#!/usr/bin/env bash

source /quasar/scripts/utilities/script_utilities.sh

print_dashed_line_with_text "Building websocket server"

cd /quasar/generated_output/third_party_libraries/uWebSocketsv0_14_8/src;
g++ -std=c++11 -O3 -I /quasar/generated_output/third_party_libraries/uWebSocketsv0_14_8/src -shared -fPIC -pie Extensions.cpp Group.cpp Networking.cpp Hub.cpp Node.cpp WebSocket.cpp HTTPSocket.cpp Socket.cpp Epoll.cpp /quasar/applications/nexus_server/websockets/universal_defines.cpp /quasar/applications/nexus_server/websockets/client_instance.cpp /quasar/applications/nexus_server/websockets/server_logic.cpp /quasar/applications/nexus_server/websockets/websocket_server.cpp -o /quasar/generated_output/websocket_server/websocket_server -lssl -lcrypto -lz -lpthread -lboost_system -s

print_dashed_line_with_text "Finished!"
