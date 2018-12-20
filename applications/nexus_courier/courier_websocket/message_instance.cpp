#include "message_instance.h"

MessageInstance::MessageInstance(const unsigned short mID) {
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

unsigned short MessageInstance::get_type() {
    return this->type;
}

unsigned short MessageInstance::get_id() {
    return this->mID;
}

void MessageInstance::set(const unsigned short message_type) {
    this->alive    = true;
    this->resolved = false;
    this->type     = message_type;
}

void MessageInstance::finish() {
    this->alive    = false;
    this->resolved = true;
}

