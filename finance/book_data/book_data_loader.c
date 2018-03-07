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
    rewind(fileptr);

    // Enough memory for file + \0.
    file_buffer = (char *) malloc((file_length + 1) * sizeof(char));
    // Read in the entire file
    fread(file_buffer, file_length, 1, file_pointer);
    // Close the file.
    fclose(fileptr);


    
    // Read in the last price.


    /*__  ___  __             __       ___               __        __          __
     /__`  |  |  \ | |\ |    |  \  /\   |   /\     |    /  \  /\  |  \ | |\ | / _`
     .__/  |  |__/ | | \|    |__/ /~~\  |  /~~\    |___ \__/ /~~\ |__/ | | \| \__> */
    int index;
    float current_amount;
    unsigned short current_price;

    float * buy_prices            = (float *) malloc(sizeof(float) * number_of_buy_orders);
    unsigned short * buy_amounts  = (unsigned short *) malloc(sizeof(unsigned short) * number_of_buy_orders);
    float * sell_prices           = (float *) malloc(sizeof(float) * number_of_sell_orders);
    unsigned short * sell_amounts = (unsigned short *) malloc(sizeof(unsigned short) * number_of_sell_orders);

    // Buy amounts.
    for (index = 0; index < number_of_buy_orders; index++) {
        scanf("%f", & current_amount);
        * (buy_amounts + index) = current_amount;
    }

    // Buy prices.
    for (index = 0; index < number_of_buy_orders; index++) {
        scanf("%hu", & current_price);
        * (buy_prices + index) = current_price;
    }

    // Sell amounts.
    for (index = 0; index < number_of_sell_orders; index++) {
        scanf("%f", & current_amount);
        * (sell_amounts + index) = current_amount;
    }

    // Sell prices.
    for (index = 0; index < number_of_sell_orders; index++) {
        scanf("%hu", & current_price);
        * (sell_prices + index) = current_price;
    }

    /*___         ___            __       ___   /  __       ___  __       ___
     |__  | |    |__     | |\ | |__) |  |  |   /  /  \ |  |  |  |__) |  |  |
     |    | |___ |___    | | \| |    \__/  |  /   \__/ \__/  |  |    \__/  |  */
    FILE * file_pointer = fopen(file_load_path, "rb");



    // First 4 bytes, last price.
    fwrite(& last_price, sizeof(last_price), 1, file_pointer);

    // Next 8 bytes, price variation.
    fwrite(& price_variation, sizeof(price_variation), 1, file_pointer);

    // Next 8 bytes, volume.
    fwrite(& volume, sizeof(volume), 1, file_pointer);

    // Next 4 bytes, number of buy orders.
    fwrite(& number_of_buy_orders, 1, sizeof(number_of_buy_orders), file_pointer);

    // Next 4 bytes, number of sell orders.
    fwrite(& number_of_sell_orders, 1, sizeof(number_of_sell_orders), file_pointer);

    // Next n0 bytes, buy prices.
    fwrite(buy_prices, sizeof(float), number_of_buy_orders, file_pointer);

    // Next n1 bytes, buy amounts.
    fwrite(buy_amounts, sizeof(unsigned short), number_of_buy_orders, file_pointer);

    // Next n2 bytes, sell prices.
    fwrite(sell_prices, sizeof(float), number_of_sell_orders, file_pointer);

    // Next n3 bytes, sell amounts.
    fwrite(sell_amounts, sizeof(unsigned short), number_of_sell_orders, file_pointer);

    /*___  __   ___  ___           ___        __   __      
     |__  |__) |__  |__      |\/| |__   |\/| /  \ |__) \ / 
     |    |  \ |___ |___     |  | |___  |  | \__/ |  \  |  */
    free(buy_prices);
    free(buy_amounts);
    free(sell_prices);
    free(sell_amounts);
    fclose(file_pointer);
    return SUCCESS;
}