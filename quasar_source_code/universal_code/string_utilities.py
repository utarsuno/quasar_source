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

