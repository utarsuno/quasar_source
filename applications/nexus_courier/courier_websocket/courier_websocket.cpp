#include "courier_websocket.h"

/*__   __   __
 /  \ /  \ |__)
 \__/ \__/ |   */
CourierWebsocket::CourierWebsocket(const unsigned int port_to_listen_on, const bool debug_on) {
    this->number_of_connected_sessions = 0;
    this->debug_on                     = debug_on;
    this->port_to_listen_on            = port_to_listen_on;
}

CourierWebsocket::~CourierWebsocket() {
    // TODO: Send exit message to all connected sessions first!
    // TODO: Save any changes to database.
    // Clear nodes.
    std::vector<SessionInstance *>().swap(this->sessions);
}

void CourierWebsocket::set_reference_rabbitmq(CourierRabbitMQ * rabbitmq) {
    this->rabbitmq = rabbitmq;
}

/*__        __          __
 |__) |  | |__) |    | /  `
 |    \__/ |__) |___ | \__, */
std::thread CourierWebsocket::start_service() {
    return std::thread( [this] {
        this->run_websockets();
    });
}

/*__   __              ___  ___
 |__) |__) | \  /  /\   |  |__
 |    |  \ |  \/  /~~\  |  |___ */

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

void CourierWebsocket::on_message(SessionInstance * session, char * message, size_t length) {
    if (length < 8) {
        fprintf(stderr, "Message is too short at {%d} bytes!\n", (int) length);
        exit(EXIT_CODE_INVALID_MESSAGE_HEADER);
    }
    if (this->debug_on) {
        printf("{%d} sent message %.*s\n", session->get_id(), (int) length, message);
    }
    session->handle_response(message, length);
}

void CourierWebsocket::broadcast_message(const char * buffer, size_t length) {
    for (int s = 0; s < this->number_of_connected_sessions; s++) {
        if (this->sessions[s]->is_alive()) {
            this->sessions[s]->forward_message(buffer, length);
        }
    }
}

void CourierWebsocket::broadcast_message(const char * buffer, size_t length, const unsigned short ignore_session_id) {
    for (int s = 0; s < this->number_of_connected_sessions; s++) {
        if (this->sessions[s]->is_alive() && this->sessions[s]->get_id() != ignore_session_id) {
            this->sessions[s]->forward_message(buffer, length);
        }
    }
}

/*___       ___      ___  __
 |__  \  / |__  |\ |  |  /__`
 |___  \/  |___ | \|  |  .__/ */
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
    // TODO: If the session was logged in then broadcast a message.
    session->kill();
    this->number_of_connected_sessions--;
}

/*      ___  ___  __
 | |\ |  |  |__  |__) |\ |  /\  |
 | | \|  |  |___ |  \ | \| /~~\ |___*/
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
        exit(EXIT_CODE_PORT_ERROR);
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

