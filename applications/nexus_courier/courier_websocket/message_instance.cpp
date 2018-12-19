#include "message_instance.h"

MessageInstance::MessageInstance(const unsigned short int mID) {
    this->alive    = false;
    this->resolved = false;
    this->mID      = mID;
}

bool MessageInstance::is_alive() {
    return this->alive;
}

bool MessageInstance::is_resolved() {
    return this->resolved;
}

unsigned short int MessageInstance::get_type() {
    return this->type;
}

unsigned short int MessageInstance::get_id() {
    return this->mID;
}

void MessageInstance::set(const unsigned short int message_type) {
    this->alive    = true;
    this->resolved = false;
    this->type     = message_type;
}

void MessageInstance::finish() {
    this->alive    = false;
    this->resolved = true;
}

