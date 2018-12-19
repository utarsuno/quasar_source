#include "session_instance.h"

SessionInstance::SessionInstance(const unsigned short int id) {
    this->user_instance       = new UserInstance();
    this->id                  = id;
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

bool SessionInstance::is_alive() {
    return this->alive;
}

unsigned short int SessionInstance::get_id() {
    return this->id;
}

void SessionInstance::on_reply(const char * message, size_t length) {
    this->finish_message_instance(message[0], message[1]);
}

void SessionInstance::on_connection() {
    MessageInstance * request = this->get_message_instance(WS_TYPE_ESTABLISH_SESSION);
    //const unsigned char mid   = request->get_message_id();
    const char m[3]  = {
        request->get_type(),
        request->get_id(),
        this->id
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

void SessionInstance::kill() {
    this->alive               = false;
    this->session_established = false;
    this->user_instance->kill();
    this->free_messages();
}

void SessionInstance::send_reply(const char * message, size_t length) {
    this->finish_message_instance(message[0], message[1]);
}

void SessionInstance::send_message(const char * message, size_t length) {
    this->ws->send(message, length, uWS::OpCode::BINARY);
}

/*__   __              ___  ___
 |__) |__) | \  /  /\   |  |__
 |    |  \ |  \/  /~~\  |  |___*/

void SessionInstance::send_server_string(const char * text, size_t length) {
    /*
    const char h[4] = {
        WS_TYPE_SERVER_MESSAGE,
        0,
        this->id,
        0
    };
    */

    // Conversion from : http://forums.devshed.com/programming/490205-unsigned-short-int-char-array-post1934862.html


    /*char m[4 + length];
    m[0] = WS_TYPE_SERVER_MESSAGE;
    m[1] = 0;
    m[2] = this->id;
    m[3] = 0;*/
    char m[8 + length];
    unsigned short temp;
    m[0] = (unsigned char) WS_TYPE_SERVER_MESSAGE & 0x0ff; // Mask off upper bits.
    temp = WS_TYPE_SERVER_MESSAGE & 0xf0;                  // Mask off lower bits.
    m[1] = (unsigned char) (temp >> 8);                    // Shift the high bits into lower range.
    m[2] = (unsigned char) INVALID_ID & 0x0ff;
    temp = INVALID_ID & 0xff00;
    m[3] = (unsigned char) (temp >> 8);
    m[4] = (unsigned char) this->id & 0x0ff;
    temp = this->id & 0xff00;
    m[5] = (unsigned char) (temp >> 8);
    m[6] = (unsigned char) INVALID_ID & 0x0ff;
    temp = INVALID_ID & 0xff00;
    m[7] = (unsigned char) (temp >> 8);
    for (int i = 0; i < length; i++) {
        m[8 + i] = text[i];
    }
    size_t l = 8 + length;
    printf("Sending session established message!\n");
    this->send_binary(m, l);
}

void SessionInstance::finish_message_instance(const unsigned short int message_type, const unsigned short int message_id) {
    for (int m = 0; m < this->request_buffer.size(); m++) {
        if (this->request_buffer[m]->get_id() == message_id && this->request_buffer[m]->is_alive()) {
            this->request_buffer[m]->finish();
            if (message_type == WS_TYPE_ESTABLISH_SESSION) {
                this->send_server_string("Session established!", std::strlen("Session established!"));
            }
        }
    }
}

void SessionInstance::send_binary(const char * message, size_t length) {
    //printf("Sending binary message!\n");
    this->ws->send(message, length, uWS::OpCode::BINARY); //uWS::OpCode::TEXT
}

MessageInstance * SessionInstance::get_message_instance(const unsigned short int message_type) {
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
