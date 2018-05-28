#!/usr/bin/env bash

if gcc -Wall -O3 ./compression.c ./utility_math_functions.c ./file_operations.c ./binary_sequence_manager.c ./binary_compressor.c -o ./output_files_to_ignore/compression; then
    echo "";
    echo "";
    ./output_files_to_ignore/compression
else
    echo "Failure!";
fi
