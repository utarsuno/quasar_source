#ifndef MESSAGE_INSTANCE
#define MESSAGE_INSTANCE

#include "nexus_courier.h"

class MessageInstance {
    public:
        MessageInstance(const unsigned short mID);
        bool           is_alive();
        bool           is_resolved();
        unsigned char  get_type();
        unsigned short get_id();
        void           set(const unsigned char message_type);
        void           finish();
    private:
        bool           alive;
        bool           resolved;
        unsigned short mID;
        unsigned char  type;
        char *         buffer;
        unsigned int   buffer_length;
};

#endif
