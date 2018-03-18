#include "book_data.h"

// Base code from : https://stackoverflow.com/questions/3991478/building-a-32bit-float-out-of-its-4-composite-bytes-c
float bytes_to_float(unsigned char b0, unsigned char b1, unsigned char b2, unsigned char b3) {
    float output;
    * ((unsigned char *)(& output) + 3) = b0;
    * ((unsigned char *)(& output) + 2) = b1;
    * ((unsigned char *)(& output) + 1) = b2;
    * ((unsigned char *)(& output) + 0) = b3;
    return output;
}

int bytes_to_int(unsigned char b0, unsigned char b1, unsigned char b2, unsigned char b3) {
    int output;
    * ((unsigned char *)(& output) + 3) = b0;
    * ((unsigned char *)(& output) + 2) = b1;
    * ((unsigned char *)(& output) + 1) = b2;
    * ((unsigned char *)(& output) + 0) = b3;
    return output;
}

unsigned short bytes_to_unsigned_short(unsigned char b0, unsigned char b1) {
    unsigned short output;
    * ((unsigned char *)(& output) + 1) = b0;
    * ((unsigned char *)(& output) + 0) = b1;
    return output;
}

BookData * get_book_data_from_file(char * file_load_path) {
    FILE * file_pointer = fopen(file_load_path, "rb");
    // Base code from : https://stackoverflow.com/questions/22059189/read-a-file-as-byte-array
    char * file_buffer;
    long file_length;

    // Jump to the end of the file/
    fseek(file_pointer, 0, SEEK_END);
    // Get the current byte offset in the file.
    file_length = ftell(file_pointer);
    // Jump back to the beginning of the file.
    rewind(file_pointer);

    // Enough memory for file + \0.
    file_buffer = (char *) malloc((file_length + 1) * sizeof(char));
    // Read in the entire file
    fread(file_buffer, file_length, 1, file_pointer);
    // Close the file.
    fclose(file_pointer);

    BookData * book_data = malloc (sizeof (BookData));
    if (book_data == NULL) {
        return NULL;
    }

    book_data->last_price = bytes_to_unsigned_short(* (file_buffer + 1), * (file_buffer + 0));
    book_data->price_variation = bytes_to_float(* (file_buffer + 5), * (file_buffer + 4), * (file_buffer + 3), * (file_buffer + 2));
    book_data->volume = bytes_to_float(* (file_buffer + 9), * (file_buffer + 8), * (file_buffer + 7), * (file_buffer + 6));

    book_data->number_of_buy_orders = bytes_to_int(* (file_buffer + 13), * (file_buffer + 12), * (file_buffer + 11), * (file_buffer + 10));
    book_data->number_of_sell_orders = bytes_to_int(* (file_buffer + 17), * (file_buffer + 16), * (file_buffer + 15), * (file_buffer + 14));

    book_data->buy_prices = (unsigned short *) malloc(sizeof(unsigned short) * (book_data->number_of_buy_orders));
    book_data->buy_amounts = (float *) malloc(sizeof(float) * (book_data->number_of_buy_orders));
    book_data->sell_prices = (unsigned short *) malloc(sizeof(unsigned short) * (book_data->number_of_sell_orders));
    book_data->sell_amounts = (float *) malloc(sizeof(float) * (book_data->number_of_sell_orders));

    int file_buffer_index = 18;
    int index;

    unsigned short * buy_prices = (unsigned short *) malloc(sizeof(unsigned short) * (book_data->number_of_buy_orders));
    float * buy_amounts  = (float *) malloc(sizeof(float) * (book_data->number_of_buy_orders));
    unsigned short * sell_prices = (unsigned short *) malloc(sizeof(unsigned short) * (book_data->number_of_sell_orders));
    float * sell_amounts = (float *) malloc(sizeof(float) * (book_data->number_of_sell_orders));

    // Buy prices.
    for (index = 0; index < book_data->number_of_buy_orders; index++) {
        * (book_data->buy_prices + index) = bytes_to_unsigned_short(* (file_buffer + file_buffer_index + 1), * (file_buffer + file_buffer_index));
        file_buffer_index += 2;
    }

    // Buy amounts.
    for (index = 0; index < book_data->number_of_buy_orders; index++) {
        * (book_data->buy_amounts + index) = bytes_to_float(* (file_buffer + file_buffer_index + 3), * (file_buffer + file_buffer_index + 2), * (file_buffer + file_buffer_index + 1), * (file_buffer + file_buffer_index));
        file_buffer_index += 4;
    }

    // Sell prices.
    for (index = 0; index < book_data->number_of_sell_orders; index++) {
        * (book_data->sell_prices + index) = bytes_to_unsigned_short(* (file_buffer + file_buffer_index + 1), * (file_buffer + file_buffer_index));
        file_buffer_index += 2;
    }

    // Sell amounts.
    for (index = 0; index < book_data->number_of_sell_orders; index++) {
        * (book_data->sell_amounts + index) = bytes_to_float(* (file_buffer + file_buffer_index + 3), * (file_buffer + file_buffer_index + 2), * (file_buffer + file_buffer_index + 1), * (file_buffer + file_buffer_index));
        file_buffer_index += 4;
    }

    return book_data;
}

void free_book_data(BookData * book_data) {
    free(book_data->buy_prices);
    free(book_data->sell_prices);
    free(book_data->buy_amounts);
    free(book_data->sell_amounts);
    free(book_data);
}