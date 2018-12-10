#ifndef CLIENT_INSTANCE
#define CLIENT_INSTANCE

#include "nexus_courier.h"

class ClientInstance {
    public:
        ClientInstance();
        void initialize(uWS::WebSocket<uWS::SERVER> * ws, size_t client_id, ClientInstance * self);
        void kill();
        int is_alive();
        int get_id();

        //
        void send_message(const char * message, size_t length);
    private:
        int alive;
        uWS::WebSocket<uWS::SERVER> * ws;
        int client_id;
};

#endif
