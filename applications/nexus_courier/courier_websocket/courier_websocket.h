#ifndef COURIER_WEBSOCKET
#define COURIER_WEBSOCKET

// C++
#include <thread>
// Websockets
#include "/quasar/generated_output/third_party_libraries/uWebSocketsv0_14_8/src/uWS.h"
// Custom
#include "client_instance.h"
#include "courier_rabbitmq.h"


// "All event handlers are attached to a group and all sockets belong to exactly one group."


class CourierWebsocket {
public:
    CourierWebsocket(int port_to_listen_on);
    void set_reference_rabbitmq(CourierRabbitMQ * rabbitmq);
    std::thread start_service();
private:
    int               port_to_listen_on;
    CourierRabbitMQ * rabbitmq;

    void run_websockets();

    std::vector<ClientInstance *> clients;
    unsigned long number_of_connected_clients;
    ClientInstance * get_client_instance(uWS::WebSocket<uWS::SERVER> * ws);

    void on_connection(uWS::WebSocket<uWS::SERVER> *ws);
    void on_disconnection(uWS::WebSocket<uWS::SERVER> *ws);
    void on_message(uWS::WebSocket<uWS::SERVER> *ws, char *message, size_t length);
};



#endif
