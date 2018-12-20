#include "user_instance.h"

UserInstance::UserInstance() {
    this->kill();
}

void UserInstance::kill() {
    this->user_id   = INVALID_ID;
    this->username  = "";
    this->logged_in = false;
}

std::string UserInstance::get_username() {
    return this->username;
}

unsigned short UserInstance::get_id() {
    return this->user_id;
}

bool UserInstance::is_logged_in() {
    return this->logged_in;
}

void UserInstance::set_to_logged_in(const unsigned short user_id, std::string username) {
    this->username  = username;
    this->logged_in = true;
    this->user_id   = user_id;
}
