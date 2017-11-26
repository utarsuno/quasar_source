# coding=utf-8

"""This module, quasar_builder.py, is used for producing the DEV, QA, and PROD versions of Quasar."""

from quasar_source_code.universal_code import useful_file_operations as ufo

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


def _get_all_javascript_files(get_minified_files=False):
	"""Returns a list of CodeFile objects of all the Quasar javascript files (with a flag to determine if minified files returned or non-minified files returned."""
	all_javascript_files_path = CODE_SOURCE_BASE + 'quasar_source_code/quasar_site_django/static/js/custom'
	all_javascript_files = ufo.get_all_file_paths_inside_directory(all_javascript_files_path)
	files_to_ignore = ['helvetiker_regular.typeface.json.js']
	files_to_return = []
	if get_minified_files:
		for f in all_javascript_files:
			file_name = ufo.get_file_basename(f)
			if file_name not in files_to_ignore and '.min.js' in file_name:
				files_to_return.append(cf.CodeFileJavaScript(f))
	else:
		for f in all_javascript_files:
			file_name = ufo.get_file_basename(f)
			if file_name not in files_to_ignore and '.min.js' not in file_name:
				files_to_return.append(cf.CodeFileJavaScript(f))
	return files_to_return


def _get_all_python_files():
	"""Returns a list of CodeFile objects of all the Quasar Python files."""
	all_python_files_path = CODE_SOURCE_BASE
	files_to_ignore = ['__init__.py',
	                   'settings.py',
	                   'wsgi.py',
	                   'manage.py',
	                   'finance_classes.py',
	                   'finance_database.py',
	                   'robinhood_data.py']
	all_python_files = ufo.get_all_file_paths_inside_directory(all_python_files_path)
	files_to_return = []
	for f in all_python_files:
		file_name = ufo.get_file_basename(f)
		if file_name.endswith('.py'):
			if file_name not in files_to_ignore:
				files_to_return.append(cf.CodeFilePython(f))
	return files_to_return


class QuasarCode(object):
	"""An abstraction to the entire Quasar code base."""

	def __init__(self):
		self._javascript_files = cf.CodeFileManager(_get_all_javascript_files())

	def run_analysis(self):
		"""Prints an analysis report on the Quasar Source code base."""
		color_print('Printing Quasar Analysis!', color='red', bold=True)

	def build_production(self):
		"""Builds the production version of Quasar."""
		color_print('Building Quasar Production!', color='red', bold=True)


# Check if this file is being ran as a script.
if __name__ == '__main__':
	#color_print('Building Quasar Production', color='red', bold=True)

	quasar_code = QuasarCode()

	arguments = sys.argv[1:]
	for a in arguments:
		if a == ARGUMENT_BUILD_PRODUCTION:
			quasar_code.build_production()
		elif a == ARGUMENT_RUN_ANALYSIS:
			quasar_code.run_analysis()



# TODO :
	#print('Total size before : ' + str(total_original_size))
	#print('New size : ' + str(total_reduced_size))
	#print('Size reduction % : ' + str(1.0 - (total_reduced_size / total_original_size)))
