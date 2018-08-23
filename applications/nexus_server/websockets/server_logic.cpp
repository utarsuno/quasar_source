#include "server_logic.h"
#include "universal_defines.h"

NexusServer::NexusServer() {
    this->number_of_connected_clients = 0;
}

void NexusServer::on_connection(uWS::WebSocket<uWS::SERVER> * ws) {
    ClientInstance * client = this->get_client_instance(ws);
    this->number_of_connected_clients++;
    //printf("NUMBER OF CLIENT OBJECTS {%ld}\n", this->clients.size());
    //printf("NUMBER OF CLIENTS CONNECTED {%ld}\n", this->number_of_connected_clients);
    //fflush(stdout);
}

void NexusServer::on_disconnection(uWS::WebSocket<uWS::SERVER> * ws) {
    //printf("CLIENT DISCONNECTED {%lu}\n", ((ClientInstance *) ws->getUserData())->get_id());
    ClientInstance * client = (ClientInstance *) ws->getUserData();
    client->kill();
    this->number_of_connected_clients--;
}

void NexusServer::on_message(uWS::WebSocket<uWS::SERVER> *ws, char *message, size_t length) {

}


ClientInstance * NexusServer::get_client_instance(uWS::WebSocket<uWS::SERVER> * ws) {
    // First check if any client instance is dead.
    int c;
    if (this->number_of_connected_clients != 0 && this->clients.size() != this->number_of_connected_clients) {
        for (c = 0; c < this->clients.size(); c++) {
            if (!this->clients[c]->is_alive()) {
                this->clients[c]->initialize(ws, this->clients[c]->get_id(), this->clients[c]);
                return this->clients[c];
            }
        }
    }
    // No dead clients so return a new one.
    ClientInstance * client = new ClientInstance();
    client->initialize(ws, this->clients.size(), client);
    this->clients.push_back(client);
    return client;
}
