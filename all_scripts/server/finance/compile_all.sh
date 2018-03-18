#!/bin/bash

path_source="/home/git_repos/quasar_source/finance/book_data/c/"
path_output="/home/databoi/finance/"

path_source_book_data="abstract/book_data.c"
path_output_book_data="data_saver/book_data.o"

path_source_data_saver="data_saver.c"
path_source_data_loader="data_loader.c"
path_output_data_saver="data_saver"
path_output_data_loader="data_loader"

# Compile the object files.
gcc -c ${path_source}${path_source_book_data} -o ${path_output}${path_output_book_data}

gcc -O2 ${path_source}${path_source_data_saver} ${path_output}${path_source_data_saver} -o ${path_output}${path_output_data_saver}
gcc -O2 ${path_source}${path_source_data_loader} ${path_output}${path_source_data_loader} -o ${path_output}${path_output_data_loader}
