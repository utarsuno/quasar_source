# coding=utf-8

"""This module, useful_file_operations, simply contains lots of functions for file + directory operations."""

# Needed for copying files.
from shutil import copyfile
# Needed for running regular expressions.
import re
# Needed for system level operations.
import os
# Has super useful file + directory operations.
from pathlib import Path
# Used for advanced IDE typing.
from typing import List
# Used for recursively traversing directories.
import glob
# Needed for calculating the md5_checksum of files.
import hashlib
# Needed for running shell commands.
from libraries.universal_code.system_abstraction.shell_command_runner import BashCommandRunner
# Needed for utility debugging calls. Such as termination on error with exception thrown.
from libraries.universal_code import debugging as dbg
# Used for copying files and other operations such as deleting directories.
import shutil
# Needed for compression.
from PIL import Image

# GLOBAL TODO (s):
# Add more safety checks on all functions.
# Create automated QA tests for all these functions!
# Automatically log in DB the results + time-taken for all QA tests!


'''      ___          ___         ___            __  ___    __        __
	|  |  |  | |    |  |  \ /    |__  |  | |\ | /  `  |  | /  \ |\ | /__`
	\__/  |  | |___ |  |   |     |    \__/ | \| \__,  |  | \__/ | \| .__/
'''


def _is_valid_path_parameter(path: str) -> bool:
	if path is not None and type(path) is str and path != '':
		return True
		#if os.path.exists(path):
		#	return True
	dbg.raise_exception('The provided path {' + str(path) + '} of type {' + str(type(path)) + '} is not valid!')
	return False


''' __      __   ___  __  ___  __   __      ___  __
   |  \ |  |__) |__  /  `  |  /  \ |__) |  |__  /__`
   |__/ |  |  \ |___ \__,  |  \__/ |  \ |  |___ .__/ ______________________________________________________________ '''

# ------------------------------------------------ O P E R A T I O N S ------------------------------------------------


def directory_op_create(path: str) -> None:
	"""Creates the directory at the provided path."""
	os.makedirs(path)


def directory_op_delete(path: str) -> None:
	"""Deletes the directory at the provided path."""
	shutil.rmtree(path)


def directory_op_copy(path_source: str, path_destination: str) -> None:
	"""Copies the specified directory to the provided path."""
	shutil.copytree(path_source, path_destination)


# --------------------------------------------------- S E T T E R S ---------------------------------------------------

# --------------------------------------------------- G E T T E R S ---------------------------------------------------


def directory_get_does_exist(path: str) -> bool:
	"""Returns a boolean indicating if the directory exists or not."""
	if os.path.exists(path):
		return os.path.isdir(path)
	return False


def directory_get_is_directory(path: str) -> bool:
	"""Determines if the path provided points to a directory or not."""
	if _is_valid_path_parameter(path):
		return os.path.isdir(path)
	return False


def directory_get_basename(path: str) -> str:
	"""Returns the last directory in a path."""
	p = path
	if p.endswith('/'):
		p = p[:-1]
	elif '.' in p:
		p = p[:p.rfind('/')]
	return p[p.rfind('/') + 1:]


def directory_get_all_internal_directory_paths(path: str, recursively=False) -> list:
	"""Returns all the directory paths from the directory path provided."""
	directory_paths = []
	for full_path in glob.glob(path + '/**', recursive=recursively):
		# Ignore files, only look at directories.
		if not file_get_is_file(full_path):
			directory_paths.append(full_path)
	if path in directory_paths:
		directory_paths.remove(path)
	return directory_paths


def directory_get_all_internal_file_paths(path: str, recursively=False) -> List[str]:
	"""Returns a list of all file paths found inside the provided directory."""
	if _is_valid_path_parameter(path):
		file_paths = []
		for full_path in glob.glob(path + '/**', recursive=recursively):
			if not directory_get_is_directory(full_path):
				file_paths.append(full_path)
		return file_paths
	return []


'''___          ___  __
  |__  |  |    |__  /__`
  |    |  |___ |___ .__/ __________________________________________________________________________________________ '''
# ------------------------------------------------ O P E R A T I O N S ------------------------------------------------


def file_op_delete(path: str) -> None:
	"""Deletes the file."""
	os.remove(path)


