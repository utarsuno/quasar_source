#include "message_instance.h"

/*            ___  __    ___  ___       __   ___
 | |\ | |__| |__  |__) |  |  |__  |\ | /  ` |__
 | | \| |  | |___ |  \ |  |  |___ | \| \__, |___*/
void MessageInstance::on_born() {
    this->buffer_length = 0;
}

void MessageInstance::on_killed() {
    this->buffer_length = 0;
}

void MessageInstance::on_completion() {
    if (this->type == WS_TYPE_ESTABLISH_SESSION) {
        this->session_instance->set_session_to_established();
        this->session_instance->send_server_string("Session established!");
    }
}

/*__   __   __
 /  \ /  \ |__)
 \__/ \__/ |   */
MessageInstance::MessageInstance(const unsigned short mID, SessionInstance * session_instance) : MemoryPoolObject() {
    this->mID                 = mID;
    this->session_instance    = session_instance;
    this->buffer_length_total = MEMORY_DEFAULT_ALLOCATION_SIZE_MESSAGE_BUFFER;
    this->buffer              = (char *) malloc(sizeof(char) * this->buffer_length_total);
    this->buffer_length       = 0;
}

MessageInstance::~MessageInstance() {
    if (this->buffer != NULL) {
        free(this->buffer);
    }
}

/*__   ___ ___ ___  ___  __   __
 / _` |__   |   |  |__  |__) /__`
 \__> |___  |   |  |___ |  \ .__/*/
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
    this->type = message_type;
}

void MessageInstance::add_text(const char * text, size_t length) {
    this->add_to_buffer(text, length);
    /*
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
    */
}

void MessageInstance::send_without_response_needed() {
    this->send(WS_ID_INVALID);
    this->kill();
}

void MessageInstance::send() {
    this->send(this->mID);
}

void MessageInstance::send(unsigned short message_id) {
    unsigned short temp;
    unsigned short session_id = this->session_instance->get_id();
    unsigned short user_id    = this->session_instance->get_user_id();

    printf("Buffer length is {%d}\n", (int) this->buffer_length);
    unsigned int send_packet_length = NETWORK_MESSAGE_HEADER_SIZE + this->buffer_length;
    char buffer[send_packet_length];

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

    // TODO: Eventually do a much faster memcpy version of this. Starting off simple to ensure things work as intended.
    // TODO: FIX THIS?!
    if (this->buffer_length > 0) {
        for (int b = 0; b < this->buffer_length; b++) {
            buffer[b + NETWORK_MESSAGE_HEADER_SIZE] = this->buffer[b];
        }
    }

    this->session_instance->forward_message(buffer, send_packet_length);

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
    if (this->buffer_length + length > this->buffer_length_total) {
        int slots_to_add = (int) ((float) length / 32.0);
        slots_to_add += 2;

        char * new_memory_space = (char *) realloc(this->buffer, this->buffer_length_total + (slots_to_add * 32));

        if (new_memory_space == NULL) {
            fprintf(stderr, "Error for realloc!\n");
            exit(EXIT_CODE_REALLOC_FAILED);
        } else {
            this->buffer = new_memory_space;
        }
    }







    for (int b = 0; b < length; b++) {
        this->buffer[b + this->buffer_length] = buffer[b];
    }
    this->buffer_length += length;
}

