# coding=utf-8

"""This module, useful_file_operations.py, will contain useful functions to run."""

# Used for IDE typing.
from typing import List
# Needed for running bash commands.
from asset_importer_docker.universal_code import bash_runner
# Needed for running regular expressions.
import re
# Needed for calculating the md5_checksum of files.
import hashlib
# Used for operation system level operations.
# Used to recursively go through a directory.
import glob
# Used for recursively getting files from a directory.
from glob2 import iglob
# Used for OS operations.
import os
# To convert values to human readable formats.
import humanize
# Used to download HTTP file.
import urllib.request
# Used for copying files.
import shutil
# Used for catching error conditions.
import errno
# Used for file comparisons.
import filecmp
# Used for recursively making directories and getting file extensions.
import pathlib
# Used for logging.
#from asset_importer_docker.micro_server.etl_micro_server import log

'''  ___         ___     __   __   ___  __       ___    __        __
	|__  | |    |__     /  \ |__) |__  |__)  /\   |  | /  \ |\ | /__`
	|    | |___ |___    \__/ |    |___ |  \ /~~\  |  | \__/ | \| .__/
'''


def get_file_extensions(file_path) -> List[str]:
	"""Gets the extensions of this file."""
	return pathlib.Path(file_path).suffixes


def get_md5_checksum(filename, block_size= 2 ** 20):
	"""Returns MD% checksum for given file."""
	# Function source originally from : https://gist.github.com/juusimaa/5846242.
	md5 = hashlib.md5()
	try:
		file = open(filename, 'rb')
		while True:
			data = file.read(block_size)
			if not data:
				break
			md5.update(data)
	except IOError:
		print('File \'' + filename + '\' not found!')
		return None
	except:
		return None
	return md5.hexdigest()


def get_file_basename(path: str) -> str:
	"""Extracts the basename of the provided path."""
	# Thanks to stackoverflow for showing how to get_file_basename : https://stackoverflow.com/questions/8384737/extract-file-name-from-path-no-matter-what-the-os-path-format
	basename = re.search(r'[^\\/]+(?=[\\/]?$)', path)
	if basename:
		return basename.group(0)
	return ''


def get_file_as_binary_data(file_path):
	"""Returns the the provided file as binary data.
	:param file_path : The full path to the file to get binary data from.
	:return: The raw binary of the provided file."""
	return open(file_path, 'rb')


def get_file_size(file_path) -> str:
	"""Return the size of the file.
	:param file_path : The full path to the file.
	:return: The size of the file as a string."""
	return str(int(int(os.stat(file_path).st_size) / 1024))


def download_file_from_url_to_path(url, save_path):
	"""This will download a file from the provided URL into the provided save path.
	:param url : The URL to download the file from.
	:param save_path : The location to place the file.
	:return: Void."""
	make_any_missing_directories(save_path)
	urllib.request.urlretrieve(url, save_path)


def delete_file(file_path):
	"""Removes the file at the file path provided.
	:param file_path : The file path of the file to delete."""
	os.remove(file_path)


def copy_file(file_path, save_path):
	"""Copies a file from the provided file path to the save path.
	:param file_path : The file to copy.
	:param save_path : The location to save the file to."""
	make_any_missing_directories(save_path)
	shutil.copy2(file_path, save_path)


def does_file_exist(file_path):
	"""Checks if the file exists at the provided file path.
	:param file_path : The provided file path to check for a file for.
	:return : Boolean indicating if a file exists at the provided file path or not."""
	if os.path.exists(file_path):
		return os.path.isfile(file_path)
	return False


def is_file(file_path):
	"""Checks if the path provided is a file.
	:param file_path : The provided directory path to check for a file.
	:return: Boolean indicating if a file exists at the provided path."""
	return os.path.isfile(file_path)


def create_text_file(file_path, content):
	file = open(file_path, 'w')
	for line in content.split('\n'):
		file.write(line + '\n')
	file.close()

