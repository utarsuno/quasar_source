#!/bin/bash

path_source="/home/git_repos/quasar_source/finance/book_data/c/"
path_output="/home/databoi/finance/"

book_data="book_data"
data_loader="data_loader"
data_saver="data_saver"

path_source_book_data_h=${path_source}"abstract/"${book_data}".h"
path_output_book_data_h=${path_output}${book_data}".h"

path_source_book_data=${path_source}"abstract/"${book_data}".c"
path_output_book_data=${path_output}${book_data}".c"
path_output_book_data_object_file=${path_output}${book_data}".o"

path_source_loader=${path_source}${data_loader}".c"
path_output_loader=${path_output}${data_loader}".c"
path_output_loader_executable=${path_output}${data_loader}

path_source_saver=${path_source}${data_saver}".c"
path_output_saver=${path_output}${data_saver}".c"
path_output_saver=${path_output}${data_saver}

#  __   __   __               ___  ___  __   ___  __      __      ___         ___  __
# /  ` /  \ |__) \ /    |\ | |__  |__  |  \ |__  |  \    /  `    |__  | |    |__  /__`
# \__, \__/ |     |     | \| |___ |___ |__/ |___ |__/    \__,    |    | |___ |___ .__/
cp ${path_source_book_data_h} ${path_output_book_data_h}
cp ${path_source_book_data} ${path_output_book_data}
cp ${path_source_loader} ${path_output_loader}
cp ${path_source_saver} ${path_output_saver}

#  __   __         __          ___     __   __        ___  __  ___     ___         ___  __
# /  ` /  \  |\/| |__) | |    |__     /  \ |__)    | |__  /  `  |     |__  | |    |__  /__`
# \__, \__/  |  | |    | |___ |___    \__/ |__) \__/ |___ \__,  |     |    | |___ |___ .__/
gcc -c ${path_output_book_data} -o ${path_output_book_data_object_file}

#  __   __   ___      ___  ___     ___      ___  __       ___       __        ___  __
# /  ` |__) |__   /\   |  |__     |__  \_/ |__  /  ` |  |  |   /\  |__) |    |__  /__`
# \__, |  \ |___ /~~\  |  |___    |___ / \ |___ \__, \__/  |  /~~\ |__) |___ |___ .__/
gcc -Wall -O2 ${path_output_loader} ${path_output_book_data_object_file} -o ${path_output_saver}
gcc -Wall -O2 ${path_output_loader} ${path_output_book_data_object_file} -o ${path_output_loader_executable}