def file_op_copy(path_source: str, path_destination: str) -> None:
	"""Copies the source file to the destination."""
	copyfile(path_source, path_destination)


def file_op_create_gzip(path_source: str, path_destination=None) -> None:
	"""Creates a gzipped version of the file."""
	bash_command = BashCommandRunner(['gzip', '-f', '-k', '-9', path_source])
	bash_command.run()
	if path_destination is not None:
		os.rename(path_source + '.gz', path_destination)


def file_op_convert_png_to_compressed_jpg(path_source: str, path_destination=None) -> None:
	"""Generates a compressed JPG file from the provided PNG file."""
	jpg = path_source.replace('.png', '.jpg')

	Image.open(path_source).convert('RGB').save(jpg)
	Image.open(jpg).save(path_destination, quality=85, optimize=True, progressive=False)


def file_op_compress_image(path_source: str, path_destination=None) -> None:
	"""Compressed the provided JPG or PNG image."""
	is_png = '.png' in path_source
	image = Image.open(path_source)
	if is_png:
		image.save(path_destination, quality=85, optimize=True, compress_level=9)
	else:
		image.save(path_destination, quality=85, optimize=True, progressive=False)


def file_op_append_files_content(source_path: str, append_file_path: str) -> None:
	"""Appends the 'append_file_path' file's content to the 'source_path' file."""
	content = file_get_contents_as_string(append_file_path)
	with open(source_path, 'a') as f:
		f.write(content)


def file_op_replace_text(path: str, text_to_find, text_to_replace_with) -> None:
	"""Replaces 'text_to_find' instances with 'text_to_replace_with'."""
	with open(path) as f:
		s = f.read()

	with open(path, 'w') as f:
		s = s.replace(text_to_find, text_to_replace_with)
		f.write(s)


def file_op_create_or_override(path: str, file_text) -> None:
	"""Creates the file with the specified file text at the specified file path."""
	raw_text = file_text
	if type(file_text) == list:
		raw_text = ''
		for l in file_text:
			raw_text += l
	with open(path, 'w+') as file_handler:
		file_handler.write(raw_text)


def file_op_replace_line_from_text_match(path: str, text_to_match, line_to_replace_with) -> None:
	"""Replaces lines that contain the 'text_to_match' text and replaces those lines with the 'line_to_replace_with'."""
	file_lines = []
	with open(path) as f:
		for l in f:
			file_lines.append(l)

	for i, l in enumerate(file_lines):
		if text_to_match in l:
			file_lines[i] = line_to_replace_with
			if not file_lines[i].endswith('\n'):
				file_lines[i] += '\n'

	with open(path, 'w') as f:
		for l in file_lines:
			f.write(l)


# --------------------------------------------------- S E T T E R S ---------------------------------------------------

# --------------------------------------------------- G E T T E R S ---------------------------------------------------

def file_get_size_in_bytes(path: str) -> int:
	"""Return the size of the file in bytes."""
	return int(os.stat(path).st_size)


def file_get_is_file(path: str) -> bool:
	"""Determines if the path provided points to a file or not."""
	if _is_valid_path_parameter(path):
		return os.path.isfile(path)
	return False


def file_get_extensions(path: str) -> List[str]:
	"""Extracts all the file extensions from the provided path (if any exist, returns [] otherwise)."""
	if _is_valid_path_parameter(path):
		return Path(path).suffixes
	return []


def file_get_basename(path: str) -> str:
	"""Extracts the basename of the provided path."""
	# Thanks to stackoverflow for showing how to get_file_basename : https://stackoverflow.com/questions/8384737/extract-file-name-from-path-no-matter-what-the-os-path-format
	basename = re.search(r'[^\\/]+(?=[\\/]?$)', path)
	if basename:
		return basename.group(0)
	return ''


def file_get_contents_as_lines(path: str) -> list:
	"""Returns a list of strings containing the file content."""
	lines = []
	with open(path, 'r') as file_handler:
		for line in file_handler:
			lines.append(line)
	return lines


def file_get_contents_as_string(path: str) -> list:
	"""Returns a list of strings containing the file content."""
	lines = []
	with open(path, 'r') as file_handler:
		for line in file_handler:
			lines.append(line)
	text = ''
	for l in lines:
		text += l
	return text


