#ifndef SESSION_INSTANCE
#define SESSION_INSTANCE

#include "nexus_courier.h"

class UserInstance;
class MessageInstance;
class MemoryPoolObject;
class MemoryPool;

class SessionInstance : public MemoryPoolObject, MemoryPool {
    public:
        void * get_and_create_new_entity_object();
        void on_born();
        void on_killed();
        void on_completion();
        // OOP
        SessionInstance(unsigned short id);
        ~SessionInstance();
        void           set(uWS::WebSocket<uWS::SERVER> * ws);
        void           kill();
        void           on_connection();
        // Functionality
        void           send_server_string(const char * text, size_t length);
        void           send_server_string(std::string text);
        void           handle_response(char * message, size_t length);
        void           forward_message(const char * buffer, size_t length);
        void           send_with_confirmation(const unsigned char message_type, const char * buffer, size_t length);
        // Setters
        void           set_session_to_established();
        // Getters
        unsigned short get_id();
        unsigned short get_user_id();
    private:
        // Fields
        bool                          session_established;
        unsigned int                  number_of_invalid_requests_made;
        uWS::WebSocket<uWS::SERVER> * ws;
        unsigned short                id;
        UserInstance                * user_instance;
        // Functionality
        void                          finish_message_instance(const unsigned short message_id);
        MessageInstance             * get_message_instance(const unsigned short message_type);
};

#endif
