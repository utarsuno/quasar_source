# coding=utf-8

"""This module, pre_process_environment.py, provides an abstraction for JS environment sections to pre-process."""

from libraries.universal_code import debugging as dbg


FOR_DEV_START  = 'FOR_DEV_START'
FOR_DEV_END    = 'FOR_DEV_END'
FOR_QA_START   = 'FOR_QA_START'
FOR_QA_END     = 'FOR_QA_END'
FOR_PROD_START = 'FOR_PROD_START'
FOR_PROD_END   = 'FOR_PROD_END'

# TODO: Actually support different environments, not just 'production'.


def get_parsed_javascript_content(file_lines):
	"""Parses the javascript file text so its ready to be combined into the single Quasar javascript file."""
	# Parse out 'use strict' as each file has one. This will get added once at the end.
	if 'use strict' in file_lines[0]:
		file_lines = file_lines[1:]

	# Go through the content and remove the 'FOR_DEV' sections.
	clean_lines = []

	currently_in_dev_section = False
	for l in range(len(file_lines)):
		line = file_lines[l]

		if FOR_DEV_START in line:
			if currently_in_dev_section:
				dbg.raise_exception('FOR_DEV_START inside of a FOR_DEV_START!')
			currently_in_dev_section = True
		elif FOR_DEV_END in line:
			if not currently_in_dev_section:
				dbg.raise_exception('FOR_DEV_END without starting FOR_DEV_START')
			currently_in_dev_section = False
		else:
			if not currently_in_dev_section:
				clean_lines.append(line)

	# Go through the content and remove the 'FOR_QA' sections.
	cleaner_lines = []
	currently_in_qa_section = False
	for l in range(len(clean_lines)):
		line = clean_lines[l]

		if FOR_QA_START in line:
			if currently_in_qa_section:
				dbg.raise_exception('FOR_QA_START inside of a FOR_QA_START!')
			currently_in_qa_section = True
		elif FOR_QA_END in line:
			if not currently_in_qa_section:
				dbg.raise_exception('FOR_QA_END without starting FOR_QA_START')
			currently_in_qa_section = False
		else:
			if not currently_in_qa_section:
				cleaner_lines.append(line)

	return cleaner_lines
