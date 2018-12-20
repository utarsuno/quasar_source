#ifndef COURIER_WEBSOCKET
#define COURIER_WEBSOCKET

#include "nexus_courier.h"

class SessionInstance;
class CourierRabbitMQ;

// "All event handlers are attached to a group and all sockets belong to exactly one group."

class CourierWebsocket {
public:
    CourierWebsocket(const unsigned int port_to_listen_on, const bool debug_on);
    ~CourierWebsocket();

    void set_reference_rabbitmq(CourierRabbitMQ * rabbitmq);
    std::thread start_service();

    void broadcast_message(const char * message, size_t length);
    void broadcast_message(const char * message, size_t length, const unsigned short ignore_session_id);
private:
    int               port_to_listen_on;
    bool              debug_on;
    CourierRabbitMQ * rabbitmq;

    void run_websockets();

    std::vector<SessionInstance *> sessions;
    unsigned char number_of_connected_sessions;
    SessionInstance * get_session_instance(uWS::WebSocket<uWS::SERVER> * ws);

    void free_session_memory();

    void on_connection(uWS::WebSocket<uWS::SERVER> *ws);
    void on_disconnection(SessionInstance * session);
    void on_message(SessionInstance * session, char *message, size_t length);
};



#endif
