#include "courier_websocket.h"

/*__        __          __
 |__) |  | |__) |    | /  `
 |    \__/ |__) |___ | \__, */

CourierWebsocket::CourierWebsocket(int port_to_listen_on) {
    this->number_of_connected_clients = 0;
    this->port_to_listen_on           = port_to_listen_on;
}

void CourierWebsocket::set_reference_rabbitmq(CourierRabbitMQ * rabbitmq) {
    this->rabbitmq = rabbitmq;
}

std::thread CourierWebsocket::start_service() {
    return std::thread( [this] {
        this->run_websockets();
    });
}

/*__   __              ___  ___
 |__) |__) | \  /  /\   |  |__
 |    |  \ |  \/  /~~\  |  |___ */

void CourierWebsocket::run_websockets() {
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

    h.onMessage([&](uWS::WebSocket<uWS::SERVER> *ws, char *message, size_t length, uWS::OpCode opCode) {

        //printf("SERVER GOT A MESSAGE!\n");
        //printf("THE CLIENT IS {%d}\n", get_client_id_from_websocket(ws));
        //printf("The message is {%.*s}\n", length, message);
        this->on_message(ws, message, length);
        fflush(stdout);
        //ws->send(message, length, opCode);
    });

    h.onConnection([&](uWS::WebSocket<uWS::SERVER> *ws, uWS::HttpRequest req) {
        this->on_connection(ws);
    });

    h.onDisconnection([&](uWS::WebSocket<uWS::SERVER> *ws, int code, char *message, size_t length) {
        this->on_disconnection(ws);
    });

    // Testing out ping.
    //h.getDefaultGroup<uWS::SERVER>().startAutoPing(10000);
    if (h.listen(this->port_to_listen_on)) {
        h.run();
    }
}

ClientInstance * CourierWebsocket::get_client_instance(uWS::WebSocket<uWS::SERVER> * ws) {
    // First check if any client instance is dead.
    if (this->number_of_connected_clients != 0 && this->clients.size() != this->number_of_connected_clients) {
        for (int c = 0; c < this->clients.size(); c++) {
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

void CourierWebsocket::on_connection(uWS::WebSocket<uWS::SERVER> * ws) {
    ClientInstance * client = this->get_client_instance(ws);
    this->number_of_connected_clients++;
    printf("NUMBER OF CLIENT OBJECTS {%ld}\n", this->clients.size());
    printf("NUMBER OF CLIENTS CONNECTED {%ld}\n", this->number_of_connected_clients);
    fflush(stdout);
}

void CourierWebsocket::on_disconnection(uWS::WebSocket<uWS::SERVER> * ws) {
    printf("CLIENT DISCONNECTED {%d}\n", ((ClientInstance *) ws->getUserData())->get_id());
    ClientInstance * client = (ClientInstance *) ws->getUserData();
    client->kill();
    this->number_of_connected_clients--;
}

void CourierWebsocket::on_message(uWS::WebSocket<uWS::SERVER> *ws, char *message, size_t length) {
    printf("SERVER GOT A MESSAGE!\n");
    //printf("THE CLIENT IS {%d}\n", get_client_id_from_websocket(ws));
    printf("The message is {%.*s}\n", (int) length, message);
    this->rabbitmq->forward_message(message, length);
}


void CourierWebsocket::broadcast_message(const char * message, size_t length) {
    for (int c = 0; c < this->number_of_connected_clients; c++) {
        printf("Is client alive?");
        if (this->clients[c]->is_alive()) {
            printf("sending message to an alive client!");
            this->clients[c]->send_message(message, length);
        }
    }
}