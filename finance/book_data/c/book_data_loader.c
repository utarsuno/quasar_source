#include "book_data.h"


#define SUCCESS                        0
#define ERROR                          -1

#define ARGUMENT_FILE_TO_LOAD          1

int main(int argc, char * argv[]) {
    /*     __   __              ___      ___  __      __        __   __          __
      /\  |__) / _` |  |  |\/| |__  |\ |  |  /__`    |__)  /\  |__) /__` | |\ | / _`
     /~~\ |  \ \__> \__/  |  | |___ | \|  |  .__/    |    /~~\ |  \ .__/ | | \| \__> */
    char * file_load_path = argv[ARGUMENT_FILE_TO_LOAD];

    printf("Opened the following file {%s}\n", file_load_path);

    BookData * book_data = get_book_data_from_file(file_load_path);

    free_book_data(book_data);

    return SUCCESS;
}

