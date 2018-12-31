#ifndef NEXUS_COURIER
#define NEXUS_COURIER

// C++
#include <thread>
#include <stdio.h>
#include <stdlib.h> // Needed for atoi.
#include <cstdlib>  // Needed for getenv
//#include <sstream>
#include <string>
#include <string.h>
#include <iostream>
#include <chrono>
#include <cstdint>
// RabbitMQ
#include <amqpcpp.h>
#include <boost/asio/io_service.hpp>
#include <boost/asio/strand.hpp>
#include <boost/asio/deadline_timer.hpp>
#include <amqpcpp/libboostasio.h>
// Websockets
#include "/quasar_source/generated_output/third_party_libraries/uWebSocketsv0_14_8/src/uWS.h"

// Global.
#define EXIT_CODE_SUCCESS                13
#define EXIT_CODE_FAILED                 199
#define EXIT_CODE_PORT_ERROR             198
#define EXIT_CODE_INVALID_MESSAGE_HEADER 197
//
#define WS_ID_INVALID     1337
//
// Current message sizes.
// message_type --> 1 byte
// message_id   --> 2 byte
// session_id   --> 2 byte
// user_id      --> 2 byte
// data_header  --> 2 bytes
// data         --> n bytes
//

// Server to client.
#define WS_TYPE_ESTABLISH_SESSION 2
#define WS_TYPE_SERVER_MESSAGE    4
// Client to server.
#define WS_TYPE_GLOBAL_CHAT       1
#define WS_TYPE_GET_NUM_SESSIONS  3
// Keys.
#define WS_DATA_KEY_INT           0
#define WS_DATA_KEY_TEXT          1

/*
// Function from : https://stackoverflow.com/questions/1489830/efficient-way-to-determine-number-of-digits-in-an-integer
template <class T>
int number_of_digits(T number)
{
    int digits = 0;
    if (number < 0) digits = 1; // remove this line if '-' counts as a digit
    while (number) {
        number /= 10;
        digits++;
    }
    return digits;
}
*/

/*
struct NetworkMessage {
    unsigned short id_message_type;
    unsigned short id_message;
    unsigned short id_session;
    unsigned short id_user;
    char         * buffer;
    unsigned int   buffer_length;
};
*/

// Custom
#include "message_instance.h"
#include "session_instance.h"
#include "user_instance.h"
#include "courier_rabbitmq.h"
#include "courier_websocket.h"


class NexusCourier {
public:
    //NexusCourier(const bool debug_on);
    NexusCourier(const bool debug_on, const unsigned int websocket_port, const char * rabbitmq_host, const char * rabbitmq_queue);
    ~NexusCourier();
    void run_all_threads();
private:
    bool               debug_on;
    CourierRabbitMQ  * rabbitmq;
    CourierWebsocket * websockets;
    std::thread        thread_rabbitmq;
    std::thread        thread_websockets;
};

#endif
