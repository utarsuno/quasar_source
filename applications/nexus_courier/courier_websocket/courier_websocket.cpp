#include "courier_websocket.h"

/*            ___  __    ___  ___       __   ___
 | |\ | |__| |__  |__) |  |  |__  |\ | /  ` |__
 | | \| |  | |___ |  \ |  |  |___ | \| \__, |___*/
void * CourierWebsocket::get_and_create_new_entity_object() {
    SessionInstance * session_instance = new SessionInstance((unsigned char) this->get_pool_size());
    return (void *) session_instance;
}

/*__   __   __
 /  \ /  \ |__)
 \__/ \__/ |   */
CourierWebsocket::CourierWebsocket(const unsigned int port_to_listen_on, const bool debug_on) : MemoryPool() {
    this->debug_on          = debug_on;
    this->port_to_listen_on = port_to_listen_on;
}

CourierWebsocket::~CourierWebsocket() {
    // TODO: Send exit message to all connected sessions first!
    // TODO: Save any changes to database.
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
    SessionInstance * session_instance = (SessionInstance *) this->get_pool_entity();
    session_instance->set(ws);
    return session_instance;
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
    int               pool_size        = this->get_pool_size();
    SessionInstance * session_instance = NULL;
    for (int s = 0; s < pool_size; s++) {
        session_instance = (SessionInstance *) this->pool[s];
        if (session_instance->is_alive()) {
            session_instance->forward_message(buffer, length);
        }
    }
}

void CourierWebsocket::broadcast_message(const char * buffer, size_t length, const unsigned short ignore_session_id) {
    int               pool_size        = this->get_pool_size();
    SessionInstance * session_instance = NULL;
    for (int s = 0; s < pool_size; s++) {
        session_instance = (SessionInstance *) this->pool[s];
        if (session_instance->is_alive() && session_instance->get_id() != ignore_session_id) {
            session_instance->forward_message(buffer, length);
        }
    }
}

/*___       ___      ___  __
 |__  \  / |__  |\ |  |  /__`
 |___  \/  |___ | \|  |  .__/ */
void CourierWebsocket::on_connection(uWS::WebSocket<uWS::SERVER> * ws) {
    SessionInstance * session = this->get_session_instance(ws);
    if (this->debug_on) {
        printf("{%d} connected sessions, {%d} session objects\n", this->get_pool_size_active(), this->get_pool_size());
    }
    session->on_connection();
}

void CourierWebsocket::on_disconnection(SessionInstance * session) {
    if (this->debug_on) {
        printf("Session{%d} disconnected!\n", session->get_id());
    }
    // TODO: If the session was logged in then broadcast a message.
    this->pool_clear_entity((void *) session);
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
        this->on_disconnection(((SessionInstance *) ws->getUserData()));
    });

    // Testing out ping.
    //h.getDefaultGroup<uWS::SERVER>().startAutoPing(10000);
    if (h.listen(this->port_to_listen_on)) {
        h.run();
    }
}

