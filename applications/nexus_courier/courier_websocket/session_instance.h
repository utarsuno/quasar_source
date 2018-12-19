#ifndef SESSION_INSTANCE
#define SESSION_INSTANCE

#include "nexus_courier.h"

class UserInstance;
class MessageInstance;

class SessionInstance {
    public:
        SessionInstance(unsigned short int id);
        ~SessionInstance();
        void               initialize(uWS::WebSocket<uWS::SERVER> * ws);
        void               kill();
        void               on_connection();
        bool               is_alive();
        void               send_reply(const char * message, size_t length);
        void               send_message(const char * message, size_t length);
        void               on_reply(const char * message, size_t length);
        unsigned short int get_id();
    private:
        bool                             alive;
        bool                             session_established;
        uWS::WebSocket<uWS::SERVER>    * ws;
        unsigned short int               id;
        UserInstance                   * user_instance;
        std::vector<MessageInstance *>   request_buffer;
        unsigned short int               number_of_alive_requests;
        void                             send_binary(const char * content, size_t length);
        void                             send_server_string(const char * text, size_t length);
        void                             finish_message_instance(const unsigned short int message_type, const unsigned short int message_id);
        void                             free_messages();
        MessageInstance                * get_message_instance(const unsigned short int message_type);
};

#endif
