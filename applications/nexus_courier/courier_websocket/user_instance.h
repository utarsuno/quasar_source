#ifndef USER_INSTANCE
#define USER_INSTANCE

#include "nexus_courier.h"

class UserInstance {
    public:
        UserInstance();
        void           set_to_logged_in(const unsigned short user_id, std::string username);
        void           kill();
        bool           is_logged_in();
        unsigned short get_id();
        std::string    get_username();
    private:
        unsigned short user_id;
        bool           logged_in;
        std::string    username;
};

#endif
