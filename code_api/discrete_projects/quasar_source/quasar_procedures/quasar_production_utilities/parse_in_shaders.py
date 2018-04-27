# coding=utf-8

"""This module, constants_to_parse_out.py, is a utility program to store constants that need to get replaced in the minified file."""


def parse_in_shaders(lines_to_parse, assets):
	"""Returns the lines with certain constants parsed out."""

	final_pass = []

	for l in lines_to_parse:
		if '#pre-process_get_shader' in l:
			s = l[l.index('#pre-process_get_shader'):].rstrip()
			shader_name = s.replace('#pre-process_get_shader_', '')
			shader_file = assets.get_file_by_full_name(shader_name)
			final_pass.append(l.replace('\'\';', shader_file.get_shader_as_javascript_string()))
		else:
			final_pass.append(l)

	return final_pass
