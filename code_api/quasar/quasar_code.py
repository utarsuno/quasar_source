# coding=utf-8

"""This module, quasar_builder.py, is used for producing the DEV, QA, and PROD versions of Quasar."""

from quasar_source_code.universal_code import useful_file_operations as ufo

# Currently 3rd party used to handle minification.
from jsmin import jsmin
# Pretty printing!
from lazyme.string import color_print
# Used to get arguments passed into the program.
import sys
# Abstraction to code files.
from code_api import lines_of_code as loc
from code_api import code_file as cf


from quasar_source_code.universal_code import system_os as sos

if sos.is_linux():
	CODE_SOURCE_BASE = '/home/git_repos/quasar_source/'
elif sos.is_mac():
	CODE_SOURCE_BASE = '/Users/utarsuno/git_repos/quasar_source/'

# Program arguments.
ARGUMENT_BUILD_PRODUCTION = '-bp'
ARGUMENT_RUN_ANALYSIS     = '-ra'


def get_minifed_javascript_text(javascript_file_path):
	"""Gets the minified version of the Javascript file provided."""
	with open(javascript_file_path) as js_file:
		minified = jsmin(js_file.read())
	return minified


def _get_all_javascript_files():
	"""Returns a list of CodeFile objects of all the Quasar Javascript files."""
	all_javascript_files_path = CODE_SOURCE_BASE + 'quasar_source_code/quasar_site_django/static/js/custom'
	all_javascript_files = ufo.get_all_file_paths_inside_directory(all_javascript_files_path)
	files_to_ignore = ['helvetiker_regular.typeface.json.js']
	files_to_return = []
	for f in all_javascript_files:
		file_name = ufo.get_file_basename(f)
		if file_name not in files_to_ignore and '.min.js' not in file_name:
			files_to_return.append(cf.CodeFile(f))
	return files_to_return


def _get_all_python_files():
	"""Returns a list of CodeFile objects of all the Quasar Python files."""
	all_python_files_path = CODE_SOURCE_BASE
	files_to_ignore = ['__init__.py']



#
def produce_quasar_minified_javascript_files():
	"""Produces the *.min.js files."""
	all_javascript_files = _get_all_javascript_files()

	total_original_size = 0
	total_reduced_size  = 0

	for f in all_javascript_files:
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


def run_analysis():
	"""Prints analysis report on the Quasar Source code base."""
	all_javascript_files = _get_all_javascript_files()



# Check if this file is being ran as a script.
if __name__ == '__main__':
	color_print('Building Quasar Production', color='red', bold=True)

	arguments = sys.argv[1:]
	for a in arguments:
		if a == ARGUMENT_BUILD_PRODUCTION:
			produce_quasar_minified_javascript_files()
		elif a == ARGUMENT_RUN_ANALYSIS:
			run_analysis()
