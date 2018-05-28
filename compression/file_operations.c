#include "file_operations.h"

inline void handle_error(const char * error_message) {
    printf("{%s}\n", error_message);
    fprintf(stderr, "{%s}\n", error_message);
    exit(2);
}

inline const long get_file_size(const char * file_path) {
    FILE * f = fopen(file_path, READ_BINARY);
    if (f == NULL) {
        handle_error("Error opening file");
    }
    fseek(f, 0, SEEK_END);
    long file_length = ftell(f);
    fclose(f);
    return file_length;
}

inline void read_file_contents(const char * file_path, const unsigned long file_length, void * buffer) {
    FILE * f = fopen(file_path, READ_BINARY);
    if (f == NULL) {
        handle_error("Error opening file");
    }
    int r = fread(buffer, file_length, 1, f);
    if (!r) {
        handle_error("Error reading file contents");
    }
    fclose(f);
}

inline void save_file_contents(const char * output_path, const unsigned long buffer_size, unsigned char * buffer) {
    FILE * f = fopen(output_path, WRITE_BINARY);
    if (f == NULL) {
        handle_error("Error opening file");
    }
    int i = 0;
    while (i < buffer_size) {
        fputc(buffer[i], f);
        i += 1;
    }
    fclose(f);
}
