#ifndef MESSAGE_INSTANCE
#define MESSAGE_INSTANCE

#include "nexus_courier.h"

class MessageInstance {
    public:
        MessageInstance(const unsigned short int mID);
        bool               is_alive();
        bool               is_resolved();
        unsigned short int get_type();
        unsigned short int get_id();
        void               set(const unsigned short int message_type);
        void               finish();
    private:
        bool               alive;
        bool               resolved;
        unsigned short int mID;
        unsigned short int type;
};

#endif
