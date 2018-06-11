# coding=utf-8

"""This module, string_utilities.py, contains a list of useful string related operations."""


def get_list_of_words_from_string(string) -> list:
	"""Returns a list of strings that represent each sub-string separated by whitespaces in the original string."""
	words = []

	t = string.replace('\t', ' ').replace('\n', '')

	currently_in_a_word = False
	current_word = ''
	for c in t:
		if ' ' == c:
			if currently_in_a_word:
				if len(current_word) > 0:
					words.append(current_word)
					current_word = ''
				currently_in_a_word = False
		else:
			currently_in_a_word = True
			current_word += c

	return words


def sort_by_deliminator(deliminator, code_text, lines_to_ignore=None):
	"""This method will take a chunk of code and format it so that it is sorted by column alignment as well.
	:param deliminator: The character that will be used as the center piece.
	:param code_text: The chunk of code to format.
	:param lines_to_ignore: Any lines that should not be formatted or considered for the formatting standards.
	:return: The code text returned back formatted, as a String.
	"""
	if code_text is '':
		return ''
	code_text_as_lines = code_text.split('\n')
	temp_list = []
	if lines_to_ignore is not None:
		current_line = 0
		while current_line < len(code_text_as_lines):
			if current_line not in lines_to_ignore:
				temp_list.append(code_text_as_lines[current_line])
			current_line += 1
		code_text_as_lines = temp_list
	if code_text_as_lines[len(code_text_as_lines) - 1] == '':
		code_text_as_lines = code_text_as_lines[0:len(code_text_as_lines) - 1]
	longest_deliminator_position = -1
	for line in code_text_as_lines:
		if line.find(deliminator) > longest_deliminator_position:
			longest_deliminator_position = line.find(deliminator)
	text = ''
	for line in code_text_as_lines:
		first_half = line[0:line.find(deliminator)]
		if line.find(deliminator) < longest_deliminator_position:
			counter = 0
			while counter < longest_deliminator_position - line.find(deliminator):
				first_half += ' '
				counter += 1
		second_half = line[line.find(deliminator):len(line)]
		text += first_half + second_half + '\n'
	if lines_to_ignore is not None:
		current_line = 0
		current_line_index_from_formatted_text = 0
		final_text = ''
		split_text = text.split('\n')
		if split_text[len(split_text) - 1] == '':
			split_text = split_text[0:len(split_text) - 1]
		while current_line < len(split_text) + len(lines_to_ignore):
			if current_line not in lines_to_ignore:
				final_text += text.split('\n')[current_line_index_from_formatted_text] + '\n'
				current_line_index_from_formatted_text += 1
			else:
				final_text += code_text.split('\n')[current_line] + '\n'
			current_line += 1
		text = final_text
	return text


def sort_by_two_deliminators(d0, d1, tts):
	"""Just a utility function that calls the single deliminator method twice.
	:param d0: first_deliminator_string {sorted for this first}
	:param d1: second_deliminator_string {sorted for this second}
	:param tts: The text to base the new transformed text off of.
	:return: A string representing the text passed in to have two deliminators applied to them.
	"""
	local_text = tts
	local_text = sort_by_deliminator(d0, local_text)
	return sort_by_deliminator(d1, local_text)