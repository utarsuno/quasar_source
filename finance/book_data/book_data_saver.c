#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define SUCCESS               0
#define ERROR                 -1

#define BOOK_TYPE_BUY_ORDERS  2
#define BOOK_TYPE_SELL_ORDERS 3

#define DIRECTORY_BUY_ORDERS  "/home/databoi/book_orders/"
#define DIRECTORY_SELL_ORDERS "/home/databoi/sell_orders/"

#define ARGUMENT_TIMESTAMP    1
#define ARGUMENT_BOOK_TYPE    2
#define ARGUMENT_NUM_ROWS     3

int main(int argc, char * argv[]) {
    // First argument is unix timestamp.
    char * timestamp = argv[ARGUMENT_TIMESTAMP];
    // Second argument is book type (buy or sell).
    int book_type = atoi(argv[ARGUMENT_BOOK_TYPE]);
    // Third argument is number of entries.
    int number_of_entries = atoi(argv[ARGUMENT_NUM_ROWS]);

    char file_name[1024];

    //printf("timestamp %s\n", timestamp);
    //printf("book_type %d\n", book_type);
    //printf("number_of_entries %d\n", number_of_entries);
    //return SUCCESS;

    FILE * file_pointer;
    if (book_type == BOOK_TYPE_BUY_ORDERS) {
        char * file_directory = DIRECTORY_BUY_ORDERS;
        strcpy(file_name, file_directory);
    } else {
        char * file_directory = DIRECTORY_SELL_ORDERS;
        strcpy(file_name, file_directory);
    }
    strcpy(file_name, timestamp);
    printf("Filename is {%s}", file_name);
    file_pointer = fopen(file_name, "ab+");

    int current_entry = 0;
    while (current_entry < number_of_entries) {
        // TODO : Add error checking.
        float num;
        scanf("%f", & num);
        // TODO : BATCH SAVING, DON'T SAVE ONE NUMBER AT A TIME
        fwrite(& num, 1, sizeof(num), file_pointer);
        current_entry += 1;
    }

    /*
    float num;
    if (scanf("%f", & num) != ERROR) {
        //fprintf(fp, "%f", num);
        fwrite(& num, 1, sizeof(num), fp);
    }
    */

    fclose(file_pointer);
    return SUCCESS;
}