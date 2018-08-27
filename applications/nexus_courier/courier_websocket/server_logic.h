#ifndef SERVER_LOGIC
#define SERVER_LOGIC

#include "/quasar/generated_output/third_party_libraries/uWebSocketsv0_14_8/src/uWS.h"
#include "client_instance.h"

class NexusServer {
public:
    NexusServer();
    void on_connection(uWS::WebSocket<uWS::SERVER> *ws);
    void on_disconnection(uWS::WebSocket<uWS::SERVER> *ws);
    void on_message(uWS::WebSocket<uWS::SERVER> *ws, char *message, size_t length);
private:
    std::vector<ClientInstance *> clients;
    unsigned long number_of_connected_clients;
    ClientInstance * get_client_instance(uWS::WebSocket<uWS::SERVER> * ws);
};


#endif