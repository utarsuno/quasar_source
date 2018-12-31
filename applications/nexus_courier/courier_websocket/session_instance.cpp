#include "session_instance.h"

/*__   __   __
 /  \ /  \ |__)
 \__/ \__/ |   */
SessionInstance::SessionInstance(const unsigned short id) {
    this->user_instance                   = new UserInstance();
    this->id                              = id;
    this->session_established             = false;
    this->number_of_invalid_requests_made = 0;
}

SessionInstance::~SessionInstance() {
    delete this->user_instance;
    this->free_messages();
}

void SessionInstance::initialize(uWS::WebSocket<uWS::SERVER> * ws) {
    this->alive = true;
    this->ws    = ws;
    this->ws->setUserData(this);
}

void SessionInstance::kill() {
    this->alive                           = false;
    this->session_established             = false;
    this->number_of_invalid_requests_made = 0;
    this->user_instance->kill();
    this->free_messages();
}

bool SessionInstance::is_alive() {
    return this->alive;
}

unsigned short SessionInstance::get_user_id() {
    return this->user_instance->get_id();
}

unsigned short SessionInstance::get_id() {
    return this->id;
}
/*__        __          __
 |__) |  | |__) |    | /  `
 |    \__/ |__) |___ | \__,*/
void SessionInstance::on_connection() {
    MessageInstance * request = this->get_message_instance(WS_TYPE_ESTABLISH_SESSION);
    request->send();

    printf("Sent on connection message!\n");
    fflush(stdout);
}

void SessionInstance::send_reply(const char * message, size_t length) {
    this->finish_message_instance(message[0], message[1]);
}

void SessionInstance::forward_message(const char * buffer, size_t length) {
    this->ws->send(buffer, length, uWS::OpCode::BINARY);
}

void SessionInstance::handle_response(char * buffer, size_t length) {
    unsigned short message_type = (buffer[0]) | (buffer[1] << 8);
    unsigned short message_id   = (buffer[2]) | (buffer[3] << 8);
    unsigned short session_id   = (buffer[4]) | (buffer[5] << 8);
    unsigned short user_id      = (buffer[6]) | (buffer[7] << 8);

    printf("MT  {%d}\n", (int) message_type);
    printf("MID {%d}\n", (int) message_id);
    printf("SID {%d}\n", (int) session_id);
    printf("UID {%d}\n", (int) user_id);

    //if (message_id != WS_ID_INVALID) {
    //}

    if (message_type % 2 == 0) {
        printf("Sending reply!\n");
        this->finish_message_instance(message_type, message_id);
    } else {
        if (message_type == WS_TYPE_GLOBAL_CHAT) {

            char * message = & buffer[8];

            size_t l = length - 8;
            if (l % 2 != 0) {
                l -= 1;
            }

            //printf("The message {%s}\n", message);

            this->send_server_string("TODO: forward global chat!", std::strlen("TODO: forward global chat!"));
            std::string global_chat_message = "[" + std::to_string(session_id) + "]: " + std::string(message);
            this->send_server_string(global_chat_message.c_str(), l);
            //"Session established!", std::strlen("Session established!")
        }
    }

    //if (message_type % 2 != 0) {
    //    this->finish_message_instance(message_type, message_id);
    //} else {
        //if (message_type == WS_TYPE_GLOBAL_CHAT) {
            // this->session_instance->broadcast_message(message, length, this->session_instance()->get_id());
        //}

    //}

    // TODO: Verify session ID matches!

    /*
    if (message[0] & 1 == 0) {
        session->on_reply(message, length);
    } else {
        if (message[0] == WS_TYPE_GLOBAL_CHAT) {
            this->broadcast_message(message, length, session->get_id());
        }
        session->send_reply(message, length);
    }
    */

    //this->rabbitmq->forward_message(message, length);
}

/*__   __              ___  ___
 |__) |__) | \  /  /\   |  |__
 |    |  \ |  \/  /~~\  |  |___*/
void SessionInstance::send_server_string(const char * text, size_t length) {
    MessageInstance * request = this->get_message_instance(WS_TYPE_SERVER_MESSAGE);
    request->add_text(text, length);
    request->send_without_response_needed();
}

void SessionInstance::finish_message_instance(const unsigned short message_type, const unsigned short message_id) {
    for (int m = 0; m < this->request_buffer.size(); m++) {
        if (this->request_buffer[m]->get_id() == message_id && this->request_buffer[m]->is_alive()) {
            this->request_buffer[m]->finish();
            if (message_type == WS_TYPE_ESTABLISH_SESSION) {
                this->session_established = true;
                this->send_server_string("Session established!", std::strlen("Session established!"));
            }
            break;
        }
    }
}

void SessionInstance::send_binary(const char * message, size_t length) {
    //printf("Sending binary message!\n");
    this->ws->send(message, length, uWS::OpCode::BINARY); //uWS::OpCode::TEXT
}

MessageInstance * SessionInstance::get_message_instance(const unsigned short message_type) {
    // First check if any message instance is dead.
    if (this->request_buffer.size() > this->number_of_alive_requests) {
        for (int r = 0; r < this->request_buffer.size(); r++) {
            if (!this->request_buffer[r]->is_alive()) {
                this->request_buffer[r]->set(message_type);
                return this->request_buffer[r];
            }
        }
    }

    printf("Creating new message instance object!\n");

    // No dead messages so return a new one.
    MessageInstance * message_instance = new MessageInstance((unsigned short) this->request_buffer.size(), this);
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
