#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define SUCCESS                        0
#define ERROR                          -1

#define ARGUMENT_FILE_TO_LOAD          1


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


int main(int argc, char * argv[]) {
    /*     __   __              ___      ___  __      __        __   __          __
      /\  |__) / _` |  |  |\/| |__  |\ |  |  /__`    |__)  /\  |__) /__` | |\ | / _`
     /~~\ |  \ \__> \__/  |  | |___ | \|  |  .__/    |    /~~\ |  \ .__/ | | \| \__> */
    char * file_load_path = argv[ARGUMENT_FILE_TO_LOAD];

    /*___         ___            __       ___   /  __       ___  __       ___
     |__  | |    |__     | |\ | |__) |  |  |   /  /  \ |  |  |  |__) |  |  |
     |    | |___ |___    | | \| |    \__/  |  /   \__/ \__/  |  |    \__/  |  */
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


    unsigned short last_price = bytes_to_unsigned_short(* (file_buffer + 1), * (file_buffer + 0));
    float price_variation = bytes_to_float(* (file_buffer + 5), * (file_buffer + 4), * (file_buffer + 3), * (file_buffer + 2));
    float volume = bytes_to_float(* (file_buffer + 9), * (file_buffer + 8), * (file_buffer + 7), * (file_buffer + 6));
    int number_of_buy_orders = bytes_to_int(* (file_buffer + 13), * (file_buffer + 12), * (file_buffer + 11), * (file_buffer + 10));
    int number_of_sell_orders = bytes_to_int(* (file_buffer + 17), * (file_buffer + 16), * (file_buffer + 15), * (file_buffer + 14));

    int file_buffer_index = 18;
    int index;

    float * buy_prices            = (float *) malloc(sizeof(float) * number_of_buy_orders);
    unsigned short * buy_amounts  = (unsigned short *) malloc(sizeof(unsigned short) * number_of_buy_orders);
    float * sell_prices           = (float *) malloc(sizeof(float) * number_of_sell_orders);
    unsigned short * sell_amounts = (unsigned short *) malloc(sizeof(unsigned short) * number_of_sell_orders);

    // TESTING.
    printf("The last price was {%hu}\n", last_price);
    printf("The price variation was {%f}\n", price_variation);
    printf("The volume {%f}\n", volume);
    printf("The number of buy orders {%d}\n", number_of_buy_orders);
    printf("The number of sell orders {%d}\n", number_of_sell_orders);

    // FURTHER TESTING.

    // Buy prices.
    printf("Printing buy prices!\n");
    for (index = 0; index < number_of_buy_orders; index++) {
        * (buy_prices + index) = bytes_to_unsigned_short(* (file_buffer + file_buffer_index + 1), * (file_buffer + file_buffer_index));
        file_buffer_index += 2;
        printf("%hu\n", * (buy_prices + index));
    }

    // Buy amounts.
    printf("Printing buy amounts!\n");
    for (index = 0; index < number_of_buy_orders; index++) {
        * (buy_prices + index) = bytes_to_float(* (file_buffer + file_buffer_index + 3), * (file_buffer + file_buffer_index + 2), * (file_buffer + file_buffer_index + 1), * (file_buffer + file_buffer_index));
        file_buffer_index += 4;
        printf("%f\n", * (buy_amounts + index));
    }

    // Sell prices.
    printf("Printing buy prices!\n");
    for (index = 0; index < number_of_sell_orders; index++) {
        * (buy_prices + index) = bytes_to_unsigned_short(* (file_buffer + file_buffer_index + 1), * (file_buffer + file_buffer_index));
        file_buffer_index += 2;
        printf("%hu\n", * (buy_prices + index));
    }

    // Sell amounts.
    printf("Printing buy amounts!\n");
    for (index = 0; index < number_of_sell_orders; index++) {
        * (buy_prices + index) = bytes_to_float(* (file_buffer + file_buffer_index + 3), * (file_buffer + file_buffer_index + 2), * (file_buffer + file_buffer_index + 1), * (file_buffer + file_buffer_index));
        file_buffer_index += 4;
        printf("%f\n", * (buy_amounts + index));
    }


    /*___  __   ___  ___           ___        __   __
     |__  |__) |__  |__      |\/| |__   |\/| /  \ |__) \ /
     |    |  \ |___ |___     |  | |___  |  | \__/ |  \  |  */
    free(buy_prices);
    free(buy_amounts);
    free(sell_prices);
    free(sell_amounts);

    return SUCCESS;
}