'''  __   __           ___         ___     ___            __  ___    __        __
	/  ` /__` \  /    |__  | |    |__     |__  |  | |\ | /  `  |  | /  \ |\ | /__`
	\__, .__/  \/     |    | |___ |___    |    \__/ | \| \__,  |  | \__/ | \| .__/
'''


def create_csv_file(file_path, content):
	"""Creates the CSV file."""
	lines = []
	if type(content) == str:
		lines = content.split('\n')
	content = lines
	with open(file_path, 'w+') as file_handler:
		for l in content:
			file_handler.write(l + '\n')

'''  __     __   ___  __  ___  __   __          ___            __  ___    __        __
	|  \ | |__) |__  /  `  |  /  \ |__) \ /    |__  |  | |\ | /  `  |  | /  \ |\ | /__`
	|__/ | |  \ |___ \__,  |  \__/ |  \  |     |    \__/ | \| \__,  |  | \__/ | \| .__/
'''


def get_easy_to_read_size_of_directory(directory):
	"""Returns the size of the directory converted to the most logical unit.
	:return: A string representation of the size of the provided directory."""
	return str(humanize.naturalsize(sum(os.path.getsize(x) for x in iglob(directory + '/**'))))


def get_raw_size_as_bytes_of_directory(directory):
	"""Returns the "RAWWWWWWWW"-(Gordan Ramsey) size of the directory.
	:return: A string representation of the size of the provided directory."""
	return str(sum(os.path.getsize(x) for x in iglob(directory + '/**')))


def copy_directory(directory_path, save_path):
	"""Copies a directory to the designated save path.
	:param directory_path : The directory path to copy.
	:param save_path      : The save path to place the directory at."""
	shutil.copytree(directory_path, save_path)


def make_any_missing_directories(path):
	"""Make any directories that do not exist for the provided file path.
	:param path : The path to ensure that all needed parent directories exist."""
	if '.' in path:
		ending = path.replace(os.path.dirname(path), '')
		if '.' in ending:
			pathlib.Path(os.path.dirname(path)).mkdir(parents=True, exist_ok=True)
	else:
		pathlib.Path(path).mkdir(parents=True, exist_ok=True)


def does_directory_exist(directory_path):
	"""Checks if a directory exists at the provided directory path.
	:param directory_path : The path to check for a directory.
	:return : Boolean indicating if a directory exists at the provided path."""
	if os.path.exists(directory_path):
		return os.path.isdir(directory_path)
	return False


def is_directory(directory_path):
	"""Checks if the path provided is a directory.
	:param directory_path : The provided directory path to check for a directory.
	:return : Boolean indicating if a directory exists at the provided directory path."""
	return os.path.isdir(directory_path)


def delete_directory(directory_path):
	"""Deletes the provided directory.
	:param directory_path : The directory path to delete."""
	shutil.rmtree(directory_path)


def get_all_file_paths_from_directory(directory_path):
	"""Returns all the files paths from the directory path provided.
	:param directory_path : The directory path to get all file paths from.
	:return: A list of strings that each map to a full file path for all files in this directory."""
	file_paths = []
	for full_path in glob.glob(directory_path + '/**', recursive=True):
		# Ignore directories, only look at files.
		if not is_directory(full_path):
			file_paths.append(full_path)
	return file_paths


def get_all_file_names_from_directory(directory_path):
	"""Returns a list of all file names found in this directory."""
	all_full_file_names = get_all_file_paths_from_directory(directory_path)
	return_names        = []
	for fn in all_full_file_names:
		return_names.append(get_file_basename(fn))
	return return_names


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


''' __    __      ___         ___     ___            __  ___    __        __
	 / | |__)    |__  | |    |__     |__  |  | |\ | /  `  |  | /  \ |\ | /__`
	/_ | |       |    | |___ |___    |    \__/ | \| \__,  |  | \__/ | \| .__/
'''


# TODO : This method currently works with APP but DOES NOT support Electrical fully.
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
