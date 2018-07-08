# coding=utf-8

"""This module, asset_file.py, provides an abstraction to asset files."""


#from code_api.code_abstraction.code_chunk import CodeChunk
from libraries.universal_code import useful_file_operations as ufo


from libraries.code_api.source_file_abstraction.code_files.code_file import *
from libraries.code_api.source_file_abstraction.code_files.reducable.compressable import Compressable


class AssetFile(CodeFile):
	"""Represents a single asset file."""

	def __init__(self, file_type, file_name, file_extensions=None):
		super().__init__(file_type, file_name, file_extensions)


class PNGFile(AssetFile, Compressable):
	"""Represents a single PNG asset file."""

	def __init__(self, file_name, file_extensions=None):
		AssetFile.__init__(self, CODE_FILE_TYPE_ASSET_PNG, file_name, file_extensions)
		Compressable.__init__(self)


class JPGFile(AssetFile, Compressable):
	"""Represents a single JPG asset file."""

	def __init__(self, file_name, file_extensions=None):
		AssetFile.__init__(self, CODE_FILE_TYPE_ASSET_JPG, file_name, file_extensions)
		Compressable.__init__(self)


class ShaderFile(LoadedCodeFile):
	"""Represents a single shader file."""

	def get_shader_as_javascript_string(self):
		"""Returns the contents of this shader as a javascript string."""
		c = self.contents
		s = '\''
		for l in c:
			s += l.replace('    ', '\\t').replace('\n', '\\n')
		s += '\';'
		return s


class ShaderVertexFile(ShaderFile):
	"""Represents a single vertex shader file."""

	def __init__(self, file_name, file_extensions=None):
		super().__init__(CODE_FILE_TYPE_SHADER_VERTEX, file_name, file_extensions)


class ShaderFragmentFile(ShaderFile):
	"""Represents a single vertex shader file."""

	def __init__(self, file_name, file_extensions=None):
		super().__init__(CODE_FILE_TYPE_SHADER_FRAGMENT, file_name, file_extensions)
