#ifndef MESSAGE_INSTANCE
#define MESSAGE_INSTANCE

#include "nexus_courier.h"

class SessionInstance;

class MessageInstance {
    public:
        // OOP
        MessageInstance(const unsigned short mID, SessionInstance * session_instance);
        ~MessageInstance();
        // Functionality.
        void           set(const unsigned short message_type);
        void           add_text(const char * text, size_t length);
        void           finish();
        void           send();
        void           send_without_response_needed();
        void           send(unsigned short message_id);
        // Getters
        bool           is_alive();
        bool           is_resolved();
        unsigned short get_type();
        unsigned short get_id();
    private:
        bool              alive;
        bool              resolved;
        unsigned short    mID;
        unsigned short    type;
        char            * buffer;
        size_t            data_length;
        unsigned int      buffer_length;
        SessionInstance * session_instance;
        // Functions.
        void              add_to_buffer(const char * buffer, size_t length);
};

#endif
