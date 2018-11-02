# coding=utf-8

"""This module, pre_process_shaders.py, provides an abstraction for JS shader strings to pre-process."""


def parse_in_shaders(lines_to_parse, assets):
	"""Returns the lines with certain constants parsed out."""

	final_pass = []

	for l in lines_to_parse:
		if '#pre-process_get_shader' in l:
			s = l[l.index('#pre-process_get_shader'):].rstrip()
			shader_name = s.replace('#pre-process_get_shader_', '')
			shader_file = assets.get_file_by_full_name(shader_name)

			shader_text = '\'' + shader_file.get_shader_as_javascript_string()[1:-2].replace('\'', '\\\'') + '\';'

			final_pass.append(l.replace('\'\';', shader_text))
		else:
			final_pass.append(l)

	return final_pass

