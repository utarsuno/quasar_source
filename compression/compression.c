#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include "binary_compressor.h"
#include "file_operations.h"

#define FILE_PATH    "./output_files_to_ignore/words.txt"
#define OUTPUT_PATH  "./output_files_to_ignore/o.txt"
#define OUTPUT_PATH2 "./output_files_to_ignore/o.txt"
#define COMPRESSED_DATA_PATH "./output_files_to_ignore/COMPRESSED_DATA.txt"

int main(void) {
    clock_t start = clock();

    const unsigned long file_length = get_file_size(FILE_PATH);

    unsigned char buffer[file_length];
    read_file_contents(FILE_PATH, file_length, buffer);


    // Stores the compressed data output.
    BinarySequenceManager * manager = get_new_binary_sequence_manager(file_length);



    traverse_binary_sequence(buffer, file_length, manager);
    binary_sequence_manager_save_output(manager, COMPRESSED_DATA_PATH);

    //save_file_contents(OUTPUT_PATH2, file_length, buffer);


    // TODO : Free all of the managers internal data.
    free(manager);

    clock_t end = clock();
    printf("Time taken %f seconds.\n", ((double) (end - start)) / CLOCKS_PER_SEC);

    return 1;
}