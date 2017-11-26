#!/bin/bash

DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
source "$DIR/../../universal_scripts/universal_functions.sh"

path_to_quasar_builder="$DIR/../../../code_api/quasar/quasar_code.py"

# Helps see exactly where the script's output starts.
print_dashed_line_with_text "run_analysis.sh start"

export PYTHONPATH=${PYTHONPATH}:/Users/utarsuno/git_repos/quasar_source/

python3 ${path_to_quasar_builder} "-ra"


# Helps to see exactly where the script's output ends.
print_dashed_line_with_text "run_analysis.sh end"
