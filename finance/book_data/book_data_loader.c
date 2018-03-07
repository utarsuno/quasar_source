#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define SUCCESS                        0
#define ERROR                          -1

#define ARGUMENT_FILE_TO_LOAD          1

int main(int argc, char * argv[]) {
    /*     __   __              ___      ___  __      __        __   __          __
      /\  |__) / _` |  |  |\/| |__  |\ |  |  /__`    |__)  /\  |__) /__` | |\ | / _`
     /~~\ |  \ \__> \__/  |  | |___ | \|  |  .__/    |    /~~\ |  \ .__/ | | \| \__> */
    char * file_load_path     = argv[ARGUMENT_FILE_TO_LOAD];

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


    unsigned short last_price = 0;
    unsigned short last_price2 = 0;
    float price_variation = 0;
    float price_variation2 = 0;
    float volume = 0;
    int number_of_buy_orders = 0;
    int number_of_sell_orders = 0;

    // Read in the last price.
    last_price = (* (file_buffer + 0) << 8 + * (file_buffer + 1));
    last_price = (* (file_buffer + 1) << 8 + * (file_buffer + 0));

    // Read in the price variation.
    price_variation = (* (file_buffer + 5) << 24 + * (file_buffer + 4) << 16 + * (file_buffer + 3) << 8 + * (file_buffer + 2));

    // Read in the price variation.
    price_variation2 = (* (file_buffer + 2) << 24 + * (file_buffer + 3) << 16 + * (file_buffer + 4) << 8 + * (file_buffer + 5));

    // TESTING.
    printf("The last price was {%hu}\n", last_price);
    printf("The last price was {%hu}\n", last_price2);
    printf("The last price variation was {%f}\n", price_variation);
    printf("The last price variation was {%f}\n", price_variation2);

    return SUCCESS;
}