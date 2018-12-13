#include "session_instance.h"

SessionInstance::SessionInstance(unsigned char session_id) {
    this->user_instance       = new UserInstance();
    this->session_id          = session_id;
    this->session_established = false;
}

SessionInstance::~SessionInstance() {
    delete this->user_instance;
    this->free_messages();
}

void SessionInstance::initialize(uWS::WebSocket<uWS::SERVER> * ws) {
    this->alive      = true;
    this->ws         = ws;
    this->ws->setUserData(this);
}

void SessionInstance::on_reply(const char * message, size_t length) {
    this->finish_message_instance(message[1]);
}

void SessionInstance::on_connection() {
    MessageInstance * request = this->get_message_instance(WS_TYPE_ESTABLISH_SESSION);
    const unsigned char mid   = request->get_message_id();
    const char m[3]  = {
        request->get_message_type(),
        request->get_message_id(),
        this->session_id
    };
    /*
    (mid>>24) & 0xFF,
        (mid>>16) & 0xFF,
        (mid>>8) & 0xFF,
        mid & 0xFF
    */
    this->send_binary(m, 3);
    printf("Sent on connection message!\n");
    fflush(stdout);
}

bool SessionInstance::is_alive() {
    return this->alive;
}

unsigned char SessionInstance::get_session_id() {
    return this->session_id;
}

void SessionInstance::kill() {
    this->alive               = false;
    this->session_established = false;
    this->user_instance->kill();
    this->free_messages();
}

void SessionInstance::send_reply(const char * message, size_t length) {

}

void SessionInstance::send_message(const char * message, size_t length) {
    this->ws->send(message, length, uWS::OpCode::BINARY);
}

/*__   __              ___  ___
 |__) |__) | \  /  /\   |  |__
 |    |  \ |  \/  /~~\  |  |___*/

void SessionInstance::send_server_string(const char * text, size_t length) {
    const char m[3] = {
        WS_TYPE_SERVER_MESSAGE,
        0,
        this->session_id
    };
}

void SessionInstance::finish_message_instance(const char message_type, const char message_id) {
    for (int m = 0; m < this->request_buffer.size(); m++) {
        if (this->request_buffer[m].get_message_id() == message_id && this->request_buffer[m].is_alive()) {
            this->request_buffer[m].finish();
            if (message_type == WS_TYPE_ESTABLISH_SESSION) {
                this->send_server_string("Session established!");
            }
        }
    }
}

void SessionInstance::send_binary(const char * message, size_t length) {
    //this->ws->send(message, length, uWS::OpCode::TEXT);
    this->ws->send(message, length, uWS::OpCode::BINARY);
}

MessageInstance * SessionInstance::get_message_instance(const unsigned char message_type) {
    // First check if any message instance is dead.
    if (this->request_buffer.size() > this->number_of_alive_requests) {
        for (int r = 0; r < this->request_buffer.size(); r++) {
            if (!this->request_buffer[r]->is_alive()) {
                this->request_buffer[r]->set(message_type);
                return this->request_buffer[r];
            }
        }
    }
    // No dead messages so return a new one.
    MessageInstance * message_instance = new MessageInstance((unsigned char) this->request_buffer.size());
    message_instance->set(message_type);
    this->request_buffer.push_back(message_instance);
    return message_instance;
}

void SessionInstance::free_messages() {
    if (this->request_buffer.size() > 0) {
        for (int r = 0; r < this->request_buffer.size(); r++) {
            delete this->request_buffer[r];
        }
        this->request_buffer.clear();
    }
}
