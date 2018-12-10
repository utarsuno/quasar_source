#include "client_instance.h"

/*
unsigned int get_client_id_from_websocket(uWS::WebSocket<uWS::SERVER> * ws) {
    return ((ClientInstance *) ws->getUserData())->client_id;
}
*/

ClientInstance::ClientInstance() {

}

void ClientInstance::initialize(uWS::WebSocket<uWS::SERVER> * ws, size_t client_id, ClientInstance * self) {
    this->client_id = client_id;
    this->alive     = TRUE;
    this->ws        = ws;
    this->ws->setUserData(self);
}

int ClientInstance::is_alive() {
    return this->alive;
}

int ClientInstance::get_id() {
    return this->client_id;
}

void ClientInstance::kill() {
    this->alive = FALSE;
}

void ClientInstance::send_message(const char * message, size_t length) {
    this->ws->send(message, length, uWS::OpCode::TEXT);
    //this->ws->send(message, length, uWS::OpCode::BINARY);
}
