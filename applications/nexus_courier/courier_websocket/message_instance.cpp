#include "message_instance.h"

MessageInstance::MessageInstance(const unsigned char mID) {
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

unsigned char MessageInstance::get_message_type() {
    return this->type;
}

unsigned char MessageInstance::get_message_id() {
    return this->mID;
}

void MessageInstance::set(const unsigned char message_type) {
    this->alive    = true;
    this->resolved = false;
    this->type     = message_type;
}

void MessageInstance::finish() {
    this->alive    = false;
    this->resolved = true;
}

