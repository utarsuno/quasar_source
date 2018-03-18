#include "book_data.h"

#define ARGUMENT_NUMBER_OF_FILES_TO_LOAD 1

int main(int argc, char * argv[]) {
    /*     __   __              ___      ___  __      __        __   __          __
      /\  |__) / _` |  |  |\/| |__  |\ |  |  /__`    |__)  /\  |__) /__` | |\ | / _`
     /~~\ |  \ \__> \__/  |  | |___ | \|  |  .__/    |    /~~\ |  \ .__/ | | \| \__> */
    int number_of_files_to_load = atoi(argv[ARGUMENT_NUMBER_OF_FILES_TO_LOAD]);

    BookData ** book_datas = (BookData **) malloc(sizeof(BookData *) * number_of_files_to_load);

    int current_file_index;
    for (current_file_index = 0; current_file_index < number_of_files_to_load; current_file_index++) {
        printf("Currently loading file {%s}\n", current_file_index);
        * (book_datas + current_file_index) = get_book_data_from_file(* argv[current_file_index + 2]);
    }

    // TODO : FREE ALL THE BOOK DATAS!!!
    //free_book_data(book_data);

    return SUCCESS;
}