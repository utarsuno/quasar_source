#ifndef MESSAGE_INSTANCE
#define MESSAGE_INSTANCE

#include "nexus_courier.h"

class MessageInstance {
    public:
        MessageInstance(const unsigned char mID);
        bool           is_alive();
        bool           is_resolved();
        unsigned char  get_message_type();
        unsigned char  get_message_id();
        void           set(const unsigned char message_type);
        void           finish();
    private:
        bool          alive;
        bool          resolved;
        unsigned char mID;
        unsigned char type;
};

#endif
