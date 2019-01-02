#include "session_instance.h"

/*            ___  __    ___  ___       __   ___
 | |\ | |__| |__  |__) |  |  |__  |\ | /  ` |__
 | | \| |  | |___ |  \ |  |  |___ | \| \__, |___*/
void * SessionInstance::get_and_create_new_entity_object() {
    MessageInstance * message_instance = new MessageInstance(this->get_pool_size(), this);
    return (void *) message_instance;
}

void SessionInstance::on_born() {
    this->session_established             = false;
    this->number_of_invalid_requests_made = 0;
}

void SessionInstance::on_killed() {
    this->user_instance->kill();
    this->pool_clear_all();
    this->on_born();
}

void SessionInstance::on_completion() {
}

/*__   __   __
 /  \ /  \ |__)
 \__/ \__/ |   */
SessionInstance::SessionInstance(const unsigned short id) : MemoryPoolObject(), MemoryPool() {
    this->user_instance = new UserInstance();
    this->id            = id;
    this->on_born();
}

SessionInstance::~SessionInstance() {
    delete this->user_instance;
}

void SessionInstance::set(uWS::WebSocket<uWS::SERVER> * ws) {
    this->ws = ws;
    this->ws->setUserData(this);
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
        this->finish_message_instance(message_id);
    } else {
        if (message_type == WS_TYPE_GLOBAL_CHAT) {

            char * message = & buffer[8];

            char mm[length + 1 - 8];
            for (int m = 0; m < length - 8; m++) {
                mm[m] = buffer[m + 8];
            }
            mm[length + 1 - 8] = EOF;

            //char * message = buffer;

            //std::string temp_str(message);
            std::string temp_str(mm);

            std::cout << "The message to send is {" << temp_str << "}\n";
            printf("The message length is  {%d}\n", std::strlen(temp_str.c_str()));

            /*
            size_t l = length - 8;
            if (l % 2 != 0) {
                l -= 1;
            }*/


            this->send_server_string("TODO: forward global chat!", std::strlen("TODO: forward global chat!"));

            //std::string global_chat_message = "[" + std::to_string(session_id) + "]: " + std::string(message);
            std::string global_chat_message = "[" + std::to_string(session_id) + "]: " + temp_str;

            //this->send_server_string(global_chat_message.c_str(), l);
            this->send_server_string(global_chat_message.c_str(), std::strlen(global_chat_message.c_str()));

            std::cout << "The message to send is {" << global_chat_message << "}\n";
            printf("The message length is  {%d}\n", std::strlen(global_chat_message.c_str()));

        }
    }

        //if (message_type == WS_TYPE_GLOBAL_CHAT) {
            // this->session_instance->broadcast_message(message, length, this->session_instance()->get_id());
        //}

    // TODO: Verify session ID matches!

    //this->rabbitmq->forward_message(message, length);
}

void SessionInstance::set_session_to_established() {
    this->session_established = true;
}

void SessionInstance::send_server_string(const char * text, size_t length) {
    MessageInstance * request = this->get_message_instance(WS_TYPE_SERVER_MESSAGE);
    request->add_text(text, length);
    request->send_without_response_needed();
}

void SessionInstance::send_server_string(std::string text) {
    this->send_server_string(text.c_str(), std::strlen(text.c_str()));
}

/*__   __              ___  ___
 |__) |__) | \  /  /\   |  |__
 |    |  \ |  \/  /~~\  |  |___*/
void SessionInstance::finish_message_instance(const unsigned short message_id) {
    int               pool_size        = this->get_pool_size();
    MessageInstance * message_instance = NULL;
    for (int m = 0; m < pool_size; m++) {

        message_instance = (MessageInstance *) this->pool[m];

        if (message_instance->get_id() == message_id && message_instance->is_alive()) {
            if (message_instance->get_id() != WS_ID_INVALID) {
                this->pool_complete_entity((void *) message_instance);
            } else {
                message_instance->complete();
            }
            break;
        }
        /*
        if (this->pool[m]->get_id() == message_id && this->pool[m]->is_alive()) {
            if (this->pool[m]->get_id() != WS_ID_INVALID) {
                this->pool_complete_entity((void *) this->pool[m]);
            } else {
                this->pool[m]->complete();
            }
            break;
        }*/
    }
}

MessageInstance * SessionInstance::get_message_instance(const unsigned short message_type) {
    MessageInstance * message_instance = (MessageInstance *) this->get_pool_entity();
    message_instance->set(message_type);
    return message_instance;
}
