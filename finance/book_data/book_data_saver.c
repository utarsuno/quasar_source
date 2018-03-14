#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define SUCCESS                        0
#define ERROR                          -1

#define ARGUMENT_FILE_SAVE_PATH        1
#define ARGUMENT_NUMBER_OF_BUY_ORDERS  2
#define ARGUMENT_NUMBER_OF_SELL_ORDERS 3
#define ARGUMENT_LAST_PRICE            4
#define ARGUMENT_PRICE_VARIATION       5
#define ARGUMENT_VOLUME                6

int main(int argc, char * argv[]) {
    /*     __   __              ___      ___  __      __        __   __          __
      /\  |__) / _` |  |  |\/| |__  |\ |  |  /__`    |__)  /\  |__) /__` | |\ | / _`
     /~~\ |  \ \__> \__/  |  | |___ | \|  |  .__/    |    /~~\ |  \ .__/ | | \| \__> */
    char * file_save_path     = argv[ARGUMENT_FILE_SAVE_PATH];
    int number_of_buy_orders  = atoi(argv[ARGUMENT_NUMBER_OF_BUY_ORDERS]);
    int number_of_sell_orders = atoi(argv[ARGUMENT_NUMBER_OF_SELL_ORDERS]);
    unsigned short last_price = (unsigned short) atoi(argv[ARGUMENT_LAST_PRICE]);
    float price_variation     = atof(argv[ARGUMENT_PRICE_VARIATION]);
    float volume              = atof(argv[ARGUMENT_VOLUME]);

    /*__  ___  __             __       ___               __        __          __
     /__`  |  |  \ | |\ |    |  \  /\   |   /\     |    /  \  /\  |  \ | |\ | / _`
     .__/  |  |__/ | | \|    |__/ /~~\  |  /~~\    |___ \__/ /~~\ |__/ | | \| \__> */
    int index;
    float current_amount;
    unsigned short current_price;

    unsigned short * buy_prices  = (unsigned short *) malloc(sizeof(unsigned short) * number_of_buy_orders);
    float * buy_amounts          = (float *) malloc(sizeof(float) * number_of_buy_orders);
    unsigned short * sell_prices = (unsigned short *) malloc(sizeof(unsigned short) * number_of_sell_orders);
    float * sell_amounts         = (float *) malloc(sizeof(float) * number_of_sell_orders);

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
    FILE * file_pointer = fopen(file_save_path, "wb+");

    // First 2 bytes, last price.
    fwrite(& last_price, sizeof(last_price), 1, file_pointer);

    // Next 8 bytes, price variation.
    fwrite(& price_variation, sizeof(price_variation), 1, file_pointer);

    // Next 8 bytes, volume.
    fwrite(& volume, sizeof(volume), 1, file_pointer);

    // Next 4 bytes, number of buy orders.
    fwrite(& number_of_buy_orders, sizeof(number_of_buy_orders), 1, file_pointer);

    // Next 4 bytes, number of sell orders.
    fwrite(& number_of_sell_orders, sizeof(number_of_sell_orders), 1, file_pointer);

    // Next n0 bytes, buy prices.
    fwrite(buy_prices, sizeof(unsigned short), number_of_buy_orders, file_pointer);

    // Next n1 bytes, buy amounts.
    fwrite(buy_amounts, sizeof(float), number_of_buy_orders, file_pointer);

    // Next n2 bytes, sell prices.
    fwrite(sell_prices, sizeof(unsigned short), number_of_sell_orders, file_pointer);

    // Next n3 bytes, sell amounts.
    fwrite(sell_amounts, sizeof(float), number_of_sell_orders, file_pointer);

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