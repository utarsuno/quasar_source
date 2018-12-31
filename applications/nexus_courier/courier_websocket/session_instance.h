#ifndef SESSION_INSTANCE
#define SESSION_INSTANCE

#include "nexus_courier.h"

class UserInstance;
class MessageInstance;

class SessionInstance {
    public:
        // OOP
        SessionInstance(unsigned short id);
        ~SessionInstance();
        void           initialize(uWS::WebSocket<uWS::SERVER> * ws);
        void           kill();
        void           on_connection();
        void           send_reply(const char * buffer, size_t length);
        // Functionality
        void           handle_response(char * message, size_t length);
        void           forward_message(const char * buffer, size_t length);
        void           send_with_confirmation(const unsigned char message_type, const char * buffer, size_t length);
        // Getters
        unsigned short get_id();
        unsigned short get_user_id();
        bool           is_alive();
    private:
        bool                             alive;
        bool                             session_established;
        unsigned int                     number_of_invalid_requests_made;
        uWS::WebSocket<uWS::SERVER>    * ws;
        unsigned short                   id;
        UserInstance                   * user_instance;
        std::vector<MessageInstance *>   request_buffer;
        unsigned short                   number_of_alive_requests;
        void                             send_binary(const char * content, size_t length);
        void                             send_server_string(const char * text, size_t length);
        void                             finish_message_instance(const unsigned short message_type, const unsigned short message_id);
        void                             free_messages();
        MessageInstance                * get_message_instance(const unsigned short message_type);
};

#endif
