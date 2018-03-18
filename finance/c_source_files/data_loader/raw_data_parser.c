#include "/home/git_repos/quasar_source/finance/c_source_files/abstract/book_constants.h"
#include "/home/git_repos/quasar_source/finance/c_source_files/abstract/book_data.h"

#define ARGUMENT_FILE_TO_PARSE 1

int main(int argc, char * argv[]) {
    // Load the file data into the struct.
    BookData * book_data = get_book_data_from_file(argv[ARGUMENT_FILE_TO_PARSE]);

    // Output all the data to stdout.
    output_out_all_contents_of_book_data(book_data);

    // Free memory used and exit the program.
    free_book_data(book_data);
    return SUCCESS;
}

