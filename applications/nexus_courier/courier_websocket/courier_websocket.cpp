#include "courier_websocket.h"

/*__        __          __
 |__) |  | |__) |    | /  `
 |    \__/ |__) |___ | \__, */

CourierWebsocket::CourierWebsocket(const unsigned int port_to_listen_on, const bool debug_on) {
    this->number_of_connected_sessions = 0;
    this->debug_on                     = debug_on;
    this->port_to_listen_on            = port_to_listen_on;
}

CourierWebsocket::~CourierWebsocket() {
    // TODO: Send exit message to all connected sessions first!
    this->free_session_memory();
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

void CourierWebsocket::free_session_memory() {
    // Clear nodes.
    std::vector<SessionInstance *>().swap(this->sessions);
}

void CourierWebsocket::run_websockets() {
    uWS::Hub h;

    uS::Timer * timer = new uS::Timer(h.getLoop());
    timer->start([](uS::Timer * timer) {
        //printf("ONE SECOND HAS PASSED!!\n");
        fflush(stdout);
    }, 1000, 1000);

    h.onError([](int port) {
        printf("SERVER HAD AN ERROR!! WITH PORT {%d}\n", port);
        fflush(stdout);
        exit(-1);
    });

    h.onMessage([&](uWS::WebSocket<uWS::SERVER> *ws, char *message, size_t length, uWS::OpCode opCode) {
        this->on_message(((SessionInstance *) ws->getUserData()), message, length);
    });

    h.onConnection([&](uWS::WebSocket<uWS::SERVER> *ws, uWS::HttpRequest req) {
        this->on_connection(ws);
    });

    h.onDisconnection([&](uWS::WebSocket<uWS::SERVER> *ws, int code, char *message, size_t length) {
        //this->on_disconnection(ws);
        this->on_disconnection(((SessionInstance *) ws->getUserData()));
    });

    // Testing out ping.
    //h.getDefaultGroup<uWS::SERVER>().startAutoPing(10000);
    if (h.listen(this->port_to_listen_on)) {
        h.run();
    }
}

SessionInstance * CourierWebsocket::get_session_instance(uWS::WebSocket<uWS::SERVER> * ws) {
    // First check if any session instance is dead.
    if (this->sessions.size() > this->number_of_connected_sessions) {
        for (int c = 0; c < this->sessions.size(); c++) {
            if (!this->sessions[c]->is_alive()) {
                this->sessions[c]->initialize(ws);
                return this->sessions[c];
            }
        }
    }
    // No dead sessions so return a new one.
    SessionInstance * session = new SessionInstance((unsigned char) this->sessions.size() + 1);
    session->initialize(ws);
    this->sessions.push_back(session);
    return session;
}

void CourierWebsocket::on_connection(uWS::WebSocket<uWS::SERVER> * ws) {
    SessionInstance * session = this->get_session_instance(ws);
    this->number_of_connected_sessions++;
    if (this->debug_on) {
        printf("{%d} connected sessions, {%d} session objects\n", (int) this->number_of_connected_sessions, (int) this->sessions.size());
    }
    session->on_connection();
}

void CourierWebsocket::on_disconnection(SessionInstance * session) {
    if (this->debug_on) {
        printf("Session{%d} disconnected!\n", session->get_id());
    }
    session->kill();
    this->number_of_connected_sessions--;
}

void CourierWebsocket::on_message(SessionInstance * session, char * message, size_t length) {
    if (this->debug_on) {
        printf("{%d} sent message %.*s\n", session->get_id(), (int) length, message);
    }

    if (message[0] & 1 == 0) {
        session->on_reply(message, length);
    } else {
        if (message[0] == WS_TYPE_GLOBAL_CHAT) {
            this->broadcast_message(message, length, session->get_id());
        }
        session->send_reply(message, length);
    }

    for (int b = 0; b < length; b++) {
        printf("%d ", (int) (message[b]));
    }
    if (length > 0) {
        printf("\n");
    }

    // TEMP;
    return;

    /*
    int command;
    if (strstr(message, "\"t\":\"m0\"") != NULL) {
        command = 0;
    } else {
        command = -1;
    }

    if (this->debug_on) {
        printf("The command was {%d}\n", command);
    }

    switch(command) {
    case 0:
        // Chat message so broadcast it to all.
        this->rabbitmq->forward_message(message, length);
        break;
    default:
        printf("Invalid command! {%d}\n", command);
        // TODO: Send error message back.
        break;
    }
    */
}

void CourierWebsocket::broadcast_message(const char * message, size_t length) {
    for (int s = 0; s < this->number_of_connected_sessions; s++) {
        if (this->sessions[s]->is_alive()) {
            this->sessions[s]->send_message(message, length);
        }
    }
}

void CourierWebsocket::broadcast_message(const char * message, size_t length, const unsigned short int ignore_session_id) {
    for (int s = 0; s < this->number_of_connected_sessions; s++) {
        if (this->sessions[s]->is_alive() && this->sessions[s]->get_id() != ignore_session_id) {
            this->sessions[s]->send_message(message, length);
        }
    }
}
