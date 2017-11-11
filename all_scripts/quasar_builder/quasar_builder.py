# coding=utf-8

"""This module, quasar_builder.py, is used for producing the DEV, QA, and PROD versions of Quasar."""

# Currently 3rd party used to handle minification.
from jsmin import jsmin
# Useful file + directory operations.
from quasar_source_code.universal_code import useful_file_operations as ufo


def get_minifed_javascript_text(javascript_file_path):
    """Gets the minified version of the Javascript file provided."""
    with open(javascript_file_path) as js_file:
        minified = jsmin(js_file.read())
    return minified


#
def produce_quasar_minified_javascript_files():
    """Produces the *.min.js files."""
    all_javascript_files_path = '/Users/utarsuno/git_repos/quasar_source/quasar_source_code/quasar_site_django/static/js/custom'
    all_javascript_files = ufo.get_all_file_paths_inside_directory(all_javascript_files_path)
    files_to_ignore = ['helvetiker_regular.typeface.json.js']

    print('Creating the minified Javascript files!\n')

    total_original_size = 0
    total_reduced_size  = 0

    for f in all_javascript_files:

        file_name = ufo.get_file_basename(f)

        if file_name not in files_to_ignore and '.min.js' not in file_name:

            original_file_size = ufo.get_file_size_in_bytes(f)
            minified_file_path = f.replace('.js', '.min.js')
            total_original_size += original_file_size

            #print('Currently parsing {' + str(file_name) + '} - size{' + str(original_file_size) + '}')

            m = get_minifed_javascript_text(f)
            ufo.create_file_or_override(m, minified_file_path)
            minified_file_size = ufo.get_file_size_in_bytes(minified_file_path)

            #print('Created {' + ufo.get_file_basename(minified_file_path) + '} - size{' + str(minified_file_size) + '}')
            total_reduced_size += minified_file_size

            #print()

    print('Total size before : ' + str(total_original_size))
    print('New size : ' + str(total_reduced_size))
    print('Size reduction % : ' + str(1.0 - (total_reduced_size / total_original_size)))


produce_quasar_minified_javascript_files()
