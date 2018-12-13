#ifndef USER_INSTANCE
#define USER_INSTANCE

#include "nexus_courier.h"

class UserInstance {
    public:
        UserInstance();
        unsigned char get_user_id();
        std::string   get_username();
        void          kill();
    private:
        unsigned char user_id;
        std::string   username;
};

#endif
