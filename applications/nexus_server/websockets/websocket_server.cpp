//#include <uWS/uWS.h>
#include "/quasar/generated_output/third_party_libraries/uWebSocketsv0_14_8/src/uWS.h"
#include "client_instance.h"
#include "server_logic.h"
#include <stdio.h>
#include <iostream>
#include <chrono>
#include <cstdint>

// "All event handlers are attached to a group and all sockets belong to exactly one group."

unsigned int TEMPORARY_MAX_CLIENT_ID = 0;

int main() {
    uWS::Hub h;

    //h.connect('');
    printf("ECHO SERVER STARTED!!!\n");

    h.onError([](int port) {
        printf("SERVER HAD AN ERROR!! WITH PORT {%d}\n", port);
        fflush(stdout);
        exit(-1);
    });

    h.onMessage([](uWS::WebSocket<uWS::SERVER> *ws, char *message, size_t length, uWS::OpCode opCode) {
        printf("SERVER GOT A MESSAGE!\n");
        printf("THE CLIENT IS {%d}\n", get_client_id_from_websocket(ws));
        printf("The message is {%.*s}\n", length, message);
        fflush(stdout);
        //ws->send(message, length, opCode);
    });

    //h.onConnection([](uWS::WebSocket<uWS::CLIENT> *ws, uWS::HttpRequest req) {
    h.onConnection([](uWS::WebSocket<uWS::SERVER> *ws, uWS::HttpRequest req) {
        ws->setUserData(get_new_client_instance(TEMPORARY_MAX_CLIENT_ID++));

        printf("SERVER MADE A CONNECTION!!!! {%d}\n", get_client_id_from_websocket(ws));
        //printf("SERVER MADE A CONNECTION!!!! {%d}\n", (intptr_t) ws->getNodeData()->getUserData());

        //printf("{%s}\n", req.getHeader("sec-websocket-key", 17));

        fflush(stdout);
    });

    h.onDisconnection([](uWS::WebSocket<uWS::SERVER> *ws, int code, char *message, size_t length) {
        //std::cout << "Client got disconnected with data: " << ws->getUserData() << ", code: " << code << ", message: <" << std::string(message, length) << ">" << std::endl;
        //printf("CLIENT DISCONNECTED {%s}\n", req.getHeader("sec-websocket-key", 17));
        printf("CLIENT DISCONNECTED {%s}\n", std::string(message, length));
        printf("BYE CLIENT {%d}\n", ((ClientInstance *) ws->getUserData())->client_id);
        fflush(stdout);
    });

    // Testing out ping.
    //h.getDefaultGroup<uWS::SERVER>().startAutoPing(10000);
    if (h.listen(3001)) {
        h.run();
    }
}


/*

template <bool isServer>
void Group<isServer>::onConnection(std::function<void (WebSocket<isServer> *, HttpRequest)> handler) {
    connectionHandler = handler;
}

template <bool isServer>
void Group<isServer>::onTransfer(std::function<void (WebSocket<isServer> *)> handler) {
    transferHandler = handler;
}

template <bool isServer>
void Group<isServer>::onMessage(std::function<void (WebSocket<isServer> *, char *, size_t, OpCode)> handler) {
    messageHandler = handler;
}

*/