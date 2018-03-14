#!/bin/bash

gcc -O2 /home/git_repos/quasar_source/finance/book_data/book_data_saver.c -o data_saver
gcc -O2 /home/git_repos/quasar_source/finance/book_data/book_data_loader.c -o data_loader