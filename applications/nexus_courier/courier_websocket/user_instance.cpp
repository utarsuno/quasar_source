#include "user_instance.h"

UserInstance::UserInstance() {

}

void UserInstance::kill() {
    this->user_id  = 0;
    this->username = "";
}

std::string UserInstance::get_username() {
    return this->username;
}

unsigned char UserInstance::get_user_id() {
    return this->user_id;
}
