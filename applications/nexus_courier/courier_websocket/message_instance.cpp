#include "message_instance.h"

/*__   __   __
 /  \ /  \ |__)
 \__/ \__/ |   */
MessageInstance::MessageInstance(const unsigned short mID, SessionInstance * session_instance) {
    printf("Inside constructor of Message Instance!\n");
    this->alive            = false;
    this->resolved         = false;
    this->mID              = mID;
    this->session_instance = session_instance;
    this->buffer           = NULL;
    this->data_length      = 0;
    this->buffer_length    = 0;
}

MessageInstance::~MessageInstance() {
    if (this->buffer != NULL) {
        free(this->buffer);
    }
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

/*__        __          __
 |__) |  | |__) |    | /  `
 |    \__/ |__) |___ | \__, */
void MessageInstance::set(const unsigned short message_type) {
    this->alive         = true;
    this->resolved      = false;
    this->type          = message_type;
    this->data_length   = 0;
}

void MessageInstance::add_text(const char * text, size_t length) {
    if (this->buffer == NULL) {
        this->buffer        = (char *) malloc (sizeof(char) * ((length * 2) + 32));
        this->buffer_length = (length * 2) + 32;
    } else if (this->data_length + length >= this->buffer_length - 32) {
        char * more_space = (char *) realloc(this->buffer, this->buffer_length + length * 2);
        if (more_space == NULL) {
            fprintf(stderr, "REALLOC FAILED!\n");
        } else {
            memcpy(more_space, this->buffer, this->buffer_length);
            this->buffer_length += length * 2;
            free(this->buffer);
            this->buffer = more_space;
        }
    }
    this->add_to_buffer(text, length);
}

void MessageInstance::finish() {
    this->alive       = false;
    this->resolved    = true;
    this->data_length = 0;
}

void MessageInstance::send_without_response_needed() {
    this->send(WS_ID_INVALID);
    this->finish();
}

void MessageInstance::send() {
    this->send(this->mID);
}

void MessageInstance::send(unsigned short message_id) {
    printf("Inside send message!\n");

    unsigned short temp;
    unsigned short session_id = this->session_instance->get_id();
    unsigned short user_id    = this->session_instance->get_user_id();

    int message_length = 8 + this->data_length;

    printf("Before creating buffer\n");
    printf("Data length is {%d}\n", this->data_length);
    char buffer[message_length];
    printf("After creating buffer\n");

    // Conversion from : http://forums.devshed.com/programming/490205-unsigned-short-int-char-array-post1934862.html

    // Set message type.
    buffer[0] = (unsigned char) this->type & 0x0ff; // Mask off upper bits.
    temp      = this->type & 0xff00;                // Mask off lower bits.
    buffer[1] = (unsigned char) (temp >> 8);        // Shift the high bits into lower range.

    // Set message ID.
    buffer[2] = (unsigned char) message_id & 0x0ff;
    temp      = message_id & 0xff00;
    buffer[3] = (unsigned char) (temp >> 8);

    // Set session ID.
    buffer[4] = (unsigned char) session_id & 0x0ff;
    temp      = session_id & 0xff00;
    buffer[5] = (unsigned char) (temp >> 8);

    // Set user ID.
    buffer[6] = (unsigned char) user_id & 0x0ff;
    temp      = user_id & 0xff00;
    buffer[7] = (unsigned char) (temp >> 8);

    printf("Data length is {%d}\n", (int) this->data_length);

    // TODO: Eventually do a much faster memcpy version of this. Starting off simple to ensure things work as intended.
    if (this->data_length > 0) {
        for (int b = 0; b < this->data_length; b++) {
            buffer[b + 8] = this->buffer[b];
        }
    }

    this->session_instance->forward_message(buffer, message_length);

    /*
    (mid>>24) & 0xFF,
        (mid>>16) & 0xFF,
        (mid>>8) & 0xFF,
        mid & 0xFF
    */
}

/*__   __              ___  ___
 |__) |__) | \  /  /\   |  |__
 |    |  \ |  \/  /~~\  |  |___*/
void MessageInstance::add_to_buffer(const char * buffer, size_t length) {
    for (int b = 0; b < length; b++) {
        this->buffer[b + this->data_length] = buffer[b];
    }
    this->data_length += length;
}

