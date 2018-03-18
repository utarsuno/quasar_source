#include "/home/git_repos/quasar_source/finance/c_source_files/abstract/book_data.h"

#define ARGUMENT_FILE_TO_PARSE 1

int main(int argc, char * argv[]) {
    BookData * book_data = get_book_data_from_file(argv[ARGUMENT_FILE_TO_PARSE]);

    printf("TODO : Return data on {%s}\n", argv[ARGUMENT_FILE_TO_PARSE]);

    free_book_data(book_data);

    return SUCCESS;
}

