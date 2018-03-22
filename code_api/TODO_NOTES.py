


# Utilize design concepts from code_api and z_archive version of the code_api

# START ABSTRACT, make sure all features added comply for needs of C, Python, and Javascript with minimal language-specific logic.




# FEATURES THAT NEED TO BE ADDED
# get_all_string_literals


# VERY IMPORTANT FEATURE TO BE ADDED : UniversalConstants


# VERY IMPORTANT FEATURE :
'''
from jsmin import jsmin
jsmin(text)

RELATING TO THIS :
deal with marks such as '// FOR_DEV_START'
ALSO : Ensure they are all consistent, example : not a mix of FOR_DEV_START and DEV_START

^ after those features added : BUILD JAVASCRIPT PRODUCTION FILE!



# IMPORTANT BUT NOT TIME CRITICAL TASK :
# Make as many for loops reverse iteration based as possible! Only 1 .length operation required!!!


# Look into gziping the production file?


# START USING LESS GLOBAL VARIABLES!!!!!

'''



# For fun feature : count total lines of code across the various projects. Make sure to seperate between generated and non-generated.


# Feature to add after refactoring :
'''
from universal_code import string_utilities as su
sort_lines_by_delimiter
'''



# Minor features to add :
'''
	def get_total_size(self) -> int:
		"""Returns the total size of all the code files as bytes."""

	def get_total_lines_of_code(self) -> int:
		"""Returns the total number of lines of codes."""

	@property
	def number_of_files(self) -> int:
		"""Returns the number of files this manager has."""

'''
