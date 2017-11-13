# coding=utf-8

"""This module, quasar_builder.py, is used for producing the DEV, QA, and PROD versions of Quasar."""

# Currently 3rd party used to handle minification.
from jsmin import jsmin
# Needed to get program arguments passed in.
import sys
# Used for regex expressions.
import re
# OS level stuff.
import os
# UFO imports.
import glob
# Pretty printing!
from lazyme.string import color_print


# Useful File Operation functions copy-pasted here.
def _is_valid_path_parameter(path):
	if path is not None and type(path) is str and path != '':
		return True
	return False


def get_file_size_in_bytes(file_path) -> str:
	"""Return the size of the file.
	:param file_path : The full path to the file.
	:return: The size of the file as a string."""
	return int(int(os.stat(file_path).st_size))


def get_file_basename(path: str) -> str:
	"""Extracts the basename of the provided path."""
	# Thanks to stackoverflow for showing how to get_file_basename : https://stackoverflow.com/questions/8384737/extract-file-name-from-path-no-matter-what-the-os-path-format
	basename = re.search(r'[^\\/]+(?=[\\/]?$)', path)
	if basename:
		return basename.group(0)
	return ''


def create_file_or_override(file_text, file_path):
	file = open(file_path, 'w')
	file.write(file_text)
	file.close()


def is_directory(path: str) -> bool:
	"""Determines if the path provided points to a directory or not."""
	if _is_valid_path_parameter(path):
		return os.path.isdir(path)
	return False


def get_all_file_paths_inside_directory(path: str):
	"""Returns a list of all file paths found inside the provided directory."""
	if _is_valid_path_parameter(path):
		file_paths = []
		for full_path in glob.glob(path + '/**', recursive=True):
			if not is_directory(full_path):
				file_paths.append(full_path)
		return file_paths
	return []
#


def get_minifed_javascript_text(javascript_file_path):
    """Gets the minified version of the Javascript file provided."""
    with open(javascript_file_path) as js_file:
        minified = jsmin(js_file.read())
    return minified


#
def produce_quasar_minified_javascript_files():
    """Produces the *.min.js files."""
    all_javascript_files_path = '/Users/utarsuno/git_repos/quasar_source/quasar_source_code/quasar_site_django/static/js/custom'
    all_javascript_files = get_all_file_paths_inside_directory(all_javascript_files_path)
    files_to_ignore = ['helvetiker_regular.typeface.json.js']

    total_original_size = 0
    total_reduced_size  = 0

    for f in all_javascript_files:

        file_name = get_file_basename(f)

        if file_name not in files_to_ignore and '.min.js' not in file_name:

            original_file_size = get_file_size_in_bytes(f)
            minified_file_path = f.replace('.js', '.min.js')
            total_original_size += original_file_size

            #print('Currently parsing {' + str(file_name) + '} - size{' + str(original_file_size) + '}')

            m = get_minifed_javascript_text(f)
            create_file_or_override(m, minified_file_path)
            minified_file_size = get_file_size_in_bytes(minified_file_path)

            #print('Created {' + ufo.get_file_basename(minified_file_path) + '} - size{' + str(minified_file_size) + '}')
            total_reduced_size += minified_file_size

            #print()

    print('Total size before : ' + str(total_original_size))
    print('New size : ' + str(total_reduced_size))
    print('Size reduction % : ' + str(1.0 - (total_reduced_size / total_original_size)))


def produce_combined_javascript_production_file():
	"""Produces a single Javascript file for production."""
	all_javascript_files_path = '/Users/utarsuno/git_repos/quasar_source/quasar_source_code/quasar_site_django/static/js/custom'
	all_javascript_files = get_all_file_paths_inside_directory(all_javascript_files_path)
	files_to_ignore = ['helvetiker_regular.typeface.json.js']

	# TODO : This function at a later time.


# Check if this file is being ran as a script.
if __name__ == '__main__':
    color_print('Building Quasar Production', color='red', bold=True)

    #arguments = sys.argv[1:]
    #print('The arguments are : ' + str(arguments))

    produce_quasar_minified_javascript_files()

