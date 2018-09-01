#ifndef CLIENT_INSTANCE
#define CLIENT_INSTANCE

#include "/quasar/generated_output/third_party_libraries/uWebSocketsv0_14_8/src/uWS.h"

class ClientInstance {
    public:
        ClientInstance();
        void initialize(uWS::WebSocket<uWS::SERVER> * ws, size_t client_id, ClientInstance * self);
        void kill();
        int is_alive();
        int get_id();
    private:
        int alive;
        uWS::WebSocket<uWS::SERVER> * ws;
        int client_id;
};

#endif
