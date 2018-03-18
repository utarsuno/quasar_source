#!/bin/bash

path_source="/home/git_repos/quasar_source/finance/book_data/c/"
path_output="/home/databoi/finance/"

path_source_book_data_h="abstract/book_data.h"
path_output_book_data_h="book_data.h"

path_source_book_data="abstract/book_data.c"
path_output_book_data="book_data.o"

path_source_data_saver="book_data_saver.c"
path_source_data_loader="book_data_loader.c"
path_output_data_saver="data_saver"
path_output_data_loader="data_loader"

# Copy the needed .h file over.
cp ${path_source}${path_source_book_data_h} ${path_output}${path_output_book_data_h}
# Compile the object files.
gcc -c ${path_source}${path_source_book_data} -o ${path_output}${path_output_book_data}



gcc -O2 ${path_source}${path_source_data_saver} ${path_output}${path_output_book_data} -o ${path_output}${path_output_data_saver}


gcc -O2 ${path_output}${path_output_book_data} ${path_source}${path_source_data_loader} -o ${path_output}${path_output_data_loader}