def file_get_sha256_checksm(path, block_size=65536):
	"""Returns sha256 for a given file."""
	# From : https://gist.github.com/rji/b38c7238128edf53a181
	sha256 = hashlib.sha256()
	with open(path, 'rb') as f:
		for block in iter(lambda: f.read(block_size), b''):
			sha256.update(block)
	return sha256.hexdigest()


def file_get_md5_checksum(path, block_size= 2 ** 20):
	"""Returns MD% checksum for given file."""
	# Function source originally from : https://gist.github.com/juusimaa/5846242.
	md5 = hashlib.md5()
	try:
		file = open(path, 'rb')
		while True:
			data = file.read(block_size)
			if not data:
				break
			md5.update(data)
	except IOError:
		print('File \'' + path + '\' not found!')
		return None
	except:
		return None
	return md5.hexdigest()


################################################################################

# Temporary on hold.
'''

# "This module makes available standard errno system symbols. The value of each symbol is the corresponding integer value. The names and descriptions are borrowed from linux/include/errno.h, which should be pretty all-inclusive."
# List of error definitions : https://docs.python.org/3.1/library/errno.html
#import errno

# TODO : Create unit tests (but deleting unit tests will be required as well).
def create_file_if_it_does_not_exist(path: str, list_of_text) -> bool:
	"""Creates the file with the provided path and list of strings that makeup the file. Returns a boolean indicating if successful.
	:param path         : The full path of the file.
	:param list_of_text : A list of lines to compose the file of OR a string to be decomposed into a list of strings split by the '\n' character."""
	if not _is_valid_path_parameter(path):
		return False

	# TODO : Add error checking to make sure that list_of_text is either string or a list of strings. But the debugging module needs to be completed first.
	# if

	# Thanks to stackoverflow post : https://stackoverflow.com/questions/10978869/safely-create-a-file-if-and-only-if-it-does-not-exist-with-python
	flags = os.O_CREAT | os.O_EXCL | os.O_WRONLY
	try:
		file_handler = os.open(path, flags)
	except OSError as e:
		if e.errno == errno.EEXIST: # Failed as the file already exists.
			pass
		else: # Something unexpected went wrong so re-raise the exception.
			raise
	else: # No exception, so the file must have been created successfully.
		with os.fdopen(file_handler, 'w') as file_object:
			# Using 'os.fdopen' converts the handle to an object that acts like a regular Python file object, and the 'with' context manager means the file will be automatically closed when we're done with it.
			for line in list_of_text:
'''


