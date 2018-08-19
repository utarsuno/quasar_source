#include "client_instance.h"

ClientInstance * get_new_client_instance(const unsigned int client_id) {
    ClientInstance * client = new ClientInstance;
    client->client_id       = client_id;
    return client;
}

void free_client_instance(ClientInstance * client) {
    delete client;
}

unsigned int get_client_id_from_websocket(uWS::WebSocket<uWS::SERVER> * ws) {
    return ((ClientInstance *) ws->getUserData())->client_id;
}