#! /bin/sh

# This lets the Python files reference all the custom made Python files.
export PYTHONPATH="${PYTHONPATH}:/quasar_source"

output=$(python3 /quasar_source/python_source_code/quality_assurance/universal_code/useful_file_operations_tests.py)

echo "Output : $output"