#ifndef MESSAGE_INSTANCE
#define MESSAGE_INSTANCE

#include "nexus_courier.h"

class MessageInstance {
    public:
        MessageInstance(const unsigned short mID);
        bool           is_alive();
        bool           is_resolved();
        unsigned short get_type();
        unsigned short get_id();
        void           set(const unsigned short message_type);
        void           finish();
    private:
        bool           alive;
        bool           resolved;
        unsigned short mID;
        unsigned short type;
        char *         buffer;
        unsigned int   buffer_length;
};

#endif
