#ifndef SESSION_INSTANCE
#define SESSION_INSTANCE

#include "nexus_courier.h"

class UserInstance;
class MessageInstance;

class SessionInstance {
    public:
        SessionInstance(unsigned char session_id);
        ~SessionInstance();
        void          initialize(uWS::WebSocket<uWS::SERVER> * ws);
        void          kill();
        void          on_connection();
        bool          is_alive();
        unsigned char get_session_id();
        void          send_reply(const char * message, size_t length);
        void          send_message(const char * message, size_t length);
    private:
        bool                             alive;
        bool                             session_established;
        uWS::WebSocket<uWS::SERVER>    * ws;
        unsigned char                    session_id;
        UserInstance                   * user_instance;
        std::vector<MessageInstance *>   request_buffer;
        unsigned char                    number_of_alive_requests;
        MessageInstance                * get_message_instance(const unsigned char message_type);
        void                             send_binary(const char * content, size_t length);
        void                             finish_message_instance(const char message_type, const char message_id);
        void                             free_messages();
};

#endif
