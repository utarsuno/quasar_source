# coding=utf-8

"""This module, html_file.py, provides an abstraction to html code files."""


#from code_api.code_abstraction.code_chunk import CodeChunk
import htmlmin

from libraries.code_api.source_file_abstraction.code_files.code_file import *
#from applications.code_manager.layer_applications.build_processes import css

DOMAIN_FLAG_CSS_FILES_THAT_UPDATED = 'CSS_files_that_have_been_updated'

_PRE_PROCESS_STYLE                 = '#pre-process-replace-style'


class LoadedHTMLFile(LoadedCodeFile):
	"""Represents a single html file."""

	def __init__(self, file_name, file_extensions=None):
		super().__init__(FILE_TYPE_HTML, file_name, file_extensions)

		self.pre_process_needed       = False
		self.files_from_domain_needed = []
		self._pre_process_mappings    = {_PRE_PROCESS_STYLE: None}
		self._pre_process_parsed      = False

	def parse_pre_processes(self, domain):
		"""Parses any pre-processes in this file."""
		if not self._pre_process_parsed:
			style_file_path = None
			content = self.content
			for l in content:
				if _PRE_PROCESS_STYLE in l:
					style_file_path = l[l.index('{') + 1:l.index('}')]
					self._pre_process_mappings[_PRE_PROCESS_STYLE] = style_file_path
					break

			if style_file_path is not None:
				self.pre_process_needed = True
				self.files_from_domain_needed.append(style_file_path)
				#contents = ufo.file_get_contents_as_string(style_file_path)
				#print('GET THIS PATH {' + style_file_path + '}')
				#print(domain.flag_does_exist(DOMAIN_FLAG_CSS_FILES_THAT_UPDATED))

			self._pre_process_parsed = True

	def generate_processed_version(self, output_path: str) -> None:
		"""Generates this HTML file with pre-processes."""
		style_path = self._pre_process_mappings[_PRE_PROCESS_STYLE]
		if style_path is not None:
			style_content = ufo.file_get_contents_as_string(style_path)

			new_content = []

			content = self.content
			for l in content:
				if _PRE_PROCESS_STYLE in l:
					start = l.index('{') - len(' id="#pre-process-replace-style')
					end   = l.index('}') + 3

					replace = l[:start] + '>' + style_content + l[end:]

					new_content.append(replace)
				else:
					new_content.append(l)

			text = ''.join(new_content)
			ufo.file_op_create_or_override(output_path, text)

	def minify(self, output_path: str, alternate_input_path: str=None) -> None:
		"""Minifies this HTML file to the provided output path."""
		if alternate_input_path is not None:
			content = ufo.file_get_contents_as_string(alternate_input_path)
		else:
			content = ufo.file_get_contents_as_string(self.full_path)

		minified_content = htmlmin.minify(
			content,
			remove_comments=True,
			remove_empty_space=True,
			remove_all_empty_space=True,
			reduce_empty_attributes=True,
			reduce_boolean_attributes=True,
			remove_optional_attribute_quotes=True,
			convert_charrefs=True,
			keep_pre=False
		)
		ufo.file_op_create_or_override(output_path, minified_content)

