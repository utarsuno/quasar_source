#ifndef USER_INSTANCE
#define USER_INSTANCE

#include "nexus_courier.h"

class UserInstance {
    public:
        UserInstance();
        void               kill();
        bool               is_logged_in();
        unsigned short int get_id();
        std::string        get_username();
    private:
        unsigned short int user_id;
        bool               logged_in;
        std::string        username;
};

#endif
