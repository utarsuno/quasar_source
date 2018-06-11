#include <stdio.h>
#include <stdlib.h>

extern void handle_error(const char * error_message);
extern const long get_file_size(const char * file_path);
extern void read_file_contents(const char * file_path, const unsigned long file_length, void * buffer);
extern void save_file_contents(const char * output_path, const unsigned long buffer_size, unsigned char * buffer);

#define READ_BINARY  "rb"
#define WRITE_BINARY "wb"
