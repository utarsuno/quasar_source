#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define TRUE 0
#define FALSE 1

#define SUCCESS 0
#define ERROR   -1

float          bytes_to_float(const unsigned char b0, const unsigned char b1, const unsigned char b2, const unsigned char b3);
int            bytes_to_int(const unsigned char b0, const unsigned char b1, const unsigned char b2, const unsigned char b3);
unsigned short bytes_to_unsigned_short(const unsigned char b0, const unsigned char b1);

typedef struct book_data {
    unsigned short last_price;
    float price_variation;
    float volume;
    int number_of_buy_orders;
    int number_of_sell_orders;
    unsigned short * buy_prices;
    unsigned short * sell_prices;
    float * buy_amounts;
    float * sell_amounts;
} BookData;

BookData * get_book_data_from_file(const char * file_path);
void output_out_all_contents_of_book_data(BookData * book_data);
void free_book_data(BookData * book_data);