# TODOS:!!!
'''
def get_file_last_extension(path: str) -> str:
	"""Extracts the last extension from the provided path (if it exists, returns '' otherwise)."""
	if _is_valid_path_parameter(path):
		return Path(path).suffix
	return ''


def download_file_from_url_to_path(url, save_path):
	"""This will download a file from the provided URL into the provided save path.
	:param url : The URL to download the file from.
	:param save_path : The location to place the file.
	:return: Void."""
	make_any_missing_directories(save_path)
	urllib.request.urlretrieve(url, save_path)



def get_file_as_binary_data(file_path):
	"""Returns the the provided file as binary data.
	:param file_path : The full path to the file to get binary data from.
	:return: The raw binary of the provided file."""
	return open(file_path, 'rb')



def does_file_exist(file_path):
	"""Checks if the file exists at the provided file path.
	:param file_path : The provided file path to check for a file for.
	:return : Boolean indicating if a file exists at the provided file path or not."""
	if os.path.exists(file_path):
		return os.path.isfile(file_path)
	return False


def create_text_file(file_path, content):
	file = open(file_path, 'w')
	for line in content.split('\n'):
		file.write(line + '\n')
	file.close()


def create_csv_file(file_path, content):
	"""Creates the CSV file."""
	lines = []
	if type(content) == str:
		lines = content.split('\n')
	content = lines
	with open(file_path, 'w+') as file_handler:
		for l in content:
			file_handler.write(l + '\n')



# DIRECTORY STUFF BELOW!


def get_all_directory_paths_from_directory(directory_path):
	"""Returns all the directory paths from the directory path provided.
	:param directory_path : The directory path to get all the directory paths from.
	:return : A list of strings that each map to a full directory path for all directories in this directory."""
	directory_paths = []
	for full_path in glob.glob(directory_path + '/**', recursive=True):
		# Ignore files, only look at directories.
		if not is_file(full_path):
			directory_paths.append(full_path)
	return directory_paths


def get_all_sub_directory_paths_from_directory(directory_path):
	"""Returns all the directory paths from the directory path provided.
	:param directory_path : The directory path to get all the directory paths from.
	:return : A list of strings that each map to a full directory path for all directories in this directory."""
	directory_paths = []
	for full_path in glob.glob(directory_path + '/**', recursive=False):
		# Ignore files, only look at directories.
		if not is_file(full_path):
			directory_paths.append(full_path)
	return directory_paths


# Inspiration/source for this function : https://stackoverflow.com/questions/4187564/recursive-dircmp-compare-two-directories-to-ensure-they-have-the-same-files-and
def are_two_directories_the_same(directory_path_0, directory_path_1):
	"""Compares two directories for equality. Will compare file contents.
	:param directory_path_0 : The first directory to compare against.
	:param directory_path_1 : The second directory to compare against.
	:return: Boolean indicating if the two directories are the same or not."""
	compared = filecmp.dircmp(directory_path_0, directory_path_1)
	if compared.left_only or compared.right_only or compared.diff_files or compared.funny_files:
		return False
	for subdir in compared.common_dirs:
		if not are_two_directories_the_same(os.path.join(directory_path_0, subdir), os.path.join(directory_path_1, subdir)):
			return False
	return True


def delete_all_files_in_directory(directory_path):
	"""Deletes all the files located in this directory. Including those in sub-directories."""
	all_files = get_all_file_paths_from_directory(directory_path)
	for f in all_files:
		delete_file(f)


def get_all_non_empty_directory_paths_from_directory(directory_path):
	"""Returns all the directory paths that contain at least one entity from the directory path provided.
	:param directory_path : The root directory path to get all directory paths from.
	:return: A list of strings that each map to a directory path (for a non-empty directory) for all directories in this directory."""
	directory_paths = []
	for full_path in glob.glob(directory_path + '/**', recursive=True):
		# Ignore files, only look at directories.
		if not is_file(full_path):
			# Ignore empty directories.
			if len(os.listdir(full_path)) > 0:
				directory_paths.append(full_path)
	return directory_paths


def make_any_missing_directories(path):
	"""Make any directories that do not exist for the provided file path.
	:param path : The path to ensure that all needed parent directories exist."""
	if '.' in path:
		ending = path.replace(os.path.dirname(path), '')
		if '.' in ending:
			pathlib.Path(os.path.dirname(path)).mkdir(parents=True, exist_ok=True)
	else:
		pathlib.Path(path).mkdir(parents=True, exist_ok=True)


def get_easy_to_read_size_of_directory(directory):
	"""Returns the size of the directory converted to the most logical unit.
	:return: A string representation of the size of the provided directory."""
	return str(humanize.naturalsize(sum(os.path.getsize(x) for x in iglob(directory + '/**'))))


def get_raw_size_as_bytes_of_directory(directory):
	"""Returns the "RAWWWWWWWW"-(Gordan Ramsey) size of the directory.
	:return: A string representation of the size of the provided directory."""
	return str(sum(os.path.getsize(x) for x in iglob(directory + '/**')))




# ZIP stuff

def get_all_file_names_in_zip_directory(zip_file_path) -> List[str]:
	"""Returns a list of all the file names inside of a zipped directory (without unzipping the directory)."""
	file_names = []
	output = bash_runner.run_bash_command_and_get_output(['unzip', '-l', zip_file_path])
	zip_file_name = get_file_basename(zip_file_path).replace('.zip', '')
	for l in output.split('\n'):
		if zip_file_name in l:
			sections = l.split()
			if len(sections) == 4:
				if sections[0] != '0' and 'Thumbs.db' not in sections[3]:
					file_names.append(sections[3].replace(zip_file_name + '/', ''))
	return file_names

'''

'''
def get_all_file_names_inside_directory(path: str) -> List[str]:
	"""Returns a list of all file names found inside the provided directory."""
	if _is_valid_path_parameter(path):
		file_names = []
		for full_path in glob.glob(path + '/**', recursive=True):
			if not is_directory(full_path):
				file_names.append(file_get_basename(full_path))
		return file_names
	return []
'''