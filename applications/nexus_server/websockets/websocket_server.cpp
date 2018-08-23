#include "/quasar/generated_output/third_party_libraries/uWebSocketsv0_14_8/src/uWS.h"
#include "server_logic.h"

#include <stdio.h>
#include <iostream>
#include <thread>
#include <chrono>
#include <cstdint>

// "All event handlers are attached to a group and all sockets belong to exactly one group."
NexusServer nexus;

int mainOLD() {
    uWS::Hub h;

    uS::Timer * timer = new uS::Timer(h.getLoop());
    timer->start([](uS::Timer * timer) {
        //printf("ONE SECOND HAS PASSED!!\n");
        fflush(stdout);
    }, 1000, 1000);


    printf("ECHO SERVER STARTED!!!\n");

    h.onError([](int port) {
        printf("SERVER HAD AN ERROR!! WITH PORT {%d}\n", port);
        fflush(stdout);
        exit(-1);
    });

    h.onMessage([](uWS::WebSocket<uWS::SERVER> *ws, char *message, size_t length, uWS::OpCode opCode) {

        //printf("SERVER GOT A MESSAGE!\n");
        //printf("THE CLIENT IS {%d}\n", get_client_id_from_websocket(ws));
        //printf("The message is {%.*s}\n", length, message);
        fflush(stdout);
        //ws->send(message, length, opCode);
    });

    h.onConnection([](uWS::WebSocket<uWS::SERVER> *ws, uWS::HttpRequest req) {
        nexus.on_connection(ws);
    });

    h.onDisconnection([](uWS::WebSocket<uWS::SERVER> *ws, int code, char *message, size_t length) {
        nexus.on_disconnection(ws);
    });

    // Testing out ping.
    //h.getDefaultGroup<uWS::SERVER>().startAutoPing(10000);
    if (h.listen(3001)) {
        h.run();
    }
}

int main() {

    printf("START THREAD!\n");
    fflush(stdout);

    std::thread thread_websocket (mainOLD);

    printf("JOIN THREAD!\n");
    fflush(stdout);

    thread_websocket.join();

    printf("FINISH thread!\n");
    fflush(stdout);

    return 66;
}

