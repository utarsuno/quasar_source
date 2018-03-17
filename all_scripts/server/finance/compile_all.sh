#!/bin/bash

# Compile the object files.
gcc -c /home/git_repos/quasar_source/finance/book_data/c/abstract/book_data.c

gcc -O2 /home/git_repos/quasar_source/finance/book_data/c/book_data_saver.c -o /home/databoi/finance/data_saver
gcc -O2 /home/git_repos/quasar_source/finance/book_data/c/book_data_loader.c -o /home/databoi/finance/data_loader